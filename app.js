/* Follo G13 – lag-app. Én fil, ingen byggesteg.
   Data: Supabase (når config.js er fylt ut) eller DEMO (oppdiktede data i minnet). */
(() => {
"use strict";
const C = window.CONTENT, CFG = window.APP_CONFIG || {};
const DEMO = !CFG.SUPABASE_URL || !CFG.SUPABASE_ANON_KEY;

/* ---------------- hjelpere ---------------- */
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const pad = n => String(n).padStart(2, "0");
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const today = () => iso(new Date());
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
const DAYS = ["SØN", "MAN", "TIR", "ONS", "TOR", "FRE", "LØR"];
const dayLong = s => parse(s).toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" });
const dShort = s => parse(s).toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
const hm = t => (t || "").slice(0, 5);
const week = s => { const d = parse(s); const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const dn = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - dn); const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return Math.ceil(((t - y0) / 864e5 + 1) / 7); };
const monday = s => { const d = parse(s); const dn = d.getDay() || 7; d.setDate(d.getDate() - dn + 1); return iso(d); };
const kindLabel = { trening: "Trening", kamp: "Kamp", glede: "Glede og konkurranse", annet: "Annet" };
const ytId = u => { const m = String(u || "").match(/(?:youtu\.be\/|v=|shorts\/)([\w-]{11})/); return m && m[1]; };
const host = u => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };
const ask = t => DEMO ? true : confirm(t);
const msg = (el, text, kind = "err") => { el.innerHTML = text ? `<div class="msg ${kind}">${esc(text)}</div>` : ""; };

/* ---------------- vekstsoner (FKH) ----------------
   Rød: > 2 cm siste måned. Gul: snitt > 0,6 cm/mnd siste 3 mnd eller > 1 cm siste måned.
   Står i sona minst 3 måneder etter siste flagg. */
function growth(hs) {
  const s = [...hs].sort((a, b) => a.measured_on.localeCompare(b.measured_on));
  const M = 30.44 * 864e5, t = x => parse(x.measured_on).getTime();
  const res = { zone: "ukjent", last: null, avg: null, latest: s[s.length - 1] || null, stale: false };
  if (res.latest) res.stale = (Date.now() - t(res.latest)) / 864e5 > 35;
  if (s.length < 2) return res;
  const flags = [];
  for (let i = 1; i < s.length; i++) {
    const last = (s[i].cm - s[i - 1].cm) / Math.max(0.5, (t(s[i]) - t(s[i - 1])) / M);
    let j = 0; for (let k = i - 1; k >= 0; k--) { if (t(s[i]) - t(s[k]) >= 2.5 * M) { j = k; break; } }
    const avg = (s[i].cm - s[j].cm) / Math.max(0.5, (t(s[i]) - t(s[j])) / M);
    const z = last > 2 ? "r" : (avg > 0.6 || last > 1) ? "y" : "g";
    flags.push({ at: t(s[i]), z, last, avg });
  }
  const f = flags[flags.length - 1]; res.last = f.last; res.avg = f.avg;
  const recent = flags.filter(x => Date.now() - x.at <= 3 * M);
  res.zone = recent.some(x => x.z === "r") ? "r" : recent.some(x => x.z === "y") ? "y" : f.z;
  return res;
}
const ZONE = { g: ["g", "Grønn"], y: ["y", "Gul"], r: ["r", "Rød"], ukjent: ["x", "For få målinger"] };
const zonePill = z => `<span class="pill ${ZONE[z][0]}">${ZONE[z][1]}</span>`;
const TILTAK = {
  r: "Ca. 50 % belastning. Ut av spilldelen én gang mer i uka enn gul, alternativ plan (styrke, rolig utholdenhet, mobilitet). Kamp bare uten smerter, med redusert spilletid.",
  y: "Ca. 75 % belastning. Mindre hopp og løpsintensitet. Ut før spilldelen et par økter i uka. Alternativ trening uten støt ved behov.",
  g: "Normal trening. Følg med på smerter og totalbelastning (skole, annen idrett).",
};

/* =================================================================
   DATALAG
   ================================================================= */
let api;

/* ---------- Supabase ---------- */
function supaApi() {
  const sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
  const email = u => `${u.toLowerCase()}@${CFG.EMAIL_DOMAIN || "brukere.follo-g13.invalid"}`;
  const ok = ({ data, error }) => { if (error) throw new Error(error.message); return data; };
  return {
    async me() {
      const { data: { session } } = await sb.auth.getSession();
      if (!session) return null;
      const p = ok(await sb.from("profiles").select("*").eq("id", session.user.id).maybeSingle());
      return p;
    },
    async login(u, pw) {
      const { error } = await sb.auth.signInWithPassword({ email: email(u), password: pw });
      if (error) throw new Error("Feil brukernavn eller passord.");
    },
    async signup(code, u, pw) {
      const { error } = await sb.rpc("register_with_code", { p_code: code.trim(), p_username: u, p_password: pw });
      if (error) throw new Error(error.message);
      await this.login(u, pw);
    },
    async resetPw(u, code, pw) { ok(await sb.rpc("reset_password_with_code", { u, c: code.trim(), new_password: pw })); },
    async changePw(pw) { const { error } = await sb.auth.updateUser({ password: pw }); if (error) throw new Error(error.message); },
    async logout() { await sb.auth.signOut(); },
    players: async () => ok(await sb.from("players").select("*").order("name")),
    addPlayer: async p => ok(await sb.from("players").insert(p).select().single()),
    updatePlayer: async (id, p) => ok(await sb.from("players").update(p).eq("id", id)),
    profiles: async () => ok(await sb.from("profiles").select("*").order("name")),
    periods: async () => ok(await sb.from("periods").select("*").order("start_date")),
    async sessions(from, to) {
      let q = sb.from("sessions").select("*, session_players(player_id)").order("date").order("start_time");
      if (from) q = q.gte("date", from); if (to) q = q.lte("date", to);
      return ok(await q).map(s => ({ ...s, players: (s.session_players || []).map(x => x.player_id) }));
    },
    async addSession(s, ids) {
      const row = ok(await sb.from("sessions").insert(s).select().single());
      if (!s.for_all && ids.length) ok(await sb.from("session_players").insert(ids.map(player_id => ({ session_id: row.id, player_id }))));
      return row;
    },
    updateSession: async (id, p) => ok(await sb.from("sessions").update(p).eq("id", id)),
    deleteSession: async id => ok(await sb.from("sessions").delete().eq("id", id)),
    posts: async () => ok(await sb.from("posts").select("*").order("created_at", { ascending: false }).limit(30)),
    addPost: async p => ok(await sb.from("posts").insert(p)),
    deletePost: async id => ok(await sb.from("posts").delete().eq("id", id)),
    goals: async pid => ok(await sb.from("goals").select("*").eq("player_id", pid).order("created_at", { ascending: false })),
    addGoal: async g => ok(await sb.from("goals").insert(g)),
    updateGoal: async (id, p) => ok(await sb.from("goals").update(p).eq("id", id)),
    logs: async pid => { let q = sb.from("logs").select("*").order("created_at", { ascending: false }).limit(200); if (pid) q = q.eq("player_id", pid); return ok(await q); },
    saveLog: async l => ok(await sb.from("logs").upsert(l, { onConflict: "session_id,player_id" })),
    heights: async pid => { let q = sb.from("heights").select("*").order("measured_on"); if (pid) q = q.eq("player_id", pid); return ok(await q); },
    addHeight: async h => ok(await sb.from("heights").upsert(h, { onConflict: "player_id,measured_on" })),
    makeCode: async (kind, role, name, player, profile) => ok(await sb.rpc("make_code", { p_kind: kind, p_role: role, p_name: name, p_player: player, p_profile: profile })),
    codes: async () => ok(await sb.from("invite_codes").select("*").is("used_at", null).gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false })),
  };
}

/* ---------- DEMO ---------- */
function demoApi() {
  const uid = () => Math.random().toString(36).slice(2, 10);
  const names = [["Ola N.", "Keeper"], ["Jonas B.", "Stopper"], ["Elias K.", "Stopper"], ["Filip H.", "Back"], ["Noah S.", "Back"], ["Lucas M.", "Sekser"], ["Emil T.", "Åtter"], ["Henrik L.", "Åtter"], ["Oskar R.", "Spiss"], ["Aksel D.", "Back"], ["Theo F.", "Åtter"], ["Isak G.", "Keeper"], ["Magnus A.", "Stopper"], ["William J.", "Spiss"]];
  const players = names.map(([name, position], i) => ({ id: "p" + i, name, position, consent: i !== 9, active: true }));
  const t0 = today();
  const heights = [];
  const growthPattern = [0.3, 0.4, 0.5, 0.7, 0.4, 0.2, 2.3, 0.5, 0.4, 0, 0.6, 0.3, 1.2, 0.3];
  players.forEach((p, i) => { if (!p.consent) return; let cm = 152 + i * 1.3; for (let m = 5; m >= 0; m--) { if (i === 5 && m === 0) continue; const d = new Date(); d.setMonth(d.getMonth() - m); d.setDate(Math.min(18, d.getDate())); cm += m === 5 ? 0 : growthPattern[i] * (m <= 1 ? 1.2 : 0.8); heights.push({ id: uid(), player_id: p.id, measured_on: iso(d), cm: Math.round(cm * 10) / 10 }); } });
  const sessions = [];
  const start = monday(t0);
  for (let w = -1; w < 6; w++) {
    const m = addDays(start, w * 7);
    sessions.push({ id: uid(), date: addDays(m, 0), start_time: "17:30", end_time: "19:00", meet_time: "17:15", place: "Kunstgress (eksempel)", kind: "trening", title: "Fellestrening", theme: "Spille oss ut", for_all: true, cancelled: false, players: [] });
    sessions.push({ id: uid(), date: addDays(m, 2), start_time: "17:30", end_time: "19:00", meet_time: "17:15", place: "Kunstgress (eksempel)", kind: "trening", title: "Fellestrening", theme: "Spille oss fremover", for_all: true, cancelled: false, players: [] });
    sessions.push({ id: uid(), date: addDays(m, 4), start_time: "17:30", end_time: "18:45", meet_time: "17:15", place: "Kunstgress (eksempel)", kind: "glede", title: "Glede- og konkurranseøkt", theme: "Konkurranser og avslutninger", for_all: true, cancelled: false, players: [] });
    if (w >= 0) sessions.push({ id: uid(), date: addDays(m, 5), start_time: "12:00", end_time: "13:15", meet_time: "11:15", place: "Bortekamp (eksempel)", kind: "kamp", title: "Kamp mot Eksempel IL", theme: "", for_all: true, cancelled: false, players: [] });
  }
  sessions.push({ id: uid(), date: addDays(start, 3), start_time: "16:00", end_time: "17:00", meet_time: "", place: "Kunstgress (eksempel)", kind: "annet", title: "Keeperøkt", theme: "Keeper som frimann", for_all: false, cancelled: false, players: ["p0", "p11"] });
  const firstPast = sessions.filter(s => s.date < t0 && s.kind !== "kamp").sort((a, b) => b.date.localeCompare(a.date))[0];
  const db = {
    players, heights, sessions,
    periods: [
      ["P1", "Oppstart", "Bli kjent, PULS-workshop, spille oss ut, scanning og fysisk oppstart.", "Spille oss ut", -14, 14],
      ["P2", "Vinne ballen", "Høyt press, gjenpress, balanse og riktig side.", "Vinne ballen", 15, 42],
      ["P3", "Spille oss fremover", "Frimann, tredjemann, progressive pasninger, keeper som frimann.", "Spille oss fremover", 43, 73],
      ["P4", "Eksplosjon", "Siste tredjedel, 1v1, backløp, tilbakelegg og avslutninger.", "Eksplosjon", 74, 112],
      ["P5", "Kampperiode 1", "Alle intensjoner i kamp. Gode feil, ikke dårlige.", "Alle", 113, 154],
    ].map(([id, name, focus, intention, a, b]) => ({ id, name, focus, intention, start_date: addDays(t0, a), end_date: addDays(t0, b) })),
    posts: [
      { id: uid(), title: "Velkommen til lagets app!", url: "", body: "Her finner du økter, spillmodellen vår, PULS og din egen side med mål og logg. Legg appen på hjemskjermen.", question: "Hva gleder du deg mest til i 2027?", created_at: new Date().toISOString() },
      { id: uid(), title: "Ukens tema: Spille oss ut", url: "", body: "Keeperen er alltid med som frimann. Når de presser likt antall, er det keeperen som er ledig.", question: "Hvor står den ledige spilleren når de presser med tre?", created_at: new Date(Date.now() - 864e5 * 2).toISOString() },
    ],
    goals: [
      { id: uid(), player_id: "p4", period_id: "P1", text: "Scanne før jeg får ballen", how: "Se over skulderen to ganger før ballen kommer, særlig når vi spiller oss ut.", status: "aktiv", coach_comment: "Godt mål! Vi ser etter det i Keeperen er sjefen.", created_at: new Date().toISOString() },
      { id: uid(), player_id: "p4", period_id: "P1", text: "Bruke venstrefoten mer", how: "20 pasninger med venstre hver økt.", status: "aktiv", coach_comment: "", created_at: new Date().toISOString() },
    ],
    logs: firstPast ? [
      { id: uid(), session_id: firstPast.id, player_id: "p6", pain: "litt", pain_where: "Hælen", good1: "Mange gode vendinger", good2: "Snakket mye", good3: "", better: "Scanne før mottak", wants_talk: false, created_at: new Date().toISOString() },
      { id: uid(), session_id: firstPast.id, player_id: "p3", pain: "mye", pain_where: "Kneet, under kneskåla", good1: "Bra innsats", good2: "", good3: "", better: "Pasningstempo", wants_talk: true, created_at: new Date().toISOString() },
    ] : [],
    profiles: [
      { id: "u-trener", username: "trener.demo", name: "Vetle", role: "trener", player_id: null },
      { id: "u-spiller", username: "noah.s", name: "Noah S.", role: "spiller", player_id: "p4" },
      { id: "u-forelder", username: "forelder.demo", name: "Mor til Noah", role: "forelder", player_id: "p4" },
    ],
    codes: [],
  };
  let current = null;
  const delay = v => new Promise(r => setTimeout(() => r(structuredClone(v)), 60));
  const vis = s => s.for_all || (current && s.players.includes(current.player_id)) || current?.role === "trener";
  return {
    db, setRole(role) { current = db.profiles.find(p => p.role === role); },
    async me() { return current ? structuredClone(current) : null; },
    async login() { current = db.profiles[0]; },
    async signup() { throw new Error("I demoen kan du ikke lage konto. Bruk knappene øverst for å se appen som trener, spiller eller forelder."); },
    async resetPw() { throw new Error("Ikke tilgjengelig i demoen."); },
    async changePw() { },
    async logout() { current = null; },
    players: () => delay(db.players.slice().sort((a, b) => a.name.localeCompare(b.name))),
    async addPlayer(p) { const r = { id: uid(), active: true, ...p }; db.players.push(r); return r; },
    async updatePlayer(id, p) { Object.assign(db.players.find(x => x.id === id), p); },
    profiles: () => delay(db.profiles),
    periods: () => delay(db.periods),
    sessions: (from, to) => delay(db.sessions.filter(s => vis(s) && (!from || s.date >= from) && (!to || s.date <= to)).sort((a, b) => (a.date + a.start_time).localeCompare(b.date + b.start_time))),
    async addSession(s, ids) { db.sessions.push({ id: uid(), cancelled: false, ...s, players: s.for_all ? [] : ids }); },
    async updateSession(id, p) { Object.assign(db.sessions.find(x => x.id === id), p); },
    async deleteSession(id) { db.sessions = db.sessions.filter(x => x.id !== id); },
    posts: () => delay(db.posts.slice().sort((a, b) => b.created_at.localeCompare(a.created_at))),
    async addPost(p) { db.posts.push({ id: uid(), created_at: new Date().toISOString(), ...p }); },
    async deletePost(id) { db.posts = db.posts.filter(x => x.id !== id); },
    goals: pid => delay(db.goals.filter(g => g.player_id === pid)),
    async addGoal(g) { db.goals.unshift({ id: uid(), status: "aktiv", coach_comment: "", created_at: new Date().toISOString(), ...g }); },
    async updateGoal(id, p) { Object.assign(db.goals.find(x => x.id === id), p); },
    logs: pid => delay(db.logs.filter(l => !pid || l.player_id === pid)),
    async saveLog(l) {
      const pl = db.players.find(p => p.id === l.player_id); if (!pl.consent) throw new Error("Mangler samtykke fra foresatte.");
      const i = db.logs.findIndex(x => x.session_id === l.session_id && x.player_id === l.player_id);
      const row = { id: uid(), created_at: new Date().toISOString(), ...l }; if (i >= 0) db.logs[i] = row; else db.logs.push(row);
    },
    heights: pid => delay(db.heights.filter(h => !pid || h.player_id === pid)),
    async addHeight(h) {
      const pl = db.players.find(p => p.id === h.player_id); if (!pl.consent) throw new Error("Mangler samtykke fra foresatte.");
      db.heights = db.heights.filter(x => !(x.player_id === h.player_id && x.measured_on === h.measured_on)); db.heights.push({ id: uid(), ...h });
    },
    async makeCode(kind, role, name, player, profile) { const k = Math.random().toString(16).slice(2, 12).toUpperCase().padEnd(10, "0"); db.codes.unshift({ code: k, kind, role, name, player_id: player, profile_id: profile, expires_at: new Date(Date.now() + 14 * 864e5).toISOString() }); return k; },
    codes: () => delay(db.codes),
  };
}

/* =================================================================
   UI
   ================================================================= */
let me = null;
const app = $("#app");
const isCoach = () => me?.role === "trener";

function shell(active, inner) {
  const tabs = [["hjem", "⌂", "Hjem"], ["uke", "◷", "Denne uka"], ["kalender", "▦", "Kalender"], isCoach() ? ["trener", "✎", "Trener"] : ["meg", "☺", "Min side"], ["mer", "☰", "Mer"]];
  const demoBar = DEMO ? `<div class="demo"><b>DEMO</b> – oppdiktede spillere, ingenting lagres. Se appen som:
    ${["trener", "spiller", "forelder"].map(r => `<button data-role="${r}" class="${me?.role === r ? "on" : ""}">${r[0].toUpperCase() + r.slice(1)}</button>`).join("")}</div>` : "";
  app.innerHTML = `${demoBar}<header class="top"><a href="#/hjem" class="brandlink"><img src="logo.svg" alt="Follo FK" class="logoimg"><b>FOLLO FK <span>G13</span></b></a><a href="#/meg" class="who" title="Min side">${esc(me.name.split(" ")[0])} ☺</a></header><div class="stripe"></div>
  <main id="main">${inner}</main>
  <nav class="bottom">${tabs.map(([r, i, l]) => `<a href="#/${r}" class="${active === r ? "on" : ""}"><span class="i">${i}</span>${l}</a>`).join("")}</nav>`;
  $$(".demo button").forEach(b => b.onclick = () => { api.setRole(b.dataset.role); route(true); });
  return $("#main");
}

/* ---------- innlogging ---------- */
function authPage(kind) {
  const brand = `<div class="brand"><img src="logo.svg" alt="Follo FK" style="height:84px"><div><h1 style="margin:0">FOLLO FK G13</h1><div class="mute">Lagets side · ${esc(C.motto)}</div></div></div>`;
  const forms = {
    login: `<form id="f"><label>Brukernavn</label><input name="u" autocomplete="username" autocapitalize="none" required>
      <label>Passord</label><input name="p" type="password" autocomplete="current-password" required>
      <div id="m"></div><button class="btn full">LOGG INN</button></form>
      <div class="center"><a href="#/forste-gang">Første gang? Bruk koden fra treneren</a><br><a href="#/glemt" class="small">Glemt passord?</a></div>`,
    first: `<h2>Første gang</h2><p class="mute">Bruk koden du har fått fra treneren, og lag ditt eget brukernavn og passord.</p>
      <form id="f"><label>Kode fra treneren</label><input name="c" autocapitalize="characters" required>
      <label>Velg brukernavn</label><input name="u" autocapitalize="none" pattern="[a-z0-9.\\-]{3,30}" required><div class="hint">3–30 tegn: små bokstaver, tall, punktum eller bindestrek. For eksempel ola.n</div>
      <label>Velg passord</label><input name="p" type="password" minlength="8" autocomplete="new-password" required><div class="hint">Minst 8 tegn.</div>
      <label>Gjenta passord</label><input name="p2" type="password" minlength="8" autocomplete="new-password" required>
      <div id="m"></div><button class="btn full">LAG KONTO</button></form><div class="center"><a href="#/login">Tilbake til innlogging</a></div>`,
    forgot: `<h2>Glemt passord</h2><p class="mute">Be treneren om en passordkode. Den gjelder i 14 dager.</p>
      <form id="f"><label>Brukernavn</label><input name="u" autocapitalize="none" required>
      <label>Passordkode fra treneren</label><input name="c" autocapitalize="characters" required>
      <label>Nytt passord</label><input name="p" type="password" minlength="8" required><label>Gjenta passord</label><input name="p2" type="password" minlength="8" required>
      <div id="m"></div><button class="btn full">LAGRE NYTT PASSORD</button></form><div class="center"><a href="#/login">Tilbake til innlogging</a></div>`,
  };
  const demoNote = DEMO ? `<div class="msg info">Dette er en demo. Trykk <b>Logg inn</b> med hva som helst, eller velg rolle:<div class="seg" style="margin-top:8px">${["trener", "spiller", "forelder"].map(r => `<button data-role="${r}">${r}</button>`).join("")}</div></div>` : "";
  app.innerHTML = `<div class="stripe"></div><div class="auth">${brand}${demoNote}${forms[kind]}<p class="center small mute">Bare for spillere, foreldre og trenere i Follo G13.</p></div>`;
  $$(".auth [data-role]").forEach(b => b.onclick = () => { api.setRole(b.dataset.role); location.hash = "#/hjem"; route(true); });
  const f = $("#f"), m = $("#m");
  f.onsubmit = async e => {
    e.preventDefault(); const v = Object.fromEntries(new FormData(f)); msg(m, "");
    try {
      if (kind !== "login" && v.p !== v.p2) throw new Error("Passordene er ikke like.");
      if (kind === "login") await api.login(v.u.trim(), v.p);
      if (kind === "first") await api.signup(v.c, v.u.trim(), v.p);
      if (kind === "forgot") { await api.resetPw(v.u.trim(), v.c, v.p); msg(m, "Passordet er endret. Logg inn.", "ok"); setTimeout(() => location.hash = "#/login", 1200); return; }
      location.hash = "#/hjem"; route(true);
    } catch (err) { msg(m, err.message); }
  };
}

/* ---------- Hjem ---------- */
async function pageHome(main) {
  const posts = await api.posts();
  const first = esc(me.name.split(" ")[0]);
  main.innerHTML = `<p class="kicker">Follo G13</p><h1>Hei, ${first}!</h1>
  <a href="#/puls" style="text-decoration:none"><div class="puls">${C.puls.map(x => `<div><b>${x.l}</b><span>${x.w}</span></div>`).join("")}</div></a>
  <p class="small mute" style="margin-top:6px">«${esc(C.motto)}»</p>
  ${(() => { const cs = C.concepts.filter(c => c.videos.length); const c = cs[week(today()) % cs.length]; return `<a href="#/begrep/${c.id}" style="text-decoration:none"><div class="card hero"><p class="kicker" style="color:#CDE6F5">Ukens begrep</p><h2 style="margin:0 0 4px">${esc(c.word)}</h2><p style="margin:0">${esc(c.short)}</p><p class="small" style="margin:8px 0 0;color:#CDE6F5">Se videoeksempler ›</p></div></a>`; })()}
  <details><summary>Slik bruker du appen</summary><div>${C.howTo.map(([h, t]) => `<p><b>${h}:</b> ${t}</p>`).join("")}<p class="small mute">Tips: legg appen på hjemskjermen (Del → Legg til på Hjem-skjerm).</p></div></details>
  ${isCoach() ? `<details id="newpost"><summary>+ Del noe nytt med laget</summary><div><form id="pf">
    <label>Overskrift</label><input name="title" required><label>Lenke (YouTube, artikkel …)</label><input name="url" type="url" placeholder="https://">
    <label>Tekst</label><textarea name="body"></textarea><label>Spørsmål til spillerne</label><input name="question" placeholder="Hva hadde du gjort …?">
    <div class="hint">Del lenker til andres videoer – ikke last opp videofilene selv.</div><div id="pm"></div><button class="btn full">DEL</button></form></div></details>` : ""}
  <div id="feed">${posts.map(p => postCard(p)).join("") || `<p class="mute">Ingen innlegg ennå.</p>`}</div>`;
  if (isCoach()) {
    $("#pf").onsubmit = async e => { e.preventDefault(); const v = Object.fromEntries(new FormData(e.target)); try { await api.addPost({ ...v, created_by: DEMO ? null : me.id }); route(true); } catch (err) { msg($("#pm"), err.message); } };
    $$("[data-delpost]").forEach(b => b.onclick = async () => { if (ask("Slette innlegget?")) { await api.deletePost(b.dataset.delpost); route(true); } });
  }
}
function postCard(p) {
  const yt = ytId(p.url);
  return `<div class="card"><div class="row between"><span class="small mute">Trenerne · ${esc(new Date(p.created_at).toLocaleDateString("nb-NO", { day: "numeric", month: "long" }))}${p.url ? " · " + esc(host(p.url)) : ""}</span>
    ${isCoach() ? `<button class="btn ghost small" data-delpost="${p.id}">Slett</button>` : ""}</div>
    <h3 style="margin-top:6px">${esc(p.title)}</h3>
    ${yt ? `<a href="${esc(p.url)}" target="_blank" rel="noopener"><img src="https://i.ytimg.com/vi/${yt}/hqdefault.jpg" alt="" style="width:100%;border-radius:12px;margin:6px 0"></a>` : ""}
    ${p.body ? `<p>${esc(p.body)}</p>` : ""}${p.question ? `<div class="msg info"><b>Spørsmål:</b> ${esc(p.question)}</div>` : ""}
    ${p.url ? `<a class="btn ghost small" href="${esc(p.url)}" target="_blank" rel="noopener">Åpne ›</a>` : ""}</div>`;
}

/* ---------- Denne uka ---------- */
async function pageWeek(main) {
  const [ss, periods] = await Promise.all([api.sessions(today(), addDays(today(), 60)), api.periods()]);
  const active = ss.filter(s => !s.cancelled);
  const next = active[0];
  const wk = next ? monday(next.date) : monday(today());
  const inWeek = ss.filter(s => monday(s.date) === wk);
  const per = periods.find(p => today() >= p.start_date && today() <= p.end_date);
  const match = active.find(s => s.kind === "kamp");
  main.innerHTML = `<p class="kicker">Uke ${week(wk)} · ${dShort(wk)}–${dShort(addDays(wk, 6))}</p><h1>Denne uka</h1>
  ${per ? `<div class="card"><span class="pill">${esc(per.id)} · ${dShort(per.start_date)}–${dShort(per.end_date)}</span><h3 style="margin-top:8px">${esc(per.name)}</h3><p class="mute" style="margin:0">${esc(per.focus)}</p></div>` : ""}
  ${next ? `<div class="card hero"><p class="kicker" style="color:#C9D6EA">Neste</p><h2 style="margin:0">${esc(next.title)}</h2>
    <p style="margin:4px 0 12px;text-transform:capitalize">${dayLong(next.date)} · ${hm(next.start_time)}–${hm(next.end_time)}</p>
    <div class="grid2"><div><div class="small mute">OPPMØTE</div><b>${hm(next.meet_time) || "–"}</b></div><div><div class="small mute">STED</div><b>${esc(next.place || "–")}</b></div></div>
    ${next.theme ? `<p style="margin:12px 0 0"><span class="pill">${esc(next.theme)}</span></p>` : ""}${next.note ? `<p class="small" style="margin-top:8px">${esc(next.note)}</p>` : ""}</div>` : `<div class="card"><p class="mute">Ingen økter lagt inn.</p></div>`}
  <h2>Resten av uka</h2><div class="card list">${inWeek.filter(s => s !== next).map(sessionItem).join("") || `<p class="mute">Ingenting mer denne uka.</p>`}</div>
  <h2>Neste kamp</h2><div class="card">${match ? `<b>${esc(match.title)}</b><div class="mute" style="text-transform:capitalize">${dayLong(match.date)} · oppmøte ${hm(match.meet_time) || "–"} · ${esc(match.place || "")}</div>` : `<span class="mute">Ingen kamper lagt inn ennå.</span>`}</div>`;
}
function sessionItem(s) {
  const d = parse(s.date);
  return `<div class="item ${s.cancelled ? "cancel" : ""}" ${isCoach() ? `data-edit="${s.id}" style="cursor:pointer"` : ""}><div class="date">${DAYS[d.getDay()]}<small>${pad(d.getDate())}.${pad(d.getMonth() + 1)}</small></div>
    <div style="flex:1"><b>${esc(s.title)}</b>${s.cancelled ? ' <span class="pill r">Avlyst</span>' : ""}${s.kind === "glede" ? ' <span class="pill g">Glede</span>' : ""}${s.kind === "kamp" ? ' <span class="pill y">Kamp</span>' : ""}${!s.for_all ? ' <span class="pill x">Utvalgte</span>' : ""}
    <div class="small mute">${hm(s.start_time)}–${hm(s.end_time)} · ${esc(s.place || "")}${s.theme ? " · " + esc(s.theme) : ""}</div></div></div>`;
}

/* ---------- Kalender ---------- */
async function pageCalendar(main) {
  const [ss, periods, players] = await Promise.all([api.sessions(addDays(today(), -7), addDays(today(), 120)), api.periods(), isCoach() ? api.players() : []]);
  const per = periods.find(p => today() >= p.start_date && today() <= p.end_date) || periods[0];
  const byWeek = {}; ss.forEach(s => (byWeek[monday(s.date)] ||= []).push(s));
  const intentions = C.model.intentions.map(i => i.name).concat(["Konkurranser og avslutninger", "Keeper som frimann"]);
  main.innerHTML = `<h1>Kalender</h1><p class="mute">Treninger, kamper og periodene i årshjulet.</p>
  ${isCoach() ? `<details><summary>+ Ny økt eller kamp</summary><div><form id="sf">
    <div class="grid2"><div><label>Dato</label><input type="date" name="date" required value="${today()}"></div><div><label>Type</label><select name="kind">${Object.entries(kindLabel).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select></div></div>
    <label>Tittel</label><input name="title" value="Fellestrening" required>
    <div class="grid2"><div><label>Start</label><input type="time" name="start_time" value="17:30"></div><div><label>Slutt</label><input type="time" name="end_time" value="19:00"></div></div>
    <div class="grid2"><div><label>Oppmøte</label><input type="time" name="meet_time" value="17:15"></div><div><label>Sted</label><input name="place"></div></div>
    <label>Tema / lagsintensjon</label><input name="theme" list="themes"><datalist id="themes">${intentions.map(t => `<option value="${esc(t)}">`).join("")}</datalist>
    <label>Beskjed</label><input name="note">
    <label>Hvem</label><div class="seg" id="who"><button type="button" class="on" data-v="all">Hele laget</button><button type="button" data-v="some">Enkeltspillere</button></div>
    <div id="pick" style="display:none;margin-top:8px">${players.map(p => `<label style="font-weight:400;display:flex;gap:8px;align-items:center;margin:4px 0"><input type="checkbox" value="${p.id}" style="width:auto"> ${esc(p.name)}</label>`).join("")}</div>
    <label style="font-weight:400;display:flex;gap:8px;align-items:center"><input type="checkbox" name="repeat" style="width:auto"> Gjenta hver uke i 8 uker</label>
    <div id="sm"></div><button class="btn full">LAGRE</button></form></div></details>` : ""}
  <h2>Årshjulet</h2><div class="row" style="overflow-x:auto;gap:6px;padding-bottom:6px">${periods.map(p => `<button class="btn small ${p.id === per?.id ? "" : "ghost"}" data-per="${p.id}" style="white-space:nowrap">${esc(p.id)}<br><span style="font-weight:400;font-size:11px">${parse(p.start_date).toLocaleDateString("nb-NO", { month: "short" })}</span></button>`).join("")}</div>
  <div class="card" id="perbox"></div>
  ${Object.keys(byWeek).sort().map(w => `<h2>Uke ${week(w)} <span class="small mute" style="font-weight:400">${dShort(w)}–${dShort(addDays(w, 6))}</span></h2><div class="card list">${byWeek[w].map(sessionItem).join("")}</div>`).join("") || `<p class="mute">Ingen økter.</p>`}`;
  const showPer = id => { const p = periods.find(x => x.id === id); if (!p) return; $("#perbox").innerHTML = `<span class="pill">${esc(p.id)} · ${dShort(p.start_date)}–${dShort(p.end_date)}</span><h3 style="margin-top:8px">${esc(p.name)}</h3><p class="mute" style="margin:0">${esc(p.focus || "")}</p>${p.intention ? `<p class="small" style="margin:6px 0 0">Lagsintensjon: <b>${esc(p.intention)}</b></p>` : ""}`; $$("[data-per]").forEach(b => b.classList.toggle("ghost", b.dataset.per !== id)); };
  if (per) showPer(per.id);
  $$("[data-per]").forEach(b => b.onclick = () => showPer(b.dataset.per));
  if (!isCoach()) return;
  let who = "all";
  $$("#who button").forEach(b => b.onclick = () => { who = b.dataset.v; $$("#who button").forEach(x => x.classList.toggle("on", x === b)); $("#pick").style.display = who === "some" ? "block" : "none"; });
  $("#sf").onsubmit = async e => {
    e.preventDefault(); const v = Object.fromEntries(new FormData(e.target)); const ids = $$("#pick input:checked").map(i => i.value);
    const base = { date: v.date, kind: v.kind, title: v.title, start_time: v.start_time || null, end_time: v.end_time || null, meet_time: v.meet_time || null, place: v.place, theme: v.theme, note: v.note, for_all: who === "all" };
    try { if (!base.for_all && !ids.length) throw new Error("Velg minst én spiller.");
      const n = v.repeat ? 8 : 1; for (let i = 0; i < n; i++) await api.addSession({ ...base, date: addDays(v.date, 7 * i) }, ids);
      route(true); } catch (err) { msg($("#sm"), err.message); }
  };
  $$("[data-edit]").forEach(el => el.onclick = () => editSession(ss.find(s => s.id === el.dataset.edit)));
}
function editSession(s) {
  const main = $("#main");
  main.innerHTML = `<a href="#/kalender">‹ Kalender</a><h1>${esc(s.title)}</h1><p class="mute" style="text-transform:capitalize">${dayLong(s.date)}</p>
  <form id="ef" class="card"><label>Tittel</label><input name="title" value="${esc(s.title)}">
  <div class="grid2"><div><label>Dato</label><input type="date" name="date" value="${s.date}"></div><div><label>Oppmøte</label><input type="time" name="meet_time" value="${hm(s.meet_time)}"></div></div>
  <div class="grid2"><div><label>Start</label><input type="time" name="start_time" value="${hm(s.start_time)}"></div><div><label>Slutt</label><input type="time" name="end_time" value="${hm(s.end_time)}"></div></div>
  <label>Sted</label><input name="place" value="${esc(s.place || "")}"><label>Tema</label><input name="theme" value="${esc(s.theme || "")}"><label>Beskjed</label><input name="note" value="${esc(s.note || "")}">
  <div id="em"></div><button class="btn full">LAGRE ENDRINGER</button></form>
  <div class="row"><button class="btn ghost" id="cx">${s.cancelled ? "Gjenopprett økta" : "Avlys økta"}</button><button class="btn danger" id="del">Slett</button></div>`;
  $("#ef").onsubmit = async e => { e.preventDefault(); const v = Object.fromEntries(new FormData(e.target)); for (const k of ["meet_time", "start_time", "end_time"]) v[k] = v[k] || null; try { await api.updateSession(s.id, v); location.hash = "#/kalender"; } catch (err) { msg($("#em"), err.message); } };
  $("#cx").onclick = async () => { await api.updateSession(s.id, { cancelled: !s.cancelled }); location.hash = "#/kalender"; route(true); };
  $("#del").onclick = async () => { if (ask("Slette økta for godt?")) { await api.deleteSession(s.id); location.hash = "#/kalender"; route(true); } };
}

/* ---------- Mer + innholdssider ---------- */
function pageMore(main) {
  const items = [["begreper", "Vårt fotballspråk", "Begrepene vi bruker – med videoeksempler fra proffene."], ["spillmodell", "Spillmodell", "Hvordan vi spiller med og uten ball."], ["opptreden", "Slik opptrer vi", "På trening, mot hverandre, når det går galt og på kamp."], ["slik-trener-vi", "Slik trener vi", "Hvorfor vi spiller mest, og hva gode feil er."], ["puls", "PULS", "Klubbens verdier – og hva de betyr for oss."], ["egentrening", "Egentrening", "Ball, sprint og styrke du kan gjøre selv."], ["foreldre", "For foreldre", "Vekst og modning, samtykke og personvern."], ["meg", "Min side", "Mål, logg, høyde, passord og logg ut."]];
  main.innerHTML = `<h1>Mer</h1>${items.map(([r, h, t]) => `<a href="#/${r}" style="text-decoration:none;color:inherit"><div class="card row between"><div><h3>${h}</h3><div class="mute small">${t}</div></div><b>›</b></div></a>`).join("")}`;
}
function pageModel(main) {
  const M = C.model;
  main.innerHTML = `<a href="#/mer">‹ Mer</a><h1>Spillmodell</h1><p>${esc(M.intro)}</p>
  <div class="seg" id="shape">${Object.entries(M.shapes).map(([k, v], i) => `<button class="${i ? "" : "on"}" data-s="${k}">${v.label}</button>`).join("")}</div>
  <div class="pitch" id="pitch" style="margin-top:10px"><div class="half"></div><div class="box"></div>${M.shapes["4-3-1"].pos.map((p, i) => `<div class="p ${p[0] === "K" ? "k" : ""}" data-i="${i}" style="left:${p[1]}%;top:${p[2]}%">${p[0]}</div>`).join("")}</div>
  <p class="small mute" style="text-align:center;margin-top:6px">Backene (2 og 5) spiller både back og kant. Formasjon er mindre viktig enn prinsippene.</p>
  <h2>Lagsintensjoner</h2>${M.intentions.map(i => `<details><summary>${esc(i.name)} <span class="pill ${i.phase === "Uten ball" ? "y" : ""}" style="margin-left:6px">${i.phase}</span></summary><div><p>${esc(i.text)}</p><ul class="clean">${i.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>${(i.videos || []).length ? `<div class="vgrid" style="margin-top:10px">${i.videos.map(videoCard).join("")}</div>` : ""}</div></details>`).join("")}
  <h2>Balanse</h2><div class="card">${esc(M.balance)}</div>
  <h2>Gode og dårlige feil</h2><div class="grid2"><div class="card" style="background:var(--green-l)"><h3 style="color:var(--green)">God feil</h3><ul class="clean small">${M.errors.good.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div><div class="card" style="background:var(--red-l)"><h3 style="color:var(--red)">Dårlig feil</h3><ul class="clean small">${M.errors.bad.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div></div>
  <h2>Vårt fotballspråk</h2><div class="chips">${C.concepts.map(c => `<a class="chip" href="#/begrep/${c.id}">${esc(c.word)}</a>`).join("")}</div>
  <h2>Slik scanner du</h2><div class="card"><ol style="margin:0;padding-left:18px">${M.scan.map(x => `<li>${esc(x)}</li>`).join("")}</ol></div>`;
  $$("#shape button").forEach(b => b.onclick = () => { $$("#shape button").forEach(x => x.classList.toggle("on", x === b)); const pos = M.shapes[b.dataset.s].pos; $$("#pitch .p").forEach((el, i) => { el.style.left = pos[i][1] + "%"; el.style.top = pos[i][2] + "%"; el.textContent = pos[i][0]; }); });
}
function pagePuls(main) {
  const team = C.pulsTeam;
  main.innerHTML = `<a href="#/mer">‹ Mer</a><h1>PULS</h1><p>PULS er verdiene til Follo FK. Hva bokstavene betyr for oss, bestemmer vi sammen.</p>
  ${C.puls.map(x => `<div class="card"><div class="row"><div class="date" style="font-size:26px;min-width:56px">${x.l}</div><div><h3>${x.w}</h3><div class="small mute">Klubben: ${x.club.map(esc).join(" · ")}</div></div></div>
  <p class="small" style="margin:10px 0 0"><b>For oss betyr det:</b> ${team[x.l]?.length ? team[x.l].map(esc).join(" · ") : '<span class="mute">Bestemmes på PULS-workshopen i januar.</span>'}</p></div>`).join("")}
  <p class="center mute">«${esc(C.motto)}»</p>`;
}
function pageTraining(main) {
  main.innerHTML = `<a href="#/mer">‹ Mer</a><h1>Egentrening</h1><p class="mute">Opplegg du kan gjøre alene eller med en makker. Har treneren sagt at du er i gul eller rød sone, gjør du mindre – se teksten under hvert program.</p>
  ${C.training.map(g => `<h2>${esc(g.group)}</h2>${g.items.map(it => `<details><summary>${esc(it.name)}<div class="small mute" style="font-weight:400">${esc(it.meta)}</div></summary><div><p>${esc(it.why)}</p><ol style="margin:0;padding-left:18px">${it.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol></div></details>`).join("")}`).join("")}`;
}
function pageParents(main) {
  main.innerHTML = `<a href="#/mer">‹ Mer</a><h1>For foreldre</h1>${C.parents.map(x => `<div class="card"><h3>${esc(x.h)}</h3><p style="margin:0">${esc(x.p)}</p></div>`).join("")}`;
}


/* ---------- Vårt fotballspråk ---------- */
function videoCard(v) {
  const id = ytId(v.u);
  return `<a class="video" href="${esc(v.u)}" target="_blank" rel="noopener">${id ? `<img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy"><span class="play">▶</span>` : `<div class="noimg">${esc(host(v.u))}</div>`}<span class="vt">${esc(v.t)}</span></a>`;
}
function pageConcepts(main) {
  const groups = ["Med ball", "Uten ball", "Holdning"];
  main.innerHTML = `<a href="#/mer">‹ Mer</a><h1 style="margin-top:8px">Vårt fotballspråk</h1><p class="mute">Ordene vi bruker på trening og kamp. Trykk på et ord for forklaring og videoeksempler fra proffene.</p>
  ${groups.map(g => `<h2>${g}</h2><div class="cgrid">${C.concepts.filter(c => c.tag === g).map(c => `<a class="ccard" href="#/begrep/${c.id}"><b>${esc(c.word)}</b><span>${esc(c.short)}</span>${c.videos.length ? `<em>▶ ${c.videos.length} video${c.videos.length > 1 ? "er" : ""}</em>` : ""}</a>`).join("")}</div>`).join("")}`;
}
function pageConcept(main, id) {
  const c = C.concepts.find(x => x.id === id); if (!c) { location.hash = "#/begreper"; return; }
  main.innerHTML = `<a href="#/begreper">‹ Vårt fotballspråk</a><p class="kicker" style="margin-top:10px">${esc(c.tag)}</p><h1>${esc(c.word)}</h1>
  <div class="card"><p style="font-size:17px;margin:0"><b>${esc(c.short)}</b></p></div>
  <div class="card"><h3>Hvorfor?</h3><p style="margin:0">${esc(c.why)}</p></div>
  ${c.svg ? `<div class="card" style="padding:8px"><div class="diagram">${c.svg}</div></div>` : ""}
  ${c.videos.length ? `<h2>Se på proffene</h2><div class="vgrid">${c.videos.map(videoCard).join("")}</div>` : ""}
  ${c.look.length ? `<h2>Se etter dette</h2><div class="card"><ul class="clean">${c.look.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>` : ""}
  ${c.ask ? `<div class="msg info"><b>Spørsmål til deg:</b> ${esc(c.ask)}</div>` : ""}
  <p class="small mute">Videoene ligger på YouTube eller andre nettsider og åpnes der.</p>`;
}
function pageConduct(main) {
  main.innerHTML = `<a href="#/mer">‹ Mer</a><h1 style="margin-top:8px">Slik opptrer vi</h1><p class="mute">Slik er vi mot hverandre – på trening, på kamp og når det går galt.</p>
  ${C.conduct.map(g => `<div class="card"><h3>${esc(g.h)}</h3><ul class="clean">${g.items.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}
  <a href="#/puls" style="text-decoration:none"><div class="puls" style="margin-top:6px">${C.puls.map(x => `<div><b>${x.l}</b><span>${x.w}</span></div>`).join("")}</div></a>`;
}
function pageMethod(main) {
  main.innerHTML = `<a href="#/mer">‹ Mer</a><h1 style="margin-top:8px">Slik trener vi</h1><p class="mute">Hvorfor øktene ser ut som de gjør.</p>
  ${C.method.map((m, i) => `<div class="card row" style="align-items:flex-start"><div class="num">${i + 1}</div><div><h3>${esc(m.h)}</h3><p style="margin:0">${esc(m.p)}</p>${m.url ? `<a class="btn ghost small" style="margin-top:8px" href="${esc(m.url)}" target="_blank" rel="noopener">Åpne ›</a>` : ""}</div></div>`).join("")}`;
}

/* ---------- Min side ---------- */
async function pageMe(main) {
  let html = `<p class="kicker">${esc(me.role)}</p><h1>${esc(me.name)}</h1><p class="mute">Brukernavn: ${esc(me.username)}</p>`;
  let player = null;
  if (me.player_id) player = (await api.players()).find(p => p.id === me.player_id);
  if (me.role === "spiller" || me.role === "forelder") {
    const [goals, periods, hs, ss, logs] = await Promise.all([api.goals(me.player_id), api.periods(), api.heights(me.player_id), api.sessions(addDays(today(), -14), today()), me.role === "spiller" ? api.logs(me.player_id) : []]);
    const per = periods.find(p => today() >= p.start_date && today() <= p.end_date);
    html += `<h2>${me.role === "spiller" ? "Mine mål" : "Målene til " + esc(player?.name || "barnet")}</h2>
    ${per ? `<div class="card"><span class="pill">${esc(per.id)} · ${esc(per.name)}</span><p class="small mute" style="margin:6px 0 0">Periodens fokus: ${esc(per.focus)}</p></div>` : ""}
    ${goals.map(g => `<div class="card"><div class="row between"><h3>${esc(g.text)}</h3><span class="pill ${g.status === "nådd" ? "g" : g.status === "pause" ? "x" : ""}">${esc(g.status)}</span></div>${g.how ? `<p class="small"><b>Slik:</b> ${esc(g.how)}</p>` : ""}${g.coach_comment ? `<div class="msg info"><b>Trener:</b> ${esc(g.coach_comment)}</div>` : ""}
      ${me.role === "spiller" ? `<div class="seg">${["aktiv", "nådd", "pause"].map(s => `<button data-goal="${g.id}" data-st="${s}" class="${g.status === s ? "on" : ""}">${s}</button>`).join("")}</div>` : ""}</div>`).join("") || `<p class="mute">Ingen mål ennå.</p>`}
    ${me.role === "spiller" ? `<details><summary>+ Nytt mål</summary><div><form id="gf"><label>Hva vil du bli bedre på?</label><input name="text" required placeholder="F.eks. scanne før jeg får ballen"><label>Slik gjør jeg det</label><textarea name="how" placeholder="Hva skal du gjøre, og hvor ofte?"></textarea><div id="gm"></div><button class="btn full">LAGRE MÅL</button></form></div></details>` : ""}`;
    if (me.role === "spiller") {
      const past = ss.filter(s => s.date <= today() && !s.cancelled && s.kind !== "kamp").reverse();
      html += `<h2>Mine økter</h2><div class="card list">${past.map(s => { const l = logs.find(x => x.session_id === s.id); const d = parse(s.date);
        return `<div class="item"><div class="date">${DAYS[d.getDay()]}<small>${pad(d.getDate())}.${pad(d.getMonth() + 1)}</small></div><div style="flex:1"><b>${esc(s.title)}</b><div class="small mute">${l ? "Logget" : "Ikke logget"}</div></div><a class="btn ${l ? "ghost" : ""} small" href="#/logg/${s.id}">${l ? "Endre" : "Logg"}</a></div>`; }).join("") || `<p class="mute">Ingen økter de siste 14 dagene.</p>`}</div>`;
    }
    html += heightBlock(player, hs);
  }
  html += `<h2>Bytt passord</h2><form id="pw" class="card"><label>Nytt passord</label><input type="password" name="p" minlength="8" required><div class="hint">Minst 8 tegn.</div><label>Gjenta passord</label><input type="password" name="p2" minlength="8" required><div id="pwm"></div><button class="btn full">LAGRE PASSORD</button></form>
  <button class="btn ghost full" id="out">LOGG UT</button>`;
  main.innerHTML = html;
  $$("[data-goal]").forEach(b => b.onclick = async () => { await api.updateGoal(b.dataset.goal, { status: b.dataset.st }); route(true); });
  if ($("#gf")) $("#gf").onsubmit = async e => { e.preventDefault(); const v = Object.fromEntries(new FormData(e.target)); const per = (await api.periods()).find(p => today() >= p.start_date && today() <= p.end_date); try { await api.addGoal({ ...v, player_id: me.player_id, period_id: per?.id || null }); route(true); } catch (err) { msg($("#gm"), err.message); } };
  bindHeight(player);
  $("#pw").onsubmit = async e => { e.preventDefault(); const v = Object.fromEntries(new FormData(e.target)); try { if (v.p !== v.p2) throw new Error("Passordene er ikke like."); await api.changePw(v.p); msg($("#pwm"), "Passordet er lagret.", "ok"); e.target.reset(); } catch (err) { msg($("#pwm"), err.message); } };
  $("#out").onclick = async () => { await api.logout(); me = null; location.hash = "#/login"; route(true); };
}
function heightBlock(player, hs) {
  if (!player) return "";
  if (!player.consent) return `<h2>Høyde</h2><div class="card"><p class="mute" style="margin:0">Vi har ikke samtykke fra foresatte ennå, så høyde lagres ikke. Se «For foreldre» under Mer.</p></div>`;
  const s = [...hs].sort((a, b) => b.measured_on.localeCompare(a.measured_on));
  const due = !s[0] || (Date.now() - parse(s[0].measured_on)) / 864e5 > 28;
  return `<h2>Høyde</h2><div class="card">${s[0] ? `<div class="row between"><b style="font-size:24px">${String(s[0].cm).replace(".", ",")} cm</b>${due ? '<span class="pill y">Tid for måling</span>' : ""}</div>
    <p class="small mute">Målt ${dShort(s[0].measured_on)}${s[1] ? ` · ${(s[0].cm - s[1].cm) >= 0 ? "+" : ""}${(s[0].cm - s[1].cm).toFixed(1).replace(".", ",")} cm siden ${dShort(s[1].measured_on)}` : ""}</p>` : `<p class="mute">Ingen målinger ennå.</p>`}
    <p class="small">Mål én gang i måneden hjemme: om morgenen, uten sko, mot samme vegg. Mål to ganger og bruk snittet.</p>
    <form id="hf"><div class="grid2"><div><label>Høyde i cm</label><input name="cm" inputmode="decimal" placeholder="f.eks. 158,5" required></div><div><label>Dato</label><input type="date" name="d" value="${today()}" required></div></div><div id="hm"></div><button class="btn full">LAGRE HØYDE</button></form>
    ${s.length ? `<details style="margin-top:12px"><summary>Tidligere målinger</summary><div>${s.map((h, i) => `<div class="row between small" style="padding:4px 0;border-top:1px solid var(--line)"><span>${dShort(h.measured_on)}</span><b>${String(h.cm).replace(".", ",")} cm</b><span class="mute">${s[i + 1] ? ((h.cm - s[i + 1].cm) >= 0 ? "+" : "") + (h.cm - s[i + 1].cm).toFixed(1).replace(".", ",") : ""}</span></div>`).join("")}</div></details>` : ""}</div>`;
}
function bindHeight(player) {
  const f = $("#hf"); if (!f) return;
  f.onsubmit = async e => { e.preventDefault(); const v = Object.fromEntries(new FormData(f)); const cm = Number(String(v.cm).replace(",", "."));
    try { if (!(cm > 100 && cm < 230)) throw new Error("Skriv høyden i cm, f.eks. 158,5."); await api.addHeight({ player_id: player.id, measured_on: v.d, cm }); route(true); } catch (err) { msg($("#hm"), err.message); } };
}

/* ---------- Logg etter økt (ingen RPE) ---------- */
async function pageLog(main, sid) {
  const ss = await api.sessions(addDays(today(), -30), addDays(today(), 1));
  const s = ss.find(x => x.id === sid); const player = (await api.players()).find(p => p.id === me.player_id);
  if (!s || me.role !== "spiller") { main.innerHTML = `<p class="mute">Fant ikke økta.</p>`; return; }
  if (!player?.consent) { main.innerHTML = `<a href="#/meg">‹ Min side</a><h1>Logg økta</h1><div class="card"><p class="mute">Vi har ikke samtykke fra foresatte ennå, så logg kan ikke lagres. Si fra til treneren hvis noe er vondt.</p></div>`; return; }
  const l = (await api.logs(me.player_id)).find(x => x.session_id === sid) || {};
  let pain = l.pain || "nei";
  main.innerHTML = `<a href="#/meg">‹ Min side</a><p class="kicker" style="margin-top:10px">Logg økta</p><h1 style="text-transform:capitalize">${dayLong(s.date)}</h1><p class="mute">${esc(s.title)} · ${hm(s.start_time)}–${hm(s.end_time)}</p>
  <form id="lf" class="card"><label>Har du vondt noe sted etter økta?</label><div class="seg" id="pain">${["nei", "litt", "mye"].map(p => `<button type="button" data-p="${p}" class="${pain === p ? "on" : ""}">${p[0].toUpperCase() + p.slice(1)}</button>`).join("")}</div>
  <div id="where" style="display:${pain === "nei" ? "none" : "block"}"><label>Hvor er det vondt?</label><input name="pain_where" value="${esc(l.pain_where || "")}" placeholder="F.eks. hælen, under kneskåla"></div>
  <label>Tre ting som var bra</label><input name="good1" value="${esc(l.good1 || "")}" placeholder="1."><input name="good2" value="${esc(l.good2 || "")}" placeholder="2." style="margin-top:6px"><input name="good3" value="${esc(l.good3 || "")}" placeholder="3." style="margin-top:6px">
  <label>Én ting å bli bedre på</label><input name="better" value="${esc(l.better || "")}">
  <label style="font-weight:400;display:flex;gap:8px;align-items:center;margin-top:14px"><input type="checkbox" name="wants_talk" ${l.wants_talk ? "checked" : ""} style="width:auto"> Jeg vil gjerne prate med treneren</label>
  <p class="small mute">Bare trenerne ser loggen din. Å si fra om smerter koster aldri plass eller spilletid.</p>
  <div id="lm"></div><button class="btn full">LAGRE LOGGEN</button></form>`;
  $$("#pain button").forEach(b => b.onclick = () => { pain = b.dataset.p; $$("#pain button").forEach(x => x.classList.toggle("on", x === b)); $("#where").style.display = pain === "nei" ? "none" : "block"; });
  $("#lf").onsubmit = async e => { e.preventDefault(); const v = Object.fromEntries(new FormData(e.target));
    try { await api.saveLog({ session_id: sid, player_id: me.player_id, pain, pain_where: pain === "nei" ? "" : v.pain_where, good1: v.good1, good2: v.good2, good3: v.good3, better: v.better, wants_talk: !!v.wants_talk }); location.hash = "#/meg"; } catch (err) { msg($("#lm"), err.message); } };
}

/* ---------- Trener ---------- */
async function pageCoach(main) {
  const [players, hs, logs, profiles, codes, ss] = await Promise.all([api.players(), api.heights(), api.logs(), api.profiles(), api.codes(), api.sessions(addDays(today(), -30), today())]);
  const G = Object.fromEntries(players.map(p => [p.id, growth(hs.filter(h => h.player_id === p.id))]));
  const recent = logs.filter(l => (Date.now() - new Date(l.created_at)) / 864e5 <= 14);
  const alerts = recent.filter(l => l.pain === "mye" || l.wants_talk || l.pain === "litt");
  const pname = id => players.find(p => p.id === id)?.name || "?";
  const sdate = id => { const s = ss.find(x => x.id === id); return s ? dShort(s.date) : ""; };
  const count = z => players.filter(p => p.consent && G[p.id].zone === z).length;
  main.innerHTML = `<p class="kicker">Bare for trenere</p><h1>Trener</h1>
  <h2>Følg opp</h2><div class="card list">${alerts.map(l => `<div class="item"><span class="pill ${l.pain === "mye" ? "r" : l.pain === "litt" ? "y" : ""}">${l.pain === "nei" ? "Prat" : "Vondt: " + l.pain}</span><div style="flex:1"><a href="#/spiller/${l.player_id}"><b>${esc(pname(l.player_id))}</b></a> <span class="small mute">${sdate(l.session_id)}</span><div class="small">${esc(l.pain_where || "")}${l.wants_talk ? " · <b>vil prate med treneren</b>" : ""}</div></div></div>`).join("") || `<p class="mute">Ingen smerter eller ønsker om prat de siste 14 dagene.</p>`}</div>
  <h2>Vekstsoner</h2><div class="card"><div class="row" style="gap:6px;flex-wrap:wrap">${zonePill("g")} ${count("g")} ${zonePill("y")} ${count("y")} ${zonePill("r")} ${count("r")}</div>
    <details style="margin-top:10px"><summary>Tiltak fra skaderisikoplanen</summary><div>${["r", "y", "g"].map(z => `<p class="small">${zonePill(z)} ${TILTAK[z]}</p>`).join("")}<p class="small mute">Rød: over 2 cm siste måned. Gul: over 0,6 cm/mnd i snitt siste 3 mnd eller over 1 cm siste måned. Spilleren står i sona minst 3 mnd etter siste flagg. Vurder alltid smerter, funksjon og totalbelastning.</p></div></details></div>
  <h2>Spillere</h2><div class="card list">${players.map(p => { const g = G[p.id]; return `<a class="item" href="#/spiller/${p.id}" style="text-decoration:none;color:inherit"><div style="flex:1"><b>${esc(p.name)}</b><div class="small mute">${esc(p.position || "")} · ${profiles.filter(x => x.player_id === p.id && x.role === "forelder").length} foreldre · ${profiles.some(x => x.player_id === p.id && x.role === "spiller") ? "har konto" : "ingen konto"}</div></div>
    ${p.consent ? zonePill(g.zone) + (g.stale ? ' <span class="pill x">Mangler måling</span>' : "") : '<span class="pill x">Uten samtykke</span>'}</a>`; }).join("") || `<p class="mute">Legg til spillerne først.</p>`}</div>
  <details><summary>+ Legg til spiller</summary><div><form id="np"><label>Navn</label><input name="name" required><label>Posisjon</label><select name="position">${["Keeper", "Stopper", "Back", "Sekser", "Åtter", "Spiss"].map(x => `<option>${x}</option>`).join("")}</select>
    <label style="font-weight:400;display:flex;gap:8px;align-items:center"><input type="checkbox" name="consent" style="width:auto"> Foresatte har gitt samtykke til høyde og logg</label><div id="npm"></div><button class="btn full">LEGG TIL</button></form></div></details>
  <h2>Ny konto</h2><div class="card"><p class="small mute">Lag en kode og send den til personen. Koden gjelder i 14 dager.</p>
    <div class="seg" id="role">${["spiller", "forelder", "trener"].map((r, i) => `<button type="button" data-r="${r}" class="${i ? "" : "on"}">${r[0].toUpperCase() + r.slice(1)}</button>`).join("")}</div>
    <div id="rp"><label>Spiller</label><select id="cp">${players.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join("")}</select></div>
    <div id="rn" style="display:none"><label>Navn</label><input id="cn" placeholder="Navnet til forelderen eller treneren"></div>
    <div id="cm"></div><button class="btn full" id="mk">LAG KODE</button></div>
  <h2>Glemt passord</h2><div class="card"><select id="pp">${profiles.map(p => `<option value="${p.id}">${esc(p.name)} (${p.role}, ${esc(p.username)})</option>`).join("")}</select><div id="pcm"></div><button class="btn full" id="pmk">LAG PASSORDKODE</button></div>
  ${codes.length ? `<h2>Aktive koder</h2><div class="card list">${codes.map(c => `<div class="item small"><code>${esc(c.code)}</code><span style="flex:1">${c.kind === "passord" ? "Passord: " + esc(profiles.find(p => p.id === c.profile_id)?.name || "") : esc(c.role) + ": " + esc(c.name || pname(c.player_id))}</span><span class="mute">til ${new Date(c.expires_at).toLocaleDateString("nb-NO")}</span></div>`).join("")}</div>` : ""}`;
  let role = "spiller";
  const upd = () => { $("#rp").style.display = role === "trener" ? "none" : "block"; $("#rn").style.display = role === "spiller" ? "none" : "block"; };
  $$("#role button").forEach(b => b.onclick = () => { role = b.dataset.r; $$("#role button").forEach(x => x.classList.toggle("on", x === b)); upd(); });
  const share = (code, text) => `<div class="code">${esc(code)}</div><p class="small">Send dette:</p><textarea readonly style="min-height:110px">${esc(text)}</textarea>`;
  const url = location.href.split("#")[0];
  $("#mk").onclick = async () => { try { const player = role === "trener" ? null : $("#cp").value; const name = role === "spiller" ? null : $("#cn").value.trim(); if (role !== "spiller" && !name) throw new Error("Skriv navnet.");
      const code = await api.makeCode("ny", role, name, player, null);
      $("#cm").innerHTML = share(code, `Hei! Her er koden din til lagets side for Follo G13: ${code}\n\nGå til ${url}, trykk «Første gang?» og lag ditt eget brukernavn og passord. Koden gjelder i 14 dager.`); } catch (err) { msg($("#cm"), err.message); } };
  $("#pmk").onclick = async () => { try { const pid = $("#pp").value; const p = profiles.find(x => x.id === pid); const code = await api.makeCode("passord", null, null, null, pid);
      $("#pcm").innerHTML = share(code, `Hei! Her er en kode for å lage nytt passord: ${code}\n\nGå til ${url}, trykk «Glemt passord?», skriv brukernavnet ditt (${p.username}) og koden. Koden gjelder i 14 dager.`); } catch (err) { msg($("#pcm"), err.message); } };
  $("#np").onsubmit = async e => { e.preventDefault(); const v = Object.fromEntries(new FormData(e.target)); try { await api.addPlayer({ name: v.name.trim(), position: v.position, consent: !!v.consent }); route(true); } catch (err) { msg($("#npm"), err.message); } };
}
async function pagePlayer(main, id) {
  const [players, hs, logs, goals, ss] = await Promise.all([api.players(), api.heights(id), api.logs(id), api.goals(id), api.sessions(addDays(today(), -90), today())]);
  const p = players.find(x => x.id === id); if (!p) { main.innerHTML = "Fant ikke spilleren."; return; }
  const g = growth(hs);
  const sh = [...hs].sort((a, b) => b.measured_on.localeCompare(a.measured_on));
  main.innerHTML = `<a href="#/trener">‹ Trener</a><h1 style="margin-top:8px">${esc(p.name)}</h1><p class="mute">${esc(p.position || "")}</p>
  <div class="card"><label style="font-weight:400;display:flex;gap:8px;align-items:center;margin:0"><input type="checkbox" id="cons" ${p.consent ? "checked" : ""} style="width:auto"> Samtykke fra foresatte til høyde og logg</label></div>
  <h2>Vekst</h2><div class="card">${p.consent ? `<div class="row between">${zonePill(g.zone)}${g.stale ? '<span class="pill x">Mangler måling</span>' : ""}</div>
    ${g.last != null ? `<p class="small" style="margin-top:8px">Siste måned: <b>${g.last.toFixed(1).replace(".", ",")} cm/mnd</b> · Snitt siste 3 mnd: <b>${g.avg.toFixed(1).replace(".", ",")} cm/mnd</b></p>` : ""}
    ${g.zone !== "ukjent" ? `<p class="small">${TILTAK[g.zone]}</p>` : ""}
    ${sh.map((h, i) => `<div class="row between small" style="padding:4px 0;border-top:1px solid var(--line)"><span>${dShort(h.measured_on)}</span><b>${String(h.cm).replace(".", ",")} cm</b><span class="mute">${sh[i + 1] ? ((h.cm - sh[i + 1].cm) >= 0 ? "+" : "") + (h.cm - sh[i + 1].cm).toFixed(1).replace(".", ",") : ""}</span></div>`).join("") || '<p class="mute">Ingen målinger.</p>'}` : '<p class="mute" style="margin:0">Uten samtykke lagres ikke høyde.</p>'}</div>
  <h2>Mål</h2>${goals.map(x => `<div class="card"><div class="row between"><b>${esc(x.text)}</b><span class="pill">${esc(x.status)}</span></div>${x.how ? `<p class="small">${esc(x.how)}</p>` : ""}<label>Kommentar fra trener</label><input data-cc="${x.id}" value="${esc(x.coach_comment || "")}"></div>`).join("") || '<p class="mute">Ingen mål.</p>'}
  <h2>Logg (siste 90 dager)</h2><div class="card list">${logs.map(l => { const s = ss.find(x => x.id === l.session_id); return `<div class="item" style="align-items:flex-start"><span class="pill ${l.pain === "mye" ? "r" : l.pain === "litt" ? "y" : "g"}">${l.pain}</span><div class="small" style="flex:1"><b>${s ? dShort(s.date) + " · " + esc(s.title) : ""}</b>${l.pain_where ? `<div>Vondt: ${esc(l.pain_where)}</div>` : ""}<div>Bra: ${[l.good1, l.good2, l.good3].filter(Boolean).map(esc).join(" · ") || "–"}</div><div>Bedre: ${esc(l.better || "–")}</div>${l.wants_talk ? "<div><b>Vil prate med treneren</b></div>" : ""}</div></div>`; }).join("") || '<p class="mute">Ingen logger.</p>'}</div>`;
  $("#cons").onchange = async e => { await api.updatePlayer(id, { consent: e.target.checked }); route(true); };
  $$("[data-cc]").forEach(inp => inp.onchange = async () => { await api.updateGoal(inp.dataset.cc, { coach_comment: inp.value }); inp.style.borderColor = "var(--green)"; });
}

/* ---------- ruter ---------- */
let busy = false;
async function route(force) {
  if (busy && !force) return; busy = true;
  try {
    me = await api.me();
    const [path, arg] = location.hash.replace(/^#\/?/, "").split("/");
    if (!me) { authPage(path === "forste-gang" ? "first" : path === "glemt" ? "forgot" : "login"); return; }
    const r = ["login", "forste-gang", "glemt", ""].includes(path) ? "hjem" : path;
    if (r !== path) history.replaceState(null, "", "#/" + r);
    const coachOnly = ["trener", "spiller"];
    if (coachOnly.includes(r) && !isCoach()) { location.hash = "#/hjem"; return; }
    const pages = { begreper: pageConcepts, begrep: m => pageConcept(m, arg), opptreden: pageConduct, "slik-trener-vi": pageMethod, hjem: pageHome, uke: pageWeek, kalender: pageCalendar, mer: pageMore, spillmodell: pageModel, puls: pagePuls, egentrening: pageTraining, foreldre: pageParents, meg: pageMe, logg: m => pageLog(m, arg), trener: pageCoach, spiller: m => pagePlayer(m, arg) };
    const tab = { begreper: "mer", begrep: "mer", opptreden: "mer", "slik-trener-vi": "mer", spillmodell: "mer", puls: "mer", egentrening: "mer", foreldre: "mer", logg: "meg", spiller: "trener" }[r] || r;
    const main = shell(tab, `<p class="loading">Laster …</p>`);
    await (pages[r] || pageHome)(main);
    window.scrollTo(0, 0);
  } catch (err) {
    console.error(err); app.innerHTML = `<div class="auth"><div class="msg err">Noe gikk galt: ${esc(err.message)}</div><a href="#/hjem" class="btn">Prøv igjen</a></div>`;
  } finally { busy = false; }
}

api = DEMO ? demoApi() : supaApi();
if (DEMO) api.setRole("trener");
window.addEventListener("hashchange", () => route(true));
route(true);
})();

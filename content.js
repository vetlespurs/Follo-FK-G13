// Fast innhold i appen. Endre tekstene her – ingen database trengs.
// Egen tegning av rommene (ikke kopi av NFF-figuren).
const ROM_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 300 420\" font-family=\"Arial,Helvetica,sans-serif\"><rect width=\"300\" height=\"420\" rx=\"12\" fill=\"#2E7D4F\"/><rect x=\"10\" y=\"10\" width=\"280\" height=\"400\" fill=\"none\" stroke=\"rgba(255,255,255,.6)\" stroke-width=\"2\"/><line x1=\"10\" y1=\"210\" x2=\"290\" y2=\"210\" stroke=\"rgba(255,255,255,.6)\" stroke-width=\"2\"/><rect x=\"85\" y=\"10\" width=\"130\" height=\"50\" fill=\"none\" stroke=\"rgba(255,255,255,.6)\" stroke-width=\"2\"/><rect x=\"85\" y=\"360\" width=\"130\" height=\"50\" fill=\"none\" stroke=\"rgba(255,255,255,.6)\" stroke-width=\"2\"/><rect x=\"10\" y=\"60\" width=\"280\" height=\"55\" fill=\"#1F98D0\" opacity=\".28\"/><rect x=\"10\" y=\"125\" width=\"280\" height=\"55\" fill=\"#FFD54F\" opacity=\".25\"/><rect x=\"10\" y=\"190\" width=\"280\" height=\"70\" fill=\"#ffffff\" opacity=\".12\"/><rect x=\"10\" y=\"125\" width=\"70\" height=\"135\" fill=\"none\" stroke=\"#fff\" stroke-dasharray=\"5 4\" stroke-width=\"2\"/><text x=\"185\" y=\"93\" font-size=\"15\" font-weight=\"800\" fill=\"#fff\" text-anchor=\"middle\" letter-spacing=\"3\">BAKROM</text><text x=\"185\" y=\"158\" font-size=\"15\" font-weight=\"800\" fill=\"#fff\" text-anchor=\"middle\" letter-spacing=\"3\">MELLOMROM</text><text x=\"185\" y=\"234\" font-size=\"15\" font-weight=\"800\" fill=\"#fff\" text-anchor=\"middle\" letter-spacing=\"3\">FRAMROM</text><text x=\"45\" y=\"186\" font-size=\"9.5\" font-weight=\"800\" fill=\"#fff\" text-anchor=\"middle\">ROM P\u00c5</text><text x=\"45\" y=\"198\" font-size=\"9.5\" font-weight=\"800\" fill=\"#fff\" text-anchor=\"middle\">MOTSATT</text><text x=\"45\" y=\"210\" font-size=\"9.5\" font-weight=\"800\" fill=\"#fff\" text-anchor=\"middle\">SIDE</text><circle cx=\"150\" cy=\"30\" r=\"9\" fill=\"#7A1F2B\" stroke=\"#fff\" stroke-width=\"2\"/><circle cx=\"95\" cy=\"120\" r=\"9\" fill=\"#D23B3B\" stroke=\"#fff\" stroke-width=\"2\"/><circle cx=\"150\" cy=\"120\" r=\"9\" fill=\"#D23B3B\" stroke=\"#fff\" stroke-width=\"2\"/><circle cx=\"205\" cy=\"120\" r=\"9\" fill=\"#D23B3B\" stroke=\"#fff\" stroke-width=\"2\"/><circle cx=\"255\" cy=\"120\" r=\"9\" fill=\"#D23B3B\" stroke=\"#fff\" stroke-width=\"2\"/><circle cx=\"120\" cy=\"185\" r=\"9\" fill=\"#D23B3B\" stroke=\"#fff\" stroke-width=\"2\"/><circle cx=\"190\" cy=\"185\" r=\"9\" fill=\"#D23B3B\" stroke=\"#fff\" stroke-width=\"2\"/><circle cx=\"240\" cy=\"185\" r=\"9\" fill=\"#D23B3B\" stroke=\"#fff\" stroke-width=\"2\"/><circle cx=\"150\" cy=\"395\" r=\"9\" fill=\"#005496\" stroke=\"#fff\" stroke-width=\"2\"/><text x=\"150\" y=\"399\" font-size=\"10\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#fff\">K</text><circle cx=\"115\" cy=\"330\" r=\"9\" fill=\"#005496\" stroke=\"#fff\" stroke-width=\"2\"/><text x=\"115\" y=\"334\" font-size=\"10\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#fff\">4</text><circle cx=\"195\" cy=\"330\" r=\"9\" fill=\"#005496\" stroke=\"#fff\" stroke-width=\"2\"/><text x=\"195\" y=\"334\" font-size=\"10\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#fff\">3</text><circle cx=\"255\" cy=\"280\" r=\"9\" fill=\"#005496\" stroke=\"#fff\" stroke-width=\"2\"/><text x=\"255\" y=\"284\" font-size=\"10\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#fff\">2</text><circle cx=\"45\" cy=\"290\" r=\"9\" fill=\"#005496\" stroke=\"#fff\" stroke-width=\"2\"/><text x=\"45\" y=\"294\" font-size=\"10\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#fff\">5</text><circle cx=\"150\" cy=\"270\" r=\"9\" fill=\"#005496\" stroke=\"#fff\" stroke-width=\"2\"/><text x=\"150\" y=\"274\" font-size=\"10\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#fff\">6</text><circle cx=\"215\" cy=\"245\" r=\"9\" fill=\"#005496\" stroke=\"#fff\" stroke-width=\"2\"/><text x=\"215\" y=\"249\" font-size=\"10\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#fff\">8</text><circle cx=\"95\" cy=\"235\" r=\"9\" fill=\"#005496\" stroke=\"#fff\" stroke-width=\"2\"/><text x=\"95\" y=\"239\" font-size=\"10\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#fff\">8</text><circle cx=\"160\" cy=\"140\" r=\"9\" fill=\"#005496\" stroke=\"#fff\" stroke-width=\"2\"/><text x=\"160\" y=\"144\" font-size=\"10\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#fff\">9</text><circle cx=\"267\" cy=\"268\" r=\"4.5\" fill=\"#fff\" stroke=\"#000\" stroke-width=\"1\"/><text x=\"150\" y=\"418\" font-size=\"9\" fill=\"#fff\" text-anchor=\"middle\" opacity=\".85\">Vi angriper oppover \u2191</text></svg>";
window.CONTENT = {
  team: "Follo G13",
  motto: "Fjell kan flyttes med tro",

  howTo: [
    ["Denne uka", "Neste økt, oppmøte og hva vi jobber med."],
    ["Kalender", "Alle økter og kamper, og årshjulet med periodene."],
    ["Min side", "Dine mål, logg etter økt og høyde én gang i måneden."],
    ["Mer", "Spillmodellen, PULS, egentrening og info til foreldre."],
  ],

  puls: [
    { l: "P", w: "Profesjonalitet", club: ["Lock in", "Intensitet", "Forberedt"] },
    { l: "U", w: "Utvikling", club: ["Innsats", "Egentrening", "Coachbarhet"] },
    { l: "L", w: "Lidenskap", club: ["Spill for merket på brystet", "Glød", "Vinnervilje"] },
    { l: "S", w: "Samhold", club: ["Hilsekultur", "Back hverandre", "Gjør en annens dag litt bedre"] },
  ],
  // Fylles inn etter PULS-workshopen i januar: hva bokstavene betyr for oss.
  pulsTeam: {
    P: [], U: [], L: [], S: [],
  },

  model: {
    intro: "Vi vil ha ballen mest mulig, for det er der vi utvikler oss mest. Når vi mister den, vil vi vinne den tilbake så fort som mulig.",
    shapes: {
      "4-3-1": { label: "Uten ball: 4-3-1", pos: [["K",50,92],["2",86,70],["3",64,76],["4",36,76],["5",14,70],["6",50,58],["8",70,44],["8",30,44],["9",50,24]] },
      "2-3-3": { label: "Med ball: ca. 2-3-3", pos: [["K",50,92],["3",68,74],["4",32,74],["6",50,58],["8",72,44],["8",28,44],["2",90,24],["9",50,20],["5",10,24]] },
    },
    intentions: [
      { id: "ut", name: "Spille oss ut", phase: "Med ball",
        text: "Vi spiller oss ut bakfra, også under press. Keeperen er alltid med som frimann.",
        videos: [{ t: "NFF: A1 – angrep mot høyt press", u: "https://www.youtube.com/watch?v=d3mmXo3ou2I" }],
        points: ["Keeperen er fri når det er likt antall – bruk ham.", "Skap trekanter og vinkler, og finn den ledige spilleren.", "En lang ball til ledig spiller er lov, og den skal hylles.", "Feil her er læring. Vi prøver igjen."] },
      { id: "frem", name: "Spille oss fremover", phase: "Med ball",
        text: "Progressive pasninger. Målet med ballen er alltid å komme kontrollert til siste tredjedel.",
        points: ["Se fremover først.", "Finn frimannen direkte, eller via en tredjemann (stopper eller sekser).", "Pass and move og veggspill låser opp likt antall.", "Backene gir bredde høyt. Spissen faller ned eller truer bakrom."] },
      { id: "eksplosjon", name: "Eksplosjon", phase: "Med ball",
        text: "På siste tredjedel skal det gå fort. Tør å prøve kule løsninger.",
        videos: [{ t: "NFF: A2 – angrep mot lavt forsvar", u: "https://www.youtube.com/watch?v=ipJ3P9YI0hE" }],
        points: ["Utfordre 1 mot 1 når du er alene med keeper om du lykkes.", "Overtall og bevegelse foran ballfører.", "Tilbakelegg og avslutninger på ett touch.", "To stoppere – og sekseren når backene går – holder balansen (liketall eller +1)."] },
      { id: "vinne", name: "Vinne ballen", phase: "Uten ball",
        text: "Høyt press er utgangspunktet. Etter balltap går vi alltid rett i gjenpress.",
        videos: [{ t: "NFF: Kamp om ballen", u: "https://www.youtube.com/watch?v=ss3kh3sA9jc" }],
        points: ["Gjenpress med en gang: vinn ballen, eller kom i balanse og press på nytt.", "Press på pressignaler, alle sammen.", "Riktig side og andreball når de slår langt.", "Nullsituasjoner skal vinnes."] },
    ],
    balance: "Balanse betyr liketall eller +1: like mange av oss som de har angripere mellom ballen og eget mål – eller én flere.",
    errors: {
      good: ["Valget kunne gitt mye om det lyktes.", "Eksempler: gjennombruddspasning, eller å utfordre 1 mot 1 når du er alene med keeper om du kommer forbi.", "Det er et godt valg – selv om du mister ballen."],
      bad: ["Lite å vinne og mye å tape, for eksempel tverrpasning på egen halvdel uten press.", "Feil som kommer av lav innsats eller at du ikke er til stede."],
    },
    words: [
      ["SCAN", "Se deg rundt før ballen kommer – flere ganger, og helst rett før mottaket."],
      ["ÅPEN", "Still kroppen så du kan se og spille begge veier."],
      ["FRIMANN", "Den som er ledig. Finn ham – direkte eller via en tredjemann."],
      ["FREMOVER", "Se fremover først."],
      ["GJENPRESS", "Mister vi ballen, går vi rett på."],
      ["BALANSE", "Nok spillere mellom ballen og eget mål."],
      ["EKSPLOSJON", "Fart og mot på siste tredjedel."],
    ],
    scan: ["Se på ballen hver gang den blir truffet.", "Scan bort fra ballen rett etter hver touch.", "Scan ofte mens ballen er på vei mot deg – og så sent som mulig før mottaket."],
  },


  // ---------- Vårt fotballspråk: begreper med videoeksempler ----------
  // Videoene er lenker til YouTube (andres innhold) – vi viser dem, vi laster dem ikke opp.
  concepts: [
    { id: "aapen", word: "SCAN OG ÅPEN", tag: "Med ball",
      short: "Se deg rundt før ballen kommer, og stå halvt åpen så du ser mest mulig av banen.",
      why: "Jo mer du har sett før ballen kommer, jo raskere og bedre blir valget ditt. Står du rett mot ballen, ser du bare halve bildet.",
      look: ["Hvor mange ganger ser han over skulderen før ballen kommer?", "Står han rett mot ballen, eller halvt åpen mot banen?", "Hvor mye av banen kan han se idet han tar imot – og hvor mye ser du når du står likt?"],
      ask: "Hvor står du når du ser både ballen og målet vi skal mot?",
      videos: [
        { t: "Xavi – scanning surroundings examples", u: "https://www.youtube.com/watch?v=oMez1ZpJxDQ" },
        { t: "Pedri's scanning is on another level (kort)", u: "https://www.youtube.com/shorts/DetP1KKgB74" },
      ] },
    { id: "lengste", word: "LENGSTE FOT", tag: "Med ball",
      short: "Er medspilleren ledig, spiller du på foten lengst unna. Da kan han ta ballen med seg forbi leddet i første touch. Eksempel: Står han bredt på linje med en motstander som står smalere, spiller du på ytterfoten hans – så tar han touchen forbi.",
      why: "Ballen på lengste fot betyr at mottakeren slipper å stoppe og snu. Han tar imot halvt vendt og er forbi presseren med én gang.",
      look: ["Står mottakeren på linje med en motstander? Hvilken fot må ballen komme på for at han skal komme forbi?", "Hvilken fot tar han imot med – den nærmeste eller den lengste fra pasningsgiveren?", "Lar han ballen rulle over kroppen før han tar den med seg?", "Hvor mange spillere er han forbi etter første touch?"],
      ask: "Hvilken fot vil du ha ballen på når du står ledig mellom linjene?",
      videos: [
        { t: "Why every midfielder needs the half-turn", u: "https://www.youtube.com/watch?v=tCWkBpLNSes" },
        { t: "Kevin De Bruyne – vision og mottak mot Slovakia (EM 2024)", u: "https://www.youtube.com/watch?v=i-u1IpCibTs" },
      ] },
    { id: "naermeste", word: "NÆRMESTE FOT", tag: "Med ball",
      short: "Står medspilleren under tett press, spiller du på foten nærmest deg. Da kan han skjerme ballen eller legge den tilbake på ett touch.",
      why: "Under tett press er det ikke tid til å vende. Ballen på nærmeste fot gjør det lett å holde den eller spille videre til tredjemann.",
      look: ["Hvor tett står presseren når ballen kommer?", "Holder mottakeren kroppen mellom ballen og motstanderen?", "Spiller han videre på ett touch – til hvem?"],
      ask: "Hvordan ser du at en medspiller er for tett presset til å vende?",
      videos: [
        { t: "What Busquets knows about receiving that you don't", u: "https://www.youtube.com/watch?v=DrzNkGGTGfg" },
        { t: "A small detail to become more press-resistant (press i ryggen)", u: "https://www.youtube.com/watch?v=E2U8tc1rc6I" },
      ] },
    { id: "skjerm", word: "SKJERM", tag: "Med ball",
      short: "Kroppen mellom ballen og motstanderen. Lavt tyngdepunkt, armen ut for å kjenne hvor han er, ballen på foten lengst unna ham.",
      why: "Slik forsvarer du ballen når du er presset – og du vinner tid til at medspillerne kommer til.",
      look: ["Hvor er kroppen hans i forhold til ballen og motstanderen?", "Hvordan bruker han armen?", "Hvilken fot har han ballen på?"],
      ask: "Hvem på laget er best til å skjerme – og hva gjør han?",
      videos: [
        { t: "I analysed the world's most press-resistant players", u: "https://www.youtube.com/watch?v=33hi8BV2zOQ" },
        { t: "What Busquets knows about receiving that you don't", u: "https://www.youtube.com/watch?v=DrzNkGGTGfg" },
      ] },
    { id: "touchfrem", word: "TOUCH FREM", tag: "Med ball",
      short: "Er det rom foran deg, tar du første touch fremover og angriper rommet.",
      why: "Når du fører ballen inn i rommet, må noen gå ut på deg. Da åpner det seg rom for en medspiller.",
      look: ["Går første touch fremover, til siden eller bakover?", "Hvor mange meter vinner han på første touch?", "Hvem må gå ut på ham – og hvem blir ledig da?"],
      ask: "Når er det riktig å stoppe ballen, og når skal du ta den med deg fremover?",
      videos: [
        { t: "FIFA Training Centre: first touch to evade pressure (klipp fra U17-VM)", u: "https://www.fifatrainingcentre.com/en/game/tournaments/fu17wwcfu17wwc-24/2024/technical-using-a-first-touch-to-evade-pressure.php" },
        { t: "Receive on the back foot and push the ball into space", u: "https://www.youtube.com/watch?v=Xj8wx05SdHA" },
      ] },
    { id: "tiltrekk", word: "TILTREKK", tag: "Med ball",
      short: "Hold ballen litt lenger, la dem komme på deg – og spill forbi. Hver motspiller som går i press, etterlater et rom bak seg.",
      why: "Når de presser høyt, blir rommet mellom linjene større. Det er der vi vil spille oss fremover. Keeperen og stopperne er de viktigste til dette.",
      look: ["Hvor lenge venter han med ballen før han spiller?", "Hvem går i press – og hvilket rom blir tomt bak ham?", "Hvem tar imot i det rommet?"],
      ask: "Hvorfor kan det være lurt å vente når en motstander løper mot deg?",
      videos: [
        { t: "Provoking the press: De Zerbi's Brighton tactics explained", u: "https://www.youtube.com/watch?v=dGLmBw0y_s4" },
      ] },
    { id: "rom", word: "ROMMENE", tag: "Med ball",
      short: "Bakrom er bak forsvarsleddet. Mellomrom er mellom forsvars- og midtbaneleddet deres. Framrom er foran midtbaneleddet. Rom på motsatt side er der ballen ikke er.",
      why: "Når vi vet hva rommene heter, kan vi snakke sammen om hvor vi skal spille. Vi vil helst spille i mellomrommet og bakrommet – og bytter side når de flytter seg mot ballen.",
      svg: ROM_SVG,
      look: ["Hvor mange av oss står i mellomrommet?", "Truer noen bakrommet så forsvaret må stå lavere?", "Er det ledig på motsatt side når de har flyttet seg mot ballen?"],
      ask: "Hvilket rom står du i nå – og hvilket rom vil du spille ballen til?",
      videos: [] },
    { id: "spillbar", word: "SPILLBAR", tag: "Med ball",
      short: "Gjør deg spillbar for ballføreren: Han må se deg, og du må ha god vinkel og avstand – eller flytte deg så du lager plass til en annen.",
      why: "Ballføreren er bare så god som valgene han har. Hver spiller uten ball kan gjøre ham bedre.",
      look: ["Ser ballføreren deg – eller står du bak en motspiller?", "Er vinkelen og avstanden til ballføreren god?", "Hvor kan du bevege deg for å gjøre deg spillbar?", "Kan du heller bevege deg for å skape plass til en annen?", "Står du slik at du kan støtte og vende spillet?"],
      ask: "Hvilke spillpunkter har ballføreren akkurat nå – og er du ett av dem?",
      videos: [] },
    { id: "godfeil", word: "GOD FEIL", tag: "Holdning",
      short: "En feil der vi hadde fått mye om det hadde lyktes. 1 mot 1 når du er alene med keeper om du kommer forbi – og gjennombruddspasningen. Vi heier på dem.",
      why: "Spillere som tør, blir gode. Mister du ballen etter et godt valg, går vi bare i gjenpress sammen.",
      look: ["Hva hadde skjedd om dribblingen eller pasningen hadde lyktes?", "Hvor mange ganger mislykkes selv de beste før det sitter?", "Hva gjør laget rett etter at ballen er mistet?"],
      ask: "Hva er forskjellen på en god og en dårlig feil?",
      videos: [
        { t: "Analyzing Jérémy Doku's 1.5-second dribble", u: "https://www.youtube.com/watch?v=_w-kBecDIco" },
        { t: "Kevin De Bruyne – the through pass king", u: "https://www.youtube.com/watch?v=5m7AvedjC2g" },
      ] },
    { id: "gjenpress", word: "GJENPRESS", tag: "Uten ball",
      short: "Mister vi ballen, går de nærmeste rett på. Vinn den tilbake, eller kom i balanse og press på nytt.",
      why: "Rett etter balltap er motstanderen ute av posisjon. Da er det lettest å vinne ballen høyt i banen.",
      look: ["Hvor mange sekunder går det før noen er på ballføreren?", "Hvem stenger den nærmeste pasningen?", "Hvor mange går i press – og hvem blir igjen i balanse?"], ask: "Hva gjør du i de første tre sekundene etter at vi mistet ballen?",
      videos: [
        { t: "How Klopp's gegenpress made Liverpool unstoppable", u: "https://www.youtube.com/watch?v=m4O67fZZ9tE" },
        { t: "Klopp forklarer gjenpresset selv (kort, tysk)", u: "https://www.youtube.com/shorts/h5FVoWmxxdU" },
      ] },
    { id: "balanse", word: "BALANSE", tag: "Uten ball",
      short: "Liketall eller +1: like mange av oss som de har angripere mellom ballen og eget mål – eller én flere.",
      why: "Da kan vi tåle et balltap – og tørre å angripe med mange. Proffene kaller det restforsvar.", look: ["Telle: Hvor mange av dem står klare til å kontre, og hvor mange av oss står bak ballen?", "Hvem står igjen når backene går høyt – to stoppere og sekseren?"], ask: "Hvem holder balansen når begge backene er høyt?",
      videos: [
        { t: "Rest defence in football explained", u: "https://www.youtube.com/watch?v=3ILRm9GQoF0" },
        { t: "Rest defence: stop counterattacks before they start", u: "https://www.youtube.com/watch?v=fZLoeLiOesU" },
      ] },
    { id: "frimann", word: "FRIMANN", tag: "Med ball",
      short: "Den som er ledig. Når de presser likt antall, er det alltid keeperen. Keeperen får ballen fra stopperen og spiller sekseren – sekseren er tredjemann som spiller videre til den ledige.",
      why: "Frimannen kan vende og spille fremover. Via keeperen og sekseren kommer vi oss ut av presset.", look: ["Hvem er ledig når de presser høyt – og hvorfor er det keeperen?", "Hvor står sekseren når keeperen får ballen?", "Hvem spiller sekseren videre til – og står den spilleren vendt fremover?"], ask: "Hvem er ledig når de presser med tre?",
      videos: [
        { t: "Building: free man & third man (Bayern-trening med Guardiola)", u: "https://www.youtube.com/watch?v=vil0V8Xafwo" },
        { t: "Ederson – the perfect modern day goalkeeper (analyse)", u: "https://www.youtube.com/watch?v=1fyWOXIt8sA" },
        { t: "Why the third man is impossible to defend", u: "https://www.youtube.com/watch?v=n8P2-sKLCSE" },
      ] },
  ],

  // ---------- Slik opptrer vi ----------
  conduct: [
    { h: "På trening", items: ["Oppmøte 15 minutter før – klar til å starte når økta starter.", "Hils på alle når du kommer – trener og spiller, spiller og spiller – med håndtrykk eller knoke.", "Lock in: Telefonen er borte fra oppmøte til økta er ferdig.", "Gi alt i hver øvelse – intensitet er et valg.", "Etter trening er vi kompiser igjen."] },
    { h: "Mot hverandre", items: ["Back hverandre i både motgang og medgang.", "Si fra til medspillere – både når de gjør noe bra og når vi kan bli bedre. Ærlighet er kjærlighet, men si det på en måte du selv vil høre det.", "Framsnakk, ikke baksnakk.", "Det heter vi, ikke jeg. Alle har like stor verdi.", "Gjør en annens dag litt bedre hver dag."] },
    { h: "Når det går galt", items: ["En god feil får applaus – også fra benken.", "Mister vi ballen, går vi i gjenpress sammen. Ingen henger med hodet.", "Tåle tilbakemeldinger: Lytt, spør hvis du ikke forstår, prøv igjen.", "Si fra om du har vondt. Det koster aldri plass eller spilletid."] },
    { h: "På kamp", items: ["Forbered deg: mat, søvn, utstyr og din egen oppgave.", "Hils på motstander og dommer før og etter kampen.", "Vi snakker bare til dommeren gjennom kapteinen.", "Etter kampen: tre ting som var bra og én ting å bli bedre på."] },
  ],

  // ---------- Slik trener vi ----------
  method: [
    { h: "Vi spiller mest", p: "Nesten alt vi gjør, er spill med motstandere, medspillere og mål. Det er der du lærer å se, velge og utføre – akkurat som i kamp." },
    { h: "Regler som lærer deg noe", p: "Vi endrer reglene for å få fram det vi jobber med: mindre bane, færre touch, poeng for tredjemann eller lang ball til ledig spiller. Du finner løsningen selv – treneren hjelper deg med spørsmål." },
    { h: "Aldri helt likt", p: "Vi gjentar det samme temaet mange ganger, men aldri på helt samme måte. Det heter repetisjon uten repetisjon, og det gjør at du klarer det også når kampen ser annerledes ut." },
    { h: "Vi tør å feile", p: "Gode feil er en del av læringen. Vi teller dem ikke mot deg – vi heier på dem." },
    { h: "Teknikk med mening", p: "Egne teknikkbolker bruker vi mest til avslutninger og moro. Resten av teknikken trener vi i spill." },
    { h: "Glede- og konkurranseøkt", p: "Dagen før kamp har vi en økt med konkurranser, lek, samarbeid og masse avslutninger. Lagene blandes, og innsats teller like mye som å vinne." },
    { h: "Reglene i 9er", p: "NFF sin spillformbrosjyre forklarer banen, målene, tiden og reglene i 9er-fotball.", url: "https://www.fotball.no/globalassets/barn-og-ungdom/spillformbrosjyrer/nff-spillformbrosjyre-9mot9.pdf" },
    { h: "Oppvarming og kropp", p: "Vi varmer opp med FIFA 11+ Kids. Er du i vekstspurten, gjør du mindre av det tyngste en periode – men du er alltid med laget." },
  ],

  training: [
    { group: "Med ball", items: [
      { name: "Touch og mottak", meta: "30–40 min · alene eller to og to", why: "Mange touch på begge føtter. Bruk svak fot like mye som den sterke.",
        steps: ["Oppvarming: 5 min triksing og føring med begge føtter.", "Vegg (mur eller makker): 3 × 3 min pasning–mottak, bytt fot hver serie.", "Mottak bort fra «press»: legg ballen ut til siden med første touch, 3 × 2 min.", "1 mot 1 mot makker eller kjegle: 5 × 1 min, pause 1 min.", "Avslutt med 20 skudd – 10 med hver fot."] },
      { name: "Scan og vend", meta: "20 min · to og to", why: "Øv på å se deg rundt før ballen kommer.",
        steps: ["Makker spiller til deg og roper/peker en farge eller retning mens ballen er på vei.", "Du scanner før mottaket og vender mot riktig side.", "4 × 3 min, bytt roller."] },
    ]},
    { group: "Sprint", items: [
      { name: "Akselerasjon", meta: "25 min · 6 × 10 m og 3 × 20 m", why: "Raskere på de første meterne. Full fart, full pause.",
        steps: ["Oppvarming: 8 min jogg, høye kne, hælspark, raske føtter.", "6 × 10 m fra ulike startstillinger, gå tilbake (ca. 1 min pause).", "3 × 20 m, 2 min pause.", "Gul eller rød vekstsone: halver antallet."] },
    ]},
    { group: "Styrke (kroppsvekt)", items: [
      { name: "Styrke A: Bein og hofter", meta: "30 min · 2 runder", why: "Sterkere bein og hofter som tåler fotball.",
        steps: ["Knebøy 10–15", "Utfall bakover 8 per bein", "Nordic hamstring 3–5 (makker holder anklene)", "Copenhagen (kort versjon) 5–8 per side", "Tåhev på ett bein 10 per bein", "Gul eller rød vekstsone: én runde og ingen hopp."] },
      { name: "Styrke B: Kjerne og overkropp", meta: "25 min · 2 runder", why: "Stabil kropp i duellene.",
        steps: ["Armhevinger 8–12", "Planke 30–45 sek", "Sideplanke 20–30 sek per side", "Rygghev 10–12", "Bear crawl 2 × 10 m"] },
    ]},
  ],

  parents: [
    { h: "Vekst og modning", p: "Mange spillere er i eller på vei inn i vekstspurten. Da øker risikoen for belastningsplager i hæl og kne. Vi måler derfor høyde én gang i måneden – hjemme, uten sko, om morgenen, mot samme vegg. To målinger, bruk snittet. Vi måler ikke vekt." },
    { h: "Hvordan vi bruker målingene", p: "Treneren bruker høyden til å justere belastningen (grønn, gul eller rød sone). Tallene vises aldri for laget. En spiller i gul eller rød sone er alltid med laget, men gjør mindre av det tyngste." },
    { h: "Si fra om vondt", p: "Det skal aldri koste plass eller spilletid å si fra om smerter. Spilleren sier fra først. Foreldre er velkommen til å ta kontakt." },
    { h: "Samtykke og personvern", p: "Høyde og logg etter økt lagres bare når foresatte har gitt samtykke. Bare trenerteamet ser opplysningene, og de slettes ved sesongslutt. Ta kontakt med treneren for å gi eller trekke samtykke." },
  ],
};

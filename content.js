// Fast innhold i appen. Endre tekstene her – ingen database trengs.
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
        points: ["Keeperen er fri når det er likt antall – bruk ham.", "Skap trekanter og vinkler, og finn den ledige spilleren.", "En lang ball til ledig spiller er lov, og den skal hylles.", "Feil her er læring. Vi prøver igjen."] },
      { id: "frem", name: "Spille oss fremover", phase: "Med ball",
        text: "Progressive pasninger. Målet med ballen er alltid å komme kontrollert til siste tredjedel.",
        points: ["Se fremover først.", "Finn frimannen direkte, eller via en tredjemann (stopper eller sekser).", "Pass and move og veggspill låser opp likt antall.", "Backene gir bredde høyt. Spissen faller ned eller truer bakrom."] },
      { id: "eksplosjon", name: "Eksplosjon", phase: "Med ball",
        text: "På siste tredjedel skal det gå fort. Tør å prøve kule løsninger.",
        points: ["Utfordre 1 mot 1 når du er alene med keeper om du lykkes.", "Overtall og bevegelse foran ballfører.", "Tilbakelegg og avslutninger på ett touch.", "To stoppere – og sekseren når backene går – holder balansen."] },
      { id: "vinne", name: "Vinne ballen", phase: "Uten ball",
        text: "Høyt press er utgangspunktet. Etter balltap går vi alltid rett i gjenpress.",
        points: ["Gjenpress med en gang: vinn ballen, eller kom i balanse og press på nytt.", "Press på pressignaler, alle sammen.", "Riktig side og andreball når de slår langt.", "Nullsituasjoner skal vinnes."] },
    ],
    balance: "Balanse betyr at vi har like mange eller flere forsvarsspillere mellom ballen og eget mål som de har angripere.",
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

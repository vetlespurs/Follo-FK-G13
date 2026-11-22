# Follo G13-appen – slik setter du den opp

Det tar ca. 30–45 minutter første gang. Alt er gratis.

Appen har to deler:
- **Nettsiden** (filene i denne mappa) ligger på **GitHub Pages**.
- **Databasen** (innlogging, spillere, økter, mål, logg og høyde) ligger i **Supabase**.

Før du gjør noe: Åpne `index.html` i nettleseren. Da kjører appen i **demo-modus** med oppdiktede spillere. Øverst kan du bytte mellom trener, spiller og forelder.

---

## Steg 1 – Supabase (databasen)

1. Gå til **supabase.com** og trykk **Start your project**. Lag en konto. Det enkleste er å logge inn med GitHub-kontoen fra steg 2, så gjør gjerne steg 2.1 først.
2. Trykk **New project**:
   - **Name:** `follo-g13`
   - **Database password:** Lag et sterkt passord og lagre det i passordbehandleren din. Du trenger det sjelden.
   - **Region:** Velg en region i **EU**, for eksempel *West EU (Ireland)* eller *Central EU (Frankfurt)*. Det er viktig for personvernet.
   - Trykk **Create new project** og vent et par minutter.
3. **Lag databasen:** Gå til **SQL Editor** i menyen til venstre og trykk **New query**. Åpne fila `supabase/schema.sql`, kopier alt, lim det inn og trykk **Run**. Du skal få «Success».
4. **Lag din egen trenerkode:** Lag en ny query, lim inn linja under og trykk **Run**:
   ```sql
   insert into invite_codes (code, role, name) values ('TRENER2027', 'trener', 'Vetle') returning code;
   ```
   Bytt gjerne `TRENER2027` med noe annet. Koden kan bare brukes én gang og gjelder i 14 dager.
5. **Slå av e-postbekreftelse:** Spillerne logger inn med brukernavn, ikke e-post, så appen sender aldri e-post.
   - Gå til **Authentication → Sign In / Providers → Email**.
   - Slå av **Confirm email** og lagre.
   - Sjekk at **Allow new users to sign up** er på.
6. **Hent nøklene:** Gå til **Project Settings → API**. Kopier **Project URL** og **anon public key**. Du trenger dem i steg 2.6.
   - Anon-nøkkelen er laget for å ligge i nettsiden og er trygg å vise.
   - Den andre nøkkelen, *service_role*, skal du **aldri** legge inn i appen.

## Steg 2 – GitHub (nettsiden)

1. Gå til **github.com** og trykk **Sign up**. Lag en konto. Brukernavnet ditt blir en del av adressen til appen.
2. Trykk **+** øverst til høyre og velg **New repository**:
   - **Repository name:** `follo-g13`
   - Velg **Public**. GitHub Pages er gratis bare for offentlige repoer. Det er bare koden som blir offentlig. Data om spillerne ligger i Supabase og er beskyttet med innlogging.
   - Trykk **Create repository**.
3. Trykk **uploading an existing file**. Dra inn alle filene fra mappa:
   - `index.html`, `app.js`, `content.js`, `config.js`, `style.css`, `manifest.json` og `icon.svg`
   - mappa `supabase` kan du også ta med
   
   Trykk **Commit changes**.
4. Gå til **Settings → Pages**. Under **Branch** velger du `main` og `/ (root)` og trykker **Save**.
5. Etter 1–2 minutter ligger appen på `https://DITTBRUKERNAVN.github.io/follo-g13/`.
6. **Koble appen til databasen:**
   - Åpne `config.js` på GitHub og trykk på blyanten for å redigere.
   - Lim inn **Project URL** og **anon public key** fra steg 1.6 mellom anførselstegnene.
   - Trykk **Commit changes**. Etter et minutt er demo-modusen borte.

## Steg 3 – Første innlogging

1. Åpne adressen til appen og trykk **Første gang?**.
2. Skriv koden fra steg 1.4, velg brukernavn og passord og trykk **Lag konto**.
3. Du er nå trener. Under **Trener** kan du:
   - legge til spillerne (med samtykke-kryss)
   - lage koder til spillere, foreldre og assistenten. Velg rolle *Trener* for assistenten.
   - lage passordkoder til dem som har glemt passordet
4. Under **Kalender** legger du inn økter og kamper. Kryss av for «Gjenta hver uke» for faste økter.
5. Legg appen på hjemskjermen: Åpne den i Safari eller Chrome og velg **Del → Legg til på Hjem-skjerm**.

## Endre innhold

- **Spillmodell, PULS, egentrening og foreldreinfo** står i `content.js`. Rediger fila på GitHub på samme måte som `config.js`.
- PULS-definisjonene fra workshopen legger du inn under `pulsTeam`.
- **Årshjulet (periodene)** ligger i databasen, i tabellen `periods`. Endre det i Supabase under **Table Editor → periods**.

## Personvern – sjekkliste før spillerne inviteres

- [ ] Klubben vet om appen og har godkjent at laget bruker den.
- [ ] Foresatte har fått informasjon og gitt **skriftlig samtykke** til at høyde og logg lagres. Kryss av for samtykke per spiller i appen. Uten kryss lagres verken høyde eller logg.
- [ ] Bare trenerteamet har trener-rolle.
- [ ] Ved sesongslutt sletter du helseopplysningene: Kjør `delete from logs; delete from heights;` i SQL Editor.
- [ ] Del aldri passordet til databasen eller service_role-nøkkelen.

## Greit å vite

- **Gratisprosjekter i Supabase settes på pause etter ca. 7 dager uten bruk**, for eksempel i sommerferien. Logg da inn på supabase.com og trykk **Restore project**. Ingen data går tapt.
- Appen er ikke indeksert av Google (`noindex`).
- Feil eller ønsker om endringer: Si fra til Claude i prosjektet «Follo FK G13».

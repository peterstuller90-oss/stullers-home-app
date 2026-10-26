# Stullers Home (web)

Rodinná webová aplikácia (React + TypeScript + Vite). Stránka beží na domácom počítači, dáta sú v Supabase (cloud).

## Prvé nastavenie

1. Nainštaluj Node.js 20+ (https://nodejs.org).
2. V tomto priečinku: `npm install`
3. Skopíruj `.env.example` na `.env` a doplň `VITE_SUPABASE_URL` a `VITE_SUPABASE_ANON_KEY` (Supabase → Project Settings → API, iba *anon public* kľúč).
4. V Supabase → SQL Editor spusti celý súbor `supabase/schema.sql` (tabuľky, pravidlá, úložisko avatarov).
5. V Supabase → Authentication → Users → *Add user* vytvor 4 účty (zaškrtni *Auto Confirm User*), heslo = 6-miestny PIN:
   `viki@stullers.home`, `peto@stullers.home`, `oto@stullers.home`, `dita@stullers.home`
6. V SQL Editore spusti `supabase/setup-family.sql` (nastaví mená a rodičov) a `supabase/tasks.sql` (úlohy).

## Spustenie doma

`npm start` a nechaj okno otvorené. Na iPhone/iPade v tej istej Wi-Fi otvor `http://<názov-počítača>.local:5173`
(na Macu: Systémové nastavenia → Všeobecné → Zdieľanie → Lokálny názov hostiteľa). V Safari: Zdieľať → Pridať na plochu.

Funguje iba keď je počítač zapnutý, aplikácia spustená a zariadenie je doma na Wi-Fi.

## Appka na iPhone (GitHub Pages)

Appka beží na `https://peterstuller90-oss.github.io/stullers-home-app/`.

Pridanie na plochu: otvor odkaz v **Safari** → tlačidlo **Zdieľať** (štvorček so šípkou) → **Pridať na plochu** → **Pridať**.
Appka sa potom otvára na celú obrazovku s vlastnou ikonou. Prihlásenie PINom treba v appke urobiť raz, potom si ho pamätá.
Úlohy a body sú v Supabase, takže každý mobil vidí to isté. Appka sa obnoví sama, keď ju otvoríš, a každých 30 sekúnd.

Po každom zlúčení zmeny do vetvy `main` sa appka sama zostaví a nahrá (GitHub Actions, súbor `.github/workflows/deploy.yml`, do vetvy `gh-pages`).
Ručne sa dá zostaviť takto:

```
BASE_PATH=/stullers-home-app/ npm run build
```

Verejný (publishable) kľúč Supabase je v zostavenej stránke viditeľný, to je v poriadku: dáta chránia pravidlá RLS v databáze. Service role kľúč nikdy nepatrí do aplikácie ani do repozitára. PINy nepatria do kódu ani do repozitára.

# adritcm.cz – Adriana Chylová, tradiční čínská medicína

Statický web (HTML + CSS + JS), bez build kroku a bez externích služeb (fonty jsou ve složce `fonts/`). Stačí nahrát obsah složky na hosting (WEDOS) přes FTP.

## Obrázky (`img/`)
- `portrait.webp` – portrét z banneru (úvodní sekce)
- `logo-240.webp`, `logo-720.webp` – kulaté TCM logo (menu, kontakt, patička)
- `icon-180.png`, `icon-192.png`, `../favicon.ico` – ikony
- `og.jpg` – náhled při sdílení na sociálních sítích (1200×630)
- `flower.svg` – květ života (dekorace)

Portrét je vyříznutý z banneru, takže je mírně měkký. S původní fotkou v plné velikosti bude web ostřejší: stačí přepsat `img/portrait.webp`.

## Co upravit
- Služby: `index.html`, sekce `#sluzby` (hlavní: tuina, akupresura, baňkování; doplňkově: moxování, dietetika, diagnostika)
- Texty k elementům: `js/main.js`, objekt `DATA`
- Chybí: otevírací doba, ceník, PSČ (doplnit do JSON-LD v `index.html`)

# adritcm.cz – Adriana Chylová, tradiční čínská medicína

Statický web (HTML + CSS + JS), bez build kroku a bez externích služeb. Stačí nahrát obsah složky na hosting (WEDOS) přes FTP.

## Fotky (zatím chybí – web funguje i bez nich)
Vložte do složky `img/`:

| Soubor | Kde se použije | Doporučení |
|---|---|---|
| `adriana.jpg` | pozadí úvodní sekce (fialově podbarvené) | min. 1600 px široká, portrét vpravo |
| `caj.jpg` | pozadí sekce Kontakt (čaj, vějíř) | min. 1600 px široká |

Před nahráním fotky zmenšete (cca 200–300 kB), např. na squoosh.app.

## Co upravit
- Texty služeb: `index.html`, sekce `#sluzby`
- Texty k elementům: `js/main.js`, objekt `DATA`
- Chybí: otevírací doba, ceník, PSČ (doplnit do JSON-LD v `index.html`)

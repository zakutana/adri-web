# adritcm.cz – Adriana Chylová, tradiční čínská medicína

Statický web (HTML + CSS + JS), bez build kroku a bez externích služeb: fonty i obrázky jsou ve složce. Stačí nahrát obsah složky na hosting (WEDOS) přes FTP. Mapa se načte z Googlu až po kliknutí.

## Jak web začíná
Úvod kopíruje Facebook stránku: celý cover (banner), kulaté logo přes jeho okraj, jméno a tlačítka (telefon, e-mail, adresa). Pod tím následují sekce O TČM, Služby, Pět elementů a Kontakt.

## Obrázky (`img/`)
| Soubor | Použití |
|---|---|
| `cover-900/1500/2400.webp` | cover v úvodu (z původního banneru, tři velikosti pro různé displeje) |
| `portrait.webp` | portrét v sekci O TČM (vyříznutý z banneru, bez textu) |
| `logo-240/480.webp` | kulaté TCM logo (menu, profil, kontakt, patička) |
| `bamboo.svg` | dekorace (bambusové siluety) |
| `og.jpg` | náhled při sdílení odkazu na sociálních sítích (1200×630) |
| `icon-180/192.png`, `../favicon.ico` | ikony |

Banner i portrét jsou z jednoho banneru o šířce 1500 px. S původním souborem fotky ve vyšším rozlišení bude web ostřejší. Stačí přepsat `portrait.webp` a `cover-*.webp`.

## Co upravit
- Texty služeb: `index.html`, sekce `#sluzby`
- Texty k elementům: `index.html`, sekce `#elementy`
- Chybí: otevírací doba, ceník, PSČ (PSČ doplnit do JSON-LD v `index.html`)

## Poznámky
- Písma: Cinzel, Cormorant Garamond, Source Sans 3, Playwrite CZ a malá podmnožina Ma Shan Zheng pro čínské znaky (木火土金水…), vše ve `fonts/`.
- `.htaccess` nastavuje HTTPS, kompresi, cache a bezpečnostní hlavičky (včetně CSP).
- Animace respektují nastavení „omezit pohyb“ v systému.

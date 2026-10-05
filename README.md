# adritcm.cz – Adriana Chylová, tradiční čínská medicína

Statický web (HTML + CSS + JS), bez build kroku a bez externích služeb: fonty i obrázky jsou ve složce. Stačí nahrát obsah složky na hosting (WEDOS) přes FTP. Mapa se načte z Googlu až po kliknutí.

## Jak web začíná
Úvod kopíruje Facebook stránku: celý cover (banner), kulaté logo přes jeho okraj, jméno a tlačítka (telefon, e-mail, adresa). Pod tím následují sekce O TČM, Služby, Pět elementů a Kontakt.

## Obrázky (`img/`)
| Soubor | Použití |
|---|---|
| `cover-900/1500/2400.webp` | cover v úvodu (z původního banneru, tři velikosti pro různé displeje) |
| `logo-240/480.webp` | kulaté TCM logo (menu, profil, kontakt, patička) |
| `bamboo.svg` | dekorace (bambusové siluety) |
| `og.jpg` | náhled při sdílení odkazu na sociálních sítích (1200×630) |
| `icon-180/192.png`, `../favicon.ico` | ikony |


Cover je z banneru o šířce 1500 px. S původním souborem ve vyšším rozlišení bude web ostřejší: stačí přepsat `cover-*.webp`. Její fotka je na webu jen jednou, v úvodu.

## Co upravit
- Texty jsou podle letáku (Od bolesti k rovnováze, Pomáhám při, služby, Malé kroky k velké změně). Najdete je v `index.html`: sekce `#tcm`, `#sluzby`, `#kontakt`
- Texty k elementům: `index.html`, sekce `#elementy`
- Chybí: otevírací doba, ceník, PSČ (PSČ doplnit do JSON-LD v `index.html`)

## Poznámky
- Písma: Cinzel, Cormorant Garamond, Source Sans 3, Playwrite CZ a malá podmnožina Ma Shan Zheng pro čínské znaky (木火土金水…), vše ve `fonts/`.
- `.htaccess` nastavuje HTTPS, kompresi, cache a bezpečnostní hlavičky (včetně CSP).
- Animace respektují nastavení „omezit pohyb“ v systému.

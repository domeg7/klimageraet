# SEO Baseline — das-klimageraet.ch (Stand 2026-05-12)

Erfasst vor dem Redesign. Dient als Vergleichsbasis, damit beim Relaunch keine Rankings verloren gehen.

## Original Meta-Tags

```
<title>Klimagerät X-One ohne Aussenteil - www.apitec.ch</title>
<meta name="description" content="X-One: Das Klimagerät ohne Aussenteil sorgt für ein behagliches Raumklima an heissen Sommertagen. leise - elegant - energieeffizient.">
<link rel="canonical" href="https://das-klimageraet.ch/">

<meta property="og:locale" content="de_DE">
<meta property="og:type" content="website">
<meta property="og:title" content="Klimagerät X-One ohne Aussenteil - www.apitec.ch">
<meta property="og:description" content="X-One: Das Klimagerät ohne Aussenteil sorgt für ein behagliches Raumklima an heissen Sommertagen. leise - elegant - energieeffizient.">
<meta property="og:url" content="https://das-klimageraet.ch/">
<meta property="og:site_name" content="Klimagerät X-One">
```

## Original Schema (Yoast-generiert)

- Organization "Apitec AG" mit Logo
- WebSite mit SearchAction
- WebPage

Im Redesign **erweitert um**: `LocalBusiness` (mit Adresse, Telefon, Geo-Daten), `Product` mit `Offer` (Preis 3050 CHF), und `FAQPage` (5 strukturierte Antworten — boostet AI-Visibility laut Princeton-GEO-Studie um bis zu +40%).

## URL-Struktur (vor Redesign)

```
/                  → Homepage (One-Pager)
/datenschutz/      → Datenschutz
/impressum/        → Impressum
/kontakt/          → Kontakt
```

Die Seite ist im Original ein **One-Pager** mit allen Inhalten auf der Startseite. Das Redesign behält diese Struktur (alle Anker via `#produkt`, `#einsatz`, `#installation`, `#referenzen`, `#preis`, `#kontakt`). Keine URL-Änderungen nötig → keine Redirects nötig für die Hauptseite.

## Original Headings-Struktur (relevante Keywords)

- **H1 (effektiv im Hero):** "X-One: Das Klimagerät ohne Ausseneinheit"
- **H2 Auswahl:** "Qualitätsvorteil", "Die Bedienung war noch nie so individuell", "Wo kommt das Klimagerät X-One zum Einsatz?", "Das sagen unsere Kunden", "Energieeffizienz", "Wer wir sind", "Was Sie für Ihre Investition erhalten"

**Hauptkeywords (sichtbar im Original):**
- Klimagerät ohne Aussenteil
- Klimagerät ohne Ausseneinheit
- X-One
- Inverter-Technologie
- Klimagerät Schweiz / Meggen

## robots.txt (Original)

```
User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
Sitemap: https://das-klimageraet.ch/wp-sitemap.xml
```

Original blockiert **keine AI-Bots explizit**, erlaubt sie aber auch nicht namentlich. Im Redesign **explizit freigegeben**: GPTBot, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, ChatGPT-User, Bingbot.

## sitemap.xml

Original: WordPress-generiert (`/wp-sitemap.xml`). Bleibt nach Relaunch erhalten.

## Was im Redesign **verbessert** wurde (Recap)

| Punkt | Vorher | Nachher |
|---|---|---|
| Title-Tag | 56 Zeichen, generisch | "X-One Klimagerät ohne Aussenteil · Apitec AG, Meggen" (52 Zeichen, ort + brand) |
| Meta-Description | 132 Z., kein CTA, keine Zahlen | 209 Z. mit "3'000 Geräte", Meggen, klare Aussage |
| og:locale | `de_DE` (falsch — Schweiz!) | `de_CH` |
| og:image | nicht gesetzt | Hero-Bild 1200×630 |
| Twitter Cards | fehlten | gesetzt |
| LocalBusiness Schema | fehlte | komplett mit Adresse, Tel, Geo |
| Product Schema mit Offer | fehlte | mit Preis 3050 CHF |
| FAQPage Schema | fehlte | 5 Q&A — wichtig für AI-Zitierungen |
| AI-Bot Freigabe | implizit | explizit in robots.txt |
| GEO-Optimierung | keine | answer-first, konkrete Zahlen, klare H2/H3-Struktur, Originalzitate als Trust-Signal |

## Empfehlungen für den Relaunch

1. **`seo-geo` Validation-Workflow** ausführen (`python3 ~/.claude/skills/seo-geo/scripts/seo_audit.py https://das-klimageraet.ch`) **vor** dem DNS-Switch.
2. Google Search Console und Bing Webmaster Tools nach Relaunch refreshen.
3. Schema-Markup via [Rich Results Test](https://search.google.com/test/rich-results) validieren.
4. 6 Wochen Ranking-Monitoring für Hauptkeyword "Klimagerät ohne Aussenteil".

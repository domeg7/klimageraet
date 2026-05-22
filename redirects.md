# URL-Redirects beim Relaunch

Die Originalseite ist ein **One-Pager**. Im Redesign bleibt diese Struktur erhalten — alle Hauptinhalte sind auf `/`. Es sind keine 301-Redirects für Inhalts-URLs notwendig.

## Status

| Alte URL | Neue URL | Status |
|----------|----------|--------|
| `/` | `/` | unverändert |
| `/kontakt/` | `/kontakt/` | unverändert (separate Seite folgt in Phase 2; vorläufig Anker `/#kontakt` als Brücke) |
| `/impressum/` | `/impressum/` | unverändert (Inhalt in Phase 2) |
| `/datenschutz/` | `/datenschutz/` | unverändert (Inhalt in Phase 2) |
| `/wp-sitemap.xml` | `/sitemap.xml` | **301 empfohlen** |

## Server-Konfiguration

Falls Apache / .htaccess:

```apache
RewriteEngine On

# Alte WordPress-Sitemap auf neue weiterleiten
RewriteRule ^wp-sitemap\.xml$ /sitemap.xml [R=301,L]

# wp-content Image-URLs während Übergangsphase erhalten
# (Bilder mit den Original-Pfaden bleiben temporär erreichbar, bis externe Links/Caches aktualisiert sind)
```

Falls Nginx:

```nginx
rewrite ^/wp-sitemap\.xml$ /sitemap.xml permanent;
```

## Nach dem Switch

1. `site:das-klimageraet.ch` in Google prüfen — wenn alte URLs auftauchen, die nicht in der neuen Sitemap sind, **noch nicht entfernen**, sondern 14 Tage abwarten.
2. Google Search Console → "URL Inspection" für die wichtigsten Keyword-Treffer der alten Seite.
3. Bing Webmaster Tools → Sitemap-Resubmit.

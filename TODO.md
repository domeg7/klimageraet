# Redesign TODO

## Phase 1 — Homepage ✓ FERTIG
- [x] Homepage als One-Pager gebaut (`index.html`)
- [x] Bilder integriert (21 Originalfotos, kein Stock)
- [x] Navigation mit Smooth-Scroll + Mobile-Menu
- [x] Toast-Fallback für nicht implementierte Links
- [x] SEO: Title, Meta, OG-Tags, Twitter Cards
- [x] Schema: LocalBusiness + Product (Offer) + FAQPage
- [x] robots.txt mit AI-Bot-Freigabe
- [x] sitemap.xml
- [x] Favicon (Inline-SVG)
- [x] Responsive (Desktop 1440, Tablet 1024, Mobile 768/375)

## Phase 2 — Unterseiten (nach Rücksprache)
- [ ] **Impressum** (Pflicht-Subpage) — Inhalt aus apitec.ch / Original übernehmen
- [ ] **Datenschutz** (Pflicht-Subpage) — DSG-Schweiz-konform, Cookies dokumentieren
- [ ] **Kontakt** (eigene Seite mit Map?) — Optional, aktuell Anker auf der Homepage

## Phase 3 — Content-Erweiterungen (optional)
- [ ] Sektion "Heizungen" (laut Original-Footer "Klimageräte & Heizungen" — aktuell nur Klimageräte sichtbar)
- [ ] Detailseite X-One Produkt mit technischen Spezifikationen, Datenblatt-PDF zum Download (würde GEO-Sichtbarkeit weiter erhöhen)
- [ ] Blog/Magazin mit Themen "Kühlung in Minergie-Häusern", "Klimagerät vs. mobile Klimaanlage" → SEO-Longtail

## Phase 4 — Technisches (vor Go-Live)
- [ ] Bilder via `cwebp` zu WebP konvertieren + `<picture>` Source-Sets
- [ ] OG-Image generieren (echte 1200×630 PNG statt Verweis auf Hero-Foto)
- [ ] Performance: Lighthouse-Score prüfen, Ziel ≥ 90 mobil
- [ ] DNS-Switch nur **nach** `seo-geo` Validation-Workflow
- [ ] Google Search Console: alte Sitemap unsubmit, neue submitten

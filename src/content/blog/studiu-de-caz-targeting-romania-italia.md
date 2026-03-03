---
title: "Cum țintim exact companiile potrivite: studiu de caz România → Italia"
description: "Studiu de caz WebSEM: cum calificăm automat companiile românești exportatoare în Italia folosind AI, înainte să trimitem un singur email de outreach."
pubDate: 2026-03-03
author: "WebSEM Team"
category: "outreach"
tags: ["Outreach B2B", "Targeting", "AI", "Export", "Romania", "Italia", "Studiu de Caz", "Lead Qualification"]
featured: true
draft: false
---

<div class="key-takeaway">
<strong>TL;DR</strong>
Majoritatea campaniilor de outreach B2B trimit același mesaj la mii de companii — și se miră de ce rata de răspuns e sub 1%. La WebSEM, nicio companie nu primește un email dacă nu a trecut mai întâi printr-un proces automat de calificare AI. În acest studiu de caz, arătăm exact cum identificăm firmele românești care exportă în Italia — cu criterii concrete, date verificate și verdict AI pe fiecare lead.
</div>

---

## Problema: volumul a înlocuit relevanța

Outreach-ul B2B are o problemă fundamentală pe care puțini o recunosc deschis: **volumul a înlocuit relevanța**.

Majoritatea campaniilor arată așa: cumperi o listă de 10.000 de contacte, scrii un email "personalizat" cu `{Prenume}` și `{Companie}`, apeși butonul de trimitere și aștepți. Rezultatul?

<div class="stat-highlight">
<div class="stat-card">
<strong>< 1%</strong>
<span>Rata de răspuns a campaniilor generice de cold outreach</span>
</div>
<div class="stat-card">
<strong>90%+</strong>
<span>Din emailuri sunt ignorate sau marcate ca spam</span>
</div>
<div class="stat-card">
<strong>0 lei</strong>
<span>ROI-ul real al majorității campaniilor de masă</span>
</div>
</div>

Problema nu este outreach-ul în sine — este faptul că trimiți mesaje către companii care **nu au nicio legătură** cu ce oferi. Trimiți o propunere de export către o firmă care vinde doar local. Trimiți servicii de logistică internațională unei companii cu un singur punct de lucru în Brașov.

**Volumul nu e un avantaj. Este o iluzie scumpă.**

---

## Abordarea WebSEM: „Qualify First, Contact Second"

La WebSEM, am inversat complet procesul. Filozofia noastră este simplă:

> **Înainte să trimitem primul email, fiecare companie din baza de date trece printr-un proces automat de calificare AI.**

Nu calificăm manual — ar fi imposibil la volume de mii de companii. Nu calificăm superficial — un filtru pe industrie nu e suficient. Calificăm **profund**, folosind date reale despre fiecare companie: descrierea oficială, conținutul site-ului, paginile de About și Contact, meta tag-urile, referințele la piețe și parteneri.

Doar companiile care îndeplinesc **toate criteriile specifice** ale campaniei primesc outreach. Restul? Nu sunt ignorate — sunt pur și simplu **nerelevante pentru campania respectivă**. Poate vor fi relevante pentru alta.

Rezultatul: fiecare email care pleacă din sistemul nostru ajunge la o companie despre care **știm deja** că are legătură cu subiectul mesajului.

---

## Studiu de caz: firme românești exportatoare în Italia

Să trecem de la teorie la practică. Iată exact cum funcționează pipeline-ul nostru de calificare pentru o campanie reală: **identificarea companiilor din România care exportă activ în Italia**.

### Datele pe care le colectăm

Pentru fiecare companie din baza de date, sistemul nostru extrage și analizează mai multe surse de informații:

| Sursă de date | Ce conține | Exemplu |
|---|---|---|
| **account.country** | Țara de înregistrare a companiei | "Romania" |
| **account.description** | Descrierea oficială a companiei | "Producător de mobilă cu export în Italia și Germania" |
| **any_scraped_info** | Date extrase automat de pe site | Pagina About, pagina Contact, meta tags, conținut vizibil |

Aceste date nu sunt introduse manual. Sunt **extrase, verificate și structurate automat** de sistemul nostru de scraping înainte ca AI-ul să facă evaluarea.

### Criteriile de calificare

Pentru această campanie, am definit două criterii — **ambele trebuie îndeplinite** simultan:

| Criteriu | Regulă | De ce contează |
|---|---|---|
| **Origine Română** | `account.country = "Romania"` | Campania vizează strict companii înregistrate în România |
| **Export către Italia** | Descrierea sau datele scrape conțin: "Italy", "Italia", "export", "exporta", "piața italiană", "distribuitori italieni" | Confirmă că firma are activitate reală pe piața italiană |

Nu este suficient ca o companie să fie din România. Nu este suficient să menționeze vag "export". Trebuie să existe **dovezi concrete** în datele companiei că are legătură cu piața italiană.

### Verdictul AI — cum arată în practică

Sistemul analizează datele fiecărei companii și returnează un verdict structurat în format JSON. Iată un exemplu real de companie **calificată**:

```json
{
  "response": "Qualified",
  "reasoning": "Compania este înregistrată în România și site-ul conține referințe explicite la export în Italia și parteneriate cu distribuitori italieni."
}
```

Ce s-a întâmplat aici: AI-ul a verificat că firma este din România (criteriul 1 ✓), apoi a scanat descrierea și datele de pe site și a găsit mențiuni despre Italia, exporturi și distribuitori locali (criteriul 2 ✓). Ambele criterii îndeplinite → **Qualified**.

Și iată un exemplu de companie **necalificată**:

```json
{
  "response": "Not Qualified",
  "reasoning": "Compania este din România dar nu există nicio referință la Italia sau activitate de export în descriere sau datele extrase de pe site."
}
```

Aici, firma era într-adevăr românească, dar nicăieri pe site-ul lor, în descriere sau în datele colectate nu apărea vreo referință la Italia sau la activitate de export. Poate vând doar pe piața locală. Poate exportă, dar în alte direcții. **Nu contează** — pentru această campanie, nu sunt relevante.

### Ce face procesul ăsta diferit

Această calificare se întâmplă **pentru fiecare lead din baza de date** — nu pentru un eșantion, nu pentru top 100, ci pentru **fiecare companie în parte**. Automat. Înainte ca vreun mesaj să fie redactat sau trimis.

Asta înseamnă că atunci când echipa de outreach începe să scrie emailuri, lucrează doar cu o listă de companii despre care **știu cu certitudine** că:
- Sunt din România
- Au activitate de export documentată către Italia
- Au fost verificate automat din surse multiple

---

## Ce se întâmplă după calificare

Calificarea este doar primul pas. Companiile care primesc verdictul "Qualified" intră în faza următoare: **generarea de mesaje personalizate**.

Dar nu personalizare de suprafață — nu `{Prenume}` și `{Companie}`. Emailul este construit pe baza:

- **Numele și titlul contactului** — CEO, Director Export, Business Development Manager
- **Industria companiei** — producție, FMCG, textile, componente auto
- **Istoricul profesional al contactului** — ce roluri a avut, în ce companii a lucrat
- **Propunerea de valoare adaptată** — formulată specific pentru contextul lor de export în Italia

Rezultatul: mesajul primit de un director de export nu sună ca un template trimis la 5.000 de persoane. Sună ca un mesaj scris de cineva care **știe exact cu ce se ocupă firma lui** și de ce ar fi relevant să discute.

---

## Rezultate și concluzii

<div class="stat-highlight">
<div class="stat-card">
<strong>23%</strong>
<span>Din companiile analizate au trecut de filtrul de calificare</span>
</div>
<div class="stat-card">
<strong>100%</strong>
<span>Din emailurile trimise au ajuns la companii verificate ca relevante</span>
</div>
<div class="stat-card">
<strong>0</strong>
<span>Emailuri trimise către companii nerelevante</span>
</div>
</div>

Dintr-o bază de date de mii de companii românești, doar aproximativ un sfert au trecut de calificare — cele care aveau dovezi reale de activitate pe piața italiană. Restul nu au fost deranjate cu mesaje irelevante.

**Beneficiul cheie:** volumul nu mai e un avantaj al concurenței. Oricine poate trimite 10.000 de emailuri. Dar câte ajung la companii care chiar exportă în Italia? Câte sunt scrise pe baza unor date verificate? Câte sună ca o conversație reală, nu ca un blast de marketing?

**Precizia devine avantajul tău competitiv.**

Și asta se vede în rezultate: rate de răspuns semnificativ peste media industriei, reputație de domeniu intactă, și conversații care pornesc de la un context real — nu de la un template generic.

---

<div class="cta-box">
<strong>Vrei să vedem câte companii din nișa ta exportă deja în piața ta țintă?</strong>
<p>WebSEM poate rula o analiză similară pentru orice combinație țară-piață. Îți arătăm exact câte companii din baza noastră se califică pentru campania ta — înainte să plătești ceva.</p>
<a href="/contact" class="cta-link">Solicită o analiză gratuită →</a>
</div>

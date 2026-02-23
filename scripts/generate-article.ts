import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

// ─── Configuration ───────────────────────────────────────────────────────────

const TOPICS_FILE = join(import.meta.dirname, "pharma-topics.json");
const BLOG_DIR = join(import.meta.dirname, "..", "src", "content", "blog");
const MODEL = "claude-sonnet-4-20250514";
const MAX_RETRIES = 1;

// ─── Types ───────────────────────────────────────────────────────────────────

interface Topic {
  id: string;
  subject: string;
  hints: {
    angle: string;
    targetAudience: string;
    keyPoints: string[];
  };
  status: "pending" | "published" | "failed";
  publishedDate: string | null;
  slug: string | null;
}

interface TopicsFile {
  defaultAuthor: string;
  topics: Topic[];
}

interface ParsedArticle {
  title: string;
  description: string;
  tags: string[];
  content: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function parseArticle(raw: string): ParsedArticle {
  const titleMatch = raw.match(/===TITLE===\s*\n([\s\S]*?)(?=\n===)/);
  const descMatch = raw.match(/===DESCRIPTION===\s*\n([\s\S]*?)(?=\n===)/);
  const tagsMatch = raw.match(/===TAGS===\s*\n([\s\S]*?)(?=\n===)/);
  const contentMatch = raw.match(/===CONTENT===\s*\n([\s\S]*?)$/);

  if (!titleMatch || !descMatch || !tagsMatch || !contentMatch) {
    throw new Error("Failed to parse Claude output — missing markers");
  }

  return {
    title: titleMatch[1].trim(),
    description: descMatch[1].trim().slice(0, 160),
    tags: tagsMatch[1]
      .trim()
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    content: contentMatch[1].trim(),
  };
}

// ─── System Prompts ──────────────────────────────────────────────────────────

const OUTLINE_SYSTEM = `Ești un analist pharma senior cu experiență în suplimente alimentare, nutraceutice și farmacologie clinică. Scrii în limba română, cu diacritice corecte.

Sarcina ta: creează un OUTLINE detaliat pentru un articol de analiză pharma.

Outline-ul trebuie să includă:
- Structura secțiunilor (H2 și H3)
- Puncte cheie pentru fiecare secțiune (3-5 bullet points)
- Date și cifre specifice de inclus (procente, doze, costuri)
- Un TL;DR propus (2-3 propoziții)
- 3-4 statistici vizuale potrivite pentru stat-cards
- Sugestii pentru tabele comparative (coloane și rânduri)
- Concluzie cu recomandări practice

Formatează outline-ul clar cu markdown. Fii specific — nu da instrucțiuni vagi, ci scrie exact ce date și argumente trebuie incluse.`;

const ARTICLE_SYSTEM = `Ești un analist pharma senior cu experiență în suplimente alimentare, nutraceutice și farmacologie clinică. Scrii în limba română, cu diacritice corecte.

Sarcina ta: scrie un ARTICOL COMPLET de analiză pharma pe baza outline-ului furnizat.

REGULI STRICTE DE FORMAT:
1. Răspunde EXACT în acest format (cu marcajele):

===TITLE===
[Titlul articolului — max 70 caractere, captivant, informativ]
===DESCRIPTION===
[Meta description — exact 130-160 caractere, include cuvinte cheie]
===TAGS===
[tag1, tag2, tag3, tag4, tag5]
===CONTENT===
[Conținutul complet al articolului în markdown]

2. Conținutul articolului:
- 2500-4000 cuvinte
- Folosește H2 (##) și H3 (###) pentru structură
- Include separatoare (---) între secțiunile majore
- Primul element: un div key-takeaway cu TL;DR
- Include 1-2 blocuri stat-highlight cu stat-card-uri
- Include cel puțin 1-2 tabele markdown comparative
- Ton profesional dar accesibil — nu academic arid, ci analiză practică
- Include date specifice: procente, doze în mg, costuri comparative
- Nu inventa studii sau autori specifici — folosește formulări ca "studiile arată", "meta-analizele recente sugerează"
- Termină cu o secțiune de concluzii practice și recomandări

COMPONENTE HTML disponibile:

TL;DR box:
<div class="key-takeaway">
<strong>TL;DR</strong>
[Text rezumat aici]
</div>

Statistici vizuale:
<div class="stat-highlight">
<div class="stat-card">
<strong>[Cifră]</strong>
<span>[Descriere]</span>
</div>
</div>

Tabele markdown standard:
| Coloană 1 | Coloană 2 | Coloană 3 |
|---|---|---|
| date | date | date |

Separatoare între secțiuni:
---`;

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Read topics
  const topicsData: TopicsFile = JSON.parse(readFileSync(TOPICS_FILE, "utf-8"));

  // 2. Find first pending topic
  const topic = topicsData.topics.find((t) => t.status === "pending");
  if (!topic) {
    console.log("No pending topics found. Exiting.");
    process.exit(0);
  }

  console.log(`Generating article for topic: ${topic.subject}`);

  // 3. Initialize Claude client
  const client = new Anthropic();

  let article: ParsedArticle;
  let attempts = 0;

  while (attempts <= MAX_RETRIES) {
    try {
      // 4. Generate outline
      console.log("Step 1/2: Generating outline...");
      const outlineResponse = await client.messages.create({
        model: MODEL,
        max_tokens: 4096,
        system: OUTLINE_SYSTEM,
        messages: [
          {
            role: "user",
            content: `Creează un outline detaliat pentru următorul articol de analiză pharma:

**Subiect:** ${topic.subject}
**Unghi editorial:** ${topic.hints.angle}
**Audiență țintă:** ${topic.hints.targetAudience}
**Puncte cheie de acoperit:**
${topic.hints.keyPoints.map((p) => `- ${p}`).join("\n")}

Outline-ul trebuie să fie suficient de detaliat încât un alt redactor să poată scrie articolul complet doar pe baza lui.`,
          },
        ],
      });

      const outline =
        outlineResponse.content[0].type === "text"
          ? outlineResponse.content[0].text
          : "";

      if (!outline) {
        throw new Error("Empty outline received from Claude");
      }

      console.log("Outline generated successfully.");

      // 5. Generate full article from outline
      console.log("Step 2/2: Generating full article...");
      const articleResponse = await client.messages.create({
        model: MODEL,
        max_tokens: 8192,
        system: ARTICLE_SYSTEM,
        messages: [
          {
            role: "user",
            content: `Scrie articolul complet pe baza acestui outline:

${outline}

**Subiect original:** ${topic.subject}
**Audiență:** ${topic.hints.targetAudience}

IMPORTANT: Respectă EXACT formatarea cu marcajele ===TITLE===, ===DESCRIPTION===, ===TAGS===, ===CONTENT===. Scrie în română cu diacritice.`,
          },
        ],
      });

      const rawArticle =
        articleResponse.content[0].type === "text"
          ? articleResponse.content[0].text
          : "";

      if (!rawArticle) {
        throw new Error("Empty article received from Claude");
      }

      // 6. Parse the response
      article = parseArticle(rawArticle);
      console.log(`Article parsed: "${article.title}"`);
      break;
    } catch (err) {
      attempts++;
      if (attempts > MAX_RETRIES) {
        console.error(`Failed after ${attempts} attempts:`, err);
        topic.status = "failed";
        writeFileSync(TOPICS_FILE, JSON.stringify(topicsData, null, 2) + "\n");
        process.exit(1);
      }
      console.warn(`Attempt ${attempts} failed, retrying...`, err);
    }
  }

  // 7. Generate slug and check for duplicates
  let slug = slugify(article!.title);
  const fileName = `${slug}.md`;
  let filePath = join(BLOG_DIR, fileName);

  if (existsSync(filePath)) {
    slug = `${slug}-${todayISO()}`;
    filePath = join(BLOG_DIR, `${slug}.md`);
    console.log(`Slug collision detected, using: ${slug}`);
  }

  // 8. Build frontmatter and write file
  const today = todayISO();
  const frontmatter = `---
title: "${article!.title.replace(/"/g, '\\"')}"
description: "${article!.description.replace(/"/g, '\\"')}"
pubDate: ${today}
author: "${topicsData.defaultAuthor}"
heroImage: "/pharma-hero.png"
heroImageAlt: "Analiză competitivă pharma - WebSEM Niche Domination"
category: "pharma"
tags: ${JSON.stringify(article!.tags)}
featured: false
draft: false
---`;

  const fullContent = `${frontmatter}\n\n${article!.content}\n`;

  writeFileSync(filePath, fullContent, "utf-8");
  console.log(`Article written to: ${filePath}`);

  // 9. Update topics file
  topic.status = "published";
  topic.publishedDate = today;
  topic.slug = slug;
  writeFileSync(TOPICS_FILE, JSON.stringify(topicsData, null, 2) + "\n");
  console.log("Topics file updated.");

  // 10. Git commit & push
  try {
    const blogFile = `src/content/blog/${slug}.md`;
    const topicsRel = "scripts/pharma-topics.json";

    execSync(`git add "${blogFile}" "${topicsRel}"`, { stdio: "inherit" });
    execSync(
      `git commit -m "Add pharma article: ${article!.title.slice(0, 50)}"`,
      { stdio: "inherit" }
    );
    execSync("git push", { stdio: "inherit" });
    console.log("Changes pushed to remote.");
  } catch (err) {
    console.error("Git push failed:", err);
    // Article is still written locally — don't mark as failed
    process.exit(1);
  }

  console.log("Done!");
}

main();

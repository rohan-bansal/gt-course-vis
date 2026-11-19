#!/usr/bin/env node
// Syncs src/lib/data/semesters/ with the GT Scheduler crawler.
//
//   npm run sync:semesters             download new terms, refresh changed ones
//   npm run sync:semesters -- --dry-run  report what would change, write nothing
//
// Run weekly by .github/workflows/sync-semesters.yml.

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const CRAWLER_BASE = "https://gt-scheduler.github.io/crawler-v2";
// Oldest term the site lists. Older crawler terms use an earlier format.
const MIN_TERM = "202302";
// Only the newest N terms (upcoming, current, just ended) are refreshed.
// Older terms are downloaded once if missing and then left alone: re-crawls
// of finished terms tend to lose data (Oscar drops instructors, etc.).
const REFRESH_LATEST = 3;
const OUT_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/lib/data/semesters",
);
const DRY_RUN = process.argv.includes("--dry-run");

async function fetchText(url, attempts = 3) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      if (i >= attempts) throw new Error(`GET ${url} failed: ${err.message}`);
      await new Promise((r) => setTimeout(r, 1000 * i));
    }
  }
}

function assertCatalog(term, data) {
  const count = Object.keys(data?.courses ?? {}).length;
  if (!data || typeof data.courses !== "object" || count === 0) {
    throw new Error(
      `${term}: crawler response has no courses; refusing to write it`,
    );
  }
  return count;
}

// Only the fields the site reads (see src/lib/data/parse.js). Each crawl
// renumbers the crawler's lookup tables (`caches`, date-range/location
// indices), so comparing whole files would rewrite every term every week.
function fingerprint(data) {
  const courses = Object.keys(data.courses)
    .sort()
    .map((id) => {
      const [title, sections, prereqs, description] = data.courses[id];
      const secs = Object.keys(sections ?? {})
        .sort()
        .map((code) => {
          const s = sections[code];
          const instructors = (s?.[1] ?? []).flatMap((m) => m?.[4] ?? []);
          return [code, s?.[0], s?.[2], s?.[7], instructors];
        });
      return [id, title, prereqs, description, secs];
    });
  return JSON.stringify(courses);
}

async function readLocal(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return null;
    throw err;
  }
}

async function main() {
  const index = JSON.parse(await fetchText(`${CRAWLER_BASE}/index.json`));
  const terms = (index.terms ?? [])
    .filter((t) => t.finalized && /^\d{6}$/.test(t.term) && t.term >= MIN_TERM)
    .map((t) => t.term)
    .sort();

  if (terms.length === 0)
    throw new Error("Crawler index lists no usable terms");

  await mkdir(OUT_DIR, { recursive: true });
  const added = [];
  const updated = [];

  const refreshable = new Set(terms.slice(-REFRESH_LATEST));

  for (const term of terms) {
    const path = join(OUT_DIR, `${term}.json`);
    const local = await readLocal(path);

    if (local && !refreshable.has(term)) {
      console.log(`  ${term}  frozen`);
      continue;
    }

    const text = await fetchText(`${CRAWLER_BASE}/${term}.json`);
    const remote = JSON.parse(text);
    const count = assertCatalog(term, remote);

    if (local) {
      // Never replace a local file with an older crawl.
      if (String(remote.updatedAt ?? "") <= String(local.updatedAt ?? "")) {
        console.log(`  ${term}  kept (local copy is as new or newer)`);
        continue;
      }
      if (fingerprint(local) === fingerprint(remote)) {
        console.log(`  ${term}  unchanged`);
        continue;
      }
      const localCount = Object.keys(local.courses ?? {}).length;
      if (count < localCount * 0.5) {
        throw new Error(
          `${term}: crawler has ${count} courses vs ${localCount} locally; looks like a partial crawl, refusing to write it`,
        );
      }
    }

    (local ? updated : added).push(term);
    console.log(`  ${term}  ${local ? "updated" : "added"} (${count} courses)`);

    if (!DRY_RUN) {
      const tmp = `${path}.tmp`;
      await writeFile(tmp, text);
      await rename(tmp, path);
    }
  }

  console.log(
    `\n${DRY_RUN ? "[dry run] " : ""}${added.length} added, ${
      updated.length
    } updated, ` + `${terms.length - added.length - updated.length} unchanged`,
  );
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

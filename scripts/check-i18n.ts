// Lists English data strings that have no Spanish entry in src/i18n/es-data.ts.
import { EPISODES, EPISODE_NOTES, SEASONS } from '../src/data/episodes';
import { GHOSTS } from '../src/data/ghosts';
import { spotsFor } from '../src/lib/hotspots';
import { ES_DATA } from '../src/i18n/es-data';

const needed = new Set<string>();
for (const e of EPISODES) {
  needed.add(e.title);
  for (const h of spotsFor(e)) {
    needed.add(h.label);
    needed.add(h.explanation);
  }
}
for (const s of SEASONS) [s.floor, s.floorNote].forEach((t) => needed.add(t));
Object.values(EPISODE_NOTES).forEach((t) => t && needed.add(t));
for (const g of GHOSTS) {
  needed.add(g.era);
  g.facts.forEach((f) => needed.add(f.text));
  g.timeline.forEach((c) => needed.add(c.note));
}

// Ghost names are proper nouns and stay as they are.
const names = new Set(GHOSTS.map((g) => g.name));
const missing = [...needed].filter((t) => !names.has(t) && !(t in ES_DATA));
const unused = Object.keys(ES_DATA).filter((k) => !needed.has(k));
console.log(`${needed.size} data strings, ${missing.length} untranslated, ${unused.length} unused keys`);
missing.forEach((t) => console.log('  MISSING:', t));
unused.forEach((t) => console.log('  UNUSED: ', t));
process.exit(missing.length ? 1 : 0);

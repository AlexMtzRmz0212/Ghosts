import type { Episode, EpisodeId, Hotspot, Season } from './types';

// Titles and US air dates from Wikipedia's "List of Ghosts (American TV series) episodes".
// Dates marked approx were not listed there and are inferred from the two-part night they aired in.
type Row = [title: string, airDate: string, approxDate?: boolean];

const SEASON_ROWS: Row[][] = [
  [
    ['Pilot', '2021-10-07'],
    ['Hello!', '2021-10-07'],
    ['Viking Funeral', '2021-10-14'],
    ['Dinner Party', '2021-10-21'],
    ['Halloween', '2021-10-28'],
    ["Pete's Wife", '2021-11-04'],
    ["Flower's Article", '2021-11-11'],
    ['D&D', '2021-11-18'],
    ["Alberta's Fan", '2021-12-02'],
    ['Possession', '2021-12-09'],
    ["Sam's Mom", '2022-01-06'],
    ["Jay's Sister", '2022-01-13'],
    ['The Vault', '2022-01-20'],
    ['Ghostwriter', '2022-02-24'],
    ['Thorapy', '2022-03-03'],
    ["Trevor's Pants", '2022-03-31'],
    ['Attic Girl', '2022-04-14'],
    ['Farnsby & B', '2022-04-21'],
  ],
  [
    ['Spies', '2022-09-29'],
    ["Alberta's Podcast", '2022-10-06'],
    ["Jay's Friends", '2022-10-13'],
    ['The Tree', '2022-10-20'],
    ["Halloween 2: The Ghost of Hetty's Past", '2022-10-27'],
    ['The Baby Bjorn', '2022-11-03'],
    ['Dumb Deaths', '2022-11-10'],
    ['The Liquor License', '2022-12-08'],
    ['The Christmas Spirit', '2022-12-15'],
    ['The Christmas Spirit (Part 2)', '2022-12-15'],
    ['The Perfect Assistant', '2023-01-05'],
    ['The Family Business', '2023-01-12'],
    ['Ghost Hunter', '2023-02-02'],
    ["Trevor's Body", '2023-02-09'],
    ['A Date to Remember', '2023-02-16'],
    ["Isaac's Book", '2023-03-02'],
    ['Weekend from Hell', '2023-03-09'],
    ["Alberta's Descendant", '2023-03-30'],
    ['Ghost Father of the Bride', '2023-04-13'],
    ["Woodstone's Hottest Couple", '2023-04-27'],
    ['Whodunnit', '2023-05-04'],
    ['The Heir', '2023-05-11'],
  ],
  [
    ['The Owl', '2024-02-15'],
    ['Man of Your Dreams', '2024-02-22'],
    ['He Sees Dead People', '2024-02-29'],
    ["Halloween 3: The Guest Who Wouldn't Leave", '2024-03-07'],
    ['The Silent Partner', '2024-03-14'],
    ['Hello, Brother', '2024-04-04'],
    ['The Polterguest', '2024-04-11'],
    ['Holes Are Bad', '2024-04-18'],
    ['The Traveling Agent', '2024-04-25'],
    ["Isaac's Wedding", '2024-05-02'],
  ],
  [
    ['Patience', '2024-10-17'],
    ["Sam's Dad", '2024-10-24'],
    ['Halloween 4: The Witch', '2024-10-31'],
    ['The Work Retreat', '2024-11-07'],
    ['A Star Is Dead', '2024-11-14'],
    ['The Primary Source', '2024-12-05'],
    ['Sad Farnsby', '2024-12-12'],
    ['A Very Arondekar Christmas', '2024-12-19'],
    ['A Very Arondekar Christmas (Part 2)', '2024-12-19'],
    ['The Not-So-Silent Partner', '2025-01-30'],
    ['Thorapy 2: Abandonment Issues', '2025-02-06'],
    ["It's the End of the World as We Know It and What Were We Talking About?", '2025-02-13'],
    ['Ghostfellas', '2025-02-20'],
    ['Alexander Hamilton and the Ruffle Kerfuffle', '2025-02-27'],
    ['The Bachelorette Party', '2025-03-06'],
    ["St. Hetty's Day", '2025-03-13'],
    ['His Girl Shiki', '2025-04-03'],
    ['Smooching and Smushing', '2025-04-10'],
    ['Pinkus Returns', '2025-04-17'],
    ['I Know What You Did Thirty-Seven Summers Ago', '2025-04-24'],
    ['Kyle', '2025-05-01'],
    ['The Devil Went Down to Woodstone', '2025-05-08'],
  ],
  [
    ['Soul Custody', '2025-10-16'],
    ['Viking Wedding', '2025-10-23'],
    ['Halloween 5: The Mummy', '2025-10-30'],
    ['Bring Your Daughter to Work Day', '2025-11-06'],
    ['T-Daddy', '2025-11-13'],
    ['Planes, Shanes and Automobiles', '2025-11-20'],
    ['The Proposal', '2025-12-04'],
    ['The Life and Times of Esther Greene', '2025-12-11'],
    ["It's a Wonderful Christmas Carol", '2025-12-18'],
    ["It's a Wonderful Christmas Carol (Part 2)", '2025-12-18', true],
    ['The Others', '2026-02-26'],
    ['The List', '2026-03-05'],
    ["St. Hetty's Day 2: The Help", '2026-03-12'],
    ['The Water Heater', '2026-04-02'],
    ['Michael Jackson Goes to HR', '2026-04-09'],
    ['Woodstone Royale', '2026-04-16'],
    ['The Investor', '2026-04-23'],
    ['Under New Management', '2026-04-30'],
    ['Gate-gate', '2026-05-07'],
    ['Polar Opposites', '2026-05-14'],
    ['Up the Creek', '2026-05-21'],
    ['Across the Pond', '2026-05-21', true],
  ],
  [
    ['Halloween 6: The Mirror', '2026-10-29'],
    ['Halloween 6: The Mirror (Part 2)', '2026-10-29', true],
  ],
];

// Each season is one floor further down the house.
export const SEASONS: Season[] = [
  { number: 1, floor: 'The attic', floorNote: 'Where it starts: a fall down the stairs and a house full of voices.' },
  { number: 2, floor: 'The upstairs bedrooms', floorNote: 'Woodstone B&B opens its doors. The guests have no idea.' },
  { number: 3, floor: 'The library', floorNote: 'A short season with a lot of secrets in it.' },
  { number: 4, floor: 'The living room', floorNote: 'Somebody is digging under the lawn.' },
  { number: 5, floor: 'The kitchen', floorNote: 'Restaurant hours, a new assistant, and a trip overseas.' },
  { number: 6, floor: 'The basement', floorNote: 'Season 6 has started. Only the Halloween special has aired so far.' },
];

// Hand-placed hotspots for episodes that have a real screenshot in src/assets/intros/.
// Get positions with ?edit (see the README in that folder). Example:
//   s01e01: [{ x: 50, y: 30, label: 'Woodstone Mansion', explanation: '...' }, { x: 37, y: 45, label: 'Isaac', explanation: '...', ghostId: 'isaac' }],
const HOTSPOTS: Partial<Record<EpisodeId, Hotspot[]>> = {};

const pad = (n: number) => String(n).padStart(2, '0');
export const episodeId = (season: number, number: number) => `s${pad(season)}e${pad(number)}` as EpisodeId;

export const EPISODES: Episode[] = SEASON_ROWS.flatMap((rows, s) =>
  rows.map(([title, airDate, approxDate], i) => ({
    id: episodeId(s + 1, i + 1),
    season: s + 1,
    number: i + 1,
    title,
    airDate,
    approxDate,
    hotspots: HOTSPOTS[episodeId(s + 1, i + 1)],
  })),
);

export const episodesInSeason = (season: number) => EPISODES.filter((e) => e.season === season);
export const lastEpisodeOf = (season: number) => episodesInSeason(season).at(-1)!;

// House-level moments that aren't tied to one ghost's timeline. Written spoiler-safe for that episode.
export const EPISODE_NOTES: Partial<Record<EpisodeId, string>> = {
  s01e01: 'Sam falls down the stairs, wakes up from a coma, and can suddenly see the ghosts.',
  s01e11: 'Sam\u2019s mom turns up as a ghost at the house, then gets sucked off.',
  s02e05: 'A s\u00e9ance brings Molly, Hetty\u2019s old maid, back for one night.',
  s02e22: 'Someone in the house gets sucked off. The episode doesn\u2019t show who.',
  s05e22: 'Pete goes overseas with Jay and Kyle. Only two of them come home.',
};

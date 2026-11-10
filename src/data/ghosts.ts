import type { Ghost } from './types';

// Death years and ages follow Wikipedia's character list. Birth years are derived from the
// stated age at death; where the show gives no age they are estimates and marked approx.
// `revealedIn` is set to the earliest episode we're confident states the fact. When unsure,
// a later episode is used, so the deck errs toward hiding things rather than spoiling them.
/** Out by the right edge of the TV: where Pete stands when he is away from the house, with Donna beside him. */
const PETE_TRIP = { x: 87, y: 55 };

/** Next to Joan's spot, where Sasappis stands while she is at Woodstone. */
const BESIDE_JOAN = { x: 70, y: 94 };

/** Next to Jessica's spot, where Sasappis stands while she is at Woodstone. */
const BESIDE_JESSICA = { x: 61, y: 91 };

export const GHOSTS: Ghost[] = [
  {
    id: 'thorfinn',
    name: 'Thorfinn',
    era: 'Viking explorer',
    born: 965,
    died: 1000,
    approx: 'both',
    main: true,
    prop: 'beard',
    extra: ['lightning'], // his power: electricity
    spot: { x: 37, y: 64 },
    timeline: [{ ep: 's01e01', status: 'home', note: 'Already haunting the house when Sam and Jay move in.' }],
    facts: [
      { text: 'A Viking who died here more than 1,000 years ago, long before there was a house.', revealedIn: 's01e01' },
      { text: 'Died when lightning struck his helmet.', revealedIn: 's01e03' },
      { text: 'His crew sailed home without him.', revealedIn: 's01e15' },
      { text: 'He was left behind because of a headcount mistake.', revealedIn: 's04e11' },
    ],
  },
  {
    id: 'sasappis',
    name: 'Sasappis',
    era: 'Lenape storyteller',
    born: 1490,
    died: 1513,
    approx: 'born',
    main: true,
    prop: 'feather',
    // His power is entering people's dreams. Shown only in the episodes where he is seen using it
    // (S3E2 is the one confirmed); add more episodes here.
    moments: [{ prop: 'dreamcloud', eps: ['s03e02'] }],
    spot: { x: 19, y: 76 },
    // He stands beside Joan whenever she is around (S4E17 on) or Jessica (S2E11 to S2E12), and goes back to his own spot when she is away.
    timeline: [
      { ep: 's01e01', status: 'home', note: 'Already haunting the land when Sam and Jay move in.' },
      { ep: 's02e11', status: 'home', note: 'Heads over to Jessica.', spot: BESIDE_JESSICA },
      { ep: 's02e13', status: 'home', note: 'Back on his own while Jessica is gone.', spot: null },
      { ep: 's04e17', status: 'home', note: 'Heads over to meet Joan.', spot: BESIDE_JOAN },
      { ep: 's05e07', status: 'home', note: 'Back on his own while Joan is away.', spot: null },
      { ep: 's05e18', status: 'home', note: 'Right back beside Joan.', spot: BESIDE_JOAN },
    ],
    facts: [
      { text: 'Lenape, died on this land in 1513. He keeps the cause to himself.', revealedIn: 's01e01' },
      { text: 'A storyteller whose father never believed in his stories.', revealedIn: 's01e14' },
      { text: 'The thirteen marks he counted were Shiki saying hello.', revealedIn: 's02e04' },
    ],
  },
  {
    id: 'isaac',
    name: 'Isaac Higgintoot',
    era: 'Revolutionary War captain',
    born: 1742,
    died: 1777,
    main: true,
    prop: 'gas', // his power: a foul smell for anyone who walks through him
    spot: { x: 37, y: 45 },
    timeline: [{ ep: 's01e01', status: 'home', note: 'Already haunting the house when Sam and Jay move in.' }],
    facts: [
      { text: 'A Continental Army captain who is sure history forgot him.', revealedIn: 's01e02' },
      { text: 'Died of dysentery in 1777, at 35.', revealedIn: 's01e02' },
      { text: 'Accidentally shot Nigel, the British officer in the shed.', revealedIn: 's01e08' },
      { text: 'Marries Nigel.', revealedIn: 's03e10' },
    ],
  },
  {
    id: 'hetty',
    name: 'Hetty Woodstone',
    era: 'Gilded Age lady of the house',
    born: 1850,
    died: 1895,
    main: true,
    prop: 'updo',
    reveal: { ep: 's03e08', prop: 'cord' },
    // Her power: the living can see her, but only on St. Patrick's Day (S4E16 confirmed; S5E13 by its title).
    moments: [{ prop: 'clover', eps: ['s04e16', 's05e13'] }],
    spot: { x: 50, y: 45 },
    timeline: [{ ep: 's01e01', status: 'home', note: 'Already haunting the house when Sam and Jay move in.' }],
    facts: [
      { text: 'Lady of Woodstone Manor and Sam’s distant relative. Died in 1895, at 45.', revealedIn: 's01e01' },
      { text: 'Married to Elias, a robber baron. He is not in the house any more.', revealedIn: 's01e13' },
      { text: 'Strangled herself with a telephone cord rather than be arrested.', revealedIn: 's03e08' },
    ],
  },
  {
    id: 'alberta',
    name: 'Alberta Haynes',
    era: 'Jazz singer',
    born: 1895,
    died: 1928,
    approx: 'born',
    main: true,
    prop: 'microphone',
    extra: ['notes'], // her power: the living can hear her hum
    spot: { x: 63, y: 64 },
    timeline: [{ ep: 's01e01', status: 'home', note: 'Already haunting the house when Sam and Jay move in.' }],
    facts: [
      { text: 'A Prohibition-era singer who died at a party in the house in 1928.', revealedIn: 's01e01' },
      { text: 'Someone poisoned her moonshine.', revealedIn: 's01e09' },
      { text: 'Her killer was Thomas Woodstone, Hetty’s son.', revealedIn: 's02e21' },
      { text: 'Born Esther Greene, and once worked as a ventriloquist.', revealedIn: 's05e08' },
    ],
  },
  {
    id: 'flower',
    name: 'Flower',
    era: 'Hippie',
    born: 1938,
    died: 1969,
    main: true,
    prop: 'daisy',
    extra: ['flowers', 'hippyglasses'], // flowers for her power (anyone who walks through her feels high)
    spot: { x: 85, y: 80 },
    timeline: [
      { ep: 's01e01', status: 'home', note: 'Already haunting the house when Sam and Jay move in.' },
      { ep: 's03e01', status: 'away', note: 'Nowhere to be found. The others think she was the one who got sucked off.' },
      { ep: 's03e08', status: 'home', note: 'Found stuck at the bottom of a well, and pulled out.' },
    ],
    facts: [
      { text: 'Died in 1969, at 31, after trying to hug a bear.', revealedIn: 's01e07' },
      { text: 'Was at a commune that robbed a bank.', revealedIn: 's01e07' },
      { text: 'Was never sucked off. She had been in a well the whole time.', revealedIn: 's03e08' },
    ],
  },
  {
    id: 'pete',
    name: 'Pete Martino',
    era: 'Scout leader',
    born: 1945,
    died: 1985,
    main: true,
    prop: 'arrow',
    spot: { x: 50, y: 68 },
    timeline: [
      { ep: 's01e01', status: 'home', note: 'Already haunting the house when Sam and Jay move in.' },
      // Once he learns he can leave the house he goes on trips: shown at the edge, where Donna is.
      { ep: 's03e09', status: 'home', note: 'Finds out he can leave the house, and heads off to St. Lucia.', spot: PETE_TRIP },
      { ep: 's04e01', status: 'home', note: 'Back home from St. Lucia.', spot: null },
      { ep: 's04e19', status: 'home', note: 'Off to see Donna again.', spot: PETE_TRIP },
      { ep: 's04e20', status: 'home', note: 'Back home.', spot: null },
      { ep: 's05e15', status: 'home', note: 'Heads to St. Lucia to see Donna, as a friend.', spot: PETE_TRIP },
      { ep: 's05e16', status: 'home', note: 'Back home.', spot: null },
      { ep: 's05e22', status: 'away', note: 'Vanished on the trip back from England. No one knows where he is.' },
      { ep: 's06e02', status: 'home', note: 'Turned up on the front lawn with no memory of the other ghosts.' },
    ],
    facts: [
      { text: 'A troop leader who died in 1985, at 40, with an arrow through his neck. A scout fired it.', revealedIn: 's01e01' },
      { text: 'His wife Carol and his best friend Jeff were together behind his back.', revealedIn: 's01e06' },
      { text: 'His old travel agency was a front for the mob.', revealedIn: 's04e13' },
    ],
  },
  {
    id: 'trevor',
    name: 'Trevor Lefkowitz',
    era: 'Wall Street finance bro',
    born: 1967,
    died: 2000,
    main: true,
    prop: 'tie',
    spot: { x: 63, y: 45 },
    timeline: [{ ep: 's01e01', status: 'home', note: 'Already haunting the house when Sam and Jay move in. No pants.' }],
    facts: [
      { text: 'A finance guy who died at a party in the house in 2000, at 33. No pants.', revealedIn: 's01e01' },
      { text: 'He gave his pants to Pinkus, a coworker in trouble, just before a heart attack killed him.', revealedIn: 's01e16' },
    ],
  },

  // Recurring ghosts. Ones with no death year (Jessica) are left off the timeline.
  {
    id: 'nancy',
    name: 'Nancy',
    era: 'Cholera victim, basement',
    born: 1820,
    died: 1850,
    approx: 'both',
    prop: 'soresHeavy',
    reveal: { ep: 's05e22', prop: 'tiara' },
    spot: { x: 44, y: 86 },
    timeline: [{ ep: 's01e02', status: 'home', note: 'One of the cholera victims who live in the basement.' }],
    facts: [
      { text: 'Died in the cholera outbreak, and lives down in the basement.', revealedIn: 's01e02' },
      { text: 'Really Adeline Marie Dunham, an English princess.', revealedIn: 's05e22' },
    ],
  },
  {
    id: 'nigel',
    name: 'Nigel Chessum',
    era: 'British officer, the shed',
    born: 1740,
    died: 1777,
    approx: 'both',
    prop: 'sash',
    spot: { x: 7, y: 72 },
    timeline: [{ ep: 's01e08', status: 'home', note: 'Leads the Redcoat ghosts who haunt the shed.' }],
    facts: [
      { text: 'A lieutenant colonel. Isaac shot him by accident.', revealedIn: 's01e08' },
      { text: 'Marries Isaac.', revealedIn: 's03e10' },
    ],
  },
  {
    id: 'stephanie',
    name: 'Stephanie',
    fadesAway: true,
    era: '1980s prom night',
    born: 1969,
    died: 1987,
    approx: 'born',
    prop: 'corsage',
    spot: { x: 50, y: 22 },
    // She sleeps most of the time and is only awake when something wakes her. Awake episodes are the
    // ones with a source (see her facts and Ralph's). The "asleep" and "away" episodes after each are a
    // guess, so correct them if the show says otherwise.
    timeline: [
      { ep: 's01e17', status: 'home', note: 'Comes down from the attic for the first time.' },
      { ep: 's01e18', status: 'home', note: 'Back to sleep up in the attic.', asleep: true },
      { ep: 's02e01', status: 'away', note: 'Not around in this episode.' },
      { ep: 's02e20', status: 'home', note: 'Wide awake again.', asleep: false },
      { ep: 's02e21', status: 'home', note: 'Back to sleep up in the attic.', asleep: true },
      { ep: 's02e22', status: 'away', note: 'Not around in this episode.' },
      { ep: 's03e08', status: 'home', note: 'Wide awake again.', asleep: false },
      { ep: 's03e09', status: 'home', note: 'Back to sleep up in the attic.', asleep: true },
      { ep: 's03e10', status: 'away', note: 'Not around in this episode.' },
      { ep: 's04e20', status: 'home', note: 'Wide awake again.', asleep: false },
      { ep: 's04e21', status: 'home', note: 'Back to sleep up in the attic.', asleep: true },
      { ep: 's04e22', status: 'away', note: 'Not around in this episode.' },
    ],
    facts: [{ text: 'Killed by a chainsaw killer on prom night, 1987.', revealedIn: 's01e17' }],
  },
  {
    id: 'patience',
    name: 'Patience',
    era: 'Puritan, under the lawn',
    born: 1660,
    died: 1690,
    approx: 'both',
    prop: 'coif',
    reveal: { ep: 's04e02', prop: 'bleed' }, // her power, revealed in S4E2: walls that bleed
    spot: { x: 24, y: 95 },
    timeline: [
      { ep: 's03e10', status: 'home', note: 'Reaches up out of the ground.' },
      { ep: 's04e03', status: 'away', note: 'Back down under the lawn.' },
    ],
    facts: [{ text: 'Leads the ghosts who live in the soil under the property.', revealedIn: 's04e01' }],
  },
  {
    id: 'carol',
    name: 'Carol',
    era: 'Pete’s widow',
    born: 1947,
    died: 2024,
    approx: 'born',
    prop: 'purse',
    spot: { x: 56, y: 70 },
    timeline: [
      { ep: 's03e04', status: 'home', note: 'Chokes at the Halloween party and stays as a ghost.' },
      { ep: 's05e01', status: 'gone', note: 'Moves on to whatever comes next.' },
    ],
    facts: [{ text: 'Pete’s wife. Died at Woodstone in 2024.', revealedIn: 's03e04' }],
  },
  {
    id: 'chris',
    name: 'Chris',
    era: 'Party entertainer',
    born: 1995,
    died: 2025,
    approx: 'born',
    prop: 'partyhat',
    spot: { x: 66, y: 22 },
    timeline: [
      { ep: 's04e15', status: 'home', note: 'Crashes through the restaurant roof and stays as a ghost.' },
      { ep: 's04e16', status: 'away', note: 'Leaves the property by parachute.' },
    ],
    facts: [{ text: 'Died at Woodstone in 2025.', revealedIn: 's04e15' }],
  },
  {
    id: 'joan',
    name: 'Joan',
    era: '1940s screenwriter',
    born: 1910,
    died: 1945,
    approx: 'both',
    prop: 'pencil',
    extra: ['suitcase'], // her power: she can leave the grounds and stay away
    spot: { x: 77, y: 94 },
    timeline: [
      { ep: 's04e17', status: 'home', note: 'A roaming ghost who can leave the property.' },
      // Away from S5E7 is the first episode that says so; she may have left a little earlier.
      { ep: 's05e07', status: 'away', note: 'Away for a while.' },
      { ep: 's05e18', status: 'home', note: 'Back after months of walking home from Mongolia.' },
    ],
    facts: [{ text: 'A screenwriter from the 1940s who isn’t tied to one place.', revealedIn: 's04e17' }],
  },
  {
    id: 'crash',
    name: 'Crash',
    fadesAway: true,
    era: '1950s greaser',
    born: 1937,
    died: 1955,
    approx: 'both',
    prop: 'headless',
    spot: { x: 31, y: 88 },
    // Crash is only on screen now and then, and his head comes and goes. From the credits and press
    // coverage; any appearance not listed here is missing, so add it as a home/away pair.
    timeline: [
      { ep: 's01e01', status: 'home', note: 'Wanders the grounds without his head.' },
      { ep: 's01e02', status: 'away', note: 'Not around in this episode.' },
      { ep: 's01e16', status: 'home', note: 'Wanders through again, still without his head.' },
      { ep: 's01e17', status: 'away', note: 'Not around in this episode.' },
      { ep: 's02e19', status: 'home', note: 'Back with his head, which the others finally found.', prop: 'neckSeam' },
      { ep: 's02e20', status: 'away', note: 'Not around in this episode.' },
      { ep: 's03e01', status: 'home', note: 'Back in the house.' },
      { ep: 's03e02', status: 'away', note: 'Not around in this episode.' },
      { ep: 's04e01', status: 'home', note: 'Back, but his head is missing again.', prop: 'headless' },
      { ep: 's04e02', status: 'away', note: 'Not around in this episode.' },
    ],
    facts: [
      { text: 'A greaser from the 1950s who lost his head. His head is somewhere else on the property.', revealedIn: 's01e01' },
      { text: 'His head turns up again.', revealedIn: 's02e19' },
    ],
  },
  {
    id: 'baxter',
    name: 'Baxter',
    era: 'Redcoat fifer, the shed',
    born: 1755,
    died: 1777,
    approx: 'both',
    prop: 'fife',
    spot: { x: 3.5, y: 83 },
    timeline: [{ ep: 's01e08', status: 'home', note: 'Plays the fife for Nigel in the shed.' }],
    facts: [{ text: 'A Revolutionary War soldier under Nigel. The shed used to be their barracks.', revealedIn: 's01e08' }],
  },
  {
    id: 'jenkins',
    name: 'Jenkins',
    era: 'Redcoat musketman, the shed',
    born: 1755,
    died: 1777,
    approx: 'both',
    prop: 'musket',
    spot: { x: 11, y: 85 },
    timeline: [{ ep: 's01e18', status: 'home', note: 'The third Redcoat in the shed, carrying Nigel’s musket.' }],
    facts: [{ text: 'A Revolutionary War soldier under Nigel.', revealedIn: 's01e18' }],
  },
  {
    id: 'bjorn',
    name: 'Bjorn',
    era: 'Viking, next door',
    born: 990,
    died: 1025,
    approx: 'both',
    haunts: 'farnsby',
    prop: 'horns',
    spot: { x: 97, y: 82 },
    timeline: [{ ep: 's02e06', status: 'home', note: 'Found haunting the Farnsbys’ place next door.' }],
    facts: [{ text: 'Thorfinn’s son. He died at about the same age his father did.', revealedIn: 's02e06' }],
  },
  {
    id: 'jessica',
    name: 'Jessica',
    era: 'Bound to her car',
    prop: 'wheel',
    spot: { x: 68, y: 90 },
    timeline: [
      { ep: 's02e11', status: 'home', note: 'Arrives inside the car of Sam and Jay’s new assistant, Freddie.' },
      { ep: 's02e13', status: 'away', note: 'Freddie quits, and his car goes with him.' },
    ],
    facts: [{ text: 'Died when she drove into a telephone pole after too many mimosas. She can’t leave the car.', revealedIn: 's02e11' }],
  },
  {
    id: 'george',
    name: 'George',
    era: 'Puritan, next door',
    born: 1650,
    died: 1690,
    approx: 'both',
    haunts: 'farnsby',
    prop: 'capotain',
    spot: { x: 92.5, y: 74 },
    timeline: [{ ep: 's02e14', status: 'home', note: 'Turns out to be haunting the Farnsbys’ house too.' }],
    facts: [{ text: 'A Puritan on the Farnsby estate who never reached the afterlife.', revealedIn: 's02e14' }],
  },
  {
    id: 'donna',
    name: 'Donna',
    era: 'Ghost in St. Lucia',
    born: 1945,
    died: 1982,
    approx: 'born',
    // Lives in St. Lucia, so she is drawn out at the edge beside Pete (see PETE_TRIP) in the episodes she is on screen, and "away" otherwise.
    prop: 'phone',
    spot: { x: 95, y: 55 },
    timeline: [
      { ep: 's03e10', status: 'home', note: 'A ghost Pete gets to know far from Woodstone, in St. Lucia.' },
      { ep: 's04e01', status: 'away', note: 'Back in St. Lucia.' },
      { ep: 's04e19', status: 'home', note: 'Back in Pete’s story. She denies what everyone says about her.' },
      { ep: 's04e20', status: 'away', note: 'Back in St. Lucia.' },
      { ep: 's05e15', status: 'home', note: 'Pete visits her in St. Lucia, as a friend.' },
      { ep: 's05e16', status: 'away', note: 'Back in St. Lucia.' },
    ],
    facts: [
      { text: 'Haunts St. Lucia, where she died in 1982.', revealedIn: 's03e10' },
      { text: 'Says she killed her husband Gerald and ran. An early cell phone hit her on the head.', revealedIn: 's04e04' },
      { text: 'Linda killed Gerald, not Donna.', revealedIn: 's04e19' },
    ],
  },

  // Hetty's husband, and the rest of the basement.
  {
    id: 'elias',
    name: 'Elias Woodstone',
    era: 'Robber baron, Hetty’s husband',
    prop: 'tophat',
    spot: { x: 62, y: 93 },
    timeline: [
      { ep: 's01e13', status: 'home', note: 'Hetty’s husband, found shut in a vault under the house.' },
      { ep: 's01e14', status: 'away', note: 'Hetty sent him to Hell at the end of the last episode.' },
      { ep: 's02e17', status: 'home', note: 'Back from Hell on a 48-hour furlough.' },
      { ep: 's02e18', status: 'away', note: 'His furlough is over and he is back in Hell.' },
      { ep: 's04e14', status: 'home', note: 'Back again, promoted to a demon who collects souls.' },
      { ep: 's04e15', status: 'away', note: 'Gone from the house again.' },
    ],
    facts: [
      { text: 'A robber baron who cheated on Hetty. He spent over a century locked in a vault under the house.', revealedIn: 's01e13' },
      { text: 'He wants Hetty to sign a paper forgiving him.', revealedIn: 's02e17' },
      { text: 'He is now a demon who collects souls.', revealedIn: 's04e14' },
    ],
  },
  {
    id: 'ralph',
    name: 'Ralph',
    era: 'Teenage cholera victim, basement',
    prop: 'soresLight',
    spot: { x: 42, y: 22 },
    timeline: [
      { ep: 's02e20', status: 'home', note: 'Set up with Stephanie, the attic ghost.' },
      { ep: 's03e08', status: 'gone', note: 'Moved on months ago. He was the ghost sucked off at the end of last season.' },
    ],
    facts: [
      { text: 'Died in the cholera outbreak as a teenager. He and Stephanie become a couple.', revealedIn: 's02e20' },
      { text: 'He moved on to the afterlife while telling Stephanie how happy he was.', revealedIn: 's03e08' },
    ],
  },
  // The basement ghosts all have sores and dark-ringed eyes, each in different places.
  ...(
    [
      ['stuart', 'Stuart', 'soresForehead', { x: 36, y: 94 }],
      ['creepy-dirk', 'Creepy Dirk', 'soresCheeks', { x: 51, y: 94 }],
      ['cody', 'Cody', 'soresNeck', { x: 57, y: 87 }],
      ['catherine', 'Catherine', 'soresMixed', { x: 39, y: 81 }],
    ] as const
  ).map(
    ([id, name, prop, spot]): Ghost => ({
      id,
      name,
      era: 'Cholera victim, basement',
      prop,
      spot,
      timeline: [{ ep: 's01e02', status: 'home', note: 'One of the cholera victims who live in the basement.' }],
      facts: [{ text: 'Died in the cholera outbreak, and lives down in the basement.', revealedIn: 's01e02' }],
    }),
  ),
];

export const ghostById = (id: string) => GHOSTS.find((g) => g.id === id);

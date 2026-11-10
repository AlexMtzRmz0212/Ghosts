/** Episode id in the form `s01e01`. Ids sort correctly as strings. */
export type EpisodeId = `s${string}e${string}`;

export type GhostStatus = 'home' | 'away' | 'gone';

export interface StatusChange {
  ep: EpisodeId;
  status: GhostStatus;
  /** What the viewer learns in this episode, written spoiler-safe for that point. */
  note: string;
  /** From this episode on the ghost's icon is this one instead of `Ghost.prop` (e.g. a head that comes and goes). */
  prop?: Prop;
  /** Set to true when the ghost is asleep (eyes shut, z's) from this episode on, and false when they wake. */
  asleep?: boolean;
  /**
   * Moves the ghost on the TV from this episode on: a spot to stand somewhere else (say, off at the
   * edge on a trip), or `null` to go back to their own spot. The ghost stays "home" while moved.
   */
  spot?: { x: number; y: number } | null;
}

export interface Fact {
  text: string;
  /** First episode where the show tells us this. Hidden on every earlier slide. */
  revealedIn: EpisodeId;
}

export type Prop =
  | 'beard'
  | 'feather'
  | 'notes'
  | 'flowers'
  | 'hippyglasses'
  | 'bleed'
  | 'clover'
  | 'suitcase'
  | 'gas'
  | 'lightning'
  | 'dreamcloud'
  | 'coif'
  | 'soresHeavy'
  | 'soresForehead'
  | 'soresCheeks'
  | 'soresNeck'
  | 'soresMixed'
  | 'soresLight'
  | 'updo'
  | 'cord'
  | 'microphone'
  | 'daisy'
  | 'arrow'
  | 'tie'
  | 'capotain'
  | 'headless'
  | 'neckSeam'
  | 'asleep'
  | 'corsage'
  | 'purse'
  | 'partyhat'
  | 'wheel'
  | 'pencil'
  | 'tiara'
  | 'sash'
  | 'fife'
  | 'musket'
  | 'horns'
  | 'tophat'
  | 'phone'
  | 'none';

/** Where a ghost is bound. Only Woodstone and next door appear in the intro art. */
export type Haunt = 'woodstone' | 'farnsby' | 'elsewhere';

export interface Ghost {
  id: string;
  name: string;
  /** Short era label shown next to the name. */
  era: string;
  /** Left out when the show gives no era to estimate from; such ghosts get no timeline row. */
  born?: number;
  died?: number;
  /** Which years are estimates rather than years the show states. */
  approx?: 'born' | 'both';
  main?: boolean;
  /** When "away" the ghost fades out where they stand instead of walking off the edge (they are not really there). */
  fadesAway?: boolean;
  /** Defaults to Woodstone. */
  haunts?: Haunt;
  /** The ghost's icon on the TV. Shown from the episode the ghost is introduced. */
  prop: Prop;
  /** Icons always worn on top of `prop`, such as a power that is part of the ghost. */
  extra?: Prop[];
  /** Icons shown only in the episodes listed, such as a power used in just those episodes. */
  moments?: { prop: Prop; eps: EpisodeId[] }[];
  /** Adds this icon on top of `prop` from this episode on, when the show reveals something new about the ghost. */
  reveal?: { ep: EpisodeId; prop: Prop };
  /** Position in the placeholder intro art, in % of the frame. */
  spot: { x: number; y: number };
  /** First entry is when the ghost is introduced. */
  timeline: StatusChange[];
  facts: Fact[];
}

export interface Hotspot {
  x: number;
  y: number;
  label: string;
  explanation: string;
  ghostId?: string;
}

export interface Episode {
  id: EpisodeId;
  season: number;
  number: number;
  title: string;
  /** ISO date of the original US broadcast. */
  airDate: string;
  /** Set when the date is inferred (e.g. second half of a two-part night). */
  approxDate?: boolean;
  /** Hotspot positions for a real screenshot. Overrides the generated ones. */
  hotspots?: Hotspot[];
}

export interface Season {
  number: number;
  floor: string;
  floorNote: string;
}

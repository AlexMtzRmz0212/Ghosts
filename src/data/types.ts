/** Episode id in the form `s01e01`. Ids sort correctly as strings. */
export type EpisodeId = `s${string}e${string}`;

export type GhostStatus = 'home' | 'away' | 'gone';

export interface StatusChange {
  ep: EpisodeId;
  status: GhostStatus;
  /** What the viewer learns in this episode, written spoiler-safe for that point. */
  note: string;
}

export interface Fact {
  text: string;
  /** First episode where the show tells us this. Hidden on every earlier slide. */
  revealedIn: EpisodeId;
}

export type Prop =
  | 'helmet'
  | 'feather'
  | 'tricorn'
  | 'collar'
  | 'microphone'
  | 'daisy'
  | 'arrow'
  | 'tie'
  | 'capotain'
  | 'headless'
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
  /** Defaults to Woodstone. */
  haunts?: Haunt;
  prop: Prop;
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

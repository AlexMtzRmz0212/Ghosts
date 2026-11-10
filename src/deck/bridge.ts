import { createContext } from 'react';

/** What the stage (the TV that plays through every episode) tells the deck about itself. */
export interface StageInfo {
  /** Episode id, used for deep links. */
  id: string;
  /** Season number, which is also the floor of the house. */
  floor: number;
  /** Short label such as S2E5. */
  label: string;
  /** Document title. */
  title: string;
  index: number;
  total: number;
}

/** What the deck can ask the stage to do. */
export interface StageApi {
  /** Moves one episode. Returns false at either end, so the deck can move to the next slide instead. */
  step: (dir: 1 | -1) => boolean;
  goTo: (episodeId: string, behavior?: ScrollBehavior) => boolean;
  /** Lands on the last episode, for arriving from the slide after the stage. */
  enterFromEnd: (behavior?: ScrollBehavior) => void;
}

export interface Bridge {
  report: (info: StageInfo) => void;
  register: (api: StageApi | null) => void;
}

export const BridgeContext = createContext<Bridge>({ report: () => {}, register: () => {} });

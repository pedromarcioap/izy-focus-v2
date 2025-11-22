
export enum View {
  POPUP,
  ACTIVE_FOCUS,
  BREAK,
  OPTIONS,
  DASHBOARD,
}

export enum SessionState {
  NONE,
  PREP,
  FOCUS,
  BREAK,
  PAUSED,
}

export interface FocusList {
  id: string;
  name: string;
  focusMinutes: number;
  breakMinutes: number;
  blockListId: string;
}

export interface BlockList {
  id: string;
  name: string;
  sites: string[];
  type: 'block' | 'allow';
}

export interface FocusSession {
  list: FocusList;
  state: SessionState;
  startTime: number;
  endTime: number;
}

export interface CycleStat {
    date: string;
    completed: number;
    interrupted: number;
    emergencyAccess: { [site: string]: number };
}

export interface GardenPlant {
  id: number;
  type: 'sapling' | 'tree' | 'flower';
  date: string;
  status: 'alive' | 'withered';
}

export interface AudioTrack {
  id: string;
  name: string;
  url: string;
}

export interface UserSettings {
  notificationTitleFocus: string;
  notificationTitleBreak: string;
  notificationSound: string; // ID of the track
  focusMusicEnabled: boolean;
  focusMusicTrack: string; // ID of the track
  focusMusicVolume: number; // 0.0 to 1.0
}

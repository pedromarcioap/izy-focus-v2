import type { FocusList, BlockList, GardenPlant, CycleStat, FocusSession } from '../types';
import { INITIAL_BLOCK_LISTS, INITIAL_FOCUS_LISTS, INITIAL_GARDEN, INITIAL_STATS } from '../constants';

declare var chrome: any;

// Mock chrome storage for local development in browser (if extension API is missing)
const isExtension = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;

const mockStorage: any = {};

const getStorage = (keys: string[]): Promise<any> => {
  if (isExtension) {
    return chrome.storage.local.get(keys);
  }
  // Fallback for browser dev
  const result: any = {};
  keys.forEach(k => {
    const val = localStorage.getItem(k);
    result[k] = val ? JSON.parse(val) : undefined;
  });
  return Promise.resolve(result);
};

const setStorage = (items: any): Promise<void> => {
  if (isExtension) {
    return chrome.storage.local.set(items);
  }
  // Fallback for browser dev
  Object.keys(items).forEach(k => {
    localStorage.setItem(k, JSON.stringify(items[k]));
  });
  return Promise.resolve();
};

export const storage = {
  getData: async () => {
    const data = await getStorage(['focusLists', 'blockLists', 'garden', 'stats', 'activeSession']);
    return {
      focusLists: (data.focusLists as FocusList[]) || INITIAL_FOCUS_LISTS,
      blockLists: (data.blockLists as BlockList[]) || INITIAL_BLOCK_LISTS,
      garden: (data.garden as GardenPlant[]) || INITIAL_GARDEN,
      stats: (data.stats as CycleStat[]) || INITIAL_STATS,
      activeSession: (data.activeSession as FocusSession | null) || null,
    };
  },
  
  saveData: async (key: string, value: any) => {
    await setStorage({ [key]: value });
  },

  setSession: async (session: FocusSession | null) => {
    await setStorage({ activeSession: session });
    if (isExtension) {
       if (session) {
           // Set alarm for the end time
           const when = session.endTime;
           await chrome.alarms.create('focusTimer', { when });
       } else {
           await chrome.alarms.clear('focusTimer');
       }
    }
  }
};

import type { FocusList, BlockList, GardenPlant, CycleStat, FocusSession } from '../types';
import { INITIAL_BLOCK_LISTS, INITIAL_FOCUS_LISTS, INITIAL_GARDEN, INITIAL_STATS } from '../constants';

declare var chrome: any;

// Robust check for extension environment
const isExtension = typeof chrome !== 'undefined' && 
                    !!chrome.runtime && 
                    !!chrome.runtime.id && 
                    !!chrome.storage;

const getStorage = (keys: string[]): Promise<any> => {
  if (isExtension) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(keys, (result: any) => {
          if (chrome.runtime.lastError) {
            console.error("Chrome storage error:", chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else {
            resolve(result || {});
          }
        });
      } catch (error) {
        console.error("Chrome storage exception:", error);
        reject(error);
      }
    });
  }
  
  // Fallback for browser dev / preview
  return new Promise((resolve) => {
    const result: any = {};
    keys.forEach(k => {
      try {
        const val = localStorage.getItem(k);
        result[k] = val ? JSON.parse(val) : undefined;
      } catch (e) {
        console.warn(`Error reading ${k} from localStorage`, e);
        result[k] = undefined;
      }
    });
    resolve(result);
  });
};

const setStorage = (items: any): Promise<void> => {
  if (isExtension) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.set(items, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Fallback for browser dev
  return new Promise((resolve) => {
    Object.keys(items).forEach(k => {
      try {
        localStorage.setItem(k, JSON.stringify(items[k]));
      } catch (e) {
        console.warn(`Error saving ${k} to localStorage`, e);
      }
    });
    resolve();
  });
};

export const storage = {
  getData: async () => {
    try {
      const data = await getStorage(['focusLists', 'blockLists', 'garden', 'stats', 'activeSession']);
      return {
        focusLists: (data.focusLists as FocusList[]) || INITIAL_FOCUS_LISTS,
        blockLists: (data.blockLists as BlockList[]) || INITIAL_BLOCK_LISTS,
        garden: (data.garden as GardenPlant[]) || INITIAL_GARDEN,
        stats: (data.stats as CycleStat[]) || INITIAL_STATS,
        activeSession: (data.activeSession as FocusSession | null) || null,
      };
    } catch (error) {
      console.error("Failed to load data from storage", error);
      // Return defaults on error to allow app to boot
      return {
        focusLists: INITIAL_FOCUS_LISTS,
        blockLists: INITIAL_BLOCK_LISTS,
        garden: INITIAL_GARDEN,
        stats: INITIAL_STATS,
        activeSession: null,
      };
    }
  },
  
  saveData: async (key: string, value: any) => {
    await setStorage({ [key]: value });
  },

  setSession: async (session: FocusSession | null) => {
    await setStorage({ activeSession: session });
    if (isExtension) {
       try {
         if (session) {
             const when = session.endTime;
             await new Promise<void>((resolve) => chrome.alarms.create('focusTimer', { when }, resolve));
         } else {
             await new Promise<void>((resolve) => chrome.alarms.clear('focusTimer', resolve));
         }
       } catch (e) {
         console.warn("Failed to set chrome alarm", e);
       }
    }
  }
};

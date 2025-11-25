// Background Service Worker

const OFFSCREEN_DOCUMENT_PATH = 'offscreen.html';

// --- Offscreen Document Management (Audio) ---

async function hasOffscreenDocument() {
  const matchedClients = await clients.matchAll();
  for (const client of matchedClients) {
    if (client.url.endsWith(OFFSCREEN_DOCUMENT_PATH)) {
      return true;
    }
  }
  return false;
}

async function setupOffscreenDocument(path) {
  if (await hasOffscreenDocument()) {
    return;
  }

  // Create offscreen document
  if (creating) {
    await creating;
  } else {
    creating = chrome.offscreen.createDocument({
      url: path,
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Playing focus music and notification sounds in the background',
    });
    await creating;
    creating = null;
  }
}

async function closeOffscreenDocument() {
  if (!(await hasOffscreenDocument())) {
    return;
  }
  await chrome.offscreen.closeDocument();
}

let creating; // A global promise to avoid concurrency issues

// --- Message Handling ---

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const handleMessage = async () => {
    try {
      if (msg.action === 'START_MUSIC') {
        await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
        chrome.runtime.sendMessage({
          target: 'offscreen',
          type: 'PLAY_MUSIC',
          url: msg.url,
          volume: msg.volume
        }).catch(() => {}); // Ignore if offscreen isn't ready immediately
      } 
      else if (msg.action === 'STOP_MUSIC') {
        chrome.runtime.sendMessage({
          target: 'offscreen',
          type: 'STOP_MUSIC'
        }).catch(() => {});
      } 
      else if (msg.action === 'UPDATE_VOLUME') {
        chrome.runtime.sendMessage({
          target: 'offscreen',
          type: 'UPDATE_VOLUME',
          volume: msg.volume
        }).catch(() => {});
      } 
      else if (msg.action === 'PLAY_SFX') {
        await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
        chrome.runtime.sendMessage({
          target: 'offscreen',
          type: 'PLAY_SFX',
          url: msg.url
        }).catch(() => {});
      } 
      else if (msg.action === 'CLOSE_OFFSCREEN') {
        await closeOffscreenDocument();
      }
    } catch (err) {
      console.warn("Background message handler error:", err);
    }
  };

  handleMessage();
  return true; // Keep channel open
});

// --- Alarms & Notifications ---

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'focusTimer') {
    chrome.storage.local.get(['activeSession', 'settings'], async (result) => {
      const session = result.activeSession;
      const settings = result.settings || {};
      
      if (session) {
        const titleFocus = settings.notificationTitleFocus || "Ciclo Concluído!";
        const titleBreak = settings.notificationTitleBreak || "Hora de Voltar!";
        const soundId = settings.notificationSound || 'bell';
        
        // Stop music first
        chrome.runtime.sendMessage({ target: 'offscreen', type: 'STOP_MUSIC' }).catch(() => {});

        // Show System Notification
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon.png',
          title: 'Izy Focus',
          message: session.state === 2 ? titleFocus : titleBreak, // 2 is SessionState.FOCUS
          priority: 2
        });

        // Play Sound
        if (soundId !== 'none') {
             // Hardcoded URLs for background reliability
             const SOUND_URLS = {
                 'bell': 'https://cdn.freesound.org/previews/339/339816_5121236-lq.mp3',
                 'chime': 'https://cdn.freesound.org/previews/352/352651_4019029-lq.mp3',
                 'success': 'https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3'
             };
             
             const url = SOUND_URLS[soundId];
             if (url) {
                 await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
                 chrome.runtime.sendMessage({
                    target: 'offscreen',
                    type: 'PLAY_SFX',
                    url: url
                 }).catch(() => {});
             }
        }
      }
    });
  }
});
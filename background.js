
// SessionState enum: NONE=0, PREP=1, FOCUS=2, BREAK=3, PAUSED=4

const OFFSCREEN_DOCUMENT_PATH = 'offscreen.html';

// --- Offscreen Management ---

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

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.action === 'START_MUSIC') {
    await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
    chrome.runtime.sendMessage({
      target: 'offscreen',
      type: 'PLAY_MUSIC',
      url: msg.url,
      volume: msg.volume
    });
  } else if (msg.action === 'STOP_MUSIC') {
    chrome.runtime.sendMessage({
      target: 'offscreen',
      type: 'STOP_MUSIC'
    });
    // We keep the document open briefly in case we need to play SFX, 
    // or we can close it. For now, let's keep it open if user is in session.
  } else if (msg.action === 'UPDATE_VOLUME') {
    chrome.runtime.sendMessage({
      target: 'offscreen',
      type: 'UPDATE_VOLUME',
      volume: msg.volume
    });
  } else if (msg.action === 'PLAY_SFX') {
      await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
      chrome.runtime.sendMessage({
          target: 'offscreen',
          type: 'PLAY_SFX',
          url: msg.url
      });
  } else if (msg.action === 'CLOSE_OFFSCREEN') {
      await closeOffscreenDocument();
  }
});


// --- Alarms ---

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
        chrome.runtime.sendMessage({ target: 'offscreen', type: 'STOP_MUSIC' });

        // Show System Notification
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon.png',
          title: 'Izy Focus',
          message: session.state === 2 ? titleFocus : titleBreak,
          priority: 2
        });

        // Play Sound via Offscreen
        if (soundId !== 'none') {
             // Map IDs to URLs manually here since we don't have access to constants.ts in background.js easily without build step
             // Ideally this map should be shared, but for now we hardcode the lookup or pass it from app (but app is closed).
             // Solution: We will hardcode the default URLs here for reliability in background context.
             
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
                 });
             }
        }
      }
    });
  }
});

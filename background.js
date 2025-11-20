// SessionState enum values mapped manually: 
// NONE=0, PREP=1, FOCUS=2, BREAK=3, PAUSED=4

// Listen for alarms (timer finished)
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'focusTimer') {
    chrome.storage.local.get(['activeSession'], (result) => {
      const session = result.activeSession;
      if (session) {
        // Notify user
        // Check against integer 2 (SessionState.FOCUS)
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon.png',
          title: 'Izy Focus',
          message: session.state === 2 
            ? 'Ciclo de foco concluído! Hora de regar sua planta.' 
            : 'Pausa finalizada! Pronto para voltar?',
          priority: 2
        });
      }
    });
  }
});

// Allow basic message passing if needed for debugging
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTimerStatus') {
    chrome.alarms.get('focusTimer', (alarm) => {
      sendResponse({ alarm });
    });
    return true;
  }
});
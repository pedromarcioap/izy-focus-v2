import { SessionState } from './types';

declare var chrome: any;

// Listen for alarms (timer finished)
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'focusTimer') {
    chrome.storage.local.get(['activeSession'], (result) => {
      const session = result.activeSession;
      if (session) {
        // Notify user
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon.png',
          title: 'Izy Focus',
          message: session.state === SessionState.FOCUS 
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
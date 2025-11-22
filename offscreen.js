let musicAudio = null;
let sfxAudio = null;

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.target !== 'offscreen') {
    return;
  }

  switch (msg.type) {
    case 'PLAY_MUSIC':
      playMusic(msg.url, msg.volume);
      break;
    case 'STOP_MUSIC':
      stopMusic();
      break;
    case 'UPDATE_VOLUME':
      if (musicAudio) {
        musicAudio.volume = msg.volume;
      }
      break;
    case 'PLAY_SFX':
      playSfx(msg.url);
      break;
    default:
      console.warn('Unknown message type:', msg.type);
  }
});

function playMusic(url, volume) {
  if (musicAudio) {
    // If already playing the same track, just update volume
    if (musicAudio.src === url && !musicAudio.paused) {
        musicAudio.volume = volume;
        return;
    }
    musicAudio.pause();
  }
  
  musicAudio = new Audio(url);
  musicAudio.loop = true;
  musicAudio.volume = volume;
  musicAudio.play().catch(error => {
    console.error("Offscreen: Failed to play music", error);
  });
}

function stopMusic() {
  if (musicAudio) {
    musicAudio.pause();
    musicAudio.currentTime = 0;
    musicAudio = null;
  }
}

function playSfx(url) {
    if (sfxAudio) {
        sfxAudio.pause();
    }
    sfxAudio = new Audio(url);
    sfxAudio.play().catch(err => console.error("Offscreen: SFX error", err));
}

const AudioContext = window.AudioContext || window.webkitAudioContext
const audioContext = new AudioContext()
const soundNames = ['game-over', 'jump', 'level-up', 'hamba']
const soundBuffers = {}
let SOUNDS_LOADED = false

// Background music
let bgMusic = null
let BG_MUSIC_LOADED = false
let currentBgmPath = './assets/bgmusic.mp3'

// Available BGM files from bgm folder
export const BGM_FILES = [
  'bgm1.mp3',
  'bgm2.mp3',
  'bgm3.mp3',
  'bgm4.mp3',
  'bgm5.mp3', 
  'bgm6.mp3',
  'bgm7.mp3',
  'bgm8.mp3',
  'bgm9.mp3',
  'bgm10.mp3',
  'bgm11.mp3',
  'bgm12.mp3',
]

loadSounds().catch(console.error)
loadBackgroundMusic().catch(console.error)
export function playSound(name) {
  if (SOUNDS_LOADED) {
    audioContext.resume()
    playBuffer(soundBuffers[name])
  }
}

async function loadSounds() {
  await Promise.all(
    soundNames.map(async (soundName) => {
      soundBuffers[soundName] = await loadBuffer(`./assets/${soundName}.mp3`)
    })
  )

  SOUNDS_LOADED = true
}

async function loadBackgroundMusic(bgmPath = null) {
  // Stop current music if playing
  if (bgMusic) {
    bgMusic.pause()
    bgMusic = null
  }
  
  const path = bgmPath || currentBgmPath
  bgMusic = new Audio(path)
  bgMusic.loop = true
  bgMusic.volume = 0.5 // Set volume to 50% so it doesn't overpower sound effects
  
  // Wait for the audio to be ready
  try {
    await new Promise((resolve, reject) => {
      bgMusic.addEventListener('canplaythrough', resolve, { once: true })
      bgMusic.addEventListener('error', reject, { once: true })
      bgMusic.load()
    })
    BG_MUSIC_LOADED = true
    currentBgmPath = path
  } catch (error) {
    console.error('Failed to load background music:', error)
    BG_MUSIC_LOADED = false
  }
}

export function playBackgroundMusic() {
  if (BG_MUSIC_LOADED && bgMusic) {
    bgMusic.play().catch((error) => {
      console.log('Background music play failed:', error)
    })
  }
}

export function pauseBackgroundMusic() {
  if (bgMusic) {
    bgMusic.pause()
  }
}

export function stopBackgroundMusic() {
  if (bgMusic) {
    bgMusic.pause()
    bgMusic.currentTime = 0
  }
}

export async function changeBackgroundMusic(bgmFileName) {
  // If bgmFileName is null or empty, use default music
  const bgmPath = bgmFileName 
    ? `./assets/bgm/${bgmFileName}` 
    : './assets/bgmusic.mp3'
  const wasPlaying = bgMusic && !bgMusic.paused
  
  await loadBackgroundMusic(bgmPath)
  
  // Resume playing if it was playing before
  if (wasPlaying && BG_MUSIC_LOADED) {
    playBackgroundMusic()
  }
}

function loadBuffer(filepath) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()

    request.open('GET', filepath)
    request.responseType = 'arraybuffer'
    request.onload = () =>
      audioContext.decodeAudioData(request.response, resolve)
    request.onerror = reject
    request.send()
  })
}

function playBuffer(buffer) {
  const source = audioContext.createBufferSource()

  source.buffer = buffer
  source.connect(audioContext.destination)
  source.start()
}

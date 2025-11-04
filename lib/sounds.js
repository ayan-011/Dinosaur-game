const AudioContext = window.AudioContext || window.webkitAudioContext
const audioContext = new AudioContext()
const soundNames = ['game-over', 'jump', 'level-up']
const soundBuffers = {}
let SOUNDS_LOADED = false

// Background music
let bgMusic = null
let BG_MUSIC_LOADED = false

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

async function loadBackgroundMusic() {
  bgMusic = new Audio('./assets/bgmusic.mp3')
  bgMusic.loop = true
  bgMusic.volume = 0.5 // Set volume to 50% so it doesn't overpower sound effects
  
  // Wait for the audio to be ready
  await new Promise((resolve, reject) => {
    bgMusic.addEventListener('canplaythrough', resolve, { once: true })
    bgMusic.addEventListener('error', reject, { once: true })
    bgMusic.load()
  })
  
  BG_MUSIC_LOADED = true
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

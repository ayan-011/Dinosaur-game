import DinoGame from './game/DinoGame.js'
import { BGM_FILES, changeBackgroundMusic } from './sounds.js'

const game = new DinoGame(600, 150)

// Setup BGM dropdown
const bgmSelect = document.getElementById('bgm-select')

// Populate dropdown with BGM files
BGM_FILES.forEach((bgmFile) => {
  const option = document.createElement('option')
  option.value = bgmFile
  option.textContent = bgmFile.replace('.mp3', '').toUpperCase()
  bgmSelect.appendChild(option)
})

// Prevent spacebar from opening/closing dropdown when focused
bgmSelect.addEventListener('keydown', (e) => {
  if (e.keyCode === 32 || e.key === ' ') {
    e.preventDefault()
    e.stopPropagation()
    // Blur the dropdown so spacebar can be used for jumping
    bgmSelect.blur()
  }
})

// Handle BGM selection change
bgmSelect.addEventListener('change', async (e) => {
  const selectedBgm = e.target.value
  await changeBackgroundMusic(selectedBgm || null)
  // Blur the dropdown after selection so keyboard controls work for the game
  bgmSelect.blur()
})
const isTouchDevice =
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0

if (isTouchDevice) {
  document.addEventListener('touchstart', ({ touches }) => {
    if (touches.length === 1) {
      game.onInput('jump')
    } else if (touches.length === 2) {
      game.onInput('duck')
    }
  })

  document.addEventListener('touchend', ({ touches }) => {
    game.onInput('stop-duck')
  })
} else {
  const keycodes = {
    // up, spacebar
    JUMP: { 38: 1, 32: 1 },
    // down
    DUCK: { 40: 1 },
  }

  document.addEventListener('keydown', ({ keyCode }) => {
    if (keycodes.JUMP[keyCode]) {
      game.onInput('jump')
    } else if (keycodes.DUCK[keyCode]) {
      game.onInput('duck')
    }
  })

  document.addEventListener('keyup', ({ keyCode }) => {
    if (keycodes.DUCK[keyCode]) {
      game.onInput('stop-duck')
    }
  })
}

game.start().catch(console.error)

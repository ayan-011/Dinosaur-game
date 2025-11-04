import sprites from '../sprites.js'
import Actor from './Actor.js'

export default class Bird extends Actor {
  static maxBirdHeight = Math.max(sprites.birdUp.h, sprites.birdDown.h) / 2

  // pixels that are added/removed to `y` when switching between wings up and wings down
  static wingSpriteYShift = 6

  constructor(imageData, opts = {}) {
    super(imageData)

    // variant can be 'bird' (default), 'amitabh', 'amma', or 'cid'
    this.variant = opts.variant || 'bird'
    // an Image instance for this bird (passed from the game)
    this.image = opts.image || null

    // map variants to sound file stems (files are in ./assets)
    this.soundMap = {
      bird: 'hamba',
      amitabh: 'aag',
      amma: 'amma',
      cid: 'cid',
    }

    this.wingFrames = 0
    this.wingDirection = 'Up'
    this.sprite = `bird${this.wingDirection}`
    // these are dynamically set by the game
    this.x = null
    this.y = null
    this.speed = null
    this.wingsRate = null
  }

  // Play the spawn sound for this bird variant using a plain Audio element
  playSpawnSound() {
    const soundStem = this.soundMap[this.variant] || this.soundMap.bird
    try {
      const audio = new Audio(`./assets/${soundStem}.mp3`)
      // play, but don't crash on promise rejection
      audio.play().catch(() => {})
    } catch (e) {
      // ignore play errors
    }
  }

  nextFrame() {
    this.x -= this.speed
    this.determineSprite()
  }

  determineSprite() {
    const oldHeight = this.height

    if (this.wingFrames >= this.wingsRate) {
      this.wingDirection = this.wingDirection === 'Up' ? 'Down' : 'Up'
      this.wingFrames = 0
    }

    this.sprite = `bird${this.wingDirection}`
    this.wingFrames++

    // if we're switching sprites, y needs to be
    // updated for the height difference
    if (this.height !== oldHeight) {
      let adjustment = Bird.wingSpriteYShift
      if (this.wingDirection === 'Up') {
        adjustment *= -1
      }

      this.y += adjustment
    }
  }
}

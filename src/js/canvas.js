import utils, { distance, randomColor, randomIntFromRange } from './utils'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

const colors = ['#2185C5', '#7ECEFD', 'lightgreen', '#FF7F66', 'gray', 'orange']

// Event Listeners
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})

// Objects
class Particle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity = {
      x: (Math.random() - 0.5) * 3,
      y: (Math.random() - 0.5) * 3
    }
    this.radius = radius;
    this.color = color;
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.strokeStyle = this.color
    c.fillStyle = this.color
    c.fill()
    c.stroke()
    c.closePath()
  }

  update (particles) {
    this.draw()

    for (let i = 0; i < particles.length; i++) {
      if (this === particles[i]) continue;
      if (distance(this.x, this.y, particles[i].x, particles[i].y) - (this.radius * 2) < 0)
      {
        // this.color = "red";
        // particles[i].color = "red";
        let tempDx = this.velocity.x;
        let tempDy = this.velocity.y;
        this.velocity.x = particles[i].velocity.x;
        this.velocity.y = particles[i].velocity.y;
        particles[i].velocity.x = tempDx;
        particles[i].velocity.y = tempDy;
        // console.log("Collided!");
      } else {
        // this.color = "blue";
      }
    }

    if (this.x < this.radius || this.x + this.radius > innerWidth) {
      this.velocity.x = - this.velocity.x;
    }
    if (this.y + this.radius > innerHeight || this.y < this.radius) {
      this.velocity.y = - this.velocity.y;
    }
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

// Implementation
let particles
function init() {
  particles = [];

  for (let i = 0; i < 150; i++) {
    let radius = 15;
    let x = randomIntFromRange(radius, canvas.width - radius);
    let y = randomIntFromRange(radius, canvas.height - radius);
    let color= randomColor(colors);
    if (i !== 0) {
      for (let j = 0; j < i; j++)
      {
        if (distance(x, y, particles[j].x, particles[j].y) < 2 * radius)
        {
          x = randomIntFromRange(radius, canvas.width - radius);
          y = randomIntFromRange(radius, canvas.height - radius);
          j = -1;
        }
      }
    }
    let newC = new Particle(x, y, radius, color);
    particles.push(newC)
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)

  // c.fillText('HTML CANVAS BOILERPLATE', mouse.x, mouse.y)
  particles.forEach(object => {
   object.update(particles)
  })
}

init()
animate()

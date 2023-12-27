import './style.css'
import Boid from './boid'
import { Vector } from './vector'
import { Pane } from 'tweakpane'

function setupCanvas() {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    function resizeCanvas() {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    }
    resizeCanvas()

    window.addEventListener('resize', resizeCanvas)
    document.getElementById('app')!.appendChild(canvas)
    return ctx
}

function setupFlock(): Boid[] {
    let flock: Boid[] = []
    for (let i = 0; i < params.count; i++) {
        flock.push(new Boid(randomPositionFn(), randomVelocityFn()))
    }
    return flock
}

function animate() {
    // clear canvas
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // update boids
    const bounds = new Vector(ctx.canvas.width, ctx.canvas.height)
    flock.forEach((boid) =>
        boid.simulate(
            flock,
            bounds,
            params.perception_radius,
            params.max_speed,
            params.max_force,
            params.gravity
        )
    )

    // draw boids
    flock.forEach((boid) => boid.draw(ctx, params.size, params.color, params.debug))

    requestAnimationFrame(animate)
}

function randomDirection() {
    const angle = Math.random() * Math.PI * 2
    return new Vector(Math.cos(angle), Math.sin(angle))
}
function randomDirectionWithSpeed(speed: number) {
    return () => randomDirection().scale(speed)
}
let randomPositionFn = () => new Vector(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height)
let randomVelocityFn = randomDirectionWithSpeed(1.2)

const ctx = setupCanvas()

const params = {
    // boids simulation
    count: 400,
    perception_radius: ctx.canvas.width * 0.1,
    max_speed: 1.2,
    max_force: 2.0,
    gravity: 0.01,

    // drawing
    size: 5,
    color: '#ffffff',
    debug: false,
}

const pane = new Pane()

const boidFolder = pane.addFolder({ title: 'Boids' })
const boidCount = boidFolder.addBinding(params, 'count', { min: 1, max: 1000, step: 1 })
boidCount.on('change', (e) => {
    if (flock.length > e.value) {
        // remove boids
        flock = flock.slice(0, e.value)
    } else {
        // add boids
        const addCount = e.value - flock.length
        for (let i = 0; i < addCount; i++) {
            flock.push(new Boid(randomPositionFn(), randomVelocityFn()))
        }
    }
})
boidFolder.addBinding(params, 'perception_radius', { min: 10, max: 1000, step: 1, label: 'perception' })
boidFolder.addBinding(params, 'max_speed', { min: 0, max: 10, step: 0.01 })
boidFolder.addBinding(params, 'max_force', { min: 0, max: 10, step: 0.01 })
boidFolder.addBinding(params, 'gravity', { min: 0, max: 1, step: 0.0001 })

const drawingFolder = pane.addFolder({ title: 'Drawing' })
drawingFolder.addBinding(params, 'size', { min: 1, max: 20, step: 1 })
drawingFolder.addBinding(params, 'color')
drawingFolder.addBinding(params, 'debug')

let flock = setupFlock()
animate()

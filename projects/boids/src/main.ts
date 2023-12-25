import './style.css'
import Boid from './boid'
import { Vector } from './vector'

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

function setupAgents(randomPositionFn: () => Vector, randomVelocityFn: () => Vector): Boid[] {
    let agents: Boid[] = []
    for (let i = 0; i < BOID_COUNT; i++) {
        agents.push(new Boid(randomPositionFn(), randomVelocityFn(), PERCEPTION_RADIUS, 8))
    }
    return agents
}

function animate() {
    // clear canvas
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // update agents
    const wrapBoundaries = new Vector(ctx.canvas.width, ctx.canvas.height)
    agents.forEach((agent) => agent.simulate(agents, wrapBoundaries))

    // draw agents
    agents.forEach((agent) => agent.draw(ctx))

    requestAnimationFrame(animate)
}

function randomDirection() {
    const angle = Math.random() * Math.PI * 2
    return new Vector(Math.cos(angle), Math.sin(angle))
}
function randomDirectionWithSpeed(speed: number) {
    return () => randomDirection().scale(speed)
}

const ctx = setupCanvas()

const BOID_COUNT = 800
const PERCEPTION_RADIUS = ctx.canvas.width * 0.05

const agents = setupAgents(
    () => new Vector(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height),
    randomDirectionWithSpeed(1.2)
)

animate()

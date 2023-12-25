import { IVector, Vector } from './vector'

interface IBoid {
    position: IVector
    velocity: IVector
    acceleration: IVector

    perceptionRadius: number

    displaySize: number

    simulate(flock: Boid[], wrapBoundaries: Vector): void
    draw(ctx: CanvasRenderingContext2D): void
}

export default class Boid implements IBoid {
    position: IVector
    velocity: IVector
    acceleration: IVector
    perceptionRadius: number
    displaySize: number

    constructor(position: IVector, velocity: IVector, perceptionRadius: number, displaySize: number) {
        this.position = position
        this.velocity = velocity
        this.acceleration = Vector.zero()
        this.perceptionRadius = perceptionRadius
        this.displaySize = displaySize
    }

    calculateSeperation(boids: Boid[]) {
        let steering = Vector.zero()
        let total = 0
        boids.forEach((otherBoid) => {
            let distance = this.position.distance(otherBoid.position)
            let diff = this.position.subtract(otherBoid.position)
            diff = diff.normalize().divide(distance) // weight by distance
            steering = steering.add(diff)
            total++
        })
        if (total > 0) {
            steering = steering.divide(total)
        }
        return steering
    }

    calculateAlignment(boids: Boid[]) {
        let avgVelocity = Vector.zero()
        let total = 0
        boids.forEach((otherBoid) => {
            avgVelocity = avgVelocity.add(otherBoid.velocity)
            total += 1
        })
        if (total > 0) {
            avgVelocity = avgVelocity.divide(total)
            avgVelocity = avgVelocity.subtract(this.velocity)
        }
        return avgVelocity.divide(12)
    }

    calculateCohesion(boids: Boid[]) {
        let centerOfMass = Vector.zero()
        let total = 0
        boids.forEach((otherBoid) => {
            centerOfMass = centerOfMass.add(otherBoid.position)
            total += 1
        })
        if (total > 0) {
            centerOfMass = centerOfMass.divide(total)
            return centerOfMass.subtract(this.position).divide(4000)
        }
        return Vector.zero()
    }

    simulate(flock: Boid[], wrapBoundaries: Vector) {
        // get all boids within perception radius
        const inPerceptionRadius = flock.filter((otherBoid) => {
            let distance = this.position.toroidalDistance(
                otherBoid.position,
                wrapBoundaries.x,
                wrapBoundaries.y
            )
            return distance > 0 && distance < this.perceptionRadius
        })

        // (1) Seperation
        this.acceleration = this.acceleration.add(this.calculateSeperation(inPerceptionRadius))
        this.acceleration = this.acceleration.add(this.calculateAlignment(inPerceptionRadius))
        this.acceleration = this.acceleration.add(this.calculateCohesion(inPerceptionRadius))

        this.velocity = this.velocity.add(this.acceleration)
        this.position = this.position.add(this.velocity)
        this.acceleration = Vector.zero()

        // enforce boundaries
        if (this.position.x < 0) {
            this.position = new Vector(wrapBoundaries.x, this.position.y)
        } else if (this.position.x > wrapBoundaries.x) {
            this.position = new Vector(0, this.position.y)
        }
        if (this.position.y < 0) {
            this.position = new Vector(this.position.x, wrapBoundaries.y)
        } else if (this.position.y > wrapBoundaries.y) {
            this.position = new Vector(this.position.x, 0)
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Draw a triangle pointing in the direction of the velocity
        const angle = Math.atan2(this.velocity.y, this.velocity.x)

        // Define the points for the triangle
        const pointA = {
            x: this.position.x + Math.cos(angle) * this.displaySize,
            y: this.position.y + Math.sin(angle) * this.displaySize,
        }
        const pointB = {
            x: this.position.x + Math.cos(angle + (Math.PI * 2) / 3) * this.displaySize,
            y: this.position.y + Math.sin(angle + (Math.PI * 2) / 3) * this.displaySize,
        }
        const pointC = {
            x: this.position.x + Math.cos(angle - (Math.PI * 2) / 3) * this.displaySize,
            y: this.position.y + Math.sin(angle - (Math.PI * 2) / 3) * this.displaySize,
        }

        // Draw the triangle
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.moveTo(pointA.x, pointA.y)
        ctx.lineTo(pointB.x, pointB.y)
        ctx.lineTo(pointC.x, pointC.y)
        ctx.closePath()
        ctx.fill()

        // // Draw the debug line
        // const debugLineLength = 30 // Adjust the length of the debug line as needed
        // const debugLineEnd = {
        //     x: pointA.x + Math.cos(angle) * debugLineLength,
        //     y: pointA.y + Math.sin(angle) * debugLineLength,
        // }

        // ctx.strokeStyle = '#f00' // Red color for the debug line
        // ctx.beginPath()
        // ctx.moveTo(pointA.x, pointA.y)
        // ctx.lineTo(debugLineEnd.x, debugLineEnd.y)
        // ctx.stroke()
    }
}

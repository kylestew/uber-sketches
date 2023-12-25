import { IVector, Vector } from './vector'

interface IBoid {
    position: IVector
    velocity: IVector
    acceleration: IVector

    perceptionRadius: number
    maxSpeed: number
    maxForce: number

    displaySize: number

    simulate(flock: Boid[], wrapBoundaries: Vector): void
    draw(ctx: CanvasRenderingContext2D): void
}

interface IBoidInfo {
    otherBoid: Boid
    distance: number
    wrapBoundaries: IVector
}

export default class Boid implements IBoid {
    position: IVector
    velocity: IVector
    acceleration: IVector
    perceptionRadius: number
    maxSpeed: number
    maxForce: number
    displaySize: number

    constructor(
        position: IVector,
        velocity: IVector,
        perceptionRadius: number,
        displaySize: number,
        maxSpeed: number = 2.0,
        maxForce: number = 0.1
    ) {
        this.position = position
        this.velocity = velocity
        this.acceleration = Vector.zero()
        this.perceptionRadius = perceptionRadius
        this.maxSpeed = maxSpeed
        this.maxForce = maxForce
        this.displaySize = displaySize
    }

    calculateSeperation(boids: IBoidInfo[]) {
        let steering = boids.reduce((acc, { otherBoid, distance, wrapBoundaries }) => {
            let diff = this.position.toroidalSubtraction(
                otherBoid.position,
                wrapBoundaries.x,
                wrapBoundaries.y
            )
            diff = diff.divide(distance) // weight by distance
            return acc.add(diff)
        }, Vector.zero())
        let total = boids.length
        if (total > 0) {
            steering = steering.divide(total)
            // do it at max speed
            steering = steering.setMagnitude(this.maxSpeed)
            // move my velocity towards goal
            steering = steering.subtract(this.velocity)
            // limit
            steering = steering.limit(this.maxForce)
        }
        return steering
    }

    calculateAlignment(boids: IBoidInfo[]) {
        // sum all the velocities of the other boids
        let avgVelocity = boids.reduce((acc, { otherBoid }) => {
            return acc.add(otherBoid.velocity)
        }, Vector.zero())
        let total = boids.length
        if (total > 0) {
            // average direction
            avgVelocity = avgVelocity.divide(total)
            // steer towards neighbords average at max speed
            avgVelocity = avgVelocity.setMagnitude(this.maxSpeed)
            // steer towards average
            avgVelocity = avgVelocity.subtract(this.velocity)
            // limit
            avgVelocity = avgVelocity.limit(this.maxForce)
        }
        return avgVelocity
    }

    calculateCohesion(boids: IBoidInfo[]) {
        let centerOfMass = boids.reduce((acc, { otherBoid }) => {
            return acc.add(otherBoid.position)
        }, Vector.zero())
        let total = boids.length
        if (total > 0) {
            // average location
            centerOfMass = centerOfMass.divide(total)
            // steer towards center of mass
            centerOfMass = centerOfMass.subtract(this.position)
            // do it at max speed
            centerOfMass = centerOfMass.setMagnitude(this.maxSpeed)
            // move my velocity towards goal
            centerOfMass = centerOfMass.subtract(this.velocity)
            // limit
            centerOfMass = centerOfMass.limit(this.maxForce)
            return centerOfMass
        }
        return Vector.zero()
    }

    simulate(flock: Boid[], wrapBoundaries: Vector) {
        // Get all boids within perception radius
        const inPerceptionRadius = flock
            .map((otherBoid) => {
                let distance = this.position.toroidalDistance(
                    otherBoid.position,
                    wrapBoundaries.x,
                    wrapBoundaries.y
                )
                return distance > 0 && distance < this.perceptionRadius
                    ? { otherBoid, distance, wrapBoundaries }
                    : null
            })
            .filter((item) => item !== null) as IBoidInfo[]

        // Boids algorithm
        this.acceleration = Vector.zero()
        this.acceleration = this.acceleration.add(this.calculateSeperation(inPerceptionRadius))
        this.acceleration = this.acceleration.add(this.calculateAlignment(inPerceptionRadius))
        this.acceleration = this.acceleration.add(this.calculateCohesion(inPerceptionRadius))

        // physics update
        this.velocity = this.velocity.add(this.acceleration)
        this.velocity = this.velocity.limit(this.maxSpeed)
        this.position = this.position.add(this.velocity)

        // enforce wrap boundaries
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

        /*
        // Draw the debug line
        const debugLineLength = 20 // Adjust the length of the debug line as needed
        const debugLineEnd = {
            x: pointA.x + Math.cos(angle) * debugLineLength,
            y: pointA.y + Math.sin(angle) * debugLineLength,
        }

        ctx.strokeStyle = '#f00' // Red color for the debug line
        ctx.beginPath()
        ctx.moveTo(pointA.x, pointA.y)
        ctx.lineTo(debugLineEnd.x, debugLineEnd.y)
        ctx.stroke()
        */
    }
}

import { IVector, Vector } from './vector'

interface IBoid {
    position: IVector
    velocity: IVector
    acceleration: IVector

    simulate(
        flock: Boid[],
        bounds: IVector,
        perceptionRadius: number,
        maxSpeed: number,
        maxForce: number
    ): void
    draw(ctx: CanvasRenderingContext2D, size: number, color: string, debug: boolean): void
}

interface IBoidInfo {
    otherBoid: Boid
    distance: number
}

export default class Boid implements IBoid {
    position: IVector
    velocity: IVector
    acceleration: IVector

    constructor(position: IVector, velocity: IVector) {
        this.position = position
        this.velocity = velocity
        this.acceleration = Vector.zero()
    }

    calculateSeperation(boids: IBoidInfo[]) {
        // let steering = boids.reduce((acc, { otherBoid, distance, wrapBoundaries }) => {
        //     let diff = this.position.toroidalSubtraction(
        //         otherBoid.position,
        //         wrapBoundaries.x,
        //         wrapBoundaries.y
        //     )
        //     diff = diff.divide(distance) // weight by distance
        //     return acc.add(diff)
        // }, Vector.zero())
        // let total = boids.length
        // if (total > 0) {
        //     steering = steering.divide(total)
        //     // do it at max speed
        //     steering = steering.setMagnitude(this.maxSpeed)
        //     // move my velocity towards goal
        //     steering = steering.subtract(this.velocity)
        //     // limit
        //     steering = steering.limit(this.maxForce)
        // }
        // return steering
    }

    calculateAlignment(boids: IBoidInfo[], maxSpeed) {
        // sum all the velocities of the other boids
        let avgVelocity = boids.reduce((acc, { otherBoid }) => {
            return acc.add(otherBoid.velocity)
        }, Vector.zero())
        let total = boids.length
        if (total > 0) {
            // average direction
            avgVelocity = avgVelocity.divide(total)
            // steer towards neighbords average at max speed
            avgVelocity = avgVelocity.setMagnitude(maxSpeed)
            // steer towards average
            avgVelocity = avgVelocity.subtract(this.velocity)
        }
        return avgVelocity
    }

    calculateCohesion(boids: IBoidInfo[]) {
        // let centerOfMass = boids.reduce((acc, { otherBoid }) => {
        //     return acc.add(otherBoid.position)
        // }, Vector.zero())
        // let total = boids.length
        // if (total > 0) {
        //     // average location
        //     centerOfMass = centerOfMass.divide(total)
        //     // steer towards center of mass
        //     centerOfMass = centerOfMass.subtract(this.position)
        //     // do it at max speed
        //     centerOfMass = centerOfMass.setMagnitude(this.maxSpeed)
        //     // move my velocity towards goal
        //     centerOfMass = centerOfMass.subtract(this.velocity)
        //     // limit
        //     centerOfMass = centerOfMass.limit(this.maxForce)
        //     return centerOfMass
        // }
        // return Vector.zero()
    }

    calculateGravity(center: Vector, gravity: number) {
        const towardsCenter = center.subtract(this.position).normalize()
        let scale = center.distance(this.position) / center.x // increase acceleration force when far away
        scale *= gravity // weak center of gravity
        return towardsCenter.scale(scale)
    }

    boidsInPerceptionRadius(flock: Boid[], perceptionRadius: number) {
        return flock
            .map((otherBoid) => {
                let distance = this.position.distance(otherBoid.position)
                return distance > 0 && distance < perceptionRadius ? { otherBoid, distance } : null
            })
            .filter((item) => item !== null) as IBoidInfo[]
    }

    simulate(
        flock: Boid[],
        bounds: IVector,
        perceptionRadius: number,
        maxSpeed: number,
        maxForce: number,
        gravity: number
    ) {
        // central gravity
        const center = new Vector(bounds.x / 2, bounds.y / 2)
        this.acceleration = this.calculateGravity(center, gravity) // clear and replace acceleration
        console.log(gravity)

        // this.acceleration = Vector.zero() // clear and replace acceleration

        // Get all boids within perception radius
        const inPerceptionRadius = this.boidsInPerceptionRadius(flock, perceptionRadius)

        // this.acceleration = this.acceleration.add(this.calculateSeperation(inPerceptionRadius))
        this.acceleration = this.acceleration.add(this.calculateAlignment(inPerceptionRadius, maxSpeed))
        // this.acceleration = this.acceleration.add(this.calculateCohesion(inPerceptionRadius))

        // physics update
        this.acceleration = this.acceleration.limit(maxForce)
        this.velocity = this.velocity.add(this.acceleration).limit(maxSpeed)
        this.position = this.position.add(this.velocity)
    }

    draw(ctx: CanvasRenderingContext2D, size: number, color: string, debug: boolean) {
        // Draw a triangle pointing in the direction of the velocity
        const angle = Math.atan2(this.velocity.y, this.velocity.x)

        // Define the points for the triangle
        const pointA = {
            x: this.position.x + Math.cos(angle) * size,
            y: this.position.y + Math.sin(angle) * size,
        }
        const pointB = {
            x: this.position.x + Math.cos(angle + (Math.PI * 2) / 3) * size,
            y: this.position.y + Math.sin(angle + (Math.PI * 2) / 3) * size,
        }
        const pointC = {
            x: this.position.x + Math.cos(angle - (Math.PI * 2) / 3) * size,
            y: this.position.y + Math.sin(angle - (Math.PI * 2) / 3) * size,
        }

        // Draw the triangle
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.moveTo(pointA.x, pointA.y)
        ctx.lineTo(pointB.x, pointB.y)
        ctx.lineTo(pointC.x, pointC.y)
        ctx.closePath()
        ctx.fill()

        // Draw the debug line
        if (debug) {
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
        }
    }
}

export interface IVector {
    readonly x: number
    readonly y: number

    add(v: IVector): Vector
    subtract(v: IVector): Vector
    multiply(scalar: number): Vector
    divide(scalar: number): Vector
    scale(scalar: number): Vector

    setMagnitude(mag: number): Vector
    magnitude(): number
    normalize(): Vector
    limit(max: number): Vector

    distance(v: IVector): number
    toroidalDistance(v: IVector, width: number, height: number): number
    toroidalSubtraction(v: IVector, width: number, height: number): IVector
}

export class Vector implements IVector {
    readonly x: number
    readonly y: number

    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    static zero(): Vector {
        return new Vector(0, 0)
    }

    add(v: IVector): Vector {
        return new Vector(this.x + v.x, this.y + v.y)
    }

    subtract(v: IVector): Vector {
        return new Vector(this.x - v.x, this.y - v.y)
    }

    multiply(scalar: number): Vector {
        return new Vector(this.x * scalar, this.y * scalar)
    }

    divide(scalar: number): Vector {
        return new Vector(this.x / scalar, this.y / scalar)
    }

    scale(scalar: number): Vector {
        return this.multiply(scalar)
    }

    magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }

    setMagnitude(mag: number): Vector {
        return this.normalize().scale(mag)
    }

    normalize(): Vector {
        const mag = this.magnitude()
        return mag > 0 ? new Vector(this.x / mag, this.y / mag) : new Vector()
    }

    limit(max: number): Vector {
        const mag = this.magnitude()
        if (mag > max) {
            return this.normalize().scale(max)
        }
        return new Vector(this.x, this.y)
    }

    distance(v: IVector): number {
        return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2)
    }

    toroidalDistance(v: IVector, width: number, height: number): number {
        // Calculate direct distances
        let dx = Math.abs(this.x - v.x)
        let dy = Math.abs(this.y - v.y)

        // Calculate wrapped distances
        dx = Math.min(dx, width - dx)
        dy = Math.min(dy, height - dy)

        // Return the Euclidean distance considering wrapping
        return Math.sqrt(dx * dx + dy * dy)
    }

    // Helper function to adjust a distance for wrap-around
    adjustForWrap(distance: number, maxDistance: number): number {
        if (distance > maxDistance / 2) {
            return distance - maxDistance
        } else if (distance < -maxDistance / 2) {
            return distance + maxDistance
        }
        return distance
    }

    toroidalSubtraction(v: IVector, width: number, height: number): IVector {
        // Calculate direct differences
        let dx = this.x - v.x
        let dy = this.y - v.y

        // Adjust differences for wrap-around
        dx = this.adjustForWrap(dx, width)
        dy = this.adjustForWrap(dy, height)

        // Return the vector representing the toroidal subtraction
        return new Vector(dx, dy)
    }
}

export default Vector

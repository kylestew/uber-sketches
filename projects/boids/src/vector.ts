export interface IVector {
    readonly x: number
    readonly y: number

    add(v: IVector): Vector
    subtract(v: IVector): Vector
    multiply(scalar: number): Vector
    divide(scalar: number): Vector
    scale(scalar: number): Vector
    magnitude(): number
    normalize(): Vector

    distance(v: IVector): number
    toroidalDistance(v: Vector, width: number, height: number): number
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

    normalize(): Vector {
        const mag = this.magnitude()
        return mag > 0 ? new Vector(this.x / mag, this.y / mag) : new Vector()
    }

    distance(v: IVector): number {
        return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2)
    }

    toroidalDistance(v: Vector, width: number, height: number): number {
        // Calculate direct distances
        let dx = Math.abs(this.x - v.x)
        let dy = Math.abs(this.y - v.y)

        // Calculate wrapped distances
        dx = Math.min(dx, width - dx)
        dy = Math.min(dy, height - dy)

        // Return the Euclidean distance considering wrapping
        return Math.sqrt(dx * dx + dy * dy)
    }
}

export default Vector

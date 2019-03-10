"use strict"
class Vector3D {

    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    get lengt(){
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    static scalarProd(a, b){
        return (a.x * b.x + a.y * a.y + a.z * b.z)
    }

    static add(a, b){
        return new Vector3D(a.x + b.x, a.y + b.y, a.z + b.z)
    }

    static multiply(a, b){
        return new Vector3D(a.x * b.x, a.y * b.y, a.z * b.z)
    }
}
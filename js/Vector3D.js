"use strict"
class Vector3D {

    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    get length(){
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    static scalarProd(a, b){
        return (a.x * b.x + a.y * a.y + a.z * b.z);
    }

    static add(a, b){
        return new Vector3D(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    static multiply(a, b){
        return new Vector3D(a.x * b.x, a.y * b.y, a.z * b.z);
    }

    static multiplyOnScalar(a, scalar){
        return new Vector3D(a.x * scalar, a.y * scalar, a.z * scalar);
    }

    static substract(a, b){
        return new Vector3D( a.x - b.x, a.y - b.y, a.z - b.z);
    }

    static normalize(a) {
        return new Vector3D(a.x / a.length, a.y / a.length, a.z / a.length);
    }

    static cross(a, b){
        return new Vector3D(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
    }
}
"use strict";
// list of atoms
var atoms = [];
// timestep
var dt = 0.1;
var g = -90.8;
var scene3d = document.getElementById("scene3d");
var CANVAS_WIDTH = 700;
var CANVAS_HEIGHT = 600;
var LIM = 5;
var gFlag = 0; // gravity on - off
var TRESHOLD = 0.01; // treshold for minimum velocity near walls

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
var controls = new THREE.OrbitControls(camera);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
document.body.appendChild(renderer.domElement);

// add first atom in the system
var tempVel = new Vector3D(1, 0, 1);
var tempAcc = new Vector3D(0, g, 0);
var atom = newAtom(0.5, 1, tempVel, tempAcc);
atoms.push(atom);
scene.add(atom.geom);

// add second atom in the system
var tempVel2 = new Vector3D(-1, 0, 1);
var tempAcc2 = new Vector3D(0, g, 0);
var atom3 = newAtom(0.5, 1, tempVel2, tempAcc2);
atoms.push(atom3);
scene.add(atom3.geom);

// add box
var geometryBox = new THREE.BoxGeometry(10, 10, 10);
var materialBox = new THREE.MeshNormalMaterial( {transparent: true, opacity: 0.1} );
var cube = new THREE.Mesh( geometryBox, materialBox );
scene.add(cube);
camera.position.z = 50;

clickOnAddButton();
clickOnCheckBox();

var render = function () {
    requestAnimationFrame(render);
    // loop over all atoms
    for(var i = 0; i < atoms.length; i++){
        if (i != atoms.length - 1){
            var detection = detectIntersection(atoms[i], atoms[i+1]);
        }
        move(atoms[i], dt);
       console.log(atoms[i].v.y);
    }
    scene3d.appendChild(renderer.domElement);
    renderer.render(scene, camera);
};

function addAtom() {
    var tempVel = new Vector3D(Math.random(), Math.random(), Math.random());
    var tempAcc = new Vector3D(0, g, 0);
    var atom = newAtom(0.5, 1, tempVel, tempAcc);
    atoms.push(atom);
    scene.add(atom.geom);

    // change lable on the scene with number of atoms
    document.getElementById("particles-counter").innerHTML = "Number of particles: " + atoms.length;
    console.log("Atom is added, total number of atoms: " + atoms.length);
}

function clickOnAddButton(){
    document.getElementById("addbutton").addEventListener("click", addAtom);
    console.log(atoms.length);
}

function clickOnCheckBox(){
    document.getElementById("id-checkbox").addEventListener("click", addGravity);
}

function addGravity(){
    if (document.getElementById("id-checkbox").checked === true){
        gFlag = 1;
        console.log("Gravity is changed.");
    } else {
        gFlag = 0;
    }
}

function move(atom, t){
    //process cases with and without gravity
    if (gFlag === 0){
        if (Math.abs(atom.geom.position.x) >= LIM){
            atom.v.x *= -1;
        }
        if (Math.abs(atom.geom.position.y) >= LIM){
            atom.v.y *= -1;
        }
        if (Math.abs(atom.geom.position.z) >= LIM){
            atom.v.z *= -1;
        }
    } else {
        if (Math.abs(atom.geom.position.x) >= LIM){
            atom.v.x *= -1;
        }
        if (atom.geom.position.y <= -LIM){
            atom.v.y = 0;
            atom.a.y = 0;
        }
        if (atom.geom.position.y >= LIM){
            atom.v.y *= -1;
        }
        if (Math.abs(atom.geom.position.z) >= LIM){
            atom.v.z *= -1;
        }
    }
    atom.geom.position.x += atom.v.x * t + gFlag*atom.a.x * t * t / 2;
    atom.geom.position.y += atom.v.y * t + gFlag*atom.a.y * t * t / 2;
    atom.geom.position.z += atom.v.z * t + gFlag*atom.a.z * t * t / 2;
}

function newAtom(radii, mass, velocity, acceleration) {
    let geometry = new THREE.SphereGeometry(radii, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
    let material = new THREE.MeshNormalMaterial();
    let sphere = new THREE.Mesh(geometry, material);
    let newAtom = {
        geom: sphere,
        m: mass,
        v: velocity,
        a: acceleration
    };
    return newAtom;
}

/**
 * Detects intersection of two atoms
 * @param atom1
 * @param atom2
 * @returns {if intersects [true, ort of r2 - r1] else [false, ort]}
 */
function detectIntersection(atom1, atom2){
    var r1 = new Vector3D(atom1.geom.position.x, atom1.geom.position.y, atom1.geom.position.z);
    var r2 = new Vector3D(atom2.geom.position.x, atom2.geom.position.y, atom2.geom.position.z);
    var relDist = Vector3D.substract(r2, r1);
    //console.log(`relative distance between pair of balls ${relDist.length}`);
    if (relDist.length <= 1 && relDist.length != 0){
        changeDirectionAfterCollision(atom1, atom2, relDist);
        return [true, Vector3D.normalize(relDist)];
    } else if (relDist.length === 0) {
        atom1.geom.position.x += 2;
    } else{
        return [false,  Vector3D.normalize(relDist)];
    }
}

function changeDirectionAfterCollision(atom1, atom2, dr12){
    // get central components of atoms velocities
    var v112 = Vector3D.multiplyOnScalar(dr12, Vector3D.scalarProd(atom1.v, dr12));
    var v212 = Vector3D.multiplyOnScalar(dr12, Vector3D.scalarProd(atom2.v, dr12));
    // get normal to the central line components of velocities
    var vn112 = Vector3D.cross(atom1.v, dr12);
    var vn212 = Vector3D.cross(atom2.v, dr12);

    // atoms changes longitudinal component of velocities

    if (atom1.v.length < TRESHOLD){
        // case of one particle is static
        atom1.v = new Vector3D(Math.random(), Math.random(), Math.random());
        //atom2.v = atom1.v;
    } else if (atom2.v.length < TRESHOLD){
        // case of one particle is static
        atom2.v = - new Vector3D(Math.random(), Math.random(), Math.random());
    } else {
        //case of both particles are non-static
        atom1.v = Vector3D.add(vn112, v212);
        atom2.v = Vector3D.add(vn212, v112);
    }
}


render();

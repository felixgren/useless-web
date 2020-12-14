import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.123.0/examples/jsm/controls/OrbitControls.js';

const clock = new THREE.Clock();

let cubes, cubesGroup, controls, camera, scene, renderer;

let cubeCountX, cubeCountY, cubeCountZ;
let cubeSpaceX, cubeSpaceY, cubeSpaceZ;

let geometry, material;

init();
animate();

function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);  // Camera, which one, fov (degrees), aspect ratio, render distances min max
    camera.position.z = 30;

    renderer = new THREE.WebGLRenderer(); // WebGL but others supported as well
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement); // Orbital control
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.minDistance = 3;
    controls.maxDistance = 100;

    const audioFile = '/assets/audio/lordechojustdoyou.mp3';
    const listener = new THREE.AudioListener();
    camera.add(listener); // Add listener to camera

    new THREE.AudioLoader().load( // Instantiate a loader and load with .load
        audioFile, // songURL
        function (buffer) { // onLoad callback
            const song = new THREE.Audio(listener).setBuffer(buffer); // Instantiate audio object 'song' & set audio buffer to it
            song.play();
        },
        function (xhr) { // onProgress callback
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        }
    )

    geometry = new THREE.BoxGeometry(1, 1, 1); // Contains all vertices & faces (points & fill) for cube
    material = new THREE.MeshNormalMaterial(); // Colors cube with RGB
    // function makeInstance(geometry, material, x, y, z) {
    //     const cube = new THREE.Mesh(geometry, material); // Cube mesh. Mesh object takes geometry and applies a material.
    //     scene.add(cube); // Adds the cube, default coords 0,0,0
    //     cubesGroup.add(cube);

    //     cube.position.x = x;
    //     cube.position.y = y;
    //     cube.position.z = z;

    //     return cube;
    // }


    // makeInstance();

    cubeCountX = 5;
    cubeCountY = 5;
    cubeCountZ = 5;

    cubeSpaceX = 1.5;
    cubeSpaceY = 1.5;
    cubeSpaceZ = 1.5;

    drawCubes();

    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    // scene.add(cubesGroup)
    controls.update();

}

function makeInstance(geometry, material, x, y, z) {
    const cube = new THREE.Mesh(geometry, material); // Cube mesh. Mesh object takes geometry and applies a material.
    scene.add(cube); // Adds the cube, default coords 0,0,0
    // cubesGroup = new THREE.Group();
    cubesGroup.add(cube);

    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;

    return cube;
}

function drawCubes() {
    cubesGroup = new THREE.Group();
    cubes = [];
    for (let x = 0; x < cubeCountX; x++) {
        for (let y = 0; y < cubeCountY; y++) {
            for (let z = 0; z < cubeCountZ; z++) {
                console.log(cubeCountX)
                const positionX = (x - ((cubeCountX - 1) / 2)) * cubeSpaceX;
                const positionY = (y - ((cubeCountY - 1) / 2)) * cubeSpaceY;
                const positionZ = (z - ((cubeCountZ - 1) / 2)) * cubeSpaceZ;
                cubes.push(makeInstance(geometry, material, positionX, positionY, positionZ))
            }
        }
    }
    scene.add(cubesGroup)
}

// Render loop, draws scene at screen refresh rate. Uses requestAnimationFrame instead of SetInterval. Everything inside runs every refresh.
function animate(timestamp) {

    requestAnimationFrame(animate);

    const delta = clock.getDelta() * 60;
    let time = timestamp * 0.001; // Time elapsed ms → seconds 

    cubes.forEach((cube, key) => {

        if (time <= 2) {

            cubesGroup.position.x = Math.sin( time * 0.6 ) * 9;

            // cube.position.x = Math.tan(time * 0.6) * (0.2 * key);
            // cube.scale.x = Math.sin(time) * 5;
            // cube.scale.z = Math.tan(time * 0.5) * (10);
            // cube.rotation.x = time;
            // cube.rotation.y = time;

            // cube
            // cubeCountX = 1;
            // cubeCountY = 1;
            // cubeCountZ = 5;
        }

        else if (time > 2 && time < 10) {
            // cube.scale.x = Math.sin(time) * 50;
            // cube.rotation.x = Math.sin(time * 0.2);
            // cube.rotation.y = Math.sin(time * 0.2);
            if (cubeCountX === 5) {
                // cubesGroup.geometry.dispose()
                // cubes.splice(0, cubes.length)
                scene.remove(cubesGroup)
                cubeCountX = 10;
                cubeCountY = 10;
                cubeCountZ = 10;
                drawCubes();
                
            }
        }

        else if (time > 10) {
            // cube.position.x = Math.tan(time * 0.005 * key) * 5;
        }

    });

    controls.update();
    renderer.render(scene, camera);

}
import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.123.0/examples/jsm/controls/OrbitControls.js';

const clock = new THREE.Clock();

let cubes, cubesGroup, controls, camera, scene, renderer;

let cubeCount = { x: 5, y: 5, z: 5 };
let cubeSpacing = { x: 1.5, y: 1.5, z: 1.5 };
let cubeSize = { x: 1, y: 1, z: 1 };



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

    drawCubes();

    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    controls.update();

}

function makeInstance(geometry, material, x, y, z) {
    const cube = new THREE.Mesh(geometry, material); // Cube mesh. Mesh object takes geometry and applies a material.
    scene.add(cube); // Adds the cube, default coords 0,0,0
    cubesGroup.add(cube);

    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;

    return cube;
}

function drawCubes() {
    material = new THREE.MeshNormalMaterial(); // Colors cube with RGB
    geometry = new THREE.BoxGeometry(cubeSize.x, cubeSize.y, cubeSize.z); // Contains all vertices & faces (points & fill) for cube.
    cubesGroup = new THREE.Group();
    cubes = [];
    for (let x = 0; x < cubeCount.x; x++) {
        for (let y = 0; y < cubeCount.y; y++) {
            for (let z = 0; z < cubeCount.z; z++) {
                const positionX = (x - ((cubeCount.x - 1) / 2)) * cubeSpacing.x;
                const positionY = (y - ((cubeCount.y - 1) / 2)) * cubeSpacing.y;
                const positionZ = (z - ((cubeCount.z - 1) / 2)) * cubeSpacing.z;
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

    time += 28;

    cubes.forEach((cube, key) => {

        // cubesGroup.position.x = Math.sin(time * 5) * 10;

        if (time <= 15) {
            // cubesGroup.position.x = Math.sin(time * 5) * 10;

            cube.position.x = Math.tan(time * 0.6) * (0.2 * key);
            cube.scale.x = Math.sin(time) * 5;
            cube.scale.z = Math.tan(time * 0.5) * (10);
            cube.rotation.x = time;
            cube.rotation.y = time;
        }

        else if (time > 15 && time < 30) {

            if (cubeCount.x === 5) {
                scene.remove(cubesGroup)
                Object.assign(cubeCount, { x: 10, y: 10, z: 1 })
                Object.assign(cubeSpacing, { x: 1.5, y: 1.5, z: 1.5 })
                Object.assign(cubeSize, { x: 1, y: 1, z: 1 })
                drawCubes();
            }
            cube.scale.x = Math.sin(time) * 50;
            cube.rotation.x = Math.sin(time * 0.2);
            cube.rotation.y = Math.sin(time * 0.2);
            cube.rotation.z = Math.tan(time * 0.002);
        }

        else if (time > 30) {

            if (cubeCount.x === 10) {
                scene.remove(cubesGroup)
                Object.assign(cubeCount, { x: 7, y: 7, z: 7 })
                Object.assign(cubeSpacing, { x: 2, y: 2, z: 2 })
                Object.assign(cubeSize, { x: 1, y: 1, z: 1 })
                drawCubes();
            }
            cubesGroup.rotation.y = Math.sin(time * 0.5) * 9;
        }

    });

    controls.update();
    renderer.render(scene, camera);

}
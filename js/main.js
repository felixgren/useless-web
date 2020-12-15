import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.123.0/examples/jsm/controls/OrbitControls.js';

const clock = new THREE.Clock();

let cubes, cubesGroup, cube, controls, camera, scene, renderer;

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

    const audioFile = '/assets/audio/bamboo.mp3';
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
    cube = new THREE.Mesh(geometry, material); // Cube mesh. Mesh object takes geometry and applies a material.
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

    // time += 74;

    cubes.forEach((cube, key) => {
        // FIRST - WAVEY
        if (time <= 15) {
            if (cubeCount.x === 5) {
                scene.remove(cubesGroup)
                Object.assign(cubeCount, { x: 10, y: 20, z: 1 })
                Object.assign(cubeSpacing, { x: 1.5, y: 1.5, z: 1.5 })
                Object.assign(cubeSize, { x: 1, y: 1, z: 1 })
                drawCubes();
            }
            cube.position.x = Math.tan(time * 0.6) * (0.2 * key);
            cube.scale.x = Math.sin(time) * 5;
            cube.scale.z = Math.tan(time * 0.5) * (10);
            cube.rotation.x = time;
            cube.rotation.y = time;
        }

        // SECOND - BIG CUBE
        else if (time > 15 && time < 30) {

            if (cubeCount.y === 20) {
                scene.remove(cubesGroup)
                Object.assign(cubeCount, { x: 10, y: 10, z: 1 })
                Object.assign(cubeSpacing, { x: 1.5, y: 1.5, z: 1.5 })
                Object.assign(cubeSize, { x: 1, y: 1, z: 1 })
                drawCubes();
            }
            cube.scale.x = Math.sin(time)/2 * 20;
            cube.rotation.x = Math.sin(time * 0.2);
            cube.rotation.y = Math.sin(time * 0.2);
        }

        // THIRD - FLOATING (needs work)
        else if (time > 30 && time < 45) {

            if (cubeCount.x === 10) {
                scene.remove(cubesGroup)
                Object.assign(cubeCount, { x: 7, y: 7, z: 1 })
                Object.assign(cubeSpacing, { x: 4, y: 4, z: 90 })
                Object.assign(cubeSize, { x: 1, y: 1, z: 1 })
                drawCubes();
            }
            cube.position.x = (Math.tan(time * 0.005 * key) * 5 + key) - key/2;
            cube.position.z = Math.sin((time * 0.005) + key * 3) * 5;
            
            cube.rotation.x = Math.sin(time * 0.3) + key;
            cube.rotation.y = Math.sin(time * 0.3);
        }

        // FORTH - SQUARE PATTERN
        else if (time > 45 && time < 60) {

            if (cubeSpacing.x === 4) {
                scene.remove(cubesGroup)
                Object.assign(cubeCount, { x: 20, y: 20, z: 1 })
                Object.assign(cubeSpacing, { x: 1.1, y: 1.1, z: 1.1 })
                Object.assign(cubeSize, { x: 1, y: 1, z: 1 })
                drawCubes();
            }
            let currentX = cube.position.x
            let currentY = cube.position.y

            cube.position.z = Math.sin((time * 3) + Math.sqrt(currentX * currentX + currentY * currentY))
            cube.rotation.x = time * 1.3;

            cubesGroup.rotation.y = Math.sin(time * 0.5) * 0.2;
            
            cubesGroup.scale.y = Math.sin(time * 0.2) * 0.8;
            cubesGroup.scale.x = Math.sin(time * 0.2) * 0.8;

            if (time > 50) { // Can be used for outro effect
            }
        }

        // FIFTH - SQUARE PATTERN PT.2
        else if (time > 60 && time < 75) {

            if (cubeSpacing.x === 1.1) {
                scene.remove(cubesGroup)
                Object.assign(cubeCount, { x: 20, y: 20, z: 1 })
                Object.assign(cubeSpacing, { x: 1.2, y: 1.2, z: 1.2 })
                Object.assign(cubeSize, { x: 1, y: 1, z: 1 })
                drawCubes();
            }

            let currentX = cube.position.x
            let currentY = cube.position.y
            let currentZ = cube.position.z
            cube.position.z = Math.tan((time * 0.1) + Math.sqrt(currentX * currentX + currentY * currentY))
            cube.rotation.x = time;
        }

        // SIXTH - SQUARE EXPERIMENTAL
        else if (time > 75 && time < 90) {

            if (cubeCount.x === 5) {
                scene.remove(cubesGroup)
                Object.assign(cubeCount, { x: 20, y: 20, z: 1 })
                Object.assign(cubeSpacing, { x: 1.2, y: 1.2, z: 1.2 })
                Object.assign(cubeSize, { x: 1, y: 1, z: 1 })
                drawCubes();
            }

            let currentX = cube.position.x
            let currentY = cube.position.y
            let currentZ = cube.position.z

            //BASE
            cube.position.z = Math.tan((time * 0.1) + Math.sqrt(currentX * currentX + currentY * currentY))
            cube.rotation.x = time;

            //CIRCLE
            cubesGroup.position.x = Math.sin(time * 2) * 0.7;
            cubesGroup.position.y = Math.cos(time * 2) * 0.7;

            //SPIN
            cubesGroup.rotation.z = Math.sin(time * 0.2) * 2;

            //OTHER
            // cube.rotation.z = Math.sin(time * 5.2) * 2;
            // cube.rotation.z = Math.sin(time * 0.05) * 2+ currentZ;

        }

        // SEVENTH - LINE
        else if (time > 90 && time < 180) {

            if (cubeSpacing.x === 1.2) {
                const cubeGenerator = Math.round(window.innerWidth / 60 + 2); // To cover screen. Each cube around 60px
                scene.remove(cubesGroup)
                Object.assign(cubeCount, { x: cubeGenerator, y: 1, z: 1 })
                Object.assign(cubeSpacing, { x: 1.5, y: 1.5, z: 1.5 })
                Object.assign(cubeSize, { x: 0.2, y: 0.2, z: 0.2 })
                drawCubes();
            }

            cube.rotation.x += (0.02 + key * 0.00008) * delta;
            cube.rotation.y += 0.02 * delta;

            cube.position.y = Math.sin(timestamp * (key * 0.05) / 300 + key / 6);
            cube.scale.y = Math.sin(20 + key) + key * 2;

            if (time > 100) {
                cube.scale.y = 1;
                if (cube.scale.x >= 2000) {
                    cube.scale.x = 2000;
                } else {
                    cube.scale.x += 5;
                }
            }

            if (time > 115) {
                cube.rotation.x += 0.003;
                cube.rotation.y += 0.003;
                cube.rotation.z += 0.003;
            }
        }

        // LAST ANIMATION 
        else if (time > 180 && time < 200) { // Default for new anim

            if (cubeSize.x === 0.2) {
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
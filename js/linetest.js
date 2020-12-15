import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.123.0/examples/jsm/controls/OrbitControls.js';

const clock = new THREE.Clock();

let cubes, cubesGroup, controls, camera, scene, renderer;

let cubeCount = { x: 5, y: 5, z: 5 };
let cubeSpacing = { x: 1.5, y: 1.5, z: 1.5 };

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

    geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2); // Contains all vertices & faces (points & fill) for cube
    material = new THREE.MeshNormalMaterial(); // Colors cube with RGB

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

    cubes.forEach((cube, key) => {

        if (cubeCount.x === 5) {
            const cubeGenerator = Math.round(window.innerWidth / 60 + 2);

            scene.remove(cubesGroup)
            Object.assign(cubeCount, { x: cubeGenerator, y: 1, z: 1 })
            Object.assign(cubeSpacing, { x: 1.5, y: 1.5, z: 1.5 })
            drawCubes();

        }

        // const rotation = 0.02 + key * 0.00008;
        // cube.rotation.x += key * delta * 0.001; // First 1
        // cube.rotation.x += rotation * delta; // First 2

        // cube.rotation.x = time * 0.5
        // cube.rotation.x = (time) + (key * 3.3);
        
        // cube.scale.z = Math.sin((time * 1))

        // cube.rotation.x += (0.002 + key * 0.0000008) * delta; // Original, desync..


        // cube.rotation.y += 0.02 * delta;
        // cube.rotation.y = time * 0.5;

        // cube.scale.y = Math.sin(20 + key) + key * 2; // Small from large length

        // cube.position.y = Math.sin(timestamp * (key * 0.05) / 300 + key / 6); // Original
        // cube.position.y = Math.sin(time * (key) + key / 6); // SUPA FAST
        // cube.position.y = Math.sin((time * 3) + (key * 100)); //Fav?
        // cube.position.y = Math.sin((time * 4) + (key * 0.2));
        // cube.position.y = Math.sin((time * 3) + cube.scale.y * 0.2)


        if (time > 8) {
            // cube.scale.y = 1;
            
            // if (cube.scale.x >= 2000) {
            //     cube.scale.x = 2000;
            // } else {
            //     cube.scale.x += 5;
            // }

        }

        if (time > 30) {

            // cube.rotation.x += 0.003;
            // cube.rotation.y += 0.003;
            // cube.rotation.z += 0.003;

        }

    });

    controls.update();
    renderer.render(scene, camera);
}
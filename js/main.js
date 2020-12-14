import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.123.0/examples/jsm/controls/OrbitControls.js';

const clock = new THREE.Clock();

let cubes, cubesGroup, controls, camera, scene, renderer;

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

    new THREE.AudioLoader().load ( // Instantiate a loader and load with .load
        audioFile, // songURL
        function (buffer) { // onLoad callback
        const song = new THREE.Audio(listener).setBuffer(buffer); // Instantiate audio object 'song' & set audio buffer to it
        song.play();
    },
        function ( xhr ) { // onProgress callback
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        }
    )

    const geometry = new THREE.BoxGeometry(1, 1, 1); // Contains all vertices & faces (points & fill) for cube
    const material = new THREE.MeshNormalMaterial(); // Colors cube with RGB
    function makeInstance(geometry, material, x, y, z) {
        const cube = new THREE.Mesh(geometry, material); // Cube mesh. Mesh object takes geometry and applies a material.
        scene.add(cube); // Adds the cube, default coords 0,0,0
        cubesGroup.add(cube);

        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;

        return cube;
    }

    const cubeCountX = 5;
    const cubeCountY = 5;
    const cubeCountZ = 5;

    cubesGroup = new THREE.Group();
    cubes = [];
    for (let x = 0; x < cubeCountX; x++) {
        for (let y = 0; y < cubeCountY; y++) {
            for (let z = 0; z < cubeCountZ; z++) {
                const positionX = (x - ((cubeCountX - 1) / 2)) * 1.5;
                const positionY = (y - ((cubeCountY - 1) / 2)) * 1.5;
                const positionZ = (z - ((cubeCountZ - 1) / 2)) * 1.5;
                cubes.push(makeInstance(geometry, material, positionX, positionY, positionZ))
            }
        }
    }

    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    scene.add(cubesGroup)
    controls.update();

}

// Render loop, draws scene at screen refresh rate. Uses requestAnimationFrame instead of SetInterval. Everything inside runs every refresh.
function animate(timestamp) {

    requestAnimationFrame(animate);

    const delta = clock.getDelta() * 60;
    let time = timestamp * 0.001; // Time elapsed ms → seconds 

    cubes.forEach((cube, key) => {

        cubesGroup.position.x = Math.sin( time * 0.6 ) * 9;

        // if (time <= 5) {
            // cube.position.x = Math.sin(time * 2) * (5);
            // cube.position.x += 0.01;
            // cube.position.x += Math.tan(time * 0.005) * 2;
            // cube.position.x -= Math.sin(time * 0.005) * (1);
        // } 

        // else if (time > 5 && time < 10) {

        // }

        // else if (time > 10) {

        // }

        // cube.position.x = Math.sin( time * 0.6 ) * 9;
        // cube.position.x += 2;

    });

    controls.update();
    renderer.render(scene, camera);

}
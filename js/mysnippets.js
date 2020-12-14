// Performence addon, source: https://github.com/mrdoob/stats.js/
(function () { var script = document.createElement('script'); script.onload = function () { var stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop) }); }; script.src = '//mrdoob.github.io/stats.js/build/stats.min.js'; document.head.appendChild(script); })()


// Pos 1 sol
const positionX = (x - ((cubeCount - 1) / 2)) * 1.1;
const positionY = (y - ((cubeCount - 1) / 2)) * 1.1;


// Pos 2 sol
const positionX = ((-cubeCount - 1) / 2) + x * 1.1;
const positionY = ((-cubeCount - 1) / 2) + y * 1.1;


// Move test
cube.position.y += 0.01 + speed * 0.0005;
cube.position.x += 0.01 + speed * 0.0005;


// Sin test
cubes.forEach((cube) => {
    cube.position.y = Math.sin(timestamp / 300 + cube.position.x / 6);
});


// Old spawn sys
const cubes = [
    makeInstance(geometry, -2, 2),
    makeInstance(geometry, 0, 2),
    makeInstance(geometry, 2, 2),
    makeInstance(geometry, -2, 0),
    makeInstance(geometry, 0, 0),
    makeInstance(geometry, 2, 0),
    makeInstance(geometry, -2, -2),
    makeInstance(geometry, 0, -2),
    makeInstance(geometry, 2, -2)
];


// Alternative spawn sys
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshNormalMaterial();
const cubeGroup = new THREE.Group();

for (let i = 0; i < 10; i++) {
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = i * 1.1;
    cube.position.y = 0;
    cubeGroup.add(cube);
}
scene.add(cubeGroup);
console.log(cubeGroup);


// Resize function version
window.addEventListener('resize', onWindowResize)

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}


// Delta test to sync anim
let lastFrameTime = 0;

const deltaTime = (timestamp - lastFrameTime) * 0.001;
lastFrameTime = timestamp;

cube.rotation.y += 0.01 * deltaTime;


// 60hz limit test, 120hz+ anims too fast. Fails does not sync.
setTimeout(function () {
    requestAnimationFrame(animate);
}, 1000 / 60);


// Speed test, increments by 1 without being defined with value by default.
for (let i = 0; i < 10; i++) {
    console.log(`hej ${i}`);
}

cubes.forEach((cube, speed) => {
    console.log('hej');
    console.log(speed);
});


// Sin position using time
function animate(timestamp) {

    requestAnimationFrame(animate);

    let time = timestamp * 0.001; // Time elapsed ms → seconds 

    cubes.forEach((cube) => {
        cube.position.x = Math.sin(time * 10) * 5; // Numbers set speed(1) & length(2)
    });

    renderer.render(scene, camera);
}

//Loads of animation tests

// Wavy, should have X:1.1 Y:1.5 sizing
cube.position.x = Math.tan(time * 0.6) * (0.2 * key);
cube.scale.x = Math.sin(time) * 5;
cube.scale.z = Math.tan(time * 0.5) * (10);
cube.rotation.x = time;
cube.rotation.y = time;

cube.position.x = Math.tan(time * 0.6) * (0.2 * key);
cube.position.y = Math.tan(time * 1) * 1;
cube.scale.z = Math.tan(time * 0.5) * (10);

cube.scale.x = Math.sin(time) * 50;
cube.rotation.x = Math.sin(time * 0.2);
cube.rotation.y = Math.sin(time * 0.2);

cube.position.x = Math.tan(time * 1) * 5;

cube.position.x = Math.tan(time * 0.005 * key) * 5;
cube.rotation.x = Math.sin(time * 0.3);
cube.rotation.y = Math.sin(time * 0.3);
time += 10000

cube.position.x = Math.tan(time * 0.005 * key) * 5;
cube.position.y = Math.tan(time * 0.005 * key) * 5;
cube.position.z = Math.tan(time * 0.009) * 5;
cube.scale.x = Math.sin(time * 0.001 * key) * 10;
cube.position.x = (time += 10000);

cube.scale.y = Math.cos(time * 0.05 * key) * 5;
cube.rotation.x = Math.sin(time * 1);
cube.rotation.y = Math.sin(time * 1);
cube.rotation.z = Math.sin(time * 1);

time += 10000

cube.position.x = Math.tan(time * 5) * (0.2 * key);
cube.position.y = Math.sin(time * 1) * (0.2 * key);

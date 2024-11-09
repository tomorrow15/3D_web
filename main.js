// main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(30, 30, 30);
camera.lookAt(0, 0, 0);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth movement
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;
controls.enableZoom = true;
controls.enablePan = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 2.0;

// Create axes
const axisLength = 20;
const axes = new THREE.Group();

// Add grid helper
const gridHelper = new THREE.GridHelper(30, 30, 0x404040, 0x404040);
scene.add(gridHelper);

// X-axis (red)
const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(axisLength, 0, 0)
]);
const xAxis = new THREE.Line(xAxisGeometry, new THREE.LineBasicMaterial({ color: 0xff0000 }));
axes.add(xAxis);

// Y-axis (green)
const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, axisLength, 0)
]);
const yAxis = new THREE.Line(yAxisGeometry, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
axes.add(yAxis);

// Z-axis (blue)
const zAxisGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, axisLength)
]);
const zAxis = new THREE.Line(zAxisGeometry, new THREE.LineBasicMaterial({ color: 0x0000ff }));
axes.add(zAxis);

scene.add(axes);

// Create moving points
const pointGeometry = new THREE.SphereGeometry(0.5, 32, 32);

// X axis point (red)
const xPointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const xPoint = new THREE.Mesh(pointGeometry, xPointMaterial);
scene.add(xPoint);

// Y axis point (green)
const yPointMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const yPoint = new THREE.Mesh(pointGeometry, yPointMaterial);
scene.add(yPoint);

// Z axis point (blue)
const zPointMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const zPoint = new THREE.Mesh(pointGeometry, zPointMaterial);
scene.add(zPoint);

// Animation controls
let time = 0;

// Create UI controls
const controlsDiv = document.createElement('div');
controlsDiv.style.position = 'absolute';
controlsDiv.style.top = '20px';
controlsDiv.style.left = '20px';
controlsDiv.style.zIndex = '100';
document.body.appendChild(controlsDiv);

// Auto-rotation toggle button
const autoRotateBtn = document.createElement('button');
autoRotateBtn.textContent = 'Stop Rotation';
autoRotateBtn.style.marginRight = '10px';
autoRotateBtn.addEventListener('click', () => {
    controls.autoRotate = !controls.autoRotate;
    autoRotateBtn.textContent = controls.autoRotate ? 'Stop Rotation' : 'Start Rotation';
});
controlsDiv.appendChild(autoRotateBtn);

// Speed control
const speedControl = document.createElement('div');
speedControl.style.marginTop = '10px';
speedControl.innerHTML = `
    <label style="color: white; margin-right: 10px;">Rotation Speed:</label>
    <input type="range" min="0.5" max="5" step="0.5" value="2">
    <span style="color: white; margin-left: 10px;">2.0</span>
`;
controlsDiv.appendChild(speedControl);

const speedSlider = speedControl.querySelector('input');
const speedValue = speedControl.querySelector('span');
speedSlider.addEventListener('input', (e) => {
    controls.autoRotateSpeed = parseFloat(e.target.value);
    speedValue.textContent = controls.autoRotateSpeed.toFixed(1);
});

// View preset buttons
const presetViews = {
    'Top View': { x: 0, y: 50, z: 0 },
    'Front View': { x: 0, y: 0, z: 50 },
    'Side View': { x: 50, y: 0, z: 0 },
    'Isometric': { x: 30, y: 30, z: 30 }
};

const viewButtonsDiv = document.createElement('div');
viewButtonsDiv.style.marginTop = '10px';
controlsDiv.appendChild(viewButtonsDiv);

Object.entries(presetViews).forEach(([name, position]) => {
    const button = document.createElement('button');
    button.textContent = name;
    button.style.marginRight = '10px';
    button.addEventListener('click', () => {
        // Animate camera position change
        new TWEEN.Tween(camera.position)
            .to(position, 1000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .start();
        camera.lookAt(0, 0, 0);
    });
    viewButtonsDiv.appendChild(button);
});

// Add controls info
const infoDiv = document.createElement('div');
infoDiv.style.position = 'absolute';
infoDiv.style.bottom = '20px';
infoDiv.style.left = '20px';
infoDiv.style.color = 'white';
infoDiv.style.zIndex = '100';
infoDiv.innerHTML = `
    Controls:<br>
    - Left click + drag: Rotate view<br>
    - Right click + drag: Pan view<br>
    - Scroll: Zoom in/out
`;
document.body.appendChild(infoDiv);

// Animation
function animate() {
    requestAnimationFrame(animate);
    
    time += 0.02;
    
    // Move points along their respective axes
    xPoint.position.set(15 * Math.sin(time), 0, 0);
    yPoint.position.set(0, 15 * Math.sin(time + Math.PI/3), 0);
    zPoint.position.set(0, 0, 15 * Math.sin(time + 2*Math.PI/3));
    
    // Update orbit controls
    controls.update();
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add button styles
const style = document.createElement('style');
style.textContent = `
    button {
        background-color: #4CAF50;
        border: none;
        color: white;
        padding: 8px 16px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 14px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 4px;
    }
    button:hover {
        background-color: #45a049;
    }
    input[type="range"] {
        width: 150px;
        vertical-align: middle;
    }
`;
document.head.appendChild(style);

// Start animation
animate();
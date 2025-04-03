// Three.js setup
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Variables for animation
let flowSpeed = 2;
let cellCount = 120;
let vesselLength = 300;
let vesselRadius = 50;
let cells = [];

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f5f5);

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 100, 200);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Controls for camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 100;
controls.maxDistance = 500;

// Cell appearance
const cellTypes = {
  red: {
    color: 0xe74c3c,
    secondaryColor: 0xc0392b,
    baseSize: 4,
    create: createRedBloodCell,
  },
  white: {
    color: 0xecf0f1,
    secondaryColor: 0xbdc3c7,
    baseSize: 6,
    create: createWhiteBloodCell,
  },
  platelet: {
    color: 0xf1c40f,
    secondaryColor: 0xf39c12,
    baseSize: 2.5,
    create: createPlatelet,
  },
};

// Controls
const flowSpeedSlider = document.getElementById("flow-speed");
const cellCountSlider = document.getElementById("cell-count");
const showRedCheck = document.getElementById("show-red");
const showWhiteCheck = document.getElementById("show-white");
const showPlateletsCheck = document.getElementById("show-platelets");
const resetButton = document.getElementById("reset");

// Event listeners
flowSpeedSlider.addEventListener("input", () => {
  flowSpeed = parseFloat(flowSpeedSlider.value);
});

cellCountSlider.addEventListener("input", () => {
  cellCount = parseInt(cellCountSlider.value);
  initCells();
});

resetButton.addEventListener("click", () => {
  flowSpeed = 2;
  cellCount = 120;
  flowSpeedSlider.value = flowSpeed;
  cellCountSlider.value = cellCount;
  showRedCheck.checked = true;
  showWhiteCheck.checked = true;
  showPlateletsCheck.checked = true;
  initCells();
});

// Cell visibility toggles
showRedCheck.addEventListener("change", updateCellVisibility);
showWhiteCheck.addEventListener("change", updateCellVisibility);
showPlateletsCheck.addEventListener("change", updateCellVisibility);

function updateCellVisibility() {
  cells.forEach((cell) => {
    if (cell.type === "red") {
      cell.mesh.visible = showRedCheck.checked;
    } else if (cell.type === "white") {
      cell.mesh.visible = showWhiteCheck.checked;
    } else if (cell.type === "platelet") {
      cell.mesh.visible = showPlateletsCheck.checked;
    }
  });
}

// Resize event
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Create blood vessel
function createBloodVessel() {
  // Vessel tube
  const vesselGeometry = new THREE.CylinderGeometry(
    vesselRadius,
    vesselRadius,
    vesselLength,
    32,
    1,
    true
  );
  const vesselMaterial = new THREE.MeshPhongMaterial({
    color: 0xd35400,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
  });
  const vessel = new THREE.Mesh(vesselGeometry, vesselMaterial);
  vessel.rotation.x = Math.PI / 2;
  scene.add(vessel);

  // Wall mesh to make the vessel visible
  const wallGeometry = new THREE.CylinderGeometry(
    vesselRadius,
    vesselRadius,
    vesselLength,
    32
  );
  const wallMaterial = new THREE.MeshPhongMaterial({
    color: 0xd35400,
    transparent: true,
    opacity: 0.1,
    wireframe: true,
  });
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.rotation.x = Math.PI / 2;
  scene.add(wall);
}

// Cell factory functions
function createRedBloodCell() {
  // Create a disc-like shape
  const geometry = new THREE.SphereGeometry(1, 16, 16);

  // Flatten it
  for (let i = 0; i < geometry.attributes.position.count; i++) {
    geometry.attributes.position.setY(
      i,
      geometry.attributes.position.getY(i) * 0.3
    );
  }

  geometry.computeVertexNormals();

  const material = new THREE.MeshPhongMaterial({
    color: cellTypes.red.color,
    shininess: 50,
  });

  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function createWhiteBloodCell() {
  // Base sphere
  const geometry = new THREE.SphereGeometry(1, 16, 16);
  const material = new THREE.MeshPhongMaterial({
    color: cellTypes.white.color,
    shininess: 50,
  });

  const mesh = new THREE.Mesh(geometry, material);

  // Add small bumps to represent the rough surface
  const bumpCount = 15;
  for (let i = 0; i < bumpCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / bumpCount);
    const theta = Math.sqrt(bumpCount * Math.PI) * phi;

    const bumpGeometry = new THREE.SphereGeometry(0.25, 18, 18);
    const bumpMaterial = new THREE.MeshPhongMaterial({
      color: cellTypes.white.secondaryColor,
      shininess: 35,
    });

    const bump = new THREE.Mesh(bumpGeometry, bumpMaterial);
    bump.position.setFromSphericalCoords(0.85, phi, theta);
    mesh.add(bump);
  }

  return mesh;
}

function createPlatelet() {
  // Create a disc-like shape
  const geometry = new THREE.SphereGeometry(1, 16, 16);

  // Flatten it
  for (let i = 0; i < geometry.attributes.position.count; i++) {
    geometry.attributes.position.setY(
      i,
      geometry.attributes.position.getY(i) * 0.4
    );
  }

  geometry.computeVertexNormals();

  const material = new THREE.MeshPhongMaterial({
    color: cellTypes.platelet.color,
    shininess: 50,
  });

  const mesh = new THREE.Mesh(geometry, material);

  // Add granules
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const granuleGeometry = new THREE.SphereGeometry(0.4, 8, 8);
    const granuleMaterial = new THREE.MeshPhongMaterial({
      color: cellTypes.platelet.secondaryColor,
      shininess: 50,
    });

    const granule = new THREE.Mesh(granuleGeometry, granuleMaterial);
    granule.position.set(0.5 * Math.cos(angle), 0, 0.5 * Math.sin(angle));
    mesh.add(granule);
  }

  return mesh;
}

// Cell class
class Cell {
  constructor(type) {
    this.type = type;
    this.reset();

    // Create mesh
    const typeProps = cellTypes[this.type];
    this.mesh = typeProps.create();
    this.mesh.scale.set(this.size, this.size, this.size);
    scene.add(this.mesh);
  }

  reset() {
    const typeProps = cellTypes[this.type];

    // Position cells randomly within the vessel
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * (vesselRadius - typeProps.baseSize * 2);

    this.x = Math.cos(angle) * radius;
    this.y = Math.sin(angle) * radius;
    this.z = -vesselLength / 2 - Math.random() * 50; // Start from the beginning of vessel

    this.size = typeProps.baseSize * (0.8 + Math.random() * 0.4);
    this.speed = (Math.random() * 0.5 + 0.8) * flowSpeed;

    // Random rotation
    this.rotX = Math.random() * Math.PI * 2;
    this.rotY = Math.random() * Math.PI * 2;
    this.rotZ = Math.random() * Math.PI * 2;

    // Rotation speeds
    this.rotSpeedX = (Math.random() - 0.5) * 0.02;
    this.rotSpeedY = (Math.random() - 0.5) * 0.02;
    this.rotSpeedZ = (Math.random() - 0.5) * 0.02;

    // Slight wobble in movement
    this.wobbleSpeed = Math.random() * 0.01 + 0.005;
    this.wobbleAmount = Math.random() * 0.5 + 0.2;
    this.wobbleOffset = Math.random() * Math.PI * 2;
  }

  update() {
    // Move forward
    this.z += this.speed * flowSpeed;

    // Add slight wobble to x and y
    const time = Date.now() * 0.001;
    const wobbleX =
      Math.sin(time * this.wobbleSpeed + this.wobbleOffset) * this.wobbleAmount;
    const wobbleY =
      Math.cos(time * this.wobbleSpeed + this.wobbleOffset) * this.wobbleAmount;

    // Update mesh position
    this.mesh.position.set(this.x + wobbleX, this.y + wobbleY, this.z);

    // Update rotation
    this.rotX += this.rotSpeedX * flowSpeed;
    this.rotY += this.rotSpeedY * flowSpeed;
    this.rotZ += this.rotSpeedZ * flowSpeed;
    this.mesh.rotation.set(this.rotX, this.rotY, this.rotZ);

    // Reset when off screen
    if (this.z > vesselLength / 2 + 20) {
      this.reset();
    }
  }

  dispose() {
    scene.remove(this.mesh);
    this.mesh.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => material.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
}

// Initialize cells
function initCells() {
  // Dispose existing cells
  cells.forEach((cell) => cell.dispose());
  cells = [];

  // Determine cell type distribution
  const redCount = Math.floor(cellCount * 0.8); // 80% red blood cells
  const whiteCount = Math.floor(cellCount * 0.1); // 10% white blood cells
  const plateletCount = cellCount - redCount - whiteCount; // 10% platelets

  // Create red blood cells
  for (let i = 0; i < redCount; i++) {
    cells.push(new Cell("red"));
  }

  // Create white blood cells
  for (let i = 0; i < whiteCount; i++) {
    cells.push(new Cell("white"));
  }

  // Create platelets
  for (let i = 0; i < plateletCount; i++) {
    cells.push(new Cell("platelet"));
  }

  // Distribute cells across the vessel
  cells.forEach((cell) => {
    cell.z = (Math.random() - 0.5) * vesselLength;
  });

  updateCellVisibility();
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.update();

  // Update cells
  cells.forEach((cell) => {
    cell.update();
  });

  // Render
  renderer.render(scene, camera);
}

// Initialize and start animation
createBloodVessel();
initCells();
animate();

// Add touch support for mobile devices
function setupTouchSupport() {
  let touchStartX, touchStartY;
  let touchMoved = false;

  renderer.domElement.addEventListener(
    "touchstart",
    (event) => {
      event.preventDefault();
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
      touchMoved = false;
    },
    { passive: false }
  );

  renderer.domElement.addEventListener(
    "touchmove",
    (event) => {
      touchMoved = true;
    },
    { passive: false }
  );
}

setupTouchSupport();

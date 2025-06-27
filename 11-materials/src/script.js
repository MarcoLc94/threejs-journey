import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

//Debug
const gui = new GUI();
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/** TEXTURES */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;

const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/3.png");
const matcaptTexture2 = textureLoader.load("/textures/matcaps/8.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//Excerise create 3 mashes with 3 different geometries and use the same basic mesh material and move 1 to left and other 1 to right

//this material is the basic acept colors and maps well
const sharedMaterial = new THREE.MeshBasicMaterial({ map: doorColorTexture });

//this material is to debug normal textures but has agreat purple color
const meshNormalMaterial = new THREE.MeshNormalMaterial();

//this is very useful material is great cause you can export your material and use in it and look so nice
const matcapMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
const matcapMaterial2 = new THREE.MeshMatcapMaterial({
  matcap: matcaptTexture2,
});

//this material works with shadows look so creepy and deep
const meshDeepMaterial = new THREE.MeshDepthMaterial();

//this material works with lights is not too good cause need to add ambient light or pointlight to see
const meshLambertMaterial = new THREE.MeshLambertMaterial();

//this also works with lights but is much pretty, this material need to properties
const meshphongMaterial = new THREE.MeshPhongMaterial();
meshphongMaterial.shininess = 100;
meshphongMaterial.specular = new THREE.Color(0x1188ff);

//This look to nice like  a toon
const toonMaterial = new THREE.MeshToonMaterial();
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
toonMaterial.gradientMap = gradientTexture;

//This is standard to see similar en most of programs
const meshStandard = new THREE.MeshStandardMaterial();
meshStandard.metalness = 1;
meshStandard.roughness = 1;
meshStandard.map = doorColorTexture;
meshStandard.aoMap = doorAmbientOcclusionTexture;
meshStandard.aoMapIntensity = 1;
meshStandard.displacementMap = doorHeightTexture;
meshStandard.displacementScale = 0.5;
meshStandard.metalnessMap = doorMetalnessTexture;
meshStandard.roughnessMap = doorRoughnessTexture;
meshStandard.normalMap = doorNormalTexture;
meshStandard.transparent = true;
meshStandard.alphaMap = doorAlphaTexture;

//This is extended from mesh standard but with more features
const meshPhysical = new THREE.MeshPhysicalMaterial();
meshPhysical.roughness = 0;
// meshPhysical.map = doorColorTexture;
meshPhysical.metalness = 0;
// meshPhysical.aoMap = doorAmbientOcclusionTexture;
// meshPhysical.aoMapIntensity = 1;
// meshPhysical.displacementMap = doorHeightTexture;
// meshPhysical.displacementScale = 0.5;
// meshPhysical.metalnessMap = doorMetalnessTexture;
// meshPhysical.roughnessMap = doorRoughnessTexture;
// meshPhysical.normalMap = doorNormalTexture;
// meshPhysical.transparent = true;
// meshPhysical.alphaMap = doorAlphaTexture;

//Gives crystal properties
meshPhysical.clearcoat = 1;
meshPhysical.clearcoatRoughness = 0;

//this gives sensation of is a sofa or teddy
// meshPhysical.sheen = 1;
// meshPhysical.sheenRoughness = 0.2;
// meshPhysical.sheenColor.set(1, 1, 1);

//this gives style likje bubble with fancy rainbow
// meshPhysical.iridescence = 1;
// meshPhysical.iridescenceIOR = 1;
// meshPhysical.iridescenceThicknessRange = [100, 800];

//this helps to give like a gummy transparency
meshPhysical.transmission = 1;
meshPhysical.ior = 1.5;

//ior numbers: diamond: 2.417, water: 1.333, air: 1.000293
meshPhysical.thickness = 0.5;

gui.add(meshPhysical, "metalness", 0, 1, 0.0001);
gui.add(meshPhysical, "roughness", 0, 1, 0.0001);
gui.add(meshPhysical, "displacementScale", 0, 1, 0.001);

gui.add(meshPhysical, "transmission", 0, 1, 0.0001);
gui.add(meshPhysical, "ior", 1, 10, 0.0001);
gui.add(meshPhysical, "thickness", 0, 1, 0.001);

gui.add(meshPhysical, "iridescence", 0, 5, 0.001);
gui.add(meshPhysical, "iridescenceIOR", 0, 5, 0.001);

const mesh1 = new THREE.Mesh(new THREE.TorusKnotGeometry(), meshPhysical);

const mesh2 = new THREE.Mesh(new THREE.TorusGeometry(), meshPhysical);

const mesh3 = new THREE.Mesh(new THREE.SphereGeometry(), meshPhysical);

scene.add(mesh1, mesh2, mesh3);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
const pointLight = new THREE.PointLight(0xffffff, 30);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
// scene.add(ambientLight, pointLight);

//ENVIROMENT MAP for standardmaterial but is also compatible with mashlamber and meshphong
const rgbeLoader = new RGBELoader();
rgbeLoader.load("/textures/environmentMap/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = environmentMap;
  scene.environment = environmentMap;
});

mesh2.position.x = -3;
mesh1.position.x = 3;

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Exercise rotate 3 elements
  mesh1.rotation.y = 0.1 * elapsedTime;
  mesh2.rotation.y = 0.1 * elapsedTime;
  mesh3.rotation.y = 0.1 * elapsedTime;

  mesh1.rotation.x = -0.15 * elapsedTime;
  mesh2.rotation.x = -0.15 * elapsedTime;
  mesh3.rotation.x = -0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

import * as THREE from "three";

//canvas
const canvas = document.querySelector("canvas.webgl");

//Scene
const scene = new THREE.Scene();

//Objects
const myGeometry = new THREE.BoxGeometry(1, 1, 1);

//Material
const material = new THREE.MeshBasicMaterial({ color: "red" });

//Mesh
const mesh = new THREE.Mesh(myGeometry, material);
mesh.rotateX = 3;

//Add to scene
scene.add(mesh);

//Sizes
const sizes = {
  width: 800,
  height: 600,
};

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;

scene.add(camera);

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

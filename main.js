import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { moon } from "./objects/moon.js";
import { rhdevs } from "./objects/rhdevs.js";
// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const cameraZ = 8;

camera.position.setZ(cameraZ);

renderer.render(scene, camera);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.1, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load("./assets/milky-way.jpeg");
scene.background = spaceTexture;

// Avatar

scene.add(rhdevs);

rhdevs.position.z = 80;
rhdevs.position.x = 8;

// Moon

scene.add(moon);

moon.position.x = 8;
moon.position.z = 35;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  const tiltDistance = 840;

  if (t + tiltDistance > 0) {
    camera.rotation.x = (tiltDistance + t) * 0.001;
  }

  camera.position.z = 100 + (t + tiltDistance) * 0.05;
}

function fadeTitle() {
  const header = document.getElementById("header");

  const distanceToTop = window.pageYOffset + header.getBoundingClientRect().top;
  const headerHeight = header.offsetHeight;
  const scrollTop = document.documentElement.scrollTop;

  let opacity = 1;

  if (scrollTop > distanceToTop) {
    opacity = 1 - ((scrollTop - distanceToTop) / headerHeight) * 2;
  }

  if (opacity >= 0) {
    header.style.opacity = opacity;
  }
}

function handleScroll() {
  moveCamera();
  fadeTitle();
}

document.body.onscroll = handleScroll;
handleScroll();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  moon.rotation.y += 0.005;

  rhdevs.rotation.x += rhdevs.rotation.x > 0.3 ? -0.002 : 0.002;
  rhdevs.rotation.y += 0.005;
  rhdevs.rotation.z += rhdevs.rotation.z > 0.5 ? -0.002 : 0.002;

  // controls.update();

  renderer.render(scene, camera);
}

animate();
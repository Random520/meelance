import gsap from 'gsap';
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import { ColorCorrectionShader } from "three/examples/jsm/shaders/ColorCorrectionShader.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 200;

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);
const GoldenambientLight = new THREE.AmbientLight(0xFFD700, 1);
scene.add(GoldenambientLight);
const blueLight = new THREE.AmbientLight(0x0000FF, 1);
scene.add(blueLight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('Poster_texture.png');

// Renderer
let canva = document.querySelector("#draw");
const renderer = new THREE.WebGLRenderer({ canvas: canva, alpha: true, antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
controls.maxPolarAngle = Math.PI;
controls.minPolarAngle = 0;

// Load 3D Model
const loader = new GLTFLoader();
loader.load(
  'Poster.glb',
  function (gltf) {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(1, 2, 9);
    model.traverse((child) => {
      if (child.isMesh) {
        child.material.map = texture;
        child.material.needsUpdate = true; // Ensure changes take effect
      }
    });
    scene.add(model);
    console.log("Model loaded successfully!");
  },
  undefined,
  function (error) {
    console.error("Error loading model:", error);
  }
);
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.4,
  0.4,
  0.80
)
composer.addPass(bloomPass);
const bokehPass = new BokehPass(scene, camera, {
  focus: 1,
  aperture: 0.0001,
  maxblur: 0.005
});
composer.addPass(bokehPass);
const filmPass = new FilmPass(0.35, 0.5, 512, false);
composer.addPass(filmPass);
const glitchPass = new GlitchPass();
composer.addPass(glitchPass);
const colorCorrectionPass = new ShaderPass(ColorCorrectionShader);
composer.addPass(colorCorrectionPass);

// Resize Handling
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  composer.render()
}
animate();

function loading_effect() {
  let meelance = document.querySelector("#meelance");
  let bg = document.querySelector("#page1");
  let text = 'meelance'
  let tl = gsap.timeline();
  meelance.innerHTML = text.split("").map(letter => `<span>${letter}</span>`).join("");
  tl.from('#meelance span', {
    y: 50,
    rotation:360,
    opacity:0,
    stagger:0.1,
    scale:1,
    duration:1,
    ease: "bounce.inOut",
  })
  tl.from(bg, {
    y:"150%",
    duration:2,
    ease: "power4.out"
  })
}
loading_effect();
function menu_hover_effect() {
  const menu_icon = document.querySelector('#menu_hai');
  menu_icon.addEventListener("mouseenter", function() {
    gsap.to(menu_icon, {
      x:-2,
      ease: "bounce.out",
      duration:0.1
    })
    menu_icon.className = "ri-menu-3-line";
  })
  menu_icon.addEventListener("mouseleave", function() {
    gsap.to(menu_icon, {
      x:2,
      ease: "bounce.out",
      duration:0.1
    })
    menu_icon.className = "ri-more-2-fill";
  })
}
menu_hover_effect();
function menu_opening_effect() {
  let menu_elem = document.querySelector("#menu h4");
  let menu_icon = document.querySelector("#menu_hai");
  menu_icon.addEventListener('click', function() {
    if(menu_elem.style.display === 'none' || !menu_elem.style.display) {
      gsap.to("#menu h4", {
        x: 2,
        display: "block",
        duration: 2,
        stagger:0.1,
        ease: "back.out"
      })
    } else {
      gsap.to("#menu h4", {
        x: -2,
        display: "none",
        duration:1,
        stagger:0.1

      })
    }
  })
}
menu_opening_effect();
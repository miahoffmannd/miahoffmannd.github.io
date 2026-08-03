import * as THREE from "https://unpkg.com/three@0.179.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.179.1/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "https://unpkg.com/three@0.179.1/examples/jsm/loaders/STLLoader.js";

const container = document.getElementById("viewer-steering");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f5f5);

const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 2));

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

const loader = new STLLoader();

loader.load("3dprints/steering-knob-ROC.STL", function (geometry) {

    geometry.center();

    const material = new THREE.MeshStandardMaterial({
        color: 0x5a8dee,
        metalness: 0.15,
        roughness: 0.6
    });

    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    const box = new THREE.Box3().setFromObject(mesh);
    const size = box.getSize(new THREE.Vector3()).length();

    camera.position.set(size, size * 0.8, size);
    controls.target.set(0,0,0);
    controls.update();
});

window.addEventListener("resize", () => {

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);

});

function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);

}

animate();

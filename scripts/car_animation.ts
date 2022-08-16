import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {IntersectionObservation} from './intersectionObservation';
//Car's container in the introduction. theres only one container so no need to have instances and everything is static.
class carCanvas{
    static introCarCanvas = document.getElementById("intro_car");
    static descriptionCanvas = document.getElementById('division-car');

    static getWidth(): number{
        if(window.innerWidth > 1536)
            return 1536;
        else
            return window.innerWidth;
    }

    static getHeight(): number{
        return (window.innerHeight - document.getElementById('intro_description').scrollHeight - 96);
    }
}

//onWindowResize
function canvasResize(): void{
    camera.aspect = carCanvas.getWidth()/carCanvas.getHeight();
    camera.updateProjectionMatrix();
    renderer.setSize(carCanvas.getWidth(), carCanvas.getHeight());
}

//recursively render again and again according to monitor's refresh rate
function animate(){
    let changeFactor = 1 - document.getElementById("intro").getBoundingClientRect().bottom/window.innerHeight; //How much offset for the camera
    if(changeFactor > 1) changeFactor = 1;
    let pos = [-2 + changeFactor*2, 2 , 2 - changeFactor*0.25];
    camera.position.set(pos[0],pos[1],pos[2]);
    camera.lookAt( 0, 0, 0 );

    renderer.render(scene,camera);
    requestAnimationFrame(animate);
}

//renderer
const renderer = new THREE.WebGLRenderer(
    {alpha:true, antialias:true}
); //alpha: allow transparent background
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( carCanvas.getWidth(), carCanvas.getHeight());
carCanvas.introCarCanvas.appendChild( renderer.domElement );
carCanvas.descriptionCanvas.appendChild( renderer.domElement );

//camera
const camera = new THREE.PerspectiveCamera( 50, carCanvas.getWidth()/carCanvas.getHeight(), 0.1, 200000 );
camera.position.set( -2,2,2);
camera.lookAt( 0, 0, 0 );


//scene
const scene = new THREE.Scene();

//Load the model
const modelLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader(); //for decompression
dracoLoader.setDecoderPath('../scripts/node_modules/three/examples/js/libs/draco/');
modelLoader.setDRACOLoader(dracoLoader);
modelLoader.load("../images/hkur_01_compressed.glb",function(gltf){
    document.getElementById("loading_screen").classList.add("hidden"); //removes loading screen
    gltf.scene.scale.set(1.15,1.15,1.15);
    gltf.scene.position.set(1.15,0,0);
    console.log(gltf.scene);
    gltf.scene.rotateOnAxis(new THREE.Vector3(1,0,0), -Math.PI/2);
    scene.add(gltf.scene);
}, undefined, function(error) {
    console.error(error);
});

//add light
const ambientLight = new THREE.AmbientLight(0x404040,1);
const light = new THREE.PointLight(0xffffff,1,16);
light.position.set(-1.5,1,1);
scene.add(ambientLight);
scene.add(light);

animate();
window.addEventListener('resize',canvasResize,false);

//scroll behaviour
let canvasBehaviour = new IntersectionObservation('#intro',0);
let canvasBehaviourBehaviourObserver = canvasBehaviour.generateObservation((entry:any) => {
    carCanvas.introCarCanvas.appendChild(renderer.domElement);
}, (entry:any) => {
    carCanvas.descriptionCanvas.appendChild(renderer.domElement);
});
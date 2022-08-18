import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {IntersectionObservation} from './intersectionObservation';
//Canvas container
class CanvasForAnimation{
    canvas: HTMLElement;
    constructor(elementId: string){
        this.canvas = document.getElementById(elementId)!;
    }

    //Returns true if and only if the canvas is intersecting with the viewport
    inViewport(): boolean{
        return ((this.canvas.getBoundingClientRect().bottom > 0) && (window.innerHeight - this.canvas.getBoundingClientRect().top > 0))
    }
}

//Div element to put the car canvas
class CarCanvas extends CanvasForAnimation{
    //Canvas size should be consistent, thus static.
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

let introCanvas = new CanvasForAnimation("intro");
let introCarCanvas = new CarCanvas("intro_car");
let divisionCanvas = new CanvasForAnimation("division");
let divisionCarCanvas = new CarCanvas("division_car");

//renderer
const renderer = new THREE.WebGLRenderer(
    {alpha:true, antialias:true}
); //alpha: allow transparent background
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( CarCanvas.getWidth(), CarCanvas.getHeight());
introCarCanvas.canvas.appendChild( renderer.domElement );
divisionCarCanvas.canvas.appendChild( renderer.domElement );

//camera
const camera = new THREE.PerspectiveCamera( 50, CarCanvas.getWidth()/CarCanvas.getHeight(), 0.1, 200000 );
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
    document.getElementById("loading_screen")!.classList.add("hidden"); //removes loading screen
    gltf.scene.scale.set(1.15,1.15,1.15);
    gltf.scene.position.set(1.15,0,0);
    console.log(gltf.scene);
    gltf.scene.rotateOnAxis(new THREE.Vector3(1,0,0), -Math.PI/2);
    scene.add(gltf.scene);
    animateScroll();
}, undefined, function(error) {
    console.error(error);
});

//add light
const ambientLight = new THREE.AmbientLight(0x404040,1);
const light = new THREE.PointLight(0xffffff,1,16);
light.position.set(-1.5,1,1);
scene.add(ambientLight);
scene.add(light);

//onWindowResize
window.addEventListener('resize',()=>{requestAnimationFrame(canvasResize);},false);
//Render in the correct aspect ratio and canvas size
function canvasResize(): void{
    camera.aspect = CarCanvas.getWidth()/CarCanvas.getHeight();
    camera.updateProjectionMatrix();
    renderer.setSize(CarCanvas.getWidth(), CarCanvas.getHeight());
    renderer.render(scene,camera);
}

//domElement manipulation on scroll
let canvasBehaviour = new IntersectionObservation('#intro',0);
let canvasBehaviourBehaviourObserver = canvasBehaviour.generateObservation((entry:any) => {
    introCarCanvas.canvas.appendChild(renderer.domElement);
    introCarCanvas.canvas.classList.add('fixed');
}, (entry:any) => {
    divisionCarCanvas.canvas.appendChild(renderer.domElement);
    introCarCanvas.canvas.classList.remove('fixed');
});

//Animate smoothly by activating requestAnimationFrame loop when scrolling starts and deactivating it when no scrolling has been done for 100ms
let scrolling: boolean = false;
let lastScrolling: number = null;

window.addEventListener('scroll',renderOnScroll,false);
function renderOnScroll(){
    if(!(introCanvas.inViewport() && divisionCanvas.inViewport())) return; //Not in scrolling area. Not rendering.
    lastScrolling = Date.now(); //Record the time of the latest scrolling event on scrolling area.
    if(scrolling) return; //already scrolling. do nothing.
    requestAnimationFrame(animateScroll); //not scrolling, so start the animation loop
    scrolling = true;
}

//Changes camera position according to where the page is scrolled and renders
function animateScroll(){
    let changeFactor = 1 - introCanvas.canvas.getBoundingClientRect().bottom/window.innerHeight; //How much offset for the camera
    if(changeFactor > 1) changeFactor = 1;
    let pos = [-2 + changeFactor*2, 2 , 2 - changeFactor*0.25];
    camera.position.set(pos[0],pos[1],pos[2]);
    camera.lookAt( 0, 0, 0 );

    renderer.render(scene,camera);

    if( Date.now() - lastScrolling < 100){ //100 ms yet since the last scrolling event?
        requestAnimationFrame(animateScroll); //not yet. stay in the loop
    }
    else{ //already stopped for 100ms. stopping the animation loop.
        scrolling = false;
        lastScrolling = null;
    }
}
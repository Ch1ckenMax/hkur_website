import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {IntersectionObservationHelper} from '../src/intersection_observation';
import {divisionDescriptionChange} from './division_descriptions';

//Canvas container
class CanvasForAnimation{
    canvas: HTMLElement;
    constructor(elementId: string){
        this.canvas = document.getElementById(elementId)!;
    }

    //Returns true if and only if the canvas is intersecting with the viewport
    inViewport(): boolean{
        return ((this.canvas.getBoundingClientRect().bottom > 0) && (window.innerHeight - this.canvas.getBoundingClientRect().top > 0));
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
        if(window.innerWidth > 768) //responsive design
            return (window.innerHeight - document.getElementById('intro_description')!.scrollHeight - 96);
        else
            return (screen.height/2 - 57);
    }
}

let introCanvas = new CanvasForAnimation("intro");
let introCarCanvas = new CarCanvas("intro_car");
let divisionCanvas = new CanvasForAnimation("division");
let divisionCarCanvas = new CarCanvas("division_car");
let carModel: THREE.Group;

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
    carModel = gltf.scene;
    gltf.scene.scale.set(1.15,1.15,1.15);
    if(window.innerWidth > 768) //responsive design
        gltf.scene.position.set(1.15,0,0);
    else
        gltf.scene.position.set(1.3,0,0);
    console.log(gltf.scene);
    gltf.scene.rotateOnAxis(new THREE.Vector3(1,0,0), -Math.PI/2);
    scene.add(gltf.scene);
    animate();
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
    if(window.innerWidth > 768) //responsive design
        carModel.position.set(1.15,0,0);
    else
        carModel.position.set(1.3,0,0);
    renderer.render(scene,camera);
}

//domElement manipulation on scroll
let canvasBehaviour = new IntersectionObservationHelper('#intro',0);
let canvasBehaviourBehaviourObserver = canvasBehaviour.generateObservation((entry:any) => {
    introCarCanvas.canvas.appendChild(renderer.domElement);
    introCarCanvas.canvas.classList.add('fixed');
}, (entry:any) => {
    divisionCarCanvas.canvas.appendChild(renderer.domElement);
    introCarCanvas.canvas.classList.remove('fixed');
});

//Animate smoothly by activating requestAnimationFrame loop when scrolling starts and deactivating it when no scrolling has been done for 100ms
let scrolling: boolean = false;
let lastScrolling: number|null = null;
window.addEventListener('scroll',renderOnScroll,false);
function renderOnScroll(){
    if(!(introCanvas.inViewport() && divisionCanvas.inViewport())) return; //Not in scrolling area. Not rendering.
    lastScrolling = Date.now(); //Record the time of the latest scrolling event on scrolling area.
    if(scrolling) return; //already scrolling. do nothing.
    requestAnimationFrame(animate); //not scrolling, so start the animation loop
    scrolling = true;
}

//Helper class for picking car parts
class PickHelper {
    raycaster: THREE.Raycaster;
    pickedDivision: string|null;
    pickedDivisionMaterial: {[key: string]: any};
    static partMapDivision:{[key: string]: string} = { //Maps the part's name property to each divisions
        "accumulator_<1>":"power",
        "aerodynamics_<1>":"aero",
        "chassis_<1>":"chassis",
        "electronics_<1>":"elec",
        "FL_suspension_<1>":"sus",
        "FR_suspension_<1>":"sus",
        "RL_suspension_<1>":"sus",
        "RR_suspension_<1>":"sus",
        "steering_<1>":"input",
        "pedal_box_<1>":"input",
        "powertrain_<1>":"power",
        "sim_<1>":""
    };
    static divisionMapPart:{[key: string]: string[]} = { //Maps each division to an array of parts name
        "power":["accumulator_<1>","powertrain_<1>"],
        "aero":["aerodynamics_<1>"],
        "chassis":["chassis_<1>"],
        "elec":["electronics_<1>"],
        "sus":["FL_suspension_<1>","FR_suspension_<1>","RL_suspension_<1>","RR_suspension_<1>"],
        "input":["steering_<1>","pedal_box_<1>"],
        "sim":[""],
    };

    constructor() {
      this.raycaster = new THREE.Raycaster();
      this.pickedDivision = null;
      this.pickedDivisionMaterial = {};
    }

    //Makes the car parts that belongs to the division selected by the cursor emissive in red. Returns the name of the division being chosen.
    pick(normalizedPosition: {x: number,y: number}, scene: THREE.Scene, camera: THREE.Camera): void{
        if(this.pickedDivision != null){ //Removes the emissive color of the car parts in the previously selected division
            this.restoreDivisionMaterial();
            this.pickedDivision = null;
            this.pickedDivisionMaterial = {} as {[key: string]: THREE.Material};
        }
        this.raycaster.setFromCamera(normalizedPosition, camera);
        const intersectedObjects = this.raycaster.intersectObjects(scene.children);
        if (intersectedObjects.length){ //If there is any intersection with any object
            this.pickedDivision = PickHelper.partMapDivision[PickHelper.getCarPart(intersectedObjects[0].object).name]; //Get the division name of the first object intersected
            this.paintDivisionEmissive(0x006600);
        }
    }

    //Get the reference to the car part that contains the component from the argument
    static getCarPart(component: THREE.Object3D): THREE.Object3D{
        while(component.parent!.name != "HKUR01"){
            component = component.parent!;
        }
        return component;
    }

    //Paint all the car part belong to the picked division to the emissive color of the argument
    paintDivisionEmissive(emissiveColor: number): void{
        PickHelper.divisionMapPart[this.pickedDivision!].forEach((element:string) => {
            this.changeEmissiveOfCarPart(scene.getObjectByName(element)!, emissiveColor);
        });
    }

    //Set all the descendent mesh of the car part to have emissive material, in which the emissive color is specified in the argument. Recursive.
    changeEmissiveOfCarPart(carPart: THREE.Object3D, emissiveColor: number): void{
        carPart.children.forEach((element: any) => {
            if(element.isMesh){
                this.pickedDivisionMaterial[element.name] = element.material;//save the material for restoration later
                element.material = element.material.clone(); //Since multiple mesh can reference to the same material, clone another one to avoid changing the wrong material
                element.material.emissive.setHex(emissiveColor);
            }
            else{
                this.changeEmissiveOfCarPart(element, emissiveColor);
            }
        });
    }

    //Restore all the car part belong to the picked division to the original material
    restoreDivisionMaterial(): void{
        PickHelper.divisionMapPart[this.pickedDivision!].forEach((element:string) => {
            this.restoreCarPartMaterial(scene.getObjectByName(element)!);
        });
    }

    //Restore all the descendent mesh of the car part to the original material. Recursive.
    restoreCarPartMaterial(carPart: THREE.Object3D): void{
        carPart.children.forEach((element: any) => {
            if(element.isMesh){
                element.material = this.pickedDivisionMaterial[element.name];
            }
            else{
                this.restoreCarPartMaterial(element);
            }
        });
    }

  }
const pickHelper = new PickHelper();

//Cursor position
const pickPosition = {x: 0, y: 0};
clearPickPosition();

//Relative position of the cursor to the canvas
function getCanvasRelativePosition(event: MouseEvent): {x:number,y:number}|null{
    let rect: DOMRect;
    if(introCarCanvas.inViewport()){
        rect = introCarCanvas.canvas.getBoundingClientRect();
    }
    else if(divisionCarCanvas.inViewport()){
        rect = divisionCarCanvas.canvas.getBoundingClientRect();
    }
    else return null; //error
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

function setPickPosition(event: MouseEvent) {
    let pos = getCanvasRelativePosition(event);
    pickPosition.x = (pos.x / CarCanvas.getWidth()) *  2 - 1;
    pickPosition.y = (pos.y / CarCanvas.getHeight()) * -2 + 1;  // note we flip Y
    if(!scrolling){
        requestAnimationFrame(animate);
    }
}
 
function clearPickPosition() {
    //Set it to invalid positions
    pickPosition.x = -100000;
    pickPosition.y = -100000;
}

//Change the division description based on what car part is clicked
function changeDivisionBasedOnClick(): void{
    if(pickHelper.pickedDivision != null){
        console.log("Picked "+pickHelper.pickedDivision);
        divisionDescriptionChange(pickHelper.pickedDivision);
    }
}

//Car model reaction to mouse actions
introCarCanvas.canvas.addEventListener('mousemove', setPickPosition);
introCarCanvas.canvas.addEventListener('mouseout', clearPickPosition);
introCarCanvas.canvas.addEventListener('mouseleave', clearPickPosition);
introCarCanvas.canvas.addEventListener('click', changeDivisionBasedOnClick);
divisionCarCanvas.canvas.addEventListener('mousemove', setPickPosition);
divisionCarCanvas.canvas.addEventListener('mouseout', clearPickPosition);
divisionCarCanvas.canvas.addEventListener('mouseleave', clearPickPosition);
divisionCarCanvas.canvas.addEventListener('click', changeDivisionBasedOnClick);

//Changes camera position according to where the page is scrolled and renders, also renders the clicking effects on the car
function animate(){
    let changeFactor = 1 - introCanvas.canvas.getBoundingClientRect().bottom/window.innerHeight; //How much offset for the camera
    if(changeFactor > 1) changeFactor = 1;
    let pos: number[];
    if(window.innerWidth > 768) //Responsive design
        pos = [-2 + changeFactor*2, 2 , 2 - changeFactor*0.25];
    else
        pos = [-2 + changeFactor*2, 2 + changeFactor * 1, 2 - changeFactor*0.25]
    camera.position.set(pos[0],pos[1],pos[2]);
    camera.lookAt( 0, 0, 0 );

    pickHelper.pick(pickPosition, scene, camera);
    renderer.render(scene,camera);

    if( Date.now() - lastScrolling! < 100){ //100 ms yet since the last scrolling event?
        requestAnimationFrame(animate); //not yet. stay in the loop
    }
    else{ //already stopped for 100ms. stopping the animation loop.
        scrolling = false;
        lastScrolling = null;
    }
}
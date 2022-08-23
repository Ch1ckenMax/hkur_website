export let divisionDescription: { [key:string]: string[]} = {
    "chassis" : ["Chassis","Chassis Division’s task is to develop the main frame for the vehicle, you can say the frame is the bracket holding together every component. The current design has chosen to use a spaceframe design. In the future we are actively looking into developing a full carbon fiber monocoque chassis."],
    "sus" : ["Suspension","Suspension Division is responsible for developing a system to maintain tire contact with the ground. The suspension also serve as the device to tune a vehicle’s handling characteristics. Extremely important to inspire driver’s confident."],
    "aero" : ["Aero & Bodywork","The Aero Division not only makes our car looks cool, they also make it fast! Developing the whole bodywork it makes our car slippery in the air and generate down force to help us corner faster."],
    "power" : ["Powertrain","These guys design the powerhouse  of the vehicle, propelling us to our destination. Their importance is self-explanatory."],
    "input" : ["Driving Input","This Division develops the braking system, and steering system for our car. They are responsible to make sure these vital functions of the car works in harmony with other important assembly."],
    "elec" : ["Electrical","A car without electrical system is like a primitive human being. The electrical division monitor and controls the complex systems on-board the vehicle."],
    "sim" : ["Sim-Racing","Go fast brrrr"]
};

//onclick event for each division buttons
export async function divisionDescriptionChange(divId: string): Promise<void>{
    //Text change
    let leftText = document.getElementById("division-name")!;
    let rightText = document.getElementById("division-description")!;

    //Transition change
    leftText.classList.remove('animate__fadeIn','animate__fadeInLeft');
    rightText.classList.remove('animate__fadeIn','animate__fadeInRight');
    leftText.classList.add('animate__fadeOut');
    rightText.classList.add('animate__fadeOut');
    await new Promise((resolve) => {setTimeout(()=>{resolve("resolved")},500)});//delay between fade in and out

    leftText.innerHTML = divisionDescription[divId][0] as string;
    rightText.innerHTML = divisionDescription[divId][1] as string;
    leftText.classList.remove('animate__fadeOut');
    rightText.classList.remove('animate__fadeOut');
    leftText.classList.add('animate__fadeIn');
    rightText.classList.add('animate__fadeIn');
}

//add event listeners
let divisionButtons = document.getElementById('division-buttons').children!;
for(let i = 0; i < divisionButtons.length; i++){
  divisionButtons[i].addEventListener("click",()=>{divisionDescriptionChange(divisionButtons[i].id)});
}

export let divisionDescription: {[key:string]: string[]} = require("../data/division_description.json"); //Load data

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

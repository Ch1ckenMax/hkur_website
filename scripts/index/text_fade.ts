import {IntersectionObservationHelper} from '../src/intersection_observation';
import {divisionDescription} from './division_descriptions';

//text fade in and fade out for the introduction
let introLeft = document.getElementById('introleft')!.classList;
let introRight = document.getElementById('introright')!.classList;
let introductionTextFade = new IntersectionObservationHelper('.introduction_target',0.05);
let introductionTextFadeObserver = introductionTextFade.generateObservation((entry: any) =>{
    introLeft.remove('animate__fadeInLeft');
    introRight.remove('animate__fadeInRight');
    introLeft.add('animate__fadeOutLeft');
    introRight.add('animate__fadeOutRight');
}, (entry: any) => {
    introLeft.remove('animate__fadeOutLeft');
    introRight.remove('animate__fadeOutRight');
    introLeft.add('animate__fadeInLeft');
    introRight.add('animate__fadeInRight');
}
)

//text fade in transitions from the left
let transitionLeft = new IntersectionObservationHelper('.transition_left', 0.1);
let transitionleftObserver = transitionLeft.generateObservation((entry:any) => {
        entry.target.childNodes[1].classList.remove('invisible','animate__fadeOutLeft'); //animation makes the element moves around so need to wrap it inside another div to make the intersection observation consistent
        entry.target.childNodes[1].classList.add('animate__fadeInLeft');
}, (entry:any) => {
        entry.target.childNodes[1].classList.remove('animate__fadeInLeft');
        entry.target.childNodes[1].classList.add('animate__fadeOutLeft');
    }
);

//text fade in transitions from the right
let transitionRightIn = new IntersectionObservationHelper('.transition_right', 0.1);
let transitionRightInObserver = transitionRightIn.generateObservation((entry:any) => {
        entry.target.childNodes[1].classList.remove('invisible','animate__fadeOutRight');
        entry.target.childNodes[1].classList.add('animate__fadeInRight');
}, (entry:any) => {
        entry.target.childNodes[1].classList.remove('animate__fadeInRight');
        entry.target.childNodes[1].classList.add('animate__fadeOutRight');
    }
);

//default text for division descriptions
let divDescription = new IntersectionObservationHelper('#division-description',0.1);
let divDescriptionObserver = divDescription.generateObservation((entry:any) => {
    document.getElementById("division-name")!.innerHTML = divisionDescription["default"][0];
    document.getElementById("division-description")!.innerHTML = divisionDescription["default"][1];
}, (entry:any) => {

}
);
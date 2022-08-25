import {IntersectionObservationHelper} from '../src/intersection_observation';

//nav bar opacity upon scrolling
let navBar = document.getElementsByTagName('nav')[0];
let navOpacity = new IntersectionObservationHelper('.nav_target',0.1);
let navOpacityObserver = navOpacity.generateObservation((entry:any) => {
    navBar.style.background = "rgba(0,0,0,0.9)";
    navBar.style.opacity = '1';
}, (entry:any) => {
    navBar.style.background = "rgba(0,0,0,0)";
    navBar.style.opacity = '0.4';
});
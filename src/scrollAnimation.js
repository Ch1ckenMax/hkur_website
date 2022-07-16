//Scripts for animation on scrolling. Uses intersection observer API.

class IntersectionObservation{
    //Parm observerdClass specifies the target being listened for intersection
    constructor(observedClass, intersectionThreshold){
        this.observedClass = observedClass;
        this.intersectionThreshold = intersectionThreshold;
    }

    //Generates an intersectionObservation
    //Param actionUponEnter, actioUponExit should be a callBack function that accepts 1 parameter. Specifies the actions being done on each entry when action intesects/leaves the viewport respectively
    generateObservation(actionUponEnter, actionUponExit){
        let options = {
            root: null, //Viewport
            rootMargin: '0px', 
            threshold: this.intersectionThreshold
        }

        function observerCallBack(entries, observer){
            for(let i = 0; i < entries.length; i++){
                if(entries[i].isIntersecting){
                    actionUponEnter(entries[i]);
                }
                else{
                    actionUponExit(entries[i]);
                }
            }
        }

        let observed = document.querySelectorAll(this.observedClass);

        let observer = new IntersectionObserver(observerCallBack, options);
        for(let i = 0; i < observed.length; i++){
            observer.observe(observed[i]);
        }

        return observer;
    }
}

//nav bar opacity upon scrolling
let navBar = document.getElementsByTagName('nav')[0];
let navOpacity = new IntersectionObservation('.nav_target',0.1);
let navOpacityObserver = navOpacity.generateObservation((entry) => {
    navBar.style.background = "rgba(0,0,0,0.9)";
    navBar.style.opacity = 1;
}, (entry) => {
    navBar.style.background = "rgba(0,0,0,0)";
    navBar.style.opacity = 0.4;
});

//text fade in and fade out for the introduction
let introLeft = document.getElementById('introleft').classList;
let introRight = document.getElementById('introright').classList;
let introductionTextFade = new IntersectionObservation('.introduction_target',0.1);
let introductionTextFadeObserver = introductionTextFade.generateObservation((entry) =>{
    introLeft.remove('animate__fadeInLeft');
    introRight.remove('animate__fadeInRight');
    introLeft.add('animate__fadeOutLeft');
    introRight.add('animate__fadeOutRight');
}, (entry) => {
    introLeft.remove('animate__fadeOutLeft');
    introRight.remove('animate__fadeOutRight');
    introLeft.add('animate__fadeInLeft');
    introRight.add('animate__fadeInRight');
}
)

//text fade in transitions from the left
let transitionLeftIn = new IntersectionObservation('.transition_in_left', 0.1);
let transitionleftInObserver = transitionLeftIn.generateObservation((entry) => {
        entry.target.childNodes[1].classList.remove('invisible','animate__fadeOutLeft'); //animation makes the element moves around so need to wrap it inside another div to make the intersection observation consistent
        entry.target.childNodes[1].classList.add('animate__fadeInLeft');}, 
    (entry) => {
    }
);

//text fade out transitions from the left
let transitionLeftOut = new IntersectionObservation('.transition_out_left', 0.3);
let transitionleftOutObserver = transitionLeftOut.generateObservation((entry) => {},
    (entry) => {
        entry.target.childNodes[1].classList.remove('animate__fadeInLeft');
        entry.target.childNodes[1].classList.add('animate__fadeOutLeft');
    }
);

//text fade in transitions from the right
let transitionRightIn = new IntersectionObservation('.transition_in_right', 0.1);
let transitionRightInObserver = transitionRightIn.generateObservation((entry) => {
        entry.target.childNodes[1].classList.remove('invisible','animate__fadeOutRight');
        entry.target.childNodes[1].classList.add('animate__fadeInRight');}, 
    (entry) => {}
);
//Scripts for animation on scrolling. Uses intersection observer API.

export class IntersectionObservation{
    //observerdClass specifies the target being listened for intersection
    observedClass: string;
    intersectionThreshold: number;
    
    constructor(observedClass: string, intersectionThreshold: number){
        this.observedClass = observedClass;
        this.intersectionThreshold = intersectionThreshold;
    }

    //Generates an intersectionObservation
    //Param actionUponEnter, actioUponExit should be a callBack function that accepts 1 parameter. Specifies the actions being done on each entry when action intesects/leaves the viewport respectively
    generateObservation(actionUponEnter: Function, actionUponExit: Function): IntersectionObserver{
        let options = {
            root: null as any, //Viewport
            rootMargin: '0px', 
            threshold: this.intersectionThreshold
        }

        function observerCallBack(entries: any, observer: any){
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
let navOpacityObserver = navOpacity.generateObservation((entry:any) => {
    navBar.style.background = "rgba(0,0,0,0.9)";
    navBar.style.opacity = '1';
}, (entry:any) => {
    navBar.style.background = "rgba(0,0,0,0)";
    navBar.style.opacity = '0.4';
});

//text fade in and fade out for the introduction
let introLeft = document.getElementById('introleft')!.classList;
let introRight = document.getElementById('introright')!.classList;
let introductionTextFade = new IntersectionObservation('.introduction_target',0.05);
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
let transitionLeft = new IntersectionObservation('.transition_left', 0.1);
let transitionleftObserver = transitionLeft.generateObservation((entry:any) => {
        entry.target.childNodes[1].classList.remove('invisible','animate__fadeOutLeft'); //animation makes the element moves around so need to wrap it inside another div to make the intersection observation consistent
        entry.target.childNodes[1].classList.add('animate__fadeInLeft');
}, (entry:any) => {
        entry.target.childNodes[1].classList.remove('animate__fadeInLeft');
        entry.target.childNodes[1].classList.add('animate__fadeOutLeft');
    }
);

//text fade in transitions from the right
let transitionRightIn = new IntersectionObservation('.transition_right', 0.1);
let transitionRightInObserver = transitionRightIn.generateObservation((entry:any) => {
        entry.target.childNodes[1].classList.remove('invisible','animate__fadeOutRight');
        entry.target.childNodes[1].classList.add('animate__fadeInRight');
}, (entry:any) => {
        entry.target.childNodes[1].classList.remove('animate__fadeInRight');
        entry.target.childNodes[1].classList.add('animate__fadeOutRight');
    }
);

//default text for division descriptions
let divDescription = new IntersectionObservation('#division-description',0.1);
let divDescriptionObserver = divDescription.generateObservation((entry:any) => {
    document.getElementById("division-name")!.innerHTML = "Check out our HKUR-01 race car" as string;
    document.getElementById("division-description")!.innerHTML = "Click the car components to see the introduction of our each divisions." as string;
}, (entry:any) => {

}
);

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
                if(entries[i].isIntersecting)
                    actionUponEnter(entries[i]);
                else
                    actionUponExit(entries[i]);
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


//text fade transitions from the left
let transitionLeft = new IntersectionObservation('.transition_left', 0.25);
let transitionleftObserver = transitionLeft.generateObservation((entry) => {
    entry.target.classList.remove('invisible');
    entry.target.classList.add('animate__animated','animate__fadeInLeft');}, 
    (entry) => {}
);

//text fade transitions from the right
let transitionRight = new IntersectionObservation('.transition_right', 0.25);
let transitionRightObserver = transitionRight.generateObservation((entry) => {
    entry.target.classList.remove('invisible');
    entry.target.classList.add('animate__animated','animate__fadeInRight');}, 
    (entry) => {}
);
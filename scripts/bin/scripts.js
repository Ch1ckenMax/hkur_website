var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
let divisionDescription = {
    "default": ["haha", "Click the car components to see the introduction of our each divisions."],
    "chassis": ["Chassis", "Chassis Division’s task is to develop the main frame for the vehicle, you can say the frame is the bracket holding together every component. The current design has chosen to use a spaceframe design. In the future we are actively looking into developing a full carbon fiber monocoque chassis."],
    "sus": ["Suspension", "Suspension Division is responsible for developing a system to maintain tire contact with the ground. The suspension also serve as the device to tune a vehicle’s handling characteristics. Extremely important to inspire driver’s confident."],
    "aero": ["Aero & Bodywork", "The Aero Division not only makes our car looks cool, they also make it fast ! Developing the whole bodywork it makes our car slippery in the air and generate down force to help us corner faster."],
    "power": ["Powertrain", "These guys design the powerhouse  of the vehicle, propelling us to our destination. Their importance is self-explanatory."],
    "input": ["Driving Input", "This Division develops the braking system, and steering system for our car. They are responsible to make sure these vital functions of the car works in harmony with other important assembly."],
    "elec": ["Electrical", "A car without electrical system is like a primitive human being. The electrical division monitor and controls the complex systems on-board the vehicle."],
    "sim": ["Sim-Racing", "Go fast brrrr"]
};
var _IntersectionObservation_observedClass, _IntersectionObservation_intersectionThreshold;
class IntersectionObservation {
    constructor(observedClass, intersectionThreshold) {
        _IntersectionObservation_observedClass.set(this, void 0);
        _IntersectionObservation_intersectionThreshold.set(this, void 0);
        __classPrivateFieldSet(this, _IntersectionObservation_observedClass, observedClass, "f");
        __classPrivateFieldSet(this, _IntersectionObservation_intersectionThreshold, intersectionThreshold, "f");
    }
    generateObservation(actionUponEnter, actionUponExit) {
        let options = {
            root: null,
            rootMargin: '0px',
            threshold: __classPrivateFieldGet(this, _IntersectionObservation_intersectionThreshold, "f")
        };
        function observerCallBack(entries, observer) {
            for (let i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    actionUponEnter(entries[i]);
                }
                else {
                    actionUponExit(entries[i]);
                }
            }
        }
        let observed = document.querySelectorAll(__classPrivateFieldGet(this, _IntersectionObservation_observedClass, "f"));
        let observer = new IntersectionObserver(observerCallBack, options);
        for (let i = 0; i < observed.length; i++) {
            observer.observe(observed[i]);
        }
        return observer;
    }
}
_IntersectionObservation_observedClass = new WeakMap(), _IntersectionObservation_intersectionThreshold = new WeakMap();
let navBar = document.getElementsByTagName('nav')[0];
let navOpacity = new IntersectionObservation('.nav_target', 0.1);
let navOpacityObserver = navOpacity.generateObservation((entry) => {
    navBar.style.background = "rgba(0,0,0,0.9)";
    navBar.style.opacity = '1';
}, (entry) => {
    navBar.style.background = "rgba(0,0,0,0)";
    navBar.style.opacity = '0.4';
});
let introLeft = document.getElementById('introleft').classList;
let introRight = document.getElementById('introright').classList;
let introductionTextFade = new IntersectionObservation('.introduction_target', 0.1);
let introductionTextFadeObserver = introductionTextFade.generateObservation((entry) => {
    introLeft.remove('animate__fadeInLeft');
    introRight.remove('animate__fadeInRight');
    introLeft.add('animate__fadeOutLeft');
    introRight.add('animate__fadeOutRight');
}, (entry) => {
    introLeft.remove('animate__fadeOutLeft');
    introRight.remove('animate__fadeOutRight');
    introLeft.add('animate__fadeInLeft');
    introRight.add('animate__fadeInRight');
});
let transitionLeft = new IntersectionObservation('.transition_left', 0.1);
let transitionleftObserver = transitionLeft.generateObservation((entry) => {
    entry.target.childNodes[1].classList.remove('invisible', 'animate__fadeOutLeft');
    entry.target.childNodes[1].classList.add('animate__fadeInLeft');
}, (entry) => {
    entry.target.childNodes[1].classList.remove('animate__fadeInLeft');
    entry.target.childNodes[1].classList.add('animate__fadeOutLeft');
});
let transitionRightIn = new IntersectionObservation('.transition_right', 0.1);
let transitionRightInObserver = transitionRightIn.generateObservation((entry) => {
    entry.target.childNodes[1].classList.remove('invisible', 'animate__fadeOutRight');
    entry.target.childNodes[1].classList.add('animate__fadeInRight');
}, (entry) => {
    entry.target.childNodes[1].classList.remove('animate__fadeInRight');
    entry.target.childNodes[1].classList.add('animate__fadeOutRight');
});
let divDescription = new IntersectionObservation('#division-description', 0.1);
let divDescriptionObserver = divDescription.generateObservation((entry) => {
    document.getElementById("division-name").innerHTML = divisionDescription['default'][0];
    document.getElementById("division-description").innerHTML = divisionDescription['default'][1];
}, (entry) => {
});

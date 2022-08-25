//helper class for using the intersection observer API.
export class IntersectionObservationHelper{
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

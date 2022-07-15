//Very messed up unfinished stuff below. Intersecting Observer for text transition upon scrolling down
let options = {
    root: null,
    rootMargin: '0px',
    threshold: 0
}

let observed = document.querySelector('.transition_left');

function observerCallBack(entries, observer){
    for(let i = 0; i < entries.length; i++){
        if(entries[i].isIntersecting){
            console.log(entries[i].target);
            entries[i].target.classList.remove('invisible');
            entries[i].target.classList.add('animate__animated','animate__fadeInLeft');
            
        }
    }
}

let observer = new IntersectionObserver(observerCallBack, options);
observer.observe(observed);

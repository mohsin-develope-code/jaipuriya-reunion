

(function(){
    const track = document.getElementById('track-pro');
    const stage = document.getElementById('stage-pro');
    const prevBtn = document.getElementById('prev-pro');
    const nextBtn = document.getElementById('next-pro');

    const originalHTML = Array.from(track.children).map(el => el.outerHTML);
    const slideCount = originalHTML.length;

    let visibleCount = getVisibleCount();
    let slides = [];
    let positionIndex = 0;
    const transitionMs = 450;
    let isTransitioning = false;
    let cardWidth = 0;
    let gap = 0;
    let autoSlide = null;

    function getVisibleCount(){
        if(window.matchMedia('(max-width:520px)').matches) return 1;
        if(window.matchMedia('(max-width:900px)').matches) return 2;
        return 3;
    }

    function build(){
        track.style.transition = 'none';
        track.innerHTML = '';

        visibleCount = getVisibleCount();

        const originals = originalHTML.map(html => {
            const tmp = document.createElement('div');
            tmp.innerHTML = html;
            return tmp.firstElementChild;
        });

        const frontClones = [];
        const endClones = [];
        for(let i=0;i<visibleCount;i++){
            const idxFront = (slideCount - visibleCount + i) % slideCount;
            const cloneFront = originals[idxFront].cloneNode(true);
            cloneFront.classList.add('clone');
            frontClones.push(cloneFront);

            const cloneEnd = originals[i % slideCount].cloneNode(true);
            cloneEnd.classList.add('clone');
            endClones.push(cloneEnd);
        }

        frontClones.forEach(n => track.appendChild(n));
        originals.forEach(n => track.appendChild(n));
        endClones.forEach(n => track.appendChild(n));

        slides = Array.from(track.children);

        positionIndex = visibleCount;
        computeCardDimensions();
        updateTrack(false);

        requestAnimationFrame(()=> { 
            track.style.transition = `transform ${transitionMs}ms cubic-bezier(.25,.8,.25,1)`; 
        });

        track.removeEventListener('transitionend', onTransitionEnd);
        track.addEventListener('transitionend', onTransitionEnd);
    }

    function computeCardDimensions(){
        // Get the actual card element
        const card = track.querySelector('.production-carousel-card');
        
        if(card){
            // Get the computed width of the card
            const rect = card.getBoundingClientRect();
            cardWidth = rect.width;
            
            // Get the gap from track's computed style
            const trackStyle = getComputedStyle(track);
            gap = parseFloat(trackStyle.gap) || 30; // Default to 30px if not found
        } else {
            // Fallback values
            cardWidth = 0;
            gap = 30;
        }
    }

    function updateTrack(animate = true){
        if(!animate) {
            track.style.transition = 'none';
        } else {
            track.style.transition = `transform ${transitionMs}ms cubic-bezier(.25,.8,.25,1)`;
        }

        // Calculate translation: move by full card width + gap for each position
        const translateX = positionIndex * (cardWidth + gap);
        track.style.transform = `translateX(-${translateX}px)`;

        if(!animate){
            requestAnimationFrame(()=> { 
                track.style.transition = `transform ${transitionMs}ms cubic-bezier(.25,.8,.25,1)`; 
            });
        }
    }

    function onTransitionEnd(){
        isTransitioning = false;

        // Jump to real slides when reaching clones
        if(positionIndex >= visibleCount + slideCount){
            positionIndex -= slideCount;
            updateTrack(false);
        }
        if(positionIndex < visibleCount){
            positionIndex += slideCount;
            updateTrack(false);
        }
    }

    function next(){
        if(isTransitioning) return;
        isTransitioning = true;
        positionIndex++;
        updateTrack(true);
    }
    
    function prev(){
        if(isTransitioning) return;
        isTransitioning = true;
        positionIndex--;
        updateTrack(true);
    }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    document.addEventListener('keydown', (e)=>{
        if(e.key === 'ArrowRight') next();
        if(e.key === 'ArrowLeft') prev();
    });

    let resizeTimer = null;
    let lastVisible = visibleCount;
    window.addEventListener('resize', ()=>{
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(()=>{
            const nowVisible = getVisibleCount();
            if(nowVisible !== lastVisible){
                lastVisible = nowVisible;
                build();
            } else {
                slides = Array.from(track.children);
                computeCardDimensions();
                updateTrack(false);
            }
        }, 120);
    });

    function startAuto(){
        if(autoSlide) clearInterval(autoSlide);
        autoSlide = setInterval(()=> next(), 2000);
    }
    
    function stopAuto(){
        if(autoSlide) { 
            clearInterval(autoSlide); 
            autoSlide = null; 
        }
    }

    stage.addEventListener('mouseenter', stopAuto);
    stage.addEventListener('mouseleave', startAuto);

    // Initial build with slight delay to ensure DOM is ready
    setTimeout(()=> {
        build();
        startAuto();
    }, 2000);
})();
const spinnerwrapperel = document.querySelector('.spinner-wrapper');

window.addEventListener('load',()=> {
    
    spinnerwrapperel.style.opacity = '0';
    setTimeout(() => {
        spinnerwrapperel.style.display = 'none';
    }, 300);

});

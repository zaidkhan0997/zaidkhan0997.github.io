const spinnerwrapperel = document.querySelector('.spinner-wrapper');

window.addEventListener('load',()=> {
setTimeout(() => {
    spinnerwrapperel.style.opacity = '0';
    setTimeout(() => {
        spinnerwrapperel.style.display = 'none';
    }, 300);
}, 1200);

});

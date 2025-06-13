const modal = document.getElementById("modal");
const closeButton = document.querySelector(".modal__content-bouton-close ");
const waitingImage = document.querySelector(".modal__content-figure-img");
let direction;
let currentImages = [];

export function openModal(imagesFromGallery){
    currentImages = imagesFromGallery;
    for(let i=0;i<imagesFromGallery.length;i++){
        imagesFromGallery[i].addEventListener("click", () =>{
            modal.showModal();
            closeButton.focus();
            showImage(imagesFromGallery[i]);
        });
        imagesFromGallery[i].addEventListener("keydown", (e) =>{
            if(e.key === 'Enter' || e.key === ' '){
                e.preventDefault();
                modal.showModal();
                closeButton.focus();
                showImage(imagesFromGallery[i]);  
            }; 
        });
    };
};
const navButton = document.querySelectorAll(".modal__bouton-slide button");

for (let b = 0; b < navButton.length; b++) {
    navButton[b].addEventListener("click", () => {
        if (navButton[b].dataset.id === "1") {
            direction = "gauche";
            navImage(direction, currentImages);
        } else {
            direction = "droite";
            navImage(direction, currentImages);
        }
    });
}

function showImage(captureImage) {
    document.body.style.overflow = "hidden";
    waitingImage.src = captureImage.src;
    waitingImage.alt = captureImage.alt;
    resizeModal(waitingImage);
}

function navImage(direction,imagesFromGallery){
    let nextIndex;
    let currentIndex = Array.from(imagesFromGallery).findIndex(img => img.src === waitingImage.src)
    if(direction === "gauche"){
        nextIndex = (currentIndex - 1 + imagesFromGallery.length) % imagesFromGallery.length;       
    }else if(direction === "droite"){
        nextIndex = (currentIndex + 1) % imagesFromGallery.length;
    };
    waitingImage.src = imagesFromGallery[nextIndex].src;
    waitingImage.alt = imagesFromGallery[nextIndex].alt
    resizeModal(waitingImage);
    
};

function resizeModal(waitingImage){
    const x  = waitingImage.naturalWidth;
    const y  = waitingImage.naturalHeight;
    if(x>y){
        modal.classList.remove("portrait");
    }else{
        modal.classList.add("portrait");
    }
}

function closeModal(){
    closeButton.addEventListener("click",()=>{
        modal.close();
        document.body.style.overflow="";
    });
    modal.addEventListener("dblclick",(e)=>{
        if (e.target === modal) {
            modal.close();
            document.body.style.overflow="";
        };
    });
};

closeModal();
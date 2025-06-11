const modal = document.getElementById("modal");
const closeButtonIcone = document.querySelector(".modal__content-bouton-close i");
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
            showImage(imagesFromGallery[i],imagesFromGallery);
        });
        imagesFromGallery[i].addEventListener("keydown", (e) =>{
            if(e.key === 'Enter' || e.key === ' '){
                e.preventDefault();
                modal.showModal();
                closeButton.focus();
                showImage(imagesFromGallery[i],imagesFromGallery);  
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
};

function closeModal(){
    closeButtonIcone.addEventListener("mouseenter",(e)=>{
        e.target.classList.remove("fa-regular");
        e.target.classList.add("fa-solid");
    });
    closeButtonIcone.addEventListener("mouseleave",(e)=>{
        e.target.classList.remove("fa-solid");
        e.target.classList.add("fa-regular");
    });
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
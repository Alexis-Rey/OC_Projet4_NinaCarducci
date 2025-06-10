const modal = document.getElementById("modal");
const imagesGallery = document.querySelectorAll(".gallery__image");
function openModal(){
    for(let i=0;i<imagesGallery.length;i++){
        imagesGallery[i].addEventListener("click", () =>{
            modal.showModal();
            showImage(imagesGallery[i]);
        });
    };
};
function showImage(captureImage){
const waitingImage = document.querySelector(".modal__content-figure-img");
waitingImage.src = captureImage.src;
waitingImage.alt = captureImage.alt;
}

openModal();
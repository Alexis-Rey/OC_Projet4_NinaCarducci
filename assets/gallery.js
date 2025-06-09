const container = document.querySelector(".gallery__grid");
const galleryImages = document.querySelectorAll(".gallery__image");
const images = Array.from(galleryImages);
const galleryBoutons = document.querySelectorAll(".gallery__menu-options");

for(let i=0; i<galleryBoutons.length;i++){
    galleryBoutons[i].addEventListener("click", () => {
        for( let b=0; b<galleryBoutons.length; b++){
            galleryBoutons[b].classList.remove("gallery__menu-options--actived"); 
            galleryBoutons[b].setAttribute("aria-current","false")
        };
        galleryBoutons[i].setAttribute("aria-current","true");
        galleryBoutons[i].classList.add("gallery__menu-options--actived");
        
        let categories = galleryBoutons[i].dataset.menuTag;
        filtreImages(categories);
    });
};

function filtreImages(categoriesBouton){
    container.innerHTML="";
    const imagesFiltered = images.filter(function(image){
           return image.dataset.galleryTag === categoriesBouton;
        });
    if(categoriesBouton === "Tous"){
        for( let i=0; i<images.length;i++){
            container.appendChild(images[i]);
        };
    }else{
        for( let i=0; i<imagesFiltered.length;i++){
            container.appendChild(imagesFiltered[i]);
        };
    }; 
};


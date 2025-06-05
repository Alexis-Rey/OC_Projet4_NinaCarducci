const gallery = document.querySelector(".carousel__gallery");
const imagesCarousel = document.querySelectorAll(".carousel__image");
const boutonsMenu = document.querySelectorAll(".carousel__bouton");
const boutonPrev = document.querySelector(".carousel__prev");
const boutonNext = document.querySelector(".carousel__next");

let currentIndex = 0;
let interval = setInterval(nextImage,3000);

function updateCarousel(index){
    for ( let i = 0; i<imagesCarousel.length; i++){
        imagesCarousel[i].setAttribute("aria-hidden", i !== index);
        imagesCarousel[i].setAttribute("aria-current", i === index);
        gallery.style.transform = "translateX(-" + (index * 100) + "%)";
    }
    for ( let j = 0; j<boutonsMenu.length; j++){
        boutonsMenu[j].classList.remove("carousel__bouton--actived");
        boutonsMenu[j].setAttribute("aria-current", j === index);
        let nextBouton = boutonsMenu[j].getAttribute("aria-current");
        if (nextBouton === "true"){
          boutonsMenu[j].classList.add("carousel__bouton--actived"); 
        }
    }
    currentIndex = index;
};

function nextImage(){
    let nextIndex = (currentIndex + 1) % imagesCarousel.length;
    updateCarousel(nextIndex);
};

function prevImage(){
    let prevIndex = (currentIndex - 1 + imagesCarousel.length) % imagesCarousel.length;
    updateCarousel(prevIndex);
}

for(let b = 0; b<boutonsMenu.length; b++){
    boutonsMenu[b].addEventListener("click", () =>{
        clearInterval(interval);
        updateCarousel(b);
        interval = setInterval(nextImage,3000);
    });
};


boutonNext.addEventListener("click", () => {
  clearInterval(interval);
  nextImage();
  interval = setInterval(nextImage, 3000);
});

boutonPrev.addEventListener("click", () => {
  clearInterval(interval);
  prevImage();
  interval = setInterval(nextImage, 3000);
});
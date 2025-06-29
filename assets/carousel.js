const gallery = document.querySelector(".carousel__gallery");
const imagesCarouselRight = document.querySelectorAll(".carousel__image");
const boutonsMenu = document.querySelectorAll(".carousel__bouton");
const boutonPrev = document.querySelector(".carousel__prev");
const boutonNext = document.querySelector(".carousel__next");

let currentIndex = 0;
let autoModeRight = true;
let interval = setInterval(nextImage,5000);
let arrayCarouselRight = Array.from(imagesCarouselRight);


function majBoutonColor(index){
    for ( let j = 0; j<boutonsMenu.length; j++){
        imagesCarouselRight[j].setAttribute("aria-hidden", j !== index);
        imagesCarouselRight[j].setAttribute("aria-current", j === index);
        boutonsMenu[j].classList.remove("carousel__bouton--actived");
        boutonsMenu[j].setAttribute("aria-current", j === index);
        let nextBouton = boutonsMenu[j].getAttribute("aria-current");
        if (nextBouton === "true"){
          boutonsMenu[j].classList.add("carousel__bouton--actived"); 
        }
    }
}

function handleNextEnd() {
  for (let i = 0; i < imagesCarouselRight.length; i++) {
    arrayCarouselRight[i].style.order = (i - (currentIndex + 1) + arrayCarouselRight.length) % arrayCarouselRight.length;
  }
  gallery.style.transition = "none";
  gallery.style.transform = "translateX(0%)";
  currentIndex = (currentIndex + 1) % arrayCarouselRight.length;
}

function nextImage(){
    clearInterval(interval);
    let nextIndex = (currentIndex + 1) % arrayCarouselRight.length;
    majBoutonColor(nextIndex);
    gallery.style.transition = "transform 0.5s ease";
    gallery.style.transform = "translateX(-100%)";
    gallery.addEventListener("transitionend", handleNextEnd, { once: true });
    interval = setInterval(nextImage, 5000);
};

boutonNext.addEventListener("click", () => {
  nextImage();
});

boutonPrev.addEventListener("click", () => {
  prevImage();
});

function prevImage(){
    clearInterval(interval);
    let prevIndex = (currentIndex - 1 + arrayCarouselRight.length) % arrayCarouselRight.length;
    majBoutonColor(prevIndex);
    for (let i = 0; i < imagesCarouselRight.length; i++) {
        arrayCarouselRight[i].style.order = (i - (currentIndex - 1) + arrayCarouselRight.length) % arrayCarouselRight.length;
    }
    gallery.style.transition = "none";
    gallery.style.transform = "translateX(-100%)";

    void gallery.offsetWidth;

    gallery.style.transition = "transform 0.5s ease";
    gallery.style.transform = "translateX(0%)";
    gallery.addEventListener("transitionend", handlePrevEnd, { once: true });

    interval = setInterval(nextImage, 5000);
};

function handlePrevEnd() {
    currentIndex = (currentIndex - 1 + arrayCarouselRight.length) % arrayCarouselRight.length;
    gallery.style.transition = "none";
    gallery.style.transform = "translateX(0%)";
}

function goToImage(step,direction){
  if(step === 1){
    if(direction === "right"){
      setTimeout(nextImage,200);
    }else{
      setTimeout(prevImage,200);
    }
  }else{
    if(direction === "right"){
      setTimeout(prevImage,200);
    }else{
      setTimeout(nextImage,200);
    }
  }
};

for(let b= 0; b<boutonsMenu.length; b++){
  boutonsMenu[b].addEventListener("click", () =>{
    clearInterval(interval);
    let step;
    let direction;
    let targetIndex = b;
    majBoutonColor(targetIndex);
    if (targetIndex === currentIndex) return;
    if(targetIndex>currentIndex){
      step = targetIndex - currentIndex;
      direction = "right";
    }else{
      step = currentIndex - targetIndex;
      direction = "left";
    };
    goToImage(step,direction)
  });
};



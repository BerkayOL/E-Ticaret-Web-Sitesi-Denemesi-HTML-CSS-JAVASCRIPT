let slideIndex = 1;
slideShow(slideIndex);

function slideRoute(n) {
    slideShow(slideIndex += n);
}

function currentSlide(n) {
    slideShow(slideIndex = n);
}

function slideShow(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slides.length
    }
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display="none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";

    dots[slideIndex-1].className +=" active";
}
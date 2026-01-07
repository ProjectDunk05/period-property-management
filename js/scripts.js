// toggle function for hambuger menu display
function toggleMenu() {
    document.getElementById('nav-menu').classList.toggle('active');
  }

 // Image slider 
const slides = document.querySelectorAll(".slides img"); 
let slideIndex = 0;
let intervalId = null;

document.addEventListener("DOMContentLoaded", initializeSlider);

function initializeSlider(){

  if(slides.length > 0){
        slides[slideIndex].classList.add("displaySlide");
        intervalId = setInterval(nextSlide, 7500);
    }
}

function showSlide(index){
    if(index >= slides.length){
        slideIndex = 0;
    }
    else if(index < 0){
        slideIndex = slides.length - 1;
    }

    slides.forEach(slide => {
        slide.classList.remove("displaySlide");
    });
    slides[slideIndex].classList.add("displaySlide");
}

function prevSlide(){
    clearInterval(intervalId);
    slideIndex--;
    showSlide(slideIndex);
}

function nextSlide(){
    slideIndex++;
    showSlide(slideIndex);
}

// FAQs toggle answer display when question clicked on //

const questions = document.querySelectorAll(".question");
const modal = document.getElementById("modal");
const modalText = document.getElementById("modal-text");
const modalClose = document.getElementById("modal-close");

questions.forEach((question) => {
    question.addEventListener("click", () => {
        const answerDiv = question.nextElementSibling; // entire answer div
        modalText.innerHTML = answerDiv.innerHTML; // copy full content
        modal.style.display = "flex"; // show modal
    });
});

// Close modal on ×
modalClose.addEventListener("click", () => {
    modal.style.display = "none";
});

// Close modal when clicking outside modal content
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

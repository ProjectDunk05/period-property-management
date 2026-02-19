// toggle function for hambuger menu display
function toggleMenu() {
    document.getElementById('nav-menu').classList.toggle('active');
  }

// FAQs toggle answer display when question clicked on 

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
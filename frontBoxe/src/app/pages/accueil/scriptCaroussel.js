const buttons = document.querySelectorAll(".btn");
const slides = document.querySelectorAll(".slide");

// Tableau d'image : [0, 1, 2]

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const calcNextSlide = e.target.id === "next" ? 1 : -1;
    const slideActive = document.querySelector(".active");

    newIndex = calcNextSlide + [...slides].indexOf(slideActive);

    if (newIndex < 0) newIndex = [...slides].length - 1;
    if (newIndex >= [...slides].length) newIndex = 0;
    slides[newIndex].classList.add("active");

    slideActive.classList.remove("active");
  });
});

// addActive(slides[0]);
// setInterval(function () {
//   for (let i = 0; i < slides.length; i++) {
//     if (i + 1 == slides.length) {
//       addActive(slides[0]);
//       setTimeout(removeActive, 350, slides[i]);
//       break;
//     }
//     if (slides[i].classList.contains("active")) {
//       setTimeout(removeActive, 350, slides[i]);
//       addActive(slides[i + 1]);
//       break;
//     }
//   }
// }, 1500);

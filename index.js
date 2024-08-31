// To changes images on banner
const images = document.querySelectorAll('.banner img');
let currentIndex = 0;

function showNextImage() {
    images[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].classList.add('active');
}
setInterval(showNextImage, 2500);



/// To redirect to login page 

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loginIcon").onclick = function() {
        window.location.href = "login.html";
    };
});


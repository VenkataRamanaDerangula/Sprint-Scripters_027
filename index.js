
// To change banner images
document.addEventListener("DOMContentLoaded", function() {
    const images = document.querySelectorAll('.banner img');
    let currentIndex = 0;

    function showNextImage() {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    }

    // Initial setup to display the first image
    images[currentIndex].classList.add('active');

    // Set the interval for image rotation
    setInterval(showNextImage, 2500);



    // Redirect to login page
    document.getElementById("loginIcon").onclick = function() {
        window.location.href = "login.html";
    };
});

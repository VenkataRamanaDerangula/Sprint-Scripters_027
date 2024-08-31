
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




// Login-logout functionality

document.addEventListener('DOMContentLoaded', function () {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        const loginIcon = document.getElementById('loginIcon');
        const usernameDisplay = document.getElementById('usernameDisplay');
        const logoutButton = document.getElementById('logoutButton');

        // Hide the login icon
        if (loginIcon) loginIcon.style.display = 'none';

        // Display the username with styles
        if (usernameDisplay) {
            usernameDisplay.style.color = '#3498db';
            usernameDisplay.style.fontWeight = 'bold';
            usernameDisplay.textContent = `Hello, ${loggedInUser}!`;
        }

        // Show logout button
        if (logoutButton) {
            logoutButton.style.display = 'inline-block';
            logoutButton.addEventListener('click', function () {
                // Remove the user from localStorage
                localStorage.removeItem('loggedInUser');

                // Redirect to the login page
                window.location.href = 'index.html';
            });
        }
    } 
});

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav-links');

    hamburger.addEventListener('click', function () {
        mobileNav.classList.toggle('show');
    });
});
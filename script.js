
const apiKey = 'f5cb4dda51c69ceacbc189760535304a';
let apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`;
let currentPage = 1;
let isFetching = false;

document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
    window.addEventListener('scroll', handleScroll);
});

function fetchMovies() {
    if (isFetching) return;

    isFetching = true;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const movies = data.results;
            displayMovies(movies);
            currentPage++;
            apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=${currentPage}`;
            isFetching = false;
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
            isFetching = false;
        });
}

function displayMovies(movies) {
    const moviesContainer = document.getElementById('movies');

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h2>${movie.title}</h2>
            <p>Rating: ${movie.vote_average}</p>
            <button onclick="bookTicket(${movie.id})">Book Ticket</button>
        `;
        moviesContainer.appendChild(movieElement);
    });
}

function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5 && !isFetching) {
        fetchMovies();
    }
}

function bookTicket(movieId) {
    window.location.href = `seat-booking.html?id=${movieId}`;
}

















const movieDetailsContainer = document.getElementById('movie-details');
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

if (movieId) {
    fetchMovieDetails(movieId);
}

function fetchMovieDetails(id) {
    const movieUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`;
    fetch(movieUrl)
        .then(response => response.json())
        .then(movie => {
            movieDetailsContainer.innerHTML = `
                <h2>${movie.title}</h2>
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <p>${movie.overview}</p>
                <p>Release Date: ${movie.release_date}</p>
                <p>Rating: ${movie.vote_average}</p>
            `;
        })
        .catch(error => console.error('Error fetching movie details:', error));
}

function confirmBooking() {
    const seats = document.getElementById('seats').value;
    if (seats) {
        window.location.href = `confirm.html?id=${movieId}&seats=${seats}`;
    } else {
        alert('Please select the number of seats');
    }
}






const confirmationContainer = document.getElementById('confirmation-details');
const seats = urlParams.get('seats');

if (movieId && seats) {
    confirmationContainer.innerHTML = `
        <h2>Your Booking is Confirmed!</h2>
        <p>Movie: ${movieId}</p>
        <p>Seats: ${seats}</p>
        <p>Thank you for booking with us!</p>
    `;
}


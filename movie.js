const apiKey = '8d198ce8'; // Replace with your actual OMDB API key
let apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=movie&page=1`; // Search for movies
let currentPage = 1;
let isFetching = false;

document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
    window.addEventListener('scroll', handleScroll);
});

function fetchMovies(query = 'movie') {
    if (isFetching) return; // Avoid multiple requests at the same time

    isFetching = true;
    apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}&page=${currentPage}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.Search) {
                const movies = data.Search; // OMDB returns 'Search' as the key for the list of movies
                displayMovies(movies);
                currentPage++;
                isFetching = false;
            } else {
                console.error('No more movies found');
                isFetching = false;
            }
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
            <img src="${movie.Poster !== "N/A" ? movie.Poster : 'assets/placeholder.png'}" alt="${movie.Title}">
            <h2>${movie.Title}</h2>
            <p>Year: ${movie.Year}</p>
            <button onclick="bookTicket('${movie.imdbID}')">Book Ticket</button>
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

function bookTicket(imdbID) {
    window.location.href = `seat-booking.html?id=${imdbID}`;
}

function searchMovies() {
    const searchInput = document.getElementById('search-input').value;
    if (searchInput.trim() !== '') {
        currentPage = 1; // Reset to the first page for a new search
        document.getElementById('movies').innerHTML = ''; // Clear the current movies
        fetchMovies(searchInput);
    } else {
        alert('Please enter a movie title to search');
    }
}

// Fetch movie details when needed
const movieDetailsContainer = document.getElementById('movie-details');
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

if (movieId) {
    fetchMovieDetails(movieId);
}

function fetchMovieDetails(id) {
    const movieUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`;
    fetch(movieUrl)
        .then(response => response.json())
        .then(movie => {
            movieDetailsContainer.innerHTML = `
                <h2>${movie.Title}</h2>
                <img src="${movie.Poster !== "N/A" ? movie.Poster : 'assets/placeholder.png'}" alt="${movie.Title}">
                <p>${movie.Plot}</p>
                <p>Release Date: ${movie.Released}</p>
                <p>Rating: ${movie.imdbRating}</p>
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

// index.js

import axios from 'axios';
import { getMoviesByKeyword } from './api.js';
import { renderMovies } from './renderFilms.js';

const genreInput = document.getElementById('genre-input');
const searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', async () => {
  const genre = genreInput.value; // Pobieramy value z pola input
  console.log('Searching for movies with genre:', genre);
  const movies = await getMoviesByKeyword(genre);
  console.log('Movies:', movies);
  renderMovies(movies);
});

document.addEventListener('click', event => {
  if (event.target.classList.contains('movie-image')) {
    const movieId = event.target.dataset.movieId;
    console.log('Clicked on movie with ID:', movieId);
    showModal(movieId);
  }
});

const showModal = async movieId => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=c94d8e5ef8b4fe69956b21ebd01a6f37`
    );
    const movie = response.data;

    // Sprawdź, czy istnieje tytuł filmu, zanim spróbujesz go wyświetlić
    if (movie.title) {
      console.log('Movie title:', movie.title);
    } else {
      console.log('Movie title not available');
    }

    // Tutaj możesz zaimplementować wyświetlanie informacji o filmie w oknie modalnym
    console.log('Movie details:', movie);

    // Na przykład, możemy wyświetlić tytuł filmu w konsoli
    console.log('Movie title:', movie.title);
  } catch (error) {
    console.error('Error fetching movie details:', error);
  }
};

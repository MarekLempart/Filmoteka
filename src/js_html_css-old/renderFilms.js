// rederFilms.js

export const renderMovies = movies => {
  console.log('Rendering movies:', movies);
  const moviesContainer = document.getElementById('movies-container');
  moviesContainer.innerHTML = '';

  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');

    const movieImage = document.createElement('img');
    movieImage.classList.add('movie-image');

    // Sprawdzamy, czy istnieje plakat dla danego filmu
    if (movie.poster_path) {
      movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    } else {
      // Jeśli plakat nie istnieje, możemy ustawić alternatywny obrazek
      movieImage.src =
        'https://via.placeholder.com/500x750?text=No+Poster+Available';
    }

    movieImage.alt = movie.title;
    movieImage.dataset.movieId = movie.id; // Dodajemy identyfikator filmu do datasetu
    movieCard.appendChild(movieImage);

    const movieTitle = document.createElement('p');
    movieTitle.textContent = movie.title;
    movieCard.appendChild(movieTitle);

    const movieInfo = document.createElement('p');
    movieInfo.textContent = `${movie.genre_ids.join(
      ', '
    )} | ${movie.release_date.slice(0, 4)}`;
    movieCard.appendChild(movieInfo);

    moviesContainer.appendChild(movieCard);
  });
};

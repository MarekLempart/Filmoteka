import {
  fetchMovieDetails,
  fetchSearchMovies,
  fetchTrendingMovies,
  genresName,
} from './api';
import { addToQueue, addToWatchedMovies } from './localstorage';

// Funkcja renderująca galerię filmów
const renderGallery = async (searchQuery = '', pageNo = 1) => {
  try {
    let response;
    if (searchQuery === '') {
      response = await fetchTrendingMovies(pageNo);
    } else {
      response = await fetchSearchMovies(searchQuery, pageNo);
    }

    const movies = response.results;

    const galleryContainer = document.getElementById('gallery-container');

    if (movies.length > 0) {
      galleryContainer.innerHTML = movies
        .map(movie => {
          let posterPath;
          if (movie.poster_path) {
            posterPath = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
          } else {
            posterPath =
              'https://github.com/Krzysztof-GoIT/goit-projekt-filmoteka/blob/main/src/img/kolaz-w-tle-filmu.png?raw=true';
          }

          const movieCard = `
            <div class="movie-card" data-movie-id="${movie.id}">
              <img src="${posterPath}" alt="${
            movie.title
          }" class="movie-poster">
              <div class="movie-details">
                <p class="movie-title">${movie.title}</p>
                <p class="movie-info">${getGenres(
                  movie.genre_ids
                )} | ${movie.release_date.slice(0, 4)}</p>
              </div>
            </div>
          `;
          return movieCard;
        })
        .join('');

      const notResult = document.getElementById('not-result');
      notResult.style.display = 'none';
    } else {
      galleryContainer.innerHTML = '';
      const notResult = document.getElementById('not-result');
      notResult.style.display = 'block';
    }

    const movieCards = document.querySelectorAll('.movie-card');
    movieCards.forEach(card => {
      card.addEventListener('click', async () => {
        const movieId = card.dataset.movieId;
        const movieDetails = await fetchMovieDetails(movieId);
        displayMovieDetails(movieDetails);

        const watchedButton = document.createElement('button');
        watchedButton.innerText = 'Add to Watched';
        watchedButton.addEventListener('click', () =>
          addToWatchedMovies(movieDetails)
        );
        card.appendChild(watchedButton);

        const queuedButton = document.createElement('button');
        queuedButton.innerHTML = 'Add to Queue';
        queuedButton.addEventListener('click', () => addToQueue(movieDetails));
        card.appendChild(queuedButton);
      });
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
};

// Funkcja pomocnicza do pobrania nazw gatunków na podstawie ich identyfikatorów
const getGenres = genreIds => {
  const genres = genreIds.map(genreId => {
    const foundGenre = genresName.find(genre => genre.id === genreId);
    return foundGenre ? foundGenre.name : '';
  });
  return genres.join(', ');
};

// Funkcja do wyświetlania szczegółowych informacji o filmie w modalu
const displayMovieDetails = movieDetails => {
  console.log(movieDetails);
};

// Obsługa przycisku "Obejrzane"
const displayWatchedMovies = () => {
  // Implementacja funkcji wyświetlającej obejrzane filmy
  console.log('Displaying watched movies...');
};

// Obsługa przycisku "Kolejka"
const displayQueuedMovies = () => {
  // Implementacja funkcji wyświetlającej filmy w kolejce
  console.log('Displaying queued movies...');
};

// Obsługa przycisków "Obejrzane" i "Kolejka"
window.addEventListener('DOMContentLoaded', () => {
  renderGallery(); // Wyświetlenie domyślnej galerii filmów
  displayWatchedMovies(); // Wyświetlenie obejrzanych filmów
  displayQueuedMovies(); // Wyświetlenie filmów w kolejce

  const libraryWatchedButton = document.getElementById('library-watched');
  libraryWatchedButton.addEventListener('click', () => {
    displayWatchedMovies(); // Wyświetlenie obejrzanych filmów po kliknięciu na przycisk "Obejrzane"
  });

  const libraryQueuedButton = document.getElementById('library-queue');
  libraryQueuedButton.addEventListener('click', () => {
    displayQueuedMovies(); // Wyświetlenie filmów w kolejce po kliknięciu na przycisk "Kolejka"
  });
});

// Obsługa wyszukiwania filmów
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  const searchInput = document.querySelector('.search-form input');
  const searchQuery = searchInput.value.trim();
  renderGallery(searchQuery); // Wyświetlenie wyników wyszukiwania
  searchInput.value = ''; // Wyczyszczenie pola wyszukiwania
});

const scrollToTopButton = document.getElementById('scrollToTopButton');

// Pokaż przycisk, gdy użytkownik przewinie stronę w dół
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 100) {
    // Możesz dostosować wartość, aby przycisk pojawił się po przewinięciu o określoną liczbę pikseli
    scrollToTopButton.style.display = 'block';
  } else {
    scrollToTopButton.style.display = 'none';
  }
});

// Obsługa zdarzenia kliknięcia przycisku
scrollToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // Działa w większości nowoczesnych przeglądarek, aby przewijać płynnie
  });
});

import { fetchMovieTrailers } from './api';
import './modalTrailer'; // Importujemy funkcję otwierającą modal z zwiastunem

//Aleksander Modal
// const openModal = movieData => {
//   const modal = document.getElementById('myModal');
//   modal.style.display = 'block';

const openModal = async movieData => {
  // Zmiana na asynchroniczną funkcję
  const modal = document.getElementById('myModal');
  modal.style.display = 'block';

  // Pobieranie zwiastunów filmu
  const trailers = await fetchMovieTrailers(movieData.id);
  const trailerKey = trailers.results[0]?.key; // Pobierz klucz z pierwszego zwiastunu (jeśli istnieje)

  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = `
  <div class="movie-details-container">
    <img class="movie-poster" src="https://image.tmdb.org/t/p/w500${
      movieData.poster_path
    }" alt="${movieData.title} Photo">
    <div class="movie-details">
      <h2>${movieData.title}</h2>
      <p>Vote / Votes <span>${movieData.vote_average} / ${
    movieData.vote_count
  }</span></p>
      <p>Popularity <span>${movieData.popularity}</span></p>
      <p>Orginal Title <span>${movieData.original_title}</span></p>
      <p>Genre <span>${movieData.genres
        .map(genre => genre.name)
        .join(', ')}</span></p>
      <p><strong>ABOUT</strong> ${movieData.overview}</p>
    </div>
  </div>
  <iframe width="560" height="315" src="https://www.youtube.com/embed/${trailerKey}" frameborder="0" allowfullscreen></iframe> <!-- Dodanie zwiastunu do modalu -->
  <button class="watchedButton">Add to Watched</button>
  <button class="queuedButton">Add to Queue</button>
  <button class="close">Close</button>
`;

  const watchedButton = document.getElementsByClassName('watchedButton')[0];
  watchedButton.onclick = () => {
    addToWatchedMovies(movieData);
  };
  const queuedButton = document.getElementsByClassName('queuedButton')[0];
  queuedButton.onclick = () => {
    addToQueue(movieData);
  };

  const trailerButton = document.getElementsByClassName('trailerButton')[0]; // Przypisanie przycisku "trailerButton"
  trailerButton.onclick = openTrailerModal; // Dodanie obsługi kliknięcia na przycisku "trailerButton"

  const span = document.getElementsByClassName('close')[0];
  span.onclick = () => {
    modal.style.display = 'none';
  };

  // Obsługa zdarzenia keydown
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      modal.style.display = 'none';
    }
  });

  window.onclick = event => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
};

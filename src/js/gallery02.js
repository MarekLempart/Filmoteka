// gallery.js
import {
  fetchMovieDetails,
  fetchMovieTrailers,
  fetchSearchMovies,
  fetchTrendingMovies,
  genresName,
} from './api';
import { addToQueue, addToWatchedMovies } from './localstorage';
// import './modalTrailer'; // Importujemy funkcję otwierającą modal z zwiastunem
import { openModalPlayer } from './modalTrailer.js';

export let homePageNo = 0;

// Funkcja pomocnicza do pobrania nazw gatunków na podstawie ich identyfikatorów
export const getGenres = genreIds => {
  // Pobranie nazw gatunków z listy genresName zdefiniowanej w api.js
  const genres = genreIds.map(genreId => {
    const foundGenre = genresName.find(genre => genre.id === genreId);
    return foundGenre ? foundGenre.name : '';
  });
  // Zwrócenie połączonej listy gatunków
  return genres.join(', ');
};

const displayWatchedMovies = () => {
  try {
    const watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || [];
    const moviesWithGenres = watchedMovies.map(movie => {
      let categories = 'Without category';
      if (movie.genres && movie.genres.length > 0) {
        categories = movie.genres.map(genres => genres.name).join(', ');
      }
      return { ...movie, categories };
    });
    homePageNo = 0;
    clearGallery();
    renderGallery(moviesWithGenres, 1);
  } catch (error) {
    console.error('Error displaying watched movies:', error);
  }
};

const displayQueuedMovies = () => {
  try {
    const queuedMovies = JSON.parse(localStorage.getItem('queuedMovies')) || [];
    const moviesWithGenres = queuedMovies.map(movie => {
      let categories = 'Without category';
      if (movie.genres && movie.genres.length > 0) {
        categories = movie.genres.map(genres => genres.name).join(', ');
      }
      return { ...movie, categories };
    });
    homePageNo = 0;
    clearGallery();
    renderGallery(moviesWithGenres, 1);
  } catch (error) {
    console.error('Error displaying queued movies:', error);
  }
};

const displayMovieDetails = movieDetails => {
  // Tutaj możemy zaimplementować logikę wyświetlania informacji o filmie w modalu
  console.log(movieDetails);
};

//Obsługa HomePage i Buttonów
window.addEventListener('DOMContentLoaded', () => {
  getHomepage(1); // Wywołujemy funkcję wyświetlającą HomePage

  const libraryWatched = document.getElementById('watchedHeader');
  libraryWatched.addEventListener('click', displayWatchedMovies);

  const libraryQueued = document.getElementById('queueHeader');
  libraryQueued.addEventListener('click', displayQueuedMovies);

  // nie ma czego nasłuchiwać
  // const libraryWatchedButton = document.getElementById('watchedModal');
  // libraryWatchedButton.addEventListener('click', displayWatchedMovies);

  // nie ma czego nasłuchiwać
  // const libraryQueuedButton = document.getElementById('queueModal');
  // libraryQueuedButton.addEventListener('click', displayQueuedMovies);
});

//Generujemy trendings movie
export const getHomepage = async pageNo => {
  try {
    const response = await fetchTrendingMovies(pageNo);
    renderGallery(response.results, 0);
    homePageNo = pageNo;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
  }
};

//Obsługa szukajki
document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.querySelector('.search-form input');
  const notResult = document.getElementById('not-result');

  searchForm.addEventListener('submit', async event => {
    event.preventDefault();
    const searchQuery = searchInput.value.trim().toLowerCase().split(' ').join('+');
    if (searchQuery) {
      try {
        const response = await fetchSearchMovies(searchQuery, 1);
        renderGallery(response.results, 0);
        searchInput.value = ''; // Wyczyszczenie pola wyszukiwania
        if (response.results.length > 0) {
          notResult.style.display = 'none'; // Ukrycie komunikatu o braku wyników
        } else {
          notResult.style.display = 'block'; // Wyświetlenie komunikatu o braku wyników
          clearGallery(); // Wyczyszczenie galerii
        }
      } catch (error) {
        console.error('Error fetching search movies:', error);
      }
    }
  });
});

// Renderowanie Galerii
const renderGallery = (dataGallery, rating) => {
  try {
    // Pobranie danych o filmach z galerii
    const movies = dataGallery;
    // Znalezienie kontenera dla galerii filmów
    const galleryContainer = document.getElementById('gallery-container');
    // Ukrycie komunikatu o braku wyników na start
    const notResult = document.getElementById('not-result');
    notResult.style.display = 'none';

    // Sprawdzenie czy lista filmów nie jest pusta
    if (movies.length > 0) {
      // Pobranie danych o najbardziej popularnych filmach
      const newContent = movies
        .map(movie => {
          let posterPath;
          if (movie.poster_path) {
            posterPath = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
          } else {
            posterPath =
              'https://github.com/Krzysztof-GoIT/goit-projekt-filmoteka/blob/main/src/img/kolaz-w-tle-filmu.png?raw=true';
          }

          // Inicjalizacja zmiennej przechowującej informacje o gatunkach filmu
          let categories = 'Without category';
          // Ustalenie roku wydania filmu
          let releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : 'Without date';

          // Sprawdzenie czy istnieje przynajmniej jeden gatunek filmu, jeśli tak, pobierz nazwy wszystkich gatunków
          if (movie.genres && movie.genres.length > 0) {
            categories = movie.genres.map(genre => genre.name).join(', ');
          } else if (movie.genre_ids && movie.genre_ids.length > 0) {
            categories = getGenres(movie.genre_ids);
            if (!categories) {
              categories = 'Without category';
            }
          }
          console.log('rating: ', rating);
          let rate = rating
            ? ` <span class="movie-info-rating">${movie.vote_average.toFixed(1)}</span>`
            : ``;

          // Zbudowanie kodu HTML dla karty filmu
          const movieCard = `
            <div class="movie-card" data-movie-id="${movie.id}">
            <img class="movie-poster" src="${posterPath}" alt="${movie.title}">
            <div class="movie-details">
            <p class="movie-title">${movie.title}</p>
            <p class="movie-info">${categories} | ${releaseYear}${rate}</p>
            </div>
            </div>
          `;
          return movieCard;
        })
        .join('');
      //galleryContainer.innerHTML = newContent;
      galleryContainer.insertAdjacentHTML('beforeend', newContent);

      // Wstawienie wygenerowanego kodu HTML do kontenera galerii
      //galleryContainer.innerHTML = newContent;
      // Ukrycie komunikatu o braku wyników, jeśli lista filmów nie jest pusta
      notResult.style.display = 'none';
    } else {
      // Jeśli lista filmów jest pusta, wyświetl komunikat o braku wyników
      //galleryContainer.innerHTML = '';
      notResult.style.display = 'block';
      // Wyczyszczenie galerii
      clearGallery();
    }

    // Obsługa zdarzenia kliknięcia dla każdej karty filmu
    const movieCards = document.querySelectorAll('.movie-card');
    movieCards.forEach(card => {
      card.addEventListener('click', async () => {
        const movieId = card.dataset.movieId;
        // Pobranie szczegółowych informacji o wybranym filmie
        const movieDetails = await fetchMovieDetails(movieId);
        // Otwarcie modalu z informacjami o filmie
        openModal(movieDetails);
        // Wyświetlenie dodatkowych informacji o filmie
        displayMovieDetails(movieDetails);
      });
    });
  } catch (error) {
    // Obsługa błędu w przypadku problemów z renderowaniem galerii
    console.error('Error rendering gallery:', error);
    // Wyświetlenie komunikatu o braku wyników w przypadku błędu
    const notResult = document.getElementById('not-result');
    notResult.style.display = 'block';
  }
};

// Ukrycie komunikatu o braku wyników na start
document.addEventListener('DOMContentLoaded', () => {
  const notResult = document.getElementById('not-result');
  notResult.style.display = 'none';
});

// Czyszczenie galerii
export const clearGallery = () => {
  const galleryContainer = document.getElementById('gallery-container');
  galleryContainer.innerHTML = ''; // Wyczyszczenie zawartości galerii
};

//Aleksander Modal
const openModal = movieData => {
  const modal = document.getElementById('myModal');
  modal.style.display = 'block';

  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = `
    <div class="movie-details-container">
      <img class="movie-poster" src="https://image.tmdb.org/t/p/w500${
        movieData.poster_path
      }" alt="${movieData.title} Photo">
    </div>
    <div class="movie-details">
      <h2>${movieData.title}</h2>
      <p>Vote / Votes <span>${movieData.vote_average.toFixed(1)} / ${
    movieData.vote_count
  }</span></p>
      <p>Popularity <span>${movieData.popularity}</span></p>
      <p>Orginal Title <span>${movieData.original_title}</span></p>
      <p>Genre <span>${movieData.genres.map(genre => genre.name).join(', ')}</span></p>
      <p><strong>ABOUT</strong> ${movieData.overview}</p>
    </div>
    <div>
      <button class="watchedButton">Add to Watched</button>
      <button class="queuedButton">Add to Queue</button>
    <div>
    <div class="movieTrailer">
      <button class="trailerButton">Trailer</button>
    </div>
    `;
  const watchedButton = document.getElementsByClassName('watchedButton')[0];
  watchedButton.onclick = () => {
    addToWatchedMovies(movieData);
  };
  const queuedButton = document.getElementsByClassName('queuedButton')[0];
  queuedButton.onclick = () => {
    addToQueue(movieData);
  };

  const trailerButton = document.querySelector('.trailerButton');
  trailerButton.addEventListener('click', async () => {
    try {
      // Pobranie identyfikatora filmu
      const movieId = movieData.id;
      // Wysłanie żądania do API w celu pobrania zwiastunu filmu
      const trailers = await fetchMovieTrailers(movieId);
      // Wyświetlenie danych zwiastunu w konsoli
      console.log('Trailers:', trailers);

      // Odniesienie do kontenera, gdzie będzie wyświetlany odtwarzacz wideo
      const videoContainer = document.getElementById('video-container');
      // Jeśli są dostępne zwiastuny
      if (trailers && trailers.length > 0) {
        // Pobranie pierwszego zwiastunu
        const trailerURL = trailers[0].url;
        // Utworzenie elementu wideo
        const videoElement = document.createElement('video');
        // Dodanie klas stylów dla odtwarzacza video.js
        videoElement.classList.add('video-js', 'vjs-default-skin');
        // Ustawienie atrybutów odtwarzacza
        videoElement.setAttribute('controls', '');
        videoElement.setAttribute('preload', 'auto');
        // Ustawienie źródła filmu
        videoElement.src = trailerURL;
        // Dodanie odtwarzacza do kontenera
        videoContainer.appendChild(videoElement);
        // Inicjalizacja odtwarzacza video.js
        const player = videojs(videoElement);
        // Otwarcie modalu z odtwarzaczem wideo
        openModalPlayer(player);
      } else {
        console.error('No trailers available for this movie.');
      }
    } catch (error) {
      console.error('Error fetching movie trailers:', error);
    }
  });

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

//scrollToTop by Marek
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

// Funkcja do sprawdzania, czy element jest blisko dolnej krawędzi okna przeglądarki
function isNearBottom(element, threshold) {
  const rect = element.getBoundingClientRect();
  return rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold;
}

// Event scroll na oknie przeglądarki
const loadMoreContent = () => {
  // Element, który monitorujemy, np. kontener na treści
  const contentContainer = document.querySelector('.movie-card:last-child');
  // Threshold - odległość od dolnej krawędzi, przy której chcemy zacząć ładować więcej treści
  const threshold = 800; // w pikselach

  // Sprawdzamy, czy element jest blisko dolnej krawędzi okna przeglądarki
  if (isNearBottom(contentContainer, threshold)) {
    // Jeśli tak, ładujemy więcej treści
    if (homePageNo > 0) homePageNo++;
    getHomepage(homePageNo);
  }
};
const infinityScroll = document.getElementById('infinityScroll');

let isInfinityScrollActive = false;

// Obsługa zdarzenia kliknięcia przycisku
infinityScroll.addEventListener('click', () => {
  if (isInfinityScrollActive) {
    // Jeżeli infinity scroll jest aktywny, usuwamy nasłuchiwanie zdarzenia scroll
    window.removeEventListener('scroll', loadMoreContent);
  } else {
    // Jeżeli infinity scroll nie jest aktywny, dodajemy nasłuchiwanie zdarzenia scroll
    window.addEventListener('scroll', loadMoreContent);
  }
  // Zmiana stanu - włącz/wyłącz
  isInfinityScrollActive = !isInfinityScrollActive;

  // Początkowe ładowanie treści
  getHomepage(homePageNo);

  // Event scroll na oknie przeglądarki po kliknięciu przycisku
  window.addEventListener('scroll', loadMoreContent);

  // Usuń obsługę zdarzenia kliknięcia przycisku, aby nie powtarzać ładowania po kliknięciu
  infinityScroll.removeEventListener('click', loadMoreContent);
});

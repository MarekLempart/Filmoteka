// gallery.js

import { fetchSearchMovies, fetchTrendingMovies, genresName } from './api';

// Funkcja pomocnicza do pobrania nazw gatunków na podstawie ich identyfikatorów
const getGenres = genreIds => {
  // Pobranie nazw gatunków z listy genresName zdefiniowanej w api.js
  const genres = genreIds.map(genreId => {
    const foundGenre = genresName.find(genre => genre.id === genreId);
    return foundGenre ? foundGenre.name : '';
  });

  // Zwrócenie połączonej listy gatunków
  return genres.join(', ');
};

const displaySearchResults = async (searchQuery, pageNo) => {
  try {
    // Pobranie wyników wyszukiwania
    const response = await fetchSearchMovies(searchQuery, pageNo);
    const searchResults = response.results;

    // Wyświetlenie wyników wyszukiwania
    // ...
  } catch (error) {
    console.error('Error fetching search movies:', error);
  }
};

const renderGallery = async (galleryType, pageNo) => {
  try {
    if (galleryType === 'Aktualne Filmy') {
      // Pobranie danych o najbardziej popularnych filmach
      const response = await fetchTrendingMovies(pageNo);
      const movies = response.results;

      // Wyświetlenie galerii filmów
      // ...
    } else if (galleryType === 'Watched') {
      // Wyświetlenie obejrzanych filmów
      // ...
    } else if (galleryType === 'Queued') {
      // Wyświetlenie filmów w kolejce
      // ...
    }
  } catch (error) {
    console.error('Error fetching gallery movies:', error);
  }
};

// Wywołujemy funkcję renderGallery po załadowaniu strony
window.addEventListener('DOMContentLoaded', () => {
  renderGallery('Aktualne Filmy', 1); // Wyświetlenie najpopularniejszych filmów
});

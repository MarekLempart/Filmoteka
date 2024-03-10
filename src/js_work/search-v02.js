import { fetchSearchMovies } from './api';

// Funkcja odpowiedzialna za wyświetlanie wyników wyszukiwania
export async function displaySearchResults(searchQuery, pageNo) {
  try {
    const response = await fetchSearchMovies(searchQuery, pageNo);
    const searchResults = response.results;

    // Tu dalsza część kodu związana z wyświetlaniem wyników
    // ...
  } catch (error) {
    console.error('Error fetching search movies:', error);
  }
}

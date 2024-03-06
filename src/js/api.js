// api.js

import axios from 'axios';

const API_KEY = 'c94d8e5ef8b4fe69956b21ebd01a6f37';

export const getMoviesByKeyword = async keyword => {
  // Zmiana nazwy funkcji i parametru
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${keyword}` // Aktualizacja adresu URL zapytania
    );
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

import { OMDB_API_KEY, OMDB_BASE_URL } from '../constants';
import { Movie } from '../types';

export const fetchMovieByTitle = async (title: string): Promise<Movie | null> => {
  try {
    const response = await fetch(`${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`);
    const data = await response.json();
    if (data.Response === 'True') {
      return data as Movie;
    }
    return null;
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await fetch(`${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
    const data = await response.json();
    if (data.Response === 'True' && data.Search) {
      return data.Search as Movie[];
    }
    return [];
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
};

export const fetchMovieDetail = async (id: string): Promise<Movie | null> => {
  try {
    const response = await fetch(`${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${id}&plot=full`);
    const data = await response.json();
    if (data.Response === 'True') {
      return data as Movie;
    }
    return null;
  } catch (error) {
    console.error("Error fetching detail:", error);
    return null;
  }
};
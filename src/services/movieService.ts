import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

interface FetchMoviesResponse {
  results: Movie[];
}

export async function fetchMovies(query: string): Promise<Movie[]> {
  console.log('TOKEN', import.meta.env.VITE_TMDB_TOKEN);
  const token = import.meta.env.VITE_TMDB_TOKEN;

  const config = {
    params: { query },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get<FetchMoviesResponse>(BASE_URL, config);

  return response.data.results;
}
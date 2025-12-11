import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import Pagination from '../ReactPagination/ReactPagination';
import { fetchMovies, type FetchMoviesResponse } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import './App.module.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const queryResult = useQuery<FetchMoviesResponse, Error>({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
  });

  const { data, isLoading, isError } = queryResult;

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [data]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1); 
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <Toaster />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && (
        <>
          {data && data.total_pages > 1 && (
            <Pagination totalPages={data.total_pages} page={page} setPage={setPage} />
          )}
          <MovieGrid movies={data?.results ?? []} onSelect={setSelectedMovie} />
          
        </>
      )}

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </>
  );
}

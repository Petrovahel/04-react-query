import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import ReactPagination from '../ReactPagination/ReactPagination';
import { fetchMovies, type FetchMoviesResponse } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import './App.module.css';
import { keepPreviousData } from '@tanstack/react-query';


export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

 const queryResult = useQuery<FetchMoviesResponse, Error>({
  queryKey: ['movies', query, page],
  queryFn: () => fetchMovies(query, page),
  enabled: !!query,
  placeholderData: keepPreviousData,
});

const { data, isLoading, isError } = queryResult;
const [hasSearched, setHasSearched] = useState(false);

const handleSearch = (searchQuery: string) => {
  setQuery(searchQuery);
  setPage(1); 
  setHasSearched(true);
};

useEffect(() => {
  if (hasSearched && !queryResult.isFetching && data && data.results.length === 0) {
    toast.error('No movies found for your request.');
  }
}, [data, hasSearched, queryResult.isFetching]);



  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <Toaster />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && (
        <>
         {data && data.total_pages > 1 && (
            <ReactPagination pageCount={data.total_pages} forcePage={page} onPageChange={setPage} /> )}

          <MovieGrid movies={data?.results ?? []} onSelect={setSelectedMovie} />
          
        </>
      )}

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </>
  );
}

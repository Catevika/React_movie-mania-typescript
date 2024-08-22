import { useEffect, useState } from 'react';
import { getMovieData } from '../../api/api';
import Movie from '../Movie/Movie';
import './Movies.css';

import { TMovie } from '../../types/types';

export default function Movies({ term }: { term: string | undefined; }) {
  const [movies, setMovies] = useState<TMovie[]>([]);

  useEffect(() => {
    const getMovies = async () => {
      const response = await getMovieData(term);
      setMovies(response.data.results);
    };
    if (term) getMovies();
  }, [term]);

  console.log(movies);

  return (
    <div className='movies-container'>
      {movies?.length > 0 ? movies.map(movie => <div className='movie-container' key={movie.id}><Movie movie={movie} /></div>) : <div className='message'>No movie available yet.</div>}
    </div>
  );
}


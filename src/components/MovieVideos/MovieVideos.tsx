import { useEffect, useState } from 'react';
import { getMovieVideoData } from '../../api/api';
import MovieVideo from '../MovieVideo/MovieVideo';
import './MovieVideos.css';
import { TMovieVideo } from '../../types/types';

export default function MovieVideos({ movieId }: { movieId: string; }) {
  const [movieVideos, setMovieVideos] = useState<TMovieVideo[]>([]);

  useEffect(() => {
    const getVideos = async () => {
      const response = await getMovieVideoData(movieId);
      setMovieVideos(response.data.results);
    };
    if (movieVideos) getVideos();
  }, []);


  return (
    <div className='movievideo-container'>
      {movieVideos?.length > 0 ?
        <>
          <p>Vidéos / Trailers: </p>
          <ul className='movievideo-wrapper'>{movieVideos.map(movieVideo =>
            <li key={movieVideo.key}>
              <MovieVideo movieVideo={movieVideo} />
            </li>
          )}
          </ul>
        </>
        : <p>Vidéos / Trailers: <span> Not available</span></p>}
    </div>
  );
}
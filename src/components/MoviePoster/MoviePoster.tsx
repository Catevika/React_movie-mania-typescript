import { useState, useEffect } from "react";
import { getMovieDetailsData } from "../../api/api";

export default function MoviePoster({ movieId }: { movieId: string | undefined; }) {
  const [posterUrl, setPosterUrl] = useState('');

  useEffect(() => {
    const getMoviePoster = async () => {
      const response = await getMovieDetailsData(movieId);
      const posterPath = response.data.poster_path;

      if (posterPath) setPosterUrl(
        `https://image.tmdb.org/t/p/w500${posterPath}`
      );
    };

    getMoviePoster();
  }, [movieId]);

  return (
    <>
      {posterUrl ? <img src={posterUrl} alt="MovieDetails poster" /> : null}
    </>
  );
};






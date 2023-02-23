import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetailsData } from '../../api/api';
import MoviePoster from '../../components/MoviePoster/MoviePoster';
import MovieVideos from '../../components/MovieVideos/MovieVideos';
import './MovieDetails.css';

import { TMovieDetails } from '../../types/types';

export default function MovieDetails() {
  const { movieId } = useParams();

  const [searching, setSearching] = useState(false);

  const [movieInfos, setMovieInfos] = useState<TMovieDetails>({});
  const [genres, setGenres] = useState<TMovieDetails['genres']>([]);
  const [languages, setLanguages] = useState<TMovieDetails['spoken_languages']>();
  const [productionCompanies, setProductionCompanies] = useState<TMovieDetails['production_companies']>();
  const [productionCountries, setProductionCountries] = useState<TMovieDetails['production_countries']>();

  useEffect(() => {
    const getMovieInfos = async () => {
      setSearching(true);
      const response = await getMovieDetailsData(movieId);
      setMovieInfos(response.data);
      setGenres(response.data.genres);
      setLanguages(response.data.spoken_languages);
      setProductionCompanies(response.data.production_companies);
      setProductionCountries(response.data.production_countries);
      setSearching(false);
    };
    if (movieInfos) getMovieInfos();
  }, [movieId]);

  return (
    <div className='moviedetails-container'>
      {!searching && movieInfos && movieId ? <div className='moviedetails-wrapper'>
        <MoviePoster movieId={movieId} />
        <div className='moviedetails'>
          {movieInfos?.title ? <h2>{movieInfos.title}</h2> : <h2>Title: Not available</h2>}
          {movieInfos?.tagline ? <h3 className='moviedetails-tagline'>{movieInfos.tagline}</h3> : <p>Tagline: Not available</p>}
          {movieInfos?.overview ? <p className='moviedetails-overview'>{movieInfos.overview}</p> : <p>Overview: Not available</p>}

          {genres?.length === 0 ? <p>Genre: <span>Not available</span></p>
            : genres?.length === 1 ? <p>Genre: <span>{genres.map(genre => genre.name)}</span></p>
              : <p>Genres: <span>{genres?.map(genre => genre.name).join(' - ')}</span></p>}

          <p className='moviedetails-release-date'>Release date: {movieInfos.release_date ? <span>{movieInfos.release_date}</span> : <span>Not available</span>}</p>

          {languages?.length === 0 ? <p>Language: <span>Not available</span></p>
            : languages?.length === 1 ? <p>Language: <span>{languages?.map(language => language.english_name)}</span></p>
              : <p>Languages: <span>{languages?.map(language => language.english_name).join(' - ')}</span></p>}

          <div className='moviedetails-card'>
            <p>Budget: {!movieInfos?.budget ? <span>Not available</span>
              : <span>USD {new Intl.NumberFormat('en-US', { maximumSignificantDigits: 2 }).format((movieInfos.budget))}</span>}</p>

            <p>Revenue: {!movieInfos?.revenue ? <span>Not available</span> : <span>USD {new Intl.NumberFormat('en-US', { maximumSignificantDigits: 2 }).format((movieInfos.revenue))}</span>}</p>
          </div>

          <div className='moviedetails-bottom'>
            {productionCountries?.length === 0 ? <p> Production country: <span>Not available</span></p>
              : productionCountries?.length === 1 ? <p> Production country: <span>{productionCountries?.map(productionCountry => productionCountry.iso_3166_1)}</span></p>
                : <p>Production countries: <span>{productionCountries?.map(productionCountry => productionCountry.iso_3166_1).join(' - ')}</span></p>}

            {productionCompanies?.length === 0 ? <p> Production company: <span>Not available</span></p>
              : productionCompanies?.length === 1 ? <p> Production company: <span>{productionCompanies?.map(productionCompany => productionCompany.name)}</span></p>
                : <p> Production companies: <span>{productionCompanies?.map(productionCompany => productionCompany.name).join(' - ')}</span></p>}

            <MovieVideos movieId={movieId} />
          </div>
        </div>
      </div> : <p className='message'>No movie details found yet.</p>}
    </div>
  );
}

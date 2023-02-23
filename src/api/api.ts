import axios from 'axios';

const apiKey = import.meta.env.VITE_API_KEY;
const baseUrl = 'https://api.themoviedb.org/3';
const language = 'en-US';

export const getMovieData = async (term: string | undefined) => await axios.get(
	`${baseUrl}/search/movie?api_key=${apiKey}&query=${term}}`
);

export const getMovieDetailsData = async (movieId: string | undefined) => await axios.get(
	`${baseUrl}/movie/${movieId}?api_key=${apiKey}&language=${language}`
);

export const getMovieVideoData = async (movieId: string | undefined) => await axios.get(
	`${baseUrl}/movie/${movieId}/videos?api_key=${apiKey}&language=${language}`
);

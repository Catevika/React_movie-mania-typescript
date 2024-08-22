import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { getMovieDetailsData, getMovieVideoData } from '../api/api';
import MovieVideo from '../components/MovieVideo/MovieVideo';
import MovieDetails from '../pages/MovieDetails/MovieDetails';
import { movieDetailsMock } from './__mocks__/movieDetailsMock';
import { movieVideoMock } from './__mocks__/movieVideoMock';

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import MoviePoster from '../components/MoviePoster/MoviePoster';

const server = setupServer(

	http.get('https://api.themoviedb.org/3/movie/:movieId', ({ request }) => {
		const url = new URL(request.url);
		const movieId = url.searchParams.get('movieId');
		const apiKey = url.searchParams.get('api_key');
		const language = url.searchParams.get('language');

		return (
			new HttpResponse(null, {
				status: 200,
			}),
			new Response(JSON.stringify(movieDetailsMock), {
				headers: {
					'Content-Type': 'application/json',
				},
			}));
	}),

	http.get('https://api.themoviedb.org/3/movie/:movieId/videos', ({ request }) => {
		const url = new URL(request.url);
		const movieId = url.searchParams.get('movieId');
		const apiKey = url.searchParams.get('api_key');
		const language = url.searchParams.get('language');

		return (
			new HttpResponse(null, {
				status: 200,
			}),
			new Response(JSON.stringify(movieVideoMock), {
				headers: {
					'Content-Type': 'application/json',
				},
			}));
	})
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

const user = userEvent.setup();


describe('MovieDetails', () => {
	test('makes a GET request to fetch movie details and display them correctly', async () => {
		const apiKey = import.meta.env.VITE_API_KEY;
		const language = 'en-US';
		const movieId = '361743';

		render(
			<MemoryRouter initialEntries={[`/movie/${movieId}`]} >
				<Routes>
					<Route path='/movie/:movieId' element={<MovieDetails />} />
				</Routes>
			</MemoryRouter>
		);

		const { data } = await waitFor(() => getMovieDetailsData(movieId));

		expect(data).toEqual(movieDetailsMock);

		expect(screen.getByText(data.title)).toBeInTheDocument();
		expect(screen.getByText(data.tagline)).toBeInTheDocument();
		expect(screen.getByText(data.overview)).toBeInTheDocument();
		expect(screen.getByText(data.release_date)).toBeInTheDocument();
		expect(data.genres.length).toBe(2);

		const genresTexts = data.genres.map((genre: { name: string; }) => genre.name);
		const movieGenres = screen.getByText(genresTexts.join(' - '));
		expect(screen.getByText('Genres:')).toBeInTheDocument();
		expect(movieGenres).toBeInTheDocument();

		expect(data.spoken_languages.length).toBe(1);

		const languagesTexts = data.spoken_languages.map((language: { name: string; }) => language.name);
		const languagesText = screen.getByText(languagesTexts[0]);
		expect(screen.getByText('Language:')).toBeInTheDocument();
		expect(languagesText).toBeInTheDocument();

		const formatedBudget = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 2 }).format(data.budget);
		const formatedRevenue = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 2 }).format(data.revenue);

		expect(screen.getByText('USD ' + formatedBudget)).toBeInTheDocument();
		expect(screen.getByText('USD ' + formatedRevenue)).toBeInTheDocument();

		expect(data.production_countries.length).toBe(1);

		const productionCountries = data.production_countries.map((productionCountry: { iso_3166_1: string; }) => productionCountry.iso_3166_1);
		const productionCountry = screen.getByText(productionCountries[0]);
		expect(screen.getByText('Production country:')).toBeInTheDocument();
		expect(productionCountry).toBeInTheDocument();

		expect(data.production_companies.length).toBe(3);

		const productionCompanies = data.production_companies.map((productionCompany: { name: string; }) => productionCompany.name);
		const productionCompany = screen.getByText(productionCompanies.join(' - '));
		expect(screen.getByText('Production companies:')).toBeInTheDocument();
		expect(productionCompany).toBeInTheDocument();

		const posterPath = data.poster_path;
		const posterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;

		const { findByAltText } = render(
			<MemoryRouter initialEntries={[`/movie/${movieId}`]}>
				<MoviePoster movieId={movieId} />
			</MemoryRouter>
		);

		const image = await findByAltText('MovieDetails poster');
		expect(image).toHaveAttribute('src', posterUrl);
	});

	test('message for user when fetching movie poster fails', async () => {
		const posterPathError = 'posterPath is not defined';

		async function getMoviePoster() {
			let posterPath;

			if (!posterPath) {
				throw new Error(posterPathError);
			}
		}

		await expect(getMoviePoster()).rejects.toThrow(posterPathError);
		expect(posterPathError).toEqual('posterPath is not defined');
	});
});

describe('MovieVideoModal', () => {
	test('MovieVideoModal should be closed after click out of the video', async () => {
		const apiKey = import.meta.env.VITE_API_KEY;
		const language = 'en-US';
		const movieId = '361743';

		const { data } = await waitFor(() => getMovieVideoData(movieId));

		expect(data).toEqual(movieVideoMock);

		const movieVideos = data.results;
		const movieVideo = movieVideos[22];
		const moviekey = movieVideo.key;

		render(
			<MemoryRouter>
				<MovieVideo movieVideo={movieVideo} />
			</MemoryRouter>
		);

		const videoLink = screen.getByTestId('movie video link');
		await waitFor(() => user.click(videoLink));

		const videoModal = screen.getByTestId<HTMLIFrameElement>('movievideo-modal-container');
		expect(videoModal).toBeInTheDocument();
		expect(document.body).toHaveStyle('overflow: hidden;');

		const video = screen.getByTestId<HTMLVideoElement>('movievideo-modal-video');
		expect(video.src).toBe(`https://www.youtube.com/embed/${moviekey}`);
		expect(video.autoplay).toBeFalsy();

		await waitFor(() => user.click(video));
		expect(video.paused).toBeFalsy();

		await waitFor(() => user.click(video));

		await waitFor(() => user.click(videoModal));
		expect(videoLink).toBeInTheDocument();
		expect(document.body).toHaveStyle('overflow: auto;');
	});
});



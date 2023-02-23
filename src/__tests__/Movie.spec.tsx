import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getMovieData } from '../api/api';
import { movieMock } from './__mocks__/movieMock';
import Movie from '../components/Movie/Movie';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
	rest.get('https://api.themoviedb.org/3/search/movie', (req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json(movieMock)
		);
	})
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

const user = userEvent.setup();

let term = 'Top Gun';

describe('Movie', () => {
	test('Makes a GET request to fetch movies and display the correct element on the page', async () => {
		const { data } = await waitFor(() => getMovieData(term));

		expect(data).toEqual(movieMock);
		const movie = data.results[0];

		render(
			<MemoryRouter>
				<Movie movie={movie} />
			</MemoryRouter>
		);

		expect(screen.getByText(movie.title)).toBeInTheDocument();

		expect(screen.getByText('Release Date:')).toBeInTheDocument();
		expect(screen.getByText(movie.release_date)).toBeInTheDocument();

		expect(screen.getByText('Original language:')).toBeInTheDocument();
		expect(screen.getByText(movie.original_language)).toBeInTheDocument();

		expect(screen.getByText('Overview:')).toBeInTheDocument();
		expect(screen.getByText(movie.overview)).toBeInTheDocument();

		expect(screen.getByText('Vote average:')).toBeInTheDocument();
		expect(screen.getByText('Vote count:')).toBeInTheDocument();

		expect(document.body.style.length).toBe(0);

		expect(screen.getByRole('img', { name: 'Movie poster' })).toBeInTheDocument();

		const detailsLink = screen.getByText('Details');
		expect(detailsLink).toHaveAttribute('href', '/movie/' + movie.id);
	});
});

describe('MovieModal', () => {
	test('MovieModal should be closed after click out of the modal', async () => {
		const { data } = await waitFor(() => getMovieData(term));
		const movieData = data.results;
		const movie = movieData[0];

		render(
			<MemoryRouter>
				<Movie movie={movie} />
			</MemoryRouter>
		);

		const poster = screen.getByAltText('Movie poster');

		await waitFor(() => user.click(poster));

		const posterModal = screen.getByAltText<HTMLImageElement>('Big Movie poster');
		expect(posterModal.src).toBe('https://image.tmdb.org/t/p/w500' + movie.poster_path);
		expect(document.body).toHaveStyle('overflow: hidden;');

		const posterWrapper = screen.getByTestId('movie-wrapper');
		await waitFor(() => user.click(posterWrapper));
		expect(poster).toBeInTheDocument();
		expect(document.body).toHaveStyle('overflow: auto;');
	});

	test('display message if posterpath undefined', async () => {
		const { data } = await waitFor(() => getMovieData(term));
		const movieData = data.results;
		const movie = movieData[9];

		render(
			<MemoryRouter>
				<Movie movie={movie} />
			</MemoryRouter>
		);

		const message = screen.getByText('No poster available');
		expect(message).toBeInTheDocument();

		const paragraph = screen.getByTestId('image-replacement-p');
		expect(paragraph.firstChild?.nodeName).toBe('svg');
	});
});

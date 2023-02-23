import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getMovieData } from '../api/api';
import { movieMock } from './__mocks__/movieMock';
import Home from '../pages/Home/Home';

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

describe('Home', () => {
  test('Search field should render properly', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Enter movie name...')).toBeInTheDocument();
  });

  test('Input should change if value is updated', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const input = screen.getByRole<HTMLInputElement>('searchbox', {
      name: /search input/i
    });

    expect(input.value).toBe('');

    await waitFor(() => user.type(input, 'Top Gun'));
    expect(input.value).toBe('Top Gun');

    await waitFor(() => user.clear(input));

    await waitFor(() => user.type(input, 'Avatar'));
    expect(input.value).toBe('Avatar');
  });

  test('button Search should launch the search', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const input = screen.getByDisplayValue<HTMLInputElement>('');
    await waitFor(() => user.type(input, 'Top Gun'));

    const searchButton = await screen.findByTitle(/search button/i);
    await waitFor(() => user.click(searchButton));

    const { data } = await waitFor(() => getMovieData(input.value));

    expect(data).toEqual(movieMock);
    expect(screen.getByText(data.results[0].title)).toBeInTheDocument();
  });

  test('Movies search fails', async () => {
    server.use(
      rest.get(
        'https://api.themoviedb.org/3/search/movie', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json([])
          );
        })
    );

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const input = screen.getByDisplayValue<HTMLInputElement>('');
    await waitFor(() => user.type(input, 'dvsdv'));

    const searchButton = await screen.findByTitle(/search button/i);
    await waitFor(() => user.click(searchButton));

    const { data } = await waitFor(() => getMovieData(input.value));

    expect(data).toEqual([]);

    expect(screen.getByText('No movie available yet.')).toBeInTheDocument();
  });
});

describe('localStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should save search form localStorage input value', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>);

    const input = screen.getByDisplayValue<HTMLInputElement>('');
    await waitFor(() => user.type(input, 'Avatar'));

    const searchButton = await screen.findByTitle(/search button/i);
    await waitFor(() => user.click(searchButton));

    const termValue = localStorage.getItem('term');

    expect(termValue).toBe(JSON.stringify(input.value));
  });
});

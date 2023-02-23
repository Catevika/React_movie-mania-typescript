import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Credits from "../pages/Credits/Credits";

describe('Credits', () => {
  test('credits render properly', () => {
    render(
      <MemoryRouter>
        <Credits />
      </MemoryRouter>
    );

    expect(screen.getByText(/Credits/)).toBeInTheDocument();

    expect(screen.getByAltText('TMDB logo')).toBeInTheDocument();

    expect(screen.getByText('This product uses The Movie Database (TMDB) API but is not endorsed or certified by TMDB.')).toBeInTheDocument();
  });
});
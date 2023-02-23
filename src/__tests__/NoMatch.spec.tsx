import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import RouteLayout from "../components/RouteLayout/RouteLayout";
import Home from "../pages/Home/Home";
import NoMatch from "../pages/NoMatch/NoMatch";

describe('NoMatch', () => {
  test('should respond with error', () => {
    render(
      <MemoryRouter initialEntries={['/xyz']}>
        <Routes>
          <Route path='/' element={<RouteLayout />} >
            <Route index element={<Home />} />
            <Route path='*' element={<NoMatch />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('img', { name: '404 - Not found page' })).toBeInTheDocument();
  });
});
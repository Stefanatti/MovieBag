import "@testing-library/jest-dom";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import useFetchData from "../Hooks/useFetchData";
import ShowsLibraryList from "./ShowsLibraryList";

jest.mock("../Hooks/useFetchData", () => jest.fn());
jest.mock("../api/axios", () => ({
  delete: jest.fn(),
  put: jest.fn(),
}));

const renderLibrary = (showType = "movie", filterKey = "title") => {
  const store = configureStore({
    reducer: {
      user: (state = { value: { _id: "test-user" } }) => state,
      movies: (state = {}) => state,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ShowsLibraryList showType={showType} filterKey={filterKey} />
      </MemoryRouter>
    </Provider>,
  );
};

afterEach(() => {
  jest.clearAllMocks();
});

test("the library presents searchable movie cards and filters titles case-insensitively", async () => {
  useFetchData.mockReturnValue({
    data: [
      {
        _id: "movie-1",
        id: "550",
        title: "Fight Club",
        year: "1999",
        director: "David Fincher",
        ratings: { stars: 4 },
      },
      {
        _id: "movie-2",
        id: "27205",
        title: "Inception",
        year: "2010",
        director: "Christopher Nolan",
      },
    ],
    loading: false,
    error: null,
  });

  renderLibrary();

  expect(
    await screen.findByRole("heading", { name: "Your Movies" }),
  ).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Search movies"), {
    target: { value: "INCEPTION" },
  });

  const libraryTable = screen.getByRole("table", { name: "Your movies" });
  expect(within(libraryTable).getAllByRole("row")).toHaveLength(2);
  expect(
    within(libraryTable).getByRole("button", { name: "View Inception" }),
  ).toBeInTheDocument();
});

test("the TV library uses TV-specific labels and an inviting empty state", async () => {
  useFetchData.mockReturnValue({
    data: [],
    loading: false,
    error: null,
  });

  renderLibrary("tvShow", "name");

  expect(
    await screen.findByRole("heading", {
      name: "Your TV Shows",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", {
      name: "Your TV show collection starts here",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Discover TV shows" }),
  ).toBeInTheDocument();
});

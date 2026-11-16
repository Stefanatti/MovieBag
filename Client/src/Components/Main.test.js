import "@testing-library/jest-dom";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  useGetPopularMoviesQuery,
  useGetPopularTvShowsQuery,
  useGetTopRatedMoviesQuery,
  useGetTopRatedTvShowsQuery,
} from "../Features/showsSlice";
import Main from "./Main";

jest.mock("../Features/showsSlice", () => ({
  useGetPopularMoviesQuery: jest.fn(),
  useGetPopularTvShowsQuery: jest.fn(),
  useGetTopRatedMoviesQuery: jest.fn(),
  useGetTopRatedTvShowsQuery: jest.fn(),
}));

const make = (prefix, count, extra = {}) =>
  Array.from({ length: count }, (_, i) => ({
    id: `${prefix}${i}`,
    title: `${prefix} title ${i}`,
    poster_path: `/${prefix}${i}.jpg`,
    backdrop_path: `/${prefix}${i}-b.jpg`,
    vote_average: 7.25,
    overview: `${prefix} overview ${i}`,
    year: "2024",
    ...extra,
  }));

const ok = (data) => ({ data, isLoading: false, error: undefined, refetch: jest.fn() });

const mockLists = ({ popularMovies, popularTv, topMovies, topTv }) => {
  useGetPopularMoviesQuery.mockReturnValue(popularMovies);
  useGetPopularTvShowsQuery.mockReturnValue(popularTv);
  useGetTopRatedMoviesQuery.mockReturnValue(topMovies);
  useGetTopRatedTvShowsQuery.mockReturnValue(topTv);
};

const renderMain = (user = {}) =>
  render(
    <MemoryRouter>
      <Main user={user} />
    </MemoryRouter>,
  );

const wall = () => within(document.getElementById("discover"));
const tiles = () => wall().getAllByRole("link");

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
  mockLists({
    popularMovies: ok(make("pm", 15)),
    popularTv: ok(make("pt", 15)),
    topMovies: ok(make("tm", 4)),
    topTv: ok(make("tt", 3)),
  });
});

afterEach(() => {
  const errors = console.error.mock.calls;
  console.error.mockRestore();
  expect(errors).toEqual([]);
});

test("shows an interleaved Discover wall that links to each title", () => {
  renderMain();
  const links = tiles();
  expect(links).toHaveLength(20);
  expect(wall().getByRole("link", { name: /^pm title 0, 2024, Movie, rated 7.3 out of 10$/ }))
    .toHaveAttribute("href", "/movie?id=pm0");
  expect(wall().getByRole("link", { name: /^pt title 0,/ })).toHaveAttribute("href", "/tvShow?id=pt0");
  expect(wall().getByRole("status")).toHaveTextContent("Showing 20 of 30 titles");
});

test("reveals more titles and hides the button when everything is shown", () => {
  renderMain();
  fireEvent.click(screen.getByRole("button", { name: "Show more (10 left)" }));
  expect(tiles()).toHaveLength(30);
  expect(screen.queryByRole("button", { name: /Show more/ })).not.toBeInTheDocument();
});

test("filters by type and switches to top rated", () => {
  renderMain();
  fireEvent.click(screen.getByRole("button", { name: "TV Shows" }));
  expect(tiles().every((link) => link.getAttribute("href").startsWith("/tvShow"))).toBe(true);
  expect(tiles()).toHaveLength(15);

  fireEvent.click(screen.getByRole("button", { name: "Top rated" }));
  expect(tiles().map((link) => link.getAttribute("href"))).toEqual([
    "/tvShow?id=tt0",
    "/tvShow?id=tt1",
    "/tvShow?id=tt2",
  ]);
  expect(screen.getByText("The highest rated of all time")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "All" }));
  expect(tiles()).toHaveLength(7);
});

test("skips titles without a poster", () => {
  mockLists({
    popularMovies: ok([...make("pm", 2), ...make("np", 1, { poster_path: null })]),
    popularTv: ok([]),
    topMovies: ok([]),
    topTv: ok([]),
  });
  renderMain();
  expect(tiles()).toHaveLength(2);
});

test("offers a retry when the lists fail to load", () => {
  const failed = { data: undefined, isLoading: false, error: { status: 500 }, refetch: jest.fn() };
  const working = ok([]);
  mockLists({ popularMovies: failed, popularTv: working, topMovies: failed, topTv: working });
  renderMain();
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  expect(failed.refetch).toHaveBeenCalledTimes(2);
  expect(working.refetch).not.toHaveBeenCalled();
});

test("shows skeletons while loading", () => {
  const loading = { data: undefined, isLoading: true, error: undefined, refetch: jest.fn() };
  mockLists({ popularMovies: loading, popularTv: loading, topMovies: loading, topTv: loading });
  renderMain();
  expect(screen.getByLabelText("Loading titles")).toHaveAttribute("aria-busy", "true");
  expect(screen.queryByRole("region", { name: "Featured titles" })).not.toBeInTheDocument();
});

test("invites guests to sign up", () => {
  renderMain();
  expect(screen.getByRole("link", { name: "Sign up free" })).toHaveAttribute("href", "/signup");
  expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login");
  expect(screen.queryByRole("navigation", { name: "Your library" })).not.toBeInTheDocument();
});

test("gives signed-in users shortcuts to their library", () => {
  renderMain({ _id: "u1", username: "Viewer" });
  expect(screen.getByRole("heading", { name: "Welcome back, Viewer" })).toBeInTheDocument();
  const nav = within(screen.getByRole("navigation", { name: "Your library" }));
  expect(nav.getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual([
    "/yourmovies",
    "/yourTvShows",
    "/watchlist/movies",
    "/myreviews",
  ]);
  expect(screen.queryByRole("link", { name: "Sign up free" })).not.toBeInTheDocument();
});

test("features trending titles in the hero with working controls", () => {
  renderMain();
  const hero = within(screen.getByRole("region", { name: "Featured titles" }));
  expect(hero.getByRole("heading", { name: "pm title 0" })).toBeInTheDocument();
  expect(hero.getByRole("link", { name: "View details" })).toHaveAttribute("href", "/movie?id=pm0");

  fireEvent.click(hero.getByRole("button", { name: "Next title" }));
  expect(hero.getByRole("heading", { name: "pt title 0" })).toBeInTheDocument();
  expect(hero.getByRole("link", { name: "View details" })).toHaveAttribute("href", "/tvShow?id=pt0");

  fireEvent.click(hero.getAllByRole("button", { name: "Show pm title 2" })[0]);
  expect(hero.getByRole("heading", { name: "pm title 2" })).toBeInTheDocument();

  fireEvent.click(hero.getByRole("button", { name: "Previous title" }));
  expect(hero.getByRole("heading", { name: "pt title 1" })).toBeInTheDocument();

  fireEvent.click(hero.getByRole("button", { name: "Pause slideshow" }));
  expect(hero.getByRole("button", { name: "Play slideshow" })).toBeInTheDocument();
});

test("auto-advances when the progress bar finishes", () => {
  renderMain();
  const region = screen.getByRole("region", { name: "Featured titles" });
  fireEvent.animationEnd(screen.getByTestId("hero-progress"));
  expect(within(region).getByRole("heading", { name: "pt title 0" })).toBeInTheDocument();
});

test("hides the hero when no title has a backdrop", () => {
  mockLists({
    popularMovies: ok(make("pm", 3, { backdrop_path: null })),
    popularTv: ok(make("pt", 3, { backdrop_path: null })),
    topMovies: ok([]),
    topTv: ok([]),
  });
  renderMain();
  expect(screen.queryByRole("region", { name: "Featured titles" })).not.toBeInTheDocument();
  expect(tiles()).toHaveLength(6);
});

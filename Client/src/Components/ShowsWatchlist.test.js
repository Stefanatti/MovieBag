import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import api from "../api/axios";
import { userReducer } from "../Features/user";
import ShowsWatchlist from "./ShowsWatchlist";

jest.mock("../api/axios", () => ({ get: jest.fn(), post: jest.fn(), delete: jest.fn() }));

const userId = "507f1f77bcf86cd799439011";
const movie = { _id: "w1", id: "550", title: "Fight Club", year: "1999", type: "movie", director: "David Fincher", poster: "/p.jpg" };
const show = { _id: "w2", id: "1396", name: "Breaking Bad", year: "2008", type: "tv", creator: "Vince Gilligan", poster: "/b.jpg" };

const renderWatchlist = (showType, items) => {
  api.get.mockResolvedValue({ data: items });
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState: { user: { value: { _id: userId, username: "Viewer" }, isAuthenticated: true } },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/watchlist"]}>
        <Routes>
          <Route path="/watchlist" element={<ShowsWatchlist showType={showType} />} />
          <Route path="/yourmovies" element={<p>Your movies page</p>} />
          <Route path="/yourTvShows" element={<p>Your tv shows page</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

const findButton = async (name) => {
  // Let the watchlist fetch and WatchlistCard's lazy ConfirmDialog resolve inside act.
  await act(async () => {
    await import("./ConfirmDialog");
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 0)); });
  return screen.getByRole("button", { name });
};

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  const errors = console.error.mock.calls;
  console.error.mockRestore();
  expect(errors).toEqual([]);
});

test("moves a watched movie to Your Movies and removes it from the watchlist", async () => {
  api.post.mockResolvedValue({ data: { alreadyInLibrary: false } });
  renderWatchlist("movie", [movie]);
  const button = await findButton("Mark Fight Club as watched and add to Your Movies");
  await act(async () => { fireEvent.click(button); });

  expect(api.post).toHaveBeenCalledTimes(1);
  expect(api.post.mock.calls[0][0]).toMatch(/\/watchlist\/movie\/w1\/watched$/);
  expect(screen.queryByText("Fight Club")).not.toBeInTheDocument();
  expect(screen.getByText("Moved to Your Movies.")).toBeInTheDocument();

  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "View" })); });
  expect(screen.getByText("Your movies page")).toBeInTheDocument();
});

test("moves a watched TV show and reports when it was already in the library", async () => {
  api.post.mockResolvedValue({ data: { alreadyInLibrary: true } });
  renderWatchlist("tvShow", [show]);
  const button = await findButton("Mark Breaking Bad as watched and add to Your Tv Shows");
  await act(async () => { fireEvent.click(button); });

  expect(api.post.mock.calls[0][0]).toMatch(/\/watchlist\/tvShow\/w2\/watched$/);
  expect(screen.queryByText("Breaking Bad")).not.toBeInTheDocument();
  expect(screen.getByText("Already in Your Tv Shows, removed from your watchlist.")).toBeInTheDocument();
});

test("ignores double clicks while a move is in progress", async () => {
  let resolve;
  api.post.mockReturnValue(new Promise((r) => { resolve = r; }));
  renderWatchlist("movie", [movie]);
  const button = await findButton(/Mark Fight Club as watched/);
  act(() => {
    fireEvent.click(button);
    fireEvent.click(button);
  });
  expect(api.post).toHaveBeenCalledTimes(1);
  expect(button).toBeDisabled();
  expect(button).toHaveTextContent("Moving...");
  await act(async () => { resolve({ data: { alreadyInLibrary: false } }); });
  expect(screen.queryByText("Fight Club")).not.toBeInTheDocument();
});

test("keeps the title and shows the error when the move fails", async () => {
  api.post.mockRejectedValue({ response: { status: 500, data: { message: "Something went wrong" } } });
  renderWatchlist("movie", [movie]);
  const button = await findButton(/Mark Fight Club as watched/);
  await act(async () => { fireEvent.click(button); });

  expect(screen.getByText("Fight Club")).toBeInTheDocument();
  expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  expect(button).not.toBeDisabled();
});

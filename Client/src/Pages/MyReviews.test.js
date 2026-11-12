import "@testing-library/jest-dom";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import api from "../api/axios";
import { userReducer, login, logout } from "../Features/user";
import MyReviews from "./MyReviews";

jest.mock("../api/axios", () => ({ get: jest.fn(), patch: jest.fn(), delete: jest.fn() }));
jest.mock("react-toastify", () => ({ toast: { success: jest.fn() } }));

const userId = "507f1f77bcf86cd799439011";
const movie = {
  _id: "movie-review",
  author: { _id: userId, username: "Reviewer" },
  tmdbId: "123",
  mediaType: "movie",
  text: "My movie review",
  containsSpoilers: false,
  createdAt: "2026-01-01T10:00:00.000Z",
  updatedAt: "2026-01-01T10:00:00.000Z",
};
const show = { ...movie, _id: "tv-review", mediaType: "tv", text: "My TV review" };
const history = (reviews = [movie, show], total = reviews.length) => ({
  data: { reviews, total, page: 1, totalPages: Math.ceil(total / 5) },
});
const mockHistory = (reviews = [movie, show], total = reviews.length) => {
  api.get.mockImplementation((path) => {
    if (path === "/reviews/mine") return Promise.resolve(history(reviews, total));
    return Promise.resolve({
      data: path.includes("/tv/")
        ? { id: 123, name: "Test show", poster_path: "/show.jpg" }
        : { id: 123, title: "Test movie", poster_path: "/movie.jpg" },
    });
  });
};
const renderPage = (guest = false) => {
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState: {
      user: { value: { _id: guest ? "" : userId, username: "Reviewer" }, isAuthenticated: !guest },
    },
  });
  const result = render(
    <Provider store={store}><MemoryRouter><MyReviews /></MemoryRouter></Provider>,
  );
  return { ...result, store };
};

beforeEach(() => {
  jest.resetAllMocks();
  mockHistory();
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  const errors = console.error.mock.calls;
  console.error.mockRestore();
  expect(errors).toEqual([]);
});

test("lists the user's movie and TV reviews with distinct posters and correct title links", async () => {
  renderPage();
  expect(await screen.findByRole("img", { name: "Test movie poster" })).toHaveAttribute("src", "https://image.tmdb.org/t/p/w185/movie.jpg");
  expect(await screen.findByRole("img", { name: "Test show poster" })).toHaveAttribute("src", "https://image.tmdb.org/t/p/w185/show.jpg");
  expect(screen.getByText(movie.text)).toBeInTheDocument();
  expect(screen.getByText(show.text)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Test movie" })).toHaveAttribute("href", "/movie?id=123");
  expect(screen.getByRole("link", { name: "Test show" })).toHaveAttribute("href", "/tvShow?id=123");
  expect(screen.getAllByRole("link", { name: "View title / manage review" })).toHaveLength(2);
  expect(api.get).toHaveBeenCalledWith("/reviews/mine", expect.objectContaining({ params: { page: 1 } }));
});

test("an empty history offers discovery without requesting title details", async () => {
  mockHistory([]);
  renderPage();
  expect(await screen.findByText("You haven't written any reviews yet.")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /discover movies/i })).toHaveAttribute("href", "/");
  expect(api.get).toHaveBeenCalledTimes(1);
});

test("history loading failures show a retry action", async () => {
  api.get.mockRejectedValue(new Error("offline"));
  renderPage();
  expect(await screen.findByRole("alert")).toHaveTextContent("Unable to load your reviews");
  mockHistory([]);
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  expect(await screen.findByText("You haven't written any reviews yet.")).toBeInTheDocument();
});

test("a missing title keeps the review visible and can be retried", async () => {
  api.get.mockImplementation((path) => path === "/reviews/mine"
    ? Promise.resolve(history([movie]))
    : Promise.reject(new Error("unavailable")));
  renderPage();
  expect(await screen.findByRole("alert")).toHaveTextContent("Your review is still available");
  expect(screen.getByText(movie.text)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Movie #123" })).toHaveAttribute("href", "/movie?id=123");
  mockHistory([movie]);
  fireEvent.click(screen.getByRole("button", { name: "Retry title" }));
  expect(await screen.findByRole("img", { name: "Test movie poster" })).toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("invalid TMDB responses produce an explicit title warning instead of hiding the review", async () => {
  api.get.mockImplementation((path) => Promise.resolve(
    path === "/reviews/mine" ? history([movie]) : { data: { success: false } },
  ));
  renderPage();
  expect(await screen.findByRole("alert")).toHaveTextContent("Title details could not be loaded");
  expect(screen.getByText(movie.text)).toBeInTheDocument();
});

test("missing and broken posters have visible placeholders", async () => {
  api.get.mockImplementation((path) => Promise.resolve(
    path === "/reviews/mine"
      ? history([movie])
      : { data: { id: 123, title: "No image", poster_path: null } },
  ));
  const first = renderPage();
  expect(await screen.findByText("No poster available")).toBeInTheDocument();
  first.unmount();
  mockHistory([movie]);
  renderPage();
  fireEvent.error(await screen.findByRole("img", { name: "Test movie poster" }));
  expect(screen.getByText("Poster could not be loaded")).toBeInTheDocument();
});

test("spoilers reuse the community reveal controls", async () => {
  mockHistory([{ ...movie, containsSpoilers: true }]);
  renderPage();
  const reveal = await screen.findByRole("button", { name: "Show spoilers" });
  await screen.findByRole("img", { name: "Test movie poster" });
  expect(screen.queryByText(movie.text)).not.toBeInTheDocument();
  fireEvent.click(reveal);
  expect(screen.getByText(movie.text)).toBeInTheDocument();
});

test("pagination requests only the selected page of owned reviews", async () => {
  mockHistory([movie], 6);
  renderPage();
  await screen.findByRole("img", { name: "Test movie poster" });
  expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Next" })));
  expect(api.get).toHaveBeenCalledWith("/reviews/mine", expect.objectContaining({ params: { page: 2 } }));
  expect(await screen.findByText("Page 2 of 2")).toBeInTheDocument();
  await screen.findByRole("img", { name: "Test movie poster" });
  expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Previous" })));
  await screen.findByRole("img", { name: "Test movie poster" });
  expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
});

test("an out-of-range history page returns to the last available page", async () => {
  mockHistory([movie], 6);
  renderPage();
  await screen.findByRole("img", { name: "Test movie poster" });
  mockHistory([movie], 1);
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Next" })));
  await screen.findByRole("img", { name: "Test movie poster" });
  expect(screen.queryByText(/page 2 of/i)).not.toBeInTheDocument();
  expect(api.get).toHaveBeenCalledWith("/reviews/mine", expect.objectContaining({ params: { page: 1 } }));
});

test("guests do not fetch history and logout clears private reviews", async () => {
  const { store } = renderPage(true);
  expect(screen.getByRole("link", { name: "Log in to see your reviews" })).toBeInTheDocument();
  expect(api.get).not.toHaveBeenCalled();
  await act(async () => store.dispatch(login({ _id: userId, username: "Reviewer" })));
  await screen.findByRole("img", { name: "Test movie poster" });
  await screen.findByRole("img", { name: "Test show poster" });
  act(() => store.dispatch(logout()));
  await waitFor(() => expect(screen.queryByText(movie.text)).not.toBeInTheDocument());
  expect(screen.getByRole("link", { name: "Log in to see your reviews" })).toBeInTheDocument();
});

test("history labels public and private reviews and exposes editing on every card", async () => {
  mockHistory([movie, { ...show, isPrivate: true }]);
  renderPage();
  await screen.findByRole("img", { name: "Test show poster" });
  await screen.findByRole("img", { name: "Test movie poster" });
  expect(screen.getByText("Public")).toBeInTheDocument();
  expect(screen.getByText("Private")).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: "Edit your review" })).toHaveLength(2);
  expect(screen.getByRole("button", { name: "Publish review" })).toBeEnabled();
  expect(screen.getByRole("button", { name: "Make private" })).toBeEnabled();
});

test("history edits text, spoilers and visibility inline without navigating or reloading title metadata", async () => {
  mockHistory([movie]);
  renderPage();
  await screen.findByRole("img", { name: "Test movie poster" });
  fireEvent.click(screen.getByRole("button", { name: "Edit your review" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Edit your review" }), { target: { value: "Edited from history" } });
  fireEvent.click(screen.getByRole("checkbox", { name: "Contains spoilers" }));
  fireEvent.click(screen.getByRole("checkbox", { name: "Private review (only you can see it)" }));
  const updated = { ...movie, text: "Edited from history", containsSpoilers: true, isPrivate: true, updatedAt: "2026-02-01T10:00:00.000Z" };
  api.patch.mockResolvedValue({ data: { review: updated, message: "Review updated." } });
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Save changes" })));
  expect(api.patch).toHaveBeenCalledWith("/reviews/movie-review", {
    text: "Edited from history", containsSpoilers: true, isPrivate: true,
  });
  expect(screen.getByText("Private")).toBeInTheDocument();
  expect(screen.queryByText("Edited from history")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Show spoilers" }));
  expect(screen.getByText("Edited from history")).toBeInTheDocument();
  expect(api.get.mock.calls.filter(([path]) => path === "/api/id/123")).toHaveLength(1);
});

test("private history reviews can be published and public reviews made private without changing text", async () => {
  const privateReview = { ...movie, isPrivate: true };
  mockHistory([privateReview]);
  renderPage();
  await screen.findByRole("img", { name: "Test movie poster" });
  api.patch.mockResolvedValueOnce({ data: { review: { ...movie, isPrivate: false }, message: "Review updated." } });
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Publish review" })));
  expect(api.patch).toHaveBeenLastCalledWith("/reviews/movie-review", { isPrivate: false });
  expect(screen.getByText("Public")).toBeInTheDocument();
  expect(screen.getByText(movie.text)).toBeInTheDocument();
  api.patch.mockResolvedValueOnce({ data: { review: privateReview, message: "Review updated." } });
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Make private" })));
  expect(api.patch).toHaveBeenLastCalledWith("/reviews/movie-review", { isPrivate: true });
  expect(screen.getByText("Private")).toBeInTheDocument();
  expect(screen.getByText(movie.text)).toBeInTheDocument();
});

test("failed visibility changes keep the previous status and show an explicit error", async () => {
  mockHistory([{ ...movie, isPrivate: true }]);
  api.patch.mockRejectedValue(new Error("offline"));
  renderPage();
  await screen.findByRole("img", { name: "Test movie poster" });
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Publish review" })));
  expect(screen.getByRole("alert")).toHaveTextContent("Unable to save your review");
  expect(screen.getByText("Private")).toBeInTheDocument();
  expect(screen.queryByText("Public")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Publish review" })).toBeEnabled();
});

test("history preserves the editor draft and privacy setting when a save fails", async () => {
  mockHistory([{ ...movie, isPrivate: true }]);
  api.patch.mockRejectedValue(new Error("offline"));
  renderPage();
  await screen.findByRole("img", { name: "Test movie poster" });
  fireEvent.click(screen.getByRole("button", { name: "Edit your review" }));
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Unsaved history draft" } });
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Save changes" })));
  expect(screen.getByRole("textbox")).toHaveValue("Unsaved history draft");
  expect(screen.getByRole("checkbox", { name: "Private review (only you can see it)" })).toBeChecked();
  expect(screen.getByRole("alert")).toHaveTextContent("Unable to save your review");
});

test("history deletes only the selected card after confirmation and refreshes the total", async () => {
  mockHistory([movie]);
  renderPage();
  await screen.findByRole("img", { name: "Test movie poster" });
  fireEvent.click(screen.getByRole("button", { name: "Delete your review" }));
  expect(api.delete).not.toHaveBeenCalled();
  api.delete.mockResolvedValue({ data: { message: "Review deleted." } });
  mockHistory([]);
  await act(async () => fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Delete review" })));
  expect(api.delete).toHaveBeenCalledWith("/reviews/movie-review");
  expect(await screen.findByText("You haven't written any reviews yet.")).toBeInTheDocument();
});

test("visibility requests cannot be double-submitted and block pagination until complete", async () => {
  mockHistory([movie], 6);
  let resolveSave;
  api.patch.mockImplementation(() => new Promise((resolve) => { resolveSave = resolve; }));
  renderPage();
  await screen.findByRole("img", { name: "Test movie poster" });
  fireEvent.click(screen.getByRole("button", { name: "Make private" }));
  expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Edit your review" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Make private" }));
  expect(api.patch).toHaveBeenCalledTimes(1);
  await act(async () => resolveSave({ data: { review: { ...movie, isPrivate: true }, message: "Review updated." } }));
  expect(screen.getByText("Private")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
});

import "@testing-library/jest-dom";
import { act, fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { userReducer, logout } from "../Features/user";
import api from "../api/axios";
import ReviewSection from "./ReviewSection";

jest.mock("../api/axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));
jest.mock("react-toastify", () => ({ toast: { success: jest.fn() } }));

const userId = "507f1f77bcf86cd799439011";
const otherId = "507f1f77bcf86cd799439012";
const review = {
  _id: "507f1f77bcf86cd799439013",
  author: { _id: otherId, username: "Film fan" },
  tmdbId: "123",
  mediaType: "movie",
  text: "A memorable film.",
  containsSpoilers: false,
  createdAt: "2026-01-01T10:00:00.000Z",
  updatedAt: "2026-01-01T10:00:00.000Z",
};

const page = (reviews = [], total = reviews.length, totalPages = Math.ceil(total / 5)) => ({
  data: { reviews, total, totalPages, page: 1 },
});

const mockReviews = (reviews = [], ownReview = null, total = reviews.length) => {
  api.get.mockImplementation((path) => Promise.resolve(
    path.includes("/mine/") ? { data: { review: ownReview } } : page(reviews, total),
  ));
};

const renderReviews = ({ guest = false, ...props } = {}) => {
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState: {
      user: {
        value: { _id: guest ? "" : userId, username: guest ? "" : "Me" },
        isAuthenticated: !guest,
      },
    },
  });
  const view = (overrides = {}) => (
    <Provider store={store}>
      <MemoryRouter>
        <ReviewSection tmdbId="123" mediaType="movie" {...props} {...overrides} />
      </MemoryRouter>
    </Provider>
  );
  const result = render(view());
  return { ...result, store, changeTitle: (overrides) => result.rerender(view(overrides)) };
};

beforeEach(() => {
  jest.resetAllMocks();
  mockReviews();
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  const errors = console.error.mock.calls;
  console.error.mockRestore();
  expect(errors).toEqual([]);
});

test("guests can read public reviews and are linked to login without fetching private data", async () => {
  mockReviews([review]);
  renderReviews({ guest: true });
  expect(await screen.findByText(review.text)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /log in to write a review/i })).toHaveAttribute("href", "/login");
  expect(api.get).toHaveBeenCalledTimes(1);
  expect(api.get).toHaveBeenCalledWith("/reviews/movie/123", expect.objectContaining({ params: { page: 1 } }));
  expect(screen.queryByRole("button", { name: /edit your review/i })).not.toBeInTheDocument();
});

test("empty titles invite a first review", async () => {
  renderReviews();
  expect(await screen.findByText(/no reviews yet/i)).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Community reviews (0)" })).toBeInTheDocument();
});

test("spoiler text stays out of the DOM until revealed and can be hidden again", async () => {
  mockReviews([{ ...review, containsSpoilers: true }]);
  renderReviews({ guest: true });
  const reveal = await screen.findByRole("button", { name: "Show spoilers" });
  expect(screen.queryByText(review.text)).not.toBeInTheDocument();
  fireEvent.click(reveal);
  expect(screen.getByText(review.text)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Hide spoilers" }));
  expect(screen.queryByText(review.text)).not.toBeInTheDocument();
});

test("reviews are rendered as text rather than HTML", async () => {
  const text = '<img src="x" onerror="alert(1)">';
  mockReviews([{ ...review, text }]);
  const { container } = renderReviews({ guest: true });
  expect(await screen.findByText(text)).toBeInTheDocument();
  expect(container.querySelector("img")).toBeNull();
});

test("deleted authors remain readable", async () => {
  mockReviews([{ ...review, author: null }]);
  renderReviews({ guest: true });
  expect(await screen.findByText("Deleted user")).toBeInTheDocument();
});

test("logged-in users publish trimmed text and a spoiler flag without sending an author", async () => {
  renderReviews({ mediaType: "tv" });
  await waitFor(() => expect(screen.getByRole("button", { name: "Write a review" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Write a review" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Your review" }), { target: { value: "  Excellent show!  " } });
  fireEvent.click(screen.getByRole("checkbox", { name: "Contains spoilers" }));
  const ownReview = { ...review, mediaType: "tv", text: "Excellent show!", author: { _id: userId, username: "Me" } };
  api.post.mockResolvedValue({ data: { review: ownReview, message: "Review published." } });
  mockReviews([ownReview], ownReview);
  fireEvent.click(screen.getByRole("button", { name: "Publish review" }));
  await waitFor(() => expect(api.post).toHaveBeenCalledWith("/reviews/tv/123", { text: "Excellent show!", containsSpoilers: true }));
  expect(await screen.findByRole("button", { name: "Edit your review" })).toBeInTheDocument();
  await waitFor(() => expect(screen.getByRole("button", { name: "Edit your review" })).toBeEnabled());
  expect(toast.success).toHaveBeenCalledWith("Review published.");
});

test("blank and overlong reviews are rejected while the 2,000-character boundary is accepted", async () => {
  renderReviews();
  await waitFor(() => expect(screen.getByRole("button", { name: "Write a review" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Write a review" }));
  const input = screen.getByRole("textbox", { name: "Your review" });
  expect(input).toHaveAttribute("maxlength", "2000");
  for (const text of [" \n ", "x".repeat(2001)]) {
    fireEvent.change(input, { target: { value: text } });
    fireEvent.click(screen.getByRole("button", { name: "Publish review" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("1 to 2,000");
    expect(api.post).not.toHaveBeenCalled();
  }
  const ownReview = { ...review, author: { _id: userId, username: "Me" } };
  api.post.mockResolvedValue({ data: { review: ownReview, message: "Review published." } });
  mockReviews([ownReview], ownReview);
  fireEvent.change(input, { target: { value: "x".repeat(2000) } });
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Publish review" }));
  });
  await waitFor(() => expect(api.post).toHaveBeenCalledWith("/reviews/movie/123", {
    text: "x".repeat(2000), containsSpoilers: false,
  }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Edit your review" })).toBeEnabled());
});

test("failed saves display the server error and retain the draft", async () => {
  api.post.mockRejectedValue({ response: { status: 500, data: { message: "Could not save." } } });
  renderReviews();
  await waitFor(() => expect(screen.getByRole("button", { name: "Write a review" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Write a review" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Your review" }), { target: { value: "Keep my draft" } });
  fireEvent.click(screen.getByRole("button", { name: "Publish review" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Could not save.");
  expect(screen.getByRole("textbox")).toHaveValue("Keep my draft");
  expect(toast.success).not.toHaveBeenCalled();
});

test("own reviews can be edited even when they are not on the visible page", async () => {
  const ownReview = { ...review, author: { _id: userId, username: "Me" }, text: "Original review" };
  mockReviews([review], ownReview, 6);
  renderReviews();
  await waitFor(() => expect(screen.getByRole("button", { name: "Edit your review" })).toBeEnabled());
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
  });
  await waitFor(() => expect(api.get).toHaveBeenCalledWith("/reviews/movie/123", expect.objectContaining({ params: { page: 2 } })));
  await waitFor(() => expect(screen.getByRole("button", { name: "Edit your review" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Edit your review" }));
  expect(screen.getByRole("textbox")).toHaveValue("Original review");
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Updated review" } });
  api.patch.mockResolvedValue({ data: { review: { ...ownReview, text: "Updated review" }, message: "Review updated." } });
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  });
  await waitFor(() => expect(api.patch).toHaveBeenCalledWith(`/reviews/${review._id}`, {
    text: "Updated review", containsSpoilers: false,
  }));
  expect(api.post).not.toHaveBeenCalled();
  await waitFor(() => expect(screen.getByText("Page 1 of 2")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByRole("button", { name: "Edit your review" })).toBeEnabled());
});

test("delete requires confirmation and refreshes the title after success", async () => {
  const ownReview = { ...review, author: { _id: userId, username: "Me" } };
  mockReviews([ownReview], ownReview);
  renderReviews();
  await waitFor(() => expect(screen.getByRole("button", { name: "Delete your review" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Delete your review" }));
  const dialog = screen.getByRole("dialog", { name: "Delete your review?" });
  expect(api.delete).not.toHaveBeenCalled();
  fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
  await waitForElementToBeRemoved(dialog);
  expect(api.delete).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Delete your review" }));
  api.delete.mockResolvedValue({ data: { message: "Review deleted." } });
  mockReviews();
  fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Delete review" }));
  await waitFor(() => expect(api.delete).toHaveBeenCalledWith(`/reviews/${review._id}`));
  expect(await screen.findByText(/no reviews yet/i)).toBeInTheDocument();
  expect(toast.success).toHaveBeenCalledWith("Review deleted.");
});

test("failed deletes keep the existing review and show an explicit error", async () => {
  const ownReview = { ...review, author: { _id: userId, username: "Me" } };
  mockReviews([ownReview], ownReview);
  api.delete.mockRejectedValue(new Error("offline"));
  renderReviews();
  await waitFor(() => expect(screen.getByRole("button", { name: "Delete your review" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Delete your review" }));
  fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Delete review" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Unable to delete your review");
  expect(screen.getByText(review.text)).toBeInTheDocument();
});

test("load failures offer retry and prevent creating an accidental duplicate", async () => {
  api.get.mockRejectedValue(new Error("offline"));
  renderReviews();
  expect(await screen.findByRole("alert")).toHaveTextContent("Unable to load reviews");
  expect(screen.getByRole("button", { name: "Write a review" })).toBeDisabled();
  mockReviews([review]);
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  expect(await screen.findByText(review.text)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Write a review" })).toBeEnabled();
});

test("pagination uses bounded previous and next controls", async () => {
  mockReviews([review], null, 6);
  renderReviews({ guest: true });
  await screen.findByText("Page 1 of 2");
  expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  await screen.findByText("Page 2 of 2");
  expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  expect(api.get).toHaveBeenLastCalledWith("/reviews/movie/123", expect.objectContaining({ params: { page: 2 } }));
  fireEvent.click(screen.getByRole("button", { name: "Previous" }));
  await screen.findByText("Page 1 of 2");
});

test("pagination recovers when the last page disappears after another user's deletion", async () => {
  mockReviews([review], null, 6);
  renderReviews({ guest: true });
  await screen.findByText("Page 1 of 2");
  api.get.mockImplementation((path, options) => Promise.resolve(
    options.params.page === 2 ? page([], 5, 1) : page([review], 5, 1),
  ));
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  await waitFor(() => expect(api.get).toHaveBeenLastCalledWith("/reviews/movie/123", expect.objectContaining({ params: { page: 1 } })));
  expect(await screen.findByText(review.text)).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
});

test("changing titles clears drafts and requests the correct media type", async () => {
  const { changeTitle } = renderReviews();
  await waitFor(() => expect(screen.getByRole("button", { name: "Write a review" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Write a review" }));
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Movie-only draft" } });
  await act(async () => {
    changeTitle({ tmdbId: "456", mediaType: "tv" });
  });
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  await waitFor(() => expect(api.get).toHaveBeenCalledWith("/reviews/tv/456", expect.any(Object)));
  await waitFor(() => expect(screen.getByRole("button", { name: "Write a review" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Write a review" }));
  expect(screen.getByRole("textbox")).toHaveValue("");
});

test("logging out clears the private form", async () => {
  const { store } = renderReviews();
  await waitFor(() => expect(screen.getByRole("button", { name: "Write a review" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Write a review" }));
  act(() => store.dispatch(logout()));
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: /log in to write a review/i })).toBeInTheDocument();
  await screen.findByText(/no reviews yet/i);
});

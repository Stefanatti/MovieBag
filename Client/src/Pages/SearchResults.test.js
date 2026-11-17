import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import api from "../api/axios";
import SearchResults from "./SearchResults";

jest.mock("../api/axios", () => ({ get: jest.fn() }));
jest.mock("../Components/MoviesResultCards", () => ({ movies }) => (
  <div>
    {movies.map((movie) => (
      <span key={movie.id}>{movie.title}</span>
    ))}
  </div>
));

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

test("search errors are visible and can be retried", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  api.get
    .mockRejectedValueOnce(new Error("Network unavailable"))
    .mockResolvedValueOnce({
      data: [{ id: 1, title: "Dune" }],
    });

  render(
    <MemoryRouter
      initialEntries={["/movieSearch?title=Dune%3F+%23Part+2+%26+3"]}
    >
      <SearchResults />
    </MemoryRouter>,
  );

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Search failed. Check your connection and try again.",
  );
  expect(api.get.mock.calls[0][0]).toContain(
    "/api/Dune%3F%20%23Part%202%20%26%203",
  );

  fireEvent.click(screen.getByRole("button", { name: "Retry" }));

  expect(await screen.findByText("Dune")).toBeInTheDocument();
  await waitFor(() => expect(api.get).toHaveBeenCalledTimes(2));
});

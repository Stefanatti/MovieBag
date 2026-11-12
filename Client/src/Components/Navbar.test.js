import "@testing-library/jest-dom";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter, useLocation } from "react-router-dom";
import { userReducer } from "../Features/user";
import Navbar from "./Navbar";

jest.mock("./ThemeSwitcher", () => () => null);
jest.mock("./LogoutModal", () => () => null);
jest.mock("./HaveToSignupModal", () => ({ open }) =>
  open ? <div role="dialog" aria-label="Account required" /> : null,
);

const CurrentPath = () => <div data-testid="current-path">{useLocation().pathname}</div>;

const renderNavbar = async (guest = false) => {
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState: {
      user: {
        value: { _id: guest ? "" : "test-user", username: "Reviewer" },
        isAuthenticated: !guest,
      },
    },
  });
  await act(async () => {
    render(
      <Provider store={store}>
        <MemoryRouter><Navbar /><CurrentPath /></MemoryRouter>
      </Provider>,
    );
  });
};

test("the desktop navigation opens My Reviews for logged-in users", async () => {
  await renderNavbar();
  fireEvent.click(screen.getByRole("button", { name: "My Reviews" }));
  expect(screen.getByTestId("current-path")).toHaveTextContent("/myreviews");
});

test("the mobile drawer includes My Reviews and navigates to the same page", async () => {
  await renderNavbar();
  fireEvent.click(screen.getByRole("button", { name: "open drawer" }));
  const drawer = screen.getByRole("presentation");
  fireEvent.click(within(drawer).getByRole("button", { name: "My Reviews" }));
  expect(screen.getByTestId("current-path")).toHaveTextContent("/myreviews");
});

test("guests get the existing account-required prompt instead of private history", async () => {
  await renderNavbar(true);
  fireEvent.click(screen.getByRole("button", { name: "My Reviews" }));
  expect(await screen.findByRole("dialog", { name: "Account required" })).toBeInTheDocument();
  expect(screen.getByTestId("current-path")).toHaveTextContent("/");
});

import "@testing-library/jest-dom";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { TextEncoder } from "util";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import axios from "axios";
import { login, userReducer } from "../../Features/user";
import ForgotPassword from "./ForgotPassword";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import SessionRoutes from "./SessionRoutes";
import Signup from "./Signup";
import LogoutModal from "../../Components/LogoutModal";

jest.mock("axios", () => ({ post: jest.fn() }));

const user = { _id: "viewer-id", username: "Viewer" };
const password = "A much longer password";

beforeEach(() => {
  jest.resetAllMocks();
  global.TextEncoder = TextEncoder;
});

function Destination() {
  const { pathname, search, hash } = useLocation();
  return <h1>{pathname}{search}{hash}</h1>;
}

function renderFlow(entry, { session = "ready", retry, authenticated = false } = {}) {
  const store = configureStore({ reducer: { user: userReducer } });
  if (authenticated) store.dispatch(login(user));
  const tree = (status) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route element={<SessionRoutes session={status} retry={retry} privateOnly />}>
            <Route path="/myreviews" element={<Destination />} />
          </Route>
          <Route path="/" element={<Destination />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/reset_password/:token?" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
  const view = render(tree(session));
  return { store, showSession: (status) => view.rerender(tree(status)) };
}

const enter = (label, value) =>
  fireEvent.change(screen.getByLabelText(new RegExp(`^${label}(?:\\s*\\*)?$`, "i")), { target: { value } });
const submit = (name) => fireEvent.click(screen.getByRole("button", { name }));

test("a protected deep link waits for verification before opening for a signed-in user", () => {
  const flow = renderFlow("/myreviews?scope=private#latest", { session: "checking", authenticated: true });
  expect(screen.getByRole("status")).toHaveTextContent("Checking your session");
  expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  flow.showSession("ready");
  expect(screen.getByRole("heading")).toHaveTextContent("/myreviews?scope=private#latest");
});

test("a verification outage on a protected route offers a retry without redirecting", () => {
  const retry = jest.fn();
  renderFlow("/myreviews", { session: "unavailable", retry });
  expect(screen.getByRole("alert")).toHaveTextContent("Could not check your session");
  submit("Try again");
  expect(retry).toHaveBeenCalledTimes(1);
});

test("creates an account and returns to the original protected destination after login", async () => {
  axios.post.mockResolvedValueOnce({ data: {} }).mockResolvedValueOnce({ data: { user } });
  const { store } = renderFlow("/myreviews?scope=private#latest");
  fireEvent.click(screen.getByRole("link", { name: "Create an account" }));
  enter("Username", " Viewer ");
  enter("Email", "viewer@example.com");
  enter("Password", "four");
  submit("Create account");
  expect(await screen.findByText(/at least 5 characters and no more/)).toBeInTheDocument();
  expect(axios.post).not.toHaveBeenCalled();

  enter("Password", "abcde");
  submit("Create account");
  expect(await screen.findByRole("alert")).toHaveTextContent("Account created");
  expect(screen.getByLabelText(/^Username/)).toHaveValue("Viewer");
  expect(screen.getByLabelText(/^Password/)).toHaveValue("");
  expect(axios.post.mock.calls[0][1]).toEqual({ username: "Viewer", email: "viewer@example.com", password: "abcde" });

  enter("Password", "old");
  submit("Log in");
  expect(await screen.findByRole("heading", { name: "/myreviews?scope=private#latest" })).toBeInTheDocument();
  expect(store.getState().user.isAuthenticated).toBe(true);
});

test("login prevents a repeat submit while pending and shows rate-limit errors inline", async () => {
  let reject;
  axios.post.mockImplementation(() => new Promise((resolve, fail) => { reject = fail; }));
  renderFlow("/login");
  enter("Username", "Viewer");
  enter("Password", "old");
  submit("Log in");
  const pending = await screen.findByRole("button", { name: "Logging in..." });
  expect(pending).toBeDisabled();
  await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  fireEvent.click(pending);
  expect(axios.post).toHaveBeenCalledTimes(1);
  await act(async () => {
    reject({ response: { status: 429, data: { message: "Too many attempts. Please try again later." } } });
  });
  expect(await screen.findByRole("alert")).toHaveTextContent("Too many attempts");
  expect(screen.getByRole("button", { name: "Log in" })).toBeEnabled();
});

test("sign-up highlights a registered email and preserves the entered values", async () => {
  const message = "This email is already registered. Log in or reset your password.";
  axios.post.mockRejectedValue({
    response: { status: 409, data: { message, fieldErrors: { email: message } } },
  });
  renderFlow("/signup");
  enter("Username", "Viewer");
  enter("Email", "viewer@example.com");
  enter("Password", "abcde");
  submit("Create account");
  expect(await screen.findByRole("alert")).toHaveTextContent(message);
  const email = screen.getByLabelText(/^Email/);
  expect(email).toHaveAttribute("aria-invalid", "true");
  expect(email).toHaveAccessibleDescription(message);
  expect(email).toHaveValue("viewer@example.com");
  expect(screen.getByLabelText(/^Username/)).toHaveValue("Viewer");
});

test.each([
  [{ request: {} }, "Could not reach MovieBag. Check your connection and try again."],
  [{ code: "ECONNABORTED" }, "The request timed out. Please try again."],
])("login explains a connection failure %#", async (error, message) => {
  axios.post.mockRejectedValue(error);
  renderFlow("/login");
  enter("Username", "Viewer");
  enter("Password", "old");
  submit("Log in");
  expect(await screen.findByRole("alert")).toHaveTextContent(message);
});

test("preserves the intended page while requesting a reset link", async () => {
  axios.post.mockResolvedValueOnce({ data: {} }).mockResolvedValueOnce({ data: { user } });
  renderFlow("/myreviews");
  fireEvent.click(screen.getByRole("link", { name: "Forgot your password?" }));
  enter("Email", "viewer@example.com");
  submit("Send reset link");
  expect(await screen.findByRole("status")).toHaveTextContent("If an account exists");
  fireEvent.click(screen.getByRole("link", { name: "Back to log in" }));
  enter("Username", "Viewer");
  enter("Password", "old");
  submit("Log in");
  expect(await screen.findByRole("heading", { name: "/myreviews" })).toBeInTheDocument();
});

test("password reset validates confirmation, clears local identity and returns to login", async () => {
  axios.post.mockResolvedValue({ data: {} });
  const { store } = renderFlow("/reset_password/example-token", { authenticated: true });
  expect(screen.getByLabelText(/^New password/)).toHaveAttribute("type", "password");
  fireEvent.click(screen.getByRole("button", { name: "Show new password" }));
  expect(screen.getByLabelText(/^New password/)).toHaveAttribute("type", "text");
  enter("New password", password);
  enter("Confirm new password", "different");
  submit("Reset password");
  expect(await screen.findByText("Passwords do not match")).toBeInTheDocument();
  expect(axios.post).not.toHaveBeenCalled();

  enter("Confirm new password", password);
  submit("Reset password");
  expect(await screen.findByRole("alert")).toHaveTextContent("Password updated");
  expect(axios.post.mock.calls[0][1]).toEqual({ newPassword: password });
  expect(store.getState().user.isAuthenticated).toBe(false);
});

test("an expired reset link offers a fresh request", async () => {
  axios.post.mockRejectedValue({
    response: { status: 400, data: { message: "This password reset link is invalid or expired." } },
  });
  renderFlow("/reset_password/example-token");
  enter("New password", password);
  enter("Confirm new password", password);
  submit("Reset password");
  expect(await screen.findByRole("link", { name: "Request a new reset link" })).toHaveAttribute("href", "/forgot_password");
});

test.each(["//external.invalid", "/a/..//external.invalid"])("unsafe destination %s is ignored after login", async (returnTo) => {
  axios.post.mockResolvedValue({ data: { user } });
  renderFlow({ pathname: "/login", state: { returnTo } });
  enter("Username", "Viewer");
  enter("Password", "old");
  submit("Log in");
  await waitFor(() => expect(screen.getByRole("heading", { name: "/" })).toBeInTheDocument());
});

test("logout keeps the session if the request fails and clears it on a successful retry", async () => {
  const store = configureStore({ reducer: { user: userReducer } });
  store.dispatch(login(user));
  const onClose = jest.fn();
  axios.post.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce({ data: {} });
  render(<Provider store={store}><LogoutModal open onClose={onClose} /></Provider>);

  submit("Log Out");
  expect(await screen.findByRole("alert")).toHaveTextContent("Could not log out");
  expect(store.getState().user.isAuthenticated).toBe(true);
  expect(onClose).not.toHaveBeenCalled();

  submit("Log Out");
  await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  expect(store.getState().user.isAuthenticated).toBe(false);
});

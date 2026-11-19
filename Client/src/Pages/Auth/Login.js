import { Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../../Features/user";
import { authErrorMessage, loginAccount } from "../../api/auth";
import { userLogInSchema } from "../../Validations/UserValidation";
import { AuthField, AuthForm, AuthLayout, AuthLink, AuthSubmit } from "./AuthLayout";
import PasswordField from "./PasswordField";
import { safeReturnTo } from "./returnTo";
import useAuthForm from "./useAuthForm";

export default function Login() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const returnTo = safeReturnTo(state?.returnTo);
  const form = useAuthForm(userLogInSchema, { username: state?.username || "", password: "" });

  const submit = async (values) => {
    try {
      const { data } = await loginAccount(values);
      if (!data?.user?._id) throw new Error("Missing session user");
      dispatch(login(data.user));
      navigate(returnTo, { replace: true });
    } catch (error) {
      form.setError(
        authErrorMessage(error, "Could not log in. Please try again."),
        error.response?.data?.fieldErrors,
      );
    }
  };

  return (
    <AuthLayout title="Log in" description="Pick up where you left off with your watchlist and reviews.">
      {state?.notice && <Alert severity="success">{state.notice}</Alert>}
      <AuthForm busy={form.busy} error={form.error} onSubmit={form.submit(submit)}>
        <AuthField label="Username" autoComplete="username" {...form.field("username")} />
        <PasswordField label="Password" autoComplete="current-password" {...form.field("password")} />
        <AuthLink to="/forgot_password" state={{ returnTo }}>Forgot your password?</AuthLink>
        <AuthSubmit busy={form.busy} label="Log in" pendingLabel="Logging in..." />
      </AuthForm>
      <AuthLink to="/signup" state={{ returnTo }}>Create an account</AuthLink>
    </AuthLayout>
  );
}

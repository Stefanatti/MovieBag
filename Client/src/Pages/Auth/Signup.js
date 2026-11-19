import { useLocation, useNavigate } from "react-router-dom";
import { authErrorMessage, createAccount } from "../../api/auth";
import { signupPasswordMinimum, signupSchema } from "../../Validations/UserValidation";
import { AuthField, AuthForm, AuthLayout, AuthLink, AuthSubmit } from "./AuthLayout";
import PasswordField from "./PasswordField";
import { safeReturnTo } from "./returnTo";
import useAuthForm from "./useAuthForm";

export default function Signup() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const returnTo = safeReturnTo(state?.returnTo);
  const form = useAuthForm(signupSchema);

  const submit = async (values) => {
    try {
      await createAccount(values);
      navigate("/login", {
        replace: true,
        state: { username: values.username, returnTo, notice: "Account created. Log in to get started." },
      });
    } catch (error) {
      form.setError(
        authErrorMessage(error, "Could not create an account. Please try again."),
        error.response?.data?.fieldErrors,
      );
    }
  };

  return (
    <AuthLayout variant="signup" title="Create account" description="Save what you want to watch and keep track of what you thought.">
      <AuthForm busy={form.busy} error={form.error} onSubmit={form.submit(submit)}>
        <AuthField label="Username" autoComplete="username" {...form.field("username")} />
        <AuthField label="Email" type="email" autoComplete="email" {...form.field("email")} />
        <PasswordField label="Password" autoComplete="new-password" hint={`Use at least ${signupPasswordMinimum} characters. A longer passphrase is safer.`} {...form.field("password")} />
        <AuthSubmit busy={form.busy} label="Create account" pendingLabel="Creating account..." />
      </AuthForm>
      <AuthLink to="/login" state={{ returnTo }}>Already have an account? Log in</AuthLink>
    </AuthLayout>
  );
}

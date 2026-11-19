import { useState } from "react";
import { Alert } from "@mui/material";
import { useLocation } from "react-router-dom";
import { authErrorMessage, requestPasswordReset } from "../../api/auth";
import { recoverySchema } from "../../Validations/UserValidation";
import { AuthField, AuthForm, AuthLayout, AuthLink, AuthSubmit } from "./AuthLayout";
import { safeReturnTo } from "./returnTo";
import useAuthForm from "./useAuthForm";

export default function ForgotPassword() {
  const { state } = useLocation();
  const returnTo = safeReturnTo(state?.returnTo);
  const [sent, setSent] = useState(false);
  const form = useAuthForm(recoverySchema);

  const submit = async (values) => {
    try {
      await requestPasswordReset(values);
      setSent(true);
    } catch (error) {
      form.setError(authErrorMessage(error, "Could not request a reset link. Please try again."));
    }
  };

  return (
    <AuthLayout variant="recovery" title="Forgot password?" description="Enter the email address you used to create your account.">
      {sent ? (
        <Alert severity="success" role="status">
          If an account exists for that email, we'll send a reset link. Check your inbox and spam folder.
        </Alert>
      ) : (
        <AuthForm busy={form.busy} error={form.error} onSubmit={form.submit(submit)}>
          <AuthField label="Email" type="email" autoComplete="email" {...form.field("email")} />
          <AuthSubmit busy={form.busy} label="Send reset link" pendingLabel="Requesting link..." />
        </AuthForm>
      )}
      <AuthLink to="/login" state={{ returnTo }}>Back to log in</AuthLink>
    </AuthLayout>
  );
}

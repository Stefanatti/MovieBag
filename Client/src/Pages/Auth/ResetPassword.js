import { useState } from "react";
import { Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { authErrorMessage, resetAccountPassword } from "../../api/auth";
import { logout } from "../../Features/user";
import { resetPasswordSchema } from "../../Validations/UserValidation";
import { AuthForm, AuthLayout, AuthLink, AuthSubmit } from "./AuthLayout";
import PasswordField from "./PasswordField";
import useAuthForm from "./useAuthForm";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [invalidLink, setInvalidLink] = useState(!token);
  const form = useAuthForm(resetPasswordSchema);

  const submit = async ({ newPassword }) => {
    try {
      await resetAccountPassword(token, { newPassword });
      dispatch(logout());
      navigate("/login", {
        replace: true,
        state: { notice: "Password updated. Log in with your new password." },
      });
    } catch (error) {
      const message = authErrorMessage(error, "Could not reset your password. Please try again.");
      if (error.response?.status === 400 && /invalid or expired/i.test(message)) setInvalidLink(true);
      else form.setError(message);
    }
  };

  return (
    <AuthLayout variant="recovery" title="Reset password" description="Choose a new password for your MovieBag account.">
      {invalidLink ? (
        <Alert severity="warning">This password reset link is invalid or expired.</Alert>
      ) : (
        <AuthForm busy={form.busy} error={form.error} onSubmit={form.submit(submit)}>
          <PasswordField label="New password" autoComplete="new-password" hint="Use at least 15 characters." {...form.field("newPassword")} />
          <PasswordField label="Confirm new password" autoComplete="new-password" {...form.field("confirmNewPassword")} />
          <AuthSubmit busy={form.busy} label="Reset password" pendingLabel="Updating password..." />
        </AuthForm>
      )}
      <AuthLink to={invalidLink ? "/forgot_password" : "/login"}>
        {invalidLink ? "Request a new reset link" : "Back to log in"}
      </AuthLink>
    </AuthLayout>
  );
}

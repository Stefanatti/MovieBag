import * as yup from "yup";

export const signupPasswordMinimum = 5;
const resetPasswordMinimum = 15;

const isNewPassword = (value, minimum) =>
  typeof value === "string" && [...value].length >= minimum &&
  new TextEncoder().encode(value).length <= 72;

const emailField = yup.string().trim().email("Enter a valid email address").max(254).required("Email is required");
const newPasswordField = (minimum) => yup.string().required("Password is required")
  .test(
    "new-password",
    `Use at least ${minimum} characters and no more than 72 UTF-8 bytes for your password.`,
    (value) => !value || isNewPassword(value, minimum),
  );

export const signupSchema = yup.object().shape({
  username: yup.string().trim().max(256).required("Username is required"),
  email: emailField,
  password: newPasswordField(signupPasswordMinimum),
});

export const userLogInSchema = yup.object().shape({
  username: yup.string().required("Username is required").max(1024),
  password: yup.string().required("Password is required").max(1024),
});

export const recoverySchema = yup.object({ email: emailField });
export const resetPasswordSchema = yup.object({
  newPassword: newPasswordField(resetPasswordMinimum),
  confirmNewPassword: yup.string().required("Confirm your new password")
    .oneOf([yup.ref("newPassword")], "Passwords do not match"),
});

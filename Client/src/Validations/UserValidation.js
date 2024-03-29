import * as yup from "yup";

export const userSignInSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Email is wrong").required("Email is required"),
  password: yup.string().required("Password is required").min(3).max(15),
});

export const userLogInSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required").min(3).max(15),
});

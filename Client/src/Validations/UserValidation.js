import * as yup from "yup";

export const userSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Email is wrong").required("Email is required"),
  password: yup.string().min(3).max(15).required("Password is required"),
});

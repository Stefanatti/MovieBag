import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userLogInSchema } from "../../Validations/UserValidation";
import {
  Grid,
  Paper,
  CssBaseline,
  Button,
  Typography,
  Container,
  Box,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { login, logout } from "../../Features/user";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const fields = [
  { label: "Username", name: "username" },
  { label: "Password", name: "password" },
];

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const url = process.env.REACT_APP_URL;

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [resetPasswordForm, setResetPasswordForm] = useState(false);
  const handleClickShowPassword = () =>
    setShowPassword((prevShowPassword) => !prevShowPassword);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const {
    // reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userLogInSchema),
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const loginUser = async () => {
    try {
      const response = await axios.post(`${url}/user/login`, formData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        await verifyUser();
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.warning(error.response.data.message);
    }
  };

  const verifyUser = async () => {
    if (localStorage.getItem("token")) {
      await axios
        .post(`${url}/user/verify`, {
          token: localStorage.getItem("token"),
        })
        .then(({ data }) => {
          console.log(data);
          localStorage.setItem("user", data.username);
          localStorage.setItem("id", data._id);

          dispatch(login({ _id: data._id, username: data.username }));
          navigate("/");
        })
        .catch((err) => console.log(err));
    } else {
      dispatch(logout());
    }
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    forgotPassword(formData.email);
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(`${url}/user/forgot_password/`, {
        email: email,
      });
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }

      console.log(response);
    } catch (err) {
      console.error(err);

      if (err.response) {
        switch (err.response.status) {
          case 404:
            toast.error(err.response.data.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            break;
          case 500:
            toast.error(err.response.data.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            break;
          default:
            toast.error(
              `An error occurred (${err.response.status}). ${err.response.data.message}`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }
            );
        }
      } else {
        toast.error("An unexpected error occurred.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          marginBottom: 5,
          overflow: "hidden",
        }}
      >
        <Grid container>
          <CssBaseline />

          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              height: "550px",
              display: { xs: "none", sm: "block" },
              backgroundImage: resetPasswordForm
                ? "url(https://alternativemovieposters.com/wp-content/uploads/2020/03/ratliff_eternalsunshine.jpg)"
                : "url(https://alternativemovieposters.com/wp-content/uploads/2013/12/mementobg.jpg)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "2px solid var(--home-page-posters-color)",
              marginBottom: 5,
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
            sx={{ backgroundColor: "var(--main-card-color)" }}
          >
            {resetPasswordForm ? (
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  component="h1"
                  variant="h5"
                  sx={{
                    color: "var(--basic-color)",
                    fontFamily: "Limelight",
                    marginBottom: 3,
                  }}
                >
                  Enter Your Email
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleForgotPasswordSubmit}
                  sx={{
                    mt: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    placeholder={`Email`}
                    name={`email`}
                    type={"text"}
                    {...register(`email`)}
                    error={Boolean(errors["email"])}
                    helperText={errors["email"]?.message}
                    value={formData["email"]}
                    onChange={handleChange}
                    InputProps={{
                      style: {
                        color: "var(--basic-color)",
                        border: "2px solid var(--basic-color)",
                      },
                      sx: {
                        "&:hover fieldset": {
                          border: "2px solid var(--basic-color)",
                          borderRadius: 0,
                        },
                        "&:focus-within fieldset, &:focus-visible fieldset": {
                          border: "2px solid var(--basic-color)!important",
                        },
                        "& input:-webkit-autofill, & textarea:-webkit-autofill, & select:-webkit-autofill":
                          {
                            WebkitTextFillColor: "var(--basic-color)",
                            WebkitBoxShadow: "red inset",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      background: "var(--basic-color)",
                      "&:hover": { bgcolor: "var(--basic-color)" },
                    }}
                  >
                    Submit
                  </Button>
                  <Grid item>
                    <Typography
                      variant="body2"
                      color={"var(--basic-color)"}
                      onClick={() => setResetPasswordForm(false)}
                      sx={{ cursor: "pointer" }}
                    >
                      Back to login
                    </Typography>
                  </Grid>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  component="h1"
                  variant="h5"
                  sx={{
                    color: "var(--basic-color)",
                    fontFamily: "Limelight",
                    marginBottom: 3,
                  }}
                >
                  Log In
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit(loginUser)}
                  sx={{
                    mt: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {fields.map((field) => (
                    <TextField
                      key={field.name}
                      margin="normal"
                      required
                      fullWidth
                      placeholder={field.label}
                      name={field.name}
                      type={
                        field.name === "password"
                          ? showPassword
                            ? "text"
                            : "password"
                          : "text"
                      }
                      {...register(`${field.name}`)}
                      error={Boolean(errors[field.name])}
                      helperText={errors[field.name]?.message}
                      value={formData[field.name]}
                      onChange={handleChange}
                      InputProps={{
                        style: {
                          color: "var(--basic-color)",
                          border: "2px solid var(--basic-color)",
                        },
                        sx: {
                          "&:hover fieldset": {
                            border: "2px solid var(--basic-color)",
                            borderRadius: 0,
                          },
                          "&:focus-within fieldset, &:focus-visible fieldset": {
                            border: "2px solid var(--basic-color)!important",
                          },
                          "& input:-webkit-autofill, & textarea:-webkit-autofill, & select:-webkit-autofill":
                            {
                              WebkitTextFillColor: "var(--basic-color)",
                              WebkitBoxShadow: "red inset",
                              transition:
                                "background-color 5000s ease-in-out 0s",
                            },
                        },
                        endAdornment: field.name === "password" && (
                          <InputAdornment position="end">
                            <IconButton
                              sx={{ color: "var(--basic-color)" }}
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  ))}
                  <Grid item>
                    <Typography
                      variant="body2"
                      color={"var(--basic-color)"}
                      onClick={() => setResetPasswordForm(true)}
                      sx={{ cursor: "pointer" }}
                    >
                      Forgot your password?
                    </Typography>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      background: "var(--basic-color)",
                      "&:hover": { bgcolor: "var(--basic-color)" },
                    }}
                  >
                    Log in
                  </Button>

                  <Grid container>
                    <Grid item>
                      <Typography
                        variant="body2"
                        color={"var(--basic-color)"}
                        onClick={() => navigate("/signup")}
                        sx={{ cursor: "pointer" }}
                      >
                        Don't have an account? Sign Up
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
        <ToastContainer
          position="bottom-left"
          theme="dark"
          toastStyle={{
            backgroundColor: "black", // Global black background
            color: "white", // Global white text
          }}
          progressStyle={{
            backgroundColor: "var(--basic-color)", // Global progress bar style
          }}
          closeButton={{ color: "var(--basic-color)", fontSize: "18px" }}
        />
      </Box>
    </Container>
  );
};

export default Login;

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
  Link,
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

const fields = [
  { label: "Username", name: "username" },
  { label: "Password", name: "password" },
];

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

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

  const loginUser = async (e) => {
    try {
      const response = await axios.post(
        "https://moviebag-1bhe.onrender.com/user/login",
        formData
      );
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        await verifyUser();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const verifyUser = async () => {
    if (localStorage.getItem("token")) {
      await axios
        .post("https://moviebag-1bhe.onrender.com/verify", {
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
              backgroundImage:
                "url(https://alternativemovieposters.com/wp-content/uploads/2013/12/mementobg.jpg)",
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
                            transition: "background-color 5000s ease-in-out 0s",
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
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                ))}

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
                    <Link href={"/signup"} variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;

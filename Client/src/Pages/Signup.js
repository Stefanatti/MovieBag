import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "../Validations/UserValidation";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  Stack,
  Link,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { getOverflowOptions } from "antd/es/_util/placements";
const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () =>
    setShowPassword((prevShowPassword) => !prevShowPassword);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  const createUser = async (e) => {
    try {
      await axios
        .post("http://localhost:3636/user/signup", formData)
        .then(({ data }) => {
          console.log(data);
          if (data.message === true) {
            navigate("/login");
          } else {
            alert(data.message);
          }
        });
    } catch (error) {
      console.error("Error submitting form:", error);
      reset();
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
                "url(https://alternativemovieposters.com/wp-content/uploads/2021/12/Beth-Morris_EyesWideShut.jpg)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "2px solid grey",
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
                Sign In
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit(createUser)}
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
                  id="username"
                  placeholder="Username"
                  name="username"
                  autoComplete="username"
                  {...register("username")}
                  error={errors.username}
                  helperText={errors.username?.message}
                  value={formData.username}
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
                    },
                  }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  placeholder="Email Address"
                  name="email"
                  autoComplete="email"
                  {...register("email")}
                  error={errors.email}
                  helperText={errors.email?.message}
                  value={formData.email}
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
                    },
                  }}
                />

                <TextField
                  margin="normal"
                  className="textfield"
                  required
                  fullWidth
                  name="password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  error={errors.password}
                  helperText={errors.password?.message}
                  {...register("password")}
                  value={formData.password}
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
                    },
                    endAdornment: (
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
                  Sign in
                </Button>

                <Grid container>
                  <Grid item>
                    <Link href={"/login"} variant="body2">
                      {"Have you already an account? Login"}
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

export default Signup;

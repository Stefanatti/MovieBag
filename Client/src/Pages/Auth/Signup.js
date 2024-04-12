import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSignInSchema } from "../../Validations/UserValidation";
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
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const fields = [
  { label: "Username", name: "username" },
  { label: "Email", name: "email" },
  { label: "Password", name: "password" },
];
const Signup = () => {
  const url = process.env.REACT_APP_URL;

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
    resolver: yupResolver(userSignInSchema),
  });

  const createUser = async (e) => {
    try {
      const response = await axios.post(`${url}/user/signup`, formData, {});
      console.log(response.data);
      if (response.data.message === true) {
        navigate("/login");
      } else {
        alert(response.data.message);
      }
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
              border: "2px solid var(--home-page-posters-color)",
              borderRadius: "2%",
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
                  Sign in
                </Button>

                <Grid container>
                  <Grid item>
                    <Typography
                      variant="body2"
                      color={"var(--basic-color)"}
                      onClick={() => navigate("/login")}
                      sx={{ cursor: "pointer" }}
                    >
                      Have you already an account? Login
                    </Typography>
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

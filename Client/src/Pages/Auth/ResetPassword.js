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
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";

import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const fields = [
  { label: "New Password", name: "newPassword" },
  { label: "Confirm New Password", name: "confirmNewPassword" },
];

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const url = process.env.REACT_APP_URL;
  const { token } = useParams();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [message, setMessage] = useState("");

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

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(`${url}/user/reset_password/${token}`, {
        newPassword: formData.newPassword,
      });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setMessage("Error resetting password");
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

              backgroundImage:
                "url(https://alternativemovieposters.com/wp-content/uploads/2020/09/JuanRomero_Recall.jpg)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
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
                Reset Password
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleNewPasswordSubmit}
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
                    type={"text"}
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
                  Reset
                </Button>

                <Grid container>
                  <Grid item>
                    <Typography
                      variant="body2"
                      color={"var(--basic-color)"}
                      onClick={() => navigate("/login")}
                      sx={{ cursor: "pointer" }}
                    >
                      Go Back to Login
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

export default ResetPassword;

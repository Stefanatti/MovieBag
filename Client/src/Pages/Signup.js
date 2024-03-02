// import "../Styles/Signup-Login.scss";
// import { Container } from "react-bootstrap";
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
  Stack,
  Link,
  FormControlLabel,
  useMediaQuery,
  keyframes,
} from "@mui/material";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password } = formData;

    try {
      await axios
        .post("http://localhost:3636/user/signup", {
          username,
          email,
          password,
        })
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
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          marginTop: 5,
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

              border: "2px solid var(--basic-color)",
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
            border="2px solid var(--basic-color)"
            //  backgroundColor= "transparent"
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
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1, display: "flex", flexDirection: "column" }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={formData.username}
                  onChange={handleChange}
                  // inputProps={{ style: { color: "red", border: " 2px solid red" } }}
                  // sx={{ color:"var(--basic-color)"}}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  // inputProps={{ style: { color: "red", border: " 2px solid red" } }}
                  // sx={{ color:"var(--basic-color)"}}
                />
                <TextField
                  margin="normal"
                  className="textfield"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  //   inputProps={{
                  //     classes: {
                  //     input: styles.multilineColor
                  // }  }}
                />
                {/* <FormControlLabel
               control={<Checkbox value="remember" color="primary" />}
               label="Remember me"
             /> */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, background: "var(--basic-color)" }}
                >
                  Sign up
                </Button>

                <Grid container>
                  {/* <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid> */}
                  <Grid item>
                    {/* <span onClick={()=>setSignupForm(true)}>{"Don't have an account? Sign Up"}</span> */}
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

{
  /* <div>
      <div id="signup-page">
        <div className="signup-poster">
          <img src="https://alternativemovieposters.com/wp-content/uploads/2015/01/anthonygenuardi_spaceodyssey700.jpg" />
        </div>
        <div className="signup-form">
          <Container id="main-container">
            <main className="form-signin w-100 m-auto">
              <form>
                <h1 className="h3 mb-3 fw-normal">Please sign up</h1>

                <div className="form-floating">
                  <input
                    type="text"
                    value={username}
                    className="form-control"
                    id="floatingInput"
                    placeholder="username"
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                  <label htmlFor="floatingInput">Username</label>
                </div>
                <div className="form-floating">
                  <input
                    type="email"
                    value={email}
                    className="form-control"
                    id="floatingInput"
                    placeholder="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <label htmlFor="floatingInput">Email</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    value={password}
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>

                <div className="login-option">
                  <p>
                    If you already have account{" "}
                    <span
                      onClick={() => {
                        navigate("/login");
                      }}
                    >
                      Login
                    </span>
                  </p>
                </div>
                <button
                  className=" button-submit "
                  type="submit"
                  onClick={(e) => {
                    signUp(e);
                  }}
                >
                  Sign up
                </button>
              </form>
            </main>
          </Container>
        </div>
      </div>
    </div> */
}

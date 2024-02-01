// import "../Styles/Signup-Login.scss";
// import { Container } from "react-bootstrap";
import {Grid, Paper,CssBaseline, Button, Typography, Container, Box,TextField,Stack,FormControlLabel, useMediaQuery, keyframes} from "@mui/material";

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // const Poster = ({ url,width, height }) => {
  //   return (
       
  //       <Paper
  //         elevation={3}
  //         sx={{
  //           border: "2px solid var(--home-page-posters-color)",
  //           width: `${width}px`,
  //           height: `${height}px`,
  //           backgroundImage: `url(${url})`,
  //           backgroundSize: "cover",
  //           backgroundRepeat: "no-repeat",
  //           backgroundPosition: "center",
  //         }}
  //       >
  //       </Paper>
      
  //  );
  // };
//   const styles = theme => ({
//     multilineColor:{
//         color:'red'
//     }
// });

  const login = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3636/user/login", {
        username,
        password,
      })
      .then(({ data }) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/");
        } else {
          alert(data.message);
        }
      });
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
              backgroundImage: "url(https://alternativemovieposters.com/wp-content/uploads/2021/12/Beth-Morris_EyesWideShut.jpg)",
              backgroundRepeat: "no-repeat",
              backgroundColor: 
              (t) =>
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
            border= "2px solid var(--basic-color)"
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
             
              <Typography component="h1" variant="h5" >
                Login
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={{}}
                sx={{ mt: 1, display: "flex",
                flexDirection: "column", }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  // inputProps={{ style: { color: "red", border: " 2px solid red" } }}
                  // sx={{ color:"var(--basic-color)"}}
                />
                <TextField
                  margin="normal"
                  className = "textfield"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
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
                  sx={{ mt: 3, mb: 2 , background:"var(--basic-color)"}}
                >
                  Login
                </Button>
                {/* <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="#" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid> */}
              </Box>
            </Box>
          
          </Grid>
        </Grid>
      </Box>
       
      </Container>
     
  );
};

export default Login;




 {/* <div className="signup-poster">
          <img src="https://alternativemovieposters.com/wp-content/uploads/2021/12/Beth-Morris_EyesWideShut.jpg" />
        </div>
        <div className="signup-form">
          <Container id="main-container">
            <main className="form-signin w-100 m-auto">
              <form>
                <h1 className="h3 mb-3 fw-normal">Please Login</h1>

                <div className="form-floating">
                  <input
                    type="text"
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
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>

                <button
                  className="button-submit"
                  type="submit"
                  onClick={(e) => {
                    login(e);
                  }}
                >
                  Login
                </button>
              </form>
            </main>
          </Container>
        </div>
      </div>  */}
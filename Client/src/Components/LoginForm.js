import {Grid, Paper,CssBaseline, Button, Typography, Container, Box,TextField,Stack,Link,FormControlLabel, useMediaQuery, keyframes} from "@mui/material";


const LoginForm = ({login,username,password,setSignupForm}) => {
return (
        <>
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
                 onSubmit={login}
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
                 <Grid container>
                   {/* <Grid item xs>
                     <Link href="#" variant="body2">
                       Forgot password?
                     </Link>
                   </Grid> */}
                   <Grid item>
                     <span onClick={()=>setSignupForm(true)}>{"Don't have an account? Sign Up"}</span>
                     {/* <Link href={{}} variant="body2">
                       {"Don't have an account? Sign Up"}
                     </Link> */}
                   </Grid>
                 </Grid>
               </Box>
             </Box>
           
           </Grid>
         </Grid>
       </Box>
        
       </Container>
       </>
    )
} 

export default LoginForm;
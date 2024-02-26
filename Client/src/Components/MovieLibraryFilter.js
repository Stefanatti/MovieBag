import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


function MovieLibraryFilter({setSearch, search}) {
 
return (
  <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
    <TextField id="outlined-basic" variant="outlined"  
    onChange={(e) => setSearch(e.target.value)}
                    // className="search"
                    value={search}
                    type="text"
                    placeholder="Search for a movie"
                    aria-label="Search"
                    title="Type in a name" 
                    />
</Box>
//    <form
//               className="d-flex"
//               role="search"
//             >
//               <input
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="search"
//                 value={search}
//                 type="text"
//                 placeholder="Search for a movie"
//                 aria-label="Search"
//                 title="Type in a name"
//               />
//             </form>     
 )
}
   

export default MovieLibraryFilter;



// export default function BasicTextFields() {
//   return (
//     <Box
//       component="form"
//       sx={{
//         '& > :not(style)': { m: 1, width: '25ch' },
//       }}
//       noValidate
//       autoComplete="off"
//     >
//       <TextField id="outlined-basic" label="Outlined" variant="outlined" />
//       <TextField id="filled-basic" label="Filled" variant="filled" />
//       <TextField id="standard-basic" label="Standard" variant="standard" />
//     </Box>
//   );
// }
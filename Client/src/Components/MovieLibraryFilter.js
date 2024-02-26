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
    <TextField   
    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    type="text"
                    placeholder="Search for a movie"
                    aria-label="Search"
                    title="Type in a name" 
                    InputProps={{
                      style: {color:"var(--basic-color)", border: '2px solid var(--basic-color)'},
                      sx: {
                        '&:hover fieldset': {
                          border: '2px solid var(--basic-color)',
                          borderRadius: 0,
                        },
                        '&:focus-within fieldset, &:focus-visible fieldset': {
                          border: '2px solid var(--basic-color)!important',
                        },
                      },
                    }}
                    />
</Box>
)
}
   

export default MovieLibraryFilter;




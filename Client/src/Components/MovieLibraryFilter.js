import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

function MovieLibraryFilter({ placeholder, setSearch, search }) {
  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        onChange={(e) => setSearch(e.target.value)}
        value={search.toLowerCase()}
        type="text"
        placeholder={placeholder}
        aria-label="Search"
        title="Type in a name"
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
    </Box>
  );
}

export default MovieLibraryFilter;

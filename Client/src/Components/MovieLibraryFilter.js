import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

function MovieLibraryFilter({ placeholder, setSearch, search }) {
  return (
    <Box className="collection-search">
      <TextField
        className="collection-search__field"
        fullWidth
        label={placeholder}
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        type="search"
        placeholder="Filter your collection"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon aria-hidden="true" />
            </InputAdornment>
          ),
          endAdornment: search && (
            <InputAdornment position="end">
              <IconButton
                aria-label={`Clear ${placeholder.toLowerCase()}`}
                onClick={() => setSearch("")}
                edge="end"
                size="small"
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}

export default MovieLibraryFilter;

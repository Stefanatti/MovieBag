import React, { useState, useEffect } from "react";
import "./../Styles/YourMoviesLibrary.scss";

import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import Pagination from "./Pagination";
import { useSelector, useDispatch } from "react-redux";
import { Container, Box, TableContainer } from "@mui/material";
import MovieLibraryFilter from "./MovieLibraryFilter";
import { useNavigate } from "react-router-dom";
import MoviesTable from "./MoviesTable";
import useFetchData from "../Hooks/useFetchData";
import { getUserMovies } from "../Features/movies";

const ShowsLibraryList = ({ showType, filterKey }) => {
  const user = useSelector((state) => state.user.value);
  const url = process.env.REACT_APP_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [items, setItems] = useState([]);
  const [pageloaded, setPageLoaded] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;

  const { data, loading, error } = useFetchData(
    `${url}/${showType}/`,
    user._id
  );

  useEffect(() => {
    if (error) {
      console.log(error);
      navigate("/error_page");
    }
    if (data) {
      const fetchedItems = data;
      setItems(fetchedItems);
      dispatch(
        getUserMovies({
          id: fetchedItems.map((item) => item.id),
          title: fetchedItems.map((item) => item.title),
          director: fetchedItems.map((item) => item.director),
        })
      );
      setPageLoaded(loading);
    }
  }, [data, error, dispatch]);

  const removeItem = async (id) => {
    try {
      await axios.delete(`${url}/${showType}/${id}`);
      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleRatingChange = (id, stars) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, ratings: { stars: stars } } : item
      )
    );
  };

  const rateItem = async (id, stars) => {
    handleRatingChange(id, stars);
    try {
      const data = {
        stars: stars,
      };
      await axios.put(`${url}/${showType}/rate/${id}`, data);
      // .then((response) => {
      //   console.log("Success:", response.data);
      // });
    } catch (error) {
      console.log(error.message);
    }
  };

  const filterItems = items.filter((myItem) => {
    return search.toLowerCase() === ""
      ? myItem
      : myItem[filterKey].toLowerCase().includes(search);
  });
  const currentItems = filterItems.slice(firstItemIndex, lastItemIndex);

  return (
    <Container>
      <Box sx={{ zIndex: "auto" }}>
        <h1 className="library-header">{`YOUR ${showType.toUpperCase()}S :`}</h1>
        {pageloaded ? (
          <ClipLoader
            color={"var(--basic-color)"}
            className="loading"
            loading={pageloaded}
            cssOverride={{ marginLeft: "50vw", marginTop: "10vw" }}
            size={50}
            aria-label="Loading Spinner"
          />
        ) : items.length === 0 ? (
          <h2 className="library-header">
            Search for a {showType} and add it to your list!
          </h2>
        ) : (
          <div className="movies-table-div">
            <div className="input-div">
              <MovieLibraryFilter
                placeholder={`Search for a ${showType}`}
                setSearch={setSearch}
                search={search}
              />
            </div>

            <TableContainer>
              <MoviesTable
                path={`/${showType}?id=`}
                rateTheMovie={rateItem}
                currentMyMovies={currentItems}
                removeMovie={removeItem}
              />
            </TableContainer>
            <Pagination
              className="down-pages"
              style={{ marginBottom: "60px" }}
              totalMovies={filterItems.length}
              moviesPerPage={itemsPerPage}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </div>
        )}
      </Box>
    </Container>
  );
};

export default ShowsLibraryList;

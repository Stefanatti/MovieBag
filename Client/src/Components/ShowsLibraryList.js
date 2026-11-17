import React, { useEffect, useState } from "react";
import "./../Styles/YourMoviesLibrary.scss";

import api from "../api/axios";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Box,
  Pagination,
  PaginationItem,
  Typography,
  Button,
  Skeleton,
} from "@mui/material";
import LocalMoviesRoundedIcon from "@mui/icons-material/LocalMoviesRounded";
import LiveTvRoundedIcon from "@mui/icons-material/LiveTvRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import MovieLibraryFilter from "./MovieLibraryFilter";
import { useNavigate } from "react-router-dom";
import MoviesTable from "./MoviesTable";
import useFetchData from "../Hooks/useFetchData";
import { getUserMovies } from "../Features/movies";

const itemsPerPage = 10;

const ShowsLibraryList = ({ showType, filterKey }) => {
  const user = useSelector((state) => state.user.value);
  const url = process.env.REACT_APP_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [items, setItems] = useState([]);
  const [pageloaded, setPageLoaded] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const isMovie = showType === "movie";
  const pageTitle = isMovie ? "Your Movies" : "Your TV Shows";
  const itemLabel = isMovie ? "movie" : "TV show";
  const ItemIcon = isMovie ? LocalMoviesRoundedIcon : LiveTvRoundedIcon;

  const { data, loading, error } = useFetchData(
    `${url}/${showType}/`,
    user._id,
  );

  useEffect(() => {
    if (error) {
      console.log(error);
      navigate("/error_page");
      return;
    }

    if (data) {
      setItems(data);
      dispatch(
        getUserMovies({
          id: data.map((item) => item.id),
          title: data.map((item) => item.title || item.name),
          director: data.map((item) => item.director || item.creator),
        }),
      );
      setPageLoaded(loading);
    }
  }, [data, error, dispatch, loading, navigate]);

  const normalizedSearch = search.trim().toLowerCase();
  const filterItems = items.filter((item) =>
    String(item[filterKey] || "")
      .toLowerCase()
      .includes(normalizedSearch),
  );
  const pageCount = Math.ceil(filterItems.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, Math.max(1, pageCount)));
  }, [pageCount]);

  const currentItems = filterItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const removeItem = async (id) => {
    try {
      await api.delete(`${url}/${showType}/${id}`);
      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
    } catch (requestError) {
      console.log(requestError.message);
    }
  };

  const handleRatingChange = (id, stars) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, ratings: { stars } } : item,
      ),
    );
  };

  const rateItem = async (id, stars) => {
    handleRatingChange(id, stars);
    try {
      await api.put(`${url}/${showType}/rate/${id}`, { stars });
    } catch (requestError) {
      console.log(requestError.message);
    }
  };

  const updateSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <Container maxWidth="xl" className="collection-page">
      <Box component="header" className="collection-header">
        <Box>
          <Typography className="collection-header__eyebrow">
            YOUR PERSONAL LIBRARY
          </Typography>
          <Typography component="h1" className="collection-header__title">
            {pageTitle}
          </Typography>
          <Typography className="collection-header__description">
            {isMovie
              ? "A home for the films you love, remember, and rate."
              : "Keep the series you love together in one place."}
          </Typography>
        </Box>
        {!pageloaded && (
          <Box className="collection-count" aria-live="polite">
            <Typography className="collection-count__value">
              {items.length}
            </Typography>
            <Typography className="collection-count__label">
              {items.length === 1 ? "title saved" : "titles saved"}
            </Typography>
          </Box>
        )}
      </Box>

      {pageloaded ? (
        <Box className="library-loading">
          {Array.from({ length: 6 }, (_, index) => (
            <Box className="library-loading__row" key={index}>
              <Skeleton variant="rounded" className="library-loading__poster" />
              <Box className="library-loading__details">
                <Skeleton variant="text" width="45%" height={26} />
                <Skeleton variant="text" width="28%" />
                <Skeleton variant="text" width="36%" />
              </Box>
            </Box>
          ))}
        </Box>
      ) : items.length === 0 ? (
        <Box className="collection-empty">
          <Box className="collection-empty__icon">
            <ItemIcon aria-hidden="true" />
          </Box>
          <Typography component="h2" className="collection-empty__title">
            Your {itemLabel} collection starts here
          </Typography>
          <Typography className="collection-empty__description">
            Search for a favorite and add it to your personal library.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => navigate("/")}
            className="collection-empty__button"
          >
            Discover {isMovie ? "movies" : "TV shows"}
          </Button>
        </Box>
      ) : (
        <>
          <Box className="collection-toolbar">
            <Box>
              <Typography className="collection-toolbar__title">
                {normalizedSearch ? "Search results" : "Your collection"}
              </Typography>
              <Typography className="collection-toolbar__summary">
                {filterItems.length} of {items.length}{" "}
                {items.length === 1 ? "title" : "titles"}
              </Typography>
            </Box>
            <MovieLibraryFilter
              placeholder={`Search ${isMovie ? "movies" : "TV shows"}`}
              setSearch={updateSearch}
              search={search}
            />
          </Box>

          {filterItems.length === 0 ? (
            <Box className="collection-empty collection-empty--filtered">
              <Box className="collection-empty__icon">
                <SearchOffRoundedIcon aria-hidden="true" />
              </Box>
              <Typography component="h2" className="collection-empty__title">
                No titles match your search
              </Typography>
              <Typography className="collection-empty__description">
                Try another title or clear your search to see your full library.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => updateSearch("")}
                className="collection-empty__button"
              >
                Clear search
              </Button>
            </Box>
          ) : (
            <MoviesTable
              path={`/${showType}?id=`}
              showType={showType}
              rateTheMovie={rateItem}
              currentMyMovies={currentItems}
              removeMovie={removeItem}
            />
          )}

          {pageCount > 1 && (
            <Box
              component="nav"
              className="collection-pagination"
              aria-label="Collection pages"
            >
              <Typography className="collection-pagination__summary">
                Page {currentPage} of {pageCount}
              </Typography>
              <Pagination
                count={pageCount}
                page={currentPage}
                onChange={(event, page) => setCurrentPage(page)}
                size="large"
                shape="rounded"
                boundaryCount={2}
                renderItem={(item) => (
                  <PaginationItem
                    {...item}
                    className="collection-pagination__item"
                  />
                )}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ShowsLibraryList;

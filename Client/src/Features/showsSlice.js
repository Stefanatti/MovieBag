import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const movieApi = createApi({
  reducerPath: "movieApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_URL }),
  endpoints: (builder) => ({
    getPopularMovies: builder.query({
      query: () => "api/popular",
    }),
    getPopularTvShows: builder.query({
      query: () => "api/tv/popular",
    }),
    getTopRatedMovies: builder.query({
      query: () => "api/top_rated",
    }),
    getTopRatedTvShows: builder.query({
      query: () => "api/tv/top_rated",
    }),
  }),
});

export const {
  useGetPopularMoviesQuery,
  useGetPopularTvShowsQuery,
  useGetTopRatedMoviesQuery,
  useGetTopRatedTvShowsQuery,
} = movieApi;

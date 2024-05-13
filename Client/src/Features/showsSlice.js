import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const movieApi = createApi({
  reducerPath: "movieApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_URL }),
  endpoints: (builder) => ({
    getPopularMovies: builder.query({
      query: () => "api/popular",
      polling: { interval: 24 * 60 * 60 * 1000, retryCount: 3 },
    }),
    getPopularTvShows: builder.query({
      query: () => "api/tv/popular",
      polling: { interval: 24 * 60 * 60 * 1000, retryCount: 3 },
    }),
    getTopRatedMovies: builder.query({
      query: () => "api/top_rated",
      polling: { interval: 24 * 60 * 60 * 1000, retryCount: 3 },
    }),
    getTopRatedTvShows: builder.query({
      query: () => "api/tv/top_rated",
      polling: { interval: 24 * 60 * 60 * 1000, retryCount: 3 },
    }),
  }),
});

export const {
  useGetPopularMoviesQuery,
  useGetPopularTvShowsQuery,
  useGetTopRatedMoviesQuery,
  useGetTopRatedTvShowsQuery,
} = movieApi;

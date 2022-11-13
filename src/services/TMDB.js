import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const tmdbAPIKey = process.env.REACT_APP_TMDB_KEY;

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.themoviedb.org/3" }),
  endpoints: (builder) => ({
    getGenres: builder.query({
      query: () => `/genre/movie/list?api_key=${tmdbAPIKey}`,
    }),
    getMovies: builder.query({
      query: ({ genreIdOrCategoryName, page, searchQuery }) => {
        // console.log(genreIdOrCategoryName, page);

        if (searchQuery) {
          console.log("Movie based on search");
          return `/search/movie?query=${searchQuery}&page=${page}&api_key=${tmdbAPIKey}`;
        }

        if (
          genreIdOrCategoryName &&
          typeof genreIdOrCategoryName === "string"
        ) {
          // console.log("category");
          return `movie/${genreIdOrCategoryName}?page=${page}&api_key=${tmdbAPIKey}`;
        }
        if (
          genreIdOrCategoryName &&
          typeof genreIdOrCategoryName === "number"
        ) {
          // console.log("genre");
          return `discover/movie?with_genres=${genreIdOrCategoryName}&api_key=${tmdbAPIKey}&page=${page}`;
        }
        //console.log("default");
        return `movie/popular?page=${page}&api_key=${tmdbAPIKey}`;
      },
    }),
    getMovie: builder.query({
      query: (id) => {
        return `/movie/${id}?api_key=${tmdbAPIKey}&append_to_response=videos,credits`;
      },
    }),

    getRecommendMovies: builder.query({
      query: (movieId) => {
        return `/movie/${movieId}/recommendations?api_key=${tmdbAPIKey}`;
      },
    }),

    getRecommendActorData: builder.query({
      query: (person_id) => {
        return `/person/${person_id}?api_key=${tmdbAPIKey}&append_to_response=videos,movies,credits`;
      },
    }),

    getMoviesByActorId: builder.query({
      query: ({ id, page }) => {
        return `/discover/movie?api_key=${tmdbAPIKey}&with_cast=${id}&page=${page}`;
      },
    }),

    getList: builder.query({
      query: ({ listName, accountId, sessionId, page }) => {
        return `/account/${accountId}/${listName}?api_key=${tmdbAPIKey}&session_id=${sessionId}&page=${page}`;
      },
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useGetGenresQuery,
  useGetMovieQuery,
  useGetRecommendMoviesQuery,
  useGetRecommendActorDataQuery,
  useGetMoviesByActorIdQuery,
  useGetListQuery,
} = tmdbApi;

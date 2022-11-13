import { configureStore } from "@reduxjs/toolkit";
import { tmdbApi } from "../services/TMDB";
import genreOrCategory from "../features/currentGenreOrCategory";
import userReducer from "../features/auth";
const store = configureStore({
  reducer: {
    [tmdbApi.reducerPath]: tmdbApi.reducer,
    currentGenreOrCategory: genreOrCategory,
    user: userReducer,
  },
});

export default store;

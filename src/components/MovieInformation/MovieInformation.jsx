import React from "react";
import useStyles from "./styles";
import { useState } from "react";
import {
  Modal,
  Typography,
  Button,
  ButtonGroup,
  Grid,
  Box,
  CircularProgress,
  useMediaQuery,
  Rating,
} from "@mui/material";
import {
  Movie as MovieIcon,
  Theaters,
  Language,
  PlusOne,
  Favorite,
  FavoriteBorderOutlined,
  Remove,
  ArrowBack,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
import MovieList from "../MovieList/MovieList";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userSelector } from "../../features/auth";
import axios from "axios";
import {
  useGetListQuery,
  useGetMovieQuery,
  useGetRecommendMoviesQuery,
} from "../../services/TMDB";
import { selectGenreOrCategory } from "../../features/currentGenreOrCategory";
const MovieInformation = () => {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const { id } = useParams();
  const classes = useStyles();
  const { data, isFetching, error } = useGetMovieQuery(id);
  const {
    data: recommendedData,
    isFetching: isRecommendedMoviesFetching,
  } = useGetRecommendMoviesQuery(id);
  const { user } = useSelector(userSelector);
  const { data: favoriteMovies } = useGetListQuery({
    listName: "favorite/movies",
    accountId: user.id,
    sessionId: localStorage.getItem("session_id"),
    page: 1,
  });

  const { data: watchlistMovies } = useGetListQuery({
    listName: "watchlist/movies",
    accountId: user.id,
    sessionId: localStorage.getItem("session_id"),
    page: 1,
  });
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false);
  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }

  if (error) {
    return <Link to="/">Something went wrong please go back</Link>;
  }

  console.log(recommendedData);

  const addToFavorites = async () => {
    await axios.post(
      `https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&session_id=${localStorage.getItem(`session_id`)}`,
      {
        media_type: "movie",
        media_id: id,
        favorite: !isMovieFavorited,
      }
    );
    setIsMovieFavorited((prevState) => !isMovieFavorited);
  };

  const addToWatchlist = async () => {
    await axios.post(
      `https://api.themoviedb.org/3/account/${user.id}/watchlisted?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&session_id=${localStorage.getItem(`session_id`)}`,
      {
        media_type: "movie",
        media_id: id,
        watchlist: !isMovieWatchlisted,
      }
    );
    setIsMovieWatchlisted((prevState) => !isMovieWatchlisted);
  };

  return (
    <Grid container className={classes.containerSpaceAround}>
      <Grid item sm={12} lg={4}>
        <img
          className={classes.poster}
          src={`https://image.tmdb.org/t/p/w500/${
            data.poster_path ? data.poster_path : "No image"
          }`}
        />
      </Grid>
      <Grid item direction="column" container lg={7}>
        <Typography variant="h3" align="center" gutterBottom>
          {data.title} ({data.release_date.split("-")[0]})
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          {data.tagline ? data.tagline : ""}
        </Typography>
        <Grid
          item
          className={classes.containerSpaceAround}
          justifyContent="space-around"
        >
          <Box display="flex" align="center">
            <Rating
              readOnly
              value={data.vote_average ? data.vote_average / 2 : "4.5Ratings"}
            />
            <Typography variant="subtitle1" gutterBottom marginLeft="10px">
              {data.vote_average.toFixed(1)}/10
            </Typography>
          </Box>

          <Typography variant="subtitle1" align="center">
            {data.runtime}min / {data.release_date}
          </Typography>
        </Grid>
        <Grid item className={classes.genresContainer}>
          <Typography marginLeft="70px" variant="h5">
            Genres :{" "}
          </Typography>
          <Box display="flex" alignItems="center">
            {data.genres.map((genre, i) => (
              <Link
                className={classes.links}
                to="/"
                onClick={() => dispatch(selectGenreOrCategory(genre.id))}
              >
                {genre.name},
              </Link>
            ))}
          </Box>
        </Grid>
        <Typography variant="h5" gutterBottom style={{ marginTop: "20px" }}>
          Overview
        </Typography>
        <Typography style={{ marginBottom: "2rem" }}>
          {data.overview}
        </Typography>
        <Typography variant="h5" style={{ marginBottom: "2rem" }}>
          Top Cast
        </Typography>

        <Grid item container spacing={2}>
          {data &&
            data.credits.cast
              .map(
                (character, i) =>
                  character.profile_path && (
                    <Grid key={i} sm={4} md={2} to={`/`}>
                      <Link to={`/actors/${character.id}`}>
                        <img
                          className={classes.castImage}
                          src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`}
                        />
                        <Typography color="textPrimary" marginBottom="10px">
                          {character.name}
                        </Typography>
                        <Typography color="textSecondary">
                          {character.character}
                        </Typography>
                      </Link>
                    </Grid>
                  )
              )
              .slice(0, 6)}
        </Grid>

        <Grid item container style={{ marginTop: "2rem" }}>
          <div className={classes.buttonsContainer}>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size="small">
                <Button
                  variant="outlined"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={data.homepage}
                  endIcon={<Language />}
                >
                  WEBSITE
                </Button>
                <Button
                  variant="outlined"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.imdb.com/title/${data.imdb_id}`}
                  endIcon={<MovieIcon />}
                >
                  IMDB
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleOpen}
                  href="#"
                  endIcon={<Theaters onClick={() => {}} />}
                >
                  TRAILER
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size="small">
                <Button
                  onClick={addToFavorites}
                  endIcon={
                    isMovieFavorited ? <FavoriteBorderOutlined /> : <Favorite />
                  }
                >
                  {isMovieFavorited ? "UUFAVORITE" : "FAVORITE"}
                </Button>
                <Button
                  onClick={addToWatchlist}
                  endIcon={isMovieWatchlisted ? <Remove /> : <PlusOne />}
                >
                  WATCHLIST
                </Button>
                <Button endIcon={<ArrowBack />}>
                  <Typography
                    component={Link}
                    to="/"
                    color="inherit"
                    variant="subtitle2"
                    style={{ textDecoration: "none" }}
                  >
                    BACK
                  </Typography>
                </Button>
              </ButtonGroup>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Box marginTop="5rem">
        <Typography align="center" variant="h3" gutterBottom>
          You might also like
        </Typography>
      </Box>
      {recommendedData ? (
        <MovieList movies={recommendedData} noOfMoviesRecommended={12} />
      ) : (
        <Box>No Recommended Movies Found</Box>
      )}
      {/* <Pagination
        currentPage={page}
        setPage={setPage}
        totalPages={recommededData.total_pages}
      /> */}
      <Modal className={classes.modal} open={open} onClose={handleClose}>
        {data.videos.results.length > 0 && (
          <iframe
            autoPlay
            className={classes.videos}
            title="Trailer"
            src={`https://www.youtube.com/embed/${data.videos.results[0].key}`}
          />
        )}
      </Modal>
    </Grid>
  );
};

export default MovieInformation;

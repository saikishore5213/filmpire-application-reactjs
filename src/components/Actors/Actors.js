import { ArrowBack } from "@mui/icons-material";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  useGetMoviesByActorIdQuery,
  useGetRecommendActorDataQuery,
} from "../../services/TMDB";
import MovieList from "../MovieList/MovieList";
import useStyles from "./styles.js";
import Pagination from "../Pagination/Pagination";

const Actors = () => {
  const { id } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const [page, setPage] = useState(1);

  const { data, isFetching, error } = useGetRecommendActorDataQuery(id);
  const { data: movies } = useGetMoviesByActorIdQuery({ id, page });

  if (isFetching) {
    return (
      <Box display="flex" alignItems="center" mt="20px">
        <CircularProgress size="4rem" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" alignItems="center" mt="20px">
        <Button startIcon={<ArrowBack />} onClick={() => history.goBack()}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Grid container display="flex" flexWrap="inherit" spacing={3}>
        <Grid lg={5} xl={4} style={{ margin: "40px 0 0 40px" }}>
          <img
            className={classes.image}
            src={`https://image.tmdb.org/t/p/w780/${data.profile_path}`}
          />
        </Grid>
        <Grid
          item
          lg={7}
          xl={8}
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            marginTop: "-15rem",
          }}
        >
          <Typography variant="h2" gutterBottom>
            {data.name}
          </Typography>
          <Typography variant="h5" gutterBottom>
            Born: {new Date(data.birthday).toDateString()}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {data.biography || `Sorry, no biography yey...`}
          </Typography>
          <Box marginTop="2rem" display="flex" justifyContent="space-around">
            <Button
              variant="contained"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.imdb.com/name/${data.imdb_id}`}
            >
              IMDB
            </Button>

            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => history.goBack()}
            >
              BACK
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Box margin="2rem 0">
        <Typography variant="h2" gutterBottom align="center">
          Movies
        </Typography>
        {movies && <MovieList movies={movies} noOfMoviesRecommended={12} />}
        {/* <Pagination currentPage={page} setPage={setPage} totalPages={1} /> */}
      </Box>
    </>
  );
};

export default Actors;

import React from "react";
import { useEffect } from "react";
import useStyles from "./styles";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemIcon,
  Box,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material";
import { useGetGenresQuery } from "../../services/TMDB";
import { useDispatch, useSelector } from "react-redux";
import { selectGenreOrCategory } from "../../features/currentGenreOrCategory";
const blueLogo = `https://fontmeme.com/permalink/210930/8531c658a743debe1e1aa1a2fc82006e.png`;
const redLogo = `https://fontmeme.com/permalink/210930/6854ae5c7f76597cf8680e48a2c8a50a.png`;

const demoCategories = [
  { label: "Popular", value: "popular" },
  { label: "Top Rated", value: "top_rated" },
  { label: "Upcoming", value: "upcoming" },
];

const Sidebar = ({ setMobileOpen }) => {
  const { data, isFetching } = useGetGenresQuery();
  const dispatch = useDispatch();
  const { genreOrCategoryName } = useSelector(
    (state) => state.currentGenreOrCategory
  );
  const theme = useTheme();
  const classes = useStyles();
  return (
    <>
      <Link to="/" className={classes.imageLink}>
        <img
          className={classes.image}
          src={theme.palette.mode === "light" ? blueLogo : redLogo}
        />
      </Link>
      <Divider />
      <List>
        <ListSubheader>Categories</ListSubheader>

        {demoCategories.map(({ label, value }) => (
          <Link key={value} to="/" className={classes.links}>
            <ListItem
              onClick={() => dispatch(selectGenreOrCategory(value))}
              button
            >
              {/* <ListItemIcon>
                <img
                  src={`https://fontmeme.com/permalink/210930/8531c658a743debe1e1aa1a2fc82006e.png`}
                  className={classes.genreImages}
                  height={30}
                />
              </ListItemIcon> */}
              <ListItemText primary={label}></ListItemText>
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      <ListSubheader>Genres</ListSubheader>
      {isFetching ? (
        <Box display="flex" alignItems="center" mt="20px">
          <CircularProgress size="4rem" />
        </Box>
      ) : (
        data.genres.map(({ name, id }) => (
          <Link key={name} to="/" className={classes.links}>
            <ListItem
              onClick={() => dispatch(selectGenreOrCategory(id))}
              button
            >
              {/* <ListItemIcon>
                <img
                  src={`https://fontmeme.com/permalink/210930/8531c658a743debe1e1aa1a2fc82006e.png`}
                  className={classes.genreImages}
                  height={30}
                />
              </ListItemIcon> */}
              <ListItemText primary={name}></ListItemText>
            </ListItem>
          </Link>
        ))
      )}
    </>
  );
};

export default Sidebar;

import React from "react";
import useStyles from "./styles.js";
import { Typography, Button } from "@mui/material";

const Pagination = ({ currentPage, setPage, totalPages }) => {
  const classes = useStyles();

  const handlePrev = () => {
    if (currentPage !== 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };
  const handleNext = () => {
    if (currentPage !== totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  console.log(currentPage, totalPages);

  if (totalPages === 0) return null;
  return (
    <div className={classes.container}>
      <Button
        variant="contained"
        color="primary"
        type="button"
        className={classes.button}
        onClick={handlePrev}
      >
        Prev
      </Button>

      <Typography variant="h5" className={classes.pageNumber}>
        {currentPage}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        type="button"
        className={classes.button}
        onClick={handleNext}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;

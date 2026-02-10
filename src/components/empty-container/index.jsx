import { Container, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';

const useStyle = makeStyles((theme) => ({
  root: {
    height: '90vh',
  },
  empty: {
    height: '70vh',
  },
}));
const EmptyContainer = ({ text, sxEmptyStyle, design = true }) => {
  const classes = useStyle();
  return (
    <Container sx={sxEmptyStyle} maxWidth="xl">
      {design ? (
        <Grid
          className={classes.root}
          container
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="subtitle1">{text}</Typography>
        </Grid>
      ) : (
        <Grid
          className={classes.empty}
          container
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="subtitle1">{text}</Typography>
        </Grid>
      )}
      <></>
    </Container>
  );
};
export default EmptyContainer;

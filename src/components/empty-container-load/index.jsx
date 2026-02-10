import { CircularProgress, Container, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';

const useStyle = makeStyles((theme) => ({
  empty: {
    height: '90vh',
  },
}));
const EmptyContainerLoad = ({ sxEmptyStyle }) => {
  const classes = useStyle();
  return (
    <Container sx={sxEmptyStyle} maxWidth="xl">
      <Grid
        className={classes.empty}
        container
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Grid>
    </Container>
  );
};
export default EmptyContainerLoad;

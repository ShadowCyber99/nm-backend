import React from 'react';
import { Typography, Grid, CssBaseline } from '@mui/material';
// components
import { MaintainenceIcon } from '../../assets/icons';
import WindowTitle from '../window-name';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.log('componentDidCatch', error);
  }

  WaitingComponent = (props) => {
    return (
      <Grid
        container
        component="main"
        sx={{
          height: '100vh',
          backgroundColor: '#fff',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <CssBaseline />
        <WindowTitle title="500 Error" />
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          sx={{ flex: 1, display: 'flex' }}
        >
          <MaintainenceIcon />
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          square
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          sx={{ flex: 1, display: 'flex', backgroundColor: '#0884c7' }}
        >
          {' '}
          <Typography sx={{ mt: 2, fontSize: 90, color: '#fff' }} variant="h4">
            Woops!
          </Typography>
          <Typography sx={{ mt: 2, color: '#fff', fontSize: 40 }} variant="h4">
            Something went wrong :(
          </Typography>
          <Typography sx={{ mt: 1, color: '#fff', fontSize: 40 }} variant="h4">
            Sorry for the inconvenience, we're working on it.
          </Typography>
        </Grid>
      </Grid>
    );
  };

  render() {
    if (this.state.hasError) {
      return this.WaitingComponent();
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

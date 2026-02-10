import React from 'react';
import { store, persistedStore } from '../../redux/lib/create-store';
import { Provider } from 'react-redux';
import AppRoutes from '../../routes/index.jsx';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { useIdleTimer } from 'react-idle-timer';
import localstorage from 'store2';
import { HelmetProvider } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import SessionExpiredDialog from '../../components/dialog/session-expired';
import { SocketContext, socket } from '../../hooks/useSocketContext';
import withClearCache from '../../clear-cache';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0884c7',
    },
    secondary: {
      light: '#0066ff',
      main: '#F3F3F3',
      contrastText: '#ffcc00',
    },
    error: {
      main: '#C8220E',
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    fontSize: 14,
    fontFamily: 'Roboto',
    body1: {
      fontSize: 14,
      fontFamily: 'Roboto',
      color: '#5C6878',
      fontStyle: 'normal',
      fontWeight: 'normal',
    },
    body2: {
      fontSize: 16,
      fontFamily: 'Roboto',
      color: '#5C6878',
      fontStyle: 'normal',
      fontWeight: 'bold',
    },
    body3: {
      fontSize: 14,
      fontFamily: 'Roboto',
      color: '#5C6878',
      fontStyle: 'normal',
      fontWeight: 'bold',
    },
    body4: {
      fontSize: 16,
      fontFamily: 'Roboto',
      color: '#5C6878',
      fontStyle: 'normal',
      fontWeight: 'normal',
    },
    subtitle1: {
      fontSize: 16,
      fontFamily: 'Roboto',
      color: '#1C2A39',
      fontStyle: 'normal',
      fontWeight: 'normal',
    },
    h1: {
      color: '#1C2A39',
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 16,
      lineHeight: '20px',
    },
    h2: {
      color: '#1C2A39',
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 14,
    },
    h3: {
      color: '#1C2A39',
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 14,
    },
    h4: {
      color: '#1C2A39',
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 24,
    },
    h5: {
      color: '#1C2A39',
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 20,
    },
    h7: {
      color: '#1C2A39',
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 20,
    },
    headerTitle: {
      color: '#5C6878',
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 18,
    },
    headerMainTitle: {
      color: '#5C6878',
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 20,
    },
  },
});
const MainApp = (props) => {
  const timeout = process.env.REACT_APP_SCREEN_TIMER;
  let history = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const navigateToLogin = () => {
    window.location = '/login';
  };
  const dialog = () => {
    return (
      <SessionExpiredDialog
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        handleOk={() => navigateToLogin()}
      />
    );
  };
  const handleOnIdle = () => {
    const token = localstorage('authToken');
    if (token && history.pathname !== '/unit-status') {
      setIsOpen(true);
    }
  };
  // eslint-disable-next-line no-unused-vars
  const { reset } = useIdleTimer({
    timeout,
    onIdle: handleOnIdle,
  });
  return (
    <ThemeProvider theme={theme}>
      <HelmetProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistedStore}>
            <SocketContext.Provider value={socket}>
              <SnackbarProvider
                autoHideDuration={2000}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                maxSnack={3}
              >
                <AppRoutes />
                {dialog()}
              </SnackbarProvider>
            </SocketContext.Provider>
          </PersistGate>
        </Provider>
      </HelmetProvider>
    </ThemeProvider>
  );
};
const ClearCacheComponent = withClearCache(MainApp);

function App() {
  return <ClearCacheComponent />;
}

export default App;

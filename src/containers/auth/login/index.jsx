/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Field, Form } from 'react-final-form';
import createDecorator from 'final-form-focus';
import { makeStyles } from '@mui/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { VALID_EMAIL } from '../../../utils/regexs';
import { encrypted } from '../../../utils/common-utils';
import { login } from '../actions';
import FinalFormText from '../../../components/final-form/input-text';
import WindowTitle from '../../../components/window-name/index.jsx';
import BGLOGO from '.././../../assets/GMT.png';
import clsx from 'clsx';

const focusOnErrors = createDecorator();

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  hide: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  imageContainer: {
    display: 'none',
  },
  image: {
    height: 210,
    width: 600,
    '@media (max-width: 1214px)': {
      height: 162,
      width: 390,
    },
    '@media (max-width: 900px)': {
      height: 100,
      width: 190,
    },
  },
  image2: {
    height: 180,
    width: 270,
    marginTop: 60,
  },
}));

const LoginScreen = function ({ callLoginAPI, isLoad, loadErr }) {
  const navigation = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const onSubmit = async (values) => {
    const { email, password } = values;
    if (!VALID_EMAIL.test(values.email)) {
      enqueueSnackbar('Enter valid Email!', {
        variant: 'error',
      });
    } else if (values.password.length < 6) {
      enqueueSnackbar('Enter valid Password!', {
        variant: 'error',
      });
    } else {
      const data = {
        email: email,
        password: password,
      };
      const encryptData = encrypted(data);
      const res = await callLoginAPI(encryptData);
      if (res) {
        navigation('/');
        window.location.reload(true);
      }
    }
  };
  useEffect(() => {
    if (loadErr)
      enqueueSnackbar(loadErr, {
        variant: 'error',
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
  }, [loadErr]);
  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <WindowTitle title="Login" />
      <Grid
        item
        xs={false}
        sm={4}
        md={6}
        className={clsx(classes.mainContainer, classes.hide)}
        sx={{
          backgroundColor: 'rgb(243, 243, 243)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flexDirection: 'column',
        }}
      >
        {/* <Logo color="#fff" height={700} width={700} /> */}
        <img src={BGLOGO} className={classes.image} alt="GMT-AZ-Logo" />
        <img
          src={require('../../../assets/Flag_of_New_Mexico.png')}
          className={classes.image2}
          alt="Flag_of_New_Mexico"
        />
        <Typography variant="h5" mt={1} fontSize={30}>
          NEW MEXICO
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        className={classes.mainContainer}
        component={Paper}
        elevation={2}
        square
      >
        <Form
          onSubmit={onSubmit}
          decorators={[focusOnErrors]}
          keepDirtyOnReinitialize
          initialValues={{
            email: '',
            password: '',
          }}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = 'Email is required';
            } else if (!VALID_EMAIL.test(values.email)) {
              errors.email = 'Please enter valid Email Id';
            }
            if (!values.password) {
              errors.password = 'Password is required';
            }

            return errors;
          }}
          render={({ handleSubmit, pristine, touched, submitting, errors }) => (
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <Field
                  component={FinalFormText}
                  name="email"
                  placeholder="Email"
                  required
                  errorText={touched.email && errors.email}
                  id="login_email"
                />
                <Field
                  component={FinalFormText}
                  name="password"
                  placeholder="Password"
                  inputType="password"
                  required
                  errorText={touched.password && errors.password}
                  id="login_password"
                />
                <Button
                  disabled={pristine || submitting}
                  onClick={handleSubmit}
                  type="submit"
                  fullWidth
                  size="large"
                  variant="contained"
                  id="login_submit"
                  sx={{ mt: 3, mb: 2 }}
                >
                  {isLoad ? (
                    <CircularProgress size={25} color="secondary" />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Box>
            </Box>
          )}
        />
      </Grid>
    </Grid>
  );
};

LoginScreen.propTypes = {
  callResetMessage: PropTypes.func,
  callLoginAPI: PropTypes.func,
  isLoad: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

LoginScreen.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => ({
  message: state.auth.message,
  isLoad: state.auth.isLoad,
  loadErr: state.auth.loadErr,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callLoginAPI: (...params) => dispatch(login(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(LoginScreen);

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  CircularProgress,
  CssBaseline,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import Sidebar from '../../components/sidebar';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSnackbar } from 'notistack';
import WindowTitle from '../../components/window-name/index.jsx';
import Clock from '../../components/clock';
import { Field, Form } from 'react-final-form';
import FinalFormText from '../../components/final-form/input-text';
import Button from '@mui/material/Button';
import { connect } from 'react-redux';
import createDecorator from 'final-form-focus';
import { LoadingButton } from '@mui/lab';
import { passwordMessageReset, passwordUpdate } from './action';
import { getMyProfile } from '../welcome/action';
import { strictValidObjectWithKeys } from '../../utils/common-utils';
import { useNavigate } from 'react-router-dom';
import arrayMutators from 'final-form-arrays';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    backgroundColor: '#fff',
  },
  tabStyle: {
    backgroundColor: '#E3E3E3',
  },
  button: {
    margin: theme.spacing(1),
  },
  buttonMargin: {
    margin: theme.spacing(3, 0),
  },
  titleWidth: {
    width: 250,
    margin: theme.spacing(1, 0),
    fontSize: 35,
    textAlign: 'left',
  },
  subtitleWidth: {
    width: 400,
    margin: theme.spacing(1, 0),
    fontSize: 40,
    textAlign: 'left',
  },
  avatar: {
    boxShadow: theme.shadows[3],
  },
}));
const focusOnErrors = createDecorator();
const Settings = ({
  callGetMyProfileApi,
  isLoad,
  loadErr,
  callUpdatePasswprdApi,
  callResetMessageApi,
  message,
  userprofile,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    callGetMyProfileApi();
  }, []);

  const submitPassword = async (values) => {
    try {
      if (values.new_password.length < 8) {
        enqueueSnackbar('Password Must be at least 8 characters', {
          variant: 'error',
        });
      } else {
        setLoading(true);
        const data = {
          current_password: values.current_password,
          updated_password: values.confirm_new_password,
        };
        const res = await callUpdatePasswprdApi(data);
        if (res) {
          setLoading(false);
          setTimeout(() => {
            callResetMessageApi();
          }, 2000);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (loadErr) {
      enqueueSnackbar(loadErr, {
        variant: 'error',
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
      setTimeout(() => {
        callResetMessageApi();
      }, 2000);
      setLoading(false);
    }
  }, [loadErr]);

  const clearVal = (form) => {
    form.batch(() => {
      form.change('current_password', '');
      form.change('new_password', '');
      form.change('confirm_new_password', '');
    });
  };

  useEffect(() => {
    if (message) {
      enqueueSnackbar(message, {
        variant: 'success',
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
    }
  }, [message]);

  return (
    <div className={classes.root}>
      <WindowTitle title="Settings" />
      <CssBaseline />
      <Sidebar onChange={() => console.log()} />
      <main className={classes.content}>
        <Box
          style={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingBottom: 15,
            paddingTop: 15,
          }}
          className={classes.tabStyle}
          flexDirection={'row'}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Typography variant="h4"></Typography>
          <Clock />
        </Box>

        <Form
          onSubmit={submitPassword}
          decorators={[focusOnErrors]}
          mutators={{
            // potentially other mutators could be merged here
            ...arrayMutators,
          }}
          keepDirtyOnReinitialize
          initialValues={{
            current_password: '',
            new_password: '',
            confirm_new_password: '',
          }}
          validate={(values) => {
            const errors = {};
            if (!values.current_password) {
              errors.current_password = 'Current Password is Required';
            }
            if (!values.new_password) {
              errors.new_password = 'Password is Required';
            } else if (values.new_password.length < 8) {
              errors.new_password = 'Password Must be at least 8 characters';
            }
            if (!values.confirm_new_password) {
              errors.confirm_new_password = 'Confirm Password is Required';
            } else if (values.confirm_new_password !== values.new_password) {
              errors.confirm_new_password =
                'Confirm Password Must Match the Password';
            }

            return errors;
          }}
          render={({
            handleSubmit,
            pristine,
            values,
            submitting,
            valid,
            touched,
            errors,
            form,
          }) => {
            return (
              <Grid mx={10} item xs={12} md={12} lg={12}>
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <Avatar
                    className={classes.avatar}
                    sx={{
                      mt: 7,
                      width: 220,
                      height: 220,
                      fontWeight: '500',
                      // border: '4.5px solid white',
                    }}
                  ></Avatar>
                  <Box>
                    <Typography
                      sx={{ mt: 20, ml: 5 }}
                      style={{ fontSize: 33 }}
                      variant="h4"
                    >
                      {strictValidObjectWithKeys(userprofile) &&
                        userprofile.first_name + ' ' + userprofile.last_name}
                    </Typography>
                    <Typography sx={{ my: 1, ml: 5 }} style={{ fontSize: 20 }}>
                      {strictValidObjectWithKeys(userprofile) &&
                        (`${userprofile.email_id}` || 'N/A')}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography
                    sx={{ mt: 8 }}
                    style={{ fontSize: 30 }}
                    variant="h4"
                  >
                    Password
                  </Typography>
                  <Typography sx={{ my: 0.5, mb: 4 }} style={{ fontSize: 17 }}>
                    Please enter your current password to change your password
                  </Typography>
                </Box>
                <Divider />
                <Box
                  sx={{ width: '1000px', mt: 2, mb: 4 }}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexDirection={'row'}
                >
                  <Typography sx={{ width: 400, mr: 19 }} variant="h1">
                    Current Password
                  </Typography>
                  <Field
                    style={{ width: '700px', backgroundColor: '#fff' }}
                    component={FinalFormText}
                    name="current_password"
                    placeholder="Current Password"
                    required
                    errorText={
                      touched.current_password && errors.current_password
                    }
                    type="password"
                  />
                </Box>
                <Divider />
                <Box
                  sx={{ width: '1000px', mt: 2, mb: 4 }}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexDirection={'row'}
                >
                  <Typography sx={{ width: 400, mr: 19 }} variant="h1">
                    New Password
                  </Typography>
                  <Field
                    style={{ width: '700px', backgroundColor: '#fff' }}
                    component={FinalFormText}
                    name="new_password"
                    placeholder="New Password"
                    required
                    disabled={!values.current_password}
                    errorText={touched.new_password && errors.new_password}
                    type="password"
                  />
                </Box>
                <Divider />
                <Box
                  sx={{ width: '1000px', mt: 2, mb: 4 }}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexDirection={'row'}
                >
                  <Typography sx={{ width: 400, mr: 19 }} variant="h1">
                    Confirm New Password
                  </Typography>
                  <Field
                    component={FinalFormText}
                    style={{ width: '700px', backgroundColor: '#fff' }}
                    backgroundColor="#ffffff"
                    name="confirm_new_password"
                    placeholder="Confirm New Password"
                    disabled={!values.new_password || !values.current_password}
                    required
                    errorText={
                      touched.confirm_new_password &&
                      errors.confirm_new_password
                    }
                    type="password"
                  />
                </Box>
                <Divider />
                <Box
                  sx={{ width: '610px', mt: 5, ml: 49 }}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexDirection={'row'}
                >
                  <LoadingButton
                    disabled={pristine || submitting || !valid}
                    onClick={() => {
                      submitPassword(values);
                      setTimeout(() => {
                        clearVal(form, values);
                      }, 1000);
                    }}
                    type="submit"
                    fullWidth
                    size="large"
                    variant="contained"
                    loading={loading}
                    sx={{ mr: 2 }}
                  >
                    {isLoad ? (
                      <CircularProgress size={25} color="secondary" />
                    ) : (
                      'Update Password'
                    )}
                  </LoadingButton>
                  <Button
                    onClick={() => navigate('/')}
                    fullWidth
                    color="error"
                    variant="outlined"
                    size="large"
                  >
                    {'Cancel'}
                  </Button>
                </Box>
              </Grid>
            );
          }}
        />
      </main>
    </div>
  );
};

const mapStateToProps = (state) => ({
  message: state.passwordUpdate.changePass.message,
  isLoad: state.passwordUpdate.changePass.isLoad,
  loadErr: state.passwordUpdate.changePass.loadErr,
  userprofile: state.profile.userprofile,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callResetMessageApi: (...params) => dispatch(passwordMessageReset(...params)),
  callUpdatePasswprdApi: (...params) => dispatch(passwordUpdate(...params)),
  callGetMyProfileApi: (...params) => dispatch(getMyProfile(...params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

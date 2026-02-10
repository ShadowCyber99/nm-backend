/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Badge,
  Chip,
  Divider,
  Grid,
  IconButton,
  Input,
  Stack,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Field, Form } from 'react-final-form';
import Typography from '@mui/material/Typography';
import FinalFormText from '../../../components/final-form/input-text';
import FinalFormSelect from '../../../components/final-form/final-form-dropdown';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { CircularProgress } from '@mui/material';
import createDecorator from 'final-form-focus';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import {
  createDriver,
  getAllDrivers,
  driverUserList,
  getActiveCapabilityRoles,
  updatePassword,
} from '../action';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
  strictValidArray,
} from '../../../utils/common-utils';
import EditIcon from '@mui/icons-material/Edit';
import { useSnackbar } from 'notistack';
import TextMaskCustom from '../../../components/custom-input-mask';
import GoogleMapsPoc from '../../../components/poc-google';
import MDSelect from '../../../components/mdselect';
import Dialog from '../../../components/dialog';

const apiHost = process.env.REACT_APP_BASE_URL;
const focusOnErrors = createDecorator();
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    backgroundColor: '#F3F3F3',
  },
  tabStyle: {
    backgroundColor: '#E3E3E3',
  },
  margin: {
    margin: theme.spacing(4, 0, 1),
  },
  generalMargin: {
    margin: theme.spacing(1, 0, 0),
  },
  input: { display: 'none' },
  profileContainer: {
    marginLeft: theme.spacing(2),
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
  },
  mainHeaderText: {
    fontSize: 16,
    fontWeight: '700',
  },
  editicon: {
    left: theme.spacing(25),
    top: theme.spacing(22),
  },
}));

const AddDriverDetails = ({
  setValue,
  type,
  callCreateDriverApi,
  capabilityRolesFromState,
  userDriverListFromState,
  callCapabilityRolesApi,
  callAllDriversApi,
  callDriverUserList,
  callUpdatePasswprdApi,
  userData,
}) => {
  const classes = useStyles();
  const [fileUpload, setUploadFiles] = useState({});
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isLoad, setLoad] = useState(false);
  const [imagePreviewUrl, setUrl] = useState('');
  const [capabilityRole, setCapabilityRole] = useState([]);
  const [driverUser, setDriverUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    callCapabilityRolesApi();
    let driver_data = {};
    if (strictValidObjectWithKeys(userData)) {
      driver_data = { user_id: userData.user_id };
    }
    callDriverUserList(driver_data);
  }, []);

  const uploadFile = (event) => {
    if (event.target.files[0]) {
      setUploadFiles(event.target.files[0]);
      let reader = new FileReader();
      let file = event.target.files[0];
      reader.onloadend = () => {
        setUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (val) => {
    setLoad(true);
    const {
      first_name,
      last_name,
      phone_number,
      capability_id,
      user_id,
      driver_address,
    } = val;
    const token = await localStorage.getItem('authToken');
    const parsedToken = JSON.parse(token);
    const formData = new FormData();
    if (strictValidObjectWithKeys(userData)) {
      if (strictValidString(fileUpload.name)) {
        formData.append('profile_image', fileUpload, fileUpload.name);
      }
      formData.append('first_name', first_name);
      formData.append('user_id', user_id);
      formData.append('last_name', last_name);
      formData.append('phone_number', phone_number);
      formData.append('capability_id', capability_id);
      formData.append('address', driver_address);
      axios
        .put(`${apiHost}/admin/driver/${userData.driver_id}`, formData, {
          headers: {
            authorization: `${parsedToken}`,
          },
        })
        .then((res) => {
          setLoad(false);
          if (res.data.status === 1) {
            setValue();
            callAllDriversApi();
            setDriverUser([]);
            success(res.data.message);
          } else if (res.data.status === 0) {
            errorSnack(res.data.message);
          }
        });
    } else {
      if (strictValidString(fileUpload.name)) {
        formData.append('profile_image', fileUpload, fileUpload.name);
      }
      formData.append('first_name', first_name);
      formData.append('user_id', user_id);
      formData.append('last_name', last_name);
      formData.append('phone_number', phone_number);
      formData.append('capability_id', capability_id);
      formData.append('address', driver_address);
      axios
        .post(`${apiHost}/admin/driver`, formData, {
          headers: {
            authorization: `${parsedToken}`,
          },
        })
        .then((res) => {
          setLoad(false);
          if (res.data.status === 1) {
            setValue();
            callAllDriversApi();
            setDriverUser([]);
            success(res.data.message);
          } else if (res.data.status === 0) {
            errorSnack(res.data.message);
          }
        });
    }
  };

  const success = (message) => {
    enqueueSnackbar(message, {
      variant: 'success',
      preventDuplicate: true,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
    });
  };

  const errorSnack = (loadErr) => {
    enqueueSnackbar(loadErr, {
      variant: 'error',
      preventDuplicate: true,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
    });
  };

  useEffect(() => {
    if (strictValidArrayWithLength(userDriverListFromState)) {
      let driverUserArray = userDriverListFromState.map((a) => {
        return {
          value: a.user_id,
          title: a.email_id,
          first_name: a.first_name,
          last_name: a.last_name,
          address: a.address,
          email_id: a.email_id,
          phone_number: a.phone_number,
        };
      });
      setDriverUser(driverUserArray);
    } else {
      setDriverUser([]);
    }
  }, [userDriverListFromState]);

  useEffect(() => {
    const roleArray = [];
    if (strictValidArrayWithLength(capabilityRolesFromState)) {
      // eslint-disable-next-line array-callback-return
      capabilityRolesFromState.map((a) => {
        roleArray.push({
          value: a.capability_id,
          title: a.name,
        });
      });
    }
    setCapabilityRole(roleArray);
  }, [capabilityRolesFromState]);

  const renderprofileImage = () => {
    if (imagePreviewUrl) {
      return (
        <Avatar
          src={imagePreviewUrl}
          sx={{
            width: 130,
            height: 130,
            bgcolor: '#0884c7',
          }}
        ></Avatar>
      );
    } else if (
      strictValidObjectWithKeys(userData) &&
      strictValidString(userData.profile_image)
    ) {
      return (
        <Avatar
          src={'http://localhost:3000/d73d459b-31e9-4ac1-bb9b-1aedccb7b88e'}
          sx={{
            width: 130,
            height: 130,
            bgcolor: '#0884c7',
          }}
        >
          <Avatar
            src={`${apiHost}/${userData.profile_image}`}
            sx={{
              width: 120,
              height: 120,
            }}
          />
        </Avatar>
      );
    } else {
      return (
        <Avatar
          src={'http://localhost:3000/d73d459b-31e9-4ac1-bb9b-1aedccb7b88e'}
          sx={{
            width: 130,
            height: 130,
            bgcolor: '#0884c7',
          }}
        ></Avatar>
      );
    }
  };

  const checkSelected = (v) => {
    let obj =
      strictValidArrayWithLength(capabilityRole) &&
      capabilityRolesFromState.filter((o) => o.capability_id === v);
    return obj;
  };

  const checkDisabledValues = (pristine, submitting, valid) => {
    if (imagePreviewUrl && valid) {
      return false;
    } else if (pristine || submitting || !valid) {
      return true;
    } else {
      return false;
    }
  };
  const buttonName = type === 'edit' ? 'Update Driver' : 'Create Driver';
  const toggle = () => {
    setIsOpenDialog(!isOpenDialog);
    // renderDialog();
  };

  const submitPassword = async (values) => {
    if (values.password.length < 8) {
      enqueueSnackbar('Password Must be at least 8 characters', {
        variant: 'error',
      });
    } else {
      setLoading(true);
      const data = {
        password: values.password,
        user_id: userData.user_id,
      };
      const res = await callUpdatePasswprdApi(data);
      if (res) {
        setLoading(false);
        toggle();
      }
    }
  };

  const renderDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        isOpen={isOpenDialog}
        title={'Update Password'}
        handleClose={() => {
          toggle();
        }}
      >
        <Form
          onSubmit={submitPassword}
          keepDirtyOnReinitialize
          decorators={[focusOnErrors]}
          initialValues={{
            password: '',
            confirm: '',
          }}
          validate={(values) => {
            const errors = {};
            if (!values.password) {
              errors.password = 'Password is Required';
            }
            if (!values.confirm) {
              errors.confirm = 'Confirm Password is Required';
            } else if (values.confirm !== values.password) {
              errors.confirm = 'Confirm Password Must Match the Password';
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
          }) => {
            return (
              <form handleSubmit={(e) => e.preventDefault()}>
                <Field
                  component={FinalFormText}
                  name="password"
                  placeholder="Password"
                  required
                  errorText={touched.password && errors.password}
                  type="password"
                ></Field>
                <Field
                  component={FinalFormText}
                  name="confirm"
                  placeholder="Confirm Password"
                  required
                  errorText={touched.confirm && errors.confirm}
                  type="password"
                />

                <LoadingButton
                  disabled={pristine || submitting || !valid}
                  onClick={handleSubmit}
                  type="submit"
                  fullWidth
                  size="large"
                  variant="contained"
                  loading={loading}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {'Update Password'}
                </LoadingButton>
              </form>
            );
          }}
        />
      </Dialog>
    );
  };

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <Grid item xs={12} md={12} lg={12}>
          <Form
            onSubmit={onSubmit}
            decorators={[focusOnErrors]}
            keepDirtyOnReinitialize
            validate={(values) => {
              const errors = {};
              if (!values.user_id) {
                errors.user_id = 'Email Id is Required';
              }
              if (!values.last_name) {
                errors.last_name = 'Last Name is Required';
              }
              if (!values.phone_number) {
                errors.phone_number = 'Phone Number is Required';
              }
              if (!strictValidArrayWithLength(values.capability_id)) {
                errors.capability_id = 'Capability is Required';
              }

              return errors;
            }}
            initialValues={{
              user_id: strictValidObjectWithKeys(userData)
                ? userData.user_id
                : '',
              first_name: strictValidObjectWithKeys(userData)
                ? userData.first_name
                : '',
              last_name: strictValidObjectWithKeys(userData)
                ? userData.last_name
                : '',
              phone_number: strictValidObjectWithKeys(userData)
                ? userData.phone_number
                : '',
              capability_id:
                strictValidObjectWithKeys(userData) &&
                strictValidArray(userData.capability_id)
                  ? userData.capability_id
                  : [],
              driver_address: strictValidObjectWithKeys(userData)
                ? userData.address
                : '',
              imageurl: '',
            }}
            render={({
              handleSubmit,
              pristine,
              values,
              submitting,
              touched,
              errors,
              form,
              valid,
            }) => {
              return (
                <Box>
                  <Stack
                    direction="row"
                    alignItems={'center'}
                    justifyContent={'space-between'}
                  >
                    <Typography className={classes.mainHeaderText}>
                      {strictValidObjectWithKeys(userData)
                        ? 'Edit Driver'
                        : 'Setup Driver'}
                    </Typography>
                    {strictValidObjectWithKeys(userData) && (
                      <Button
                        size="medium"
                        variant="contained"
                        onClick={() => toggle()}
                        color="primary"
                        className={classes.button}
                      >
                        Update Password
                      </Button>
                    )}
                  </Stack>
                  <Divider className={classes.generalMargin} />
                  <Stack mt={3}>
                    <Typography className={classes.headerText}>
                      General Information
                    </Typography>
                  </Stack>
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Grid container>
                        <Grid container xs={6}>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                            }}
                            badgeContent={
                              <label htmlFor="contained-button-file">
                                <div className={classes.editicon}>
                                  <Input
                                    accept="image/*"
                                    id="contained-button-file"
                                    type="file"
                                    onChange={(event) => {
                                      uploadFile(event);
                                      if (event.target.files[0]) {
                                        let reader = new FileReader();
                                        let file = event.target.files[0];
                                        reader.onloadend = () => {
                                          form.batch(() => {
                                            form.change(
                                              'imageurl',
                                              reader.result,
                                            );
                                          });
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                    className={classes.input}
                                  />
                                  <IconButton
                                    component="span"
                                    color="primary"
                                    aria-label="upload picture"
                                  >
                                    <EditIcon
                                      sx={{
                                        fontSize: 24,
                                      }}
                                    />
                                  </IconButton>
                                </div>
                              </label>
                            }
                          >
                            {renderprofileImage()}
                          </Badge>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={{
                          xs: 2,
                          md: 3,
                        }}
                        columns={{
                          xs: 4,
                          sm: 4,
                          md: 12,
                        }}
                      >
                        <Grid item xs={4} sm={4} md={6}>
                          <Field id="add_driver_email_id" name="user_id">
                            {({ meta, input }) => (
                              <>
                                <MDSelect
                                  onChange={(e) => {
                                    input.onChange(e.target.value);
                                    driverUser.map((a) => {
                                      if (a.value === e.target.value) {
                                        return form.batch(() => {
                                          form.change(
                                            'first_name',
                                            a.first_name,
                                          );
                                          form.change('last_name', a.last_name);
                                          form.change(
                                            'phone_number',
                                            a.phone_number,
                                          );
                                          form.change(
                                            'driver_address',
                                            a.address,
                                          );
                                        });
                                      }
                                    });
                                  }}
                                  value={input.value}
                                  disabled={
                                    strictValidObjectWithKeys(userData) ||
                                    !strictValidArrayWithLength(driverUser)
                                  }
                                  data={driverUser}
                                  errorText={meta.touched && meta.error}
                                  placeholder="Email Id"
                                  onBlur={(e) => {
                                    input.onBlur(e.target.value);
                                  }}
                                />
                              </>
                            )}
                          </Field>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={{
                          xs: 2,
                          md: 3,
                        }}
                        columns={{
                          xs: 2,
                          sm: 4,
                          md: 12,
                        }}
                      >
                        <Grid item xs={1} sm={2} md={3}>
                          <Field
                            component={FinalFormText}
                            name="first_name"
                            id="add_driver_first_name"
                            placeholder="First Name"
                            required
                            // errorText={touched.first_name && errors.first_name}
                            disabled
                          />
                        </Grid>
                        <Grid item xs={1} sm={2} md={3}>
                          <Field
                            component={FinalFormText}
                            id="add_driver_last_name"
                            name="last_name"
                            placeholder="Last Name"
                            required
                            // errorText={touched.last_name && errors.last_name}
                            disabled
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={{
                          xs: 2,
                          md: 3,
                        }}
                        columns={{
                          xs: 4,
                          sm: 4,
                          md: 12,
                        }}
                      >
                        <Grid item xs={4} sm={2} md={4}>
                          <Field
                            id="add_driver_phone_number"
                            name={'phone_number'}
                          >
                            {({ meta, input }) => (
                              <>
                                <TextMaskCustom
                                  {...input}
                                  label={'Phone Number'}
                                  // errorText={meta.touched && meta.error}
                                  disabled
                                  defaultValue={input.value}
                                  onChangeText={(v) => {
                                    input.onChange(v);
                                  }}
                                />
                              </>
                            )}
                          </Field>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={{
                          xs: 2,
                          md: 3,
                        }}
                        columns={{
                          xs: 4,
                          sm: 4,
                          md: 12,
                        }}
                      >
                        <Grid item xs={4} sm={2} md={4}>
                          <Field
                            id="add_driver_driver_address"
                            name="driver_address"
                          >
                            {({ meta, input }) => (
                              <div>
                                <GoogleMapsPoc
                                  {...input}
                                  label={'Address'}
                                  defaultValue={input.value}
                                  disabled
                                  selectOption={(v) => {
                                    if (strictValidObjectWithKeys(v)) {
                                      input.onChange(v.description);
                                    }
                                  }}
                                  onChangeText={(v) => {
                                    if (strictValidObjectWithKeys(v)) {
                                      input.onChange(v.description);
                                    } else {
                                      input.onChange(v);
                                    }
                                  }}
                                />
                              </div>
                            )}
                          </Field>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={{
                          xs: 2,
                          md: 3,
                        }}
                        columns={{
                          xs: 4,
                          sm: 4,
                          md: 12,
                        }}
                      >
                        <Grid item xs={4} sm={2} md={3}>
                          <Field
                            component={FinalFormSelect}
                            name="capability_id"
                            placeholder="Capability"
                            id="add_driver_capability"
                            required
                            isMultiple
                            disabled={
                              !values.user_id ||
                              !strictValidArrayWithLength(capabilityRole)
                            }
                            items={capabilityRole}
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => {
                                  const chipName = checkSelected(value);
                                  const name =
                                    strictValidArrayWithLength(chipName) &&
                                    strictValidObjectWithKeys(chipName[0])
                                      ? chipName[0].name
                                      : '';
                                  const chipColor =
                                    strictValidArrayWithLength(chipName) &&
                                    strictValidObjectWithKeys(chipName[0])
                                      ? chipName[0].color
                                      : '#0884c7';
                                  return (
                                    <>
                                      {strictValidString(name) && (
                                        <Chip
                                          key={value}
                                          style={{
                                            textTransform: 'uppercase',
                                            marginTop: 5,
                                            backgroundColor: chipColor,
                                            color: '#ffff',
                                          }}
                                          color="primary"
                                          size="small"
                                          label={name}
                                        />
                                      )}
                                    </>
                                  );
                                })}
                              </Box>
                            )}
                            errorText={
                              touched.capability_id && errors.capability_id
                            }
                          />
                        </Grid>
                      </Grid>

                      <Divider className={classes.margin} />
                      <Grid
                        container
                        spacing={{
                          xs: 2,
                          md: 4,
                        }}
                        columns={{
                          xs: 4,
                          sm: 4,
                          md: 12,
                        }}
                      >
                        <Grid item xs={4} sm={6} md={8}>
                          <Button
                            disabled={checkDisabledValues(
                              pristine,
                              submitting,
                              valid,
                            )}
                            onClick={handleSubmit}
                            size="large"
                            id={type.buttonName}
                            variant="contained"
                            startIcon={<CheckIcon />}
                            sx={{
                              mt: 2,
                              mb: 2,
                            }}
                          >
                            {isLoad ? (
                              <CircularProgress size={15} color="secondary" />
                            ) : (
                              buttonName
                            )}
                          </Button>
                          <Button
                            onClick={() => setValue('1')}
                            type="submit"
                            color="error"
                            size="large"
                            id="add_driver_cancel_btn"
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            sx={{
                              mt: 2,
                              mb: 2,
                              mx: 2,
                            }}
                          >
                            Cancel
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Box>
              );
            }}
          />
        </Grid>
      </main>
      {renderDialog()}
    </div>
  );
};
AddDriverDetails.propTypes = {
  callAllDriversApi: PropTypes.func,
  callCreateDriverApi: PropTypes.func,
  isLoad: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.string,
};

AddDriverDetails.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
  type: 'add',
};

const mapStateProps = (state) => {
  return {
    message: state.drivers.message,
    isLoad: state.drivers.isLoad,
    loadErr: state.drivers.loadErr,
    allDriversFromState: state.drivers.all_drivers,
    capabilityRolesFromState: state.drivers.roles,
    userDriverListFromState: state.drivers.user_driver_list,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callCreateDriverApi: (...params) => dispatch(createDriver(...params)),
  callAllDriversApi: (...params) => dispatch(getAllDrivers(...params)),
  callDriverUserList: (...params) => dispatch(driverUserList(...params)),
  callCapabilityRolesApi: (...params) =>
    dispatch(getActiveCapabilityRoles(...params)),
  callUpdatePasswprdApi: (...params) => dispatch(updatePassword(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(AddDriverDetails);

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import {
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import { Field, Form } from 'react-final-form';
import Typography from '@mui/material/Typography';
import FinalFormText from '../../../components/final-form/input-text';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { connect } from 'react-redux';
import {
  createUser,
  updateUser,
  getRoles,
  resetMessage,
  updatePassword,
  resetSuccessMessage,
  getCostCenter,
} from '.././action';
import { CircularProgress } from '@mui/material';
import createDecorator from 'final-form-focus';
import { FIRST_NAME, MINIMUM_LENGTH, VALID_EMAIL } from '../../../utils/regexs';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  strictValidArrayWithLength,
  strictValidNumber,
  strictValidObjectWithKeys,
} from '../../../utils/common-utils';
import GoogleMapsPoc from '../../../components/poc-google';
import TextMaskCustom from '../../../components/custom-input-mask';
import Dialog from '../../../components/dialog';
import { getCorporateAccount } from '../../trip-management/action';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import MDSelect from '../../../components/mdselect';
import MDMultiSelect from '../../../components/mdmultiselect';

const send_sms_of_trip = [
  { value: 'requested', title: 'REQUESTED' },
  { value: 'allocated', title: 'ALLOCATED' },
  { value: 'completed', title: 'COMPLETED' },
  { value: 'noshow', title: 'NOSHOW' },
  { value: 'cancelled', title: 'CANCELLED' },
  { value: 'dispatched', title: 'DISPATCHED' },
  { value: 'en_route', title: 'EN_ROUTE' },
  { value: 'arrived_at_pick_up', title: 'ARRIVED AT PICKUP' },
  { value: 'patient_loaded', title: 'PATIENT LOADED' },
  { value: 'arrived_at_drop_off', title: 'ARRIVED AT DROP OFF' },
  { value: 'password_change', title: 'PASSWORD CHANGE' },
];
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
  headerText: {
    fontSize: 14,
    fontWeight: '700',
  },
  mainHeaderText: {
    fontSize: 16,
    fontWeight: '700',
  },
  button: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(2),
    backgroundColor: '#FAFAFA',
  },
  textField: {
    width: '100%',
  },
  input: {
    fontSize: 14,
  },
  helperText: {
    margin: `${theme.spacing(0.2, 0, 0, 0)} !important`,
    backgroundColor: '#F3F3F3',
  },
  disabledCheckbox: {
    backgroundColor: '#F3F3F3',
  },
}));
export const AddUser = ({
  callAddUserApi,
  callUpdateUser,
  isLoad,
  loadErr,
  message,
  callResetMessageApi,
  callUserRolesApi,
  roles,
  callUpdatePasswprdApi,
  callCorporateAccountApi,
  corporateAccountFromState,
  callResetSuccessMessageApi,
  setValue,
  setUserData,
  userdata,
  callGetCostCenterApi,
  constArray,
}) => {
  const [role, setRoles] = useState([]);
  const [corporate_account, setCorporateAccountApi] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [roleId, setRoleId] = useState('');
  const [const_array, setCostArray] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const corporateAccountArray = [];
    if (strictValidArrayWithLength(corporateAccountFromState)) {
      corporateAccountFromState.map((a) => {
        corporateAccountArray.push({
          value: a.account_id,
          title: a.name,
        });
      });
    }
    setCorporateAccountApi(corporateAccountArray);
  }, [corporateAccountFromState]);

  useEffect(() => {
    if (
      strictValidObjectWithKeys(userdata) &&
      strictValidNumber(userdata.account_id)
    ) {
      const data = {
        account_id: userdata.account_id,
      };
      callGetCostCenterApi(data);
    }
    if (strictValidObjectWithKeys(userdata)) {
      setRoleId(userdata.role_id);
    }
  }, [userdata]);

  useEffect(() => {
    if (strictValidObjectWithKeys(userdata) && userdata.role_id !== 7) {
      setCostArray([]);
    }
  }, [roleId]);

  useEffect(() => {
    const arr = [];
    if (strictValidArrayWithLength(constArray)) {
      strictValidObjectWithKeys(constArray[0]) &&
        constArray[0].account_field.map((a) => {
          strictValidArrayWithLength(a.cost_center_value) &&
            a.cost_center_value.map((b) => {
              arr.push({
                value: b.id,
                title: b.value,
              });
            });
        });
    }
    setCostArray(arr);
  }, [constArray]);

  useEffect(() => {
    const roleArray = [];
    if (strictValidArrayWithLength(roles)) {
      roles.map((a) => {
        roleArray.push({
          value: a.Role_ID,
          title: a.Role_Name,
        });
      });
    }
    setRoles(roleArray);
  }, [roles]);

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

  useEffect(() => {
    if (message)
      enqueueSnackbar(message, {
        variant: 'success',
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
  }, [message]);
  const buttonName = strictValidObjectWithKeys(userdata)
    ? 'Update User'
    : 'Create User';

  const onSubmit = async (values) => {
    if (strictValidObjectWithKeys(userdata) && userdata.user_id) {
      let {
        first_name,
        last_name,
        role_id,
        phone_number,
        address,
        account_id,
        send_sms_of_trip,
        account_field,
      } = values;
      const res = await callUpdateUser({
        user_id: userdata.user_id,
        values: {
          first_name: first_name,
          last_name: last_name,
          phone_number: phone_number,
          role_id: role_id,
          address: address,
          account_id: account_id,
          send_sms_of_trip: send_sms_of_trip,
          account_field: account_field,
        },
      });
      if (res) {
        setValue('1');
        callResetMessageApi();
        setUserData({});
      }
    } else {
      const res = await callAddUserApi({
        ...values,
        enabled: 1,
      });
      if (res) {
        callResetMessageApi();
        setValue('1');
      } else {
        callResetMessageApi();
      }
    }
  };

  const toggle = () => {
    setIsOpenDialog(!isOpenDialog);
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
        user_id: userdata.user_id,
      };
      const res = await callUpdatePasswprdApi(data);
      if (res) {
        setLoading(false);
        toggle();
        setTimeout(() => {
          callResetSuccessMessageApi();
        }, 2000);
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
                />
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
  const checkDisabledValues = (array) => {
    if (array.includes('all')) {
      return true;
    }
    if (array.includes('')) {
      return true;
    } else if (array.includes('')) {
      return false;
    }
  };
  return (
    <Grid item xs={12} md={12} lg={12}>
      <Form
        onSubmit={onSubmit}
        decorators={[focusOnErrors]}
        keepDirtyOnReinitialize
        validate={(values) => {
          const errors = {};
          if (!values.first_name) {
            errors.first_name = 'First Name is Required';
          } else if (!FIRST_NAME.test(values.first_name)) {
            errors.first_name = 'Please Enter valid First Name';
          }
          if (!values.last_name) {
            errors.last_name = 'Last Name is Required';
          } else if (!FIRST_NAME.test(values.last_name)) {
            errors.last_name = 'Please Enter valid Last Name';
          }
          if (!values.email_id) {
            errors.email_id = 'Email is Required';
          } else if (!VALID_EMAIL.test(values.email_id)) {
            errors.email_id = 'Please Enter valid Email Id';
          }
          if (!values.phone_number) {
            errors.phone_number = 'Phone Number is Required';
          } else if (!MINIMUM_LENGTH.test(values.phone_number)) {
            errors.phone_number = 'Please Enter Valid Phone Number';
          }
          if (!values.role_id) {
            errors.role_id = 'Role is Required';
          }
          if (
            !strictValidArrayWithLength(values.account_field) &&
            strictValidArrayWithLength(const_array)
          ) {
            errors.account_field = 'Cost Center is Required';
          }
          if (values.role_id === 7 && !values.account_id) {
            errors.account_id = 'Account is Required';
          }
          return errors;
        }}
        initialValues={{
          first_name: strictValidObjectWithKeys(userdata)
            ? userdata.first_name
            : '',
          last_name: strictValidObjectWithKeys(userdata)
            ? userdata.last_name
            : '',
          email_id: strictValidObjectWithKeys(userdata)
            ? userdata.email_id
            : '',
          address: strictValidObjectWithKeys(userdata) ? userdata.address : '',
          phone_number: strictValidObjectWithKeys(userdata)
            ? userdata.phone_number
            : '',
          account_field:
            strictValidObjectWithKeys(userdata) &&
            strictValidArrayWithLength(userdata.account_field)
              ? userdata.account_field
              : [],
          role_id: strictValidObjectWithKeys(userdata) ? userdata.role_id : '',
          account_id: strictValidObjectWithKeys(userdata)
            ? userdata.account_id
            : '',
          send_sms_of_trip: strictValidObjectWithKeys(userdata)
            ? userdata.send_sms_of_trip
            : [],
        }}
        render={({
          handleSubmit,
          pristine,
          submitting,
          touched,
          errors,
          valid,
          values,
          form,
        }) => {
          return (
            <Box>
              <Stack
                direction="row"
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Typography className={classes.mainHeaderText}>
                  {strictValidObjectWithKeys(userdata)
                    ? 'Edit User'
                    : ' New User'}
                </Typography>
                {strictValidObjectWithKeys(userdata) && (
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
                  General Information:
                </Typography>
              </Stack>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <Box sx={{ flexGrow: 1 }}>
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
                    <Grid item xs={2} sm={2} md={3}>
                      <Field
                        component={FinalFormText}
                        name="first_name"
                        placeholder="First Name"
                        required
                        id="user_create_first_name"
                        errorText={touched.first_name && errors.first_name}
                      />
                    </Grid>
                    <Grid item xs={2} sm={2} md={3}>
                      <Field
                        component={FinalFormText}
                        name="last_name"
                        placeholder="Last Name"
                        id="user_create_last_name"
                        required
                        errorText={touched.last_name && errors.last_name}
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
                    <Grid item xs={2} sm={2} md={6}>
                      <Field
                        component={FinalFormText}
                        name="email_id"
                        id="user_create_email_id"
                        placeholder="Email Id"
                        required
                        errorText={touched.email_id && errors.email_id}
                        disabled={strictValidObjectWithKeys(userdata)}
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
                    <Grid item xs={2} sm={2} md={6}>
                      <Field name="address">
                        {({ meta, input }) => (
                          <div>
                            <GoogleMapsPoc
                              {...input}
                              label={'Address'}
                              id="user_create_address"
                              defaultValue={input.value}
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
                    <Grid item xs={2} sm={2} md={4}>
                      <Field name={'phone_number'}>
                        {({ meta, input }) => (
                          <>
                            <TextMaskCustom
                              {...input}
                              label={'Phone Number'}
                              onBlur={(event) => input.onBlur(event)}
                              required
                              id="user_create_phone_number"
                              errorText={meta.touched && meta.error}
                              defaultValue={input.value}
                              onChangeText={(v) => {
                                // if (v === '+1(') {
                                //   input.onChange('');
                                // } else {
                                //   input.onChange(v);
                                // }
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
                    <Grid item xs={2} sm={2} md={3}>
                      <Field id="role_id" name={'role_id'}>
                        {({ meta, input }) => (
                          <>
                            <MDSelect
                              required={true}
                              name={'role_id'}
                              onChange={(e) => {
                                input.onChange(e.target.value);
                                if (
                                  strictValidNumber(e.target.value) &&
                                  e.target.value !== 7
                                ) {
                                  setCostArray([]);
                                }
                                form.batch(() => {
                                  form.change('role_id', e.target.value);
                                });
                              }}
                              placeholder="Role Type"
                              id={'role_id'}
                              errorText={touched.role_id && errors.role_id}
                              value={input.value}
                              disabled={strictValidObjectWithKeys(userdata)}
                              data={role}
                              onBlur={(e) => {
                                input.onBlur(e.target.value);
                              }}
                            />
                          </>
                        )}
                      </Field>
                      {/* <Field
                        component={FinalFormSelect}
                        name="role_id"
                        id="user_create_role_type"
                        placeholder="Role Type"
                        required
                        value={values.role_id}
                        items={role}
                        disabled={strictValidObjectWithKeys(userdata)}
                        errorText={touched.role_id && errors.role_id}
                      /> */}
                    </Grid>
                  </Grid>
                  {values.role_id === 7 && (
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
                      <Grid item xs={2} sm={2} md={3}>
                        <Field id="account_id" name={'account_id'}>
                          {({ meta, input }) => (
                            <>
                              <MDSelect
                                required={true}
                                name={'account_id'}
                                onChange={(e) => {
                                  input.onChange(e.target.value);
                                  setCostArray([]);
                                  const data = {
                                    account_id: e.target.value,
                                  };
                                  callGetCostCenterApi(data);
                                  form.batch(() => {
                                    form.change('account_id', e.target.value);
                                  });
                                }}
                                placeholder="Account"
                                id={'account_id'}
                                errorText={
                                  touched.account_id && errors.account_id
                                }
                                value={input.value}
                                disabled={strictValidObjectWithKeys(userdata)}
                                data={corporate_account}
                                onBlur={(e) => {
                                  input.onBlur(e.target.value);
                                }}
                              />
                            </>
                          )}
                        </Field>
                        {/* <Field
                          component={FinalFormSelect}
                          name="account_id"
                          placeholder="Account"
                          items={corporate_account}
                          errorText={touched.account_id && errors.account_id}
                          required
                          disabled={strictValidObjectWithKeys(userdata)}
                        /> */}
                      </Grid>
                    </Grid>
                  )}
                  {strictValidNumber(values.account_id) &&
                    strictValidArrayWithLength(const_array) && (
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
                        <Grid item xs={2} sm={2} md={3}>
                          <Field id="account_field" name={'account_field'}>
                            {({ meta, input }) => (
                              <>
                                <MDMultiSelect
                                  required={true}
                                  name={'account_field'}
                                  onChange={(e) => {
                                    input.onChange(e.target.value);
                                    form.batch(() => {
                                      form.change(
                                        'account_field',
                                        e.target.value,
                                      );
                                    });
                                  }}
                                  isMultiple={true}
                                  placeholder="Cost Center"
                                  id={'account_field'}
                                  errorText={meta.error && meta.touched}
                                  value={input.value}
                                  data={const_array}
                                  onBlur={(e) => {
                                    input.onBlur(e.target.value);
                                  }}
                                />
                              </>
                            )}
                          </Field>
                        </Grid>
                      </Grid>
                    )}
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
                    <Grid item xs={2} sm={2} md={3}>
                      <Field name="send_sms_of_trip">
                        {({ meta, input }) => (
                          <FormControl
                            className={clsx(
                              classes.withoutLabel,
                              classes.textField,
                            )}
                          >
                            <InputLabel>Send SMS</InputLabel>
                            <Select
                              classes={{
                                disabled: classes.disabledCheckbox,
                              }}
                              id="user_create_send_sms"
                              name="user_create_send_sms"
                              placeholder="Send SMS"
                              label={'Send SMS'}
                              variant="outlined"
                              value={input.value}
                              onChange={(e) => {
                                if (e.target.value.includes('')) {
                                  input.onChange(['']);
                                } else if (e.target.value.includes('all')) {
                                  input.onChange(['all']);
                                } else {
                                  input.onChange(e.target.value);
                                }
                              }}
                              onBlur={(event) => input.onBlur(event)}
                              required
                              error={meta.touched && meta.error}
                              fullWidth
                              size="medium"
                              multiple={true}
                            >
                              <MenuItem
                                disabled={input.value.includes('all')}
                                value={''}
                              >
                                {'None'}
                              </MenuItem>
                              <MenuItem
                                disabled={input.value.includes('')}
                                value={'all'}
                              >
                                {'All'}
                              </MenuItem>
                              {send_sms_of_trip.map((a) => {
                                return (
                                  <MenuItem
                                    disabled={checkDisabledValues(input.value)}
                                    value={a.value}
                                  >
                                    {a.title}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        )}
                      </Field>
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
                    <Grid item xs={2} sm={6} md={8}>
                      <Button
                        disabled={pristine || submitting || !valid}
                        onClick={handleSubmit}
                        id="user_create_submit"
                        type="submit"
                        size="large"
                        variant="contained"
                        startIcon={<CheckIcon />}
                        sx={{
                          mt: 2,
                          mb: 2,
                        }}
                      >
                        {isLoad ? (
                          <CircularProgress size={25} color="secondary" />
                        ) : (
                          buttonName
                        )}
                      </Button>
                      <Button
                        id="user_create_cancel"
                        onClick={() => {
                          setValue('1');
                          setUserData({});
                        }}
                        type="submit"
                        color="error"
                        size="large"
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
      {renderDialog()}
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  message: state.user.message,
  isLoad: state.user.isLoad,
  loadErr: state.user.loadErr,
  roles: state.user.roles,
  corporateAccountFromState: state.trip.allTrips.all_corporates,
  constArray: state.user.costCenter,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callAddUserApi: (...params) => dispatch(createUser(...params)),
  callUpdateUser: (...params) => dispatch(updateUser(...params)),
  callUserRolesApi: (...params) => dispatch(getRoles(...params)),
  callCorporateAccountApi: (...params) =>
    dispatch(getCorporateAccount(...params)),
  callResetMessageApi: (...params) => dispatch(resetMessage(...params)),
  callResetSuccessMessageApi: (...params) =>
    dispatch(resetSuccessMessage(...params)),
  callUpdatePasswprdApi: (...params) => dispatch(updatePassword(...params)),
  callGetCostCenterApi: (...params) => dispatch(getCostCenter(...params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddUser);

/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import {
  Checkbox,
  DialogActions,
  Divider,
  FormControlLabel,
  Grid,
} from '@mui/material';
import { Field, Form } from 'react-final-form';
import Typography from '@mui/material/Typography';
import FinalFormText from '../../../components/final-form/input-text';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { CircularProgress } from '@mui/material';
import createDecorator from 'final-form-focus';
import { useSnackbar } from 'notistack';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  createTrip,
  getTrip,
  updateTrip,
  tripIegId,
  getCorporateAccount,
} from './../../trip-management/action';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  strictValidArrayWithLength,
  formatDateTime,
  strictValidObjectWithKeys,
  matchById,
  checkArrayObjectOfKeys,
  strictValidString,
  dobFormatTime,
  strictValidNumber,
} from '../../../utils/common-utils';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import ReviewDialog from '../../../components/dialog/review';
import { getActiveCapabilityRoles } from '../../vehicle-management/action';
import { MINIMUM_LENGTH, VALID_DOB } from '../../../utils/regexs';
import { invalidChars } from '../../../utils/constant';
import { SocketContext } from '../../../hooks/useSocketContext';
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
  button: {
    margin: theme.spacing(3),
  },
  buttonAction: {
    margin: theme.spacing(0, 2),
    width: 130,
  },
}));

const initialState = {
  firstNameArray: [],
  lastNameArray: [],
  emailArray: [],
  phoneNumberArray: [],
};

const SuperAdminEditTrips = ({
  setValue,
  type,
  callCreateTripApi,
  callUpdateTripApi,
  callGetTripApi,
  callCorporateAccountApi,
  callTripIegId,
  corporateAccountFromState,
  userData,
  current_tripData,
  loadErr,
  message,
  capabilityRolesFromState,
  callCapabilityRolesApi,
  user,
}) => {
  const classes = useStyles();
  const [isLoad, setLoad] = useState(false);
  const [corporate_account, setCorporateAccountApi] = useState([]);
  const [contact_array, setContact_array] = useState([]);
  const [dilogData, setDilogData] = useState([]);
  const [pickUpLocation, setPickUpLocation] = useState({});
  const [dropUpLocation, setDropUpLocation] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [capabilityRole, setCapabilityRole] = useState([]);
  const [questions, setQuestion] = useState([]);
  const [state, setstate] = useState(initialState);
  const socket = useContext(SocketContext);

  const { firstNameArray, lastNameArray, emailArray, phoneNumberArray } = state;
  useEffect(() => {
    if (
      strictValidObjectWithKeys(current_tripData) &&
      current_tripData.trip_id
    ) {
      callCorporateAccountApi(current_tripData.trip_id);
    } else {
      callCorporateAccountApi();
    }
    callCapabilityRolesApi();
  }, []);

  const onSubmit = async (val) => {
    let result = {};
    if (strictValidObjectWithKeys(pickUpLocation)) {
      val.pickup_lat = pickUpLocation.lat;
      val.pickup_lng = pickUpLocation.lng;
    }
    if (strictValidObjectWithKeys(dropUpLocation)) {
      val.dropoff_lat = dropUpLocation.lat;
      val.dropoff_lng = dropUpLocation.lng;
    }
    setDilogData(current_tripData);
    if (strictValidObjectWithKeys(dilogData) && dilogData.trip_id) {
      result = await callUpdateTripApi({
        trip_id: dilogData.trip_id,
        values: val,
      });
    }
    if (result) {
      socket.emit('create_trip', result.trip_id);
    }
    if (strictValidObjectWithKeys(result)) {
      setDilogData({
        ...val,
        dob: formatDateTime(val.dob, 'YYYY-MM-DD'),
        pick_up_date_time: formatDateTime(val.pick_up_date_time),
        trip_id: result.trip_id,
        leg_id: result.leg_id,
        emailArray: emailArray,
        hospital_name: result.hospital_name,
        hospital_address: result.hospital_address,
        hospital_phone: result.hospital_phone,
        is_new_trip: result.is_new_trip,
        capability_clarification: result.capability_clarification,
        corporate_contact_name: result.corporate_contact_name,
        capability_name: getSelectedCapability(val.capability_id),
      });
      setIsDeleteDialog(true);
    }
  };

  const getSelectedCapability = (val) => {
    let ret_vals = {};
    let ret_val = [];
    val.filter((item) => {
      ret_vals = capabilityRolesFromState.find(
        (x) => x.capability_id === parseInt(item),
      );
      ret_val.push(ret_vals.name);
    });
    return ret_val.toString();
  };

  const corporateContactCheck = (corporate_contact, new_corporate_contact) => {
    if (
      !checkArrayObjectOfKeys(
        ['corporate_contact_id', 'last_name'],
        corporate_contact,
      ) ||
      (strictValidArrayWithLength(new_corporate_contact) &&
        !checkArrayObjectOfKeys(
          ['last_name', 'first_name'],
          new_corporate_contact,
        ))
    ) {
      return false;
    }
    return true;
  };

  const saveFunDialog = async (val) => {
    setLoad(true);
    if (strictValidObjectWithKeys(dilogData)) {
      success('Trip updated successfully');
    }
    setValue(2);
    callGetTripApi();
  };

  useEffect(() => {
    if (
      strictValidObjectWithKeys(current_tripData) &&
      current_tripData.trip_id
    ) {
      current_tripData.corporate_contact = current_tripData.company_contact;
      setDilogData(current_tripData);
    }
  }, [current_tripData]);

  useEffect(() => {
    if (
      strictValidObjectWithKeys(current_tripData) &&
      strictValidArrayWithLength(corporateAccountFromState)
    ) {
      accountonChange(current_tripData.corporate_account_id);
      let corporateContacts = current_tripData.corporate_contact;
      let empty_val = [];
      let my_index = 0;
      for (let corporateContact of corporateContacts) {
        empty_val.push({
          corporate_contact_id: corporateContact.corporate_contact_id,
          first_name: corporateContact.first_name,
          last_name: corporateContact.corporate_contact_id,
          email_id: corporateContact.corporate_contact_id,
          phone_number: current_tripData.base_patient.demo_phone_no[my_index],
          contact_id: corporateContact.contact_id,
          enabled: corporateContact.enabled,
        });
        accountonChangeArray(
          corporateContact.contact_id,
          'firstNameArray',
          'first_name',
        );
        accountonChangeArray(
          corporateContact.contact_id,
          'lastNameArray',
          'last_name',
        );
        accountonChangeArray(
          corporateContact.contact_id,
          'emailArray',
          'email_id',
        );
        phoneArray(corporateContact.contact_id);
        my_index++;
      }
      current_tripData.corporate_contact = empty_val;
    }
  }, [current_tripData, corporateAccountFromState]);

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
      strictValidObjectWithKeys(current_tripData) &&
      strictValidArrayWithLength(current_tripData.capability_id)
    ) {
      getQuestionfromId(current_tripData.capability_id);
    }
  }, [current_tripData, capabilityRolesFromState]);

  const phoneChangeArray = (val) => {
    const response = strictValidArrayWithLength(phoneNumberArray)
      ? matchById(phoneNumberArray, val)
      : [];
    const data = strictValidArrayWithLength(response) ? response[0].phone : [];
    const newArray = [];
    data.map((a) => {
      newArray.push({
        title: a,
        value: a,
      });
    });
    return newArray;
  };

  const accountonChangeArray = (
    val,
    initialStateVal,
    renderValue,
    valueType,
  ) => {
    const arrayVal = [];

    if (strictValidArrayWithLength(corporateAccountFromState)) {
      corporateAccountFromState.map((a) => {
        if (a.account_id === val) {
          return a.corporate_contact.map((b) => {
            arrayVal.push({
              value: b.corporate_contact_id,
              title: b[renderValue],
              last_name: b.last_name,
              email_id: b.email_id,
              phone_number: b.phone_number,
            });
          });
        }
      });
      setstate((prevState) => ({
        ...prevState,
        [initialStateVal]: arrayVal,
      }));
    }
  };

  const phoneArray = (val) => {
    const arrayPhn = [];
    if (strictValidArrayWithLength(corporateAccountFromState)) {
      corporateAccountFromState.map((a) => {
        if (a.account_id === val) {
          return a.corporate_contact.map((b) => {
            arrayPhn.push({
              phone: b.phone_number,
              id: b.corporate_contact_id,
            });
          });
        }
      });
      setstate((prevState) => ({
        ...prevState,
        phoneNumberArray: arrayPhn,
      }));
    }
  };

  const accountonChange = (val, initialStateVal) => {
    const arrayVal = [];
    if (strictValidArrayWithLength(corporateAccountFromState)) {
      corporateAccountFromState.map((a) => {
        if (a.account_id === val) {
          return a.corporate_contact.map((b) => {
            arrayVal.push({
              value: b.corporate_contact_id,
              title: b.first_name,
              last_name: b.last_name,
              email_id: b.email_id,
              phone_number: b.phone_number,
            });
          });
        }
      });
      setContact_array(arrayVal);
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

  const reviewDialog = () => {
    return (
      <ReviewDialog
        fullScreen={false}
        isOpen={isDeleteDialog}
        fullWidth={true}
        maxWidth={true}
        data={dilogData}
        handleClose={() => {
          setIsDeleteDialog(!isDeleteDialog);
        }}
      >
        <DialogActions>
          <Button
            className={classes.buttonAction}
            color="primary"
            variant="contained"
            onClick={() => {
              setIsDeleteDialog(!isDeleteDialog);
              saveFunDialog(true);
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </ReviewDialog>
    );
  };

  useEffect(() => {
    const roleArray = [];
    if (strictValidArrayWithLength(capabilityRolesFromState)) {
      capabilityRolesFromState.map((a) => {
        roleArray.push({
          value: a.capability_id,
          title: a.name,
        });
      });
    }
    setCapabilityRole(roleArray);
  }, [capabilityRolesFromState]);

  const checkSelected = (v) => {
    let obj =
      strictValidArrayWithLength(capabilityRolesFromState) &&
      capabilityRolesFromState.filter((o) => o.capability_id === v);
    return obj;
  };

  const filter_by_id = (input, val) => {
    const set_phone_array = [];
    input.map(function (key) {
      if (key.value === val) {
        set_phone_array.push(key.phone_number[0]);
      }
    });
    return set_phone_array[0];
  };

  const CheckboxGroupMUI = ({ fields, options, disabled }) => {
    const toggle = (event, option) => {
      const value =
        strictValidArrayWithLength(fields.value) &&
        fields.value.includes(option);
      if (!value) {
        fields.push(option);
      } else {
        let index = fields.value.indexOf(option);
        fields.remove(index);
      }
    };
    const checkedValue = (id) => {
      const value =
        strictValidArrayWithLength(fields.value) && fields.value.includes(id);
      return value;
    };

    return (
      <>
        {options.map((option, index) => (
          <div key={option.question_id}>
            <FormControlLabel
              sx={{ mt: 2 }}
              control={
                <Checkbox
                  disabled={disabled}
                  checked={checkedValue(option.question_id)}
                  value={checkedValue(option.question_id)}
                  // checked={option.question_id}
                  onChange={(event) => toggle(event, option.question_id)}
                />
              }
              label={option.question}
            />
          </div>
        ))}
      </>
    );
  };

  const getQuestionfromId = (selectedIds) => {
    const data = [];
    selectedIds.forEach((w) => {
      strictValidArrayWithLength(capabilityRolesFromState) &&
        capabilityRolesFromState.map((a) => {
          if (a.capability_id === w) {
            strictValidArrayWithLength(a.clarification) &&
              a.clarification.map((b) => {
                data.push(b);
              });
          }
        });
    });
    setQuestion(data);
  };

  const checkRoles = (user) => {
    const key =
      strictValidObjectWithKeys(user) &&
      strictValidNumber(user.role_id) &&
      user.role_id;
    switch (key) {
      case 5:
        return false;
      case 6:
        return false;
      case 8:
        return false;

      default:
        return true;
    }
  };

  const buttonName = strictValidObjectWithKeys(current_tripData)
    ? 'Update Transport'
    : 'Plan Transport';
  return (
    <Grid item xs={12} md={12} lg={12}>
      <Form
        onSubmit={onSubmit}
        decorators={[focusOnErrors]}
        mutators={{
          // potentially other mutators could be merged here
          ...arrayMutators,
        }}
        keepDirtyOnReinitialize
        validate={(values) => {
          const errors = {};
          if (!values.first_name) {
            errors.first_name = 'First Name is Required';
          }
          if (!values.corporate_account_id) {
            errors.corporate_account_id = 'Name is Required';
          }
          if (!values.last_name) {
            errors.last_name = 'Last Name is Required';
          }
          if (!values.dob) {
            errors.dob = 'DOB is Required';
          }
          if (!values.weight) {
            errors.weight = 'Weight is Required';
          }
          if (
            (strictValidString(values.dob) &&
              VALID_DOB.test(dobFormatTime(values.dob)) === 'Invalid Date') ||
            VALID_DOB.test(dobFormatTime(values.dob)) === false
          ) {
            errors.dob = 'DOB is not Valid';
          }
          if (values.phone && !MINIMUM_LENGTH.test(values.phone)) {
            errors.phone = 'Please Enter Valid Phone Number';
          }
          if (!values.trip_pickup_location) {
            errors.trip_pickup_location = 'Pick-Up Location is Required';
          }
          if (!values.trip_dropoff_location) {
            errors.trip_dropoff_location = 'Drop-Off Location is Required';
          }
          if (!values.pick_up_date_time) {
            errors.pick_up_date_time = 'Pick-up Date & Time is Required';
          }
          if (!strictValidArrayWithLength(values.capability_id)) {
            errors.capability_id = 'Please choose Transport Mode';
          }
          return errors;
        }}
        initialValues={{
          corporate_account_id: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.corporate_account_id
            : null,
          first_name: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.base_patient.first_name
            : '',
          last_name: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.base_patient.last_name
            : '',
          email_id: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.base_patient.email_id
            : '',
          phone: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.base_patient.phone
            : '',
          dob: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.base_patient.dob
            : null,
          weight: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.base_patient.weight
            : '',
          room_no: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.base_patient.room_no
            : '',
          drop_off_room_no: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.base_patient.drop_off_room_no
            : '',
          description: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.base_patient.description
            : '',
          trip_pickup_location: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.trip_pickup_location
            : '',
          trip_dropoff_location: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.trip_dropoff_location
            : '',
          pick_up_date_time: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.pick_up_date_time
            : null,
          withValidation: strictValidObjectWithKeys(current_tripData),
          new_corporate_contact: [],
          corporate_contact: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.corporate_contact
            : [
                {
                  first_name: '',
                  last_name: '',
                  email_id: '',
                  phone_number: '',
                  enabled: 1,
                  corporate_contact_id: '',
                  phoneNumberArray: [],
                },
              ],
          capability_id: strictValidObjectWithKeys(current_tripData)
            ? strictValidArrayWithLength(current_tripData.capability_id) &&
              current_tripData.capability_id
            : [],
          question_id: strictValidObjectWithKeys(current_tripData)
            ? strictValidArrayWithLength(current_tripData.question_id) &&
              current_tripData.question_id
            : [],
          pick_up_stairs: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.pick_up_stairs
            : 0,
          drop_off_stairs: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.drop_off_stairs
            : 0,
          oxygen: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.base_patient.oxygen
            : 0,
        }}
        render={({
          handleSubmit,
          pristine,
          values,
          submitting,
          touched,
          errors,
          valid,
          form,
        }) => {
          return (
            <Box>
              <Typography className={classes.mainHeaderText}>
                {strictValidObjectWithKeys(current_tripData)
                  ? 'Edit trip'
                  : 'Edit Transport'}
              </Typography>
              <Typography className={classes.mainHeaderText}>
                {strictValidObjectWithKeys(current_tripData)
                  ? `ID:${current_tripData.leg_id}`
                  : null}
              </Typography>
              <Divider className={classes.generalMargin} />

              <Box sx={{ mt: 1 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <FieldArray name="corporate_contact">
                    {({ fields }) => (
                      <>
                        {fields.map((name, index) => (
                          <Grid
                            container
                            key={name}
                            spacing={{
                              xs: 2,
                              md: 3,
                            }}
                            columns={{
                              xs: 4,
                              sm: 4,
                              md: 12,
                            }}
                          ></Grid>
                        ))}
                      </>
                    )}
                  </FieldArray>
                </Box>
              </Box>

              <Box sx={{ mt: 1 }}>
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
                    <Grid item xs={4} sm={2} md={2}>
                      <Field
                        component={FinalFormText}
                        name="first_name"
                        placeholder="Unit Id"
                        required
                        errorText={touched.first_name && errors.first_name}
                        disabled={corporateContactCheck(
                          values.corporate_contact,
                          values.new_corporate_contact,
                        )}
                      />
                    </Grid>
                    <Grid item xs={4} sm={2} md={2}>
                      <Field
                        component={FinalFormText}
                        name="last_name"
                        placeholder="Trip Id"
                        required
                        errorText={touched.last_name && errors.last_name}
                        disabled={corporateContactCheck(
                          values.corporate_contact,
                          values.new_corporate_contact,
                        )}
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
                    <Grid item xs={4} sm={2} md={2}>
                      <Field
                        component={FinalFormText}
                        name="weight"
                        placeholder="Status"
                        onKeyDown={(evt) =>
                          invalidChars.includes(evt.key) && evt.preventDefault()
                        }
                        inputProps={{
                          maxlength: 3,
                          min: 0,
                        }}
                        required
                        type="number"
                        errorText={touched.weight && errors.weight}
                        disabled={corporateContactCheck(
                          values.corporate_contact,
                          values.new_corporate_contact,
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>

              <Box sx={{ mt: 1 }}>
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
                ></Grid>
              </Box>
              <Box sx={{ mt: 1 }}>
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
                    <Grid item xs={4} sm={2} md={6}>
                      <Field
                        component={FinalFormText}
                        name="description"
                        placeholder="Reason"
                        disabled={corporateContactCheck(
                          values.corporate_contact,
                          values.new_corporate_contact,
                        )}
                        multiline
                        rows={4}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              <Box sx={{ mt: 1 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid
                    container
                    spacing={{
                      xs: 2,
                      md: 3,
                    }}
                    columns={{
                      xs: 2,
                      sm: 2,
                      md: 12,
                    }}
                  >
                    <Grid item xs={4} sm={2} md={3}>
                      <Field
                        component={FinalFormText}
                        name="room_no"
                        placeholder="Disptach Requested"
                        disabled={corporateContactCheck(
                          values.corporate_contact,
                          values.new_corporate_contact,
                        )}
                      />
                    </Grid>

                    <Grid item xs={4} sm={2} md={3}>
                      <Field
                        component={FinalFormText}
                        name="drop_off_room_no"
                        placeholder="Accepted"
                        disabled={corporateContactCheck(
                          values.corporate_contact,
                          values.new_corporate_contact,
                        )}
                      />
                    </Grid>
                    <Grid item xs={4} sm={2} md={3}>
                      <Field
                        component={FinalFormText}
                        name="drop_off_room_no"
                        placeholder="En Route"
                        disabled={corporateContactCheck(
                          values.corporate_contact,
                          values.new_corporate_contact,
                        )}
                      />
                    </Grid>
                    <Grid item xs={4} sm={2} md={3}>
                      <Field
                        component={FinalFormText}
                        name="drop_off_room_no"
                        placeholder="Arrived at PU"
                        disabled={corporateContactCheck(
                          values.corporate_contact,
                          values.new_corporate_contact,
                        )}
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
                    <Grid item xs={4} sm={2} md={6}></Grid>
                  </Grid>
                </Box>
              </Box>
              <Box sx={{ mt: 1 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid
                    container
                    spacing={{
                      xs: 2,
                      md: 3,
                    }}
                    columns={{
                      xs: 2,
                      sm: 2,
                      md: 12,
                    }}
                  >
                    <Grid item xs={4} sm={2} md={3}>
                      <Field
                        component={FinalFormText}
                        name="room_no"
                        placeholder="Arrived at DO"
                        disabled={corporateContactCheck(
                          values.corporate_contact,
                          values.new_corporate_contact,
                        )}
                      />
                    </Grid>

                    <Grid item xs={4} sm={2} md={3}>
                      <Field
                        component={FinalFormText}
                        name="drop_off_room_no"
                        placeholder="Completed Time "
                        disabled={corporateContactCheck(
                          values.corporate_contact,
                          values.new_corporate_contact,
                        )}
                      />
                    </Grid>
                    <Grid item xs={4} sm={2} md={3}>
                      <Field
                        component={FinalFormText}
                        name="drop_off_room_no"
                        placeholder="Arrived at PU"
                        disabled={corporateContactCheck(
                          values.corporate_contact,
                          values.new_corporate_contact,
                        )}
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
                    <Grid item xs={4} sm={2} md={6}></Grid>
                  </Grid>
                </Box>
              </Box>
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
                    disabled={pristine || submitting || !valid}
                    onClick={handleSubmit}
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
                      <CircularProgress size={15} color="secondary" />
                    ) : (
                      buttonName
                    )}
                  </Button>
                  <Button
                    onClick={() => setValue(1)}
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
          );
        }}
      />
      {reviewDialog()}
    </Grid>
  );
};
SuperAdminEditTrips.propTypes = {
  isLoad: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.string,
};

SuperAdminEditTrips.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
  type: 'add',
};

const mapStateProps = (state) => {
  return {
    message: state.trip.message,
    isLoad: state.trip.isLoad,
    loadErr: state.trip.loadErr,
    capabilityRolesFromState: state.drivers.roles,
    corporateAccountFromState: state.trip.allTrips.all_corporates,
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callCreateTripApi: (...params) => dispatch(createTrip(...params)),
  callGetTripApi: (...params) => dispatch(getTrip(...params)),
  callTripIegId: (...params) => dispatch(tripIegId(...params)),
  callCorporateAccountApi: (...params) =>
    dispatch(getCorporateAccount(...params)),
  callUpdateTripApi: (...params) => dispatch(updateTrip(...params)),
  callCapabilityRolesApi: (...params) =>
    dispatch(getActiveCapabilityRoles(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(SuperAdminEditTrips);

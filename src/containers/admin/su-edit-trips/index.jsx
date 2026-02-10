/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import {
  Checkbox,
  Chip,
  DialogActions,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import { Field, Form } from 'react-final-form';
import Typography from '@mui/material/Typography';
import FinalFormText from '../../../components/final-form/input-text';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { CircularProgress } from '@mui/material';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import createDecorator from 'final-form-focus';
import { useSnackbar } from 'notistack';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import {
  createTrip,
  getTrip,
  updateTrip,
  tripIegId,
  getCorporateAccount,
  flushError,
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
  getPhoenixDateTimeAddOneHour,
  strictValidNumber,
} from '../../../utils/common-utils';
// import GoogleMapsPoc from '../../../components/final-form/autoplaceInput';
import GoogleMapsPoc from '../../../components/poc-google';
import MDSelect from '../../../components/mdselect';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import ReviewDialog from '../../../components/dialog/review';
import MdDatePicker from '../../../components/mdDatePicker';
import TextMaskCustom from '../../../components/custom-input-mask';
import { getActiveCapabilityRoles } from '../../vehicle-management/action';
import { MINIMUM_LENGTH, VALID_DOB, VALID_EMAIL } from '../../../utils/regexs';
import { invalidChars } from '../../../utils/constant';
import { SocketContext } from '../../../hooks/useSocketContext';
import { checkCapabilityCombination } from '../../../utils/validation';
import { includes } from 'lodash';
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
  errorData,
  callErrorFlush,
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
  const [capabilityNames, setCapabilityNames] = useState([]);
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
    callErrorFlush();
  }, []);

  useEffect(() => {
    if (strictValidObjectWithKeys(current_tripData)) {
      let arr = [];
      const selectedIds = current_tripData.capability_id;
      capabilityRole.map((a) => {
        if (selectedIds.includes(a.value)) {
          return arr.push(a.title);
        }
      });
      setCapabilityNames(arr);
    }
  }, [capabilityRole]);

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

  const validateLastName = (index) => (value, val) => {
    if (
      !value &&
      strictValidObjectWithKeys(val)
      // customCorporateContactValidation(val.corporate_contact)
    ) {
      return (
        <Typography style={{ color: '#C0001F', fontSize: 12, marginTop: 4 }}>
          Last Name is Required
        </Typography>
      );
    }
  };

  const validateFirstName = (index) => (value, val) => {
    if (
      !value &&
      strictValidObjectWithKeys(val)
      // customCorporateContactValidation(val.corporate_contact)
    ) {
      return (
        <Typography style={{ color: '#C0001F', fontSize: 12, marginTop: 4 }}>
          First Name is Required
        </Typography>
      );
    }
  };

  const validateItem = (index) => (value) => {
    if (value && !VALID_EMAIL.test(value)) {
      return (
        <Typography style={{ color: '#C0001F', fontSize: 12, marginTop: 4 }}>
          Please Enter valid Email Id
        </Typography>
      );
    }
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
    ? 'Update Trip'
    : 'Create Trip';
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
          if (!values.ride_along_person) {
            errors.ride_along_person = 'Please Choose Ride Along Person';
          }
          if (!strictValidArrayWithLength(values.capability_id)) {
            errors.capability_id = 'Please choose Transport Mode';
          } else if (checkCapabilityCombination(capabilityNames)) {
            errors.capability_id = 'Invalid Transport Mode';
          } else if (
            strictValidObjectWithKeys(errorData) &&
            errorData?.error === true &&
            values?.weight >= errorData?.bariatricLargeWeight &&
            !includes(capabilityNames, 'BAR')
          ) {
            errors.capability_id = 'BAR Transport mode required';
          } else if (
            strictValidObjectWithKeys(errorData) &&
            errorData?.error === true &&
            values?.weight < errorData?.bariatricLargeWeight &&
            includes(capabilityNames, 'BAR')
          ) {
            errors.capability_id = 'BAR Transport mode not required';
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
          ride_along_person: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.base_patient.ride_along_person.toString()
            : '',
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
                  : 'New Trip'}
              </Typography>
              <Typography className={classes.mainHeaderText}>
                {strictValidObjectWithKeys(current_tripData)
                  ? `ID:${current_tripData.leg_id}`
                  : null}
              </Typography>
              <Divider className={classes.generalMargin} />
              <Stack mt={3}>
                <Typography className={classes.headerText}>Account</Typography>
              </Stack>
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
                    <Grid item xs={4} sm={2} md={4}>
                      <Field name="corporate_account_id">
                        {({ meta, input }) => (
                          <>
                            <MDSelect
                              onChange={(e) => {
                                input.onChange(e.target.value);
                                accountonChange(e.target.value);
                                accountonChangeArray(
                                  e.target.value,
                                  'firstNameArray',
                                  'first_name',
                                );
                                accountonChangeArray(
                                  e.target.value,
                                  'lastNameArray',
                                  'last_name',
                                );
                                accountonChangeArray(
                                  e.target.value,
                                  'emailArray',
                                  'email_id',
                                );
                                phoneArray(e.target.value, 'emailArray');
                              }}
                              value={input.value}
                              data={corporate_account}
                              errorText={meta.touched && meta.error}
                              placeholder="Account"
                              onBlur={(e) => {
                                input.onBlur(e.target.value);
                              }}
                            />
                          </>
                        )}
                      </Field>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              <FieldArray name="new_corporate_contact">
                {({ fields }) => (
                  <>
                    <Stack mt={3}>
                      <Typography className={classes.headerText}>
                        Contact
                        <Button
                          size="medium"
                          variant="text"
                          color="primary"
                          startIcon={<PersonAddAltIcon />}
                          className={classes.button}
                          onClick={() =>
                            fields.push({
                              first_name: '',
                              last_name: '',
                              email_id: '',
                              phone_number: [''],
                              enabled: 1,
                              isVisible: true,
                            })
                          }
                          disabled={!values.corporate_account_id}
                        >
                          Add NEW
                        </Button>
                      </Typography>
                    </Stack>
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
                      >
                        <Grid item xs={4} sm={4} md={2}>
                          <Field
                            id="trip_add_first_name"
                            component={FinalFormText}
                            name={`${name}.first_name`}
                            placeholder="First Name"
                            // required={customCorporateContactValidation(
                            //   values.corporate_contact,
                            // )}
                            validate={validateFirstName(index)}
                          >
                            {({ input, meta }) => {
                              return (
                                <>
                                  <TextField
                                    variant="outlined"
                                    error={
                                      // customCorporateContactValidation(
                                      //   values.corporate_contact,
                                      // ) &&
                                      !values.new_corporate_contact[index]
                                        .first_name
                                        ? true
                                        : false
                                    }
                                    sx={{
                                      background: '#fafafa',
                                      width: '100%',
                                      mt: 2,
                                    }}
                                    id="trip_add_first_name"
                                    name={`${name}.first_name`}
                                    placeholder="First Name"
                                    label="First Name"
                                    // required={customCorporateContactValidation(
                                    //   values.corporate_contact,
                                    // )}
                                    required={true}
                                    {...input}
                                    onChange={(e) => {
                                      input.onChange(e); //final-form's onChange
                                    }}
                                  />
                                  {meta.touched && meta.error && (
                                    <span>{meta.error}</span>
                                  )}
                                </>
                              );
                            }}
                          </Field>
                        </Grid>
                        <Grid item xs={4} sm={4} md={2}>
                          <Field
                            id="trip_add_last_name"
                            component={FinalFormText}
                            name={`${name}.last_name`}
                            placeholder="Last Name"
                            // required={customCorporateContactValidation(
                            //   values.corporate_contact,
                            // )}
                            required={true}
                            validate={validateLastName(index)}
                          >
                            {({ input, meta }) => {
                              return (
                                <>
                                  <TextField
                                    variant="outlined"
                                    error={
                                      // customCorporateContactValidation(
                                      //   values.corporate_contact,
                                      // ) &&
                                      !values.new_corporate_contact[index]
                                        .last_name
                                        ? true
                                        : false
                                    }
                                    sx={{
                                      background: '#fafafa',
                                      width: '100%',
                                      mt: 2,
                                    }}
                                    validate={validateLastName(index)}
                                    id="trip_add_last_name"
                                    name={`${name}.last_name`}
                                    placeholder="Last Name"
                                    label="Last Name"
                                    // required={customCorporateContactValidation(
                                    //   values.corporate_contact,
                                    // )}
                                    required={true}
                                    {...input}
                                    onChange={(e) => {
                                      input.onChange(e); //final-form's onChange
                                    }}
                                  />
                                  {meta.error && meta.touched && (
                                    <span>{meta.error}</span>
                                  )}
                                </>
                              );
                            }}
                          </Field>
                        </Grid>
                        <Grid item xs={4} sm={4} md={2}>
                          <Field
                            component={FinalFormText}
                            name={`${name}.email_id`}
                            id="trip_add_email_id"
                            placeholder="Email (optional)"
                            type="text"
                            validate={validateItem(index)}
                          >
                            {({ input, meta }) => {
                              return (
                                <>
                                  <TextField
                                    variant="outlined"
                                    name={`${name}.email_id`}
                                    error={`${name}.email_id` ? false : true}
                                    sx={{
                                      background: '#fafafa',
                                      width: '100%',
                                      mt: 2,
                                    }}
                                    id="trip_add_email_id"
                                    placeholder="Email (optional)"
                                    label="Email (optional)"
                                    type="text"
                                    {...input}
                                    onChange={(e) => {
                                      input.onChange(e); //final-form's onChange
                                    }}
                                  />
                                  {meta.error && meta.touched && (
                                    <span>{meta.error}</span>
                                  )}
                                </>
                              );
                            }}
                          </Field>
                        </Grid>
                        <Grid item xs={4} sm={4} md={2}>
                          <FieldArray name={`${name}.phone_number`}>
                            {({ fields }) => (
                              <>
                                {fields.map((v, indexs) => (
                                  <>
                                    <Field
                                      name={`${name}.phone_number[${indexs}]`}
                                    >
                                      {({ meta, input }) => (
                                        <>
                                          <TextMaskCustom
                                            {...input}
                                            label={'Phone Number (Optional)'}
                                            errorText={
                                              meta.touched && meta.error
                                            }
                                            defaultValue={input.value}
                                            onChangeText={(v) => {
                                              input.onChange(v);
                                            }}
                                          />
                                        </>
                                      )}
                                    </Field>
                                  </>
                                ))}
                                <Button
                                  size="medium"
                                  variant="text"
                                  onClick={() => fields.push('')}
                                  color="primary"
                                  startIcon={<AddIcCallIcon />}
                                >
                                  Add ER PHONE NUMBER
                                </Button>
                              </>
                            )}
                          </FieldArray>
                        </Grid>
                        <Grid item xs={4} sm={4} md={3}>
                          <Button
                            size="medium"
                            variant="text"
                            color="error"
                            startIcon={<PersonRemoveIcon />}
                            className={classes.button}
                            onClick={() => fields.remove(index)}
                          >
                            Remove Contact
                          </Button>
                        </Grid>
                      </Grid>
                    ))}
                  </>
                )}
              </FieldArray>

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
                          >
                            <Grid item xs={4} sm={2} md={2}>
                              <Field name={`${name}.corporate_contact_id`}>
                                {({ meta, input }) => (
                                  <>
                                    <MDSelect
                                      onChange={(e) => {
                                        input.onChange(e.target.value);
                                        firstNameArray.map((a) => {
                                          if (a.value === e.target.value) {
                                            return form.batch(() => {
                                              form.change(
                                                `${name}.last_name`,
                                                e.target.value,
                                              );
                                              form.change(
                                                `${name}.email_id`,
                                                e.target.value,
                                              );
                                              form.change(
                                                `${name}.phone_number`,
                                                filter_by_id(
                                                  firstNameArray,
                                                  e.target.value,
                                                ),
                                              );
                                            });
                                          }
                                        });
                                      }}
                                      value={input.value}
                                      data={firstNameArray}
                                      errorText={meta.touched && meta.error}
                                      placeholder="First name"
                                      onBlur={(e) => {
                                        input.onBlur(e.target.value);
                                      }}
                                      disabled={!values.corporate_account_id}
                                    />
                                  </>
                                )}
                              </Field>
                            </Grid>
                            <Grid item xs={4} sm={2} md={2}>
                              <Field name={`${name}.last_name`}>
                                {({ meta, input }) => (
                                  <>
                                    <MDSelect
                                      onChange={(e) => {
                                        input.onChange(e.target.value);
                                        lastNameArray.map((a) => {
                                          if (a.value === e.target.value) {
                                            return form.batch(() => {
                                              form.change(
                                                `${name}.email_id`,
                                                e.target.value,
                                              );
                                              form.change(
                                                `${name}.corporate_contact_id`,
                                                e.target.value,
                                              );
                                              form.change(
                                                `${name}.phone_number`,
                                                filter_by_id(
                                                  lastNameArray,
                                                  e.target.value,
                                                ),
                                              );
                                            });
                                          }
                                        });
                                      }}
                                      value={input.value}
                                      data={lastNameArray}
                                      errorText={meta.touched && meta.error}
                                      placeholder="Last name"
                                      onBlur={(e) => {
                                        input.onBlur(e.target.value);
                                      }}
                                      disabled={!values.corporate_account_id}
                                    />
                                  </>
                                )}
                              </Field>
                            </Grid>
                            <Grid item xs={4} sm={2} md={2}>
                              <Field name={`${name}.email_id`}>
                                {({ meta, input }) => (
                                  <>
                                    <MDSelect
                                      onChange={(e) => {
                                        input.onChange(e.target.value);
                                        emailArray.map((a) => {
                                          if (a.value === e.target.value) {
                                            return form.batch(() => {
                                              form.change(
                                                `${name}.last_name`,
                                                e.target.value,
                                              );
                                              form.change(
                                                `${name}.corporate_contact_id`,
                                                e.target.value,
                                              );
                                              form.change(
                                                `${name}.phone_number`,
                                                filter_by_id(
                                                  emailArray,
                                                  e.target.value,
                                                ),
                                              );
                                            });
                                          }
                                        });
                                      }}
                                      value={input.value}
                                      data={emailArray}
                                      errorText={meta.touched && meta.error}
                                      placeholder="Email (optional)"
                                      onBlur={(e) => {
                                        input.onBlur(e.target.value);
                                      }}
                                      disabled={!values.corporate_account_id}
                                    />
                                  </>
                                )}
                              </Field>
                            </Grid>
                            <Grid item xs={4} sm={2} md={2}>
                              <Field name={`${name}.phone_number`}>
                                {({ meta, input }) => (
                                  <>
                                    <MDSelect
                                      onChange={(e) => {
                                        input.onChange(e.target.value);
                                      }}
                                      value={input.value}
                                      data={phoneChangeArray(
                                        values.corporate_contact[index]
                                          .corporate_contact_id,
                                      )}
                                      errorText={meta.touched && meta.error}
                                      placeholder="Phone Number"
                                      disabled={
                                        !values.corporate_contact[index]
                                          .corporate_contact_id
                                      }
                                      onBlur={(e) => {
                                        input.onBlur(e.target.value);
                                      }}
                                    />
                                  </>
                                )}
                              </Field>
                            </Grid>

                            <Grid item xs={4} sm={2} md={2}>
                              {index === 0 ? (
                                <Button
                                  size="medium"
                                  variant="text"
                                  color="inherit"
                                  startIcon={<PersonAddAltIcon />}
                                  className={classes.button}
                                  disabled={
                                    (strictValidArrayWithLength(
                                      contact_array,
                                    ) &&
                                      contact_array.length ===
                                        values.corporate_contact.length) ||
                                    !values.corporate_account_id
                                  }
                                  onClick={() =>
                                    fields.push({
                                      first_name: '',
                                      last_name: '',
                                      email_id: '',
                                      phone_number: '',
                                      enabled: 1,
                                      isVisible: true,
                                    })
                                  }
                                >
                                  Add Contact
                                </Button>
                              ) : (
                                <Button
                                  size="medium"
                                  variant="text"
                                  color="error"
                                  startIcon={<PowerSettingsNewIcon />}
                                  className={classes.button}
                                  onClick={() => fields.remove(index)}
                                >
                                  Remove Contact
                                </Button>
                              )}
                            </Grid>
                            <Grid item xs={4} sm={2} md={2}>
                              <Button
                                size="medium"
                                variant="text"
                                color="inherit"
                                startIcon={<PowerSettingsNewIcon />}
                                className={classes.button}
                                disabled={!values.corporate_account_id}
                                onClick={() => {
                                  form.batch(() => {
                                    form.change(
                                      `${name}.corporate_contact_id`,
                                      '',
                                    );
                                    form.change(`${name}.last_name`, '');
                                    form.change(`${name}.phone_number`, '');
                                    form.change(`${name}.email_id`, '');
                                  });
                                }}
                              >
                                Clear all
                              </Button>
                            </Grid>
                          </Grid>
                        ))}
                      </>
                    )}
                  </FieldArray>
                </Box>
              </Box>
              <Divider className={classes.margin} />
              <Stack mt={3}>
                <Typography className={classes.headerText}>Patient</Typography>
              </Stack>
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
                        placeholder="First name"
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
                        placeholder="Last name"
                        required
                        errorText={touched.last_name && errors.last_name}
                        disabled={corporateContactCheck(
                          values.corporate_contact,
                          values.new_corporate_contact,
                        )}
                      />
                    </Grid>
                    <Grid item xs={4} sm={2} md={2}>
                      <Field name="dob">
                        {({ meta, input }) => (
                          <>
                            <MdDatePicker
                              {...input}
                              name="dob"
                              value={input.value}
                              errorText={meta.touched && meta.error}
                              placeholder="Date of Birth"
                              type="date"
                              disablePast={false}
                              minDate={new Date('1900-01-01')}
                              maxDate={new Date()}
                              onChange={(e) => {
                                input.onChange(dobFormatTime(e));
                              }}
                              onBlur={(e) => {
                                input.onBlur(e.target.value);
                              }}
                              required
                              disabled={corporateContactCheck(
                                values.corporate_contact,
                                values.new_corporate_contact,
                              )}
                            />
                          </>
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={4} sm={2} md={2}>
                      <Field name="phone">
                        {({ meta, input }) => (
                          <>
                            <TextMaskCustom
                              {...input}
                              label={'Phone Number'}
                              errorText={meta.touched && meta.error}
                              defaultValue={input.value}
                              disabled={corporateContactCheck(
                                values.corporate_contact,
                                values.new_corporate_contact,
                              )}
                              onChangeText={(v) => {
                                input.onChange(v);
                              }}
                            />
                          </>
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={4} sm={2} md={2}>
                      <Field
                        component={FinalFormText}
                        name="email_id"
                        placeholder="Email (optional)"
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
                        placeholder="Weight"
                        onKeyDown={(evt) =>
                          invalidChars.includes(evt.key) && evt.preventDefault()
                        }
                        inputProps={{
                          maxlength: 3,
                          min: 0,
                        }}
                        required
                        type="number"
                        endAdornment={
                          <InputAdornment position="start">lbs</InputAdornment>
                        }
                        errorText={touched.weight && errors.weight}
                        disabled={corporateContactCheck(
                          values.corporate_contact,
                          values.new_corporate_contact,
                        )}
                      />
                    </Grid>

                    <Grid item xs={4} sm={2} md={2}>
                      <Field
                        component={FinalFormText}
                        name="oxygen"
                        placeholder="Need Oxygen ?"
                        onKeyDown={(evt) =>
                          invalidChars.includes(evt.key) && evt.preventDefault()
                        }
                        inputProps={{
                          maxlength: 3,
                          min: 0,
                          inputmode: 'numeric',
                          pattern: '[0-9]*',
                        }}
                        type="number"
                        endAdornment={
                          <InputAdornment position="start">L</InputAdornment>
                        }
                        errorText={touched.oxygen && errors.oxygen}
                        disabled={corporateContactCheck(
                          values.corporate_contact,
                          values.new_corporate_contact,
                        )}
                      />
                    </Grid>
                    <Grid item xs={4} sm={2} md={2}>
                      <Field
                        id="ride_along_person"
                        name="ride_along_person"
                        required={
                          !corporateContactCheck(
                            values.corporate_contact,
                            values.new_corporate_contact,
                          )
                        }
                        disabled={corporateContactCheck(
                          values.corporate_contact,
                          values.new_corporate_contact,
                        )}
                        errorText={
                          touched.ride_along_person && errors.ride_along_person
                        }
                      >
                        {({ meta, input }) => (
                          <>
                            <MDSelect
                              onChange={(e) => {
                                input.onChange(e.target.value);
                                form.change(
                                  'ride_along_person',
                                  e.target.value,
                                );
                              }}
                              value={input.value}
                              required={
                                !corporateContactCheck(
                                  values.corporate_contact,
                                  values.new_corporate_contact,
                                )
                              }
                              errorText={
                                touched.ride_along_person &&
                                errors.ride_along_person
                              }
                              disabled={corporateContactCheck(
                                values.corporate_contact,
                                values.new_corporate_contact,
                              )}
                              id="ride_along_person"
                              data={[
                                {
                                  title: '0',
                                  value: '0',
                                },
                                {
                                  title: '1',
                                  value: '1',
                                },
                                { title: '2', value: '2' },
                                {
                                  title: '3',
                                  value: '3',
                                },
                                {
                                  title: '4',
                                  value: '4',
                                },
                                {
                                  title: '5',
                                  value: '5',
                                },
                              ]}
                              placeholder="Ride Along ? (Person count)"
                              onBlur={(e) => {
                                input.onBlur(e.target.value);
                              }}
                            />
                          </>
                        )}
                      </Field>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              <Divider className={classes.margin} />
              <Stack mt={3}>
                <Typography className={classes.headerText}>
                  Transport Details
                </Typography>
              </Stack>
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
                >
                  <Grid item xs={4} sm={2} md={3}>
                    <Field name="capability_id">
                      {({ meta, input }) => (
                        <>
                          <MDSelect
                            onChange={(e) => {
                              let arr = [];
                              input.onChange(e.target.value);
                              const selectedIds = e.target.value;
                              getQuestionfromId(selectedIds);
                              capabilityRole.map((a) => {
                                if (selectedIds.includes(a.value)) {
                                  return arr.push(a.title);
                                }
                              });
                              setCapabilityNames(arr);
                            }}
                            value={input.value || []}
                            data={capabilityRole}
                            errorText={meta.touched && meta.error}
                            placeholder="Transport Mode"
                            required
                            isMultiple
                            disabled={
                              corporateContactCheck(
                                values.corporate_contact,
                                values.new_corporate_contact,
                              ) || !strictValidArrayWithLength(capabilityRole)
                            }
                            onBlur={(e) => {
                              input.onBlur(e.target.value);
                            }}
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
                                          color="primary"
                                          disabled={corporateContactCheck(
                                            values.corporate_contact,
                                            values.new_corporate_contact,
                                          )}
                                          style={{
                                            textTransform: 'uppercase',
                                            marginTop: 5,
                                            backgroundColor: chipColor,
                                            color: '#ffff',
                                          }}
                                          size="small"
                                          label={name}
                                        />
                                      )}
                                    </>
                                  );
                                })}
                              </Box>
                            )}
                          />
                        </>
                      )}
                    </Field>
                    {strictValidArrayWithLength(questions) && (
                      <FieldArray
                        name="question_id"
                        disabled={corporateContactCheck(
                          values.corporate_contact,
                          values.new_corporate_contact,
                        )}
                        component={CheckboxGroupMUI}
                        options={questions}
                      />
                    )}
                  </Grid>
                </Grid>
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
                        placeholder="Special Instructions"
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
                      xs: 4,
                      sm: 4,
                      md: 12,
                    }}
                  >
                    <Grid item xs={4} sm={2} md={6}>
                      <Field name="trip_pickup_location">
                        {({ meta, input }) => (
                          <div>
                            <GoogleMapsPoc
                              {...input}
                              label={'Pick-Up Location'}
                              required
                              errorText={meta.touched && meta.error}
                              disabled={corporateContactCheck(
                                values.corporate_contact,
                                values.new_corporate_contact,
                              )}
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
                              onBlur={(e) => {
                                input.onBlur(e.target.value);
                              }}
                              isSetLatLong={true}
                              setLatLong={setPickUpLocation}
                            />
                          </div>
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={4} sm={2} md={6}>
                      <Field name="trip_dropoff_location">
                        {({ meta, input }) => (
                          <div>
                            <GoogleMapsPoc
                              {...input}
                              label={'Drop-Off Location'}
                              required
                              errorText={meta.touched && meta.error}
                              disabled={corporateContactCheck(
                                values.corporate_contact,
                                values.new_corporate_contact,
                              )}
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
                              onBlur={(e) => {
                                input.onBlur(e.target.value);
                              }}
                              isSetLatLong={true}
                              setLatLong={setDropUpLocation}
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
                      xs: 2,
                      sm: 2,
                      md: 12,
                    }}
                  >
                    <Grid item xs={4} sm={2} md={3}>
                      <Field
                        component={FinalFormText}
                        name="pick_up_stairs"
                        placeholder="Stairs at Location ?"
                        onKeyDown={(evt) =>
                          invalidChars.includes(evt.key) && evt.preventDefault()
                        }
                        inputProps={{
                          maxlength: 3,
                          min: 0,
                        }}
                        type="number"
                        endAdornment={
                          <InputAdornment position="start">
                            Count
                          </InputAdornment>
                        }
                        errorText={
                          touched.pick_up_stairs && errors.pick_up_stairs
                        }
                        disabled={corporateContactCheck(
                          values.corporate_contact,
                          values.new_corporate_contact,
                        )}
                      />
                    </Grid>
                    <Grid item xs={4} sm={2} md={3}>
                      <Field
                        component={FinalFormText}
                        name="room_no"
                        placeholder="Room Number"
                        disabled={corporateContactCheck(
                          values.corporate_contact,
                          values.new_corporate_contact,
                        )}
                      />
                    </Grid>
                    <Grid item xs={4} sm={2} md={3}>
                      <Field
                        component={FinalFormText}
                        name="drop_off_stairs"
                        placeholder="Stairs at Location ?"
                        onKeyDown={(evt) =>
                          invalidChars.includes(evt.key) && evt.preventDefault()
                        }
                        inputProps={{
                          maxlength: 3,
                          min: 0,
                        }}
                        type="number"
                        endAdornment={
                          <InputAdornment position="start">
                            Count
                          </InputAdornment>
                        }
                        errorText={
                          touched.drop_off_stairs && errors.drop_off_stairs
                        }
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
                        placeholder="Room Number"
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
                    <Grid item xs={4} sm={2} md={6}>
                      <Field name="pick_up_date_time">
                        {({ meta, input }) => (
                          <>
                            <MdDatePicker
                              {...input}
                              name="pick_up_date_time"
                              value={input.value}
                              errorText={meta.touched && meta.error}
                              disabled={corporateContactCheck(
                                values.corporate_contact,
                                values.new_corporate_contact,
                              )}
                              placeholder="Pick-up Date & Time"
                              type="datetime-local"
                              onChange={(e) => {
                                input.onChange(e);
                              }}
                              compareTime={checkRoles(user)}
                              onBlur={(e) => {
                                input.onBlur(e.target.value);
                              }}
                              minDateTime={
                                checkRoles(user) &&
                                getPhoenixDateTimeAddOneHour()
                              }
                              required
                            />
                          </>
                        )}
                      </Field>
                    </Grid>
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
    errorData: state.trip.allTrips.errData,
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
  callErrorFlush: (...params) => dispatch(flushError(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(SuperAdminEditTrips);

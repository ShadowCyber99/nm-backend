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
  formatDuration,
  formatDate,
  convertToPounds,
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
import { DateTime, invalidChars } from '../../../utils/constant';
import {
  createTrip,
  getTrip,
  updateTrip,
  tripIegId,
  cancelledTrip,
  getCorporateAccount,
  getMilesFromLatLng,
  flushError,
} from '../../trip-management/action';
import { SocketContext } from '../../../hooks/useSocketContext';
import { checkCapabilityCombination } from '../../../utils/validation';
import { get, includes, map, toNumber } from 'lodash';
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
    margin: theme.spacing(3, 0, 1),
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
  withoutLabel: {
    margin: `${theme.spacing(2, 0, 0, 0)} !important`,
    width: '100%',
    backgroundColor: '#FAFAFA',
  },
  inputText: {
    fontSize: 14,
  },
}));

const initialState = {
  firstNameArray: [],
  lastNameArray: [],
  emailArray: [],
  phoneNumberArray: [],
};

const EditTripInBilling = ({
  setValue,
  type,
  callCreateTripApi,
  callUpdateTripApi,
  callGetTripApi,
  callCorporateAccountApi,
  callTripIegId,
  corporateAccountFromState,
  callCancelledTripApi,
  current_tripData,
  loadErr,
  message,
  capabilityRolesFromState,
  callCapabilityRolesApi,
  user,
  callMilesApi,
  editTripTabDisabled,
  callApiFunction,
  barError,
  callErrorFlush,
}) => {
  const classes = useStyles();
  const [isLoad, setLoad] = useState(false);
  const [corporate_account, setCorporateAccountApi] = useState([]);
  const [contact_array, setContact_array] = useState([]);
  const [navaigateToHome, setNavaigateToHome] = useState(true);
  const [cost_array, setCostArray] = useState([]);
  // const [account_fields, setAccountField] = useState([]);
  const [ui_section_field, setUiSectionField] = useState({
    ui_section_account: [],
    ui_section_contact: [],
    ui_section_patient: [],
    ui_section_transport: [],
  });
  const [scheduleType, setScheduleType] = useState({
    schedule: false,
    will_call: false,
    on_hold: false,
  });
  const [change_ui_section_field, setChangeUiSectionField] = useState({});
  const [dilogData, setDilogData] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [capabilityRole, setCapabilityRole] = useState([]);
  const [questions, setQuestion] = useState([]);
  const [state, setstate] = useState(initialState);
  const { firstNameArray, lastNameArray, emailArray, phoneNumberArray } = state;
  const [loadAddressCheckbox, setLoadAddressCheckbox] = useState(false);
  const [formType, setformType] = useState('new');
  const [miles, setMiles] = useState({});
  const [capabilityNames, setCapabilityNames] = useState([]);

  const socket = useContext(SocketContext);

  const [zipCode, setZipCode] = useState({
    pickup: null,
    dropoff: null,
    pu_zipdisabled: 0,
    do_zipdisabled: 0,
  });
  const [latlng, setLatLong] = useState({
    pickUpLat: null,
    pickUpLong: null,
    dropoffLat: null,
    dropoffLong: null,
  });

  useEffect(() => {
    if (strictValidObjectWithKeys(current_tripData)) {
      setformType('edit');
    }
  }, []);

  useEffect(() => {
    if (
      strictValidObjectWithKeys(current_tripData) &&
      current_tripData.is_parent === 0
    ) {
      setScheduleType({
        schedule: false,
        will_call: false,
        on_hold: false,
      });
    } else {
      setScheduleType({
        schedule: false,
        will_call: false,
        on_hold: true,
      });
    }
  }, [current_tripData]);

  useEffect(() => {
    if (
      strictValidObjectWithKeys(current_tripData) &&
      current_tripData.trip_id
    ) {
      callCorporateAccountApi(current_tripData.trip_id);
    } else {
      callCorporateAccountApi();
    }
    callErrorFlush();
    callCapabilityRolesApi();
  }, []);

  const clearValues = (form, values) => {
    form.batch(() => {
      form.change('trip_pickup_location', '');
      form.change('trip_dropoff_location', '');
      form.change('room_no', '');
      form.change('drop_off_room_no', '');
      form.change('pick_up_stairs', '');
      form.change('drop_off_stairs', '');
      form.change('pickup_lat', '');
      form.change('pickup_lng', '');
      form.change('dropoff_lat', '');
      form.change('dropoff_lng', '');
      form.change('load_dropoff', 0);
      form.change('load_pickup', 0);
      form.change('child_trip', false);
      form.change('type', 'on_hold');
    });
    setLoadAddressCheckbox(true);
    setScheduleType({
      schedule: false,
      will_call: false,
      on_hold: false,
    });
    setformType('new');
    setLatLong({
      pickUpLat: null,
      pickUpLong: null,
      dropoffLat: null,
      dropoffLong: null,
    });
    setMiles({});
    setZipCode({
      dropoff: null,
      pickup: null,
      pu_zipdisabled: 0,
      do_zipdisabled: 0,
    });
  };
  const onSubmit = async (val, form) => {
    let result = {};
    await setDilogData({
      ...current_tripData,
      new_leg_id: val.new_leg_id,
      child_trip: val.child_trip,
      trip_id: val.trip_id,
    });
    if (current_tripData.copy && formType === 'edit') {
      current_tripData.leg_id = null;
      dilogData.leg_id = null;
      dilogData.trip_id = null;
      current_tripData.trip_id = null;
      val.new_leg_id = '0';
    }
    if (
      strictValidObjectWithKeys(dilogData) &&
      dilogData.trip_id &&
      !val.child_trip &&
      formType === 'edit'
    ) {
      setNavaigateToHome(true);
      result = await callUpdateTripApi({
        trip_id: dilogData.leg_id,
        values: val,
      });
    } else if (
      strictValidObjectWithKeys(dilogData) &&
      dilogData.trip_id &&
      val.child_trip &&
      formType === 'edit' &&
      strictValidObjectWithKeys(current_tripData) &&
      !current_tripData.child_trip
    ) {
      result = await callUpdateTripApi({
        trip_id: dilogData.leg_id,
        values: val,
      });
      setNavaigateToHome(false);
      if (result) {
        clearValues(form, val);
      }
    } else if (
      strictValidObjectWithKeys(dilogData) &&
      dilogData.trip_id &&
      strictValidObjectWithKeys(current_tripData) &&
      current_tripData.child_trip
    ) {
      setNavaigateToHome(true);
      result = await callUpdateTripApi({
        trip_id: dilogData.leg_id,
        values: val,
      });
    } else if (val.child_trip) {
      const data = {
        ...val,
        new_leg_id: val.new_leg_id,
        for_update_trip: false,
        travel_time: miles.duration,
      };
      setNavaigateToHome(false);
      result = await callCreateTripApi(data);
      if (result) {
        clearValues(form);
      }
    } else if (!val.child_trip) {
      const data = {
        ...val,
        new_leg_id: val.new_leg_id,
        travel_time: miles.duration,
      };
      setNavaigateToHome(true);
      result = await callCreateTripApi(data);
    } else {
      setNavaigateToHome(true);
      const data = {
        ...val,
        travel_time: miles.duration,
      };
      result = await callCreateTripApi(data);
    }
    if (result) {
      socket.emit('create_trip', result.leg_id);
    }
    if (strictValidObjectWithKeys(result)) {
      setDilogData({
        ...val,
        dob: formatDateTime(val.dob, 'YYYY-MM-DD'),
        pick_up_date_time:
          val.type === 'scheduled'
            ? formatDateTime(val.pick_up_date_time)
            : formatDate(val.pick_up_date_time),
        trip_id: result.trip_id,
        leg_id: result.leg_id,
        emailArray: emailArray,
        hospital_name: result.hospital_name,
        hospital_address: result.hospital_address,
        hospital_phone: result.hospital_phone,
        is_new_trip: result.is_new_trip,
        distance: result.distance,
        capability_clarification: result.capability_clarification,
        corporate_contact_name: result.corporate_contact_name,
        capability_name: getSelectedCapability(val.capability_id),
        new_leg_id: result.new_leg_id,
      });
      setIsDeleteDialog(true);
    }
  };

  const formCancelledTrip = (values) => {
    setValue(1);
    callCancelledTripApi(values);
  };

  const getSelectedCapability = (val) => {
    let ret_vals = {};
    let ret_val = [];
    val.filter((item) => {
      ret_vals = capabilityRolesFromState.find(
        (x) => x.capability_id === parseInt(item),
      );
      const data =
        strictValidObjectWithKeys(ret_vals) && strictValidString(ret_vals.name)
          ? ret_vals.name
          : null;
      if (data) {
        ret_val.push(ret_vals.name);
      }
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
  useEffect(() => {
    if (
      strictValidObjectWithKeys(ui_section_field) &&
      strictValidArrayWithLength(ui_section_field.ui_section_account)
    ) {
      let arrData = [];
      map(get(ui_section_field, 'ui_section_account', []), (a) => {
        strictValidArrayWithLength(a.cost_center_value) &&
          a.cost_center_value.map((e) => {
            arrData.push({
              title: e.value,
              value: e.id,
            });
          });
      });
      setCostArray(arrData);
    }
  }, [ui_section_field]);

  const corporateContactValidation = (new_corporate_contact) => {
    if (
      strictValidArrayWithLength(new_corporate_contact) &&
      !checkArrayObjectOfKeys(
        ['last_name', 'first_name'],
        new_corporate_contact,
      )
    ) {
      return false;
    }
    return true;
  };
  // const customCorporateContactValidation = (corporate_contact) => {
  //   if (
  //     !checkArrayObjectOfKeys(
  //       ['corporate_contact_id', 'last_name'],
  //       corporate_contact,
  //     )
  //   ) {
  //     return false;
  //   }
  //   return true;
  // };

  const saveFunDialog = async (val) => {
    setLoad(true);
    if (strictValidObjectWithKeys(dilogData) && dilogData.is_new_trip) {
      success('Trip created successfully');
    } else {
      success('Trip updated successfully');
    }
    setValue();
    callApiFunction();
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
      if (!strictValidArrayWithLength(current_tripData.corporate_contact)) {
        accountonChangeArray(
          current_tripData.corporate_account_id,
          'firstNameArray',
          'first_name',
        );
        accountonChangeArray(
          current_tripData.corporate_account_id,
          'lastNameArray',
          'last_name',
        );
        accountonChangeArray(
          current_tripData.corporate_account_id,
          'emailArray',
          'email_id',
        );
        phoneArray(current_tripData.corporate_account_id);
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

  const getMilesFromApi = async (values) => {
    if (values.trip_pickup_location && values.trip_dropoff_location) {
      const data = await callMilesApi(
        values.trip_pickup_location,
        values.trip_dropoff_location,
        values.pick_up_date_time,
      );
      if (strictValidObjectWithKeys(data)) {
        setMiles(data);
      }
    } else {
      setMiles({});
    }
  };

  useEffect(() => {
    if (
      strictValidObjectWithKeys(current_tripData) &&
      strictValidArrayWithLength(current_tripData.capability_id)
    ) {
      getQuestionfromId(current_tripData.capability_id);
      // getMilesFromApi(current_tripData);
      setZipCode({
        pickup: current_tripData.pu_zipcode,
        dropoff: current_tripData.do_zipcode,
        pu_zipdisabled: current_tripData.pu_zipdisabled,
        do_zipdisabled: current_tripData.do_zipdisabled,
      });
    }
    if (
      strictValidObjectWithKeys(current_tripData) &&
      strictValidArrayWithLength(current_tripData.capability_id) &&
      current_tripData.travel_time === 0
    ) {
      getMilesFromApi(current_tripData);
    }
  }, [current_tripData]);

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

  const accountonChangeSetTripUiSection = (value) => {
    const ui_section_account = [];
    const ui_section_contact = [];
    const ui_section_patient = [];
    const ui_section_transport = [];
    if (strictValidArrayWithLength(corporateAccountFromState)) {
      corporateAccountFromState.map((a) => {
        if (strictValidObjectWithKeys(a.ui_sections)) {
          if (strictValidArrayWithLength(a.ui_sections.account)) {
            a.ui_sections.account.map((ac) => {
              ui_section_account.push(ac);
            });
          }
          if (strictValidArrayWithLength(a.ui_sections.contact)) {
            a.ui_sections.contact.map((ct) => {
              ui_section_contact.push(ct);
            });
          }
          if (strictValidArrayWithLength(a.ui_sections.patient)) {
            a.ui_sections.patient.map((pt) => {
              ui_section_patient.push(pt);
            });
          }
          if (strictValidArrayWithLength(a.ui_sections.transport_detail)) {
            a.ui_sections.transport_detail.map((td) => {
              ui_section_transport.push(td);
            });
          }
        }
      });
    }
    setChangeUiSectionField({
      ui_section_account: ui_section_account,
      ui_section_contact: ui_section_contact,
      ui_section_patient: ui_section_patient,
      ui_section_transport: ui_section_transport,
    });
  };

  const accountonChange = (val, form) => {
    const arrayVal = [];
    const accountFieldVal = [];
    const ui_section_account = [];
    const ui_section_contact = [];
    const ui_section_patient = [];
    const ui_section_transport = [];
    if (strictValidArrayWithLength(corporateAccountFromState)) {
      corporateAccountFromState.map((a) => {
        if (a.account_id === val) {
          accountFieldVal.push(a.account_field);
          if (strictValidObjectWithKeys(a.ui_sections)) {
            if (strictValidArrayWithLength(a.ui_sections.account)) {
              a.ui_sections.account.map((ac) => {
                ui_section_account.push(ac);
              });
            }
            if (strictValidArrayWithLength(a.ui_sections.contact)) {
              a.ui_sections.contact.map((ct) => {
                ui_section_contact.push(ct);
              });
            }
            if (strictValidArrayWithLength(a.ui_sections.patient)) {
              a.ui_sections.patient.map((pt) => {
                ui_section_patient.push(pt);
              });
            }
            if (strictValidArrayWithLength(a.ui_sections.transport_detail)) {
              a.ui_sections.transport_detail.map((td) => {
                ui_section_transport.push(td);
              });
            }
          }
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
      setUiSectionField({
        ui_section_account: ui_section_account,
        ui_section_contact: ui_section_contact,
        ui_section_patient: ui_section_patient,
        ui_section_transport: ui_section_transport,
      });
      // setAccountField(accountFieldVal[0]);
      // if (form) {
      //   form.change('trip_account_field', accountFieldVal[0]);
      // }
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
              if (!navaigateToHome) {
                setIsDeleteDialog(!isDeleteDialog);
              } else {
                setIsDeleteDialog(!isDeleteDialog);
                saveFunDialog(true);
              }
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </ReviewDialog>
    );
  };

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

  const isEnabled = (c_account) => {
    let c_account_array = [];
    if (strictValidArrayWithLength(c_account))
      c_account.map((res) => {
        if (res.enabled === 1) {
          c_account_array.push({
            first_name: res.first_name,
            last_name: res.last_name,
            email_id: res.email_id,
            phone_number: res.phone_number,
            enabled: res.enabled,
            corporate_contact_id: res.corporate_contact_id,
            phoneNumberArray: [],
          });
        } else {
          c_account_array.push({
            first_name: '',
            last_name: '',
            email_id: '',
            phone_number: '',
            enabled: 0,
            corporate_contact_id: '',
            phoneNumberArray: [],
          });
        }
      });
    else {
      c_account_array.push({
        first_name: '',
        last_name: '',
        email_id: '',
        phone_number: '',
        enabled: 0,
        corporate_contact_id: '',
        phoneNumberArray: [],
      });
    }
    return c_account_array;
  };

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
    return data;
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
  const maxValue = (max, text) => (value) => {
    if (strictValidString(value)) {
      return isNaN(value) || value.toString().length <= max
        ? undefined
        : `${text}Should be less than ${max}`;
    }
  };

  const composeValidators =
    (...validators) =>
    (value) =>
      validators.reduce(
        (error, validator) => error || validator(value),
        undefined,
      );

  const change_trip_ui_section_field = (values) => {
    let return_obj = {
      ui_section_account: [],
      ui_section_contact: [],
      ui_section_patient: [],
      ui_section_transport: [],
    };
    values.map((val) => {
      if (val.ui_section === 'account') {
        return_obj.ui_section_account.push(val);
      }
      if (val.ui_section === 'contact') {
        return_obj.ui_section_contact.push(val);
      }
      if (val.ui_section === 'patient') {
        return_obj.ui_section_patient.push(val);
      }
      if (val.ui_section === 'transport_detail') {
        return_obj.ui_section_transport.push(val);
      }
    });
    return return_obj;
  };

  const required = (value) => (value ? undefined : 'Required');

  const buttonName =
    formType === 'edit' && !current_tripData.copy
      ? 'Update Trip'
      : 'Create Trip';

  const renderPickUpTime = (type) => {
    if (type === 'will_call') {
      return false;
    } else if (type === 'scheduled') {
      return true;
    } else if (type === 'on_hold' && current_tripData.is_parent === 1) {
      return false;
    } else {
      return false;
    }
  };
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
          if (
            values.type === 'scheduled' &&
            (values.pick_up_date_time === null ||
              values.pick_up_date_time === 'Invalid date')
          ) {
            errors.pick_up_date_time = 'Pick-up Date & Time is Required';
          }
          if (!values.weight_in) {
            errors.weight = 'unit measurment is required';
          }
          if (!values.room_no) {
            errors.room_no = 'PU Room Number is Required';
          }
          if (!values.drop_off_room_no) {
            errors.drop_off_room_no = 'DO Room Number is Required';
          }
          if (!values.oxygen) {
            errors.oxygen = 'Oxygen is Required';
          }
          if (strictValidArrayWithLength(values.capability_id)) {
            if (checkCapabilityCombination(capabilityNames)) {
              errors.capability_id = 'Invalid Transport Mode';
            } else if (
              strictValidObjectWithKeys(barError) &&
              barError.error === true
            ) {
              const weight = toNumber(
                values.weight_in === 'KG'
                  ? values.weight * 2.205
                  : values.weight,
              );
              const isBariatric = includes(capabilityNames, 'BAR');

              if (
                values.weight_in === 'KG' &&
                weight >= barError.bariatricLargeWeight &&
                !isBariatric
              ) {
                errors.capability_id = 'BAR Transport mode required';
              } else if (
                values.weight_in === 'LBS' &&
                weight >= barError.bariatricLargeWeight &&
                !isBariatric
              ) {
                errors.capability_id = 'BAR Transport mode required';
              } else if (
                values.weight_in === 'KG' &&
                weight < barError.bariatricLargeWeight &&
                isBariatric
              ) {
                errors.capability_id = 'BAR Transport mode not required';
              } else if (
                values.weight_in === 'LBS' &&
                weight < barError.bariatricLargeWeight &&
                isBariatric
              ) {
                errors.capability_id = 'BAR Transport mode not required';
              }
            }
          } else {
            errors.capability_id = 'Please choose Transport Mode';
          }
          if (values.email_id && !VALID_EMAIL.test(values.email_id)) {
            errors.email_id = 'Please Enter valid Email Id';
          }
          if (!values.pu_zipcode) {
            errors.pu_zipcode = 'Please Enter valid PU ZIP Code';
          }
          if (!values.do_zipcode) {
            errors.do_zipcode = 'Please Enter valid DO ZIP Code';
          }
          if (!values.ride_along_person) {
            errors.ride_along_person = 'Please Choose Ride Along Person';
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
          travel_time:
            strictValidObjectWithKeys(current_tripData) &&
            strictValidNumber(current_tripData.travel_time) &&
            !strictValidObjectWithKeys(miles)
              ? current_tripData.travel_time
              : 0,
          weight:
            strictValidObjectWithKeys(current_tripData) &&
            current_tripData.base_patient.weight_in === 'KG'
              ? convertToPounds(
                  current_tripData.base_patient.weight,
                  current_tripData.base_patient.weight_in,
                ).toString()
              : strictValidObjectWithKeys(current_tripData) &&
                current_tripData.base_patient.weight_in === 'LBS'
              ? current_tripData.base_patient.weight
              : '',
          room_no: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.base_patient.room_no
            : '',
          drop_off_room_no: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.base_patient.drop_off_room_no
            : '',
          ride_along_person: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.base_patient.ride_along_person.toString()
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
            ? isEnabled(current_tripData.corporate_contact)
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
            ? current_tripData.base_patient.oxygen.toString()
            : '',
          trip_ui_section_field:
            strictValidObjectWithKeys(current_tripData) &&
            !strictValidObjectWithKeys(change_ui_section_field)
              ? change_trip_ui_section_field(
                  current_tripData.trip_account_field,
                )
              : ui_section_field,
          child_trip: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.child_trip
            : false,
          new_leg_id: strictValidObjectWithKeys(dilogData)
            ? strictValidString(dilogData.new_leg_id)
              ? dilogData.new_leg_id
              : strictValidObjectWithKeys(current_tripData)
              ? current_tripData.new_leg_id
              : '0'
            : '0',
          load_dropoff: 0,
          load_pickup: 0,
          pickup_lat: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.pickup_lat
            : latlng.pickUpLat
            ? latlng.pickUpLat
            : '',
          pickup_lng: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.pickup_lng
            : latlng.pickUpLong
            ? latlng.pickUpLong
            : '',
          dropoff_lat: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.dropoff_lat
            : latlng.dropoffLat
            ? latlng.dropoffLat
            : '',
          dropoff_lng: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.dropoff_lng
            : latlng.dropoffLong
            ? latlng.dropoffLong
            : '',
          account_field_id: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.account_field_id
            : null,
          is_parent: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.is_parent
            : 1,
          type: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.type
            : 'scheduled',
          trip_update:
            strictValidObjectWithKeys(current_tripData) &&
            strictValidString(current_tripData.trip_update)
              ? current_tripData.trip_update
              : null,
          weight_in: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.base_patient.weight_in
            : '',
          trip_id: strictValidObjectWithKeys(dilogData)
            ? strictValidNumber(dilogData.trip_id)
              ? dilogData.trip_id
              : strictValidObjectWithKeys(current_tripData)
              ? current_tripData.trip_id
              : null
            : null,
          pu_zipcode:
            strictValidObjectWithKeys(zipCode) &&
            strictValidString(zipCode.pickup)
              ? zipCode.pickup
              : null,
          do_zipcode:
            strictValidObjectWithKeys(zipCode) &&
            strictValidString(zipCode.dropoff)
              ? zipCode.dropoff
              : null,
          pu_zipdisabled: strictValidObjectWithKeys(zipCode)
            ? zipCode.pu_zipdisabled
            : 0,
          do_zipdisabled: strictValidObjectWithKeys(zipCode)
            ? zipCode.do_zipdisabled
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
              <Stack mt={1}>
                <Typography className={classes.headerText}>Account</Typography>
              </Stack>
              <Box>
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
                      <Field id="trip_add_account" name="corporate_account_id">
                        {({ meta, input }) => (
                          <>
                            <MDSelect
                              onChange={(e) => {
                                input.onChange(e.target.value);
                                accountonChangeSetTripUiSection(
                                  e.target.value,
                                  form,
                                );
                                accountonChange(e.target.value, form);
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

                                form.batch(() => {
                                  form.change('corporate_contact', [
                                    {
                                      first_name: '',
                                      last_name: '',
                                      email_id: '',
                                      phone_number: '',
                                      enabled: 1,
                                      isVisible: true,
                                    },
                                  ]);
                                  form.change('new_corporate_contact', []);
                                });
                              }}
                              required
                              value={input.value}
                              id="trip_add_account"
                              disabled={true}
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
                <Box flexDirection="row" display="flex" sx={{ flexGrow: 1 }}>
                  {strictValidArrayWithLength(
                    values.trip_ui_section_field.ui_section_account,
                  ) ? (
                    <FieldArray name="trip_ui_section_field.ui_section_account">
                      {({ fields }) => (
                        <>
                          {fields.map((name, index) => (
                            <>
                              {values.trip_ui_section_field.ui_section_account[
                                index
                              ].type !== 'enum' && (
                                <Grid
                                  item
                                  key={name.id}
                                  sx={{ pr: 2 }}
                                  xs={5}
                                  sm={2}
                                  md={2}
                                >
                                  <Field
                                    component={FinalFormText}
                                    validate={
                                      values.trip_ui_section_field
                                        .ui_section_account[index].mandatory ===
                                        'yes' && required
                                    }
                                    name={`${name}.default_value`}
                                    placeholder={
                                      values.trip_ui_section_field
                                        .ui_section_account[index].label
                                    }
                                    errorText={
                                      touched[
                                        values.trip_ui_section_field
                                          .ui_section_account[index].label
                                      ] &&
                                      errors[
                                        values.trip_ui_section_field
                                          .ui_section_account[index].label
                                      ]
                                    }
                                    required={
                                      values.trip_ui_section_field
                                        .ui_section_account[index].mandatory ===
                                      'yes'
                                    }
                                    inputProps={{
                                      min:
                                        (values.trip_ui_section_field
                                          .ui_section_account[index].type ===
                                          'positiveinteger' ||
                                          values.trip_ui_section_field
                                            .ui_section_account[index].type ===
                                            'float') &&
                                        0,
                                      step:
                                        values.trip_ui_section_field
                                          .ui_section_account[index].type ===
                                          'float' && 0.1,
                                    }}
                                    onKeyDown={(evt) => {
                                      if (
                                        values.trip_ui_section_field
                                          .ui_section_account[index].type ===
                                          'positiveinteger' ||
                                        values.trip_ui_section_field
                                          .ui_section_account[index].type ===
                                          'float' ||
                                        values.trip_ui_section_field
                                          .ui_section_account[index].type ===
                                          'integer'
                                      ) {
                                        invalidChars.includes(evt.key) &&
                                          evt.preventDefault();
                                      }
                                    }}
                                    type={
                                      ['integer', 'positiveinteger'].includes(
                                        values.trip_ui_section_field
                                          .ui_section_account[index].type,
                                      )
                                        ? 'number'
                                        : 'text'
                                    }
                                  />
                                </Grid>
                              )}
                            </>
                          ))}
                        </>
                      )}
                    </FieldArray>
                  ) : (
                    <></>
                  )}
                  <Grid sx={{ pr: 2 }} container xs={5} sm={2} md={2}>
                    {strictValidObjectWithKeys(values.trip_ui_section_field) &&
                      strictValidArrayWithLength(
                        values.trip_ui_section_field.ui_section_account,
                      ) &&
                      values.trip_ui_section_field.ui_section_account.map(
                        (e, index) => {
                          return e.type === 'enum' ? (
                            <>
                              <Field
                                id="trip_add_account"
                                name="account_field_id"
                              >
                                {({ meta, input }) => (
                                  <>
                                    <MDSelect
                                      onChange={(e) => {
                                        input.onChange(e.target.value);
                                        form.change(
                                          'account_field_id',
                                          e.target.value,
                                        );
                                      }}
                                      required={strictValidArrayWithLength(
                                        values.trip_ui_section_field
                                          .ui_section_account,
                                      )}
                                      value={input.value}
                                      id="account_field_id"
                                      disabled={true}
                                      data={cost_array}
                                      errorText={meta.touched && meta.error}
                                      placeholder={
                                        values.trip_ui_section_field
                                          .ui_section_account[index].label
                                      }
                                      onBlur={(e) => {
                                        input.onBlur(e.target.value);
                                      }}
                                    />
                                  </>
                                )}
                              </Field>
                            </>
                          ) : (
                            ''
                          );
                        },
                      )}
                  </Grid>
                </Box>
              </Box>
              <FieldArray name="new_corporate_contact">
                {({ fields }) => (
                  <>
                    {/* <Stack mt={3}> */}
                    <Box
                      sx={{ mt: 1 }}
                      flexDirection="row"
                      alignItems="center"
                      display="flex"
                    >
                      <Typography className={classes.headerText}>
                        Contact
                      </Typography>
                      <Button
                        size="medium"
                        variant="text"
                        color="primary"
                        startIcon={<PersonAddAltIcon />}
                        sx={{
                          ml: 3,
                        }}
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
                    </Box>
                    {/* </Stack> */}
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
                                      id="trip_add_phone_number"
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
                                  id="trip_add_er_phone_number"
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
                            id="trip_add_remove_contact"
                            startIcon={<PersonRemoveIcon />}
                            className={classes.button}
                            onClick={() => {
                              fields.remove(index);
                              if (values.new_corporate_contact.length === 1) {
                                form.batch(() => {
                                  form.change('new_corporate_contact', []);
                                });
                              }
                            }}
                          >
                            Remove Contact
                          </Button>
                        </Grid>
                      </Grid>
                    ))}
                  </>
                )}
              </FieldArray>
              <Box>
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
                              <Field
                                id="trip_add_first_name"
                                name={`${name}.corporate_contact_id`}
                              >
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
                                      required={corporateContactValidation(
                                        values.new_corporate_contact,
                                      )}
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
                              <Field
                                id="trip_add_last_name"
                                name={`${name}.last_name`}
                              >
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
                                      required={corporateContactValidation(
                                        values.new_corporate_contact,
                                      )}
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
                              <Field
                                id="trip_add_email_id"
                                name={`${name}.email_id`}
                              >
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
                              <Field
                                id="trip_add_phone_number"
                                name={`${name}.phone_number`}
                              >
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
                                  id="trip_add_btn_add_contact"
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
                                  id="trip_add_btn_remove_contact"
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
                          </Grid>
                        ))}
                      </>
                    )}
                  </FieldArray>
                </Box>
              </Box>
              {strictValidArrayWithLength(
                values.trip_ui_section_field.ui_section_contact,
              ) ? (
                <FieldArray name="trip_ui_section_field.ui_section_contact">
                  {({ fields }) => (
                    <>
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
                        {fields.map((name, index) => (
                          <>
                            <Grid item key={name.id} xs={4} sm={2} md={2}>
                              <Field
                                component={FinalFormText}
                                name={`${name}.default_value`}
                                validate={
                                  values.trip_ui_section_field
                                    .ui_section_contact[index].mandatory ===
                                    'yes' && required
                                }
                                placeholder={
                                  values.trip_ui_section_field
                                    .ui_section_contact[index].label
                                }
                                errorText={
                                  touched[
                                    values.trip_ui_section_field
                                      .ui_section_contact[index].label
                                  ] &&
                                  errors[
                                    values.trip_ui_section_field
                                      .ui_section_contact[index].label
                                  ]
                                }
                                required={
                                  values.trip_ui_section_field
                                    .ui_section_contact[index].mandatory ===
                                  'yes'
                                }
                                type={
                                  ['integer', 'positiveinteger'].includes(
                                    values.trip_ui_section_field
                                      .ui_section_contact[index].type,
                                  )
                                    ? 'number'
                                    : 'text'
                                }
                                inputProps={{
                                  min:
                                    (values.trip_ui_section_field
                                      .ui_section_contact[index].type ===
                                      'positiveinteger' ||
                                      values.trip_ui_section_field
                                        .ui_section_contact[index].type ===
                                        'float') &&
                                    0,
                                  step:
                                    values.trip_ui_section_field
                                      .ui_section_contact[index].type ===
                                      'float' && 0.1,
                                }}
                                onKeyDown={(evt) => {
                                  if (
                                    values.trip_ui_section_field
                                      .ui_section_contact[index].type ===
                                      'positiveinteger' ||
                                    values.trip_ui_section_field
                                      .ui_section_contact[index].type ===
                                      'float' ||
                                    values.trip_ui_section_field
                                      .ui_section_contact[index].type ===
                                      'integer'
                                  ) {
                                    invalidChars.includes(evt.key) &&
                                      evt.preventDefault();
                                  }
                                }}
                              />
                            </Grid>
                          </>
                        ))}
                      </Grid>
                    </>
                  )}
                </FieldArray>
              ) : (
                <></>
              )}
              <Divider className={classes.generalMargin} />
              <Stack mt={1}>
                <Typography className={classes.headerText}>Patient</Typography>
              </Stack>
              <Box>
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
                        id="trip_add_Patient_first_name"
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
                        id="trip_add_Patient_last_name"
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
                      <Field id="trip_add_Patient_dob" name="dob">
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
                            />
                          </>
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={4} sm={2} md={2}>
                      <Field id="trip_add_Patient_phone_number" name="phone">
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
                        id="trip_add_Patient_email_id"
                        errorText={touched.email_id && errors.email_id}
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
                        id="trip_add_Patient_weight"
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
                          <Field name="weight_in">
                            {({ input }) => (
                              <InputAdornment position="end">
                                <Button
                                  variant="tertiary"
                                  sx={{
                                    color:
                                      values?.weight_in === 'LBS'
                                        ? '#1279BA'
                                        : 'gray',
                                    padding: 0,
                                    marginLeft: -6,
                                    minWidth: '30px',
                                    '&:hover': {
                                      backgroundColor: 'transparent',
                                    },
                                  }}
                                  onClick={() => {
                                    form.change('weight_in', 'LBS');
                                  }}
                                >
                                  LBS
                                </Button>
                                |
                                <Button
                                  variant="tertiary"
                                  sx={{
                                    color:
                                      values?.weight_in === 'KG'
                                        ? '#1279BA'
                                        : 'gray',
                                    padding: 0,
                                    minWidth: '30px',
                                    '&:hover': {
                                      backgroundColor: 'transparent',
                                    },
                                  }}
                                  onClick={() => {
                                    form.change('weight_in', 'KG');
                                  }}
                                >
                                  KG
                                </Button>
                              </InputAdornment>
                            )}
                          </Field>
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
                        id="trip_add_Patient_need_oxygen"
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
                    {strictValidArrayWithLength(
                      values.trip_ui_section_field.ui_section_patient,
                    ) ? (
                      <FieldArray name="trip_ui_section_field.ui_section_patient">
                        {({ fields }) => (
                          <>
                            {fields.map((name, index) => (
                              <Grid
                                direction="row"
                                display="flex"
                                item
                                xs={4}
                                sm={2}
                                md={2}
                              >
                                <Field
                                  validate={
                                    values.trip_ui_section_field
                                      .ui_section_patient[index].mandatory ===
                                      'yes' && required
                                  }
                                  component={FinalFormText}
                                  name={`${name}.default_value`}
                                  placeholder={
                                    values.trip_ui_section_field
                                      .ui_section_patient[index].label
                                  }
                                  errorText={
                                    touched[
                                      values.trip_ui_section_field
                                        .ui_section_patient[index].label
                                    ] &&
                                    errors[
                                      values.trip_ui_section_field
                                        .ui_section_patient[index].label
                                    ]
                                  }
                                  required={
                                    values.trip_ui_section_field
                                      .ui_section_patient[index].mandatory ===
                                    'yes'
                                  }
                                  type={
                                    ['integer', 'positiveinteger'].includes(
                                      values.trip_ui_section_field
                                        .ui_section_patient[index].type,
                                    )
                                      ? 'number'
                                      : 'text'
                                  }
                                  disabled={corporateContactCheck(
                                    values.corporate_contact,
                                    values.new_corporate_contact,
                                  )}
                                  inputProps={{
                                    min:
                                      (values.trip_ui_section_field
                                        .ui_section_patient[index].type ===
                                        'positiveinteger' ||
                                        values.trip_ui_section_field
                                          .ui_section_patient[index].type ===
                                          'float') &&
                                      0,
                                    step:
                                      values.trip_ui_section_field
                                        .ui_section_patient[index].type ===
                                        'float' && 0.1,
                                  }}
                                  onKeyDown={(evt) => {
                                    if (
                                      values.trip_ui_section_field
                                        .ui_section_patient[index].type ===
                                        'positiveinteger' ||
                                      values.trip_ui_section_field
                                        .ui_section_patient[index].type ===
                                        'float' ||
                                      values.trip_ui_section_field
                                        .ui_section_patient[index].type ===
                                        'integer'
                                    ) {
                                      invalidChars.includes(evt.key) &&
                                        evt.preventDefault();
                                    }
                                  }}
                                />
                              </Grid>
                            ))}
                          </>
                        )}
                      </FieldArray>
                    ) : (
                      <></>
                    )}
                  </Grid>
                </Box>
              </Box>
              <Divider className={classes.margin} />
              <Stack mt={1}>
                <Typography className={classes.headerText}>
                  Transport Details
                </Typography>
              </Stack>
              <Box>
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
                    <Field id="trip_add_transport_mode" name="capability_id">
                      {({ meta, input }) => (
                        <>
                          <MDSelect
                            onChange={async (e) => {
                              let arr = [];
                              input.onChange(e.target.value);
                              const selectedIds = e.target.value;
                              capabilityRole.map((a) => {
                                if (selectedIds.includes(a.value)) {
                                  return arr.push(a.title);
                                }
                              });
                              setCapabilityNames(arr);
                              const data = await getQuestionfromId(selectedIds);
                              if (!strictValidArrayWithLength(data)) {
                                form.batch(() => {
                                  form.change('question_id', []);
                                });
                              }
                            }}
                            value={input.value || []}
                            data={capabilityRole}
                            errorText={
                              formType === 'edit'
                                ? meta.error
                                : (meta.touched && meta.error) ||
                                  (strictValidArrayWithLength(input.value) &&
                                    meta.error)
                            }
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
              <Box>
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
                      <Field
                        component={FinalFormText}
                        name="description"
                        id="trip_add_transport_special_instructions"
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
              <Box>
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
                    <Grid item xs={3} sm={2} md={3}>
                      <Field
                        id="trip_add_trip_pickup_location"
                        name="trip_pickup_location"
                      >
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
                              setResults={(e) => {
                                setZipCode({
                                  ...zipCode,
                                  pickup: e.zip,
                                  pu_zipdisabled: strictValidString(e.zip)
                                    ? 1
                                    : 0,
                                });
                                form.batch(() => {
                                  form.change('pu_zipcode', e.zip);
                                });
                              }}
                              selectOption={async (v) => {
                                if (strictValidObjectWithKeys(v)) {
                                  input.onChange(v.description);
                                  form.batch(() => {
                                    form.change('load_dropoff', 0);
                                    form.change('pick_up_stairs', '');
                                    form.change('room_no', '');
                                  });
                                  if (
                                    v.description &&
                                    values.trip_dropoff_location
                                  ) {
                                    const data = await callMilesApi(
                                      v.description,
                                      values.trip_dropoff_location,
                                      values.pick_up_date_time,
                                    );
                                    if (strictValidObjectWithKeys(data)) {
                                      setMiles(data);
                                    }
                                  } else {
                                    setMiles({});
                                    setZipCode({
                                      ...zipCode,
                                      pickup: null,
                                      pu_zipdisabled: 0,
                                    });
                                  }
                                }
                              }}
                              onChangeText={(v) => {
                                if (strictValidObjectWithKeys(v)) {
                                  input.onChange(v.description);
                                  form.batch(() => {
                                    form.change('load_dropoff', 0);
                                    form.change('pick_up_stairs', '');
                                    form.change('room_no', '');
                                  });
                                  setMiles({});
                                  setZipCode({
                                    ...zipCode,
                                    pickup: null,
                                    pu_zipdisabled: 0,
                                  });
                                } else {
                                  input.onChange(v);
                                  form.batch(() => {
                                    form.change('load_dropoff', 0);
                                    form.change('pick_up_stairs', '');
                                    form.change('room_no', '');
                                  });
                                  setMiles({});
                                  setZipCode({
                                    ...zipCode,
                                    pickup: null,
                                    pu_zipdisabled: 0,
                                  });
                                }
                              }}
                              onBlur={(e) => {
                                input.onBlur(e.target.value);
                              }}
                              isSetLatLong={true}
                              setLatLong={(e) => {
                                setLatLong({
                                  ...latlng,
                                  pickUpLat: e.lat,
                                  pickUpLong: e.lng,
                                });
                                form.batch(() => {
                                  form.change('pickup_lat', e.lat);
                                  form.change('pickup_lng', e.lng);
                                  form.change('load_dropoff', 0);
                                });
                              }}
                            />
                          </div>
                        )}
                      </Field>

                      {loadAddressCheckbox && (
                        <Field
                          id="trip_add_same_as_previous_dropoff_location"
                          name="load_dropoff"
                        >
                          {({ meta, input }) => (
                            <>
                              <FormControlLabel
                                sx={{ mt: 0.5 }}
                                control={
                                  <Checkbox
                                    checked={input.value === 0 ? false : true}
                                    onChange={() => {
                                      if (input.value === 0) {
                                        setMiles({});
                                        setZipCode({
                                          ...zipCode,
                                          pickup: dilogData.do_zipcode,
                                          pu_zipdisabled:
                                            dilogData.do_zipdisabled,
                                        });
                                        setLatLong({
                                          ...latlng,
                                          pickUpLat: dilogData.dropoff_lat,
                                          pickUpLong: dilogData.dropoff_lng,
                                        });
                                        form.batch(() => {
                                          form.change(
                                            'trip_pickup_location',
                                            dilogData.trip_dropoff_location,
                                          );
                                          form.change(
                                            'pick_up_stairs',
                                            dilogData.drop_off_stairs,
                                          );
                                          form.change(
                                            'room_no',
                                            dilogData.drop_off_room_no,
                                          );
                                          form.change(
                                            'pickup_lat',
                                            dilogData.dropoff_lat,
                                          );
                                          form.change(
                                            'pickup_lng',
                                            dilogData.dropoff_lng,
                                          );
                                          form.change('load_dropoff', 1);
                                        });
                                        getMilesFromApi({
                                          trip_dropoff_location:
                                            values.trip_dropoff_location,
                                          trip_pickup_location:
                                            dilogData.trip_dropoff_location,
                                          pick_up_date_time:
                                            values.pick_up_date_time,
                                        });
                                      } else {
                                        setLatLong({
                                          ...latlng,
                                          pickUpLat: '',
                                          pickUpLong: '',
                                        });
                                        setMiles({});
                                        setZipCode({
                                          ...zipCode,
                                          pickup: null,
                                          pu_zipdisabled: 0,
                                        });
                                        form.batch(() => {
                                          form.change(
                                            'trip_pickup_location',
                                            '',
                                          );
                                          form.change('pickup_lat', '');
                                          form.change('pickup_lng', '');
                                          form.change('load_dropoff', 0);
                                          form.change('pick_up_stairs', '');
                                          form.change('room_no', '');
                                        });
                                      }
                                    }}
                                  />
                                }
                                label="Same as previous Drop-Off address"
                              />
                            </>
                          )}
                        </Field>
                      )}
                    </Grid>
                    <Grid item xs={1} sm={1} md={1}>
                      <Field
                        component={FinalFormText}
                        name="pu_zipcode"
                        id="trip_add_pu_zipcode"
                        placeholder="PU ZIP Code"
                        errorText={touched.pu_zipcode && errors.pu_zipcode}
                        onKeyDown={(evt) =>
                          invalidChars.includes(evt.key) && evt.preventDefault()
                        }
                        required
                        type="number"
                        disabled={
                          corporateContactCheck(
                            values.corporate_contact,
                            values.new_corporate_contact,
                          ) || values.pu_zipdisabled === 1
                            ? true
                            : false
                        }
                      />
                    </Grid>

                    <Grid item xs={3} sm={2} md={3}>
                      <Field
                        id="trip_add_trip_dropoff_location"
                        name="trip_dropoff_location"
                      >
                        {({ meta, input }) => (
                          <div>
                            <GoogleMapsPoc
                              {...input}
                              label={'Drop-Off Location'}
                              required
                              setResults={(e) => {
                                setZipCode({
                                  ...zipCode,
                                  dropoff: e.zip,
                                  do_zipdisabled: strictValidString(e.zip)
                                    ? 1
                                    : 0,
                                });
                                form.batch(() => {
                                  form.change('do_zipcode', e.zip);
                                });
                              }}
                              errorText={meta.touched && meta.error}
                              disabled={corporateContactCheck(
                                values.corporate_contact,
                                values.new_corporate_contact,
                              )}
                              defaultValue={input.value}
                              selectOption={async (v) => {
                                if (strictValidObjectWithKeys(v)) {
                                  input.onChange(v.description);
                                  setZipCode({
                                    ...zipCode,
                                    dropoff: null,
                                    do_zipdisabled: 0,
                                  });
                                  form.batch(() => {
                                    form.change('load_pickup', 0);
                                    form.change('drop_off_stairs', '');
                                    form.change('drop_off_room_no', '');
                                  });
                                  if (
                                    values.trip_pickup_location &&
                                    v.description
                                  ) {
                                    const data = await callMilesApi(
                                      values.trip_pickup_location,
                                      v.description,
                                      values.pick_up_date_time,
                                    );
                                    if (strictValidObjectWithKeys(data)) {
                                      setMiles(data);
                                    }
                                  } else {
                                    setMiles({});
                                  }
                                }
                              }}
                              onChangeText={(v) => {
                                if (strictValidObjectWithKeys(v)) {
                                  input.onChange(v.description);
                                  setZipCode({
                                    ...zipCode,
                                    dropoff: null,
                                    do_zipdisabled: 0,
                                  });
                                  form.batch(() => {
                                    form.change('load_pickup', 0);
                                    form.change('drop_off_stairs', '');
                                    form.change('drop_off_room_no', '');
                                  });
                                  setMiles({});
                                  setZipCode({
                                    ...zipCode,
                                    dropoff: null,
                                    do_zipdisabled: 0,
                                  });
                                } else {
                                  input.onChange(v);
                                  form.batch(() => {
                                    form.change('load_pickup', 0);
                                    form.change('drop_off_stairs', '');
                                    form.change('drop_off_room_no', '');
                                  });
                                  setMiles({});
                                }
                              }}
                              onBlur={(e) => {
                                input.onBlur(e.target.value);
                              }}
                              isSetLatLong={true}
                              setLatLong={(e) => {
                                setLatLong({
                                  ...latlng,
                                  dropoffLat: e.lat,
                                  dropoffLong: e.lng,
                                });
                                form.batch(() => {
                                  form.change('dropoff_lat', e.lat);
                                  form.change('dropoff_lng', e.lng);
                                  form.change('load_pickup', 0);
                                });
                              }}
                            />
                          </div>
                        )}
                      </Field>
                      {loadAddressCheckbox && (
                        <Field
                          id="trip_add_same_as_previous_pickup_location"
                          name="load_pickup"
                        >
                          {({ meta, input }) => (
                            <>
                              <FormControlLabel
                                sx={{ mt: 0.5 }}
                                control={
                                  <Checkbox
                                    checked={input.value === 0 ? false : true}
                                    onChange={() => {
                                      if (input.value === 0) {
                                        setLatLong({
                                          ...latlng,
                                          dropoffLat: dilogData.pickup_lat,
                                          dropoffLong: dilogData.pickup_lng,
                                        });
                                        setMiles({});
                                        setZipCode({
                                          ...zipCode,
                                          dropoff: dilogData.pu_zipcode,
                                          do_zipdisabled:
                                            dilogData.pu_zipdisabled,
                                        });
                                        form.batch(() => {
                                          form.change(
                                            'trip_dropoff_location',
                                            dilogData.trip_pickup_location,
                                          );
                                          form.change(
                                            'drop_off_stairs',
                                            dilogData.pick_up_stairs,
                                          );
                                          form.change(
                                            'drop_off_room_no',
                                            dilogData.room_no,
                                          );
                                          form.change(
                                            'dropoff_lat',
                                            dilogData.pickup_lat,
                                          );
                                          form.change(
                                            'dropoff_lng',
                                            dilogData.pickup_lng,
                                          );
                                          form.change('load_pickup', 1);
                                        });
                                        getMilesFromApi({
                                          trip_dropoff_location:
                                            dilogData.trip_pickup_location,
                                          trip_pickup_location:
                                            values.trip_pickup_location,
                                          pick_up_date_time:
                                            values.pick_up_date_time,
                                        });
                                      } else {
                                        setLatLong({
                                          ...latlng,
                                          dropoffLat: '',
                                          dropoffLong: '',
                                        });
                                        setMiles({});
                                        setZipCode({
                                          ...zipCode,
                                          dropoff: null,
                                          do_zipdisabled: 0,
                                        });
                                        form.batch(() => {
                                          form.change(
                                            'trip_dropoff_location',
                                            '',
                                          );
                                          form.change('dropoff_lat', '');
                                          form.change('dropoff_lng', '');
                                          form.change('load_pickup', 0);
                                          form.change('drop_off_stairs', '');
                                          form.change('drop_off_room_no', '');
                                        });
                                      }
                                    }}
                                  />
                                }
                                label="Same as previous Pick-Up address"
                              />
                            </>
                          )}
                        </Field>
                      )}
                    </Grid>
                    <Grid item xs={1} sm={1} md={1}>
                      <Field
                        component={FinalFormText}
                        name="do_zipcode"
                        id="trip_add_do_zipcode"
                        errorText={touched.do_zipcode && errors.do_zipcode}
                        required
                        type="number"
                        onKeyDown={(evt) =>
                          invalidChars.includes(evt.key) && evt.preventDefault()
                        }
                        placeholder="DO ZIP Code"
                        disabled={
                          corporateContactCheck(
                            values.corporate_contact,
                            values.new_corporate_contact,
                          ) || values.do_zipdisabled === 1
                            ? true
                            : false
                        }
                      />
                    </Grid>
                    <Box
                      mt={4}
                      ml={2}
                      display="flex"
                      // justifyContent="space-around"
                      flex={1}
                      alignItems="center"
                    >
                      {strictValidObjectWithKeys(miles) ? (
                        <Typography className={classes.mainHeaderText}>
                          Distance : {miles.distance} mi
                        </Typography>
                      ) : strictValidObjectWithKeys(current_tripData) &&
                        !strictValidObjectWithKeys(miles) &&
                        strictValidString(values.trip_pickup_location) &&
                        !strictValidString(miles.distance) &&
                        strictValidString(values.trip_dropoff_location) &&
                        strictValidString(current_tripData.distance) ? (
                        <Typography className={classes.mainHeaderText}>
                          Distance :{' '}
                          {!strictValidObjectWithKeys(miles)
                            ? current_tripData.distance
                            : null}{' '}
                          mi
                        </Typography>
                      ) : null}
                      {strictValidObjectWithKeys(miles) ? (
                        <Typography className={classes.mainHeaderText} ml={3}>
                          Travel Time : {formatDuration(miles.duration)}
                        </Typography>
                      ) : strictValidObjectWithKeys(current_tripData) &&
                        !strictValidObjectWithKeys(miles) &&
                        strictValidString(values.trip_pickup_location) &&
                        !strictValidString(miles.distance) &&
                        strictValidString(values.trip_dropoff_location) &&
                        strictValidNumber(current_tripData.travel_time) ? (
                        <Typography className={classes.mainHeaderText} ml={3}>
                          Travel Time :{' '}
                          {formatDuration(current_tripData.travel_time)}
                        </Typography>
                      ) : null}
                      {/* {strictValidObjectWithKeys(zipCode) &&
                      strictValidString(zipCode.pickup) ? (
                        <Typography className={classes.mainHeaderText} ml={3}>
                          PU ZIP : {zipCode.pickup}
                        </Typography>
                      ) : null}
                      {strictValidObjectWithKeys(zipCode) &&
                      strictValidString(zipCode.dropoff) ? (
                        <Typography className={classes.mainHeaderText} ml={3}>
                          DO ZIP : {zipCode.dropoff}
                        </Typography>
                      ) : null} */}
                    </Box>
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
                    <Grid item xs={4} sm={2} md={2}>
                      <Field
                        component={FinalFormText}
                        id="trip_add_pick_up_stairs"
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
                        validate={composeValidators(maxValue(10, 'Stairs'))}
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
                    <Grid item xs={4} sm={2} md={2}>
                      <Field
                        component={FinalFormText}
                        id="trip_add_pickup_room_no"
                        name="room_no"
                        placeholder="PU Room Number"
                        disabled={corporateContactCheck(
                          values.corporate_contact,
                          values.new_corporate_contact,
                        )}
                        required={
                          !corporateContactCheck(
                            values.corporate_contact,
                            values.new_corporate_contact,
                          )
                        }
                        validate={composeValidators(
                          maxValue(10, 'Room Number'),
                        )}
                        errorText={touched.room_no && errors.room_no}
                      />
                    </Grid>
                    <Grid item xs={4} sm={2} md={2}>
                      <Field
                        component={FinalFormText}
                        name="drop_off_stairs"
                        id="trip_add_drop_off_stairs"
                        placeholder="Stairs at Location ?"
                        onKeyDown={(evt) =>
                          invalidChars.includes(evt.key) && evt.preventDefault()
                        }
                        inputProps={{
                          maxlength: 3,
                          min: 0,
                        }}
                        validate={composeValidators(maxValue(10, 'Stairs'))}
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
                    <Grid item xs={4} sm={2} md={2}>
                      <Field
                        component={FinalFormText}
                        name="drop_off_room_no"
                        id="trip_add_drop_off_room_no"
                        placeholder="DO Room Number"
                        validate={composeValidators(
                          maxValue(10, 'Room Number'),
                        )}
                        errorText={
                          touched.drop_off_room_no && errors.drop_off_room_no
                        }
                        disabled={corporateContactCheck(
                          values.corporate_contact,
                          values.new_corporate_contact,
                        )}
                        required={
                          !corporateContactCheck(
                            values.corporate_contact,
                            values.new_corporate_contact,
                          )
                        }
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
                      <Field id="trip_add_transport_type" name="type">
                        {({ meta, input }) => (
                          <>
                            <MDSelect
                              onChange={(e) => {
                                input.onChange(e.target.value);
                                form.batch(() => {
                                  form.change('pick_up_date_time', '');
                                });
                              }}
                              value={input.value}
                              data={[
                                {
                                  title: 'Scheduled',
                                  value: 'scheduled',
                                  disabled: scheduleType.schedule,
                                },
                                {
                                  title: 'Will Call',
                                  value: 'will_call',
                                  disabled: scheduleType.will_call,
                                },
                                {
                                  title: 'On Hold',
                                  value: 'on_hold',
                                  disabled: scheduleType.on_hold,
                                },
                              ]}
                              errorText={meta.touched && meta.error}
                              placeholder="Type"
                              disabled={true}
                              onBlur={(e) => {
                                input.onBlur(e.target.value);
                              }}
                            />
                          </>
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={4} sm={2} md={4}>
                      {
                        <Field
                          id="trip_add_pick_up_date_time"
                          name="pick_up_date_time"
                        >
                          {({ meta, input }) => (
                            <>
                              {renderPickUpTime(values.type) && (
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
                                  onChange={async (e) => {
                                    input.onChange(e);
                                    if (
                                      values.trip_pickup_location &&
                                      values.trip_dropoff_location
                                    ) {
                                      const data = await callMilesApi(
                                        values.trip_pickup_location,
                                        values.trip_dropoff_location,
                                        e,
                                      );
                                      if (strictValidObjectWithKeys(data)) {
                                        setMiles(data);
                                      }
                                    } else {
                                      setMiles({});
                                    }
                                  }}
                                  compareTime={checkRoles(user)}
                                  onBlur={(e) => {
                                    input.onBlur(e.target.value);
                                  }}
                                  minDateTime={
                                    checkRoles(user) &&
                                    getPhoenixDateTimeAddOneHour()
                                  }
                                  required={
                                    !corporateContactCheck(
                                      values.corporate_contact,
                                      values.new_corporate_contact,
                                    )
                                  }
                                />
                              )}
                            </>
                          )}
                        </Field>
                      }
                    </Grid>
                    <Box
                      mt={4}
                      ml={2}
                      display="flex"
                      flex={1}
                      alignItems="center"
                    >
                      {renderPickUpTime(values.type) &&
                      strictValidObjectWithKeys(miles) &&
                      values.pick_up_date_time &&
                      strictValidString(miles.estimated_end_time) ? (
                        <Typography className={classes.mainHeaderText}>
                          ETA :{' '}
                          {formatDateTime(miles.estimated_end_time, DateTime)}
                        </Typography>
                      ) : strictValidObjectWithKeys(current_tripData) &&
                        renderPickUpTime(values.type) &&
                        values.pick_up_date_time &&
                        strictValidString(
                          current_tripData.estimated_end_time,
                        ) &&
                        !strictValidString(miles.estimated_end_time) &&
                        !strictValidObjectWithKeys(miles) ? (
                        <Typography className={classes.mainHeaderText}>
                          ETA :{' '}
                          {formatDateTime(
                            current_tripData.estimated_end_time,
                            DateTime,
                          )}
                        </Typography>
                      ) : null}
                    </Box>
                  </Grid>

                  {strictValidArrayWithLength(
                    values.trip_ui_section_field.ui_section_transport,
                  ) ? (
                    <FieldArray name="trip_ui_section_field.ui_section_transport">
                      {({ fields }) => (
                        <>
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
                            {fields.map((name, index) => (
                              <>
                                <Grid item key={name.id} xs={4} sm={2} md={2}>
                                  <Field
                                    validate={
                                      values.trip_ui_section_field
                                        .ui_section_transport[index]
                                        .mandatory === 'yes' && required
                                    }
                                    component={FinalFormText}
                                    name={`${name}.default_value`}
                                    placeholder={
                                      values.trip_ui_section_field
                                        .ui_section_transport[index].label
                                    }
                                    errorText={
                                      touched[
                                        values.trip_ui_section_field
                                          .ui_section_transport[index].label
                                      ] &&
                                      errors[
                                        values.trip_ui_section_field
                                          .ui_section_transport[index].label
                                      ]
                                    }
                                    required={
                                      values.trip_ui_section_field
                                        .ui_section_transport[index]
                                        .mandatory === 'yes'
                                    }
                                    type={
                                      ['integer', 'positiveinteger'].includes(
                                        values.trip_ui_section_field
                                          .ui_section_transport[index].type,
                                      )
                                        ? 'number'
                                        : 'text'
                                    }
                                    disabled={corporateContactCheck(
                                      values.corporate_contact,
                                      values.new_corporate_contact,
                                    )}
                                    inputProps={{
                                      min:
                                        (values.trip_ui_section_field
                                          .ui_section_transport[index].type ===
                                          'positiveinteger' ||
                                          values.trip_ui_section_field
                                            .ui_section_transport[index]
                                            .type === 'float') &&
                                        0,
                                      step:
                                        values.trip_ui_section_field
                                          .ui_section_transport[index].type ===
                                          'float' && 0.1,
                                    }}
                                    onKeyDown={(evt) => {
                                      if (
                                        values.trip_ui_section_field
                                          .ui_section_transport[index].type ===
                                          'positiveinteger' ||
                                        values.trip_ui_section_field
                                          .ui_section_transport[index].type ===
                                          'float' ||
                                        values.trip_ui_section_field
                                          .ui_section_transport[index].type ===
                                          'integer'
                                      ) {
                                        invalidChars.includes(evt.key) &&
                                          evt.preventDefault();
                                      }
                                    }}
                                  />
                                </Grid>
                              </>
                            ))}
                          </Grid>
                        </>
                      )}
                    </FieldArray>
                  ) : (
                    <></>
                  )}
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
                    disabled={
                      pristine ||
                      submitting ||
                      !valid ||
                      corporateContactCheck(
                        values.corporate_contact,
                        values.new_corporate_contact,
                      )
                    }
                    onClick={handleSubmit}
                    type="submit"
                    size="large"
                    variant="contained"
                    startIcon={<CheckIcon />}
                    sx={{
                      mt: 1,
                      mb: 1,
                    }}
                  >
                    {isLoad ? (
                      <CircularProgress size={15} color="secondary" />
                    ) : (
                      buttonName
                    )}
                  </Button>
                  <Button
                    onClick={() => formCancelledTrip(values)}
                    type="submit"
                    id="trip_add_btn_cancel_trip"
                    color="error"
                    size="large"
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    sx={{
                      mt: 1,
                      mb: 1,
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
EditTripInBilling.propTypes = {
  isLoad: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.string,
};

EditTripInBilling.defaultProps = {
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
    barError: state.trip.allTrips.errData,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callCreateTripApi: (...params) => dispatch(createTrip(...params)),
  callGetTripApi: (...params) => dispatch(getTrip(...params)),
  callTripIegId: (...params) => dispatch(tripIegId(...params)),
  callCancelledTripApi: (...params) => dispatch(cancelledTrip(...params)),
  callCorporateAccountApi: (...params) =>
    dispatch(getCorporateAccount(...params)),
  callUpdateTripApi: (...params) => dispatch(updateTrip(...params)),
  callCapabilityRolesApi: (...params) =>
    dispatch(getActiveCapabilityRoles(...params)),
  callMilesApi: (...params) => dispatch(getMilesFromLatLng(...params)),
  callErrorFlush: (...params) => dispatch(flushError(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(EditTripInBilling);

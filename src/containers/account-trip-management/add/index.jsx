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
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import {
  createTrip,
  updateTrip,
  tripIegId,
  getCorporateAccount,
  flushBarError,
} from '../action';
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
  formatDuration,
  strictValidNumber,
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
import { getMyProfile } from '../../welcome/action';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { DateTime, invalidChars } from '../../../utils/constant';
import AcknowledgeDialog from '../../../components/dialog/acknowledge';
import FinalFormCheckbox from '../../../components/final-form/checkbox';
import { getMilesFromLatLng } from '../../trip-management/action';
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
  withoutLabel: {
    margin: `${theme.spacing(2, 0, 0, 0)} !important`,
    width: '100%',
    backgroundColor: '#FAFAFA',
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
  ackButtonAction: {
    width: 160,
  },
}));

const initialState = {
  firstNameArray: [],
  lastNameArray: [],
  emailArray: [],
  phoneNumberArray: [],
};

const AddTrip = ({
  setValue,
  isQuote,
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
  userprofile,
  callGetMyProfileApi,
  callCapabilityRolesApi,
  callMilesApi,
  errorBar,
  callBarErrorFlush,
}) => {
  const classes = useStyles();
  const [capabilityNames, setCapabilityNames] = useState([]);
  const [isLoad, setLoad] = useState(false);
  const [corporate_account, setCorporateAccountApi] = useState([]);
  const [contact_array, setContact_array] = useState([]);
  const [zipCode, setZipCode] = useState({
    pickup: null,
    dropoff: null,
    pu_zipdisabled: 0,
    do_zipdisabled: 0,
  });
  const [ui_section_field, setUiSectionField] = useState({
    ui_section_account: [],
    ui_section_contact: [],
    ui_section_patient: [],
    ui_section_transport: [],
  });
  const [dilogData, setDilogData] = useState([]);
  const socket = useContext(SocketContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [isAckDialog, setIsAckDialog] = useState(false);
  const [capabilityRole, setCapabilityRole] = useState([]);
  const [questions, setQuestion] = useState([]);
  const [state, setstate] = useState(initialState);
  const [loadAddressCheckbox, setLoadAddressCheckbox] = useState(false);
  const [navaigateToHome, setNavaigateToHome] = useState(true);
  const [cost_array, setCostArray] = useState([]);
  const [scheduleType, setScheduleType] = useState({
    schedule: false,
    will_call: false,
    on_hold: false,
  });
  const { firstNameArray, lastNameArray, emailArray, phoneNumberArray } = state;
  const [formType, setformType] = useState('new');
  const [miles, setMiles] = useState({});
  const [latlng, setLatLong] = useState({
    pickUpLat: null,
    pickUpLong: null,
    dropoffLat: null,
    dropoffLong: null,
  });
  const [errorMsg, setErrorMsg] = useState({
    dob: null,
  });

  useEffect(() => {
    if (strictValidObjectWithKeys(current_tripData)) {
      if (current_tripData.isNew) {
        setformType('new');
      } else {
        setformType('edit');
      }
    }
    callBarErrorFlush();
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

  useEffect(async () => {
    await callCorporateAccountApi();
    await callCapabilityRolesApi();
    await callGetMyProfileApi();
  }, []);

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

  const clearValues = (form) => {
    form.batch(() => {
      form.change('trip_pickup_location', '');
      form.change('trip_dropoff_location', '');
      form.change('pickup_lat', '');
      form.change('pickup_lng', '');
      form.change('dropoff_lat', '');
      form.change('dropoff_lng', '');
      form.change('room_no', '');
      form.change('drop_off_room_no', '');
      form.change('pick_up_stairs', '');
      form.change('drop_off_stairs', '');
      form.change('load_dropoff', 0);
      form.change('load_pickup', 0);
      form.change('child_trip', false);
      form.change('type', 'on_hold');
      form.change('pu_zipcode', null);
      form.change('do_zipcode', null);
      form.change('pu_zipdisabled', 0);
      form.change('do_zipdisabled', 0);
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
        clearValues(form);
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
        estimated_end_time: result.estimated_end_time,
        dob: formatDateTime(val.dob, 'YYYY-MM-DD'),
        pick_up_date_time:
          val.type === 'scheduled'
            ? formatDateTime(result.pick_up_date_time)
            : formatDate(result.pick_up_date_time),
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

  const saveFunDialog = async (val) => {
    setLoad(true);
    if (strictValidObjectWithKeys(dilogData) && dilogData.is_new_trip) {
      success('Trip created successfully');
    } else {
      success('Trip updated successfully');
    }
    setValue();
    // callGetTripApi();
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
        my_index++;
      }
      current_tripData.corporate_contact = empty_val;
    }
  }, [current_tripData, corporateAccountFromState]);

  useEffect(() => {
    if (strictValidObjectWithKeys(userprofile)) {
      accountonChangeArray(
        userprofile.account_id,
        'firstNameArray',
        'first_name',
      );
      accountonChangeArray(
        userprofile.account_id,
        'lastNameArray',
        'last_name',
      );
      accountonChangeArray(userprofile.account_id, 'emailArray', 'email_id');
      phoneArray(userprofile.account_id);
    }
  }, [userprofile]);

  useEffect(() => {
    const corporateAccountArray = [];
    if (strictValidArrayWithLength(corporateAccountFromState)) {
      accountonChange(corporateAccountFromState[0].account_id);
      corporateAccountFromState.map((a) => {
        corporateAccountArray.push({
          value: a.account_id,
          title: a.name,
        });
      });
    }
    // if (
    //   strictValidArrayWithLength(corporateAccountFromState) &&
    //   strictValidArrayWithLength(corporateAccountFromState[0].account_field)
    // ) {
    //   setAccountField(corporateAccountFromState[0].account_field);
    // }

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

  const maxValue = (max, text) => (value) =>
    isNaN(value) || value.toString().length <= max
      ? undefined
      : `${text}Should be less than ${max}`;

  const composeValidators =
    (...validators) =>
    (value) =>
      validators.reduce(
        (error, validator) => error || validator(value),
        undefined,
      );

  const accountonChangeArray = (
    val,
    initialStateVal,
    renderValue,
    valueType,
  ) => {
    const arrayVal = [];

    if (strictValidArrayWithLength(corporateAccountFromState)) {
      corporateAccountFromState.map((a) => {
        if (a.account_id === userprofile.account_id) {
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
    const ui_section_account = [];
    const ui_section_contact = [];
    const ui_section_patient = [];
    const ui_section_transport = [];
    if (strictValidArrayWithLength(corporateAccountFromState)) {
      corporateAccountFromState.map((a) => {
        if (a.account_id === val) {
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
    if (strictValidObjectWithKeys(userprofile)) {
      accountonChangeArray(
        userprofile.account_id,
        'firstNameArray',
        'first_name',
      );
      accountonChangeArray(
        userprofile.account_id,
        'lastNameArray',
        'last_name',
      );
      accountonChangeArray(userprofile.account_id, 'emailArray', 'email_id');
      phoneArray(userprofile.account_id);
    }
  }, [userprofile]);

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
  const acknowledgeDialog = () => {
    return (
      <AcknowledgeDialog
        fullScreen={false}
        isOpen={isAckDialog}
        fullWidth={true}
        maxWidth={true}
        data={dilogData}
        handleClose={() => {
          setIsAckDialog(!isAckDialog);
        }}
      >
        <DialogActions>
          <Button
            className={classes.ackButtonAction}
            color="primary"
            variant="contained"
            onClick={() => {
              setIsAckDialog(!isAckDialog);
              saveFunDialog(true);
            }}
          >
            Acknowledge
          </Button>
        </DialogActions>
      </AcknowledgeDialog>
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

  const isEnabled = (c_account) => {
    let c_account_array = [];
    strictValidArrayWithLength(c_account) &&
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
    return c_account_array;
  };

  const required = (value) => (value ? undefined : 'Required');
  const buttonName =
    formType === 'edit' && !current_tripData.copy
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
          if (!strictValidString(values.first_name)) {
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
          if (
            (strictValidString(values.dob) &&
              VALID_DOB.test(dobFormatTime(values.dob)) === 'Invalid Date') ||
            VALID_DOB.test(dobFormatTime(values.dob)) === false
          ) {
            errors.dob = 'Please enter a valid dob';
          } else if (
            errorMsg.dob === 'invalidDate' ||
            errorMsg.dob === 'minDate' ||
            errorMsg.dob === 'maxDate'
          ) {
            errors.dob = 'Please enter a valid dob';
          }
          if (values.email_id && !VALID_EMAIL.test(values.email_id)) {
            errors.email_id = 'Please Enter valid Email Id';
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
              values.pick_up_date_time === 'N/A' ||
              values.pick_up_date_time === '' ||
              values.pick_up_date_time === 'Invalid date')
          ) {
            errors.pick_up_date_time = 'Pick-up Date & Time is Required';
          } else if (
            values.type === 'will_call' &&
            (values.pick_up_date_time === null ||
              values.pick_up_date_time === 'N/A' ||
              values.pick_up_date_time === '' ||
              values.pick_up_date_time === 'Invalid date')
          ) {
            errors.pick_up_date_time = 'Pick-up Date is Required';
          }
          if (strictValidArrayWithLength(values.capability_id)) {
            if (checkCapabilityCombination(capabilityNames)) {
              errors.capability_id = 'Invalid Transport Mode';
            } else if (
              strictValidObjectWithKeys(errorBar) &&
              errorBar.error === true
            ) {
              const weight = toNumber(
                values.weight_in === 'KG'
                  ? values.weight * 2.205
                  : values.weight,
              );
              const isBariatric = includes(capabilityNames, 'BAR');

              if (
                values.weight_in === 'KG' &&
                weight >= errorBar.bariatricLargeWeight &&
                !isBariatric
              ) {
                errors.capability_id = 'BAR Transport mode required';
              } else if (
                values.weight_in === 'LBS' &&
                weight >= errorBar.bariatricLargeWeight &&
                !isBariatric
              ) {
                errors.capability_id = 'BAR Transport mode required';
              } else if (
                values.weight_in === 'KG' &&
                weight < errorBar.bariatricLargeWeight &&
                isBariatric
              ) {
                errors.capability_id = 'BAR Transport mode not required';
              } else if (
                values.weight_in === 'LBS' &&
                weight < errorBar.bariatricLargeWeight &&
                isBariatric
              ) {
                errors.capability_id = 'BAR Transport mode not required';
              }
            }
          } else {
            errors.capability_id = 'Please choose Transport Mode';
          }
          if (values.phone && !MINIMUM_LENGTH.test(values.phone)) {
            errors.phone = 'Please Enter Valid Phone Number';
          }
          if (!values.room_no) {
            errors.room_no = 'PU Room Number is Required';
          }
          if (!values.ride_along_person) {
            errors.ride_along_person = 'Please Choose Ride Along Person';
          }
          if (!values.drop_off_room_no) {
            errors.drop_off_room_no = 'DO Room Number is Required';
          }
          if (!values.oxygen) {
            errors.oxygen = 'Oxygen is Required';
          }
          if (!values.weight) {
            errors.weight = 'Weight is Required';
          }
          if (!values.weight_in) {
            errors.weight = 'unit measurment is required';
          }
          if (!values.pu_zipcode) {
            errors.pu_zipcode = 'Please Enter valid PU ZIP Code';
          }
          if (!values.do_zipcode) {
            errors.do_zipcode = 'Please Enter valid DO ZIP Code';
          }
          return errors;
        }}
        initialValues={{
          corporate_account_id: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.corporate_account_id
            : userprofile.account_id,
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
          weight_in: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.base_patient.weight_in
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
          ride_along_person: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.base_patient.ride_along_person.toString()
            : '',
          travel_time:
            strictValidObjectWithKeys(current_tripData) &&
            strictValidNumber(current_tripData.travel_time) &&
            !strictValidObjectWithKeys(miles)
              ? current_tripData.travel_time
              : 0,
          withValidation: strictValidObjectWithKeys(current_tripData),
          corporate_contact: strictValidObjectWithKeys(current_tripData)
            ? isEnabled(current_tripData.corporate_contact)
            : [
                {
                  first_name: '',
                  last_name: userprofile.corporate_contact_id,
                  email_id: userprofile.corporate_contact_id,
                  phone_number: userprofile.phone_number,
                  enabled: 1,
                  corporate_contact_id: userprofile.corporate_contact_id,
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
          trip_ui_section_field: strictValidObjectWithKeys(current_tripData)
            ? change_trip_ui_section_field(current_tripData.trip_account_field)
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
          is_parent: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.is_parent
            : 1,
          type: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.type
            : 'scheduled',
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
          account_field_id: strictValidObjectWithKeys(current_tripData)
            ? current_tripData.account_field_id
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
              <Typography className={classes.mainHeaderText}>
                {strictValidObjectWithKeys(current_tripData) &&
                !current_tripData.isNew &&
                !current_tripData.copy &&
                formType === 'edit'
                  ? 'Edit trip'
                  : 'New Trip'}
              </Typography>
              <Typography className={classes.mainHeaderText}>
                {strictValidObjectWithKeys(current_tripData) &&
                strictValidString(current_tripData.leg_id) &&
                !current_tripData.copy &&
                formType === 'edit'
                  ? `ID:${current_tripData.leg_id}`
                  : null}
                {strictValidObjectWithKeys(dilogData) &&
                formType === 'new' &&
                dilogData.new_leg_id !== '0'
                  ? `ID:${dilogData.new_leg_id}`
                  : null}
              </Typography>
              <Divider className={classes.generalMargin} />
              <Stack mt={2}>
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
                                callBarErrorFlush();
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
                                if (
                                  strictValidObjectWithKeys(ui_section_field) &&
                                  ui_section_field.ui_section_account.length ===
                                    0
                                ) {
                                  form.change('corporate_contact', null);
                                }
                                phoneArray(e.target.value, 'emailArray');
                              }}
                              value={input.value}
                              data={corporate_account}
                              errorText={meta.touched && meta.error}
                              placeholder="Account"
                              onBlur={(e) => {
                                input.onBlur(e.target.value);
                              }}
                              disabled={true}
                            />
                          </>
                        )}
                      </Field>
                    </Grid>
                  </Grid>
                </Box>
                {/* {strictValidArrayWithLength(
                  values.trip_ui_section_field.ui_section_account
                ) ? (
                  <FieldArray name="trip_ui_section_field.ui_section_account">
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
                                      .ui_section_account[index].mandatory ===
                                      "yes" && required
                                  }
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
                                    "yes"
                                  }
                                  type={
                                    ["integer", "positiveinteger"].includes(
                                      values.trip_ui_section_field
                                        .ui_section_account[index].type
                                    )
                                      ? "number"
                                      : "text"
                                  }
                                  inputProps={{
                                    min:
                                      (values.trip_ui_section_field
                                        .ui_section_account[index].type ===
                                        "positiveinteger" ||
                                        values.trip_ui_section_field
                                          .ui_section_account[index].type ===
                                          "float") &&
                                      0,
                                    step:
                                      values.trip_ui_section_field
                                        .ui_section_account[index].type ===
                                        "float" && 0.1,
                                  }}
                                  onKeyDown={(evt) => {
                                    if (
                                      values.trip_ui_section_field
                                        .ui_section_account[index].type ===
                                        "positiveinteger" ||
                                      values.trip_ui_section_field
                                        .ui_section_account[index].type ===
                                        "float" ||
                                      values.trip_ui_section_field
                                        .ui_section_account[index].type ===
                                        "integer"
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
                )} */}
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
                                  container
                                  key={name.id}
                                  sx={{ pr: 2 }}
                                  xs={5}
                                  sm={2}
                                  md={2}
                                >
                                  <Field
                                    component={FinalFormText}
                                    name={`${name}.default_value`}
                                    validate={
                                      values.trip_ui_section_field
                                        .ui_section_account[index].mandatory ===
                                        'yes' && required
                                    }
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
                                    type={
                                      ['integer', 'positiveinteger'].includes(
                                        values.trip_ui_section_field
                                          .ui_section_account[index].type,
                                      )
                                        ? 'number'
                                        : 'text'
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
                      strictValidObjectWithKeys(values) &&
                      values.account_field_id !== 0 &&
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
                                validate={
                                  values.trip_ui_section_field
                                    .ui_section_account[index].mandatory ===
                                    'yes' && required
                                }
                                required={
                                  values.trip_ui_section_field
                                    .ui_section_account[index].mandatory ===
                                  'yes'
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
                                      required
                                      value={input.value}
                                      id="account_field_id"
                                      data={cost_array}
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

              <Stack mt={2}>
                <Typography className={classes.headerText}>Contact</Typography>
              </Stack>
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
                                      required={true}
                                      onChange={(e) => {
                                        callBarErrorFlush();
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
                                      required={true}
                                      onChange={(e) => {
                                        callBarErrorFlush();
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
                                        callBarErrorFlush();
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
                                        callBarErrorFlush();
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
                                  startIcon={<PersonRemoveIcon />}
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
                        required
                        errorText={touched.first_name && errors.first_name}
                        disabled={checkArrayObjectOfKeys(
                          ['corporate_contact_id', 'last_name'],
                          values.corporate_contact,
                        )}
                        allowNull // <-------
                        parse={(value) => (value === '' ? null : value)} // <-------
                      />
                    </Grid>
                    <Grid item xs={4} sm={2} md={2}>
                      <Field
                        component={FinalFormText}
                        name="last_name"
                        placeholder="Last name"
                        required
                        errorText={touched.last_name && errors.last_name}
                        disabled={checkArrayObjectOfKeys(
                          ['corporate_contact_id', 'last_name'],
                          values.corporate_contact,
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
                              onError={(e) => {
                                setErrorMsg({
                                  ...errorMsg,
                                  dob: e,
                                });
                              }}
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
                                !checkArrayObjectOfKeys(
                                  ['corporate_contact_id', 'last_name'],
                                  values.corporate_contact,
                                )
                              }
                              disabled={checkArrayObjectOfKeys(
                                ['corporate_contact_id', 'last_name'],
                                values.corporate_contact,
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
                              errorText={meta.error}
                              defaultValue={input.value}
                              disabled={checkArrayObjectOfKeys(
                                ['corporate_contact_id', 'last_name'],
                                values.corporate_contact,
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
                        errorText={touched.email_id && errors.email_id}
                        component={FinalFormText}
                        name="email_id"
                        placeholder="Email (optional)"
                        disabled={checkArrayObjectOfKeys(
                          ['corporate_contact_id', 'last_name'],
                          values.corporate_contact,
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
                        errorText={touched.weight && errors.weight}
                        required
                        inputProps={{
                          maxlength: 3,
                          min: 0,
                          inputmode: 'numeric',
                          pattern: '[0-9]*',
                        }}
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
                        disabled={checkArrayObjectOfKeys(
                          ['corporate_contact_id', 'last_name'],
                          values.corporate_contact,
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
                        errorText={touched.oxygen && errors.oxygen}
                        required
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
                        disabled={checkArrayObjectOfKeys(
                          ['corporate_contact_id', 'last_name'],
                          values.corporate_contact,
                        )}
                      />
                    </Grid>
                    <Grid item xs={4} sm={2} md={2}>
                      <Field
                        id="ride_along_person"
                        name="ride_along_person"
                        required
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
                              disabled={checkArrayObjectOfKeys(
                                ['corporate_contact_id', 'last_name'],
                                values.corporate_contact,
                              )}
                              required
                              errorText={
                                touched.ride_along_person &&
                                errors.ride_along_person
                              }
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
                  {strictValidArrayWithLength(
                    values.trip_ui_section_field.ui_section_patient,
                  ) ? (
                    <FieldArray name="trip_ui_section_field.ui_section_patient">
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
                                        .ui_section_patient[index].mandatory ===
                                        'yes' && required
                                    }
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
                                    disabled={checkArrayObjectOfKeys(
                                      ['corporate_contact_id', 'last_name'],
                                      values.corporate_contact,
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
                    <Field name="capability_id">
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
                            isMultiple
                            required
                            disabled={
                              checkArrayObjectOfKeys(
                                ['corporate_contact_id', 'last_name'],
                                values.corporate_contact,
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
                                          disabled={checkArrayObjectOfKeys(
                                            [
                                              'corporate_contact_id',
                                              'last_name',
                                            ],
                                            values.corporate_contact,
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
                        disabled={checkArrayObjectOfKeys(
                          ['corporate_contact_id', 'last_name'],
                          values.corporate_contact,
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
                        placeholder="Special Instructions"
                        disabled={checkArrayObjectOfKeys(
                          ['corporate_contact_id', 'last_name'],
                          values.corporate_contact,
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
                      <Field name="trip_pickup_location">
                        {({ meta, input }) => (
                          <div>
                            <GoogleMapsPoc
                              {...input}
                              label={'Pick-Up Location'}
                              required
                              errorText={meta.touched && meta.error}
                              disabled={checkArrayObjectOfKeys(
                                ['corporate_contact_id', 'last_name'],
                                values.corporate_contact,
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
                        <Field name="load_dropoff">
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
                                          pickUpLat: dilogData.dropoff_lat,
                                          pickUpLong: dilogData.dropoff_lng,
                                        });
                                        setZipCode({
                                          ...zipCode,
                                          pickup: dilogData.do_zipcode,
                                          pu_zipdisabled:
                                            dilogData.do_zipdisabled,
                                        });
                                        form.batch(() => {
                                          form.change(
                                            'pu_zipcode',
                                            dilogData.do_zipcode,
                                          );
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
                                        if (values.travel_time === 0) {
                                          getMilesFromApi({
                                            trip_dropoff_location:
                                              values.trip_dropoff_location,
                                            trip_pickup_location:
                                              dilogData.trip_dropoff_location,
                                            pick_up_date_time:
                                              values.pick_up_date_time,
                                          });
                                        }
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
                                          form.change('pu_zipcode', null);
                                          form.change('pu_zip_disabled', 0);
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
                          checkArrayObjectOfKeys(
                            ['corporate_contact_id', 'last_name'],
                            values.corporate_contact,
                          ) || values.pu_zipdisabled === 1
                            ? true
                            : false
                        }
                      />
                    </Grid>
                    <Grid item xs={3} sm={2} md={3}>
                      <Field name="trip_dropoff_location">
                        {({ meta, input }) => (
                          <div>
                            <GoogleMapsPoc
                              {...input}
                              label={'Drop-Off Location'}
                              required
                              errorText={meta.touched && meta.error}
                              disabled={checkArrayObjectOfKeys(
                                ['corporate_contact_id', 'last_name'],
                                values.corporate_contact,
                              )}
                              defaultValue={input.value}
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
                        <Field name="load_pickup">
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
                                            'do_zipcode',
                                            dilogData.pu_zipcode,
                                          );
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
                                          form.change(
                                            'do_zipcode',
                                            dilogData.pu_zipcode,
                                          );
                                          form.change(
                                            'do_zip_disabled',
                                            dilogData.pu_zip_disabled,
                                          );
                                        });
                                        if (values.travel_time === 0) {
                                          getMilesFromApi({
                                            trip_dropoff_location:
                                              dilogData.trip_pickup_location,
                                            trip_pickup_location:
                                              values.trip_pickup_location,
                                            pick_up_date_time:
                                              values.pick_up_date_time,
                                          });
                                        }
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
                          checkArrayObjectOfKeys(
                            ['corporate_contact_id', 'last_name'],
                            values.corporate_contact,
                          ) || values.do_zipdisabled === 1
                            ? true
                            : false
                        }
                      />
                    </Grid>
                    <Box
                      mt={loadAddressCheckbox ? 0 : 4}
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
                        name="pick_up_stairs"
                        placeholder="Stairs at Location ?"
                        onKeyDown={(evt) =>
                          invalidChars.includes(evt.key) && evt.preventDefault()
                        }
                        validate={composeValidators(maxValue(10, 'Stairs'))}
                        inputProps={{
                          maxlength: 3,
                          min: 0,
                          inputmode: 'numeric',
                          pattern: '[0-9]*',
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
                        disabled={checkArrayObjectOfKeys(
                          ['corporate_contact_id', 'last_name'],
                          values.corporate_contact,
                        )}
                      />
                    </Grid>
                    <Grid item xs={4} sm={2} md={2}>
                      <Field
                        component={FinalFormText}
                        name="room_no"
                        placeholder=" PU Room Number"
                        disabled={checkArrayObjectOfKeys(
                          ['corporate_contact_id', 'last_name'],
                          values.corporate_contact,
                        )}
                        required={
                          !checkArrayObjectOfKeys(
                            ['corporate_contact_id', 'last_name'],
                            values.corporate_contact,
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
                        placeholder="Stairs at Location ?"
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
                          <InputAdornment position="start">
                            Count
                          </InputAdornment>
                        }
                        validate={composeValidators(maxValue(10, 'Stairs'))}
                        errorText={
                          touched.drop_off_stairs && errors.drop_off_stairs
                        }
                        disabled={checkArrayObjectOfKeys(
                          ['corporate_contact_id', 'last_name'],
                          values.corporate_contact,
                        )}
                      />
                    </Grid>
                    <Grid item xs={4} sm={2} md={2}>
                      <Field
                        component={FinalFormText}
                        name="drop_off_room_no"
                        placeholder="DO Room Number"
                        disabled={checkArrayObjectOfKeys(
                          ['corporate_contact_id', 'last_name'],
                          values.corporate_contact,
                        )}
                        required={
                          !checkArrayObjectOfKeys(
                            ['corporate_contact_id', 'last_name'],
                            values.corporate_contact,
                          )
                        }
                        validate={composeValidators(
                          maxValue(10, 'Room Number'),
                        )}
                        errorText={
                          touched.drop_off_room_no && errors.drop_off_room_no
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
                      <Field name="type">
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
                              disabled={checkArrayObjectOfKeys(
                                ['corporate_contact_id', 'last_name'],
                                values.corporate_contact,
                              )}
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
                                  clearText={true}
                                  compareTime={false}
                                  errorText={meta.touched && meta.error}
                                  disabled={checkArrayObjectOfKeys(
                                    ['corporate_contact_id', 'last_name'],
                                    values.corporate_contact,
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
                                  onBlur={(e) => {
                                    input.onBlur(e.target.value);
                                  }}
                                  minDateTime={getPhoenixDateTimeAddOneHour()}
                                  required={
                                    !checkArrayObjectOfKeys(
                                      ['corporate_contact_id', 'last_name'],
                                      values.corporate_contact,
                                    )
                                  }
                                />
                              )}
                            </>
                          )}
                        </Field>
                      }
                      {values.type === 'will_call' && (
                        <>
                          <Field
                            id="trip_add_pick_up_date_time"
                            name="pick_up_date_time"
                          >
                            {({ meta, input }) => (
                              <>
                                <MdDatePicker
                                  {...input}
                                  name="pick_up_date_time"
                                  value={input.value}
                                  errorText={meta.touched && meta.error}
                                  disabled={checkArrayObjectOfKeys(
                                    ['corporate_contact_id', 'last_name'],
                                    values.corporate_contact,
                                  )}
                                  placeholder="Pick-up Date"
                                  type="onlydate"
                                  onChange={async (e) => {
                                    input.onChange(formatDate(e, 'YYYY-MM-DD'));
                                    // if (
                                    //   values.trip_pickup_location &&
                                    //   values.trip_dropoff_location
                                    // ) {
                                    //   const data = await callMilesApi(
                                    //     values.trip_pickup_location,
                                    //     values.trip_dropoff_location,
                                    //     e,
                                    //   );
                                    //   if (strictValidObjectWithKeys(data)) {
                                    //     setMiles(data);
                                    //   }
                                    // } else {
                                    //   setMiles({});
                                    // }
                                  }}
                                  onBlur={(e) => {
                                    input.onBlur(e.target.value);
                                  }}
                                  minDate={getPhoenixDateTimeAddOneHour(
                                    'yyyy-MM-dd',
                                  )}
                                  required={
                                    !checkArrayObjectOfKeys(
                                      ['corporate_contact_id', 'last_name'],
                                      values.corporate_contact,
                                    )
                                  }
                                />
                              </>
                            )}
                          </Field>
                        </>
                      )}
                    </Grid>
                    {/* <Grid item xs={4} sm={2} md={4}>
                      {renderPickUpTime(values.type) && (
                        <Field name="pick_up_date_time">
                          {({ meta, input }) => (
                            <>
                              <MdDatePicker
                                {...input}
                                name="pick_up_date_time"
                                value={input.value}
                                errorText={meta.touched && meta.error}
                                disabled={checkArrayObjectOfKeys(
                                  ['corporate_contact_id', 'last_name'],
                                  values.corporate_contact,
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
                                onBlur={(e) => {
                                  input.onBlur(e.target.value);
                                }}
                                minDateTime={getPhoenixDateTimeAddOneHour()}
                                required={
                                  !checkArrayObjectOfKeys(
                                    ['corporate_contact_id', 'last_name'],
                                    values.corporate_contact,
                                  )
                                }
                              />
                            </>
                          )}
                        </Field>
                      )}
                    </Grid> */}
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
                                    component={FinalFormText}
                                    name={`${name}.default_value`}
                                    validate={
                                      values.trip_ui_section_field
                                        .ui_section_transport[index]
                                        .mandatory === 'yes' && required
                                    }
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
                                    disabled={checkArrayObjectOfKeys(
                                      ['corporate_contact_id', 'last_name'],
                                      values.corporate_contact,
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
              <Grid item xs={4} sm={2} md={3}>
                <Field
                  component={FinalFormCheckbox}
                  name="child_trip"
                  valueDefault={values.child_trip}
                  placeholder="Continue with related Trip"
                  disabled={
                    checkArrayObjectOfKeys(
                      ['corporate_contact_id', 'last_name'],
                      values.corporate_contact,
                    ) ||
                    (strictValidObjectWithKeys(current_tripData) &&
                      current_tripData.child_trip &&
                      strictValidArrayWithLength(
                        current_tripData.child_trip_leg_id,
                      ))
                  }
                />
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
                    disabled={
                      (pristine && !isQuote) ||
                      submitting ||
                      !valid ||
                      checkArrayObjectOfKeys(
                        ['corporate_contact_id', 'last_name'],
                        values.corporate_contact,
                      ) ||
                      (strictValidString(loadErr) &&
                        loadErr ===
                          'Please choose another contact, selected contact is disabled')
                    }
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
      {acknowledgeDialog()}
    </Grid>
  );
};
AddTrip.propTypes = {
  isLoad: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.string,
};

AddTrip.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
  type: 'add',
};

const mapStateProps = (state) => {
  return {
    message: state.account_trip.message,
    isLoad: state.account_trip.isLoad,
    loadErr: state.account_trip.loadErr,
    capabilityRolesFromState: state.drivers.roles,
    corporateAccountFromState: state.account_trip.all_corporates,
    userprofile: state.profile.userprofile,
    errorBar: state.account_trip.errData,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callCreateTripApi: (...params) => dispatch(createTrip(...params)),
  callTripIegId: (...params) => dispatch(tripIegId(...params)),
  callBarErrorFlush: (...params) => dispatch(flushBarError(...params)),
  callCorporateAccountApi: (...params) =>
    dispatch(getCorporateAccount(...params)),
  callUpdateTripApi: (...params) => dispatch(updateTrip(...params)),
  callCapabilityRolesApi: (...params) =>
    dispatch(getActiveCapabilityRoles(...params)),
  callGetMyProfileApi: (...params) => dispatch(getMyProfile(...params)),
  callMilesApi: (...params) => dispatch(getMilesFromLatLng(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(AddTrip);

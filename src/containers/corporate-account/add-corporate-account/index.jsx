/* eslint-disable react-hooks/exhaustive-deps */
// / eslint-disable array-callback-return /
// / eslint-disable react-hooks/exhaustive-deps /
import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { Field, Form } from 'react-final-form';
import Typography from '@mui/material/Typography';
import FinalFormText from '../../../components/final-form/input-text';
import ReactTable from '../../../components/react-table';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box } from '@mui/material';
import { CircularProgress } from '@mui/material';
import createDecorator from 'final-form-focus';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  createCorporateAccount,
  flushError,
  getCorporateAccounts,
  getInvoiceCharge,
  updateCorporateAccountByID,
} from '../action';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  strictValidObjectWithKeys,
  strictFilterArrayWithKey,
  strictValidArrayWithLength,
  checkArrayObjectOfKeys,
  strictValidString,
  defaultCurrencyFormat,
} from '../../../utils/common-utils';
import { useSnackbar } from 'notistack';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import GoogleMapsPoc from '../../../components/poc-google';
import TextMaskCustom from '../../../components/custom-input-mask';
import { MINIMUM_LENGTH, VALID_EMAIL } from '../../../utils/regexs';
import { editBalanceRolesPermissions } from '../../../utils/routesPermission';
import { invalidChars } from '../../../utils/constant';
import FinalFormSelect from '../../../components/final-form/final-form-dropdown/final-form-dropdown';
import MDSelect from '../../../components/mdselect';
import { filter, get, includes, map, size, split } from 'lodash';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
  accordion: {
    border: '1px solid #00000018',
    borderBottom: 'unset',
  },
  generalMargin: {
    margin: theme.spacing(1, 0, 0),
  },
  input: {
    width: '100%',
    margin: theme.spacing(2, 0, 0),
    backgroundColor: '#fff',
  },
  input2: {
    width: '100%',
    margin: theme.spacing(2, 0, 0),
    backgroundColor: '#fff',
    maxWidth: 380,
  },
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
  extraWidth: {
    width: 300,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const AddCorporateAccount = ({
  setValue,
  type,
  callCreateCorporateAccountApi,
  callAllCorporateAccountsApi,
  callAllupdateCorporateAccountByIDApi,
  cdf_list,
  userData,
  loadErr,
  message,
  charges,
  callGetInvoiceCharges,
  user,
  invoice_load,
  callFlushErrorApi,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [isLoad, setLoad] = useState(false);
  const [isEnumSelected, setisEnumSelected] = useState(false);
  const [cdf_list_array, setCdfListArray] = useState([]);
  const [cost_value, setCostValue] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [cost_array, setCostArray] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedPO, setIsExpandedPO] = useState(false);

  const handleAccordionChange = (event, expanded) => {
    setIsExpanded(expanded);

    if (expanded) {
      const data = {
        account_id: userData.account_id,
      };
      const id = {
        account_id: '',
      };
      callGetInvoiceCharges(strictValidObjectWithKeys(userData) ? data : id);
    }
  };
  const handleAccordionPoChange = (event, expanded) => {
    setIsExpandedPO(expanded);
  };
  const onSubmit = async (val) => {
    setLoad(true);

    const {
      name,
      address,
      discount,
      postal_code,
      country,
      billing_address,
      billing_postal_code,
      billing_country,
      as_physical_address,
      phone,
      corporate_contact,
      email_id,
      legal_name,
      account_field,
      balance,
      billing_period,
      legal_id,
      customer_ref_no,
      po_number,
      invoice_contact,
      invoice_cycle,
      invoice_per_patient,
    } = val;
    const account_field_filter = strictValidArrayWithLength(account_field)
      ? map(account_field, (i) => {
          if (i.type === 'enum') {
            i.po_per_cost = strictValidArrayWithLength(i.po_per_cost)
              ? map(i.po_per_cost, (j) => {
                  return {
                    ...j,
                    po_number: get(j, 'po_number', ''),
                  };
                })
              : [];
          }
          return i;
        })
      : [];

    if (strictValidObjectWithKeys(userData)) {
      const result = await callAllupdateCorporateAccountByIDApi({
        account_id: userData.account_id,
        values: {
          name: name,
          address: address,
          postal_code: postal_code,
          country: country,
          discount: discount,
          billing_address: billing_address,
          billing_postal_code: billing_postal_code,
          billing_country: billing_country,
          as_physical_address: as_physical_address,
          phone: phone,
          legal_id: legal_id,
          legal_name: legal_name,
          balance: balance,
          corporate_contact: corporate_contact,
          email_id: email_id,
          billing_period: billing_period,
          account_field: account_field_filter,
          customer_ref_no: customer_ref_no,
          po_number: po_number || 'N/A',
          invoice_contact: invoice_contact,
          invoice_cycle: invoice_cycle,
          invoice_per_patient: invoice_per_patient,
        },
      });
      if (result) {
        setLoad(false);
        setValue();
        callAllCorporateAccountsApi();
      } else {
        setLoad(false);
      }
    } else {
      const res = await callCreateCorporateAccountApi({
        name: name,
        address: address,
        postal_code: postal_code,
        country: country,
        billing_address: billing_address,
        billing_postal_code: billing_postal_code,
        billing_country: billing_country,
        as_physical_address: as_physical_address,
        phone: phone,
        corporate_contact: corporate_contact,
        email_id: email_id,
        billing_period: billing_period,
        legal_id: legal_id,
        discount: discount,
        legal_name: legal_name,
        balance: balance,
        account_field: account_field_filter,
        customer_ref_no: customer_ref_no,
        po_number: po_number || 'N/A',
        invoice_contact: invoice_contact,
        invoice_cycle: invoice_cycle,
        invoice_per_patient: invoice_per_patient,
      });
      if (res) {
        setValue();
        setLoad(false);
        callAllCorporateAccountsApi();
      } else {
        setLoad(false);
      }
    }
  };
  const renderTitleWithSpace = (title) => {
    return (
      <Box className={classes.defineWidth}>
        <Typography variant="h8">{title}</Typography>
      </Box>
    );
  };

  useEffect(() => {
    callFlushErrorApi();
  }, []);

  useEffect(() => {
    if (
      strictValidObjectWithKeys(userData) &&
      strictValidArrayWithLength(userData.account_field) &&
      size(userData.account_field.filter((a) => a.type === 'enum')) > 0
    ) {
      setisEnumSelected(true);
    } else if (
      strictValidObjectWithKeys(userData) &&
      strictValidArrayWithLength(userData.account_field) &&
      size(userData.account_field.filter((a) => a.type === 'enum')) > 0 &&
      userData.account_field.length === 1
    ) {
      setisEnumSelected(false);
    } else {
      setisEnumSelected(false);
    }
  }, [userData]);

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

  useEffect(() => {
    const arrdata = [];
    if (
      strictValidObjectWithKeys(userData) &&
      strictValidArrayWithLength(userData.account_field)
    ) {
      userData.account_field.map((a) => {
        if (a.type === 'enum') {
          cdf_list.map((item) => {
            if (a.label === item.name) {
              const costCenterArr = split(item.cost_center_value, ',');
              return (
                strictValidObjectWithKeys(a) &&
                costCenterArr.map((e) => {
                  return arrdata.push(e);
                })
              );
            }
            return false;
          });
        }

        return false;
      });
    }
    setCostArray(arrdata);
    const costValList = userData.account_field
      ? strictValidArrayWithLength(
          filter(userData.account_field, (i) => {
            return i.type === 'enum';
          }),
        )
        ? filter(userData.account_field, (i) => {
            return i.type === 'enum';
          })[0].cost_center_value
        : []
      : [];
    setCostValue(costValList);
  }, [userData]);

  const changeArrayOfObjectToArray = (item) => {
    const arrayData = [];
    // eslint-disable-next-line array-callback-return
    if (size(item) > 0) {
      item.map((a) => {
        arrayData.push(get(a, 'value', a));
        return false;
      });
    }
    return arrayData;
  };

  const validateFirstName = (index) => (value, val) => {
    if (!value && strictValidObjectWithKeys(val)) {
      return (
        <Typography style={{ color: '#C0001F', fontSize: 12, marginTop: 4 }}>
          First Name is Required
        </Typography>
      );
    }
  };
  const validateLastName = (index) => (value, val) => {
    if (!value && strictValidObjectWithKeys(val)) {
      return (
        <Typography style={{ color: '#C0001F', fontSize: 12, marginTop: 4 }}>
          Last Name is Required
        </Typography>
      );
    }
  };

  useEffect(() => {
    if (strictValidArrayWithLength(charges)) {
      const arr = [];
      const arr2 = [];
      charges.map((a) => {
        if (
          strictValidString(a.service_name) &&
          a.service_name !== 'account_id' &&
          a.service_name !== 'id' &&
          a.service_name !== 'Version' &&
          a.service_name !== 'Start Date' &&
          a.service_name !== 'End Date' &&
          a.service_name !== 'Cancellation Fee'
        ) {
          arr.push({
            service_name: a.service_name,
            service_charge: a.service_charge,
          });
          return a.service_name;
        } else {
          a.service_name !== 'account_id' &&
            a.service_name !== 'id' &&
            a.service_name !== 'Cancellation Fee' &&
            a.service_name !== 'Start Date' &&
            a.service_name !== 'End Date' &&
            arr2.push({
              service_name: a.service_name,
              service_charge: a.service_charge,
            });
          return a.service_name;
        }
      });
      setPriceList(arr);
    }
  }, [charges]);

  useEffect(() => {
    const cdf_listArray = [];
    if (strictValidArrayWithLength(cdf_list)) {
      cdf_list.map((a) => {
        if (isEnumSelected && a.type === 'enum') {
          return cdf_listArray.push({
            value: a.name,
            title: a.name,
            disabled: true,
          });
        } else
          return cdf_listArray.push({
            value: a.name,
            title: a.name,
            disabled: false,
          });
      });
    }
    setCdfListArray(cdf_listArray);
  }, [cdf_list, isEnumSelected]);
  const RenderDetails = ({ name, fields, form }) => {
    const po_list = fields.value;
    return (
      <Box mt={1}>
        {strictValidArrayWithLength(po_list) &&
          po_list.map((item, index) => {
            return (
              <Stack alignItems="center" direction="row">
                <Typography sx={{ width: 700, fontSize: 17 }}>
                  {item.name}
                </Typography>
                <Grid sx={{ width: 300 }} xs={6} sm={6} md={3}>
                  <Field
                    component={FinalFormText}
                    name={`${name}.po_per_cost[${index}].po_number`}
                    placeholder="PO Number"
                    defaultValue="N/A"
                  />
                </Grid>
                <Field name={`${name}.po_per_cost[${index}].show_po`}>
                  {({ meta, input }) => {
                    return (
                      <FormControlLabel
                        sx={{ mt: 2, ml: 3 }}
                        control={
                          <Checkbox
                            checked={input.value}
                            onChange={() => {
                              input.onChange(!input.value);
                              form.batch(() => {
                                form.change(
                                  'po_per_cost',
                                  map(po_list, (j) => {
                                    if (j.name === item.name) {
                                      j.show_po = !item.show_po;
                                      return j;
                                    } else {
                                      return j;
                                    }
                                  }),
                                );
                              });
                            }}
                          />
                        }
                        label="Show PO number in invoice"
                      />
                    );
                  }}
                </Field>{' '}
              </Stack>
            );
          })}
      </Box>
    );
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

  const required = (value) => (value ? undefined : 'Required');
  const requiredArray = (value) =>
    strictValidArrayWithLength(value) ? undefined : 'Required';

  const buttonName = strictValidObjectWithKeys(userData)
    ? 'Update C-Account'
    : 'Create C-Account';
  return (
    <Grid item xs={12} md={12} lg={12}>
      <Form
        onSubmit={onSubmit}
        decorators={[focusOnErrors]}
        keepDirtyOnReinitialize
        validate={(values) => {
          const errors = {};
          if (!values.name) {
            errors.name = 'Name is Required';
          }
          if (!values.address) {
            errors.address = 'Address is Required';
          }
          if (!values.postal_code) {
            errors.postal_code = 'Postal Code is Required';
          }
          if (!values.country) {
            errors.country = 'Country Code is Required';
          }
          if (!values.billing_address) {
            errors.billing_address = 'Billing Address is Required';
          }
          if (!values.billing_postal_code) {
            errors.billing_postal_code = 'Postal Code is Required';
          }

          if (!values.legal_name) {
            errors.legal_name = 'Legal Name is Required';
          }

          const membersArrayErrors = [];
          values.phone.forEach((member, memberIndex) => {
            if (member && !MINIMUM_LENGTH.test(member)) {
              membersArrayErrors[memberIndex] =
                'Please Enter Valid Phone Number';
            }
          });
          if (membersArrayErrors.length) {
            errors.phone = membersArrayErrors;
          }
          if (!values.billing_country) {
            errors.billing_country = 'Country Code is Required';
          }
          if (values.discount > 100) {
            errors.discount = 'Please Enter Valid Discount';
          }
          if (values.discount < 0) {
            errors.discount = 'Please Enter Valid Discount';
          }
          if (!values.email_id) {
            errors.email_id = 'Account Email is Required';
          } else if (!VALID_EMAIL.test(values.email_id)) {
            errors.email_id = 'Please Enter valid Email Id';
          }
          if (
            checkArrayObjectOfKeys(
              ['first_name', 'last_name'],
              values.corporate_contact,
              true,
            )
          ) {
            return (errors.corporate_contact = 'Please Enter');
          }
          return errors;
        }}
        mutators={{
          // potentially other mutators could be merged here
          update: (args, state, utils) => {
            utils.changeValue(state, args[0].enabled, (enabled) => 1);
          },
          ...arrayMutators,
        }}
        initialValues={{
          withValidation: strictValidObjectWithKeys(userData),
          name: strictValidObjectWithKeys(userData) ? userData.name : '',
          address: strictValidObjectWithKeys(userData) ? userData.address : '',
          postal_code: strictValidObjectWithKeys(userData)
            ? userData.postal_code
            : '',
          country: strictValidObjectWithKeys(userData)
            ? userData.country
            : 'US',
          billing_address: strictValidObjectWithKeys(userData)
            ? userData.billing_address
            : '',
          billing_postal_code: strictValidObjectWithKeys(userData)
            ? userData.billing_postal_code
            : '',
          billing_country: strictValidObjectWithKeys(userData)
            ? userData.billing_country
            : 'US',
          email_id: strictValidObjectWithKeys(userData)
            ? userData.email_id
            : '',
          as_physical_address: strictValidObjectWithKeys(userData)
            ? userData.as_physical_address
            : 0,
          invoice_contact: strictValidObjectWithKeys(userData)
            ? userData.invoice_contact
            : false,
          phone:
            strictValidObjectWithKeys(userData) &&
            strictValidArrayWithLength(userData.company_contact)
              ? strictFilterArrayWithKey(userData.company_contact, 'phone')
              : [''],
          corporate_contact:
            strictValidObjectWithKeys(userData) &&
            strictValidArrayWithLength(userData.corporate_contact)
              ? userData.corporate_contact
              : [
                  {
                    first_name: '',
                    last_name: '',
                    email_id: '',
                    phone_number: [''],
                    enabled: 1,
                  },
                ],
          billing_period: strictValidObjectWithKeys(userData)
            ? userData.billing_period
            : '',
          invoice_per_patient: strictValidObjectWithKeys(userData)
            ? userData.invoice_per_patient
            : false,
          invoice_cycle: strictValidObjectWithKeys(userData)
            ? userData.invoice_cycle
            : 'None',
          discount: strictValidObjectWithKeys(userData) ? userData.discount : 0,
          legal_id: strictValidObjectWithKeys(userData)
            ? userData.legal_id
            : '',
          legal_name: strictValidObjectWithKeys(userData)
            ? userData.legal_name
            : '',
          balance: strictValidObjectWithKeys(userData) ? userData.balance : '',
          customer_ref_no: strictValidObjectWithKeys(userData)
            ? userData.customer_ref_no.toString()
            : '',
          po_number: strictValidObjectWithKeys(userData)
            ? userData.po_number
            : '',
          po_per_cost: strictValidObjectWithKeys(userData)
            ? userData.po_per_cost
            : [],
          account_field:
            strictValidObjectWithKeys(userData) &&
            strictValidArrayWithLength(userData.account_field)
              ? userData.account_field
              : [],
        }}
        render={({
          handleSubmit,
          pristine,
          values,
          submitting,
          touched,
          valid,
          errors,
          form,
          fields,
        }) => {
          return (
            <Box>
              {}
              <Typography className={classes.mainHeaderText}>
                {strictValidObjectWithKeys(userData)
                  ? 'Edit Corporate Account'
                  : 'Setup Corporate Account'}
              </Typography>
              <Divider className={classes.generalMargin} />
              <Stack mt={3}>
                <Typography className={classes.headerText}>
                  General Information
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
                    <Grid item xs={4} sm={4} md={4}>
                      <Field
                        component={FinalFormText}
                        name="name"
                        id="add_c_account_name"
                        placeholder="Name"
                        required
                        errorText={touched.name && errors.name}
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
                    <Grid item xs={3} sm={4} md={3}>
                      <Field
                        component={FinalFormText}
                        id="add_c_account_legal_id"
                        name="legal_id"
                        placeholder="Legal id"
                        errorText={touched.legal_id && errors.legal_id}
                      />
                    </Grid>
                    <Grid item xs={3} sm={4} md={3}>
                      <Field
                        component={FinalFormText}
                        name="legal_name"
                        placeholder="Legal name"
                        id="add_c_account_legal_name"
                        required
                        errorText={touched.legal_name && errors.legal_name}
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
                    <Grid item xs={4} sm={4} md={6}>
                      <Field id="add_c_account_physical_address" name="address">
                        {({ meta, input }) => (
                          <div>
                            <GoogleMapsPoc
                              {...input}
                              label={'Physical Address'}
                              required
                              errorText={meta.touched && meta.error}
                              defaultValue={input.value}
                              selectOption={(v) => {
                                if (strictValidObjectWithKeys(v)) {
                                  input.onChange(v.description);
                                }
                                // if (values.billing_address) {
                                //   form.batch(() => {
                                //     form.change('billing_address', '');
                                //     form.change('billing_postal_code', '');
                                //     form.change('as_physical_address', 0);
                                //   });
                                // }
                              }}
                              setResults={(e) => {
                                form.batch(() => {
                                  form.change('postal_code', e.zip);
                                });
                              }}
                              isSetLatLong={true}
                              setLatLong={() => {}}
                              onChangeText={(v) => {
                                if (strictValidObjectWithKeys(v)) {
                                  input.onChange(v.description);
                                } else {
                                  input.onChange(v);
                                  form.batch(() => {
                                    form.change('postal_code', '');
                                  });
                                }
                              }}
                            />
                          </div>
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={2} sm={2} md={2}>
                      <Field id="add_c_account_postal_code" name="postal_code">
                        {({ meta, input }) => (
                          <div>
                            <TextField
                              required
                              placeholder="Postal Code"
                              value={input.value}
                              label="Postal Code"
                              onChange={(event) => {
                                input.onChange(event.target.value);
                                if (values.as_physical_address) {
                                  form.batch(() => {
                                    form.change(
                                      'billing_postal_code',
                                      event.target.value,
                                    );
                                  });
                                }
                              }}
                              error={
                                (meta.touched && meta.error) || !input.value
                              }
                              className={classes.input}
                            />
                          </div>
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={2} sm={2} md={2}>
                      <Field
                        component={FinalFormText}
                        name="country"
                        id="add_c_account_country"
                        placeholder="Country"
                        disabled={true}
                        required
                        errorText={touched.country && errors.country}
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
                    <Grid item xs={4} sm={4} md={6}>
                      <Field
                        component={FinalFormText}
                        name="billing_address"
                        id="billing_address"
                        placeholder="Billing Address"
                        disabled={values.as_physical_address}
                        required
                        errorText={
                          touched.billing_address && errors.billing_address
                        }
                      />
                    </Grid>
                    <Grid item xs={2} sm={2} md={2}>
                      <Field
                        component={FinalFormText}
                        id="add_c_account_billing_postal_code"
                        name="billing_postal_code"
                        disabled={values.as_physical_address}
                        placeholder="Postal Code"
                        required
                        errorText={
                          touched.billing_postal_code &&
                          errors.billing_postal_code
                        }
                      />
                    </Grid>
                    <Grid item xs={2} sm={2} md={2}>
                      <Field
                        component={FinalFormText}
                        name="billing_country"
                        id="add_c_account_billing_country"
                        disabled={true}
                        placeholder="Country"
                        required
                        errorText={
                          touched.billing_country && errors.billing_country
                        }
                      />
                    </Grid>
                    <Grid item xs={2} sm={2} md={2}>
                      <Field name="as_physical_address">
                        {({ meta, input }) => (
                          <>
                            <FormControlLabel
                              sx={{ mt: 2 }}
                              control={
                                <Checkbox
                                  checked={input.value === 0 ? false : true}
                                  disabled={
                                    !strictValidString(values.address) ||
                                    !strictValidString(values.postal_code)
                                  }
                                  onChange={() => {
                                    if (input.value === 0) {
                                      input.onChange(1);
                                      form.batch(() => {
                                        form.change(
                                          'billing_address',
                                          values.address,
                                        );
                                        form.change(
                                          'billing_postal_code',
                                          values.postal_code,
                                        );
                                      });
                                    } else {
                                      input.onChange(0);
                                      // const billing_address =
                                      //   strictValidObjectWithKeys(userData)
                                      //     ? userData.billing_address
                                      //     : '';
                                      // const billing_postal_code =
                                      //   strictValidObjectWithKeys(userData)
                                      //     ? userData.billing_postal_code
                                      //     : '';
                                      form.batch(() => {
                                        form.change('billing_address', '');
                                        form.change('billing_postal_code', '');
                                      });
                                    }
                                  }}
                                />
                              }
                              label="Same as physical address"
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
                    <Grid item xs={4} sm={4} md={4}>
                      <Field
                        component={FinalFormText}
                        name="email_id"
                        id="add_c_account_email_id"
                        placeholder="Account Email"
                        required
                        errorText={touched.email_id && errors.email_id}
                      />
                    </Grid>
                  </Grid>
                  <FieldArray id="add_c_account_phone" name="phone">
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
                            <Grid item xs={4} sm={4} md={3}>
                              <Field
                                id="add_c_account_er_phone_number"
                                name={`phone[${index}]`}
                              >
                                {({ meta, input }) => (
                                  <>
                                    <TextMaskCustom
                                      {...input}
                                      label={'ER Phone Number'}
                                      errorText={meta.touched && meta.error}
                                      defaultValue={input.value}
                                      onChangeText={(v) => {
                                        input.onChange(v);
                                      }}
                                      onBlur={(v) => {
                                        input.onBlur(v.target.value);
                                      }}
                                    />
                                  </>
                                )}
                              </Field>
                            </Grid>
                            <Grid item xs={4} sm={4} md={3}>
                              {index === 0 ? (
                                <Button
                                  size="medium"
                                  variant="text"
                                  onClick={() => fields.push('')}
                                  id="add_c_account_add_er_phone_number"
                                  color="primary"
                                  startIcon={<AddIcCallIcon />}
                                  className={classes.button}
                                  disabled={values.phone.length > 3}
                                >
                                  Add ER PHONE NUMBER
                                </Button>
                              ) : (
                                <Button
                                  size="medium"
                                  variant="text"
                                  id="add_c_account_remove_er_phone_number"
                                  onClick={() => fields.remove(index)}
                                  color="error"
                                  startIcon={<RemoveIcon />}
                                  className={classes.button}
                                >
                                  Remove number
                                </Button>
                              )}
                            </Grid>
                          </Grid>
                        ))}
                      </>
                    )}
                  </FieldArray>
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
                    {strictValidObjectWithKeys(userData) && (
                      <Grid item xs={4} sm={4} md={3}>
                        <Field
                          component={FinalFormText}
                          name="customer_ref_no"
                          id="add_c_account_customer_ref_no"
                          placeholder="Customer #"
                          disabled
                        />
                      </Grid>
                    )}
                    <Grid item xs={4} sm={4} md={3}>
                      <Field
                        component={FinalFormText}
                        name="billing_period"
                        placeholder="Billing Period"
                        id="add_c_account_billing_period"
                        type="number"
                        endAdornment={
                          <InputAdornment position="start">Days</InputAdornment>
                        }
                        inputProps={{
                          maxlength: 3,
                          min: 0,
                        }}
                        onKeyDown={(evt) =>
                          invalidChars.includes(evt.key) && evt.preventDefault()
                        }
                      />
                    </Grid>
                    <Grid item xs={2} sm={4} md={3}>
                      <Field
                        component={FinalFormText}
                        name="balance"
                        id="add_c_account_balance"
                        placeholder="Balance"
                        inputProps={{
                          maxlength: 3,
                          min: 0,
                        }}
                        disabled={
                          !strictValidObjectWithKeys(userData) ||
                          editBalanceRolesPermissions(user)
                        }
                        onKeyDown={(evt) =>
                          invalidChars.includes(evt.key) && evt.preventDefault()
                        }
                        type="number"
                        errorText={touched.balance && errors.balance}
                      />
                    </Grid>
                  </Grid>
                  <Grid container xs={4} sm={4} md={2.9}>
                    <Field
                      component={FinalFormText}
                      name="po_number"
                      placeholder="PO Number"
                      id="add_c_account_po_number"
                      // onKeyDown={(evt) =>
                      //   invalidChars.includes(evt.key) && evt.preventDefault()
                      // }
                    />
                  </Grid>
                  <Divider className={classes.margin} />
                  <FieldArray name="corporate_contact">
                    {({ fields }) => (
                      <>
                        <Stack>
                          <Typography className={classes.headerText}>
                            Contacts:{' '}
                            <Button
                              size="medium"
                              variant="text"
                              id="add_c_account_contact_btn_add_new"
                              color="primary"
                              disabled={checkArrayObjectOfKeys(
                                ['first_name', 'last_name'],
                                fields.value,
                              )}
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
                            >
                              Add NEW
                            </Button>
                          </Typography>
                        </Stack>
                        {fields.map((name, index) => (
                          <Grid
                            container
                            key={name}
                            id={'corporate_new_contact_' + index}
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
                            <Grid item xs={4} sm={4} md={1.5}>
                              <Field
                                name={`${name}.first_name`}
                                id="add_c_account_contact_add_new_first_name"
                                placeholder="First Name"
                                // erro={
                                //   touched.first_name && errors.first_name
                                // }
                                disabled={
                                  values.corporate_contact[index].enabled === 0
                                }
                                required={true}
                                validate={validateFirstName(index)}
                              >
                                {({ input, meta }) => {
                                  return (
                                    <>
                                      <TextField
                                        variant="outlined"
                                        error={
                                          values.corporate_contact[index]
                                            .first_name
                                            ? false
                                            : true
                                        }
                                        sx={{
                                          background: '#fafafa',
                                          width: '100%',
                                          mt: 2,
                                        }}
                                        id="add_c_account_contact_add_new_first_name"
                                        name={`${name}.first_name`}
                                        placeholder="First Name"
                                        disabled={
                                          values.corporate_contact[index]
                                            .enabled === 0
                                        }
                                        label="First Name"
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
                            <Grid item xs={4} sm={4} md={1.5}>
                              <Field
                                id="add_c_account_contact_add_new_last_name"
                                component={FinalFormText}
                                name={`${name}.last_name`}
                                placeholder="Last Name"
                                required={true}
                                disabled={
                                  values.corporate_contact[index].enabled === 0
                                }
                                validate={validateLastName(index)}
                              >
                                {({ input, meta }) => {
                                  return (
                                    <>
                                      <TextField
                                        variant="outlined"
                                        error={
                                          values.corporate_contact[index]
                                            .last_name
                                            ? false
                                            : true
                                        }
                                        sx={{
                                          background: '#fafafa',
                                          width: '100%',
                                          mt: 2,
                                        }}
                                        disabled={
                                          values.corporate_contact[index]
                                            .enabled === 0
                                        }
                                        id="add_c_account_contact_add_new_last_name"
                                        name={`${name}.last_name`}
                                        placeholder="Last Name"
                                        label="Last Name"
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
                              <FieldArray name={`${name}.phone_number`}>
                                {({ fields }) => (
                                  <>
                                    {fields.map((v, indexs) => (
                                      <Box
                                        flexDirection="row"
                                        alignItems="center"
                                        display="flex"
                                      >
                                        <Field
                                          id="add_c_account_contact_add_new_phone_number"
                                          name={`${name}.phone_number[${indexs}]`}
                                        >
                                          {({ meta, input }) => (
                                            <>
                                              <TextMaskCustom
                                                {...input}
                                                label={
                                                  'Phone Number (Optional)'
                                                }
                                                errorText={
                                                  meta.touched && meta.error
                                                }
                                                defaultValue={input.value}
                                                onChangeText={(v) => {
                                                  input.onChange(v);
                                                }}
                                                disabled={
                                                  values.corporate_contact[
                                                    index
                                                  ].enabled === 0
                                                }
                                              />
                                            </>
                                          )}
                                        </Field>
                                        {indexs !== 0 && (
                                          <Button
                                            size="medium"
                                            variant="text"
                                            onClick={() =>
                                              fields.remove(indexs)
                                            }
                                            color="error"
                                            id="add_c_account_contact_add_new_phone_number_btn_remove"
                                            startIcon={<RemoveIcon />}
                                            className={classes.button}
                                            sx={{ width: 250 }}
                                          >
                                            Remove
                                          </Button>
                                        )}
                                      </Box>
                                    ))}
                                    <Button
                                      size="medium"
                                      variant="text"
                                      onClick={() => fields.push('')}
                                      color="primary"
                                      id="add_c_account_contact_add_new_er_phone_number_btn"
                                      startIcon={<AddIcCallIcon />}
                                      // className={classes.button}
                                    >
                                      Add ER PHONE NUMBER
                                    </Button>
                                  </>
                                )}
                              </FieldArray>
                            </Grid>
                            <Grid item xs={2} sm={2} md={3}>
                              <Field
                                component={FinalFormText}
                                name={`${name}.email_id`}
                                id="add_c_account_contact_add_new_email_id"
                                placeholder="Email (optional)"
                                disabled={
                                  values.corporate_contact[index].enabled === 0
                                }
                              />
                            </Grid>
                            <Grid item xs={4} sm={4} md={2}>
                              {values.corporate_contact[index].enabled ===
                                0 && (
                                <Button
                                  size="medium"
                                  id="add_c_account_contact_add_new_btn_enable_contact"
                                  variant="outlined"
                                  color="primary"
                                  startIcon={<PowerSettingsNewIcon />}
                                  className={classes.button}
                                  onClick={async () => {
                                    fields.update(index, {
                                      ...values.corporate_contact[index],
                                      enabled: 1,
                                    });
                                  }}
                                >
                                  ENABLE CONTACT
                                </Button>
                              )}

                              {values.corporate_contact[index].enabled ===
                                1 && (
                                <Button
                                  size="medium"
                                  variant="text"
                                  id="add_c_account_contact_add_new_btn_disable_contact"
                                  color="inherit"
                                  startIcon={<PowerSettingsNewIcon />}
                                  className={classes.button}
                                  onClick={() => {
                                    fields.update(index, {
                                      ...values.corporate_contact[index],
                                      enabled: 0,
                                    });
                                  }}
                                >
                                  DISABLE CONTACT
                                </Button>
                              )}
                            </Grid>
                            {/* {/ <Divider orientation="vertical" flexItem /> /} */}
                            {index !== 0 && (
                              <Grid item xs={4} sm={4} md={2}>
                                <Button
                                  size="medium"
                                  variant="text"
                                  color="error"
                                  id="add_c_account_contact_add_new_phone_number_btn_remove"
                                  startIcon={<PersonRemoveIcon />}
                                  className={classes.button}
                                  onClick={() => fields.remove(index)}
                                >
                                  Remove Contact
                                </Button>
                              </Grid>
                            )}
                          </Grid>
                        ))}
                      </>
                    )}
                  </FieldArray>
                  <Divider className={classes.margin} />
                  <Stack mt={3}>
                    <Typography className={classes.headerText}>
                      Invoicing Options
                    </Typography>
                    <Grid item xs={2} sm={2} md={2}>
                      <Field name="invoice_contact">
                        {({ meta, input }) => (
                          <>
                            <FormControlLabel
                              sx={{ mt: 2 }}
                              control={
                                <Checkbox
                                  checked={input.value === true ? true : false}
                                  onChange={() => {
                                    if (input.value === false) {
                                      input.onChange(true);
                                    } else {
                                      input.onChange(false);
                                    }
                                  }}
                                />
                              }
                              label="Add Contact's details in the invoice"
                            />
                          </>
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={2} sm={2} md={2}>
                      <Field name="invoice_per_patient">
                        {({ meta, input }) => (
                          <>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={input.value === true ? true : false}
                                  onChange={() => {
                                    if (input.value === false) {
                                      input.onChange(true);
                                    } else {
                                      input.onChange(false);
                                    }
                                  }}
                                />
                              }
                              label="Invoice per patient"
                            />
                          </>
                        )}
                      </Field>
                    </Grid>
                    <Grid container xs={4} sm={2} md={1}>
                      <Field
                        id="invoice_cycle"
                        name="invoice_cycle"
                        required
                        errorText={
                          touched.invoice_cycle && errors.invoice_cycle
                        }
                      >
                        {({ meta, input }) => (
                          <>
                            <MDSelect
                              onChange={(e) => {
                                input.onChange(e.target.value);
                                form.change('invoice_cycle', e.target.value);
                              }}
                              value={input.value}
                              required
                              errorText={
                                touched.invoice_cycle && errors.invoice_cycle
                              }
                              id="invoice_cycle"
                              data={[
                                {
                                  title: 'None',
                                  value: 'None',
                                },
                                {
                                  title: 'Daily',
                                  value: 'Daily',
                                },
                              ]}
                              placeholder="Invoice cycle"
                              onBlur={(e) => {
                                input.onBlur(e.target.value);
                              }}
                            />
                          </>
                        )}
                      </Field>
                    </Grid>
                  </Stack>
                  <Divider className={classes.margin} />
                  <Stack mt={3}>
                    <Typography className={classes.headerText}>
                      Invoicing Rules
                    </Typography>
                    <Grid mt={2} container xs={4} sm={4} md={1}>
                      <Field
                        component={FinalFormText}
                        name="discount"
                        type="number"
                        placeholder="Discount"
                        endAdornment={'%'}
                        id="add_c_account_discount"
                        errorText={errors.discount && errors.discount}
                      />
                    </Grid>
                    <Grid mt={2} sx={{ width: '40%' }} item xs={2} md={12}>
                      <Accordion
                        className={classes.accordion}
                        defaultExpanded={false}
                        expanded={isExpanded}
                        onChange={handleAccordionChange}
                      >
                        <AccordionSummary
                          classes={{
                            root: classes.accordionSummary,
                            content: classes.accordionSummaryContent,
                          }}
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="execution-details"
                          id="execution-details"
                          style={{ position: 'relative' }}
                        >
                          {renderTitleWithSpace('Invoice Charges')}
                        </AccordionSummary>
                        <AccordionDetails>
                          {invoice_load ? (
                            <>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <CircularProgress />
                              </Box>
                            </>
                          ) : strictValidArrayWithLength(priceList) ? (
                            <>
                              <ReactTable
                                globalFilterShow={false}
                                customHeight={true}
                                headerFilter={false}
                                tableSize={true}
                                height={{
                                  maxHeight: '78vh',
                                  minHeight: '78vh',
                                }}
                                loading={false}
                                pagination={false}
                                fontSizeLg={true}
                                customText="No Feedbacks Found"
                                columnDefs={[
                                  {
                                    Header: 'Service Name',
                                    accessor: 'service_name',
                                    width: 120,
                                    disableSortBy: true,
                                    Cell: (props) => (
                                      <Stack>
                                        <Typography sx={{ fontSize: 17 }}>
                                          {props.row.original.service_name}
                                        </Typography>
                                      </Stack>
                                    ),
                                  },
                                  {
                                    Header: 'Price',
                                    accessor: (originalRow, rowIndex) => {
                                      return (
                                        strictValidObjectWithKeys(
                                          originalRow,
                                        ) && originalRow.event
                                      );
                                    },
                                    width: 60,
                                    disableSortBy: true,
                                    Cell: (props) => (
                                      <Stack>
                                        <Typography sx={{ fontSize: 17 }}>
                                          {defaultCurrencyFormat(
                                            props.row.original.service_charge,
                                          )}
                                        </Typography>
                                      </Stack>
                                    ),
                                  },
                                ]}
                                rowData={priceList}
                              />
                            </>
                          ) : (
                            <Box
                              sx={{
                                display: 'flex',
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <Typography variant="h1">
                                Invoice charges will be shown here
                              </Typography>
                            </Box>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  </Stack>
                  <Divider className={classes.margin} />
                  <FieldArray name="account_field">
                    {({ fields, index }) => (
                      <>
                        {}
                        <Stack>
                          <Typography className={classes.headerText}>
                            Custom Fields:{' '}
                            <Button
                              size="medium"
                              id="add_c_account_custom_field_btn_add"
                              variant="text"
                              disabled={
                                cdf_list_array?.length ===
                                values.account_field?.length
                              }
                              color="primary"
                              startIcon={<PersonAddAltIcon />}
                              className={classes.button}
                              onClick={() => {
                                const isEnumExist =
                                  values.account_field &&
                                  values.account_field.filter((a) => {
                                    return a.type === 'enum';
                                  });
                                if (size(isEnumExist) > 0) {
                                  setisEnumSelected(true);
                                } else {
                                  setisEnumSelected(false);
                                }
                                fields.push({
                                  id: '',
                                  account_id: '',
                                  label: '',
                                  type: '',
                                  default_value: '',
                                  mandatory: '',
                                  ui_section: '',
                                  cost_center_value: [],
                                  label_list: [],
                                });
                              }}
                            >
                              Add
                            </Button>
                          </Typography>
                        </Stack>
                        {fields.map((name, index) => {
                          return (
                            <>
                              <Grid
                                container
                                key={name}
                                id={'custom_field_' + index}
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
                                    validate={required}
                                    name={`${name}.label`}
                                  >
                                    {({ meta, input }) => (
                                      <>
                                        <MDSelect
                                          required={true}
                                          name={`${name}.label`}
                                          onChange={(e) => {
                                            input.onChange(e.target.value);
                                            const requiredData = filter(
                                              cdf_list,
                                              ['name', e.target.value],
                                            )[0];
                                            form.change(
                                              'account_field',
                                              map(values.account_field, (g) => {
                                                if (
                                                  strictValidArrayWithLength(
                                                    g.po_per_cost,
                                                  ) &&
                                                  g.type === 'enum'
                                                ) {
                                                  if (
                                                    g.type === 'enum' &&
                                                    requiredData.type === 'enum'
                                                  ) {
                                                    setCostValue([]);
                                                  }
                                                  return g;
                                                } else {
                                                  g.po_per_cost = [];
                                                }
                                              }),
                                            );

                                            let existingAccData =
                                              values.account_field;
                                            existingAccData[index] = {
                                              ...existingAccData[index],
                                              ui_section: get(
                                                requiredData,
                                                'ui_section',
                                                null,
                                              ),
                                              cost_center_value: [],
                                              id: get(requiredData, 'id', null),
                                              mandatory:
                                                strictValidObjectWithKeys(
                                                  requiredData,
                                                ) &&
                                                requiredData.type === 'enum'
                                                  ? 'yes'
                                                  : '',
                                              label: get(
                                                requiredData,
                                                'name',
                                                null,
                                              ),
                                              type: get(
                                                requiredData,
                                                'type',
                                                null,
                                              ),
                                            };
                                            const isEnumExist =
                                              values.account_field.filter(
                                                (a) => {
                                                  return a.type === 'enum';
                                                },
                                              );
                                            if (size(isEnumExist) > 0) {
                                              setisEnumSelected(true);
                                            } else {
                                              setisEnumSelected(false);
                                            }
                                            form.change(
                                              'account_field',
                                              existingAccData,
                                            );
                                            if (
                                              strictValidArrayWithLength(
                                                values.account_field,
                                              ) &&
                                              values.account_field[index]
                                                .type === 'enum'
                                            ) {
                                              const arrData =
                                                requiredData.cost_center_value.split(
                                                  ',',
                                                );
                                              let data = [];
                                              arrData.map((a) => {
                                                return data.push(a);
                                              });
                                              setCostArray(data);
                                            }
                                          }}
                                          placeholder="Label"
                                          id={`${name}.label`}
                                          errorText={
                                            touched.label && errors.label
                                          }
                                          value={input.value}
                                          data={cdf_list.map((a) => {
                                            if (
                                              values.account_field[index]
                                                .type !== 'enum' &&
                                              a.type === 'enum' &&
                                              isEnumSelected
                                            ) {
                                              return {
                                                value: a.name,
                                                title: a.name,
                                                disabled: true,
                                              };
                                            } else {
                                              return {
                                                value: a.name,
                                                title: a.name,
                                                disabled: false,
                                              };
                                            }
                                          })}
                                          onBlur={(e) => {
                                            input.onBlur(e.target.value);
                                          }}
                                        />
                                      </>
                                    )}
                                  </Field>
                                </Grid>
                                <Grid item xs={4} sm={4} md={2}>
                                  <Field
                                    component={FinalFormSelect}
                                    id="add_c_account_custom_field_mandatory"
                                    name={`${name}.mandatory`}
                                    placeholder="Mandatory"
                                    disabled={
                                      strictValidArrayWithLength(
                                        fields.value,
                                      ) &&
                                      strictValidString(
                                        fields.value[index].type,
                                      ) &&
                                      fields.value[index].type === 'enum'
                                    }
                                    // required
                                    items={[
                                      { title: 'Yes', value: 'yes' },
                                      { title: 'No', value: 'no' },
                                    ]}
                                    errorText={
                                      touched.mandatory && errors.mandatory
                                    }
                                    required
                                    validate={required}
                                  />
                                </Grid>
                                {strictValidArrayWithLength(fields.value) &&
                                strictValidString(fields.value[index].type) &&
                                fields.value[index].type === 'enum' ? (
                                  <Grid item xs={4} sm={4} md={2}>
                                    <Field
                                      id="trip_add_phone_number"
                                      name={`${name}.cost_center_value`}
                                      validate={requiredArray}
                                      required={
                                        fields.value[index].type === 'enum'
                                      }
                                    >
                                      {({ meta, input }) => (
                                        <>
                                          <FormControl
                                            required
                                            className={classes.input2}
                                          >
                                            <InputLabel
                                              style={{
                                                color:
                                                  strictValidArrayWithLength(
                                                    input.value,
                                                  )
                                                    ? '#504947'
                                                    : '#C0001F',
                                              }}
                                              id="demo-multiple-name-label"
                                            >
                                              Cost Center Value
                                            </InputLabel>
                                            <Select
                                              required
                                              error={
                                                strictValidArrayWithLength(
                                                  input.value,
                                                )
                                                  ? false
                                                  : true
                                              }
                                              multiple
                                              displayEmpty
                                              value={changeArrayOfObjectToArray(
                                                input?.value,
                                              )}
                                              // value={input.value}
                                              onChange={(e) => {
                                                const val = e.target.value;
                                                form.change(
                                                  'account_field',
                                                  map(
                                                    values.account_field,
                                                    (e) => {
                                                      const existingPoPerCost =
                                                        e.po_per_cost;
                                                      if (e.type === 'enum') {
                                                        e.po_per_cost = map(
                                                          val,
                                                          (i) => {
                                                            if (
                                                              includes(
                                                                map(
                                                                  existingPoPerCost,
                                                                  (f) => f.name,
                                                                ),
                                                                i,
                                                              )
                                                            ) {
                                                              return filter(
                                                                existingPoPerCost,
                                                                (f) =>
                                                                  f.name === i,
                                                              )[0];
                                                            }
                                                            return {
                                                              name: i,
                                                              po_number: '',
                                                              show_po: false,
                                                            };
                                                          },
                                                        );
                                                      }
                                                      return e;
                                                    },
                                                  ),
                                                );
                                                input.onChange(val);
                                                //  fields.update(index, {});
                                                setCostValue(val);
                                              }}
                                              input={
                                                <OutlinedInput label="Cost Center Value" />
                                              }
                                              MenuProps={MenuProps}
                                            >
                                              {strictValidArrayWithLength(
                                                cost_array,
                                              ) &&
                                                cost_array.map((name) => (
                                                  <MenuItem
                                                    key={name}
                                                    value={name}
                                                    style={getStyles(
                                                      name,
                                                      cost_value,
                                                      theme,
                                                    )}
                                                  >
                                                    {name}
                                                  </MenuItem>
                                                ))}
                                            </Select>
                                          </FormControl>
                                        </>
                                      )}
                                    </Field>
                                  </Grid>
                                ) : (
                                  ''
                                )}
                                <Grid item xs={4} sm={4} md={1.5}>
                                  <Button
                                    size="medium"
                                    variant="text"
                                    id="add_c_account_custom_field_btn_remove"
                                    color="error"
                                    startIcon={<PersonRemoveIcon />}
                                    className={classes.button}
                                    onClick={() => {
                                      if (
                                        values.account_field[index].type ===
                                        'enum'
                                      ) {
                                        setisEnumSelected(false);
                                      }
                                      fields.remove(index);
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </Grid>
                              </Grid>
                            </>
                          );
                        })}
                        {fields.map(
                          (name, index) =>
                            strictValidArrayWithLength(fields.value) &&
                            strictValidString(fields.value[index].type) &&
                            fields.value[index].type === 'enum' &&
                            strictValidArrayWithLength(cost_value) &&
                            strictValidArrayWithLength(
                              fields.value[index].po_per_cost,
                            ) && (
                              <>
                                <Divider className={classes.margin} />
                                <Stack mt={3}>
                                  <Typography className={classes.headerText}>
                                    Cost Center PO Number
                                  </Typography>
                                  <Grid
                                    mt={3}
                                    mb={2}
                                    sx={{ width: '60%' }}
                                    item
                                    xs={2}
                                    md={12}
                                  >
                                    <Accordion
                                      className={classes.accordion}
                                      defaultExpanded={false}
                                      expanded={isExpandedPO}
                                      onChange={handleAccordionPoChange}
                                    >
                                      <AccordionSummary
                                        classes={{
                                          root: classes.accordionSummary,
                                          content:
                                            classes.accordionSummaryContent,
                                        }}
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="execution-details"
                                        id="execution-details"
                                        style={{ position: 'relative' }}
                                      >
                                        {renderTitleWithSpace(
                                          'PO Number Per Cost Center',
                                        )}
                                      </AccordionSummary>
                                      <AccordionDetails>
                                        <FieldArray
                                          name={`${name}.po_per_cost`}
                                        >
                                          {({ fields, index }) => {
                                            return (
                                              <RenderDetails
                                                name={name}
                                                fields={fields}
                                                form={form}
                                              />
                                            );
                                          }}
                                        </FieldArray>
                                      </AccordionDetails>
                                    </Accordion>
                                  </Grid>
                                </Stack>
                              </>
                            ),
                        )}
                      </>
                    )}
                  </FieldArray>

                  <Divider className={classes.generalMargin} />
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
                        id="add_c_account_btn_create_account"
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
                        onClick={() => {
                          setValue(1);
                          callFlushErrorApi();
                        }}
                        type="submit"
                        color="error"
                        id="add_c_account_btn_remove"
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
    </Grid>
  );
};
AddCorporateAccount.propTypes = {
  callCreateCorporateAccountApi: PropTypes.func,
  isLoad: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.string,
};

AddCorporateAccount.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
  type: 'add',
};

const mapStateProps = (state) => {
  return {
    message: state.corporateAccounts.message,
    isLoad: state.corporateAccounts.isLoad,
    loadErr: state.corporateAccounts.loadErr,
    user: state.auth.user,
    cdf_list: state.cdf.cdf,
    charges: state.corporateAccounts.charges,
    invoice_load: state.corporateAccounts.charges_load,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callCreateCorporateAccountApi: (...params) =>
    dispatch(createCorporateAccount(...params)),
  callAllCorporateAccountsApi: (...params) =>
    dispatch(getCorporateAccounts(...params)),
  callAllupdateCorporateAccountByIDApi: (...params) =>
    dispatch(updateCorporateAccountByID(...params)),
  callFlushErrorApi: (...params) => dispatch(flushError(...params)),
  callGetInvoiceCharges: (...params) => dispatch(getInvoiceCharge(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(AddCorporateAccount);

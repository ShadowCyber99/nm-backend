/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import createDecorator from 'final-form-focus';
import React, { useContext, useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import FinalFormSelect from '../../../components/final-form/final-form-dropdown/final-form-dropdown';
import FinalFormText from '../../../components/final-form/input-text';
import {
  dobFormatTime,
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/common-utils';
import { makeStyles } from '@mui/styles';
import MdDatePicker from '../../../components/mdDatePicker';
import { invalidChars } from '../../../utils/constant';
import { getPaymentMethod } from '../../billing/action';
import { connect } from 'react-redux';
import MDSelect from '../../../components/mdselect';
import { addPaymentDetails, updatePaymentDetails } from '../action';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { VALID_DOB } from '../../../utils/regexs';
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
const AddPayment = ({
  data,
  setValue,
  setdata,
  isLoad,
  corporateAccountFromState,
  payments,
  callAddPaymentApi,
  callUpdatePaymentApi,
  loadErr,
  message,
}) => {
  const classes = useStyles();
  const [paymentType, setPaymentType] = useState([]);
  const [corporate_account, setCorporateAccountApi] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const socket = useContext(SocketContext);
    const [errorMsg, setErrorMsg] = useState({
      date: null,
    });


  useEffect(() => {
    const paymentArary = [];
    if (strictValidArrayWithLength(payments)) {
      // eslint-disable-next-line array-callback-return
      payments.map((a) => {
        paymentArary.push({
          value: a.name,
          title: a.value,
        });
      });
    }
    setPaymentType(paymentArary);

    return () => {
      setdata({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payments]);
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
  useEffect(() => {
    const corporateAccountArray = [];
    if (strictValidArrayWithLength(corporateAccountFromState)) {
      // eslint-disable-next-line array-callback-return
      corporateAccountFromState.map((a) => {
        corporateAccountArray.push({
          value: a.account_id,
          title: a.name,
        });
      });
    }
    setCorporateAccountApi(corporateAccountArray);
  }, [corporateAccountFromState]);

  const onSubmit = async (values) => {
    if (strictValidObjectWithKeys(data) && data.id) {
      const res = await callUpdatePaymentApi({
        id: data.id,
        values: values,
      });
      if (res) {
        setValue('1');
        socket.emit('add_payments');
      }
    } else {
      const res = await callAddPaymentApi(values);
      if (res) {
        socket.emit('add_payments');
        setValue('1');
      }
    }
  };
  const buttonName = strictValidObjectWithKeys(data)
    ? 'Update Payment'
    : 'Add Payment';
  return (
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>
        <Grid item>
          <Grid item xs={12} md={12} lg={12}>
            <Form
              onSubmit={onSubmit}
              decorators={[focusOnErrors]}
              keepDirtyOnReinitialize
              validate={(values) => {
                const errors = {};
                if (!values.payment_type) {
                  errors.payment_type = 'Payment Type is Required';
                }
                if (!values.date) {
                  errors.date = 'Date is Required';
                }
                if (
                  (strictValidString(values.date) &&
                    VALID_DOB.test(dobFormatTime(values.date)) ===
                      'Invalid Date') ||
                  VALID_DOB.test(dobFormatTime(values.date)) === false
                ) {
                  errors.date = 'Please enter a valid Date';
                } else if (
                  errorMsg.date === 'invalidDate' ||
                  errorMsg.date === 'minDate' ||
                  errorMsg.date === 'maxDate'
                ) {
                  errors.date = 'Please enter a valid Date';
                }
                if (!values.amount) {
                  errors.amount = 'Amount is Required';
                } else if (values.amount <= 0) {
                  errors.amount = 'Amount Value must be greater than 0';
                }
                if (!values.account_id) {
                  errors.account_id = 'Account Name is Required';
                }
                return errors;
              }}
              initialValues={{
                payment_type: strictValidObjectWithKeys(data)
                  ? data.payment_type
                  : '',
                date: strictValidObjectWithKeys(data) ? data.date : '',
                reference_number: strictValidObjectWithKeys(data)
                  ? data.reference_number
                  : '',
                customer_reference_number: strictValidObjectWithKeys(data)
                  ? data.customer_reference_number
                  : '',
                amount: strictValidObjectWithKeys(data)
                  ? data.amount.toString()
                  : '',
                notes: strictValidObjectWithKeys(data) ? data.notes : '',
                account_id: strictValidObjectWithKeys(data)
                  ? data.account_id
                  : '',
              }}
              render={({
                handleSubmit,
                pristine,
                submitting,
                touched,
                errors,
                valid,
                values,
              }) => {
                return (
                  <Box>
                    <Stack
                      direction="row"
                      alignItems={'center'}
                      justifyContent={'space-between'}
                    >
                      <Typography className={classes.mainHeaderText}>
                        {strictValidObjectWithKeys(data)
                          ? 'Edit Payment'
                          : ' New Payment'}
                      </Typography>
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
                          <Grid
                            id="add_payment_account"
                            item
                            xs={4}
                            sm={2}
                            md={4}
                          >
                            <Field id="add_payment_account" name="account_id">
                              {({ meta, input }) => (
                                <>
                                  <MDSelect
                                    onChange={(e) => {
                                      input.onChange(e.target.value);
                                    }}
                                    required
                                    value={input.value}
                                    id="add_payment_account"
                                    data={corporate_account}
                                    errorText={meta.touched && meta.error}
                                    placeholder="Account"
                                    onBlur={(e) => {
                                      input.onBlur(e.target.value);
                                    }}
                                    disabled={
                                      data.type === 'applied' ||
                                      data.type === 'applied_partially'
                                    }
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
                            <Field
                              component={FinalFormSelect}
                              id="add_payment_type"
                              name="payment_type"
                              placeholder="Payment Type"
                              items={paymentType}
                              errorText={
                                touched.payment_type && errors.payment_type
                              }
                              required
                              // disabled={typeOfPayment === 'credit'}
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
                          <Grid item xs={4} sm={2} md={3}>
                            {
                              <Field id="add_payment_date" name="date">
                                {({ meta, input }) => (
                                  <>
                                    <MdDatePicker
                                      {...input}
                                      onError={(e) => {
                                        setErrorMsg({
                                          ...errorMsg,
                                          date: e,
                                        });
                                      }}
                                      name="date"
                                      id="add_payment_date"
                                      readOnly
                                      value={input.value}
                                      errorText={meta.touched && meta.error}
                                      placeholder="Date"
                                      type="date"
                                      onChange={(e) => {
                                        input.onChange(e);
                                      }}
                                      onBlur={(e) => {
                                        input.onBlur(e.target.value);
                                      }}
                                      disablePast={false}
                                      disableFuture={false}
                                      required
                                    />
                                  </>
                                )}
                              </Field>
                            }
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
                            <Field
                              id="add_payment_reference_number"
                              component={FinalFormText}
                              name="reference_number"
                              placeholder="Reference #"
                              errorText={
                                touched.reference_number &&
                                errors.reference_number
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
                          <Grid item xs={2} sm={2} md={3}>
                            <Field
                              id="add_payment_customer_reference_number"
                              component={FinalFormText}
                              name="customer_reference_number"
                              placeholder="Customer Reference #"
                              errorText={
                                touched.customer_reference_number &&
                                errors.customer_reference_number
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
                          <Grid item xs={2} sm={2} md={3}>
                            <Field
                              component={FinalFormText}
                              id="add_payment_amount"
                              name="amount"
                              placeholder="Amount"
                              required
                              errorText={touched.amount && errors.amount}
                              inputProps={{
                                maxlength: 3,
                                min: 1,
                              }}
                              onKeyDown={(evt) =>
                                invalidChars.includes(evt.key) &&
                                evt.preventDefault()
                              }
                              type="number"
                              disabled={
                                data.type === 'applied' ||
                                data.type === 'applied_partially'
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
                          <Grid item xs={3} sm={2} md={3}>
                            <Field
                              id="add_payment_notes"
                              component={FinalFormText}
                              name="notes"
                              placeholder="Notes"
                              multiline
                              rows={4}
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
                          <Grid item xs={2} sm={6} md={8}>
                            <Button
                              disabled={pristine || submitting || !valid}
                              onClick={handleSubmit}
                              id="add_payment_btn_submit"
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
                              id="add_payment_btn_cancel"
                              onClick={() => {
                                setValue('1');
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
          </Grid>
        </Grid>
      </main>
    </div>
  );
};
AddPayment.propTypes = {
  callAddUserApi: PropTypes.func,
  callResetMessageApi: PropTypes.func,
  callUserRolesApi: PropTypes.func,
  isLoad: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

AddPayment.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};
const mapStateProps = (state) => {
  return {
    message: state.payments.payment.message,
    isLoad: state.payments.payment.isLoad,
    loadErr: state.payments.payment.loadErr,
    payments: state.billing.paymentMethod.data,
    corporateAccountFromState: state.payments.corporateAccounts.data,
  };
};
const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callPaymentMethodApi: (...params) => dispatch(getPaymentMethod(...params)),
  callAddPaymentApi: (...params) => dispatch(addPaymentDetails(...params)),
  callUpdatePaymentApi: (...params) =>
    dispatch(updatePaymentDetails(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(AddPayment);

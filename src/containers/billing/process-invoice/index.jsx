/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { defaultPhoenixDateTime } from '../../../utils/common-utils';
import { DefaultDate } from '../../../utils/constant';
import { getCorporateAccount } from '../../trip-management/action';
import { makeStyles } from '@mui/styles';
import { Field, Form } from 'react-final-form';
import createDecorator from 'final-form-focus';
import FinalFormSelect from '../../../components/final-form/final-form-dropdown/final-form-dropdown';
import MdDatePicker from '../../../components/mdDatePicker';
import CheckIcon from '@mui/icons-material/Check';

const focusOnErrors = createDecorator();

const useStyles = makeStyles((theme) => ({
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
}));

const BillingReport = () => {
  const classes = useStyles();

  const onSubmit = (values) => {};

  return (
    <>
      <Grid item xs={12} md={12} lg={12}>
        <Form
          onSubmit={onSubmit}
          decorators={[focusOnErrors]}
          keepDirtyOnReinitialize
          validate={(values) => {
            const errors = {};
            if (!values.entity) {
              errors.entity = 'Entity is Required';
            }

            return errors;
          }}
          initialValues={{
            entity: 'GMT Arizona',
            invoice_date: defaultPhoenixDateTime(new Date(), DefaultDate),
            from_date: '',
            pickup_date: '',
            selection: 'all',
            zero_bal: 0,
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
                <Stack mt={3}>
                  <Typography className={classes.mainHeaderText}>
                    Process Invoice
                  </Typography>
                  <Divider className={classes.generalMargin} />
                </Stack>
                <Stack mt={3}>
                  <Typography className={classes.headerText}>
                    Parameter Selection
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
                      <Grid item xs={4} sm={2} md={4}>
                        <Field
                          component={FinalFormSelect}
                          name="entity"
                          placeholder="Entity"
                          disabled
                          required
                          items={[
                            {
                              title: 'GMT Arizona',
                              value: 'GMT Arizona',
                            },
                          ]}
                          errorText={
                            touched.vehicle_status && errors.vehicle_status
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
                        <Field name="invoice_date">
                          {({ meta, input }) => (
                            <>
                              <MdDatePicker
                                {...input}
                                disablePast={false}
                                name="invoice_date"
                                value={input.value}
                                errorText={meta.touched && meta.error}
                                placeholder="Invoice Date"
                                type="date"
                                onChange={(e) => {
                                  input.onChange(e);
                                }}
                                onBlur={(e) => {
                                  input.onBlur(e.target.value);
                                }}
                                // minDateTime={getPhoenixDateTimeAddOneHour()}
                                required
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
                        <Field name="from_date">
                          {({ meta, input }) => (
                            <>
                              <MdDatePicker
                                {...input}
                                disablePast={false}
                                name="from_date"
                                value={input.value}
                                errorText={meta.touched && meta.error}
                                placeholder="From Pickup Date"
                                type="date"
                                onChange={(e) => {
                                  input.onChange(e);
                                }}
                                onBlur={(e) => {
                                  input.onBlur(e.target.value);
                                }}
                                // minDateTime={getPhoenixDateTimeAddOneHour()}
                                required
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
                        <Field name="pickup_date">
                          {({ meta, input }) => (
                            <>
                              <MdDatePicker
                                {...input}
                                disablePast={false}
                                name="pickup_date"
                                value={input.value}
                                errorText={meta.touched && meta.error}
                                placeholder="To Pickup Date"
                                type="date"
                                onChange={(e) => {
                                  input.onChange(e);
                                }}
                                onBlur={(e) => {
                                  input.onBlur(e.target.value);
                                }}
                                // minDateTime={getPhoenixDateTimeAddOneHour()}
                                required
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
                        <Field name="zero_bal">
                          {({ meta, input }) => (
                            <>
                              <FormControlLabel
                                sx={{ mt: 2 }}
                                control={
                                  <Checkbox
                                    disabled
                                    checked={input.value === 0 ? false : true}
                                    onChange={() => {
                                      if (input.value === 0) {
                                        input.onChange(1);
                                      } else {
                                        input.onChange(0);
                                      }
                                    }}
                                  />
                                }
                                label="Include $0 balance trips"
                              />
                            </>
                          )}
                        </Field>
                      </Grid>
                    </Grid>
                    <Stack mt={3}>
                      <Typography className={classes.headerText}>
                        Customer Selection
                      </Typography>
                    </Stack>
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
                        <Field name="selection">
                          {({ meta, input }) => (
                            <>
                              <RadioGroup
                                row
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={input.value}
                                onChange={(e) => input.onChange(e.target.value)}
                              >
                                <FormControlLabel
                                  sx={{ mt: 2 }}
                                  value="all"
                                  control={<Radio />}
                                  label="All Customers"
                                />
                                <FormControlLabel
                                  sx={{ mt: 2 }}
                                  value="single"
                                  control={<Radio />}
                                  label="Single Customer"
                                />
                              </RadioGroup>
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
                          component={FinalFormSelect}
                          name="customer"
                          placeholder="Choose Customer"
                          disabled={values.selection === 'all'}
                          required
                          items={[
                            {
                              title: 'Infinity Hospital',
                              value: 'Infinity Hospital',
                            },
                          ]}
                        />
                      </Grid>
                    </Grid>
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
                      <Grid sx={{ mt: 1 }} item xs={4} sm={6} md={8}>
                        <Button
                          disabled={submitting || !valid}
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
                          Process Invoice
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
    </>
  );
};

BillingReport.propTypes = {
  callInvoicingApi: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

BillingReport.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.billing.invoice.message,
    isLoad: state.billing.invoice.isLoad,
    loadErr: state.billing.invoice.loadErr,
    data: state.billing.invoice.data,
    corporateAccountFromState: state.trip.allTrips.all_corporates,
    isLoadInner: state.billing.invoice.isLoadInner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callCorporateAccountApi: (...params) =>
    dispatch(getCorporateAccount(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(BillingReport);

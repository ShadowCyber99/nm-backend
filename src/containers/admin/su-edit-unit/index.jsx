/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useContext, useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';
import createDecorator from 'final-form-focus';
import { Box, Button, Divider, Grid, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import FinalFormSelect from '../../../components/final-form/final-form-dropdown/final-form-dropdown';
import CheckIcon from '@mui/icons-material/Check';
import { CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  createUnit,
  getUnitDrivers,
  getUnitVehicles,
  getDriverVehicle,
  updateUnit,
  resetMessage,
} from '../action';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getPhoenixDateTime,
  removeObjectById,
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/common-utils';
import MdDatePicker from '../../../components/mdDatePicker';
import { useSnackbar } from 'notistack';
import moment from 'moment';
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
}));
const SuperAdminEditUnits = ({
  isLoad,
  setValue,
  callUnitDriversApi,
  callUnitVehiclesApi,
  drivers,
  vehicles_code,
  data,
  callCreateUnitApi,
  callDriverVehicle,
  loadErr,
  message,
  callUpdateUnitApi,
  callResetMessage,
}) => {
  const classes = useStyles();
  const [vehiclesCode, setVehicleCode] = useState([]);
  const [allDrivers, setDrivers] = useState([]);
  const [diffTime, setDiffTime] = useState('');
  const { enqueueSnackbar } = useSnackbar();
    const socket = useContext(SocketContext);

  const unitDriverVehicle = async (values) => {
    if (values.start_time && values.end_time) {
      if (
        strictValidObjectWithKeys(data) &&
        strictValidObjectWithKeys(values)
      ) {
        values.unit_id = data.unit_id;
      }
      values.status = 'active';
      const my_result = await callDriverVehicle(values);
      if (!strictValidObjectWithKeys(data)) {
        const roleArray = [];
        if (strictValidArrayWithLength(my_result.driver)) {
          my_result.driver.map((a) => {
            roleArray.push({
              value: a.driver_id,
              title: `${a.first_name} ${a.last_name}`,
            });
          });
        }
        setDrivers(roleArray);
        const vehicleArray = [];
        if (strictValidArrayWithLength(my_result.vehicle)) {
          my_result.vehicle.map((a) => {
            vehicleArray.push({
              value: a.vehicle_id,
              title: a.vehicle_code,
            });
          });
        }
        setVehicleCode(vehicleArray);
      }
    }
  };

  useEffect(async () => {
    if (strictValidObjectWithKeys(data)) {
      const my_result = await callDriverVehicle({
        start_time: data.start_time,
        end_time: data.end_time,
        unit_id: data.unit_id,
      });
      const roleArray = [];
      if (strictValidArrayWithLength(my_result.driver)) {
        my_result.driver.map((a) => {
          roleArray.push({
            value: a.driver_id,
            title: `${a.first_name} ${a.last_name}`,
          });
        });
      }
      setDrivers(roleArray);
      const vehicleArray = [];
      if (strictValidArrayWithLength(my_result.vehicle)) {
        my_result.vehicle.map((a) => {
          vehicleArray.push({
            value: a.vehicle_id,
            title: a.vehicle_code,
          });
        });
      }
      setVehicleCode(vehicleArray);
    }
  }, [data]);

  const onSubmit = async (values) => {
    if (strictValidObjectWithKeys(data) && data.unit_id) {
      const dataRes = {
        unit_id: data.unit_id,
        values: values,
      };
      const res = await callUpdateUnitApi(dataRes);

      if (res) {
        socket.emit('create_unit', data.unit_id);
        setValue(1);
      }
    } else {
      const res = await callCreateUnitApi(values);
      if (res) {
        socket.emit('create_unit', res.unit_id);
        setValue(1);
      }
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
    setTimeout(() => {
      callResetMessage();
    }, 1000);
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
  const buttonName = strictValidObjectWithKeys(data)
    ? 'Update Unit'
    : 'Create Unit';

  return (
    <div>
      <Form
        onSubmit={onSubmit}
        decorators={[focusOnErrors]}
        mutators={{
          setEndTime: (args, state, utils) => {
            utils.changeValue(state, 'end_time', () => '');
          },
        }}
        keepDirtyOnReinitialize
        validate={(values) => {
          const errors = {};
          if (!values.driver_id) {
            errors.driver_id = 'Driver is Required';
          }
          if (!values.attendant_id) {
            errors.attendant_id = 'Attendant is Required';
          }

          if (!values.start_time) {
            errors.start_time = 'Shift Start Time is Required';
          }
          if (!values.end_time) {
            errors.end_time = 'End Time is Required';
          }
          if (!values.vehicle_id) {
            errors.vehicle_id = 'Vehicle Code is Required';
          }
          return errors;
        }}
        initialValues={{
          driver_id: strictValidObjectWithKeys(data) ? data.driver_id : '',
          attendant_id: strictValidObjectWithKeys(data)
            ? data.attendant_id
            : '',
          start_time: strictValidObjectWithKeys(data) ? data.start_time : null,
          end_time: strictValidObjectWithKeys(data) ? data.end_time : null,
          vehicle_id: strictValidObjectWithKeys(data) ? data.vehicle_id : '',
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
          const filteredDrivers = removeObjectById(
            allDrivers,
            values.driver_id,
          );
          let date = values.start_time && new Date(values.start_time);

          const maxDate = values.start_time
            ? date.setDate(date.getDate() + 1)
            : new Date();

          if (values.start_time && values.end_time) {
            var startTime = moment(values.start_time);
            var endTime = moment(values.end_time);
            var duration = moment.duration(endTime.diff(startTime));

            var hours = parseInt(duration.asHours());
            var minutes = parseInt(duration.asMinutes()) % 60;
            if (minutes === 0) {
              setDiffTime(hours + ' hour.');
            } else if (hours === 0) {
              setDiffTime(minutes + ' minutes.');
            } else if (hours === 24) {
              setDiffTime('24 hour');
            } else {
              setDiffTime(hours + ' hour and ' + minutes + ' minutes.');
            }
          }
          return (
            <Box>
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
                    <Grid item xs={2} sm={2} md={4}>
                      <Field name="start_time">
                        {({ meta, input }) => (
                          <>
                            <MdDatePicker
                              {...input}
                              name="start_time"
                              value={input.value}
                              errorText={meta.touched && meta.error}
                              placeholder="Shift Start Time"
                              type="datetime-local"
                              disabled={
                                strictValidObjectWithKeys(data) &&
                                data.status === 'active'
                              }
                              onChange={(e) => {
                                // setmyDrivers();
                                // setVehicleCode();
                                // input.onChange(e);
                              }}
                              onSubmit={(e) => {
                                // setmyDrivers();
                                input.onChange(e);
                                // form.mutators.setEndTime();
                                // setDiffTime('');
                              }}
                              onBlur={(e) => {
                                input.onBlur(e.target.value);
                              }}
                              required
                              minDateTime={
                                !strictValidObjectWithKeys(data) &&
                                getPhoenixDateTime()
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
                    <Grid item xs={2} sm={2} md={4}>
                      <Field name="end_time">
                        {({ meta, input }) => (
                          <>
                            <MdDatePicker
                              {...input}
                              name="end_time"
                              value={input.value}
                              errorText={meta.touched && meta.error}
                              placeholder="Shift End Time"
                              type="datetime-local"
                              disabled={!values.start_time}
                              minDateTime={getPhoenixDateTime()}
                              maxDateTime={maxDate}
                              onChange={(e) => {
                                // input.onChange(e);
                                // unitDriverVehicle({
                                //   start_time: values.start_time,
                                //   end_time: values.end_time,
                                // });
                              }}
                              onSubmit={(e) => {
                                input.onChange(e);
                                unitDriverVehicle({
                                  start_time: values.start_time,
                                  end_time: e,
                                });
                              }}
                              onBlur={(e) => {
                                input.onBlur(e.target.value);
                              }}
                              required
                            />
                          </>
                        )}
                      </Field>
                    </Grid>
                    {strictValidString(diffTime) && (
                      <Typography
                        sx={{ marginTop: 7.5, marginLeft: 2 }}
                        color="error"
                        variant="h3"
                      >
                        The Shift timing is for {diffTime}
                      </Typography>
                    )}
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
                        name="driver_id"
                        placeholder="Select Driver"
                        required
                        items={allDrivers}
                        disabled={
                          !values.end_time ||
                          !strictValidArrayWithLength(allDrivers) ||
                          strictValidObjectWithKeys(data)
                        }
                        errorText={touched.driver_id && errors.driver_id}
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
                        component={FinalFormSelect}
                        name="attendant_id"
                        placeholder="Select Attendant"
                        required
                        disabled={
                          !values.driver_id ||
                          !strictValidArrayWithLength(filteredDrivers) ||
                          strictValidObjectWithKeys(data)
                        }
                        items={filteredDrivers}
                        errorText={touched.attendant_id && errors.attendant_id}
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
                        component={FinalFormSelect}
                        name="vehicle_id"
                        placeholder="Vehicle Code"
                        required
                        items={vehiclesCode}
                        disabled={
                          !values.end_time ||
                          !strictValidArrayWithLength(vehiclesCode) ||
                          strictValidObjectWithKeys(data)
                        }
                        errorText={touched.vehicle_id && errors.vehicle_id}
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
                        onClick={() => setValue('1')}
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
    </div>
  );
};

SuperAdminEditUnits.propTypes = {
  callUnitDriversApi: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

SuperAdminEditUnits.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.unit.message,
    isLoad: state.unit.isLoad,
    loadErr: state.unit.loadErr,
    vehicles_code: state.unit.vehicles_code,
    drivers: state.unit.drivers,
    isLoadInner: state.unit.isLoadInner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callUnitDriversApi: (...params) => dispatch(getUnitDrivers(...params)),
  callUnitVehiclesApi: (...params) => dispatch(getUnitVehicles(...params)),
  callCreateUnitApi: (...params) => dispatch(createUnit(...params)),
  callUpdateUnitApi: (...params) => dispatch(updateUnit(...params)),
  callDriverVehicle: (...params) => dispatch(getDriverVehicle(...params)),
  callResetMessage: (...params) => dispatch(resetMessage(...params)),
});
export default connect(mapStateProps, mapDispatchToProps)(SuperAdminEditUnits);

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
  Menu,
  ListItemIcon,
  ListItemText,
  FormHelperText,
} from '@mui/material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dialog from '../../../components/dialog';
import {
  convertToPoundsWithoutdecimals,
  formatDate,
  formatDateTime,
  getPhoenixDateTime,
  isBlank,
  limitWords,
  strictValidArrayWithKey,
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/common-utils';
import ReactTable from '../../../components/react-table';
import { getTransportAccount } from '../action';
import {
  DateFilter,
  CapabilityFilters,
  SelectColumnFilter,
} from '../../../components/react-table/helper';
import {
  transportStatus,
  TransportStatusPreDefined,
} from '../../../utils/constant';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { makeStyles } from '@mui/styles';
import moment from 'moment';
import {
  submitFeedback,
  flushMessage,
  getUserFeedback,
} from '../../trip-management/action';
import CellTypes from '../../../components/react-table/components/renderTypes';
import MDTooltip from '../../../components/tooltip';
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
import UndoIcon from '@mui/icons-material/Undo';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import InfoTransportDetails from '../info-dialog';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import { getActiveCapabilityRoles } from '../../vehicle-management/action';
import store from 'store2';
import { SocketContext } from '../../../hooks/useSocketContext';
import { Field, Form } from 'react-final-form';
import FinalFormText from '../../../components/final-form/input-text';
import { LoadingButton } from '@mui/lab';
import arrayMutators from 'final-form-arrays';
import createDecorator from 'final-form-focus';
import { useSnackbar } from 'notistack';
import { validObjectWithParameterKeys } from '../../../utils/common-utils';
import { size, truncate } from 'lodash';
const focusOnErrors = createDecorator();

const useStyles = makeStyles((theme) => ({
  header: {
    width: 150,
    marginTop: theme.spacing(0.5),
    fontSize: 16,
  },
  subtitle: {
    width: 360,
    margin: theme.spacing(0.5, 2),
    fontSize: 16,
  },
  buttonForceAction: {
    width: 170,
    textTransform: 'capitalize',
  },
  helperText: {
    margin: `${theme.spacing(0.2, 0, 0, 0)} !important`,
    color: theme.palette.error.main,
    backgroundColor: '#fff',
  },
  title: {
    margin: theme.spacing(2, 2),
    fontSize: 20,
  },
}));
const List = ({
  setValue,
  isLoad,
  isLoadInner,
  message,
  setData,
  callAllTransportApi,
  userprofile,
  callDeleteTrip,
  transport,
  callCapabilityRolesApi,
  setTripId,
  setTransportId,
  calladdFeedback,
  callFlushMessage,
  callGetFeedback,
  isLoadErr,
  feedbackMess,
  userFeedback,
}) => {
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [isInfoDialog, setIsInfoDialog] = useState(false);
  const [current, setCurrent] = useState({});
  const [dialogMessage, setDialogMessage] = useState('');
  const classes = useStyles();
  const [status, setStatus] = React.useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [clearFilters, setClearFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [tableSize, setTableSize] = useState(false);
  const [disable, setDisable] = useState(false);
  const [childTripDialog, setChildTripDialog] = useState(false);
  const [messageStatus, setMessageStatus] = useState('aborted');
  const [isFeedbackDialog, setIsFeedbackDialog] = useState(false);
  const [showMessage, setShowMessage] = useState('assigned');
  const socket = useContext(SocketContext);

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const callAPi = async () => {
    await callAllTransportApi();
    await callCapabilityRolesApi();
  };
  useEffect(() => {
    callAPi();
  }, []);

  const deleteTripFun = async (val) => {
    if (
      val.status === 'unassigned' &&
      strictValidObjectWithKeys(val.filed) &&
      strictValidObjectWithKeys(val.filed.base_trip) &&
      strictValidArrayWithLength(val.filed.base_trip.child_trip_leg_id)
    ) {
      deleteToggle();
      deleteChildToggle();
      setDisable(true);
    } else if (
      status === 'aborted' &&
      strictValidObjectWithKeys(val.filed) &&
      strictValidObjectWithKeys(val.filed.base_trip) &&
      strictValidArrayWithLength(val.filed.base_trip.child_trip_leg_id)
    ) {
      setMessageStatus('aborted');
      deleteToggle();
      deleteChildToggle();
      setDisable(true);
    } else if (status !== 'aborted') {
      changeTransportStatus(current);
    } else {
      const authTokenFlag = store('authToken');
      socket.emit('transport', {
        id: val.filed.id,
        status: status,
        timezone: moment.tz.guess(),
        token: authTokenFlag,
      });
      deleteToggle();
      setDisable(true);
    }
  };
  const changeTransportStatus = async (val) => {
    const authTokenFlag = store('authToken');
    socket.emit('transport', {
      id: val.filed.id,
      status: status,
      timezone: moment.tz.guess(),
      token: authTokenFlag,
    });
    deleteToggle();
  };

  useEffect(() => {
    if (feedbackMess)
      enqueueSnackbar('Feedback Added Successfully!', {
        variant: 'success',
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
    callFlushMessage();
  }, [feedbackMess]);

  useEffect(() => {
    if (
      strictValidString(showMessage) &&
      showMessage === 'unassigned' &&
      childTripDialog === false
    )
      enqueueSnackbar('Transport Unassigned Successfully!', {
        variant: 'success',
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
    setShowMessage('assigned');
  }, [showMessage]);

  const deleteToggle = () => {
    setIsDeleteDialog(!isDeleteDialog);
    if (!(status === 'aborted' || status === 'unassigned')) {
      setStatus('');
    }
  };
  const infoToggle = () => {
    setIsInfoDialog(!isInfoDialog);
  };

  useEffect(() => {
    socket.on('transport_status', (callback) => {
      if (
        strictValidObjectWithKeys(userprofile) &&
        strictValidArrayWithKey([5, 3, 2, 1, 6, 8], userprofile.role_id)
      ) {
        setRefreshing(true);
        callAllTransportApi();
        setClearFilters(true);
        setTableSize(true);
      }
    });
    socket.on(`trip_status`, (callback) => {
      if (
        strictValidObjectWithKeys(userprofile) &&
        strictValidArrayWithKey([5, 3, 2, 1, 6, 8], userprofile.role_id)
      ) {
        setRefreshing(true);
        callAllTransportApi();
        setClearFilters(true);
        setTableSize(true);
      }
    });
    return () => {
      socket.off('trip_status');
      socket.off('transport_status');
    };
  }, []);
  const deleteTripWithChild = async () => {
    const authTokenFlag = store('authToken');
    const res = await socket.emit('transport', {
      id: current.filed.id,
      status: status === 'aborted' ? status : current.status,
      timezone: moment.tz.guess(),
      token: authTokenFlag,
    });
    if (res) {
      enqueueSnackbar('Transport Unassigned Successfully!', {
        variant: 'success',
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
    }
    deleteChildToggle();
    setStatus('');
  };
  const deleteChildToggle = () => {
    setChildTripDialog(!childTripDialog);
  };
  const deleteChildTrips = () => {
    return (
      <Dialog
        fullScreen={false}
        isOpen={childTripDialog}
        fullWidth={true}
        maxWidth={'sm'}
        sxAppBar={{ justifyContent: 'center', alignItems: 'center' }}
        sxTitle={{ fontSize: 24 }}
        closeIcon={false}
        appBarColor="info"
        title={'Info !'}
        handleClose={() => {
          deleteChildToggle();
        }}
      >
        <DialogContent>
          <DialogContentText
            className={classes.title}
            id="alert-dialog-slide-description"
          >
            All following related trips will be {messageStatus}:
          </DialogContentText>
          <Box flexDirection="row" display="flex" flexWrap="wrap">
            {strictValidObjectWithKeys(current.filed) &&
              strictValidObjectWithKeys(current.filed.base_trip) &&
              strictValidArrayWithLength(
                current.filed.base_trip.child_trip_leg_id,
              ) &&
              current.filed.base_trip.child_trip_leg_id.map((a) => {
                return (
                  <DialogContentText className={classes.title}>
                    {a}
                  </DialogContentText>
                );
              })}
          </Box>
          <Box>
            <DialogContentText
              className={classes.title}
              id="alert-dialog-slide-description"
            >
              Do you want to continue?
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: 'space-around', display: 'flex', mt: 2 }}
        >
          <Button
            color="success"
            className={classes.buttonForceAction}
            variant="outlined"
            onClick={() => deleteTripWithChild(current.trip_id)}
          >
            Yes
          </Button>
          <Button
            className={classes.buttonForceAction}
            color="error"
            variant="outlined"
            onClick={() => deleteChildToggle()}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const deleteDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        isOpen={isDeleteDialog}
        title={'Are you sure ?'}
        handleClose={() => {
          deleteToggle();
        }}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {dialogMessage}
          </DialogContentText>
          {strictValidObjectWithKeys(current) &&
            strictValidObjectWithKeys(current.filed) &&
            (current.status === 'dispatch_requested' ||
              current.status === 'cancelled') && (
              <>
                <Box mt={2}>
                  <Stack direction="row">
                    <DialogContentText className={classes.header}>
                      Leg ID
                    </DialogContentText>
                    <DialogContentText className={classes.subtitle}>
                      {current.filed.base_trip.leg_id}
                    </DialogContentText>
                  </Stack>
                  <Stack direction="row">
                    <DialogContentText className={classes.header}>
                      Patient Name
                    </DialogContentText>
                    <DialogContentText className={classes.subtitle}>
                      {current.filed.base_patient.last_name}
                      {','}
                      {current.filed.base_patient.first_name}
                    </DialogContentText>
                  </Stack>
                  <Stack direction="row">
                    <DialogContentText className={classes.header}>
                      Driver Name
                    </DialogContentText>
                    <DialogContentText className={classes.subtitle}>
                      {current.filed.base_unit.driver_name}
                    </DialogContentText>
                  </Stack>
                  <Stack direction="row">
                    <DialogContentText className={classes.header}>
                      Vehicle Code
                    </DialogContentText>
                    <DialogContentText className={classes.subtitle}>
                      {current.filed.base_vehicle.vehicle_code}
                    </DialogContentText>
                  </Stack>
                  <Stack direction="row">
                    <DialogContentText className={classes.header}>
                      Account
                    </DialogContentText>
                    <DialogContentText className={classes.subtitle}>
                      {strictValidObjectWithKeys(
                        current.filed.corporate_account,
                      ) && current.filed.corporate_account.name}
                    </DialogContentText>
                  </Stack>
                </Box>
              </>
            )}
          {strictValidObjectWithKeys(current) &&
            strictValidObjectWithKeys(current.filed) &&
            current.status === 'force' && (
              <>
                <Box mt={2}>
                  <Stack direction="row">
                    <DialogContentText className={classes.header}>
                      Current Status{' '}
                    </DialogContentText>
                    <DialogContentText
                      variant="h3"
                      className={classes.subtitle}
                    >
                      {transportStatus(current.filed.status)}
                    </DialogContentText>
                  </Stack>
                  <Stack alignItems="center" direction="row" mt={2}>
                    <DialogContentText className={classes.header}>
                      Transition To
                    </DialogContentText>
                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                      <InputLabel id="demo-simple-select-helper-label">
                        Transition to
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={status}
                        label="Transition to"
                        onChange={handleChange}
                      >
                        {TransportStatusPreDefined.map((res) => {
                          return (
                            <MenuItem value={res.value}>{res.title}</MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Stack>
                </Box>
              </>
            )}
        </DialogContent>

        <DialogActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => deleteToggle()}
          >
            Cancel
          </Button>
          <Button
            // disabled={current.status === 'force' || isLoad ? !status : false}
            disabled={disable}
            color="error"
            variant="outlined"
            onClick={() => {
              if (current.status === 'force' && status !== 'aborted') {
                changeTransportStatus(current);
                setDisable(true);
              } else {
                deleteTripFun(current);
                setDisable(true);
              }
              if (current.status === 'unassigned') {
                setShowMessage('unassigned');
              }
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const transportAction = (input) => {
    let message_dilog = '';
    if (input.status === 'dispatch_requested') {
      message_dilog = 'Do you want to dispatch this transport from the list ?';
    } else if (input.status === 'force') {
      message_dilog = 'Do you want to force the transport status ?';
    } else if (input.status === 'unassigned') {
      message_dilog = 'Do you want to unassign the transport ?';
    }
    setCurrent(input);
    setDialogMessage(message_dilog);
    setIsDeleteDialog(!isDeleteDialog);
  };

  const onSubmit = async (val) => {
    const data = {
      ...val,
      trip_id: current.trip_id,
      leg_id: current.leg_id,
      created_on: new Date().toISOString(),
    };
    const res = await calladdFeedback(data);
    if (res) {
      feedbackToggle();
      callAllTransportApi();
      callCapabilityRolesApi();
      const data = {
        leg_id: current.leg_id,
      };
      callGetFeedback(data);
    }
  };

  const feedbackToggle = () => {
    setIsFeedbackDialog(!isFeedbackDialog);
  };

  const feedbackDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        isOpen={isFeedbackDialog}
        fullWidth={true}
        maxWidth={'sm'}
        sxAppBar={{ justifyContent: 'center', alignItems: 'center' }}
        sxTitle={{ fontSize: 24 }}
        closeIcon={false}
        title={'Add Feedback'}
        handleClose={() => {
          feedbackToggle();
        }}
      >
        <Form
          onSubmit={onSubmit}
          keepDirtyOnReinitialize
          mutators={{
            ...arrayMutators,
          }}
          decorators={[focusOnErrors]}
          initialValues={{
            feedback: '',
          }}
          validate={(values) => {
            const errors = {};
            if (isBlank(values.feedback)) {
              errors.feedback = 'Feedback is required';
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
                  name="feedback"
                  id="add_capability_name"
                  placeholder="Add Feedback"
                  required
                  multiline
                  rows={4}
                />
                {strictValidString(touched.feedback && errors.feedback) && (
                  <FormHelperText
                    className={classes.helperText}
                    id="component-helper-text"
                  >
                    {touched.feedback && errors.feedback}
                  </FormHelperText>
                )}
                <Grid
                  sx={{
                    justifyContent: 'center',
                    display: 'flex',
                    mt: 2,
                  }}
                >
                  <LoadingButton
                    disabled={pristine || submitting || !valid}
                    onClick={handleSubmit}
                    className={classes.buttonForceAction}
                    type="submit"
                    id="add_capability_btn_submit"
                    size="medium"
                    variant="contained"
                    loading={isLoadErr}
                    sx={{ mr: 2 }}
                  >
                    Submit
                  </LoadingButton>
                  <Button
                    className={classes.buttonForceAction}
                    color="error"
                    variant="outlined"
                    onClick={() => feedbackToggle()}
                  >
                    Cancel
                  </Button>
                </Grid>
              </form>
            );
          }}
        />
      </Dialog>
    );
  };
  const infoDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        isOpen={isInfoDialog}
        fullWidth={true}
        maxWidth={'xl'}
        sxAppBar={{ justifyContent: 'center' }}
        sxTitle={{ fontSize: 24, textAlign: 'center' }}
        closeIcon={true}
        title={`Trip ${current?.base_trip?.leg_id}`}
        handleClose={() => {
          infoToggle();
        }}
      >
        <DialogContent sx={{ overflow: 'auto', height: '800px' }}>
          <InfoTransportDetails data={current} />
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: 'center', display: 'flex', mt: 2 }}
        >
          <Button
            variant="contained"
            onClick={() => feedbackToggle()}
            color="primary"
            sx={{ mr: 2 }}
            className={classes.buttonForceAction}
          >
            Add Feedback
          </Button>
          <Button
            className={classes.buttonForceAction}
            color="error"
            variant="outlined"
            onClick={() => infoToggle()}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const CostCenterStr = ({ item }) => {
    return (
      <Typography>
        {size(item) > 17 ? (
          <MDTooltip title={item}>
            <Typography id="label-unq-id1">
              {truncate(item, {
                length: 17,
                omission: '...',
              })}
            </Typography>
          </MDTooltip>
        ) : (
          item
        )}
      </Typography>
    );
  };

  return (
    <>
      <Grid>
        <ReactTable
          setClearFilters={() => setClearFilters(false)}
          clearFilters={clearFilters}
          loading={!refreshing && isLoad}
          tableSize={tableSize}
          isLoadInner={isLoadInner}
          customText={'You do not have any configured Transport'}
          getCellProperties={(cellInfo) => ({
            style: {
              backgroundColor:
                strictValidObjectWithKeys(cellInfo.row.original.base_trip) &&
                cellInfo.row.original.base_trip.type !== 'will_call' &&
                cellInfo.row.original.base_trip.is_parent === 1 &&
                cellInfo.row.original.base_trip.status !== 'on_hold' &&
                new Date(cellInfo.row.original.base_trip.pick_up_date_time) <
                  getPhoenixDateTime()
                  ? '#ffe6e6'
                  : strictValidObjectWithKeys(
                      cellInfo.row.original.base_trip,
                    ) &&
                    cellInfo.row.original.base_trip.status !== 'on_hold' &&
                    cellInfo.row.original.base_trip.type === 'will_call' &&
                    formatDateTime(
                      cellInfo.row.original.base_trip.estimated_end_time,
                    ) === 'N/A' &&
                    cellInfo.row.original.base_trip.is_parent === 1 &&
                    moment(
                      cellInfo.row.original.base_trip.pick_up_date_time,
                    ).format('MM/DD/YY') !==
                      moment(getPhoenixDateTime()).format('MM/DD/YY') &&
                    Date.parse(
                      moment(cellInfo.row.original.base_trip.pick_up_date_time),
                    ) <= getPhoenixDateTime()
                  ? '#ffe6e6'
                  : strictValidObjectWithKeys(
                      cellInfo.row.original.base_trip,
                    ) &&
                    cellInfo.row.original.base_trip.type !== 'will_call' &&
                    cellInfo.row.original.base_trip.is_parent === 0 &&
                    formatDateTime(
                      cellInfo.row.original.base_trip.estimated_end_time,
                    ) !== 'N/A' &&
                    cellInfo.row.original.base_trip.status !== 'on_hold' &&
                    new Date(
                      cellInfo.row.original.base_trip.pick_up_date_time,
                    ) < getPhoenixDateTime()
                  ? '#ffe6e6'
                  : strictValidObjectWithKeys(
                      cellInfo.row.original.base_trip,
                    ) &&
                    cellInfo.row.original.base_trip.status !== 'on_hold' &&
                    cellInfo.row.original.base_trip.type !== 'will_call' &&
                    cellInfo.row.original.base_trip.parent_type ===
                      'will_call' &&
                    formatDateTime(
                      cellInfo.row.original.base_trip.estimated_end_time,
                    ) === 'N/A' &&
                    moment(
                      cellInfo.row.original.base_trip.pick_up_date_time,
                    ).format('MM/DD/YY') !==
                      moment(getPhoenixDateTime()).format('MM/DD/YY') &&
                    Date.parse(
                      moment(cellInfo.row.original.base_trip.pick_up_date_time),
                    ) <= getPhoenixDateTime()
                  ? '#ffe6e6'
                  : null,
            },
          })}
          columnDefs={[
            {
              Header: 'PU Time',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  strictValidObjectWithKeys(originalRow.base_trip) &&
                  formatDateTime(originalRow.base_trip.pick_up_date_time)
                );
              },
              Filter: DateFilter,
              width: 115,
              Cell: (props) => (
                <>
                  <Typography>
                    {formatDateTime(
                      props.row.original.base_trip.estimated_end_time,
                    ) === 'N/A'
                      ? formatDate(
                          props.row.original.base_trip.pick_up_date_time,
                        )
                      : formatDateTime(
                          props.row.original.base_trip.pick_up_date_time,
                        )}
                  </Typography>
                </>
              ),
            },
            {
              Header: 'Leg ID',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  strictValidObjectWithKeys(originalRow.base_trip) &&
                  originalRow.base_trip.leg_id
                );
              },
              width: 100,
              disableSortBy: true,
              Cell: (props) => (
                <>
                  <Typography>{props.row.original.base_trip.leg_id}</Typography>
                </>
              ),
            },
            {
              Header: 'Status',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  transportStatus(originalRow.status)
                );
              },
              Filter: SelectColumnFilter,
              disableSortBy: true,
              width: 110,
              Cell: (props) => (
                <>
                  <Typography>
                    {transportStatus(props.row.original.status)}
                  </Typography>
                </>
              ),
            },
            {
              Header: 'ETA DO',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  strictValidObjectWithKeys(originalRow.base_trip) &&
                  formatDateTime(originalRow.base_trip.estimated_end_time)
                );
              },
              Filter: DateFilter,
              width: 115,
              disableSortBy: true,
              Cell: (props) => (
                <>
                  <Typography>
                    {formatDateTime(
                      props.row.original.base_trip.estimated_end_time,
                    )}
                  </Typography>
                </>
              ),
            },
            {
              Header: 'PU Location',
              disableSortBy: true,
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  strictValidObjectWithKeys(originalRow.base_trip) &&
                  originalRow.base_trip.trip_pickup_location
                );
              },
              width: 140,
              Cell: (props) => (
                <>
                  <MDTooltip
                    title={props.row.original.base_trip.trip_pickup_location}
                  >
                    <Typography height={55}>
                      {limitWords(
                        props.row.original.base_trip.trip_pickup_location,
                        20,
                      )}
                    </Typography>
                  </MDTooltip>
                </>
              ),
            },
            {
              Header: 'DO Location',
              width: 140,
              disableSortBy: true,
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  strictValidObjectWithKeys(originalRow.base_trip) &&
                  originalRow.base_trip.trip_dropoff_location
                );
              },
              Cell: (props) => (
                <>
                  <MDTooltip
                    title={props.row.original.base_trip.trip_dropoff_location}
                  >
                    <Typography height={55}>
                      {limitWords(
                        props.row.original.base_trip.trip_dropoff_location,
                        20,
                      )}
                    </Typography>
                  </MDTooltip>
                </>
              ),
            },
            {
              Header: 'Transport Mode',
              accessor: 'capability_id',
              disableSortBy: true,
              width: 150,
              Filter: CapabilityFilters,
              Cell: (props) => (
                <>
                  <CellTypes
                    type="capability_role"
                    value={props.row.original.capability_id}
                  />
                </>
              ),
            },
            {
              Header: 'Clarifications',
              accessor: 'capability_clarification',
              width: 100,
              disableSortBy: true,
              Cell: (props) => (
                <>
                  <MDTooltip
                    title={props.row.original.capability_clarification}
                  >
                    <Typography height={55}>
                      {strictValidString(
                        props.row.original.capability_clarification,
                      )
                        ? props.row.original.capability_clarification
                        : 'N/A'}
                    </Typography>
                  </MDTooltip>
                </>
              ),
            },
            {
              Header: 'LBS',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  strictValidObjectWithKeys(originalRow.base_patient) &&
                  strictValidString(originalRow.base_patient.weight_in) &&
                  convertToPoundsWithoutdecimals(
                    originalRow.base_patient.weight,
                    originalRow.base_patient.weight_in,
                  )
                );
              },
              width: 80,
              disableSortBy: true,
              isVisible: true,
              Cell: (props) => (
                <>
                  <Typography height={55}>
                    {strictValidObjectWithKeys(
                      props.row.original.base_patient,
                    ) &&
                      strictValidString(
                        props.row.original.base_patient.weight_in,
                      ) &&
                      convertToPoundsWithoutdecimals(
                        props.row.original.base_patient.weight,
                        props.row.original.base_patient.weight_in,
                      )}
                  </Typography>
                </>
              ),
            },
            {
              Header: 'Stairs PU/DO',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  `${originalRow.base_trip.pick_up_stairs}/${originalRow.base_trip.drop_off_stairs}`
                );
              },
              width: 110,
              disableSortBy: true,
              isVisible: true,
              Cell: (props) => (
                <>
                  <Box display="flex" flexDirection="row">
                    <Typography
                      style={{
                        fontSize: 15,
                        fontWeight:
                          props.row.original.base_trip.pick_up_stairs !== 0
                            ? 'bold'
                            : 'inherit',
                      }}
                    >
                      {props.row.original.base_trip.pick_up_stairs}/
                    </Typography>
                    <Typography
                      style={{
                        fontSize: 15,
                        fontWeight:
                          props.row.original.base_trip.drop_off_stairs !== 0
                            ? 'bold'
                            : 'inherit',
                      }}
                    >
                      {props.row.original.base_trip.drop_off_stairs}
                    </Typography>
                  </Box>
                </>
              ),
            },
            {
              Header: 'Special Instructions',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  strictValidObjectWithKeys(originalRow.base_patient) &&
                  originalRow.base_patient.description
                );
              },
              disableSortBy: true,
              width: 160,
              Cell: (props) => (
                <>
                  <MDTooltip
                    title={props.row.original.base_patient.description}
                  >
                    <Typography height={55}>
                      {strictValidObjectWithKeys(
                        props.row.original.base_patient,
                      ) &&
                      strictValidString(
                        props.row.original.base_patient.description,
                      )
                        ? `${props.row.original.base_patient.description}`
                        : 'N/A'}
                    </Typography>
                  </MDTooltip>
                </>
              ),
            },
            {
              Header: 'Patient',
              disableSortBy: true,
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  strictValidObjectWithKeys(originalRow.base_patient) &&
                  originalRow.base_patient.last_name +
                    ', ' +
                    originalRow.base_patient.first_name
                );
              },
              width: 120,
              Cell: (props) => (
                <>
                  <CostCenterStr
                    item={
                      props.row.original.base_patient.last_name +
                      ', ' +
                      props.row.original.base_patient.first_name
                    }
                  />
                  {/* <Typography>
                    {props.row.original.base_patient.last_name +
                      ', ' +
                      props.row.original.base_patient.first_name}
                  </Typography> */}
                </>
              ),
            },
            {
              Header: 'Account',
              disableSortBy: true,
              accessor: (originalRow, rowIndex) => {
                return strictValidObjectWithKeys(originalRow) &&
                  validObjectWithParameterKeys(originalRow.base_trip, [
                    'cost_center_name',
                  ])
                  ? strictValidObjectWithKeys(originalRow.corporate_account) &&
                      `${originalRow.corporate_account.name} - ${originalRow.base_trip.cost_center_name}`
                  : strictValidObjectWithKeys(originalRow.corporate_account) &&
                      originalRow.corporate_account.name;
              },
              Filter: SelectColumnFilter,
              width: 160,
              Cell: (props) => {
                const accountName = validObjectWithParameterKeys(
                  props.row.original.base_trip,
                  ['cost_center_name'],
                )
                  ? `${props.row.original.corporate_account.name} - ${props.row.original.base_trip.cost_center_name}`
                  : props.row.original.corporate_account.name;
                return (
                  <>
                    <MDTooltip title={accountName}>
                      <Typography height={55}>{accountName}</Typography>
                    </MDTooltip>
                  </>
                );
              },
            },
            {
              Header: 'Unit',
              disableSortBy: true,
              width: 170,
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  strictValidObjectWithKeys(originalRow.base_vehicle) &&
                  strictValidObjectWithKeys(originalRow.base_unit) &&
                  `${originalRow.base_vehicle.vehicle_code} / ${originalRow.base_unit.driver_name} / ${originalRow.base_unit.attendant_name}`
                );
              },
              Cell: (props) => (
                <MDTooltip
                  title={
                    strictValidString(
                      props.row.original.base_vehicle.vehicle_code,
                    ) &&
                    `${props.row.original.base_vehicle.vehicle_code} / ${props.row.original.base_unit.driver_name} / ${props.row.original.base_unit.attendant_name}`
                  }
                >
                  <Typography
                    height={55}
                    sx={{
                      textTransform: 'capitalize',
                    }}
                  >
                    {strictValidObjectWithKeys(
                      props.row.original.base_vehicle,
                    ) &&
                      strictValidObjectWithKeys(props.row.original.base_unit) &&
                      limitWords(
                        `${props.row.original.base_vehicle.vehicle_code} / ${props.row.original.base_unit.driver_name} / ${props.row.original.base_unit.attendant_name}`,
                        40,
                      )}
                  </Typography>
                </MDTooltip>
              ),
            },
            // {
            //   Header: 'Account Contact',
            //   disableSortBy: true,
            //   accessor: (originalRow, rowIndex) => {
            //     let output = [];
            //     _.map(originalRow.company_contact, (res) => {
            //       output.push(`${res.last_name}, ${res.first_name}`);
            //     });
            //     return output.join(', ');
            //   },
            //   id: 'name',
            //   width: 160,
            //   Cell: (props) => (
            //     <>
            //       <CellMapTypes
            //         type="company_contact"
            //         renderValue="first_name"
            //         data={props.row.original.company_contact}
            //       />
            //     </>
            //   ),
            // },
            {
              Header: 'Actions',
              disableSortBy: true,
              accessor: '',
              Filter: false,
              width: 140,
              Cell: (props) => (
                <Stack direction="row" spacing={2}>
                  {props.row.original.status === 'requested' ? (
                    <Tooltip
                      title={
                        props.row.original.base_trip.pick_up_date_time ===
                        'Invalid date'
                          ? 'Pick-up Time not yet defined'
                          : 'Plan Transport'
                      }
                    >
                      <span>
                        <IconButton
                          color="primary"
                          size="medium"
                          disabled={
                            props.row.original.base_trip.pick_up_date_time ===
                              'Invalid date' ||
                            props.row.original.base_trip.type === 'on_hold' ||
                            props.row.original.base_trip.type === 'will_call'
                          }
                          onClick={() => {
                            setDisable(false);
                            setTripId(props.row.original.trip_id);
                            setValue('3');
                            setTransportId(props.row.original.id);
                          }}
                        >
                          <ScheduleSendIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title={
                        props.row.original.base_unit.status !== 'active'
                          ? 'The unit associated with the trip is not active yet !'
                          : 'Dispatch'
                      }
                    >
                      <span>
                        <IconButton
                          color="primary"
                          disabled={
                            props.row.original.base_unit.status !== 'active' ||
                            props.row.original.status !== 'planned' ||
                            props.row.original.base_trip.pick_up_date_time ===
                              'Invalid date' ||
                            props.row.original.base_trip.type === 'on_hold'
                          }
                          size="small"
                          onClick={() => {
                            setDisable(false);
                            transportAction({
                              filed: props.row.original,
                              status: 'dispatch_requested',
                            });
                            setStatus('dispatch_requested');
                          }}
                        >
                          <LocalShippingIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  )}
                  {props.row.original.status !== 'requested' && (
                    <>
                      <Tooltip title="Unassign">
                        <IconButton
                          color="error"
                          disabled={
                            props.row.original.status === 'patient_loaded' ||
                            props.row.original.status ===
                              'arrived_at_drop_off' ||
                            props.row.original.base_trip.is_parent === 0
                          }
                          size="small"
                          onClick={() => {
                            transportAction({
                              filed: props.row.original,
                              status: 'unassigned',
                            });
                            setMessageStatus('unassigned');
                            setDisable(false);
                            setStatus('unassigned');
                          }}
                        >
                          {props.row.original.status === 'patient_loaded' ||
                          props.row.original.status ===
                            'arrived_at_drop_off' ? (
                            <UndoIcon color="disabled" />
                          ) : (
                            <UndoIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  {props.row.original.status === 'requested' && (
                    <Tooltip title="Unassign">
                      <IconButton
                        sx={{ height: 28, width: 28 }}
                        color="error"
                        disabled={props.row.original.status === 'requested'}
                        size="small"
                      >
                        {/* <UndoIcon color="disabled" /> */}
                      </IconButton>
                    </Tooltip>
                  )}
                  <PopupState variant="popover" popupId="demo-popup-menu">
                    {(popupState) => (
                      <React.Fragment>
                        <Tooltip title="Action">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => {
                              // moreOptionToggle();
                              // setCurrentData(props.row.original);
                            }}
                            {...bindTrigger(popupState)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                        <Menu {...bindMenu(popupState)}>
                          <MenuItem
                            onClick={() => {
                              const field = props.row.original;
                              infoToggle();
                              setCurrent(field);
                              const data = {
                                leg_id: field.leg_id,
                              };
                              callGetFeedback(data);
                            }}
                          >
                            <ListItemIcon>
                              <InfoOutlinedIcon
                                color={
                                  props.row.original.feedback
                                    ? 'error'
                                    : '#1C2A39'
                                }
                                fontSize="small"
                              />
                            </ListItemIcon>
                            <ListItemText>Info</ListItemText>
                          </MenuItem>
                          <MenuItem
                            disabled={
                              props.row.original.status === 'requested' ||
                              props.row.original.status === 'planned'
                            }
                            onClick={() => {
                              setDisable(false);
                              transportAction({
                                filed: props.row.original,
                                status: 'force',
                              });
                            }}
                          >
                            <ListItemIcon>
                              <ChangeCircleOutlinedIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Change Status</ListItemText>
                          </MenuItem>
                        </Menu>
                      </React.Fragment>
                    )}
                  </PopupState>
                </Stack>
              ),
            },
          ]}
          rowData={Array.isArray(transport) ? transport : []}
        />
      </Grid>
      {deleteDialog()}
      {deleteChildTrips()}
      {infoDialog()}
      {feedbackDialog()}
    </>
  );
};

List.propTypes = {
  callAllTransportApi: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

List.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.transport.transport.message,
    isLoad: state.transport.transport.isLoad,
    loadErr: state.transport.transport.loadErr,
    transport: state.transport.transport.data,
    userprofile: state.auth.user,
    isLoadInner: state.transport.transport.isLoadInner,
    isLoadErr: state.trip.addFeedback.isLoad,
    feedbackMess: state.trip.addFeedback.message,
    userFeedback: state.trip.getFeedback.get_feedback,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callAllTransportApi: (...params) => dispatch(getTransportAccount(...params)),
  callCapabilityRolesApi: (...params) =>
    dispatch(getActiveCapabilityRoles(...params)),
  calladdFeedback: (...params) => dispatch(submitFeedback(...params)),
  callFlushMessage: (...params) => dispatch(flushMessage(...params)),
  callGetFeedback: (...params) => dispatch(getUserFeedback(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(List);

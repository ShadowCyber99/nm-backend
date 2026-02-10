/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import {
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
import {
  formatDateTime,
  limitWords,
  strictValidArrayWithLength,
  strictValidArrayWithKey,
  strictValidObjectWithKeys,
  strictValidString,
  isBlank,
  validObjectWithParameterKeys,
  strictValidNumber,
  formatDate,
} from '../../../utils/common-utils';
import ReactTable from '../../../components/react-table';
import {
  getFilters,
  getFinishedTransportAccount,
  saveFilters,
} from '../action';
import {
  DateFilter,
  CapabilityFilters,
  SelectColumnFilter,
} from '../../../components/react-table/helper';
import {
  transportStatus,
  TransportStatusPreDefined,
} from '../../../utils/constant';
import CellTypes from '../../../components/react-table/components/renderTypes';
import { getMyProfile } from '../../welcome/action';
import MDTooltip from '../../../components/tooltip';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Dialog from '../../../components/dialog';
import { Box } from '@mui/system';
import { makeStyles } from '@mui/styles';
import moment from 'moment';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import InfoTransportDetails from '../info-dialog';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import store from 'store2';
import { SocketContext } from '../../../hooks/useSocketContext';
import { Field, Form } from 'react-final-form';
import FinalFormText from '../../../components/final-form/input-text';
import arrayMutators from 'final-form-arrays';
import { LoadingButton } from '@mui/lab';
import {
  flushMessage,
  getReasons,
  getUserFeedback,
  submitFeedback,
} from '../../trip-management/action';
import createDecorator from 'final-form-focus';
import { useSnackbar } from 'notistack';
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
  helperText: {
    margin: `${theme.spacing(0.2, 0, 0, 0)} !important`,
    color: theme.palette.error.main,
    backgroundColor: '#fff',
  },
}));
const FinishedTransport = ({
  setValue,
  isLoad,
  isLoadInner,
  message,
  setData,
  callFinishedTransportApi,
  callGetMyProfileApi,
  callDeleteTrip,
  userprofile,
  transport,
  total_ftransport,
  calladdFeedback,
  callFlushMessage,
  callGetFeedback,
  isLoadErr,
  callGetReason,
  feedbackMess,
  userFeedback,
  callSaveFilters,
  callGetFilters,
}) => {
  const [current, setCurrent] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [isInfoDialog, setIsInfoDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [status, setStatus] = React.useState('');
  const [clearFilters, setClearFilters] = useState(false);
  const [tableSize, setTableSize] = useState(false);
  const socket = useContext(SocketContext);
  const [isFeedbackDialog, setIsFeedbackDialog] = useState(false);
  const [total, changeTotal] = useState(0);
  const [pagination, changePagination] = useState({
    total: total,
    recordsPerPage: null,
    pageIndex: 0,
    currentPage: 1,
  });
  const [search, setSearch] = useState('');
  const [date, setDates] = useState({
    start_date: '',
    end_date: '',
  });
  const classes = useStyles();
  useEffect(() => {
    // callFinishedTransportApi();
    callGetMyProfileApi();
  }, []);

  useEffect(() => {
    socket.on('transport_status', (callback) => {
      if (
        strictValidObjectWithKeys(userprofile) &&
        strictValidArrayWithKey([5, 3, 2, 1, 6, 8], userprofile.role_id)
      ) {
        callGetFilters();
        setClearFilters(true);
        setTableSize(true);
      }
    });
    return () => {
      socket.off('transport_status');
    };
  }, [pagination.recordsPerPage, pagination.pageIndex, search]);

  useEffect(() => {
    if (strictValidArrayWithLength(transport)) {
      changeTotal(total_ftransport);
    }
  }, [transport, total_ftransport]);

  useEffect(() => {
    const data = {
      ...date,
      limit: pagination.recordsPerPage,
      skip: pagination.pageIndex * pagination.recordsPerPage,
      search: search,
    };
    callSaveFilters(data);
    callGetFilters();
  }, [date, pagination, search]);

  const deleteToggle = () => {
    setIsDeleteDialog(!isDeleteDialog);
    setStatus('');
  };

  const setRecordsPerPage = (size) => {
    changePagination({
      ...pagination,
      recordsPerPage: size,
    });
    callFinishedTransportApi({
      ...date,
      limit: size,
      skip: pagination.pageIndex * size,
      search: search,
    });
  };

  const changePageSize = (pageSize) => {
    changePagination({
      ...pagination,
      recordsPerPage: pageSize,
      pageIndex: 0,
    });
    callFinishedTransportApi({
      ...date,
      limit: pageSize,
      skip: 0,
      search: search,
    });
  };

  const changePageIndex = (pageIndex) => {
    changePagination({
      ...pagination,
      pageIndex: pageIndex,
    });
    callFinishedTransportApi({
      ...date,
      limit: pagination.recordsPerPage,
      skip: pageIndex * pagination.recordsPerPage,
      search: search,
    });
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

  const infoToggle = () => {
    setIsInfoDialog(!isInfoDialog);
  };

  const handleChange = (event) => {
    setStatus(event.target.value);
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

  const onSubmit = async (val) => {
    const data = {
      ...val,
      trip_id: current.trip_id,
      leg_id: current.base_trip.leg_id,
      created_on: new Date().toISOString(),
    };
    const res = await calladdFeedback(data);
    if (res) {
      feedbackToggle();
      callFinishedTransportApi({
        ...date,
        search: search,
        limit: pagination.recordsPerPage,
        skip: pagination.pageIndex * pagination.recordsPerPage,
      });
      changePagination({
        ...pagination,
        recordsPerPage: pagination.recordsPerPage,
        pageIndex: pagination.pageIndex,
      });
      const data = {
        leg_id: current.base_trip.leg_id,
      };
      callGetFeedback(data);
      callGetReason(data);
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
            color="error"
            variant="outlined"
            onClick={() => deleteToggle()}
          >
            Cancel
          </Button>
          <Button
            disabled={current.status === 'force' ? !status : false}
            color="primary"
            variant="outlined"
            onClick={() => {
              changeTransportStatus(current);
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
    if (input.status === 'force') {
      message_dilog = 'Do you want to force the transport status ?';
    }
    setCurrent(input);
    setDialogMessage(message_dilog);
    setIsDeleteDialog(!isDeleteDialog);
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
  const searchQueryFilter = (e) => {
    callFinishedTransportApi({
      ...date,
      limit: pagination.recordsPerPage,
      skip: 0,
      search: e,
    });
    changePagination({
      ...pagination,
      recordsPerPage: pagination.recordsPerPage,
      pageIndex: 0,
    });
    setSearch(e);
  };
  const clearQueryFilter = (text) => {
    callFinishedTransportApi({
      ...date,
      limit: pagination.recordsPerPage,
      skip: 0,
      search: text,
    });
    changePagination({
      ...pagination,
      recordsPerPage: pagination.recordsPerPage,
      pageIndex: 0,
    });
    setSearch(text);
  };
  function toHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return { hours, minutes };
  }

  return (
    <>
      <Grid>
        <ReactTable
          tableSize={tableSize}
          setClearFilters={() => setClearFilters(false)}
          clearFilters={clearFilters}
          serverSidePagination={true}
          headerFilter={false}
          DateFilterCss={true}
          isDateFilter
          filterButton={false}
          // showExport
          onFilter={(dates) => {
            callFinishedTransportApi({
              ...dates,
              limit: pagination.recordsPerPage,
              skip: 0,
              search: search,
            });
            changePagination({
              ...pagination,
              recordsPerPage: pagination.recordsPerPage,
              pageIndex: 0,
            });
            setDates(dates);
          }}
          onClearFilter={() => {
            callFinishedTransportApi({
              limit: pagination.recordsPerPage,
              skip: 0,
              search: search,
            });
            changePagination({
              ...pagination,
              recordsPerPage: pagination.recordsPerPage,
              pageIndex: 0,
            });
            setDates({
              start_date: null,
              end_date: null,
            });
          }}
          clearFilterButton={() => {
            clearQueryFilter('');
          }}
          serverSideFilter={(e) => searchQueryFilter(e)}
          recordsPerPage={pagination.recordsPerPage}
          setRecordsPerPage={setRecordsPerPage}
          pageNumber={pagination.pageIndex}
          total={total}
          rowData={Array.isArray(transport) ? transport : []}
          changePageSize={changePageSize}
          changePageIndex={changePageIndex}
          loading={isLoad}
          isLoadInner={isLoadInner}
          customText={'You do not have any Finished Transport'}
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
              width: 130,
              Cell: (props) => (
                <>
                  <Typography>
                    {/* {formatDateTime(
                      props.row.original.base_trip.pick_up_date_time,
                    )} */}
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
              width: 115,
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
              width: 120,
              disableSortBy: true,
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
              width: 130,
              disableSortBy: true,
              Cell: (props) => (
                <>
                  <Typography>
                    {props.row.original.base_trip.type === 'on_hold' &&
                    props.row.original.base_trip.status === 'cancelled'
                      ? 'N/A'
                      : formatDateTime(
                          props.row.original.base_trip.estimated_end_time,
                        )}
                    {/* {formatDateTime(
                      props.row.original.base_trip.estimated_end_time,
                    )} */}
                  </Typography>
                </>
              ),
            },
            {
              Header: 'On Hold Time',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  strictValidNumber(originalRow.waiting_time)
                );
              },
              Filter: DateFilter,
              width: 120,
              disableSortBy: true,
              Cell: (props) => {
                const res = () => {
                  let data = toHoursAndMinutes(props.row.original.waiting_time);
                  return `${data.hours + 'h' + data.minutes}`;
                };
                return (
                  <>
                    <Typography>
                      {strictValidObjectWithKeys(props.row.original) &&
                      strictValidNumber(props.row.original.waiting_time) &&
                      props.row.original.waiting_time <= 59
                        ? res() + 'm'
                        : res() + 'm'}
                    </Typography>
                  </>
                );
              },
            },
            {
              Header: 'PU Location',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  strictValidObjectWithKeys(originalRow.base_trip) &&
                  originalRow.base_trip.trip_pickup_location
                );
              },
              disableSortBy: true,
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
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  strictValidObjectWithKeys(originalRow.base_trip) &&
                  originalRow.base_trip.trip_dropoff_location
                );
              },
              disableSortBy: true,
              Cell: (props) => (
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
              ),
            },

            {
              Header: 'Transport Mode',
              accessor: 'capability_id',
              width: 170,
              disableSortBy: true,
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
              width: 130,
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
              Header: 'Special Instructions',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  strictValidObjectWithKeys(originalRow.base_patient) &&
                  originalRow.base_patient.description
                );
              },
              disableSortBy: true,
              width: 180,
              Cell: (props) => (
                <MDTooltip title={props.row.original.base_patient.description}>
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
              ),
            },
            {
              Header: 'Patient',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  strictValidObjectWithKeys(originalRow.base_patient) &&
                  originalRow.base_patient.last_name +
                    ', ' +
                    originalRow.base_patient.first_name
                );
              },
              width: 140,
              disableSortBy: true,
              Cell: (props) => (
                <>
                  <Typography>
                    {props.row.original.base_patient.last_name +
                      ', ' +
                      props.row.original.base_patient.first_name}
                  </Typography>
                </>
              ),
            },
            {
              Header: 'Account',
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
              disableSortBy: true,
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
              width: 220,
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  strictValidObjectWithKeys(originalRow.base_vehicle) &&
                  strictValidObjectWithKeys(originalRow.base_unit) &&
                  `${originalRow.base_vehicle.vehicle_code} / ${originalRow.base_unit.driver_name} / ${originalRow.base_unit.attendant_name}`
                );
              },
              Cell: (props) => (
                <>
                  <MDTooltip
                    title={`${props.row.original.base_vehicle.vehicle_code} / ${props.row.original.base_unit.driver_name} / ${props.row.original.base_unit.attendant_name}`}
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
                        strictValidObjectWithKeys(
                          props.row.original.base_unit,
                        ) &&
                        limitWords(
                          `${props.row.original.base_vehicle.vehicle_code} / ${props.row.original.base_unit.driver_name} / ${props.row.original.base_unit.attendant_name}`,
                          40,
                        )}
                    </Typography>
                  </MDTooltip>
                </>
              ),
            },
            {
              Header: 'Actions',
              disableSortBy: true,
              accessor: '',
              Filter: false,
              width: 70,
              Cell: (props) => (
                <Stack direction="row" spacing={2}>
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
                              setCurrent({ ...field, finished: true });
                              const data = {
                                leg_id: field.base_trip.leg_id,
                              };
                              callGetFeedback(data);
                              callGetReason(data);
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
                              props.row.original.status === 'aborted' ||
                              props.row.original.status === 'completed' ||
                              props.row.original.status === 'rejected' ||
                              props.row.original.status === 'unassigned' ||
                              props.row.original.status === 'cancelled' ||
                              props.row.original.base_trip.invoice_status !==
                                'none' ||
                              props.row.original.base_trip.invoice_status ===
                                'sent' ||
                              props.row.original.base_trip.invoice_status ===
                                'fully_paid' ||
                              props.row.original.base_trip.invoice_status ===
                                'part_paid' ||
                              props.row.original.base_trip.invoice_status ===
                                'refunded' ||
                              props.row.original.base_trip.invoice_status ===
                                'uninvoiced' ||
                              props.row.original.base_trip.invoice_status ===
                                'disputed' ||
                              props.row.original.base_trip.invoice_status ===
                                'cancelled' ||
                              props.row.original.base_trip.status ===
                                'cancelled_no_billable' ||
                              props.row.original.base_trip.invoice_status ===
                                'locked'
                            }
                            onClick={() =>
                              transportAction({
                                filed: props.row.original,
                                status: 'force',
                              })
                            }
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
        />
      </Grid>
      {deleteDialog()}
      {infoDialog()}
      {feedbackDialog()}
    </>
  );
};

FinishedTransport.propTypes = {
  callFinishedTransportApi: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

FinishedTransport.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.transport.ftransport.message,
    isLoad: state.transport.ftransport.isLoad,
    loadErr: state.transport.ftransport.loadErr,
    transport: state.transport.ftransport.data,
    userprofile: state.profile.userprofile,
    isLoadInner: state.transport.ftransport.isLoadInner,
    total_ftransport: state.transport.ftransport.total_ftransport,
    isLoadErr: state.trip.addFeedback.isLoad,
    feedbackMess: state.trip.addFeedback.message,
    userFeedback: state.trip.getFeedback.get_feedback,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callFinishedTransportApi: (...params) =>
    dispatch(getFinishedTransportAccount(...params)),
  callGetMyProfileApi: (...params) => dispatch(getMyProfile(...params)),
  calladdFeedback: (...params) => dispatch(submitFeedback(...params)),
  callFlushMessage: (...params) => dispatch(flushMessage(...params)),
  callGetFeedback: (...params) => dispatch(getUserFeedback(...params)),
  callGetReason: (...params) => dispatch(getReasons(...params)),
  callSaveFilters: (...params) => dispatch(saveFilters(...params)),
  callGetFilters: (...params) => dispatch(getFilters(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(FinishedTransport);

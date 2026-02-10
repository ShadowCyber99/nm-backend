/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  formatDate,
  formatDateTime,
  isBlank,
  limitWords,
  strictValidArrayWithKey,
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
  validObjectWithParameterKeys,
} from '../../../utils/common-utils';
import ReactTable from '../../../components/react-table';
import {
  flushLogs,
  flushMessage,
  getCompletedTrip,
  getCompletedTripByFilter,
  getFiltersCompleted,
  getReasons,
  getUserFeedback,
  saveFilterCompleted,
  submitFeedback,
  tripIegId,
} from '../action';
import {
  DateFilter,
  CapabilityFilters,
  SelectColumnFilter,
} from '../../../components/react-table/helper';
import CellTypes from '../../../components/react-table/components/renderTypes';
import MDTooltip from '../../../components/tooltip';
import { transportStatus } from '../../../utils/constant';
import Dialog from '../../../components/dialog';
import InfoDetails from '../info-dialog';
import { makeStyles } from '@mui/styles';
import EditableButton from '../../../components/react-table/components/editable-button';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import moment from 'moment';
import store from 'store2';
import { buttonRoleAccess } from '../../../utils/traits';
import { SocketContext } from '../../../hooks/useSocketContext';
import { useSnackbar } from 'notistack';
import { tripExportConstants } from '../constants';
import { LoadingButton } from '@mui/lab';
import { Field, Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import createDecorator from 'final-form-focus';
import FinalFormText from '../../../components/final-form/input-text';
import EditTrips from '../edit-trip-dialog';
const focusOnErrors = createDecorator();

const useStyles = makeStyles((theme) => ({
  header: {
    width: 180,
    margin: theme.spacing(0.5, 2),
    fontSize: 16,
  },
  title: {
    margin: theme.spacing(0.5, 2),
    fontSize: 20,
  },
  helperText: {
    margin: `${theme.spacing(0.2, 0, 0, 0)} !important`,
    color: theme.palette.error.main,
    backgroundColor: '#fff',
  },
  subtitle: {
    width: 250,
    margin: theme.spacing(0.5, 2),
    fontSize: 16,
  },
  buttonForceAction: {
    width: 170,
    textTransform: 'capitalize',
  },
}));

const CompletedTrips = ({
  setValue,
  isLoad,
  isLoadInner,
  message,
  setData,
  total_trips,
  callAllTrip,
  callDeleteTrip,
  all_trips,
  callTripIegId,
  userprofile,
  isLoadErr,
  calladdFeedback,
  feedbackMess,
  callFlushMessage,
  callGetFeedback,
  callGetReasonApi,
  callSaveFilter,
  callGetFilter,
  callCompletedTrips,
  callFushLogs,
}) => {
  const [isInfoDialog, setIsInfoDialog] = useState(false);
  const [total, changeTotal] = useState(0);
  const [pagination, changePagination] = useState({
    total: 0,
    recordsPerPage: null,
    pageIndex: 0,
    currentPage: 1,
  });
  const [current, setCurrent] = useState({});
  const [isEditDialog, setisEditDialog] = useState(false);
  const [tripData, setTripData] = useState({});
  const [changeStatus, setChangeStatus] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [warning, setWarning] = useState(false);
  const classes = useStyles();
  const [currentTrip, setCurrentTrip] = useState({});
  const [status, setStatus] = React.useState('');
  const socket = useContext(SocketContext);
  const [search, setSearch] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [isFeedbackDialog, setIsFeedbackDialog] = useState(false);
  const [date, setDates] = useState({
    start_date: '',
    end_date: '',
  });
  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  useEffect(() => {
    callFlushMessage();
  }, []);

  useEffect(() => {
    const data = {
      ...date,
      limit: pagination.recordsPerPage,
      skip: pagination.pageIndex * pagination.recordsPerPage,
      search: search,
    };
    callSaveFilter(data);
    callGetFilter();
  }, [date, pagination, search]);

  useEffect(() => {
    if (pagination.recordsPerPage) {
      callAllTrip({
        ...date,
        limit: pagination.recordsPerPage,
        skip: pagination.pageIndex * pagination.recordsPerPage,
        search: search,
      });
    }
  }, [pagination.recordsPerPage, pagination.pageIndex]);
  const editToggle = () => {
    setisEditDialog(!isEditDialog);
  };

  const editDialog = () => {
    return (
      <Dialog
        fullScreen={true}
        isOpen={isEditDialog}
        fullWidth={true}
        maxWidth={'xl'}
        sxAppBar={{ justifyContent: 'center' }}
        sxTitle={{ fontSize: 24, textAlign: 'center' }}
        closeIcon={true}
        title={
          strictValidObjectWithKeys(currentTrip)
            ? `Edit Trip ${currentTrip?.leg_id}`
            : 'Loading...'
        }
        handleClose={() => {
          editToggle();
        }}
      >
        <DialogContent>
          {strictValidObjectWithKeys(currentTrip) ? (
            <EditTrips
              setValue={() => {
                editToggle();
                setCurrentTrip({});
                callAllTrip({
                  ...date,
                  limit: pagination.recordsPerPage,
                  skip: pagination.pageIndex * pagination.recordsPerPage,
                  search: search,
                });
              }}
              current_tripData={currentTrip}
            />
          ) : (
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
          )}
        </DialogContent>
      </Dialog>
    );
  };

  useEffect(() => {
    socket.on('trip_status', (callback) => {
      if (
        strictValidObjectWithKeys(userprofile) &&
        strictValidArrayWithKey([5, 4, 2, 8, 7], userprofile.role_id)
      ) {
        setRefreshing(true);
        callCompletedTrips();
      }
    });
    return () => {
      socket.off('trip_status');
    };
  }, [pagination.recordsPerPage, pagination.pageIndex, search]);

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

  const changePageSize = (pageSize) => {
    // callAllTrip({ limit: pageSize, skip: 0 });
    changePagination((prevState) => ({
      ...prevState,
      recordsPerPage: pageSize,
      pageIndex: 0,
    }));
    callAllTrip({
      ...date,
      limit: pageSize,
      skip: 0,
      search: search,
    });
  };

  const setRecordsPerPage = (size) => {
    changePagination((prevState) => ({
      ...prevState,
      recordsPerPage: size,
    }));
    callAllTrip({
      ...date,
      limit: size,
      skip: pagination.pageIndex * size,
      search: search,
    });
  };

  const changePageIndex = (pageIndex) => {
    changePagination({
      ...pagination,
      pageIndex: pageIndex,
    });
    callAllTrip({
      ...date,
      limit: pagination.recordsPerPage,
      skip: pageIndex * pagination.recordsPerPage,
      search: search,
    });
  };

  const feedbackToggle = () => {
    setIsFeedbackDialog(!isFeedbackDialog);
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
      const data = {
        leg_id: current.leg_id,
      };
      callGetFeedback(data);
      callGetReasonApi(data);
      callAllTrip({
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
    }
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

  useEffect(() => {
    changeTotal(total_trips);
    changePagination((prevState) => ({
      ...prevState,
      total: total_trips,
    }));
  }, [total_trips, all_trips]);

  const disabledEditButton = (disabledValue) => {
    let disabledVal =
      [
        'sent',
        'fully_paid',
        'part_paid',
        'refunded',
        'uninvoiced',
        'disputed',
        'cancelled',
        'locked',
      ].includes(disabledValue) ||
      buttonRoleAccess(
        'completedTripEditButton',
        strictValidObjectWithKeys(userprofile) && userprofile.role_id,
      )
        ? false
        : true;
    if (
      buttonRoleAccess(
        'completedTripEditButtonBilling',
        strictValidObjectWithKeys(userprofile) && userprofile.role_id,
      )
    ) {
      if (['none', 'in_progress', 'dispute_accepted'].includes(disabledValue)) {
        disabledVal = true;
      }
    }
    return disabledVal;
  };

  const infoToggle = () => {
    setIsInfoDialog(!isInfoDialog);
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
        title={`Trip ${current.leg_id}`}
        handleClose={() => {
          infoToggle();
        }}
      >
        <DialogContent sx={{ overflow: 'auto', height: '800px' }}>
          <InfoDetails data={current} />
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
  const toggleDialog = () => {
    setChangeStatus(!changeStatus);
  };
  const changeTripStatus = () => {
    const token = store('authToken');
    const data = {
      trip_id: tripData.trip_id,
      status: status,
      timezone: moment.tz.guess(),
      token: token,
    };
    socket.emit('revert_trip', data);
    toggleWarningDialog();
  };

  const toggleWarningDialog = () => {
    setWarning(!warning);
  };

  const warningDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        isOpen={warning}
        fullWidth={true}
        maxWidth={'sm'}
        sxAppBar={{ justifyContent: 'center', alignItems: 'center' }}
        sxTitle={{ fontSize: 24 }}
        closeIcon={false}
        appBarColor="error"
        title={'Warning !'}
        handleClose={() => {
          toggleWarningDialog();
        }}
      >
        <DialogContent>
          <DialogContentText
            className={classes.title}
            id="alert-dialog-slide-description"
          >
            Are you sure you want to change the status ?
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: 'space-around', display: 'flex', mt: 2 }}
        >
          <Button
            color="success"
            className={classes.buttonForceAction}
            variant="outlined"
            onClick={() => changeTripStatus()}
          >
            Yes
          </Button>
          <Button
            className={classes.buttonForceAction}
            color="error"
            variant="outlined"
            onClick={() => toggleWarningDialog()}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const changeStatusDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        isOpen={changeStatus}
        title={'Are you sure ?'}
        handleClose={() => {
          toggleDialog();
        }}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {'Do you want to force the trip status ?'}
          </DialogContentText>
          {strictValidObjectWithKeys(tripData) && (
            <>
              <Box mt={2}>
                <Stack direction="row">
                  <DialogContentText className={classes.header}>
                    Current Status{' '}
                  </DialogContentText>
                  <DialogContentText variant="h3" className={classes.subtitle}>
                    {transportStatus(tripData.status)}
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
                      {[{ title: 'Requested', value: 'requested' }].map(
                        (res) => {
                          return (
                            <MenuItem value={res.value}>{res.title}</MenuItem>
                          );
                        },
                      )}
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
            onClick={() => toggleDialog()}
          >
            Cancel
          </Button>
          <Button
            disabled={!status}
            color="primary"
            variant="outlined"
            onClick={() => {
              toggleWarningDialog();
              toggleDialog();
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const searchQueryFilter = (e) => {
    callAllTrip({
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
    callAllTrip({
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

  return (
    <>
      <Grid>
        <ReactTable
          loading={!refreshing && isLoad}
          isLoadInner={isLoadInner}
          serverSidePagination={true}
          setRecordsPerPage={setRecordsPerPage}
          headerFilter={false}
          isDateFilter
          DateFilterCss={true}
          filterButton={false}
          // showExport
          onFilter={(dates) => {
            callAllTrip({
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
            callAllTrip({
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
          showExport
          downloadBtnBody={{
            name: tripExportConstants.CompletedTrip,
            start_date: date.start_date,
            end_date: date.end_date,
            search: search,
            account_field: 'true',
          }}
          serverSideFilter={(e) => searchQueryFilter(e)}
          customText={'You do not have any configured Trips'}
          recordsPerPage={pagination.recordsPerPage}
          pageNumber={pagination.pageIndex}
          clearFilterButton={() => {
            clearQueryFilter('');
          }}
          columnDefs={[
            {
              Header: 'Pick-up Time',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  formatDateTime(originalRow.pick_up_date_time)
                );
              },
              Filter: DateFilter,
              width: 140,
              Cell: (props) => (
                <>
                  <Typography>
                    <Typography>
                      {formatDateTime(props.row.original.estimated_end_time) ===
                      'N/A'
                        ? props.row.original.type === 'will_call'
                          ? 'N/A'
                          : formatDate(props.row.original.pick_up_date_time)
                        : props.row.original.type === 'will_call'
                        ? 'N/A'
                        : formatDateTime(props.row.original.pick_up_date_time)}
                    </Typography>
                  </Typography>
                </>
              ),
            },
            {
              Header: 'Leg ID',
              accessor: 'leg_id',
              width: 100,
              disableSortBy: true,
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
              Header: 'Invoice Status',
              accessor: 'invoice_status',
              Filter: SelectColumnFilter,
              width: 120,
              disableSortBy: true,
              Cell: (props) => (
                <>
                  <Typography>
                    {transportStatus(props.row.original.invoice_status)}
                  </Typography>
                </>
              ),
            },

            {
              Header: 'Pick-up Location',
              accessor: 'trip_pickup_location',
              disableSortBy: true,
              Cell: (props) => (
                <MDTooltip title={props.row.original.trip_pickup_location}>
                  <Typography height={55}>
                    {limitWords(props.row.original.trip_pickup_location, 20)}
                  </Typography>
                </MDTooltip>
              ),
            },
            {
              Header: 'Drop-off Location',
              accessor: 'trip_dropoff_location',
              disableSortBy: true,
              Cell: (props) => (
                <MDTooltip title={props.row.original.trip_dropoff_location}>
                  <Typography height={55}>
                    {limitWords(props.row.original.trip_dropoff_location, 20)}
                  </Typography>
                </MDTooltip>
              ),
            },
            {
              Header: 'Transport Mode',
              accessor: 'capability_id',
              width: 220,
              disableSortBy: true,
              Filter: CapabilityFilters,
              Cell: (props) => (
                <>
                  <CellTypes
                    type="capability_role"
                    value={
                      strictValidArrayWithLength(
                        props.row.original.capability_id,
                      ) && props.row.original.capability_id.toString()
                    }
                  />
                </>
              ),
            },
            {
              Header: 'Clarifications',
              accessor: 'capability_clarification',
              width: 150,
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
              Cell: (props) => (
                <>
                  <MDTooltip
                    title={props.row.original.base_patient.description}
                  >
                    <Typography height={55}>
                      {strictValidString(
                        props.row.original.base_patient.description,
                      )
                        ? props.row.original.base_patient.description
                        : 'N/A'}
                    </Typography>
                  </MDTooltip>
                </>
              ),
            },
            {
              Header: 'Miles',
              accessor: 'distance',
              width: 70,
              isVisible: false,
              disableSortBy: true,
              Cell: (props) => (
                <>
                  <Typography>
                    {!strictValidString(props.row.original.distance)
                      ? ''
                      : props.row.original.distance}
                  </Typography>
                </>
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
                  validObjectWithParameterKeys(originalRow, [
                    'cost_center_name',
                  ])
                  ? strictValidObjectWithKeys(originalRow.corporate_account) &&
                      `${originalRow.corporate_account.name} - ${originalRow.cost_center_name}`
                  : strictValidObjectWithKeys(originalRow.corporate_account) &&
                      originalRow.corporate_account.name;
              },
              Filter: SelectColumnFilter,
              disableSortBy: true,
              Cell: (props) => {
                const accountName = validObjectWithParameterKeys(
                  props.row.original,
                  ['cost_center_name'],
                )
                  ? `${props.row.original.corporate_account.name} - ${props.row.original.cost_center_name}`
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
              Header: 'Action',
              accessor: '',
              width: 120,
              Filter: false,
              Cell: (props) => {
                const field = props.row.original;
                return (
                  <>
                    <EditableButton
                      deleteButtonShow={false}
                      infoButton={true}
                      cancelIcon
                      editButtonDisabled={
                        !disabledEditButton(props.row.original.invoice_status)
                      }
                      editIconTitle="Edit is Disabled"
                      editButtonClicked={async () => {
                        editToggle();
                        const res = await callTripIegId(
                          props.row.original.leg_id,
                        );
                        if (res) {
                          setCurrentTrip({
                            ...res,
                            trip_update: 'completed',
                          });
                        }
                        // setValue('2');
                        // const tripDetail = {
                        //   ...field,
                        //   completed: true,
                        // };
                        // setData(tripDetail);
                      }}
                      infoIconColor={field.feedback ? 'red' : '#1C2A39'}
                      infoButtonClick={() => {
                        infoToggle();
                        setCurrent({ ...field, completed: true });
                        const data = {
                          leg_id: field.leg_id,
                        };
                        callGetFeedback(data);
                        callGetReasonApi(data);
                        callFushLogs();
                      }}
                    >
                      <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                          <React.Fragment>
                            <Tooltip title="Action">
                              <IconButton
                                color="primary"
                                size="small"
                                disabled={
                                  props.row.original.status !== 'cancelled' &&
                                  props.row.original.status !==
                                    'cancelled_no_billable'
                                }
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
                                disabled={
                                  props.row.original.invoice_status !== 'none'
                                }
                                onClick={() => {
                                  setTripData(field);
                                  toggleDialog();
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
                    </EditableButton>
                  </>
                );
              },
            },
          ]}
          total={total}
          rowData={Array.isArray(all_trips) ? all_trips : []}
          changePageSize={changePageSize}
          changePageIndex={changePageIndex}
        />
      </Grid>
      {infoDialog()}
      {changeStatusDialog()}
      {warningDialog()}
      {feedbackDialog()}
      {editDialog()}
    </>
  );
};

CompletedTrips.propTypes = {
  callAllTrip: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

CompletedTrips.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.trip.completedTrips.message,
    isLoad: state.trip.completedTrips.isLoad,
    loadErr: state.trip.completedTrips.loadErr,
    all_trips: state.trip.completedTrips.data,
    total_trips: state.trip.completedTrips.total_trips,
    isLoadInner: state.trip.completedTrips.isLoadInner,
    userprofile: state.auth.user,
    isLoadErr: state.trip.addFeedback.isLoad,
    feedbackMess: state.trip.addFeedback.message,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callAllTrip: (...params) => dispatch(getCompletedTrip(...params)),
  calladdFeedback: (...params) => dispatch(submitFeedback(...params)),
  callFlushMessage: (...params) => dispatch(flushMessage(...params)),
  callGetFeedback: (...params) => dispatch(getUserFeedback(...params)),
  callGetReasonApi: (...params) => dispatch(getReasons(...params)),
  callTripIegId: (...params) => dispatch(tripIegId(...params)),
  callSaveFilter: (...params) => dispatch(saveFilterCompleted(...params)),
  callGetFilter: (...params) => dispatch(getFiltersCompleted(...params)),
  callCompletedTrips: (...params) =>
    dispatch(getCompletedTripByFilter(...params)),
  callFushLogs: (...params) => dispatch(flushLogs(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(CompletedTrips);

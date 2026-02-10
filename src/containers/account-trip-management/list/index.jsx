/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  Stack,
  Typography,
  Menu,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
  MenuItem,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/common-utils';
import ReactTable from '../../../components/react-table';
import {
  getTrip,
  deleteTrip,
  flushAccountQuote,
  flushBarError,
  deleteTripWithReason,
  tripIegId,
  getAccTripByFilters,
  saveAccFilters,
  getFilters,
} from '../action';
import EditableButton from '../../../components/react-table/components/editable-button';
import {
  DateFilter,
  CapabilityFilters,
  SelectColumnFilter,
} from '../../../components/react-table/helper';
import CellTypes from '../../../components/react-table/components/renderTypes';
import MDTooltip from '../../../components/tooltip';
import { transportStatus } from '../../../utils/constant';
import { makeStyles } from '@mui/styles';
import InfoDetails from '../../trip-management/info-dialog';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { getActiveCapabilityRoles } from '../../drivers-management/action';
import { useSnackbar } from 'notistack';
import { SocketContext } from '../../../hooks/useSocketContext';
import { Field, Form } from 'react-final-form';
import FinalFormText from '../../../components/final-form/input-text';
import { LoadingButton } from '@mui/lab';
import createDecorator from 'final-form-focus';
import arrayMutators from 'final-form-arrays';
import {
  flushLogs,
  flushMessage,
  getUserFeedback,
  submitFeedback,
} from '../../trip-management/action';
import EditTrip from '../edit-trip';
import moment from 'moment';
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
  subtitle: {
    width: 250,
    margin: theme.spacing(0.5, 2),
    fontSize: 16,
  },
  helperText: {
    margin: `${theme.spacing(0.2, 0, 0, 0)} !important`,
    color: theme.palette.error.main,
    backgroundColor: '#fff',
  },
  buttonForceAction: {
    width: 170,
    textTransform: 'capitalize',
  },
}));
const UserList = ({
  setValue,
  isLoad,
  isLoadInner,
  message,
  setData,
  callAllTrip,
  callDeleteTrip,
  userprofile,
  all_trips,
  callCapabilityRolesApi,
  callAccountflushQuote,
  callBarErrorFlush,
  calladdFeedback,
  callFlushMessage,
  callGetFeedback,
  isLoadErr,
  feedbackMess,
  callDeleteTripWithReason,
  callTripIegId,
  legId,
  total_trips,
  callGetFilters,
  callSaveFilters,
  callAllTripWithFilter,
  callFushLogs,
  savedLimit,
}) => {
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [current, setCurrent] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [isInfoDialog, setIsInfoDialog] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [isFeedbackDialog, setIsFeedbackDialog] = useState(false);
  const [childTripDialog, setChildTripDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const socket = useContext(SocketContext);
  const [isReasonDialog, setIsReasonDialog] = useState(false);
  const [cancelNoBillable, setCancelNoBillable] = useState(false);
  const [isEditDialog, setisEditDialog] = useState(false);
  const [currentTrip, setCurrentTrip] = useState({});
  const [total, changeTotal] = useState(0);
  const [clearFilters, setClearFilters] = useState(false);
  const [pagination, changePagination] = useState({
    total: 0,
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
      type: 'trip',
      device_type: 'web',
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
      type: 'trip',
      device_type: 'web',
    });
  };
  useEffect(() => {
    if (pagination.recordsPerPage !== null) {
      callAllTrip({
        ...date,
        limit: pagination.recordsPerPage,
        skip: pagination.pageIndex * pagination.recordsPerPage,
        search: search,
        type: 'trip',
        device_type: 'web',
      });
    }
  }, []);

  useEffect(() => {
    const data = {
      ...date,
      limit: pagination.recordsPerPage,
      skip: pagination.pageIndex * pagination.recordsPerPage,
      search: search,
      type: 'trip',
      device_type: 'web',
    };
    callSaveFilters(data);
    callGetFilters();
  }, [date, pagination, search]);

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
      type: 'trip',
      device_type: 'web',
    });
  };

  useEffect(() => {
    callCapabilityRolesApi();
    callAccountflushQuote();
    callBarErrorFlush();
  }, []);

  const searchQueryFilter = (e) => {
    callAllTrip({
      ...date,
      limit: pagination.recordsPerPage,
      skip: 0,
      search: e,
      type: 'trip',
      device_type: 'web',
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
      type: 'trip',
      device_type: 'web',
    });
    changePagination({
      ...pagination,
      recordsPerPage: pagination.recordsPerPage,
      pageIndex: 0,
    });
    setSearch(text);
  };

  useEffect(() => {
    socket.on(`create_trip_${userprofile.user_id}`, (callback) => {
      if (strictValidObjectWithKeys(userprofile) && userprofile.role_id === 7) {
        setRefreshing(true);
        callAllTripWithFilter();
        callCapabilityRolesApi();
        setClearFilters(true);
      }
    });

    socket.on(`transport_status_${userprofile.user_id}`, (callback) => {
      if (strictValidObjectWithKeys(userprofile) && userprofile.role_id === 7) {
        setRefreshing(true);
        callAllTripWithFilter();
        callCapabilityRolesApi();
        setClearFilters(true);
      }
    });
    return () => {
      socket.off('trip_status');
      socket.off('transport_status');
    };
  }, []);
  const deleteChildToggle = () => {
    setChildTripDialog(!childTripDialog);
  };
  const deleteTripFun = async (val) => {
    if (strictValidArrayWithLength(current.child_trip_leg_id)) {
      deleteChildToggle();
      deleteToggle();
    } else if (cancelNoBillable) {
      reasonToggle();
      deleteToggle();
    } else {
      const result = await callDeleteTrip(val);
      if (result) {
        if (
          strictValidArrayWithLength(all_trips) &&
          (all_trips.length === 1 ||
            all_trips.length === 2 ||
            all_trips.length === 3) &&
          pagination.pageIndex === 1
        ) {
          callAllTrip({
            ...date,
            limit: pagination.recordsPerPage,
            skip: 0,
            search: search,
            type: 'trip',
            device_type: 'web',
          });
          const data = {
            ...date,
            limit: pagination.recordsPerPage,
            skip: 0,
            search: search,
            type: 'trip',
            device_type: 'web',
          };
          changePagination({
            ...pagination,
            pageIndex: 0,
          });
          callSaveFilters(data);
          callGetFilters();
        } else if (
          strictValidArrayWithLength(all_trips) &&
          (all_trips.length === 1 ||
            all_trips.length === 2 ||
            all_trips.length === 3) &&
          pagination.pageIndex > 1
        ) {
          callAllTrip({
            ...date,
            limit: pagination.recordsPerPage,
            skip: pagination.pageIndex * pagination.recordsPerPage - savedLimit,
            search: search,
            type: 'trip',
            device_type: 'web',
          });
          const data = {
            ...date,
            limit: pagination.recordsPerPage,
            skip: pagination.pageIndex * pagination.recordsPerPage - savedLimit,
            search: search,
            type: 'trip',
            device_type: 'web',
          };
          changePagination({
            ...pagination,
            pageIndex: pagination.pageIndex - 1,
          });
          callSaveFilters(data);
          callGetFilters();
        } else {
          callAllTrip({
            ...date,
            limit: pagination.recordsPerPage,
            skip: pagination.pageIndex * pagination.recordsPerPage,
            search: search,
            type: 'trip',
            device_type: 'web',
          });
        }

        deleteToggle();
        socket.emit('trip_cancelled', val);
      }
    }
  };

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
            ? strictValidObjectWithKeys(legId) && legId.type === 'new'
              ? `New Trip ${strictValidObjectWithKeys(legId) && legId.leg_id}`
              : `Edit Trip ${strictValidObjectWithKeys(legId) && legId.leg_id}`
            : 'Loading...'
        }
        handleClose={() => {
          editToggle();
        }}
      >
        <DialogContent>
          {strictValidObjectWithKeys(currentTrip) ? (
            <EditTrip
              setValue={() => {
                editToggle();
                setCurrentTrip({});
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

  const feedbackToggle = () => {
    setIsFeedbackDialog(!isFeedbackDialog);
  };
  const deleteTripWithChild = async (val) => {
    if (cancelNoBillable) {
      reasonToggle();
      deleteChildToggle();
    } else {
      const result = await callDeleteTrip(val);
      if (result) {
        if (
          strictValidArrayWithLength(all_trips) &&
          (all_trips.length === 1 ||
            all_trips.length === 2 ||
            all_trips.length === 3) &&
          pagination.pageIndex === 1
        ) {
          callAllTrip({
            ...date,
            limit: pagination.recordsPerPage,
            skip: 0,
            search: search,
            type: 'trip',
            device_type: 'web',
          });
          const data = {
            ...date,
            limit: pagination.recordsPerPage,
            skip: 0,
            search: search,
            type: 'trip',
            device_type: 'web',
          };
          changePagination({
            ...pagination,
            pageIndex: 0,
          });
          callSaveFilters(data);
          callGetFilters();
        } else if (
          strictValidArrayWithLength(all_trips) &&
          (all_trips.length === 1 ||
            all_trips.length === 2 ||
            all_trips.length === 3) &&
          pagination.pageIndex > 1
        ) {
          callAllTrip({
            ...date,
            limit: pagination.recordsPerPage,
            skip: pagination.pageIndex * pagination.recordsPerPage - savedLimit,
            search: search,
            type: 'trip',
            device_type: 'web',
          });
          const data = {
            ...date,
            limit: pagination.recordsPerPage,
            skip: pagination.pageIndex * pagination.recordsPerPage - savedLimit,
            search: search,
            type: 'trip',
            device_type: 'web',
          };
          changePagination({
            ...pagination,
            pageIndex: pagination.pageIndex - 1,
          });
          callSaveFilters(data);
          callGetFilters();
        } else {
          callAllTrip({
            ...date,
            limit: pagination.recordsPerPage,
            skip: pagination.pageIndex * pagination.recordsPerPage,
            search: search,
            type: 'trip',
            device_type: 'web',
          });
        }

        deleteChildToggle();
        socket.emit('trip_cancelled', val);
      }
    }
  };

  const deleteToggle = () => {
    setIsDeleteDialog(!isDeleteDialog);
  };

  useEffect(() => {
    changeTotal(total_trips);
    changePagination((prevState) => ({
      ...prevState,
      total: total_trips,
    }));
  }, [total_trips, all_trips]);
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
      callAllTrip({
        ...date,
        limit: pagination.recordsPerPage,
        skip: pagination.pageIndex * pagination.recordsPerPage,
        search: search,
        type: 'trip',
        device_type: 'web',
      });
      changePagination({
        ...pagination,
        recordsPerPage: pagination.recordsPerPage,
        pageIndex: pagination.pageIndex,
      });
    }
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
  const reasonToggle = () => {
    setIsReasonDialog(!isReasonDialog);
  };
  const onSubmitReason = async (val) => {
    const result = await callDeleteTripWithReason(current.trip_id, {
      status: 'cancelled_no_billable',
      reason: val.reason,
    });
    if (result) {
      callAllTrip();
      reasonToggle();
      setCancelNoBillable(false);
      socket.emit('trip_cancelled', val);
    }
  };

  const reasonDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        isOpen={isReasonDialog}
        fullWidth={true}
        maxWidth={'sm'}
        sxAppBar={{ justifyContent: 'center', alignItems: 'center' }}
        sxTitle={{ fontSize: 24 }}
        closeIcon={false}
        title={'Add Reason'}
        handleClose={() => {
          reasonToggle();
        }}
      >
        <Form
          onSubmit={onSubmitReason}
          keepDirtyOnReinitialize
          mutators={{
            ...arrayMutators,
          }}
          decorators={[focusOnErrors]}
          initialValues={{
            reason: '',
          }}
          validate={(values) => {
            const errors = {};
            if (isBlank(values.reason)) {
              errors.reason = 'Reason is required';
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
                  name="reason"
                  id="add_reason_input"
                  placeholder="Enter Reason here"
                  required
                  multiline
                  rows={4}
                  errorText={touched.reason && errors.reason}
                />
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
                    onClick={() => {
                      reasonToggle();
                      setCancelNoBillable(false);
                    }}
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
        fullWidth={true}
        maxWidth={'sm'}
        sxAppBar={{ justifyContent: 'center', alignItems: 'center' }}
        sxTitle={{ fontSize: 24 }}
        closeIcon={false}
        appBarColor="error"
        title={'Warning !'}
        handleClose={() => {
          deleteToggle();
        }}
      >
        {strictValidObjectWithKeys(current) && (
          <DialogContent>
            <DialogContentText className={classes.title}>
              Are you sure you want to cancel the trip?
            </DialogContentText>
            <Stack direction="row">
              <DialogContentText className={classes.header}>
                TripID
              </DialogContentText>
              <DialogContentText className={classes.subtitle}>
                {current.leg_id}
              </DialogContentText>
            </Stack>
            <Stack direction="row">
              <DialogContentText className={classes.header}>
                Account
              </DialogContentText>
              <DialogContentText className={classes.subtitle}>
                {current.corporate_account.name}
              </DialogContentText>
            </Stack>
            <Stack direction="row">
              <DialogContentText className={classes.header}>
                Pick-up Time
              </DialogContentText>
              <DialogContentText className={classes.subtitle}>
                {formatDateTime(current.estimated_end_time) === 'N/A'
                  ? formatDate(current.pick_up_date_time)
                  : formatDateTime(current.pick_up_date_time)}
                {/* {formatDateTime(current.pick_up_date_time)} */}
              </DialogContentText>
            </Stack>
            <Stack direction="row">
              <DialogContentText className={classes.header}>
                Patient
              </DialogContentText>
              <DialogContentText className={classes.subtitle}>
                {current.base_patient.last_name +
                  ', ' +
                  current.base_patient.first_name}
              </DialogContentText>
            </Stack>
          </DialogContent>
        )}
        <DialogActions
          sx={{ justifyContent: 'space-around', display: 'flex', mt: 2 }}
        >
          <Button
            color="error"
            className={classes.buttonForceAction}
            variant="outlined"
            onClick={() => deleteTripFun(current.trip_id)}
          >
            Yes
          </Button>
          <Button
            className={classes.buttonForceAction}
            color="success"
            variant="outlined"
            onClick={() => deleteToggle()}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    );
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
        appBarColor="error"
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
            All following related Trips will be canceled:
          </DialogContentText>
          <Box flexDirection="row" display="flex" flexWrap="wrap">
            {strictValidArrayWithLength(current.child_trip_leg_id) &&
              current.child_trip_leg_id.map((a) => {
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
            color="error"
            className={classes.buttonForceAction}
            variant="outlined"
            onClick={() => deleteTripWithChild(current.trip_id)}
          >
            Yes
          </Button>
          <Button
            className={classes.buttonForceAction}
            color="success"
            variant="outlined"
            onClick={() => deleteChildToggle()}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  useEffect(() => {
    // eslint-disable-next-line array-callback-return
    all_trips.map((a, index) => {
      if (index === 0) {
        if (a.hasOwnProperty('approved_by') && a.hasOwnProperty('no_of_days')) {
          return setHiddenColumns([]);
        } else if (a.hasOwnProperty('approved_by')) {
          return setHiddenColumns(['no_of_days']);
        } else if (a.hasOwnProperty('no_of_days')) {
          return setHiddenColumns(['approved_by']);
        } else {
          return setHiddenColumns(['approved_by', 'no_of_days']);
        }
      }
    });
  }, [all_trips]);

  return (
    <>
      <Grid>
        <ReactTable
          hiddenColumns={hiddenColumns}
          setClearFilters={() => setClearFilters(false)}
          clearFilters={clearFilters}
          headerFilter={false}
          serverSideFilter={(e) => searchQueryFilter(e)}
          serverSidePagination={true}
          DateFilterCss={true}
          clearFilterButton={() => {
            clearQueryFilter('');
          }}
          filterButton={false}
          loading={!refreshing && isLoad}
          isLoadInner={isLoadInner}
          isQuote
          isDateFilter
          onFilter={(dates) => {
            callAllTrip({
              ...dates,
              limit: pagination.recordsPerPage,
              skip: 0,
              search: search,
              type: 'trip',
              device_type: 'web',
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
              type: 'trip',
              device_type: 'web',
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
          recordsPerPage={pagination.recordsPerPage}
          pageNumber={pagination.pageIndex}
          changePageSize={changePageSize}
          changePageIndex={changePageIndex}
          setRecordsPerPage={setRecordsPerPage}
          onQuote={() => setValue('4')}
          customText={'You do not have any configured Trips'}
          getCellProperties={(cellInfo) => ({
            style: {
              backgroundColor:
                strictValidObjectWithKeys(cellInfo.row.original) &&
                cellInfo.row.original.type !== 'will_call' &&
                cellInfo.row.original.is_parent === 1 &&
                cellInfo.row.original.status !== 'on_hold' &&
                new Date(cellInfo.row.original.pick_up_date_time) <
                  getPhoenixDateTime()
                  ? '#ffe6e6'
                  : strictValidObjectWithKeys(cellInfo.row.original) &&
                    cellInfo.row.original.status !== 'on_hold' &&
                    cellInfo.row.original.type === 'will_call' &&
                    formatDateTime(cellInfo.row.original.estimated_end_time) ===
                      'N/A' &&
                    cellInfo.row.original.is_parent === 1 &&
                    moment(cellInfo.row.original.pick_up_date_time).format(
                      'MM/DD/YY',
                    ) !== moment(getPhoenixDateTime()).format('MM/DD/YY') &&
                    Date.parse(
                      moment(cellInfo.row.original.pick_up_date_time),
                    ) <= getPhoenixDateTime()
                  ? '#ffe6e6'
                  : strictValidObjectWithKeys(cellInfo.row.original) &&
                    cellInfo.row.original.type !== 'will_call' &&
                    cellInfo.row.original.is_parent === 0 &&
                    formatDateTime(cellInfo.row.original.estimated_end_time) !==
                      'N/A' &&
                    cellInfo.row.original.status !== 'on_hold' &&
                    new Date(cellInfo.row.original.pick_up_date_time) <
                      getPhoenixDateTime()
                  ? '#ffe6e6'
                  : strictValidObjectWithKeys(cellInfo.row.original) &&
                    cellInfo.row.original.status !== 'on_hold' &&
                    cellInfo.row.original.type !== 'will_call' &&
                    cellInfo.row.original.parent_type === 'will_call' &&
                    formatDateTime(cellInfo.row.original.estimated_end_time) ===
                      'N/A' &&
                    moment(cellInfo.row.original.pick_up_date_time).format(
                      'MM/DD/YY',
                    ) !== moment(getPhoenixDateTime()).format('MM/DD/YY') &&
                    Date.parse(
                      moment(cellInfo.row.original.pick_up_date_time),
                    ) <= getPhoenixDateTime()
                  ? '#ffe6e6'
                  : null,
            },
          })}
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
              width: 123,
              Cell: (props) => (
                <Typography>
                  {formatDateTime(props.row.original.estimated_end_time) ===
                  'N/A'
                    ? formatDate(props.row.original.pick_up_date_time)
                    : formatDateTime(props.row.original.pick_up_date_time)}
                </Typography>
              ),
            },
            {
              Header: 'ETA Drop-off',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  formatDateTime(originalRow.pick_up_date_time)
                );
              },
              width: 123,
              disableSortBy: true,
              Filter: DateFilter,
              Cell: (props) => (
                <>
                  <Typography>
                    {formatDateTime(props.row.original.estimated_end_time)}
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
              width: 100,
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
              Header: 'Pick-up Location',
              width: 170,
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
              width: 170,
              accessor: 'trip_dropoff_location',
              disableSortBy: true,
              Cell: (props) => (
                <>
                  <MDTooltip title={props.row.original.trip_dropoff_location}>
                    <Typography height={55}>
                      {limitWords(props.row.original.trip_dropoff_location, 20)}
                    </Typography>
                  </MDTooltip>
                </>
              ),
            },
            {
              Header: 'Transport Mode',
              accessor: 'capability_id',
              width: 165,
              disableSortBy: true,
              Filter: CapabilityFilters,
              Cell: (props) => (
                <>
                  <CellTypes
                    type="capability_role"
                    value={props.row.original.capability_id.toString()}
                  />
                </>
              ),
            },

            {
              Header: 'Clarifications',
              accessor: 'capability_clarification',
              width: 110,
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
              accessor: 'weight_in',
              width: 55,
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
                  `${originalRow.pick_up_stairs}/${originalRow.drop_off_stairs}`
                );
              },
              width: 115,
              disableSortBy: true,
              isVisible: true,
              Cell: (props) => (
                <>
                  <Typography>
                    {props.row.original.pick_up_stairs}/
                    {props.row.original.drop_off_stairs}
                  </Typography>
                </>
              ),
            },
            {
              Header: 'Special Instructions',
              width: 155,
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
              width: 85,
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
              Header: 'No. of days',
              accessor: 'no_of_days',
              width: 105,
              disableSortBy: true,
              Cell: (props) => (
                <>
                  <Typography>
                    {strictValidString(props.row.original.no_of_days)
                      ? props.row.original.no_of_days
                      : 'N/A'}
                  </Typography>
                </>
              ),
            },
            {
              Header: 'Approved By',
              accessor: 'approved_by',
              width: 110,
              disableSortBy: true,
              Cell: (props) => (
                <>
                  <Typography>
                    {strictValidString(props.row.original.approved_by)
                      ? props.row.original.approved_by
                      : 'N/A'}
                  </Typography>
                </>
              ),
            },
            {
              Header: 'Actions',
              accessor: '',
              Filter: false,
              disableSortBy: true,
              width: 155,
              Cell: (props) => {
                const field = props.row.original;
                return (
                  <>
                    <EditableButton
                      infoButton
                      cancelIcon
                      deleteButtonDisabled={
                        props.row.original.status === 'patient_loaded' ||
                        props.row.original.status === 'arrived_at_drop_off'
                      }
                      hideDeleteButton={
                        props.row.original.status === 'patient_loaded' ||
                        props.row.original.status === 'arrived_at_drop_off'
                      }
                      editButtonDisabled={
                        props.row.original.status === 'allocated' ||
                        props.row.original.status === 'patient_loaded' ||
                        props.row.original.status === 'arrived_at_drop_off' ||
                        props.row.original.status === 'arrived_at_pick_up' ||
                        props.row.original.status === 'confirm_dob' ||
                        props.row.original.status === 'en_route' ||
                        props.row.original.status === 'dispatch_requested' ||
                        props.row.original.status === 'accepted' ||
                        props.row.original.status === 'dispatched' ||
                        props.row.original.status === 'on_hold'
                      }
                      editIconTitle="Edit is Disabled"
                      editButtonClicked={async () => {
                        editToggle();
                        const res = await callTripIegId(
                          props.row.original.leg_id,
                        );
                        if (res) {
                          setCurrentTrip(res);
                        }
                        // setValue('2');
                        // setData(field);
                      }}
                      deleteButtonClicked={() => {
                        deleteToggle();
                        setCurrent(field);
                      }}
                      infoIconColor={field.feedback ? 'red' : '#1C2A39'}
                      infoButtonClick={() => {
                        infoToggle();
                        const data = {
                          leg_id: field.leg_id,
                        };
                        callGetFeedback(data);
                        setCurrent(field);
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
                                  const data = {
                                    ...field,
                                    copy: true,
                                    pick_up_date_time: null,
                                    type: 'scheduled',
                                    child_trip: false,
                                  };
                                  setValue('2');
                                  setData(data);
                                }}
                              >
                                <ListItemIcon>
                                  <ContentCopyOutlinedIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Copy</ListItemText>
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
          rowData={all_trips}
        />
      </Grid>
      {deleteDialog()}
      {infoDialog()}
      {deleteChildTrips()}
      {feedbackDialog()}
      {reasonDialog()}
      {editDialog()}
    </>
  );
};

UserList.propTypes = {
  callAllTrip: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

UserList.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.account_trip.message,
    isLoad: state.account_trip.isLoad,
    loadErr: state.account_trip.loadErr,
    all_trips: state.account_trip.all_trip_acounts,
    userprofile: state.auth.user,
    isLoadInner: state.account_trip.isLoadInner,
    isLoadErr: state.trip.addFeedback.isLoad,
    feedbackMess: state.trip.addFeedback.message,
    userFeedback: state.trip.getFeedback.get_feedback,
    legId: state.account_trip.save_leg,
    total_trips: state.account_trip.total_trips,
    savedLimit: state.account_trip.saveFilters.limit,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callAllTrip: (...params) => dispatch(getTrip(...params)),
  callAllTripWithFilter: (...params) =>
    dispatch(getAccTripByFilters(...params)),
  callDeleteTrip: (...params) => dispatch(deleteTrip(...params)),
  callBarErrorFlush: (...params) => dispatch(flushBarError(...params)),
  callCapabilityRolesApi: (...params) =>
    dispatch(getActiveCapabilityRoles(...params)),
  callAccountflushQuote: (...params) => dispatch(flushAccountQuote(...params)),
  calladdFeedback: (...params) => dispatch(submitFeedback(...params)),
  callFlushMessage: (...params) => dispatch(flushMessage(...params)),
  callGetFeedback: (...params) => dispatch(getUserFeedback(...params)),
  callDeleteTripWithReason: (...params) =>
    dispatch(deleteTripWithReason(...params)),
  callTripIegId: (...params) => dispatch(tripIegId(...params)),
  callGetFilters: (...params) => dispatch(getFilters(...params)),
  callSaveFilters: (...params) => dispatch(saveAccFilters(...params)),
  callFushLogs: (...params) => dispatch(flushLogs(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(UserList);

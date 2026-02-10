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
  strictValidArrayWithKey,
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
  validObjectWithParameterKeys,
} from '../../../utils/common-utils';
import ReactTable from '../../../components/react-table';
import FinalFormText from '../../../components/final-form/input-text';
import {
  getTrip,
  deleteTrip,
  submitFeedback,
  flushMessage,
  getUserFeedback,
  deleteTripWithReason,
  tripIegId,
  getFilters,
  saveFilters,
  getTripByFilters,
  getTripLogs,
  flushLogs,
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
import InfoDetails from '../info-dialog';
import WarningAmberIcon from '@mui/icons-material/Warning';
import arrayMutators from 'final-form-arrays';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { getActiveCapabilityRoles } from '../../vehicle-management/action';
import { useSnackbar } from 'notistack';
import { SocketContext } from '../../../hooks/useSocketContext';
import { Field, Form } from 'react-final-form';
import createDecorator from 'final-form-focus';
import { LoadingButton } from '@mui/lab';
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import EditTrips from '../edit-trip-dialog';
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
  headerDialog: {
    marginTop: theme.spacing(0.5),
    fontSize: 18,
    textAlign: 'center',
  },
}));
const TripList = ({
  setValue,
  isLoad,
  isLoadInner,
  message,
  setData,
  callTripIegId,
  callAllTrip,
  callDeleteTrip,
  userprofile,
  all_trips,
  total_trips,
  callCapabilityRolesApi,
  calladdFeedback,
  isLoadErr,
  feedbackMess,
  callFlushMessage,
  callGetFeedback,
  callDeleteTripWithReason,
  legId,
  callGetFilters,
  callSaveFilters,
  callAllTripWithFilter,
  callFushLogs,
  savedLimit,
}) => {
  const [total, changeTotal] = useState(0);
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [isInfoDialog, setIsInfoDialog] = useState(false);
  const [isFeedbackDialog, setIsFeedbackDialog] = useState(false);
  const [isReasonDialog, setIsReasonDialog] = useState(false);
  const [pagination, changePagination] = useState({
    total: 0,
    recordsPerPage: null,
    pageIndex: 0,
    currentPage: 1,
  });
  const [childTripDialog, setChildTripDialog] = useState(false);
  const [current, setCurrent] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [cancelNoBillable, setCancelNoBillable] = useState(false);
  const [tripData, setTripData] = useState({});
  const [clearFilters, setClearFilters] = useState(false);
  const [isEditDialog, setisEditDialog] = useState(false);
  const [forceEdit, setForceEdit] = useState(false);
  const [currentTrip, setCurrentTrip] = useState({});
  const classes = useStyles();
  const socket = useContext(SocketContext);
  const [search, setSearch] = useState('');
  const [date, setDates] = useState({
    start_date: '',
    end_date: '',
  });
  const { enqueueSnackbar } = useSnackbar();
  const callApi = async (e) => {
    callAllTrip({
      ...date,
      limit: pagination.recordsPerPage,
      skip: pagination.pageIndex * pagination.recordsPerPage,
      search: search,
    });
  };
  useEffect(() => {
    callCapabilityRolesApi();
    callFlushMessage();
  }, []);

  useEffect(() => {
    if (pagination.recordsPerPage !== null) {
      callAllTrip({
        ...date,
        limit: pagination.recordsPerPage,
        skip: pagination.pageIndex * pagination.recordsPerPage,
        search: search,
      });
    }
  }, []);

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

  useEffect(() => {
    changeTotal(total_trips);
    changePagination((prevState) => ({
      ...prevState,
      total: total_trips,
    }));
  }, [total_trips, all_trips]);

  useEffect(() => {
    socket.on('trip_status', (callback) => {
      if (
        strictValidObjectWithKeys(userprofile) &&
        strictValidArrayWithKey([5, 4, 2, 8, 7], userprofile.role_id)
      ) {
        setRefreshing(true);
        callAllTripWithFilter();
        setClearFilters(true);
        // setTableSize(true);
      }
    });

    socket.on('transport_status', (callback) => {
      if (
        strictValidObjectWithKeys(userprofile) &&
        strictValidArrayWithKey([5, 4, 2, 8, 7], userprofile.role_id)
      ) {
        setRefreshing(true);
        callAllTripWithFilter();
        setClearFilters(true);
      }
    });
    return () => {
      socket.off('trip_status');
      socket.off('transport_status');
    };
  }, [pagination.recordsPerPage, pagination.pageIndex, search]);

  const deleteToggle = () => {
    setIsDeleteDialog(!isDeleteDialog);
  };

  const feedbackToggle = () => {
    setIsFeedbackDialog(!isFeedbackDialog);
  };

  const reasonToggle = () => {
    setIsReasonDialog(!isReasonDialog);
  };

  const deleteChildToggle = () => {
    setChildTripDialog(!childTripDialog);
  };

  const infoToggle = () => {
    setIsInfoDialog(!isInfoDialog);
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
          });
          const data = {
            ...date,
            limit: pagination.recordsPerPage,
            skip: 0,
            search: search,
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
          });
          const data = {
            ...date,
            limit: pagination.recordsPerPage,
            skip: pagination.pageIndex * pagination.recordsPerPage - savedLimit,
            search: search,
          };
          changePagination({
            ...pagination,
            pageIndex: pagination.pageIndex - 1,
          });
          callSaveFilters(data);
          callGetFilters();
        } else {
          callApi();
        }

        deleteToggle();
        setCurrent({});
        socket.emit('trip_cancelled', val);
      }
    }
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
          });
          const data = {
            ...date,
            limit: pagination.recordsPerPage,
            skip: 0,
            search: search,
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
          });
          const data = {
            ...date,
            limit: pagination.recordsPerPage,
            skip: pagination.pageIndex * pagination.recordsPerPage - savedLimit,
            search: search,
          };
          changePagination({
            ...pagination,
            pageIndex: pagination.pageIndex - 1,
          });
          callSaveFilters(data);
          callGetFilters();
        } else {
          callApi();
        }
        deleteChildToggle();
        socket.emit('trip_cancelled', val);
      }
    }
  };
  useEffect(() => {
    if (forceEdit && message === 'Trip updated successfully') {
      forceEditToggle();
    }
  }, [message, forceEdit]);

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
          if (forceEdit === true) {
            forceEditToggle();
          }
        }}
      >
        <DialogContent>
          {strictValidObjectWithKeys(currentTrip) ? (
            <EditTrips
              setValue={() => {
                editToggle();
                setCurrentTrip({});
                callApi();
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
  const forceEditToggle = () => {
    setForceEdit(!forceEdit);
  };
  const forceEditTripDialog = () => {
    return (
      <Dialog
        appBarColor="error"
        title={'Warning !'}
        fullScreen={false}
        closeIcon={false}
        isOpen={forceEdit}
        fullWidth={true}
        maxWidth={'sm'}
        sxAppBar={{ justifyContent: 'center', alignItems: 'center' }}
        sxTitle={{ fontSize: 24 }}
        handleClose={() => {
          forceEditToggle();
        }}
      >
        <DialogContent
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <WarningAmberIcon
            color="error"
            sx={{ height: 60, width: 60, mb: 3 }}
          />
          <DialogContentText
            className={classes.headerDialog}
            id="alert-dialog-slide-description"
          >
            Editing Trips details in this state can create operational problems!
          </DialogContentText>
          <DialogContentText className={classes.headerDialog}>
            Use this feature with caution!
          </DialogContentText>
          <DialogContentText className={classes.headerDialog}>
            Are you sure you want to continue?”
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: 'space-around', display: 'flex', mt: 2 }}
        >
          <Button
            className={classes.buttonForceAction}
            color="success"
            variant="outlined"
            onClick={async () => {
              editToggle();
              const res = await callTripIegId(tripData.leg_id);
              if (res) {
                setCurrentTrip(res);
                forceEditToggle();
              }
            }}
          >
            Yes, Continue
          </Button>
          <Button
            className={classes.buttonForceAction}
            color="error"
            variant="outlined"
            onClick={() => {
              forceEditToggle();
              setData({});
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    );
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
  const onSubmitReason = async (val) => {
    const result = await callDeleteTripWithReason(current.trip_id, {
      status: 'cancelled_no_billable',
      reason: val.reason,
    });
    if (result) {
      callApi();
      reasonToggle();
      setCancelNoBillable(false);
      socket.emit('trip_cancelled', current.trip_id);
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
        {strictValidObjectWithKeys(current) ? (
          <DialogContent>
            <DialogContentText
              className={classes.title}
              id="alert-dialog-slide-description"
            >
              Are you sure you want to cancel the trip?
            </DialogContentText>
            <Stack direction="row">
              <DialogContentText className={classes.header}>
                Trip ID
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
                {/* {formatDateTime(current.pick_up_date_time)} */}
                {formatDateTime(current.estimated_end_time) === 'N/A'
                  ? formatDate(current.pick_up_date_time)
                  : formatDateTime(current.pick_up_date_time)}
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
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 200,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <DialogActions
          sx={{ justifyContent: 'space-around', display: 'flex', mt: 2 }}
        >
          <Button
            color="error"
            className={classes.buttonForceAction}
            variant="outlined"
            disabled={!strictValidObjectWithKeys(current)}
            onClick={() => deleteTripFun(current.trip_id)}
          >
            Yes
          </Button>
          <Button
            className={classes.buttonForceAction}
            color="success"
            variant="outlined"
            onClick={() => {
              deleteToggle();
              setCancelNoBillable(false);
              setCurrent({});
            }}
          >
            No
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
          setClearFilters={() => setClearFilters(false)}
          clearFilters={clearFilters}
          // tableSize={tableSize}
          serverSideFilter={(e) => searchQueryFilter(e)}
          serverSidePagination={true}
          headerFilter={false}
          DateFilterCss={true}
          clearFilterButton={() => {
            clearQueryFilter('');
          }}
          isDateFilter
          isQuote
          onQuote={() => setValue('4')}
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
          loading={!refreshing && isLoad}
          recordsPerPage={pagination.recordsPerPage}
          pageNumber={pagination.pageIndex}
          changePageSize={changePageSize}
          changePageIndex={changePageIndex}
          setRecordsPerPage={setRecordsPerPage}
          isLoadInner={isLoadInner}
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
              width: 120,
              Cell: (props) => (
                <>
                  <Typography>
                    {formatDateTime(props.row.original.estimated_end_time) ===
                    'N/A'
                      ? formatDate(props.row.original.pick_up_date_time)
                      : formatDateTime(props.row.original.pick_up_date_time)}
                  </Typography>
                </>
              ),
            },
            {
              Header: 'ETA Drop-off',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  formatDateTime(originalRow.estimated_end_time)
                );
              },
              width: 120,
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
              accessor: 'trip_pickup_location',
              disableSortBy: true,
              Cell: (props) => (
                <>
                  <MDTooltip title={props.row.original.trip_pickup_location}>
                    <Typography height={55}>
                      {limitWords(props.row.original.trip_pickup_location, 20)}
                    </Typography>
                  </MDTooltip>
                </>
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
              width: 160,
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
              width: 110,
              disableSortBy: true,
              isVisible: true,
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
              width: 60,
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
              width: 110,
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
              width: 160,
              disableSortBy: true,
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
              Header: 'Actions',
              accessor: '',
              Filter: false,
              width: 150,
              disableSortBy: true,
              Cell: (props) => {
                const field = props.row.original;
                return (
                  <>
                    <EditableButton
                      infoButton={true}
                      cancelIcon
                      deleteButtonDisabled={
                        props.row.original.status === 'patient_loaded' ||
                        props.row.original.status === 'arrived_at_drop_off'
                      }
                      hideDeleteButton={
                        props.row.original.status === 'patient_loaded' ||
                        props.row.original.status === 'arrived_at_drop_off'
                      }
                      editIconTitle="Edit is Disabled"
                      editButtonClicked={async () => {
                        //
                        if (
                          field.status === 'requested' ||
                          field.status === 'planned'
                        ) {
                          editToggle();
                          setTripData(field);
                          const res = await callTripIegId(
                            props.row.original.leg_id,
                          );
                          if (res) {
                            setCurrentTrip(res);
                          }
                        } else {
                          setTripData(field);
                          forceEditToggle();
                        }
                      }}
                      infoIconColor={field.feedback ? 'red' : '#1C2A39'}
                      deleteButtonClicked={async () => {
                        deleteToggle();
                        const res = await callTripIegId(
                          props.row.original.leg_id,
                        );
                        setCurrent(res);
                      }}
                      infoButtonClick={() => {
                        const field = props.row.original;
                        infoToggle();
                        setCurrent({ ...field, completed: false });
                        const data = {
                          leg_id: field.leg_id,
                        };
                        callGetFeedback(data);
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
                                    // isNew: true,
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
                              <MenuItem
                                disabled={
                                  props.row.original.status ===
                                    'patient_loaded' ||
                                  props.row.original.status ===
                                    'arrived_at_drop_off'
                                }
                                onClick={async () => {
                                  deleteToggle();
                                  const res = await callTripIegId(
                                    props.row.original.leg_id,
                                  );
                                  setCurrent(res);
                                  setCancelNoBillable(true);
                                }}
                              >
                                <ListItemIcon>
                                  <DoDisturbOnOutlinedIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Cancel no billable</ListItemText>
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
        />
      </Grid>
      {deleteDialog()}
      {infoDialog()}
      {forceEditTripDialog()}
      {deleteChildTrips()}
      {feedbackDialog()}
      {reasonDialog()}
      {editDialog()}
    </>
  );
};

TripList.propTypes = {
  callAllTrip: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
  tripMessage: PropTypes.string,
};

TripList.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.trip.allTrips.message,
    isLoad: state.trip.allTrips.isLoad,
    loadErr: state.trip.allTrips.loadErr,
    all_trips: state.trip.allTrips.data,
    total_trips: state.trip.allTrips.total_trips,
    userprofile: state.auth.user,
    isLoadInner: state.trip.allTrips.isLoadInner,
    isLoadErr: state.trip.addFeedback.isLoad,
    feedbackMess: state.trip.addFeedback.message,
    userFeedback: state.trip.getFeedback.get_feedback,
    tripMessage: state.trip.message,
    legId: state.trip.allTrips.save_leg,
    savedLimit: state.trip.allTrips.saveFilters.limit,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callAllTrip: (...params) => dispatch(getTrip(...params)),
  callAllTripWithFilter: (...params) => dispatch(getTripByFilters(...params)),
  callDeleteTrip: (...params) => dispatch(deleteTrip(...params)),
  callDeleteTripWithReason: (...params) =>
    dispatch(deleteTripWithReason(...params)),
  callCapabilityRolesApi: (...params) =>
    dispatch(getActiveCapabilityRoles(...params)),
  calladdFeedback: (...params) => dispatch(submitFeedback(...params)),
  callFlushMessage: (...params) => dispatch(flushMessage(...params)),
  callGetFeedback: (...params) => dispatch(getUserFeedback(...params)),
  callTripIegId: (...params) => dispatch(tripIegId(...params)),
  callGetFilters: (...params) => dispatch(getFilters(...params)),
  callSaveFilters: (...params) => dispatch(saveFilters(...params)),
  callGetTripLogs: (...params) => dispatch(getTripLogs(...params)),
  callFushLogs: (...params) => dispatch(flushLogs(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(TripList);

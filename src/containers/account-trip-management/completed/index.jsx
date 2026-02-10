/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  FormHelperText,
  Grid,
  Typography,
} from '@mui/material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  formatDate,
  formatDateTime,
  isBlank,
  strictValidArrayWithLength,
  strictValidNumber,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/common-utils';
import ReactTable from '../../../components/react-table';
import { getCompletedTrip, getCorporateAccount } from '../action';
import {
  DateFilter,
  CapabilityFilters,
  SelectColumnFilter,
} from '../../../components/react-table/helper';
import CellTypes from '../../../components/react-table/components/renderTypes';
import MDTooltip from '../../../components/tooltip';
import { transportStatus } from '../../../utils/constant';
import Dialog from '../../../components/dialog';
import InfoDetails from '../../trip-management/info-dialog';
import { makeStyles } from '@mui/styles';
import EditableButton from '../../../components/react-table/components/editable-button';
import {
  flushLogs,
  flushMessage,
  getReasons,
  getUserFeedback,
  submitFeedback,
} from '../../trip-management/action';
import { LoadingButton } from '@mui/lab';
import FinalFormText from '../../../components/final-form/input-text';
import { Field, Form } from 'react-final-form';
import { useSnackbar } from 'notistack';
import createDecorator from 'final-form-focus';
import arrayMutators from 'final-form-arrays';
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

const CompletedTrips = ({
  setValue,
  isLoad,
  isLoadInner,
  setData,
  callAllTrip,
  all_trips,
  calladdFeedback,
  callFlushMessage,
  callGetFeedback,
  isLoadErr,
  callGetReasonApi,
  feedbackMess,
  total_trips,
  callCorporateAccountApi,
  corporateAccount,
  callFushLogs,
}) => {
  const [current, setCurrent] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [isInfoDialog, setIsInfoDialog] = useState(false);
  const [isFeedbackDialog, setIsFeedbackDialog] = useState(false);
  const [total, changeTotal] = useState(0);
  const [pagination, changePagination] = useState({
    total: 0,
    recordsPerPage: null,
    pageIndex: 0,
    currentPage: 1,
  });
  const [accountId, setAccountId] = useState('');
  const [search, setSearch] = useState('');
  const [date, setDates] = useState({
    start_date: '',
    end_date: '',
  });

  const classes = useStyles();

  useEffect(() => {
    if (strictValidArrayWithLength(corporateAccount)) {
      // eslint-disable-next-line array-callback-return
      corporateAccount.map((a) => {
        setAccountId(a.account_id);
      });
    }
  }, [corporateAccount]);

  useEffect(() => {
    if (pagination.recordsPerPage !== null) {
      callAllTrip({
        ...date,
        limit: pagination.recordsPerPage,
        skip: pagination.pageIndex * pagination.recordsPerPage,
        search: search,
        type: 'completed-trip',
        device_type: 'web',
      });
    }
  }, [pagination.recordsPerPage, pagination.pageIndex]);

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
      callAllTrip({
        ...date,
        search: search,
        limit: pagination.recordsPerPage,
        skip: pagination.pageIndex * pagination.recordsPerPage,
        type: 'completed-trip',
        device_type: 'web',
      });
      changePagination({
        ...pagination,
        recordsPerPage: pagination.recordsPerPage,
        pageIndex: pagination.pageIndex,
      });
    }
  };
  useEffect(async () => {
    await callCorporateAccountApi();
  }, []);
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
      type: 'completed-trip',
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
      type: 'completed-trip',
      device_type: 'web',
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
      type: 'completed-trip',
      device_type: 'web',
    });
  };

  useEffect(() => {
    changeTotal(total_trips);
    changePagination((prevState) => ({
      ...prevState,
      total: total_trips,
    }));
  }, [total_trips, all_trips]);

  const searchQueryFilter = (e) => {
    callAllTrip({
      ...date,
      limit: pagination.recordsPerPage,
      skip: 0,
      search: e,
      type: 'completed-trip',
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
      type: 'completed-trip',
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

  return (
    <>
      <Grid>
        <ReactTable
          showExport
          loading={isLoad}
          serverSidePagination={true}
          setRecordsPerPage={setRecordsPerPage}
          headerFilter={false}
          isDateFilter
          DateFilterCss={true}
          filterButton={false}
          onFilter={(dates) => {
            callAllTrip({
              ...dates,
              limit: pagination.recordsPerPage,
              skip: 0,
              search: search,
              type: 'completed-trip',
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
              type: 'completed-trip',
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
          serverSideFilter={(e) => searchQueryFilter(e)}
          recordsPerPage={pagination.recordsPerPage}
          pageNumber={pagination.pageIndex}
          clearFilterButton={() => {
            clearQueryFilter('');
          }}
          downloadBtnBody={{
            name: 'completed-tripAcc',
            start_date: date.start_date,
            end_date: date.end_date,
            search: search,
            account_id: strictValidNumber(accountId) && accountId,
            account_field: 'false',
          }}
          isLoadInner={isLoadInner}
          excelName="Completed Trips"
          customText={'You do not have any configured Trips'}
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
                    {formatDateTime(props.row.original.estimated_end_time) ===
                    'N/A'
                      ? formatDate(props.row.original.pick_up_date_time)
                      : formatDateTime(props.row.original.pick_up_date_time)}
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
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  transportStatus(originalRow.invoice_status)
                );
              },
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
                    {props.row.original.trip_pickup_location}
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
                    {props.row.original.trip_dropoff_location}
                  </Typography>
                </MDTooltip>
              ),
            },
            {
              Header: 'Transport Mode',
              accessor: 'capability_name',
              width: 220,
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
              accessor: (originalRow, rowIndex) => {
                return strictValidObjectWithKeys(originalRow) &&
                  strictValidString(originalRow.capability_clarification)
                  ? originalRow.capability_clarification
                  : 'N/A';
              },
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
                <MDTooltip title={props.row.original.base_patient.description}>
                  <Typography height={55}>
                    {strictValidString(
                      props.row.original.base_patient.description,
                    )
                      ? props.row.original.base_patient.description
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
              Header: 'Action',
              accessor: '',
              Filter: false,
              width: 60,
              Cell: (props) => {
                const field = props.row.original;
                return (
                  <>
                    <EditableButton
                      deleteButtonShow={false}
                      infoButton={true}
                      editButtonShow={false}
                      cancelIcon
                      editButtonDisabled={true}
                      editIconTitle="Edit is Disabled"
                      editButtonClicked={() => {
                        setValue('2');
                        setData(field);
                      }}
                      infoIconColor={field.feedback ? 'red' : '#1C2A39'}
                      infoButtonClick={() => {
                        infoToggle();
                        const data = {
                          leg_id: field.leg_id,
                        };
                        callGetFeedback(data);
                        callGetReasonApi(data);
                        setCurrent({ ...field, completed: true });
                        callFushLogs();
                      }}
                    />
                  </>
                );
              },
            },
          ]}
          total={total}
          rowData={all_trips}
          changePageSize={changePageSize}
          changePageIndex={changePageIndex}
        />
      </Grid>
      {infoDialog()}
      {feedbackDialog()}
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
    message: state.account_trip.message,
    isLoad: state.account_trip.isLoad,
    loadErr: state.account_trip.loadErr,
    all_trips: state.account_trip.completed,
    isLoadInner: state.account_trip.isLoadInner,
    userprofile: state.auth.user,
    isLoadErr: state.trip.addFeedback.isLoad,
    feedbackMess: state.trip.addFeedback.message,
    total_trips: state.account_trip.total_trips_completed,
    corporateAccount: state.account_trip.all_corporates,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callAllTrip: (...params) => dispatch(getCompletedTrip(...params)),
  calladdFeedback: (...params) => dispatch(submitFeedback(...params)),
  callFlushMessage: (...params) => dispatch(flushMessage(...params)),
  callGetFeedback: (...params) => dispatch(getUserFeedback(...params)),
  callGetReasonApi: (...params) => dispatch(getReasons(...params)),
  callCorporateAccountApi: (...params) =>
    dispatch(getCorporateAccount(...params)),
  callFushLogs: (...params) => dispatch(flushLogs(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(CompletedTrips);

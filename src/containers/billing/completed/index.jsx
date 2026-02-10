/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  Typography,
} from '@mui/material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  formatDate,
  formatDateTime,
  strictValidArrayWithLength,
  strictValidNumber,
  strictValidObjectWithKeys,
  validObjectWithParameterKeys,
} from '../../../utils/common-utils';
import ReactTable from '../../../components/react-table';
import { deleteInvoice, flushLog, getCompletedTripInvoicing } from '../action';
import CellMapTypes from '../../../components/react-table/components/renderMapTypes';
import {
  SelectColumnFilter,
  DateFilter,
  PhoneFilters,
} from '../../../components/react-table/helper';
import { formatPhoneNumber } from '../../../utils/regexs';
import { getCorporateAccount, tripIegId } from '../../trip-management/action';
import _ from 'lodash';
import Dialog from '../../../components/dialog';
import { transportStatus } from '../../../utils/constant';
import store from 'store2';
import { buttonRoleAccess } from '../../../utils/traits';
import MDTooltip from '../../../components/tooltip';
import { billingExportConstants } from '../constants';
import EditTripInBilling from '../edit-trip';
import EditableButton from '../../../components/react-table/components/editable-button';
import TripInfoBilling from '../../billing/trip-info/index';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  buttonForceAction: {
    width: 170,
    textTransform: 'capitalize',
  },
}));

const CompletedTrips = ({
  isLoad,
  isLoadInner,
  message,
  setData,
  setTripData,
  callInvoicingApi,
  callCorporateAccountApi,
  data,
  corporateAccountFromState,
  callDeleteInvoiceApi,
  totalRecords,
  callTripIegId,
  callTripLogFlush,
}) => {
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const userValue = store.get('user') || {};
  const [total, changeTotal] = useState(0);
  const [current, setCurrent] = useState({});
  const [pagination, changePagination] = useState({
    total: total,
    recordsPerPage: null,
    pageIndex: 0,
    currentPage: 1,
  });
  const [search, setSearch] = useState('');
  const [isEditDialog, setisEditDialog] = useState(false);
  const [currentTrip, setCurrentTrip] = useState({});
  const [isInfoDialog, setIsInfoDialog] = useState(false);
  const [date, setDates] = useState({
    start_date: '',
    end_date: '',
  });
  const classes = useStyles();
  useEffect(() => {
    callCorporateAccountApi();
  }, []);

  useEffect(() => {
    filterValues();
  }, []);
  useEffect(() => {
    changeTotal(totalRecords);
  }, [totalRecords]);
  // const removeInvoiceBilling = async (id) => {
  //   const data = {
  //     trip_id: id,
  //   };
  //   const res = await callDeleteInvoiceApi(data);
  //   if (res) {
  //     deleteToggle();
  //     apiCall();
  //   }
  // };
  const setRecordsPerPage = (size) => {
    changePagination({
      ...pagination,
      recordsPerPage: size,
    });
    callInvoicingApi({
      payload: {
        limit: size,
        skip: pagination.pageIndex * size,
        search: search,
      },
      state: {
        ...date,
      },
    });
  };

  const changePageSize = (pageSize) => {
    changePagination({
      ...pagination,
      recordsPerPage: pageSize,
      pageIndex: 0,
    });
    callInvoicingApi({
      payload: {
        limit: pageSize,
        skip: 0,
        search: search,
      },
      state: {
        ...date,
      },
    });
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
          <TripInfoBilling data={current} />
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: 'center', display: 'flex', mt: 2 }}
        >
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

  const changePageIndex = (pageIndex) => {
    changePagination({
      ...pagination,
      pageIndex: pageIndex,
    });
    callInvoicingApi({
      payload: {
        limit: pagination.recordsPerPage,
        skip: pageIndex * pagination.recordsPerPage,
        search: search,
      },
      state: {
        ...date,
      },
    });
  };
  const deleteToggle = () => {
    setIsDeleteDialog(!isDeleteDialog);
  };
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
      buttonRoleAccess('completedTripEditButton', userValue.role_id)
        ? true
        : false;
    if (buttonRoleAccess('completedTripEditButtonBilling', userValue.role_id)) {
      if (['none', 'in_progress', 'dispute_accepted'].includes(disabledValue)) {
        disabledVal = false;
      }
    }
    return disabledVal;
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
            ? `Edit Trip ${currentTrip?.leg_id}`
            : 'Loading...'
        }
        handleClose={() => {
          editToggle();
        }}
      >
        <DialogContent>
          {strictValidObjectWithKeys(currentTrip) ? (
            <EditTripInBilling
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
            Do you want to cancelled the Invoice Billing ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="outlined"
            onClick={() => deleteToggle()}
          >
            No
          </Button>
          <Button
            color="primary"
            variant="outlined"
            // onClick={() => removeInvoiceBilling(current.trip_id)}
          >
            {isLoad ? (
              <CircularProgress size={20} color="primary" />
            ) : (
              'Yes, Do It'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const filterValues = async () => {
    if (strictValidNumber(pagination.recordsPerPage)) {
      const res = await callInvoicingApi({
        payload: {
          limit: pagination.recordsPerPage,
          skip: pagination.pageIndex * pagination.recordsPerPage,
        },
        state: {
          ...date,
        },
      });
      if (strictValidArrayWithLength(res)) {
        // setData(state);
      } else {
        setData({});
      }
    }
  };

  const callApi = (text) => {
    callInvoicingApi({
      payload: {
        limit: pagination.recordsPerPage,
        skip: 0,
        search: text,
      },
      state: {
        ...date,
      },
    });
    changePagination({
      ...pagination,
      recordsPerPage: pagination.recordsPerPage,
      pageIndex: 0,
    });
    setSearch(text);
  };

  const searchQueryFilter = (text) => {
    callInvoicingApi({
      payload: {
        limit: pagination.recordsPerPage,
        skip: 0,
        search: text,
      },
      state: {
        ...date,
      },
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
          loading={isLoad}
          isLoadInner={isLoadInner}
          showExport
          excelName="Completed Trips"
          recordsPerPage={pagination.recordsPerPage}
          setRecordsPerPage={setRecordsPerPage}
          pageNumber={pagination.pageIndex}
          headerFilter={false}
          isDateFilter
          DateFilterCss={true}
          filterButton={false}
          onFilter={(dates) => {
            callInvoicingApi({
              payload: {
                limit: pagination.recordsPerPage,
                skip: 0,
                search: search,
              },
              state: {
                ...dates,
              },
            });
            setDates(dates);
          }}
          onClearFilter={() => {
            callInvoicingApi({
              payload: {
                limit: pagination.recordsPerPage,
                skip: 0,
                search: search,
              },
            });
            setDates({
              start_date: null,
              end_date: null,
            });
          }}
          changePageSize={changePageSize}
          downloadBtnBody={{
            name: billingExportConstants.CompletedInvoicing,
            start_date: date.start_date,
            end_date: date.end_date,
            search: search,
            account_field: 'true',
          }}
          changePageIndex={changePageIndex}
          serverSideFilter={(e) => searchQueryFilter(e)}
          serverSidePagination={true}
          clearFilterButton={() => {
            callApi('');
          }}
          total={totalRecords}
          customText={'You do not have any configured Trips'}
          columnDefs={[
            {
              Header: 'Pick-up Time',
              accessor: (original, rowIndex) => {
                return formatDateTime(original.pick_up_date_time);
              },
              Filter: DateFilter,
              width: 140,
              Cell: (props) => (
                <>
                  <Typography>
                    {formatDateTime(props.row.original.estimated_end_time) ===
                      'N/A' &&
                    (props.row.original.status === 'completed' ||
                      props.row.original.type === 'will_call')
                      ? formatDate(props.row.original.pick_up_date_time)
                      : formatDateTime(props.row.original.pick_up_date_time)}
                    {/* {formatDateTime(props.row.original.pick_up_date_time)} */}
                  </Typography>
                </>
              ),
            },
            {
              Header: 'ETA Drop-off',
              accessor: (original, pp) => {
                return formatDateTime(original.estimated_end_time);
              },
              Filter: DateFilter,
              width: 140,
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
              width: 120,
            },
            {
              Header: 'Status',
              Filter: SelectColumnFilter,
              width: 140,
              accessor: (original, rowIndex) => {
                return transportStatus(original.status);
              },
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
              Header: 'PT Phone Number',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  strictValidObjectWithKeys(originalRow.base_patient) &&
                  originalRow.base_patient.phone
                );
              },
              id: 'base_patient',
              Filter: PhoneFilters,
              width: 170,
              disableSortBy: true,
              Cell: (props) => (
                <Typography>
                  {formatPhoneNumber(props.row.original.base_patient.phone)}
                </Typography>
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
              Header: 'Account Contact',
              accessor: (originalRow, rowIndex) => {
                let output = [];
                _.map(originalRow.company_contact, (res) => {
                  output.push(`${res.last_name}, ${res.first_name}`);
                });
                return output.join(', ');
              },
              id: 'name',
              width: 140,
              disableSortBy: true,
              Cell: (props) => (
                <>
                  <CellMapTypes
                    type="company_contact"
                    renderValue="first_name"
                    data={props.row.original.company_contact}
                  />
                </>
              ),
            },
            {
              Header: 'C. Phone Number',
              accessor: (originalRow, rowIndex) => {
                let output = [];
                _.map(originalRow.company_contact, (res) => {
                  output.push(res.phone_number);
                });
                return output.join(', ');
              },
              width: 160,
              disableSortBy: true,
              Filter: PhoneFilters,
              id: 'company_phone',
              Cell: (props) => (
                <>
                  <CellMapTypes
                    type="corporate_contact_phone"
                    renderValue="phone_number"
                    renderType="phone"
                    data={props.row.original.company_contact}
                  />
                </>
              ),
            },
            {
              Header: 'Actions',
              accessor: '',
              Filter: false,
              width: 80,
              Cell: (props) => {
                return (
                  <>
                    <EditableButton
                      infoButton={true}
                      deleteButtonShow={false}
                      editButtonDisabled={disabledEditButton(
                        props.row.original.invoice_status,
                      )}
                      editButtonClicked={async () => {
                        //
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
                      }}
                      infoIconColor={
                        props.row.original.feedback ? 'red' : '#1C2A39'
                      }
                      infoButtonClick={() => {
                        const field = props.row.original;
                        infoToggle();
                        setCurrent(field);
                        callTripLogFlush();
                      }}
                    ></EditableButton>
                    {/* <Tooltip
                      title={
                        disabledEditButton(props.row.original.invoice_status)
                          ? 'Edit is Disabled'
                          : 'Edit'
                      }
                      disableInteractive
                    >
                      <span>
                        <IconButton
                          disabled={disabledEditButton(
                            props.row.original.invoice_status,
                          )}
                          onClick={async () => {
                            // const field = props.row.original;
                            // setTripData(field);
                            // setValue('10');
                            editToggle();
                            const res = await callTripIegId(
                              props.row.original.leg_id,
                            );

                            if (res) {
                              setCurrentTrip(res);
                            }
                          }}
                        >
                          {disabledEditButton(
                            props.row.original.invoice_status,
                          ) ? (
                            <DisableEditIcon />
                          ) : (
                            <EditIcon />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Canceled" disableInteractive>
                      <IconButton
                        onClick={() => {
                          const field = props.row.original;
                          deleteToggle();
                          // setCurrent(field);
                        }}
                        variant="transparent"
                      >
                        <InfoOutlinedIcon />
                      </IconButton>
                    </Tooltip> */}
                  </>
                );
              },
            },
          ]}
          rowData={Array.isArray(data) ? data : []}
        />
      </Grid>
      {deleteDialog()}
      {editDialog()}
      {infoDialog()}
    </>
  );
};

CompletedTrips.propTypes = {
  callInvoicingApi: PropTypes.func,
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
    message: state.billing.completedInvoice.message,
    isLoad: state.billing.completedInvoice.isLoad,
    loadErr: state.billing.completedInvoice.loadErr,
    data: state.billing.completedInvoice.completed_invoice,
    isLoadInner: state.billing.completedInvoice.isLoadInner,
    totalRecords: state.billing.completedInvoice.totalRecords,
    corporateAccountFromState: state.trip.allTrips.all_corporates,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callInvoicingApi: (...params) =>
    dispatch(getCompletedTripInvoicing(...params)),
  callDeleteInvoiceApi: (...params) => dispatch(deleteInvoice(...params)),
  callCorporateAccountApi: (...params) =>
    dispatch(getCorporateAccount(...params)),
  callTripIegId: (...params) => dispatch(tripIegId(...params)),
  callTripLogFlush: (...params) => dispatch(flushLog(...params)),
});
export default connect(mapStateProps, mapDispatchToProps)(CompletedTrips);

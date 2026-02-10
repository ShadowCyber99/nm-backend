/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  formatDate,
  formatDateTime,
  limitWords,
  strictValidArrayWithKey,
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
  validObjectWithParameterKeys,
} from '../../../utils/common-utils';
import ReactTable from '../../../components/react-table';
import {
  flushMessage,
  getArchivedTrips,
  getCompletedTripByFilter,
  getFiltersArchived,
  saveFiltersArchived,
} from '../action';
import {
  DateFilter,
  CapabilityFilters,
  SelectColumnFilter,
} from '../../../components/react-table/helper';
import CellTypes from '../../../components/react-table/components/renderTypes';
import MDTooltip from '../../../components/tooltip';
import { transportStatus } from '../../../utils/constant';
import { SocketContext } from '../../../hooks/useSocketContext';

const ArchivedTrips = ({
  isLoad,
  isLoadInner,
  total_trips,
  callAllTrip,
  all_trips,
  userprofile,
  callFlushMessage,
  callSaveFilter,
  callGetFilter,
  callCompletedTrips,
}) => {
  const [total, changeTotal] = useState(0);
  const [pagination, changePagination] = useState({
    total: 0,
    recordsPerPage: null,
    pageIndex: 0,
    currentPage: 1,
  });
  const [refreshing, setRefreshing] = useState(false);
  const socket = useContext(SocketContext);
  const [search, setSearch] = useState('');
  const [date, setDates] = useState({
    start_date: '',
    end_date: '',
  });

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
          ]}
          total={total}
          rowData={Array.isArray(all_trips) ? all_trips : []}
          changePageSize={changePageSize}
          changePageIndex={changePageIndex}
        />
      </Grid>
    </>
  );
};

ArchivedTrips.propTypes = {
  callAllTrip: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

ArchivedTrips.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.trip.archivedTrips.message,
    isLoad: state.trip.archivedTrips.isLoad,
    loadErr: state.trip.archivedTrips.loadErr,
    all_trips: state.trip.archivedTrips.archived_trips,
    total_trips: state.trip.archivedTrips.total_trips,
    isLoadInner: state.trip.archivedTrips.isLoadInner,
    userprofile: state.auth.user,
    isLoadErr: state.trip.addFeedback.isLoad,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callAllTrip: (...params) => dispatch(getArchivedTrips(...params)),
  callFlushMessage: (...params) => dispatch(flushMessage(...params)),
  callSaveFilter: (...params) => dispatch(saveFiltersArchived(...params)),
  callGetFilter: (...params) => dispatch(getFiltersArchived(...params)),
  callCompletedTrips: (...params) =>
    dispatch(getCompletedTripByFilter(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(ArchivedTrips);

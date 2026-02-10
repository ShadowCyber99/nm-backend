/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import ReactTable from '../../components/react-table';
import { connect } from 'react-redux';
import {
  formatDate,
  formatDateTime,
  strictValidObjectWithKeys,
} from '../../utils/common-utils';
import CellTypes from '../../components/react-table/components/renderTypes';
import { useFullScreenHandle } from 'react-full-screen';
import { getTransportAccount } from '../transport-management/action';
import { getActiveCapabilityRoles } from '../vehicle-management/action';
import PropTypes from 'prop-types';
import { transportStatus } from '../../utils/constant';

const TransportStatusBoard = ({
  data,
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
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const handle = useFullScreenHandle();

  useEffect(() => {
    const intervalId = setInterval(() => {
      callAllTransportApi();
      setRefreshing(true);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    callAllTransportApi();
    callCapabilityRolesApi();
  }, []);

  return (
    <ReactTable
      fontSizeLg={true}
      loading={!refreshing && isLoad}
      isLoadInner={isLoadInner}
      globalFilterShow={false}
      pagination={handle.active ? false : true}
      customText={"You don't have any configured Transport Status"}
      headerFilter={false}
      columnDefs={[
        {
          Header: 'PU Time',
          accessor: 'pick_up_date_time',
          width: 85,
          increase: true,
          Cell: (props) => (
            <Stack>
              <Typography variant="h5">
                {formatDateTime(
                  props.row.original.base_trip.estimated_end_time,
                ) === 'N/A'
                  ? formatDate(props.row.original.base_trip.pick_up_date_time)
                  : formatDateTime(
                      props.row.original.base_trip.pick_up_date_time,
                    )}
              </Typography>
            </Stack>
          ),
        },
        {
          Header: 'Trip ID',
          accessor: 'leg_id',
          increase: true,
          width: 75,
          disableSortBy: true,
          Cell: (props) => (
            <Stack>
              <Typography variant="h5">
                {transportStatus(props.row.original.leg_id)}
              </Typography>
            </Stack>
          ),
        },
        {
          Header: 'Status',
          accessor: 'status',
          increase: true,
          width: 70,
          disableSortBy: true,
          Cell: (props) => (
            <Stack>
              <Typography variant="h5">
                {transportStatus(props.row.original.status)}
              </Typography>
            </Stack>
          ),
        },
        {
          Header: 'ETA DO',
          accessor: 'estimated_end_time',
          increase: true,
          width: 85,
          Cell: (props) => (
            <Stack>
              <Typography variant="h5">
                {formatDateTime(
                  props.row.original.base_trip.estimated_end_time,
                )}
              </Typography>
            </Stack>
          ),
        },
        {
          Header: 'PU Location',
          accessor: 'trip_pickup_location',
          increase: true,
          disableSortBy: true,
          width: 190,
          Cell: (props) => (
            <Stack>
              <Typography variant="h5">
                {transportStatus(
                  props.row.original.base_trip.trip_pickup_location,
                )}
              </Typography>
            </Stack>
          ),
        },
        {
          Header: 'DO Location',
          accessor: 'trip_dropoff_location',
          increase: true,
          disableSortBy: true,
          width: 190,
          Cell: (props) => (
            <Stack>
              <Typography variant="h5">
                {transportStatus(
                  props.row.original.base_trip.trip_dropoff_location,
                )}
              </Typography>
            </Stack>
          ),
        },
        {
          Header: 'Transport Mode',
          increase: true,
          accessor: 'capability_id',
          disableSortBy: true,
          width: 130,
          Cell: (props) => (
            <>
              <CellTypes
                larger={true}
                type="capability_role"
                value={props.row.original.capability_id}
              />
            </>
          ),
        },
        {
          Header: 'Account',
          accessor: 'corporate_account',
          increase: true,
          width: 190,
          disableSortBy: true,
          Cell: (props) => (
            <Stack>
              <Typography variant="h5">
                {transportStatus(props.row.original.corporate_account.name)}
              </Typography>
            </Stack>
          ),
        },
        {
          Header: 'Unit',
          increase: true,
          accessor: (originalRow, rowIndex) => {
            return (
              strictValidObjectWithKeys(originalRow) &&
              strictValidObjectWithKeys(originalRow.base_vehicle) &&
              strictValidObjectWithKeys(originalRow.base_unit) &&
              `${originalRow.base_vehicle.vehicle_code} / ${originalRow.base_unit.driver_name} / ${originalRow.base_unit.attendant_name}`
            );
          },
          width: 120,
          disableSortBy: true,
          Cell: (props) => (
            <Stack>
              <Typography
                variant="h5"
                sx={{
                  textTransform: 'capitalize',
                }}
              >
                {transportStatus(
                  strictValidObjectWithKeys(props.row.original.base_vehicle) &&
                    strictValidObjectWithKeys(props.row.original.base_unit) &&
                    `${props.row.original.base_vehicle.vehicle_code} / ${props.row.original.base_unit.driver_name} / ${props.row.original.base_unit.attendant_name}`,
                )}
              </Typography>
            </Stack>
          ),
        },
      ]}
      rowData={transport}
    />
  );
};
TransportStatusBoard.propTypes = {
  callAllTransportApi: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

TransportStatusBoard.defaultProps = {
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
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callAllTransportApi: (...params) => dispatch(getTransportAccount(...params)),
  callCapabilityRolesApi: (...params) =>
    dispatch(getActiveCapabilityRoles(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(TransportStatusBoard);

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { CssBaseline, Grid, Stack, Typography } from '@mui/material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  formatDateTime,
  strictValidObjectWithKeys,
} from '../../../utils/common-utils';
import ReactTable from '../../../components/react-table';
import { deleteUnit, getDataByFilters } from '../action';
import MDTooltip from '../../../components/tooltip';
import { transportStatus } from '../../../utils/constant';
import EditableButton from '../../../components/react-table/components/editable-button';

const SuperAdminTransport = ({
  setValue,
  isLoad,
  isLoadInner,
  message,
  setData,
  callAllFilterApi,
  callDeleteUnitApi,
  transport,
}) => {
  useEffect(() => {
    const data = {
      page: 'transport',
    };
    callAllFilterApi(data);
  }, []);

  return (
    <>
      <Grid>
        <CssBaseline />
        <ReactTable
          loading={isLoad}
          isLoadInner={isLoadInner}
          customText={'You do not have any configured Transports'}
          columnDefs={[
            {
              Header: 'Id',
              accessor: '',
              width: 80,
              Cell: (props) => (
                <Stack>
                  <Typography>{props.row.original.id}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Unit Id',
              accessor: 'unit_id',
              width: 80,
              Cell: (props) => (
                <Stack>
                  <Typography>{props.row.original.unit_id}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Trip Id',
              accessor: 'trip_id',
              width: 80,
              Cell: (props) => (
                <Stack>
                  <Typography>{props.row.original.trip_id}</Typography>
                </Stack>
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
              width: 120,
              Cell: (props) => (
                <Stack>
                  <Typography>
                    {transportStatus(props.row.original.status)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Reason',
              accessor: 'reason',
              Cell: (props) => (
                <MDTooltip title={props.row.original.reason}>
                  <Typography height={55}>
                    {props.row.original.reason
                      ? props.row.original.reason
                      : 'N/A'}
                  </Typography>
                </MDTooltip>
              ),
            },
            {
              Header: 'Dispatch Requested',
              accessor: 'dispatch_requested',
              width: 140,
              disableSortBy: true,
              Cell: (props) => (
                <Stack>
                  <Typography>
                    {formatDateTime(props.row.original.dispatch_requested)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Accepted',
              accessor: 'accepted',
              width: 140,
              disableSortBy: true,
              Cell: (props) => (
                <Stack>
                  <Typography>
                    {formatDateTime(props.row.original.accepted)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'En Route',
              accessor: 'en_route',
              width: 140,
              disableSortBy: true,
              Cell: (props) => (
                <Stack>
                  <Typography>
                    {formatDateTime(props.row.original.en_route)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Arrived at PU',
              accessor: 'arrived_at_pick_up',
              width: 140,
              disableSortBy: true,
              Cell: (props) => (
                <Stack>
                  <Typography>
                    {formatDateTime(props.row.original.en_route)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'In Progress',
              accessor: 'inprogress',
              width: 140,
              disableSortBy: true,
              Cell: (props) => (
                <Stack>
                  <Typography>{props.row.original.inprogress}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Arrived at DO',
              accessor: 'arrived_at_drop_off',
              width: 140,
              disableSortBy: true,
              Cell: (props) => (
                <Stack>
                  <Typography>
                    {formatDateTime(props.row.original.arrived_at_drop_off)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Completed Time',
              accessor: 'completed_time',
              width: 140,
              disableSortBy: true,
              Cell: (props) => (
                <Stack>
                  <Typography>
                    {formatDateTime(props.row.original.completed_time)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Created On',
              accessor: 'created_on',
              width: 140,
              disableSortBy: true,
              Cell: (props) => (
                <Stack>
                  <Typography>{props.row.original.created_on}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Actions',
              accessor: 'Actions',
              width: 140,
              Filter: false,

              disableSortBy: false,
              Cell: (props) => (
                <>
                  <EditableButton
                    hideDeleteButton={true}
                    PowerButton={false}
                    showDisabledPowerButton={false}
                    deleteButtonShow={false}
                    editButtonClicked={() => {
                      setData(props.row.original);
                    }}
                  />
                </>
              ),
            },
          ]}
          rowData={Array.isArray(transport) ? transport : []}
        />
      </Grid>
    </>
  );
};

SuperAdminTransport.propTypes = {
  callAllFilterApi: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

SuperAdminTransport.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.admin.message,
    isLoad: state.admin.isLoad,
    loadErr: state.admin.loadErr,
    transport: state.admin.units,
    userprofile: state.auth.user,
    isLoadInner: state.admin.isLoadInner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callAllFilterApi: (...params) => dispatch(getDataByFilters(...params)),
  callDeleteUnitApi: (...params) => dispatch(deleteUnit(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(SuperAdminTransport);

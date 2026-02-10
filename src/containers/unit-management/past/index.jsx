/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { CssBaseline, Grid, Stack, Typography } from '@mui/material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  formatDateTime,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/common-utils';
import ReactTable from '../../../components/react-table';
import { getPastUnits, deleteUnit } from '../action';
import {
  DateFilter,
  CapabilityFilters,
  SelectColumnFilter,
} from '../../../components/react-table/helper';
import CellTypes from '../../../components/react-table/components/renderTypes';
import MDTooltip from '../../../components/tooltip';

const PastUnit = ({
  setValue,
  isLoad,
  isLoadInner,
  message,
  setData,
  callAllUnitsApi,
  callDeleteUnitApi,
  units,
}) => {
  useEffect(() => {
    callAllUnitsApi();
  }, []);

  const renderStatus = (type) => {
    switch (type) {
      case 'inactivate':
        return 'Inactive';
      default:
        return type;
    }
  };
  return (
    <>
      <Grid>
        <CssBaseline />
        <ReactTable
          loading={isLoad}
          isLoadInner={isLoadInner}
          customText={'You do not have any configured Past Units'}
          columnDefs={[
            {
              Header: 'Driver',
              accessor: 'driver_name',
              Cell: (props) => (
                <Stack my={1}>
                  <Typography>{props.row.original.driver_name}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Attendant',
              accessor: 'attendant_name',
              Cell: (props) => (
                <Stack my={1}>
                  <Typography>{props.row.original.attendant_name}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Shift Start',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  formatDateTime(originalRow.start_time)
                );
              },
              Filter: DateFilter,
              Cell: (props) => (
                <Stack my={1}>
                  <Typography>
                    {formatDateTime(props.row.original.start_time)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Shift End',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  formatDateTime(originalRow.end_time)
                );
              },
              Filter: DateFilter,
              Cell: (props) => (
                <Stack my={1}>
                  <Typography>
                    {formatDateTime(props.row.original.end_time)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Vehicle Code',
              accessor: 'vehicle_code',
              Cell: (props) => (
                <Stack my={1}>
                  <Typography>{props.row.original.vehicle_code}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Capability',
              accessor: 'capability_id',
              width: 250,
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
              Header: 'Reject Reason',
              accessor: 'reason',
              width: 300,
              disableSortBy: true,
              Cell: (props) => (
                <MDTooltip title={props.row.original.reason}>
                  <Stack my={1}>
                    <Typography height={55}>
                      {strictValidString(props.row.original.reason)
                        ? props.row.original.reason
                        : 'N/A'}
                    </Typography>
                  </Stack>
                </MDTooltip>
              ),
            },
            {
              Header: 'Status',
              // accessor: 'status',
              width: 120,
              disableSortBy: true,
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  renderStatus(originalRow.status)
                );
              },
              Filter: SelectColumnFilter,
              Cell: (props) => (
                <Stack my={1}>
                  <Typography
                    sx={{
                      textTransform: 'capitalize',
                    }}
                  >
                    {renderStatus(props.row.original.status)}
                  </Typography>
                </Stack>
              ),
            },
          ]}
          rowData={Array.isArray(units) ? units : []}
        />
      </Grid>
    </>
  );
};

PastUnit.propTypes = {
  callAllUnitsApi: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

PastUnit.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.unit.message,
    isLoad: state.unit.isLoad,
    loadErr: state.unit.loadErr,
    units: state.unit.pastUnits,
    isLoadInner: state.unit.isLoadPastInner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callAllUnitsApi: (...params) => dispatch(getPastUnits(...params)),
  callDeleteUnitApi: (...params) => dispatch(deleteUnit(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(PastUnit);

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  CssBaseline,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dialog from '../../../components/dialog';
import {
  strictValidObjectWithKeys,
  strictValidArrayWithKey,
  formatDateTime,
} from '../../../utils/common-utils';
import ReactTable from '../../../components/react-table';
import { getAllUnits, deleteUnit, changeUnitStatus } from '../action';
import EditableButton from '../../../components/react-table/components/editable-button';
import CellTypes from '../../../components/react-table/components/renderTypes';
import {
  CapabilityFilters,
  DateFilter,
  SelectColumnFilter,
} from '../../../components/react-table/helper';
import { useSnackbar } from 'notistack';
import { getActiveCapabilityRoles } from '../../drivers-management/action';
import { SocketContext } from '../../../hooks/useSocketContext';

const CurrentUnit = ({
  setValue,
  isLoad,
  isLoadInner,
  message,
  setData,
  callAllUnitsApi,
  callUnitStatus,
  callDeleteUnitApi,
  userprofile,
  units,
  loadErr,
  callCapabilityRolesApi,
}) => {
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [inActiveDialog, setInActiveDialog] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [clearFilters, setClearFilters] = useState(false);
  const [tableSize, setTableSize] = useState(false);
  const socket = useContext(SocketContext);

  const [current, setCurrent] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    callAllUnitsApi();
    callCapabilityRolesApi();
  }, []);

  useEffect(() => {
    socket.on('unit_status', (callback) => {
      if (
        strictValidObjectWithKeys(userprofile) &&
        strictValidArrayWithKey([5, 3, 1, 2, 8], userprofile.role_id)
      ) {
        setRefreshing(true);
        callAllUnitsApi();
        callCapabilityRolesApi();
        setClearFilters(true);
        setTableSize(true);
      }
    });
    return () => {
      socket.off('unit_status');
    };
  }, []);

  const deleteTripFun = async (val) => {
    const result = await callDeleteUnitApi(val);
    if (result) {
      // callAllUnitsApi();
      deleteToggle();
      socket.emit('unit_action', { unit_id: val });
    }
  };

  const unitChangeStatus = async (unit_id) => {
    const res = await callUnitStatus({
      unit_id: unit_id,
      values: {
        status: 'inactivate',
      },
    });
    if (res) {
      callAllUnitsApi();
      inActiveToggle();
      socket.emit('unit_action', { unit_id: unit_id });
    }
  };

  const deleteToggle = () => {
    setIsDeleteDialog(!isDeleteDialog);
  };
  const inActiveToggle = () => {
    setInActiveDialog(!inActiveDialog);
  };

  useEffect(() => {
    if (loadErr)
      enqueueSnackbar(loadErr, {
        variant: 'error',
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
  }, [loadErr]);

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
            Do you want to delete this unit from the list ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => deleteToggle()}
          >
            No
          </Button>
          <Button
            color="error"
            variant="outlined"
            onClick={() => deleteTripFun(current.unit_id)}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const activeDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        isOpen={inActiveDialog}
        title={'Are you sure ?'}
        handleClose={() => {
          inActiveToggle();
        }}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Do you want to inactivate this unit from the list ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => inActiveToggle()}
          >
            No
          </Button>
          <Button
            color="error"
            variant="outlined"
            onClick={() => unitChangeStatus(current.unit_id)}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      <CssBaseline />
      <Grid>
        <ReactTable
          tableSize={tableSize}
          setClearFilters={() => setClearFilters(false)}
          clearFilters={clearFilters}
          loading={!refreshing && isLoad}
          isLoadInner={isLoadInner}
          customText={'You do not have any configured Units'}
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
              width: 160,
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
              width: 160,
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
              width: 130,
              Cell: (props) => (
                <Stack my={1}>
                  <Typography>{props.row.original.vehicle_code}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Capability',
              accessor: 'capability_id',
              width: 300,
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
              Header: 'Status',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) && originalRow.status
                );
              },
              disableSortBy: true,
              width: 130,
              Filter: SelectColumnFilter,
              Cell: (props) => (
                <Stack my={1}>
                  <Typography
                    sx={{
                      textTransform: 'capitalize',
                    }}
                  >
                    {props.row.original.status}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Actions',
              accessor: '',
              Filter: false,
              disableSortBy: true,
              width: 130,
              Cell: (props) => (
                <>
                  <EditableButton
                    hideDeleteButton={props.row.original.status !== 'planned'}
                    PowerButton={
                      props.row.original.status === 'planned' ? false : true
                    }
                    showDisabledPowerButton={
                      props.row.original.status !== 'planned' ? false : true
                    }
                    powerButtonClicked={() => {
                      const field = props.row.original;
                      setCurrent(field);
                      inActiveToggle();
                    }}
                    editButtonClicked={() => {
                      const field = props.row.original;
                      setValue(3);
                      setData(field);
                    }}
                    deleteButtonClicked={() => {
                      const field = props.row.original;
                      deleteToggle();
                      setCurrent(field);
                    }}
                  />
                </>
              ),
            },
          ]}
          rowData={Array.isArray(units) ? units : []}
        />
      </Grid>
      {deleteDialog()}
      {activeDialog()}
    </>
  );
};

CurrentUnit.propTypes = {
  callAllUnitsApi: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

CurrentUnit.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.unit.message,
    isLoad: state.unit.isLoad,
    loadErr: state.unit.loadErr,
    units: state.unit.units,
    userprofile: state.auth.user,
    isLoadInner: state.unit.isLoadInner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callAllUnitsApi: (...params) => dispatch(getAllUnits(...params)),
  callDeleteUnitApi: (...params) => dispatch(deleteUnit(...params)),
  callUnitStatus: (...params) => dispatch(changeUnitStatus(...params)),
  callCapabilityRolesApi: (...params) =>
    dispatch(getActiveCapabilityRoles(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(CurrentUnit);

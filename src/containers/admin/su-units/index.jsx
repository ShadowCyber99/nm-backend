/* eslint-disable no-unused-vars */
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
  formatDateTime,
  strictValidString,
} from '../../../utils/common-utils';
import ReactTable from '../../../components/react-table';
import { getDataByFilters, deleteUnit, changeUnitStatus } from '../action';
import EditableButton from '../../../components/react-table/components/editable-button';
import CellTypes from '../../../components/react-table/components/renderTypes';
import {
  CapabilityFilters,
  DateFilter,
  SelectColumnFilter,
} from '../../../components/react-table/helper';
import { useSnackbar } from 'notistack';
import { getCapabilityRoles } from '../../drivers-management/action';
import { SocketContext } from '../../../hooks/useSocketContext';

const SuperAdminUnits = ({
  setValue,
  isLoad,
  isLoadInner,
  message,
  setData,
  callAllFilterApi,
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
    const data = {
      page: 'unit',
    };
    callAllFilterApi(data);
    callCapabilityRolesApi();
  }, []);

  const deleteTripFun = async (val) => {
    const result = await callDeleteUnitApi(val);
    if (result) {
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
      // callAllFilterApi();
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
            you want to delete this unit from the list ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => deleteToggle()}>No</Button>
          <Button onClick={() => deleteTripFun(current.unit_id)}>
            Yes, Do It
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
            you want to inactivate this unit from the list ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => inActiveToggle()}>No</Button>
          <Button onClick={() => unitChangeStatus(current.unit_id)}>
            Yes, Do It
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
          // isLoadInner={isLoadInner}
          customText={'You do not have any configured Units'}
          columnDefs={[
            {
              Header: 'Unit Id',
              accessor: 'unit_id',
              width: 80,
              Cell: (props) => (
                <Stack my={1}>
                  <Typography>{props.row.original.unit_id}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Vehicle Id',
              accessor: 'vehicle_id',
              width: 80,
              Cell: (props) => (
                <Stack my={1}>
                  <Typography>{props.row.original.vehicle_id}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Shift Start',
              accessor: 'start_time',
              Filter: DateFilter,
              width: 140,
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
              accessor: 'end_time',
              width: 140,
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
              Header: 'Capability',
              accessor: 'capability_id',
              width: 300,
              disableSortBy: true,
              Filter: CapabilityFilters,
              Cell: (props) => (
                <>
                  {strictValidObjectWithKeys(props.row.original) &&
                    strictValidString(props.row.original.capability_id) &&
                    props.row.original.capability_id && (
                      <CellTypes
                        type="capability_role"
                        value={props.row.original.capability_id}
                      />
                    )}
                </>
              ),
            },
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
              Header: 'Status',
              accessor: 'status',
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
              Header: 'Transport Status',
              accessor: 'transport_status',
              width: 130,
              Cell: (props) => (
                <Stack my={1}>
                  <Typography>{props.row.original.transport_status}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Actions',
              accessor: '',
              Filter: false,
              disableSortBy: true,
              width: 60,
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
          rowData={Array.isArray(units) ? units : []}
        />
        {/* <EditableReactTable /> */}
      </Grid>
      {deleteDialog()}
      {activeDialog()}
    </>
  );
};

SuperAdminUnits.propTypes = {
  callAllFilterApi: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

SuperAdminUnits.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.admin.message,
    isLoad: state.admin.isLoad,
    loadErr: state.admin.loadErr,
    units: state.admin.units,
    userprofile: state.auth.user,
    isLoadInner: state.admin.isLoadInner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callAllFilterApi: (...params) => dispatch(getDataByFilters(...params)),
  callDeleteUnitApi: (...params) => dispatch(deleteUnit(...params)),
  callUnitStatus: (...params) => dispatch(changeUnitStatus(...params)),
  callCapabilityRolesApi: (...params) =>
    dispatch(getCapabilityRoles(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(SuperAdminUnits);

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
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
import Sidebar from '../../components/sidebar';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { connect } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import TopTab from '../../components/top-tab';
import AddVehicleDetails from './add-vehicle';
import { getVehicle, deleteVehicles } from './action';
import PropTypes from 'prop-types';
import {
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../utils/common-utils';
import Dialog from '../../components/dialog';
import ReactTable from '../../components/react-table';
import CellTypes from '../../components/react-table/components/renderTypes';
import EditableButton from '../../components/react-table/components/editable-button';
import {
  CapabilityFilters,
  SelectColumnFilter,
} from '../../components/react-table/helper';
import WindowTitle from '../../components/window-name';
import Clock from '../../components/clock';
import { tablePadding } from '../../assets/styles';
import MDTooltip from '../../components/tooltip';
import { getActiveCapabilityRoles } from '../drivers-management/action';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    height: '94vh',
    overflow: 'auto',
    backgroundColor: '#F3F3F3',
  },
  mainRoot: {
    width: '100vw',
  },
  tabStyle: {
    backgroundColor: '#E3E3E3',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const VehicleManagemnet = ({
  isLoad,
  callVehicleManagemnetApi,
  callCapabilityRolesApi,
  callDeleteVehicle,
  all_vehicles,
  isLoadInner,
}) => {
  const [all_vehicle, setVehicles] = useState([]);
  const [type, setType] = useState('add');
  const [userData, setUserData] = useState('');
  const [value, setValue] = useState(1);
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [current, setCurrent] = useState({});
  const classes = useStyles();

  useEffect(() => {
    callVehicleManagemnetApi();
    callCapabilityRolesApi();
  }, []);

  const deleteVehicle = async (val) => {
    const result = await callDeleteVehicle(val);
    if (result) {
      callVehicleManagemnetApi();
      deleteToggle();
    }
  };

  const deleteToggle = () => {
    setIsDeleteDialog(!isDeleteDialog);
  };

  useEffect(() => {
    if (strictValidArrayWithLength(all_vehicles)) {
      setVehicles(all_vehicles);
    }
  }, [all_vehicles]);

  const handleChange = (event, newValue) => {
    if (newValue === 2) {
      setValue(newValue);
    } else {
      setValue(newValue);
      setUserData({});
    }
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
            you want to delete this vehicle from the list ?
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
            variant="outlined"
            onClick={() => deleteVehicle(current.vehicle_id)}
          >
            Yes, Do It
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const clearDataToDeault = () => {
    setValue(1);
    setUserData();
  };

  const vehicle_id_data = (v) => {
    return v.split`,`.map((x) => +x);
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'active':
        return 'In Service';
      case 'inactive':
        return 'Out of Service';
      default:
        return status;
    }
  };

  return (
    <div className={classes.root}>
      <WindowTitle title="Vehicle Management" />
      <CssBaseline />
      <Sidebar onChange={() => setValue(1)} />
      <main className={classes.mainRoot}>
        <Grid item>
          <TabContext value={value}>
            <Box
              style={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'space-between',
              }}
              className={classes.tabStyle}
              flexDirection={'row'}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <TopTab label="Vehicle List" value={1} />
                <TopTab
                  label={
                    strictValidObjectWithKeys(userData)
                      ? 'Edit Vehicle'
                      : 'Setup Vehicle'
                  }
                  value={2}
                />
              </TabList>
              <Stack direction="row" alignItems="center">
                <Clock>
                  <Button
                    size="medium"
                    variant="contained"
                    onClick={() => setValue(2)}
                    color="primary"
                    startIcon={<AddIcon />}
                    className={classes.button}
                    disabled={value === 2}
                  >
                    Add vehicle
                  </Button>
                </Clock>
              </Stack>
            </Box>
            <main className={classes.content}>
              <TabPanel sx={tablePadding} value={1} index={1}>
                <Grid item xs={12} md={12} lg={12}>
                  <ReactTable
                    loading={isLoad}
                    isLoadInner={isLoadInner}
                    customText={'You do not have any configured Vehicles'}
                    columnDefs={[
                      {
                        Header: 'Vehicle code',
                        accessor: 'vehicle_code',
                      },
                      {
                        Header: 'Description',
                        accessor: 'description',
                        width: 300,
                        Cell: (props) => (
                          <MDTooltip title={props.row.original.description}>
                            <Typography height={55}>
                              {props.row.original.description}
                            </Typography>
                          </MDTooltip>
                        ),
                      },
                      {
                        Header: 'Capability',
                        accessor: 'capability_id',
                        type: 'capability_role',
                        Filter: CapabilityFilters,
                        width: 300,
                        disableSortBy: true,
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
                        accessor: 'vehicle_status',
                        Filter: SelectColumnFilter,
                        disableSortBy: true,
                        Cell: (props) => (
                          <>
                            <CellTypes
                              type="vehicle_status"
                              value={renderStatus(
                                props.row.original.vehicle_status,
                              )}
                            />
                          </>
                        ),
                      },
                      {
                        Header: 'Notes',
                        accessor: 'notes',
                        width: 300,
                        Cell: (props) => (
                          <MDTooltip title={props.row.original.notes}>
                            <Typography height={55}>
                              {props.row.original.notes}
                            </Typography>
                          </MDTooltip>
                        ),
                      },
                      {
                        Header: 'Actions',
                        accessor: '',
                        Filter: false,
                        width: 80,
                        disableSortBy: true,
                        Cell: (props) => (
                          <>
                            <EditableButton
                              hideDeleteButton={
                                props.row.original.enabled === 0
                              }
                              deleteButtonShow={false}
                              editButtonClicked={() => {
                                const field = props.row.original;

                                const arrayRoles =
                                  strictValidObjectWithKeys(field) &&
                                  strictValidString(field.capability_id)
                                    ? vehicle_id_data(field.capability_id)
                                    : [];
                                setValue(2);
                                setType('edit');
                                const data = {
                                  ...field,
                                  edit: true,
                                  capability_id: arrayRoles,
                                  vehicle_id: field.vehicle_id,
                                };
                                setUserData(data);
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
                    rowData={Array.isArray(all_vehicle) ? all_vehicle : []}
                  />
                </Grid>
              </TabPanel>

              <TabPanel value={2}>
                <AddVehicleDetails
                  type={type}
                  setValue={() => clearDataToDeault()}
                  userData={userData}
                />
              </TabPanel>
              <TabPanel value={3}></TabPanel>
            </main>
          </TabContext>
        </Grid>
      </main>
      {deleteDialog()}
    </div>
  );
};

VehicleManagemnet.propTypes = {
  callVehicleManagemnetApi: PropTypes.func,
  isLoad: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

VehicleManagemnet.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.vehicle.message,
    isLoad: state.vehicle.isLoad,
    loadErr: state.vehicle.loadErr,
    all_vehicles: state.vehicle.all_vehicles,
    isLoadInner: state.vehicle.isLoadInner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callVehicleManagemnetApi: (...params) => dispatch(getVehicle(...params)),
  callDeleteVehicle: (...params) => dispatch(deleteVehicles(...params)),
  callCapabilityRolesApi: (...params) =>
    dispatch(getActiveCapabilityRoles(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(VehicleManagemnet);
// export default VehicleManagemnet;

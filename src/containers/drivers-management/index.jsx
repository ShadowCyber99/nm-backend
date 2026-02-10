/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Button,
  CssBaseline,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  Typography,
  Stack,
} from '@mui/material';
import Sidebar from '../../components/sidebar';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import TopTab from '../../components/top-tab';
import AddDriverDetails from './add-driver';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  createDriver,
  deleteDrivers,
  getActiveCapabilityRoles,
  getAllDrivers,
} from './action';
import {
  strictValidObjectWithKeys,
  strictValidString,
} from '../../utils/common-utils';
import Dialog from '../../components/dialog';
import { useSnackbar } from 'notistack';
import ReactTable from '../../components/react-table';
import {
  CapabilityFilters,
  PhoneFilters,
} from '../../components/react-table/helper';
import EditableButton from '../../components/react-table/components/editable-button';
import CellTypes from '../../components/react-table/components/renderTypes';
import { formatPhoneNumber } from '../../utils/regexs';
import WindowTitle from '../../components/window-name';
import Clock from '../../components/clock';
import { tablePadding } from '../../assets/styles';
import MDTooltip from '../../components/tooltip';
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

const DriversManagement = ({
  callAllDriversApi,
  allDriversFromState,
  callCapabilityRolesApi,
  callDeleteDriversApi,
  loadErr,
  message,
  isLoad,
  isLoadInner,
}) => {
  const [value, setValue] = useState('1');
  const [type, setType] = useState('add');
  const [userData, setUserData] = useState('');
  const classes = useStyles();
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [current, setCurrent] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    callCapabilityRolesApi();
  }, []);

  const deleteCapability = async (val) => {
    const result = await callDeleteDriversApi(val);
    if (result) {
      callAllDriversApi();
      deleteToggle();
    } else {
      deleteToggle();
    }
  };

  const deleteToggle = () => {
    setIsDeleteDialog(!isDeleteDialog);
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

  const deleteDialog = (id) => {
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
            Do you want to delete this driver from the list ?
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
            onClick={() => deleteCapability(current.user_id)}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const handleChange = (event, newValue) => {
    if (newValue === '2') {
      setValue(newValue);
    } else {
      setValue(newValue);
      setUserData();
    }
  };

  const addColumn = () => {
    setValue('2');
    setType('add');
  };

  useEffect(() => {
    callAllDriversApi();
  }, []);

  const clearDataToDeault = () => {
    setValue('1');
    setUserData();
  };

  const clearDataToDeaultAfter = () => {
    setValue('1');
    setTimeout(() => {
      setUserData();
    }, 2000);
  };

  const capability_id_data = (v) => {
    return v.split`,`.map((x) => +x);
  };

  return (
    <div className={classes.root}>
      <WindowTitle title="Driver Management" />
      <CssBaseline />
      <Sidebar onChange={() => setValue('1')} />
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
                <TopTab label="Drivers List" value={'1'} />
                <TopTab
                  label={
                    strictValidObjectWithKeys(userData)
                      ? 'Edit Driver'
                      : 'Setup Driver'
                  }
                  value={'2'}
                />
              </TabList>
              <Stack direction="row" alignItems="center">
                <Clock>
                  <Button
                    size="medium"
                    variant="contained"
                    id="add_driver_btn_add_driver"
                    onClick={() => addColumn()}
                    color="primary"
                    startIcon={<AddIcon />}
                    className={classes.button}
                    disabled={value === '2'}
                  >
                    Add Driver
                  </Button>
                </Clock>
              </Stack>
            </Box>
            <main className={classes.content}>
              <TabPanel sx={tablePadding} value={'1'}>
                <Grid item xs={12} md={12} lg={12}>
                  <ReactTable
                    loading={isLoad}
                    isLoadInner={isLoadInner}
                    customText={'You do not have any configured Drivers'}
                    columnDefs={[
                      {
                        Header: 'First Name',
                        accessor: 'first_name',
                        width: 170,
                      },
                      {
                        Header: 'Last Name',
                        accessor: 'last_name',
                        width: 170,
                      },
                      {
                        Header: 'Email',
                        accessor: 'email_id',
                        width: 250,
                      },
                      {
                        Header: 'Phone Number',
                        accessor: 'phone_number',
                        Filter: PhoneFilters,
                        Cell: (props) => (
                          <Typography>
                            {formatPhoneNumber(props.row.original.phone_number)}
                          </Typography>
                        ),
                      },
                      {
                        Header: 'Address',
                        accessor: 'address',
                        disableSortBy: true,
                        width: 300,
                        Cell: (props) => (
                          <MDTooltip title={props.row.original.address}>
                            <Typography height={55}>
                              {strictValidString(props.row.original.address)
                                ? props.row.original.address
                                : 'N/A'}
                            </Typography>
                          </MDTooltip>
                        ),
                      },
                      {
                        Header: 'Capability',
                        accessor: 'capability_id',
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
                        Header: 'Actions',
                        accessor: '',
                        Filter: false,
                        sortable: true,
                        isSortedDesc: false,
                        disableSortBy: true,
                        width: 120,
                        Cell: (props) => (
                          <>
                            <EditableButton
                              editButtonClicked={() => {
                                const field = props.row.original;
                                const arrayRoles =
                                  strictValidObjectWithKeys(field) &&
                                  strictValidString(field.capability_id)
                                    ? capability_id_data(field.capability_id)
                                    : [];
                                setValue('2');
                                setType('edit');
                                const data = {
                                  ...field,
                                  capability_id: arrayRoles,
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
                    rowData={
                      Array.isArray(allDriversFromState)
                        ? allDriversFromState
                        : []
                    }
                  />
                </Grid>
              </TabPanel>

              <TabPanel value={'2'}>
                <AddDriverDetails
                  type={type}
                  setValue={() => clearDataToDeault()}
                  clearDataToDeaultAfter={clearDataToDeaultAfter}
                  userData={userData}
                />
              </TabPanel>
            </main>
          </TabContext>
        </Grid>
      </main>
      {deleteDialog()}
    </div>
  );
};
DriversManagement.propTypes = {
  callAllDriversApi: PropTypes.func,
  callCreateDriverApi: PropTypes.func,
  isLoad: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

DriversManagement.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.drivers.message,
    isLoad: state.drivers.isLoad,
    loadErr: state.drivers.loadErr,
    isLoadInner: state.drivers.isLoadInner,
    allDriversFromState: state.drivers.all_drivers,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callAllDriversApi: (...params) => dispatch(getAllDrivers(...params)),
  callCreateDriverApi: (...params) => dispatch(createDriver(...params)),
  callCapabilityRolesApi: (...params) =>
    dispatch(getActiveCapabilityRoles(...params)),
  callDeleteDriversApi: (...params) => dispatch(deleteDrivers(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(DriversManagement);

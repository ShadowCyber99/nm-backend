/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import {
  Checkbox,
  Grid,
  Typography,
  Stack,
  Switch,
  FormControlLabel,
  FormGroup,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Box,
} from '@mui/material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  formatDateTime,
  strictFilterArrayWithKey,
  strictValidObjectWithKeys,
  strictValidArrayWithLength,
  dobFormatTime,
  limitWords,
  getPhoenixDateTime,
  strictValidNumber,
} from '../../../utils/common-utils';
import ReactTable from '../../../components/react-table';
import {
  getTrip,
  getMergeTransportAccount,
  getUnits,
  addTransport,
  flushUnits,
  flushtrips,
} from '../action';
import CellMapTypes from '../../../components/react-table/components/renderMapTypes';
import { VertcalDivider } from '../../../assets/icons';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TransportDialog from '../../../components/dialog/transport';
import Dialog from '../../../components/dialog';
import { makeStyles } from '@mui/styles';
import { formatPhoneNumber } from '../../../utils/regexs';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import {
  CapabilityFilters,
  DateFilter,
  SelectColumnFilter,
} from '../../../components/react-table/helper';
import CellTypes from '../../../components/react-table/components/renderTypes';
import MDTooltip from '../../../components/tooltip';
import WarningAmberIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { transportStatus } from '../../../utils/constant';
import { SocketContext } from '../../../hooks/useSocketContext';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    backgroundColor: '#F3F3F3',
  },
  tabStyle: {
    backgroundColor: '#E3E3E3',
  },
  margin: {
    margin: theme.spacing(4, 0, 1),
  },
  generalMargin: {
    margin: theme.spacing(1, 0, 0),
  },
  input: { display: 'none' },
  profileContainer: {
    marginLeft: theme.spacing(2),
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
  },
  mainHeaderText: {
    fontSize: 16,
    fontWeight: '700',
  },
  editicon: {
    left: theme.spacing(25),
    top: theme.spacing(22),
  },
  button: {
    margin: theme.spacing(3),
  },
  buttonAction: {
    margin: theme.spacing(0, 2),
    width: 180,
  },
  header: {
    marginTop: theme.spacing(0.5),
    fontSize: 18,
    textAlign: 'center',
  },
  buttonForceAction: {
    width: 200,
    textTransform: 'capitalize',
  },
  title: {
    margin: theme.spacing(0.5, 1),
    fontSize: 20,
  },
}));

const CreateTransport = ({
  setValue,
  setData,
  callAllTripApi,
  loadErr,
  callNergeTransportApi,
  callAllUnitsApi,
  trips,
  units,
  mtransport,
  tripLoad,
  unitLoad,
  mtransportLoad,
  triploadErr,
  unitloadErr,
  mtransportloadErr,
  tripisLoadInner,
  unitisLoadInner,
  callAddTransport,
  mtransportisLoadInner,
  callFlushUnitsApi,
  callFlushTripsApi,
  tripId,
  transportId,
}) => {
  const classes = useStyles();
  const [pending_orders, setPendingOrders] = useState({});
  const [available_unit, setAvailableUnit] = useState({});
  const [available_unit_check, setAvailableUnitCheck] = useState(false);
  const [merge_transports, setTransports] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [dilogData, setDilogData] = useState([]);
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [isForceDialog, setIsForceDialog] = useState(false);
  const [isAssignedDialog, setIsAssignedDialog] = useState(false);
  const [unitSelected, setUnitSelected] = useState('');
  const [allAllocated, setAllAllocated] = useState(false);
  const socket = useContext(SocketContext);

  const forceShowToggle = () => {
    setIsForceDialog(!isForceDialog);
  };

  const assignedShowToggle = () => {
    setIsAssignedDialog(!isAssignedDialog);
  };

  const callApis = async () => {
    await callAllTripApi({ trip_id: tripId });
    setTransports([]);
    setUnitSelected('');
    setAvailableUnit({});
  };
  useEffect(() => {
    if (strictValidNumber(tripId)) {
      callApis();
    }
    return () => {
      callFlushUnitsApi();
      callFlushTripsApi();
    };
  }, []);

  useEffect(() => {
    if (strictValidArrayWithLength(trips)) {
      checkPendingOrders(trips[0]);
    }
  }, [trips]);

  const transportDialog = () => {
    return (
      <TransportDialog
        fullScreen={false}
        isOpen={isDeleteDialog}
        fullWidth={true}
        maxWidth={true}
        data={dilogData}
        transportId={transportId}
        handleClose={() => {
          setIsDeleteDialog(!isDeleteDialog);
        }}
      >
        <DialogActions>
          <Button
            className={classes.buttonAction}
            color="primary"
            variant="contained"
            onClick={() => {
              setIsDeleteDialog(!isDeleteDialog);
              saveFunDialog(true);
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </TransportDialog>
    );
  };
  const forceShowDialog = () => {
    return (
      <Dialog
        appBarColor="error"
        title={'Warning !'}
        fullScreen={false}
        closeIcon={false}
        isOpen={isForceDialog}
        fullWidth={true}
        maxWidth={'sm'}
        sxAppBar={{ justifyContent: 'center', alignItems: 'center' }}
        sxTitle={{ fontSize: 24 }}
        handleClose={() => {
          forceShowToggle();
        }}
      >
        <DialogContent
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <WarningAmberIcon
            color="error"
            sx={{ height: 60, width: 60, mb: 3 }}
          />
          <DialogContentText
            className={classes.header}
            id="alert-dialog-slide-description"
          >
            Force allocation of Units can create operational problems!
          </DialogContentText>
          <DialogContentText className={classes.header}>
            Use this feature with caution!
          </DialogContentText>
          <DialogContentText className={classes.header}>
            Are you sure you want to continue?”
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: 'space-around', display: 'flex', mt: 2 }}
        >
          <Button
            className={classes.buttonForceAction}
            color="success"
            variant="outlined"
            onClick={() => {
              enableForceUnit();
            }}
          >
            Yes, Continue
          </Button>
          <Button
            className={classes.buttonForceAction}
            color="error"
            variant="outlined"
            onClick={() => {
              disableForceUnit();
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const assignedDialog = () => {
    return (
      <Dialog
        appBarColor="success"
        title={'Info !'}
        fullScreen={false}
        closeIcon={false}
        isOpen={isAssignedDialog}
        fullWidth={true}
        maxWidth={'sm'}
        sxAppBar={{ justifyContent: 'center', alignItems: 'center' }}
        sxTitle={{ fontSize: 24 }}
        handleClose={() => {
          assignedShowToggle();
        }}
      >
        <DialogContent
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <InfoIcon color="success" sx={{ height: 60, width: 60, mb: 3 }} />
          <DialogContentText
            className={classes.title}
            id="alert-dialog-slide-description"
          >
            All following related Trips will be assigned:
          </DialogContentText>
          <Box flexDirection="row" display="flex" flexWrap="wrap">
            {strictValidArrayWithLength(dilogData.child_trip_leg_id) &&
              dilogData.child_trip_leg_id.map((a) => {
                return (
                  <DialogContentText className={classes.title}>
                    {a}
                  </DialogContentText>
                );
              })}
          </Box>
          <Box>
            <DialogContentText
              className={classes.title}
              id="alert-dialog-slide-description"
            >
              Do you want to continue?
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: 'space-around', display: 'flex', mt: 2 }}
        >
          <Button
            className={classes.buttonForceAction}
            color="success"
            variant="outlined"
            onClick={() => {
              setIsAssignedDialog(false);
              setIsDeleteDialog(true);
              setAllAllocated(true);
            }}
          >
            Yes
          </Button>
          <Button
            className={classes.buttonForceAction}
            color="error"
            variant="outlined"
            onClick={() => {
              setIsAssignedDialog(false);
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  // const setAvailableUnitCheckFun = async (val) => {
  //   if (val) {

  //     // forceShowToggle();
  //   } else {
  //     setAvailableUnitCheck(true);
  //     if (strictValidArrayWithLength(trips)) {
  //       await callAllUnitsApi({ trip_id: trips[0].trip_id, force_unit: true });
  //     }
  //     forceShowToggle();
  //   }
  // };

  const disableForceUnit = async (val = true) => {
    setAvailableUnitCheck(false);
    if (strictValidArrayWithLength(trips)) {
      await callAllUnitsApi({ trip_id: trips[0].trip_id, force_unit: false });
    }
    if (val) {
      forceShowToggle();
    }
  };

  const enableForceUnit = async () => {
    setAvailableUnitCheck(true);
    if (strictValidArrayWithLength(trips)) {
      await callAllUnitsApi({ trip_id: trips[0].trip_id, force_unit: true });
    }
    forceShowToggle();
  };

  const checkPendingOrders = async (val) => {
    setPendingOrders(val);
    await callAllUnitsApi({ trip_id: val.trip_id });
  };

  const handleSubmit = async (val) => {
    const data = merge_transports[0];
    setDilogData(data);
    if (data.is_child) {
      setIsAssignedDialog(true);
    } else {
      setIsDeleteDialog(true);
    }
  };

  const mergeData = async () => {
    const data = [];
    data.push({
      ...pending_orders,
      available_unit: available_unit,
    });
    setTransports(data);
  };

  const saveFunDialog = async (val) => {
    if (val) {
      const transpor = await callAddTransport({
        unit_id: available_unit.unit_id,
        trip_id: pending_orders.trip_id,
        transport_id: transportId,
        is_assigned_child: allAllocated,
      });
      if (strictValidObjectWithKeys(transpor)) {
        socket.emit('transport_sockit', transpor.id);
        socket.emit('transport', transpor.id);
        setValue(1);
        callFlushUnitsApi();
      }
    }
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

  return (
    <>
      <Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack
              sx={{ marginBottom: 1 }}
              direction="row"
              spacing={2}
              alignItems={'center'}
            >
              <Typography variant="h1">Pending Orders</Typography>
              <VertcalDivider />
            </Stack>
            <ReactTable
              headerFilter={false}
              customHeight={true}
              height={{ minHeight: 200, maxHeight: 400 }}
              pagination={false}
              loading={tripLoad}
              isLoadInner={tripisLoadInner}
              getCellProperties={(cellInfo) => ({
                style: {
                  backgroundColor:
                    new Date(cellInfo.row.original.pick_up_date_time) <
                    getPhoenixDateTime()
                      ? '#ffe6e6'
                      : null,
                },
              })}
              customText={'You do not have any configured Trips'}
              columnDefs={[
                {
                  Header: 'Leg ID',
                  accessor: 'leg_id',
                  width: 75,
                },
                {
                  Header: 'PU Time',
                  accessor: 'pick_up_date_time',
                  Filter: DateFilter,
                  width: 100,
                  Cell: (props) => (
                    <>
                      <Typography>
                        {formatDateTime(props.row.original.pick_up_date_time)}
                      </Typography>
                    </>
                  ),
                },
                {
                  Header: 'E End Time',
                  accessor: 'estimated_end_time',
                  Filter: DateFilter,
                  width: 100,
                  Cell: (props) => (
                    <>
                      <Typography>
                        {formatDateTime(props.row.original.estimated_end_time)}
                      </Typography>
                    </>
                  ),
                },
                {
                  Header: 'PU Location',
                  accessor: 'trip_pickup_location',
                  width: 220,
                  Cell: (props) => (
                    <>
                      <MDTooltip
                        title={props.row.original.trip_pickup_location}
                      >
                        <Typography height={55}>
                          {limitWords(
                            props.row.original.trip_pickup_location,
                            30,
                          )}
                        </Typography>
                      </MDTooltip>
                    </>
                  ),
                },
                {
                  Header: 'DO Location',
                  accessor: 'trip_dropoff_location',
                  width: 220,
                  Cell: (props) => (
                    <>
                      <MDTooltip
                        title={props.row.original.trip_dropoff_location}
                      >
                        <Typography height={55}>
                          {limitWords(
                            props.row.original.trip_dropoff_location,
                            30,
                          )}
                        </Typography>
                      </MDTooltip>
                    </>
                  ),
                },
                {
                  Header: 'Transport Mode',
                  accessor: 'capability_id',
                  width: 150,
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
                  accessor: 'Clarifications',
                  width: 150,
                  disableSortBy: true,
                  Cell: (props) => (
                    <>
                      <MDTooltip
                        title={props.row.original.capability_clarification}
                      >
                        <Typography height={55}>
                          {props.row.original.capability_clarification}
                        </Typography>
                      </MDTooltip>
                    </>
                  ),
                },
                {
                  Header: 'Weight',
                  width: 60,
                  accessor: (originalRow, rowIndex) => {
                    return (
                      strictValidObjectWithKeys(originalRow) &&
                      strictValidObjectWithKeys(originalRow.base_patient) &&
                      originalRow.base_patient.weight
                    );
                  },
                  Cell: (props) => (
                    <>
                      <Typography>
                        {props.row.original.base_patient.weight_in === 'KG'
                          ? `${
                              props.row.original.base_patient.weight / 2.205
                            } KG`
                          : `${props.row.original.base_patient.weight} LBS`}
                      </Typography>
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
                  width: 180,
                  Cell: (props) => (
                    <>
                      <MDTooltip
                        title={props.row.original.base_patient.description}
                      >
                        <Typography height={55}>
                          {limitWords(
                            props.row.original.base_patient.description,
                            25,
                          )}
                        </Typography>
                      </MDTooltip>
                    </>
                  ),
                },
                {
                  Header: 'Patient Name',
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
                  Header: 'Account',
                  width: 140,
                  accessor: (originalRow, rowIndex) => {
                    return (
                      strictValidObjectWithKeys(originalRow) &&
                      strictValidObjectWithKeys(
                        originalRow.corporate_account,
                      ) &&
                      originalRow.corporate_account.name
                    );
                  },
                  Cell: (props) => (
                    <>
                      <MDTooltip
                        title={props.row.original.corporate_account.name}
                      >
                        <Typography height={55}>
                          {limitWords(
                            props.row.original.corporate_account.name,
                            16,
                          )}
                        </Typography>
                      </MDTooltip>
                    </>
                  ),
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
                  id: 'Account Contact',
                  width: 120,
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
                // {
                //   Header: 'Contact Phone No',
                //   accessor: (originalRow, rowIndex) => {
                //     let output = [];
                //     _.map(originalRow.company_contact, (res) => {
                //       output.push(res.phone_number);
                //     });
                //     return output.join(', ');
                //   },
                //   width: 180,
                //   Filter: PhoneFilters,
                //   id: 'company_phone',
                //   Cell: (props) => (
                //     <>
                //       <CellMapTypes
                //         type="corporate_contact_phone"
                //         renderValue="phone_number"
                //         renderType="phone"
                //         data={props.row.original.company_contact}
                //       />
                //     </>
                //   ),
                // },
                // {
                //   Header: 'Actions',
                //   accessor: '',
                //   width: 60,
                //   Filter: false,
                //   Cell: (props) => (
                //     <>
                //       <Checkbox
                //         checked={
                //           strictFilterArrayWithKey(pending_orders) &&
                //           pending_orders.trip_id === props.row.original.trip_id
                //             ? true
                //             : false
                //         }
                //         onChange={(e) => {
                //           setSelected(props.row.id);
                //           checkPendingOrders(props.row.original);
                //           setTransports([]);
                //           setUnitSelected('');
                //           setAvailableUnit({});
                //         }}
                //         inputProps={{ 'aria-label': 'controlled' }}
                //       />
                //     </>
                //   ),
                // },
              ]}
              rowData={Array.isArray(trips) ? trips : []}
            />
          </Grid>

          <Grid item xs={12}>
            <Stack
              sx={{ marginBottom: 2 }}
              direction="row"
              spacing={2}
              alignItems={'center'}
            >
              <Typography variant="h1">Available Units</Typography>
              <VertcalDivider />
              <FormGroup>
                <FormControlLabel
                  control={<Switch checked={available_unit_check} />}
                  label="Force show all Units"
                  onChange={(e) => {
                    if (available_unit_check) {
                      disableForceUnit(false);
                    } else {
                      forceShowToggle(false);
                    }
                  }}
                />
              </FormGroup>
            </Stack>
            {strictValidArrayWithLength(units) && (
              <ReactTable
                headerFilter={false}
                globalFilterShow={false}
                selected={unitSelected}
                sxTable={{
                  overflowX: 'initial',
                }}
                customHeight={true}
                tableSize={true}
                height={{
                  minHeight: 200,
                  maxHeight: 300,
                }}
                sxEmptyStyle={{
                  minHeight: 300,
                  maxHeight: 300,
                }}
                pagination={false}
                boxStyle={{
                  overflow: 'scroll',
                  maxHeight: 300,
                  // backgroundColor: '#fff',
                }}
                loading={unitLoad}
                isLoadInner={unitisLoadInner}
                customText={'You do not have any configured Available Units'}
                columnDefs={[
                  {
                    Header: 'Vehicle',
                    accessor: 'vehicle_code',
                    width: 140,
                  },
                  {
                    Header: 'Crew',
                    accessor: (originalRow, rowIndex) => {
                      return (
                        strictValidObjectWithKeys(originalRow) &&
                        originalRow.driver_name + ', ' + originalRow.driver_name
                      );
                    },
                    Cell: (props) => (
                      <>
                        <Typography>
                          {props.row.original.driver_name}
                          {' / '}
                          {props.row.original.attendant_name}
                        </Typography>
                      </>
                    ),
                  },
                  {
                    Header: 'Shift Start',
                    accessor: 'start_time',
                    Filter: DateFilter,
                    Cell: (props) => (
                      <>
                        <Typography>
                          {formatDateTime(props.row.original.start_time)}
                        </Typography>
                      </>
                    ),
                  },
                  {
                    Header: 'Shift End',
                    accessor: 'end_time',
                    Filter: DateFilter,
                    Cell: (props) => (
                      <>
                        <Typography>
                          {formatDateTime(props.row.original.end_time)}
                        </Typography>
                      </>
                    ),
                  },
                  {
                    Header: 'Unit Capability',
                    accessor: 'capability_id',
                    width: 200,
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
                    Header: 'Miles',
                    accessor: 'distance',
                    Filter: SelectColumnFilter,
                    Cell: (props) => (
                      <>
                        <Typography>{props.row.original.distance}</Typography>
                      </>
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
                    Filter: SelectColumnFilter,
                    Cell: (props) => (
                      <>
                        <Typography
                          sx={{
                            textTransform: 'capitalize',
                          }}
                        >
                          {props.row.original.status}
                        </Typography>
                      </>
                    ),
                  },
                  {
                    Header: 'Actions',
                    accessor: '',
                    width: 140,
                    Filter: false,
                    Cell: (props) => (
                      <>
                        <Checkbox
                          checked={
                            strictFilterArrayWithKey(available_unit) &&
                            available_unit.unit_id ===
                              props.row.original.unit_id
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setUnitSelected(props.row.id);
                            setAvailableUnit(props.row.original);
                          }}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </>
                    ),
                  },
                ]}
                rowData={Array.isArray(units) ? units : []}
              />
            )}
          </Grid>

          <Grid item xs={12}>
            {strictValidArrayWithLength(units) && (
              <Stack
                sx={{ marginBottom: 2 }}
                direction="row"
                spacing={2}
                alignItems={'center'}
              >
                <Typography variant="h1">Transports</Typography>
                <VertcalDivider />
                <Button
                  disabled={
                    !strictValidObjectWithKeys(available_unit) ||
                    !strictValidObjectWithKeys(pending_orders)
                  }
                  size="medium"
                  variant="contained"
                  onClick={() => mergeData()}
                  color="primary"
                >
                  Plan Transport
                </Button>
              </Stack>
            )}
            {strictValidArrayWithLength(merge_transports) && (
              <ReactTable
                headerFilter={false}
                globalFilterShow={false}
                height={{ minHeight: 130, maxHeight: 130 }}
                pagination={false}
                customHeight={true}
                tableSize={true}
                customText={'You do not have any configured Transports '}
                columnDefs={[
                  {
                    Header: 'PU Time',
                    accessor: 'pick_up_date_time',
                    Filter: false,
                    width: 140,
                    Cell: (props) => (
                      <>
                        <Typography>
                          {formatDateTime(props.row.original.pick_up_date_time)}
                        </Typography>
                      </>
                    ),
                  },
                  {
                    Header: 'Leg ID',
                    accessor: 'leg_id',
                    width: 100,
                    Filter: false,
                  },
                  // {
                  //   Header: 'ETA PU',
                  //   accessor: 'enabled',
                  //   width: 120,
                  //   Filter: false,
                  //   Cell: (props) => (
                  //     <>
                  //       <Typography>{'N/A'}</Typography>
                  //     </>
                  //   ),
                  // },
                  {
                    Header: 'ETA DO',
                    accessor: 'estimated_end_time',
                    Filter: false,
                    width: 140,
                    Cell: (props) => (
                      <>
                        <Typography>
                          {formatDateTime(
                            props.row.original.estimated_end_time,
                          )}
                        </Typography>
                      </>
                    ),
                  },
                  {
                    Header: 'PU Location',
                    accessor: 'trip_pickup_location',
                    Filter: false,
                    Cell: (props) => (
                      <>
                        <MDTooltip
                          title={props.row.original.trip_pickup_location}
                        >
                          <Typography height={55}>
                            {limitWords(
                              props.row.original.trip_pickup_location,
                              30,
                            )}
                          </Typography>
                        </MDTooltip>
                      </>
                    ),
                  },
                  {
                    Header: 'DO Location',
                    Filter: false,
                    accessor: 'trip_dropoff_location',
                    Cell: (props) => (
                      <>
                        <MDTooltip
                          title={props.row.original.trip_dropoff_location}
                        >
                          <Typography height={55}>
                            {limitWords(
                              props.row.original.trip_dropoff_location,
                              30,
                            )}
                          </Typography>
                        </MDTooltip>
                      </>
                    ),
                  },
                  {
                    Header: 'Transport Mode',
                    accessor: 'capability_id',
                    width: 150,
                    Filter: false,
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
                    width: 120,
                    Filter: false,
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
                    Header: 'DOB',
                    accessor: 'dob',
                    Filter: false,
                    width: 110,
                    Cell: (props) => (
                      <>
                        <Typography>
                          {dobFormatTime(props.row.original.base_patient.dob)}
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
                    Filter: false,
                    width: 150,
                    Cell: (props) => (
                      <Typography>
                        {formatPhoneNumber(
                          props.row.original.base_patient.phone,
                        )}
                      </Typography>
                    ),
                  },

                  {
                    Header: 'Account',
                    accessor: (originalRow, rowIndex) => {
                      return (
                        strictValidObjectWithKeys(originalRow) &&
                        strictValidObjectWithKeys(
                          originalRow.corporate_account,
                        ) &&
                        originalRow.corporate_account.name
                      );
                    },
                    Filter: false,
                    width: 120,
                    Cell: (props) => (
                      <>
                        <MDTooltip
                          title={props.row.original.corporate_account.name}
                        >
                          <Typography height={55}>
                            {limitWords(
                              props.row.original.corporate_account.name,
                              30,
                            )}
                          </Typography>
                        </MDTooltip>
                      </>
                    ),
                  },
                  {
                    Header: 'Account Contact',
                    Filter: false,
                    accessor: (originalRow, rowIndex) => {
                      let output = [];
                      _.map(originalRow.company_contact, (res) => {
                        output.push(`${res.last_name}, ${res.first_name}`);
                      });
                      return output.join(', ');
                    },
                    id: 'name',
                    width: 120,
                    Cell: (props) => (
                      <CellMapTypes
                        type="company_contact"
                        renderValue="first_name"
                        data={props.row.original.company_contact}
                      />
                    ),
                  },
                  {
                    Header: 'Contact Phone No',
                    Filter: false,
                    accessor: (originalRow, rowIndex) => {
                      let output = [];
                      _.map(originalRow.company_contact, (res) => {
                        output.push(res.phone_number);
                      });
                      return output.join(', ');
                    },
                    width: 150,
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
                    Header: 'Unit',
                    Filter: false,
                    width: 180,
                    accessor: (originalRow, rowIndex) => {
                      return (
                        strictValidObjectWithKeys(originalRow) &&
                        strictValidObjectWithKeys(originalRow.available_unit) &&
                        originalRow.available_unit.vehicle_code
                      );
                    },
                    Cell: (props) => (
                      <MDTooltip
                        title={`${props.row.original.available_unit.vehicle_code} / ${props.row.original.available_unit.driver_name} / ${props.row.original.available_unit.attendant_name}`}
                      >
                        <Typography
                          height={55}
                          sx={{
                            textTransform: 'capitalize',
                          }}
                        >
                          {limitWords(
                            `${props.row.original.available_unit.vehicle_code} / ${props.row.original.available_unit.driver_name} / ${props.row.original.available_unit.attendant_name}`,
                            20,
                          )}
                        </Typography>
                      </MDTooltip>
                    ),
                  },
                  {
                    Header: 'T-Status',
                    width: 90,
                    Filter: false,
                    accessor: (originalRow, rowIndex) => {
                      return (
                        strictValidObjectWithKeys(originalRow) &&
                        strictValidObjectWithKeys(originalRow.available_unit) &&
                        originalRow.available_unit.status
                      );
                    },
                    Cell: (props) => (
                      <>
                        <Typography
                          sx={{
                            textTransform: 'capitalize',
                          }}
                        >
                          {props.row.original.available_unit.status}
                        </Typography>
                      </>
                    ),
                  },
                ]}
                rowData={
                  Array.isArray(merge_transports) ? merge_transports : []
                }
              />
            )}
          </Grid>

          <Grid
            container
            spacing={{
              xs: 2,
              md: 4,
            }}
            columns={{
              xs: 4,
              sm: 4,
              md: 12,
            }}
          >
            <Grid sx={{ ml: 2 }} item xs={4} sm={6} md={8}>
              <Button
                // disabled={pristine || submitting || !valid}
                disabled={!strictValidArrayWithLength(merge_transports)}
                onClick={handleSubmit}
                type="submit"
                size="large"
                variant="contained"
                startIcon={<CheckIcon />}
                sx={{
                  mt: 2,
                  mb: 2,
                }}
              >
                {'Assign Transport'}
              </Button>
              <Button
                onClick={() => setValue(1)}
                type="submit"
                color="error"
                size="large"
                variant="outlined"
                startIcon={<CloseIcon />}
                sx={{
                  mt: 2,
                  mb: 2,
                  mx: 2,
                }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {transportDialog()}
      {forceShowDialog()}
      {assignedDialog()}
    </>
  );
};

CreateTransport.propTypes = {
  callAllTripApi: PropTypes.func,
  callNergeTransportApi: PropTypes.func,
  callAllUnitsApi: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

CreateTransport.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    trips: state.transport.trip.data,
    units: state.transport.unit.data,
    mtransport: state.transport.mtransport.data,
    tripLoad: state.transport.trip.isLoad,
    unitLoad: state.transport.unit.isLoad,
    mtransportLoad: state.transport.mtransport.isLoad,
    loadErr: state.transport.mtransport.loadErr,
    triploadErr: state.transport.trip.loadErr,
    unitloadErr: state.transport.unit.loadErr,
    mtransportloadErr: state.transport.mtransport.loadErr,
    tripisLoadInner: state.transport.trip.isLoadInner,
    unitisLoadInner: state.transport.unit.isLoadInner,
    mtransportisLoadInner: state.transport.mtransport.isLoadInner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callAllTripApi: (...params) => dispatch(getTrip(...params)),
  callNergeTransportApi: (...params) =>
    dispatch(getMergeTransportAccount(...params)),
  callAllUnitsApi: (...params) => dispatch(getUnits(...params)),
  callAddTransport: (...params) => dispatch(addTransport(...params)),
  callFlushUnitsApi: (...params) => dispatch(flushUnits(...params)),
  callFlushTripsApi: (...params) => dispatch(flushtrips(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(CreateTransport);

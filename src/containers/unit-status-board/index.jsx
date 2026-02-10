/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  CssBaseline,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import Sidebar from '../../components/sidebar';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import TopTab from '../../components/top-tab';
import ReactTable from '../../components/react-table';
import { connect } from 'react-redux';
import { getUnitStatus } from './action';
import {
  formatDateTime,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../utils/common-utils';
import {
  DateFilter,
  CapabilityFilters,
  SelectColumnFilter,
} from '../../components/react-table/helper';
import { transportStatus } from '../../utils/constant';
import WindowTitle from '../../components/window-name';
import Clock from '../../components/clock';
import { tablePadding } from '../../assets/styles';
import CellTypes from '../../components/react-table/components/renderTypes';
import { getCapabilityRoles } from '../drivers-management/action';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import TransportStatusManagement from '../transport-status-board/index';
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
  button: {
    margin: theme.spacing(1),
  },
}));

const UnitStatusBoard = ({
  data,
  isLoad,
  isLoadInner,
  callUnitStatusApi,
  callCapabilityRolesApi,
}) => {
  const [value, setValue] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const handle = useFullScreenHandle();
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      callUnitStatusApi();
      setRefreshing(true);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    callUnitStatusApi();
    callCapabilityRolesApi();
  }, []);

  return (
    <div className={classes.root}>
      <WindowTitle title="U-Board" />
      <Sidebar onChange={() => setValue(1)} />
      <div className={classes.content}>
        <FullScreen handle={handle}>
          <main className={classes.content}>
            <CssBaseline />
            <Grid item>
              <TabContext value={value}>
                <Box
                  style={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    // paddingRight: 15,
                  }}
                  className={classes.tabStyle}
                  flexDirection={'row'}
                  sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <TopTab label="Unit Status Board" value={1} />
                    <TopTab label="Transport Status Board" value={2} />
                  </TabList>
                  <Stack direction="row" alignItems="center">
                    <Clock>
                      {handle.active ? (
                        <Tooltip title={'Exit FullScreen'} disableInteractive>
                          <IconButton onClick={handle.exit}>
                            <FullscreenExitIcon fontSize="large" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title={'Enter FullScreen'} disableInteractive>
                          <IconButton onClick={handle.enter}>
                            <FullscreenIcon fontSize="large" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Clock>
                  </Stack>
                </Box>
                <TabPanel sx={tablePadding} value={1} index={1}>
                  <Grid item xs={12} md={12} lg={12}>
                    <ReactTable
                      fontSizeLg={true}
                      loading={!refreshing && isLoad}
                      isLoadInner={isLoadInner}
                      globalFilterShow={false}
                      pagination={handle.active ? false : true}
                      customText={"You don't have any configured Unit Status"}
                      headerFilter={false}
                      columnDefs={[
                        {
                          Header: 'Vehicle',
                          accessor: 'vehicle_code',
                          width: 90,
                          Cell: (props) => (
                            <Stack my={1}>
                              <Typography variant="h5">
                                {props.row.original.vehicle_code}
                              </Typography>
                            </Stack>
                          ),
                        },
                        {
                          Header: 'Type',
                          accessor: 'capability_id',
                          width: 220,
                          disableSortBy: true,
                          Filter: CapabilityFilters,
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
                          Header: 'Crew',
                          accessor: 'driver_name',
                          width: 300,
                          Cell: (props) => (
                            <Stack my={1}>
                              <Typography variant="h5">
                                {props.row.original.driver_name +
                                  ' / ' +
                                  props.row.original.attendant_name}
                              </Typography>
                            </Stack>
                          ),
                        },
                        {
                          Header: 'Shift',
                          accessor: 'start_time',
                          Filter: DateFilter,
                          width: 90,
                          Cell: (props) => (
                            <Stack my={1}>
                              <Typography variant="h5">
                                {formatDateTime(
                                  props.row.original.start_time,
                                  'HHmm',
                                ) +
                                  ' - ' +
                                  formatDateTime(
                                    props.row.original.end_time,
                                    'HHmm',
                                  )}
                              </Typography>
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
                          width: 140,
                          Filter: SelectColumnFilter,
                          Cell: (props) => (
                            <Stack my={1} sx={{ textTransform: 'capitalize' }}>
                              <Typography variant="h5">
                                {transportStatus(props.row.original.status)}
                              </Typography>
                            </Stack>
                          ),
                        },
                        {
                          Header: 'Time',
                          accessor: 'time_diff',
                          width: 100,
                          Cell: (props) => (
                            <Stack my={1} sx={{ textTransform: 'capitalize' }}>
                              <Typography variant="h5">
                                {props.row.original.time_diff}
                              </Typography>
                            </Stack>
                          ),
                        },
                        {
                          Header: 'Notes',
                          accessor: 'reason',
                          width: 320,
                          disableSortBy: true,
                          Cell: (props) => (
                            <Stack my={1}>
                              <Typography variant="h5">
                                {strictValidString(props.row.original.reason)
                                  ? props.row.original.reason
                                  : 'N/A'}
                              </Typography>
                            </Stack>
                          ),
                        },
                      ]}
                      rowData={Array.isArray(data) ? data : []}
                    />
                  </Grid>
                </TabPanel>
                <TabPanel sx={tablePadding} index={2} value={2}>
                  <Grid item xs={12} md={12} lg={12}>
                    <TransportStatusManagement />
                  </Grid>
                </TabPanel>
              </TabContext>
            </Grid>
          </main>
        </FullScreen>
      </div>
    </div>
  );
};
const mapStateProps = (state) => {
  return {
    message: state.unitStatus.message,
    isLoad: state.unitStatus.isLoad,
    loadErr: state.unitStatus.loadErr,
    data: state.unitStatus.data,
    isLoadInner: state.unitStatus.isLoadInner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callUnitStatusApi: (...params) => dispatch(getUnitStatus(...params)),
  callCapabilityRolesApi: (...params) =>
    dispatch(getCapabilityRoles(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(UnitStatusBoard);

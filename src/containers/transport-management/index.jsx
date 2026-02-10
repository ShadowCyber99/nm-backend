import React, { useState } from 'react';
import { CssBaseline, Grid, Stack } from '@mui/material';
import Sidebar from '../../components/sidebar';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import TopTab from '../../components/top-tab';
import TripList from './list';
import FinishedTransport from './finished-transport';
import AddTrip from './create';
import WindowTitle from '../../components/window-name';
import Clock from '../../components/clock';
import { tablePadding } from '../../assets/styles';
import { flushUnits } from './action';
import { connect } from 'react-redux';
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

const TransportManagement = ({ callFlushUnitsApi, callCapabilityRolesApi }) => {
  const [value, setValue] = useState('1');
  const classes = useStyles();
  const [tripData, setTripData] = useState({});
  const [tripId, setTripId] = useState('');
  const [transportId, setTransportId] = useState('');

  const handleChange = (event, newValue) => {
    if (newValue === '2') {
      setValue(newValue);
    } else {
      callCapabilityRolesApi();
      callFlushUnitsApi();
      setValue(newValue);
    }
    setTripId('');
    setTransportId('');
  };

  return (
    <div className={classes.root}>
      <WindowTitle title="Transport Management" />
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
                <TopTab label="Dispatch" value={'1'} />
                <TopTab label="Finished Transports" value={'3'} />
                <TopTab disabled label="Plan Transport" value={'2'} />
              </TabList>
              <Stack direction="row" alignItems="center">
                <Clock />
              </Stack>
            </Box>
            <main className={classes.content}>
              <TabPanel sx={tablePadding} value={'1'}>
                <Grid item xs={12} md={12} lg={12}>
                  <TripList
                    setData={(e) => setTripData(e)}
                    setValue={() => setValue('2')}
                    setTripId={(e) => setTripId(e)}
                    setTransportId={(e) => setTransportId(e)}
                  />
                </Grid>
              </TabPanel>
              <TabPanel sx={tablePadding} value={'2'}>
                <AddTrip
                  current_tripData={tripData}
                  setValue={() => setValue('1')}
                  tripId={tripId}
                  transportId={transportId}
                />
              </TabPanel>
              <TabPanel sx={tablePadding} value={'3'}>
                <Grid item xs={12} md={12} lg={12}>
                  <FinishedTransport
                    setData={(e) => setTripData(e)}
                    setValue={() => setValue('3')}
                  />
                </Grid>
              </TabPanel>
            </main>
          </TabContext>
        </Grid>
      </main>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callFlushUnitsApi: (...params) => dispatch(flushUnits(...params)),
  callCapabilityRolesApi: (...params) =>
    dispatch(getActiveCapabilityRoles(...params)),
});

export default connect(null, mapDispatchToProps)(TransportManagement);

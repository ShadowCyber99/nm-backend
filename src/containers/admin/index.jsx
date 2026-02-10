import React, { useState } from 'react';
import { CssBaseline, Grid, Stack } from '@mui/material';
import Sidebar from '../../components/sidebar';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import TopTab from '../../components/top-tab';
import SuperAdminUnits from './su-units';
import SuperAdminTrips from './su-trips';
import SuperAdminTransport from './su-transport';
import SuperAdminEditUnit from './su-edit-unit';
import SuperAdminEditTransport from './su-edit-transport';
import SuperAdminEditTrip from './su-edit-trips';
import { strictValidObjectWithKeys } from '../../utils/common-utils';
import WindowTitle from '../../components/window-name';
import Clock from '../../components/clock';
import InvoiceRule from './invoice-rule'
import { tablePadding } from '../../assets/styles';
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

const AdminPanel = () => {
  const [value, setValue] = useState(1);
  const classes = useStyles();
  const [state, setState] = useState({
    trips: {},
    transport: {},
    units: {},
  });
  const { trips, transport, units } = state;

  const handleChange = (event, newValue) => {
    if (newValue === 1 || newValue === 2 || newValue === 3) {
      setState({
        trips: {},
        transport: {},
        units: {},
      });
      setValue(newValue);
    } else {
      setValue(newValue);
    }
  };

  const changeRouteWithData = (name, data) => {
    setState({
      [name]: data,
    });
  };

  return (
    <div className={classes.root}>
      <WindowTitle title="Admin-Panel" />
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
                <TopTab label="SU Units" value={1} />
                <TopTab label="SU Trips" value={2} />
                <TopTab label="SU Transports" value={3} />
                <TopTab label="Invoice Rule" value={7} />
                {strictValidObjectWithKeys(units) && (
                  <TopTab label={'Edit Unit'} value={4} />
                )}
                {strictValidObjectWithKeys(trips) && (
                  <TopTab label={'Edit Trip'} value={5} />
                )}
                {strictValidObjectWithKeys(transport) && (
                  <TopTab label={'Edit Transport'} value={6} />
                )}
              </TabList>
              <Stack direction="row" alignItems="center">
                <Clock />
              </Stack>
            </Box>
            <main className={classes.content}>
              <TabPanel sx={tablePadding} value={1} index={1}>
                <SuperAdminUnits
                  setData={(data) => {
                    changeRouteWithData('units', data);
                    handleChange('', 4);
                  }}
                  setValue={(e) => setValue(e)}
                />
              </TabPanel>
              <TabPanel sx={tablePadding} value={2}>
                <SuperAdminTrips
                  setValue={(e) => setValue(e)}
                  setData={(data) => {
                    changeRouteWithData('trips', data);
                    handleChange('', 5);
                  }}
                />
              </TabPanel>
              <TabPanel sx={tablePadding} value={3}>
                <SuperAdminTransport
                  setData={(data) => {
                    changeRouteWithData('transport', data);
                    handleChange('', 6);
                  }}
                />
              </TabPanel>
              <TabPanel value={4}>
                <SuperAdminEditUnit
                  data={units}
                  setValue={() => {
                    setValue(1);
                  }}
                />
              </TabPanel>
              <TabPanel value={5}>
                <SuperAdminEditTrip
                  current_tripData={trips}
                  setValue={() => {
                    setValue(2);
                  }}
                />
              </TabPanel>
              <TabPanel value={6}>
                <SuperAdminEditTransport
                  data={transport}
                  setValue={() => {
                    setValue(3);
                  }}
                />
              </TabPanel>
              <TabPanel sx={tablePadding} value={7}>
                <InvoiceRule
                  setData={(data) => {
                    changeRouteWithData('invoice', data);
                    // handleChange('', 6);
                  }}
                />
              </TabPanel>
            </main>
          </TabContext>
        </Grid>
      </main>
    </div>
  );
};

export default AdminPanel;

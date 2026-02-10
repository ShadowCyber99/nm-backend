/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Button, CssBaseline, Grid, Stack } from '@mui/material';
import Sidebar from '../../components/sidebar';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import TopTab from '../../components/top-tab';
import TripList from './list';
import CompletedTrips from './completed';
import AddTrip from './add';
import Quotation from './quotation';
import AddIcon from '@mui/icons-material/Add';
// import ArchivedTrips from './archived';
import { strictValidObjectWithKeys } from '../../utils/common-utils';
import WindowTitle from '../../components/window-name';
import Clock from '../../components/clock';
import { tablePadding } from '../../assets/styles';
import { connect } from 'react-redux';
import { getActiveCapabilityRoles } from '../drivers-management/action';
import { flushQuote } from './action';
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

const TripsManagement = ({
  callCapabilityRolesApi,
  callflushQuote,
  current_tripData,
}) => {
  const [value, setValue] = useState('1');
  const classes = useStyles();
  const [tripData, setTripData] = useState({});
  const [scheduled_type, setScheduleType] = useState(false);
  const [isQuote, setIsQuote] = useState(false);
  const handleChange = (event, newValue) => {
    if (newValue === '2') {
      setValue(newValue);
    } else {
      callCapabilityRolesApi();
      setTripData({});
      setValue(newValue);
    }
    if (newValue !== 4) {
      setScheduleType(false);
    }
  };

  useEffect(() => {
    callflushQuote();
  }, []);

  const addTrip = () => {
    setTripData({});
    setValue('2');
  };
  const _renderlabel = () => {
    if (
      strictValidObjectWithKeys(tripData) &&
      !tripData.copy &&
      !tripData.isNew
    ) {
      return 'Edit trip';
    } else {
      return 'New Trip';
    }
  };

  return (
    <div className={classes.root}>
      <WindowTitle title="Trip Management" />
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
                <TopTab label="Trip List" value={'1'} />
                <TopTab label={'Completed Trips'} value={'3'} />
                {/* <TopTab label={'Archieved Trips'} value={'4'} /> */}
                <TopTab label={'Quotation'} value={'4'} />
                <TopTab
                  // label={
                  //   strictValidObjectWithKeys(tripData)
                  //     ? 'Edit Trip'
                  //     : 'New Trip'
                  // }
                  label={_renderlabel()}
                  value={'2'}
                />
              </TabList>
              <Stack direction="row" alignItems="center">
                <Clock>
                  <Button
                    size="medium"
                    variant="contained"
                    onClick={() => addTrip()}
                    color="primary"
                    startIcon={<AddIcon />}
                    className={classes.button}
                    disabled={value === '2' || value === '4'}
                  >
                    Add Trip
                  </Button>
                </Clock>
              </Stack>
            </Box>
            <main className={classes.content}>
              <TabPanel sx={tablePadding} value={'1'}>
                <Grid item xs={12} md={12} lg={12}>
                  <TripList
                    setData={(e) => {
                      setTripData(e);
                      setScheduleType(false);
                    }}
                    setValue={(val) => {
                      setValue(val);
                    }}
                    editTripTabDisabled={false}
                  />
                </Grid>
              </TabPanel>
              <TabPanel sx={tablePadding} value={'3'}>
                <CompletedTrips
                  setData={(e) => {
                    setTripData(e);
                    setScheduleType(true);
                  }}
                  setValue={() => setValue('2')}
                  editTripTabDisabled={true}
                />
              </TabPanel>
              <TabPanel value={'2'}>
                <AddTrip
                  isQuote={isQuote}
                  current_tripData={tripData}
                  editTripTabDisabled={scheduled_type}
                  setTripData={() => {
                    setTripData({});
                  }}
                  setValue={() => {
                    if (
                      strictValidObjectWithKeys(tripData) &&
                      tripData.completed === true
                    ) {
                      setValue('3');
                      setTripData({});
                      setScheduleType(false);
                    } else {
                      setValue('1');
                      setTripData({});
                      setScheduleType(false);
                    }
                  }}
                />
              </TabPanel>
              {/* <TabPanel sx={tablePadding} value={'4'}>
                <ArchivedTrips
                  setData={(e) => {
                    setTripData(e);
                    setScheduleType(true);
                  }}
                  setValue={() => setValue('4')}
                  editTripTabDisabled={true}
                />
              </TabPanel> */}
              <TabPanel value={'4'}>
                <Quotation
                  current_tripData={tripData}
                  editTripTabDisabled={scheduled_type}
                  setIsQuote={setIsQuote}
                  setData={(e) => {
                    setTripData(e);
                  }}
                  setValue={(val) => {
                    setValue(val);
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

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callCapabilityRolesApi: (...params) =>
    dispatch(getActiveCapabilityRoles(...params)),
  callflushQuote: (...params) => dispatch(flushQuote(...params)),
});

export default connect(null, mapDispatchToProps)(TripsManagement);

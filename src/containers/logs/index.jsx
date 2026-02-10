/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState } from 'react';
import { Button, CssBaseline, Grid, Stack } from '@mui/material';
import Sidebar from '../../components/sidebar';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import TopTab from '../../components/top-tab';
import ApplicationLogs from './application-logs';
import WindowTitle from '../../components/window-name';
import Clock from '../../components/clock';
import { tablePadding } from '../../assets/styles';
import AuditLogs from './audit-logs';
import { useDispatch } from 'react-redux';
import { getAuditLogs, getSocketApplicationLogs } from './action';

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
  headerText: {
    fontSize: 14,
    fontWeight: '700',
  },
  mainHeaderText: {
    fontSize: 16,
    fontWeight: '700',
  },
  button: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(2),
    backgroundColor: '#FAFAFA',
  },
  textField: {
    width: '100%',
  },
  input: {
    fontSize: 14,
  },
  helperText: {
    margin: `${theme.spacing(0.2, 0, 0, 0)} !important`,
    backgroundColor: '#F3F3F3',
  },
  disabledCheckbox: {
    backgroundColor: '#F3F3F3',
  },
}));

const Logs = () => {
  const [value, setValue] = useState('1');
  const classes = useStyles();
  const dispatch = useDispatch();
  const [freezeLogs, setFreezeLogs] = useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className={classes.root}>
      <WindowTitle title="Logs Management" />
      <CssBaseline />
      <Sidebar onChange={() => setValue('1')} />
      <main className={classes.content}>
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
                <TopTab
                  label="Application Logs"
                  value={'1'}
                  ids="application_logs"
                />
                <TopTab label={'Audit Logs'} value={`2`} ids={'audit_logs'} />
              </TabList>
              <Stack direction="row" alignItems="center">
                <Clock>
                  {value === '1' && (
                    <Button
                      size="medium"
                      variant="contained"
                      onClick={() => {
                        setFreezeLogs(!freezeLogs);
                        dispatch(getAuditLogs(!freezeLogs));
                        if (freezeLogs) {
                          dispatch(getSocketApplicationLogs());
                        }
                      }}
                      color="primary"
                      className={classes.button}
                    >
                      {freezeLogs ? 'Unfreeze Logs' : 'Freeze Logs'}
                    </Button>
                  )}
                </Clock>
              </Stack>
            </Box>
            <TabPanel sx={tablePadding} value={'1'}>
              <ApplicationLogs />
            </TabPanel>
            <TabPanel sx={tablePadding} value={'2'}>
              <AuditLogs setLog={(e) => setFreezeLogs(e)} />
            </TabPanel>
          </TabContext>
        </Grid>
      </main>
    </div>
  );
};

export default Logs;

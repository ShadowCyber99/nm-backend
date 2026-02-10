import React, { useEffect, useState } from 'react';
import { Button, CssBaseline, Grid, Stack } from '@mui/material';
import Sidebar from '../../components/sidebar/index.jsx';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import TopTab from '../../components/top-tab/index.jsx';
import WindowTitle from '../../components/window-name/index.jsx';
import Clock from '../../components/clock/index.jsx';
import PaymentList from './payment-list/index.jsx';
import AddPayment from './add-payment/index.jsx';
import { getPaymentMethod } from '../billing/action.js';
import { connect } from 'react-redux';
import { getCorporateAccounts } from './action.js';
import { strictValidObjectWithKeys } from '../../utils/common-utils.js';
import AddIcon from '@mui/icons-material/Add';
import { tablePadding } from '../../assets/styles/index.js';

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

const InvoiceManagement = ({
  callPaymentMethodApi,
  callCorporateAccountApi,
}) => {
  const [value, setValue] = useState('1');
  const [data, setData] = useState({});
  const classes = useStyles();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    callPaymentMethodApi();
    callCorporateAccountApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.root}>
      <WindowTitle title="Payments" />
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
                <TopTab label={'Payment List'} value={'1'} />
                <TopTab
                  label={
                    strictValidObjectWithKeys(data)
                      ? 'Edit Payment'
                      : 'Add Payment'
                  }
                  value={'2'}
                />
              </TabList>
              <Stack direction="row" alignItems="center">
                <Clock>
                  <Button
                    size="medium"
                    variant="contained"
                    onClick={() => handleChange('', '2')}
                    color="primary"
                    startIcon={<AddIcon />}
                    className={classes.button}
                    disabled={value === '2'}
                  >
                    Add Payment
                  </Button>
                </Clock>
              </Stack>
            </Box>
            <main className={classes.content}>
              <TabPanel sx={tablePadding} value={'1'}>
                <PaymentList
                  setData={(e) => {
                    setData(e);
                    handleChange('', '2');
                  }}
                />
              </TabPanel>
              <TabPanel value={'2'}>
                <AddPayment
                  data={data}
                  setValue={(e) => {
                    handleChange('', e);
                    setData({});
                  }}
                  setdata={(e) => {
                    setData(e);
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
  callPaymentMethodApi: (...params) => dispatch(getPaymentMethod(...params)),
  callCorporateAccountApi: (...params) =>
    dispatch(getCorporateAccounts(...params)),
});

export default connect(null, mapDispatchToProps)(InvoiceManagement);

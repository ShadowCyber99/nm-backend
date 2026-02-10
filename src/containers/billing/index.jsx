import React, { useContext, useEffect, useState } from 'react';
import { CssBaseline, Grid, Stack } from '@mui/material';
import Sidebar from '../../components/sidebar/index.jsx';
import { LoadingButton, TabContext, TabList } from '@mui/lab';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import TopTab from '../../components/top-tab/index.jsx';
import InvoicingList from './invoicing/index.jsx';
import CreatedInvoice from './created-invoice/index.jsx';
import {
  strictValidArrayWithLength,
  strictValidNumber,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../utils/common-utils';
import CheckIcon from '@mui/icons-material/Check';
import { connect } from 'react-redux';
import {
  getFilterInvoice,
  createInvoicing,
  resetFilterInvoice,
  updateValidateInvoice,
  resetInvoiceReducer,
  getAllInvoicing,
  billedInvoice as billedInvoiceApi,
  getValidateInvoice,
} from './action';
import AddTrip from './../trip-management/add';
import BilledInvoice from './billed-invoice/index.jsx';
import BillingList from './billing/index';
import WindowTitle from '../../components/window-name/index.jsx';
import Clock from '../../components/clock/index.jsx';
import ValidateInvoice from './validated/index';
import CompletedTrips from './completed/index';
import { BillingStatus } from '../../utils/constant.js';
import LockedInvoice from './locked';
import PartiallyPaidInvoice from './part-paid';
import SentInvoice from './sent-invoice';
import FullyPaidInvoice from './fully-paid';
import RefundedInvoice from './refunded';
import Uninvoiced from './uninvoiced';
import DisputedInvoice from './disputed';
import DisputedAcceptedInvoice from './disputed-accepted';
import CancelledInvoice from './canceled';
import store from 'store2';
import { buttonRoleAccess } from '../../utils/traits.js';
import { SocketContext } from '../../hooks/useSocketContext.js';
import { useLocation, useNavigate } from 'react-router-dom';

const BILLING_ROUTES_MAP = {
  1: 'invoicing',
  2: 'create-invoices',
  3: 'initialized',
  4: 'validated',
  5: 'locked',
  6: 'sent',
  7: 'part-paid',
  8: 'fully-paid',
  9: 'refunded',
  10: 'uninvoiced',
  11: 'disputed',
  12: 'dispute-accepted',
  13: 'canceled',
  14: 'completed-trips',
  15: 'billing-report',
  16: 'edit-trip',
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    height: '94vh',
    // overflow: 'auto',
    backgroundColor: '#F3F3F3',
    padding: '6px',
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
  callFilterApi,
  callCreateInvoicingApi,
  callUpdateValidateInvoice,
  isLoad,
  callresetFilterApi,
  callResetAllData,
  callInvoicingApi,
  callBilledInvoiceApi,
  callValidateInvoiceApi,
  validateData,
  lockedData,
  billedData,
}) => {
  const [currentTab, setCurrentTab] = useState(1);
  const classes = useStyles();
  const [tripData, setTripData] = useState({});
  const [transport, setTransport] = useState({});
  const [mul_invoice_id, setInvoiceAccount] = useState([]);
  const [warning, setWarning] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState([]);
  const userValue = store.get('user') || {};
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentTabValue = location.pathname?.replace(
      /(^\/?billing\/?|\/$)/g,
      '',
    );
    if (currentTabValue) {
      const currentTabKey = Object.keys(BILLING_ROUTES_MAP).find(
        (key) => BILLING_ROUTES_MAP[Number(key)] === currentTabValue,
      );
      currentTabKey && setCurrentTab(Number(currentTabKey));
    } else {
      // setCurrentTab(1);
      if (location.pathname?.replace(/(^\/|\/$)/g, '') === 'billing') {
        navigate(BILLING_ROUTES_MAP[1]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handleTabChange = (e, tabKey) => {
    tabKey = Number(tabKey);
    navigate(`/billing/${BILLING_ROUTES_MAP[tabKey]}`);

    if (tabKey !== 2) {
      callResetAllData();
    }
    if (tabKey !== 16) {
      setTripData({});
    }
    if (tabKey === 1) {
      setTransport({});
    }
    // switch (tabKey) {
    //   case 1:
    //     callInvoicingApi();
    //     break;
    //   case 2:
    //     // call api for Tab2
    //     break;
    //   // case 3:
    //   //   callBilledInvoiceApi({
    //   //     limit: 10,
    //   //     skip: 0,
    //   //   });
    //   //   break;
    //   case 4:
    //     callValidateInvoiceApi({
    //       type: BillingStatus.VALIDATED_STATUS,
    //       reducer: 'validate',
    //     });
    //     break;
    //   case 5:
    //     callValidateInvoiceApi({
    //       type: BillingStatus.LOCKED_STATUS,
    //       reducer: 'locked',
    //     });
    //     break;
    //   case 6:
    //     callValidateInvoiceApi({
    //       type: BillingStatus.SEND_INVOICE_STATUS,
    //       reducer: 'sent',
    //     });
    //     break;
    //   case 7:
    //     callValidateInvoiceApi({
    //       type: BillingStatus.PARTIALLY_PAID_STATUS,
    //       reducer: 'partPaid',
    //     });
    //     break;
    //   case 8:
    //     callValidateInvoiceApi({
    //       type: BillingStatus.FULLY_PAID_STATUS,
    //       reducer: 'fullyPaid',
    //     });
    //     break;
    //   case 9:
    //     callValidateInvoiceApi({
    //       type: BillingStatus.REFUNDED_STATUS,
    //       reducer: 'refunded',
    //     });
    //     break;
    //   case 10:
    //     callValidateInvoiceApi({
    //       type: BillingStatus.UNINVOICED_STATUS,
    //       reducer: 'uninvoiced',
    //     });
    //     break;
    //   case 11:
    //     callValidateInvoiceApi({
    //       type: BillingStatus.DISPUTED_STATUS,
    //       reducer: 'disputed',
    //     });
    //     break;
    //   case 12:
    //     callValidateInvoiceApi({
    //       type: BillingStatus.DISPUTE_ACCEPTED_STATUS,
    //       reducer: 'disputedAccepted',
    //     });
    //     break;
    //   case 13:
    //     callValidateInvoiceApi({
    //       type: BillingStatus.CANCELLED_STATUS,
    //       reducer: 'canceled',
    //     });
    //     break;
    //   default:
    //     return null;
    // }
  };

  const socketCall = () => {
    socket.emit('add_payments');
  };

  const createInvoice = async () => {
    transport.non_invoice_id = mul_invoice_id;
    const res = await callCreateInvoicingApi(transport);
    if (res) {
      handleTabChange(null, 3);
      socketCall();
    }
  };

  const addTrip = async () => {
    const res = await callFilterApi(transport);
    if (res) {
      handleTabChange(null, 2);
      // setTransport({});
    }
  };

  const validateAllInvoice = async () => {
    const res = await callUpdateValidateInvoice({
      account_id: 'all',
      type: 'validated',
    });
    if (res) {
      handleTabChange(null, 4);
      socketCall();
    }
  };

  const lockedAllInvoice = async () => {
    const res = await callUpdateValidateInvoice({
      account_id: 'all',
      type: 'locked',
    });
    if (res) {
      handleTabChange(null, 5);
      socketCall();
    }
  };

  const sentAllInvoice = async () => {
    const res = await callUpdateValidateInvoice({
      account_id: 'all',
      type: 'send_invoiced',
    });
    if (res) {
      handleTabChange(null, 6);
      socketCall();
    }
  };

  const checkValidStringInObject = (transport_data) => {
    if (
      strictValidString(transport_data.start_date) &&
      strictValidString(transport_data.end_date) &&
      strictValidNumber(transport_data.account_id)
    ) {
      return false;
    } else if (
      strictValidString(transport_data.end_date) &&
      strictValidNumber(transport_data.account_id)
    ) {
      return false;
    } else if (strictValidNumber(transport_data.account_id)) {
      return false;
    } else if (
      transport_data.account_id === 'all' &&
      strictValidString(transport_data.start_date) &&
      strictValidString(transport_data.end_date)
    ) {
      return false;
    } else if (
      transport_data.account_id === 'all' &&
      !strictValidString(transport_data.start_date) &&
      !strictValidString(transport_data.end_date) &&
      strictValidString(transport_data.trip_id)
    ) {
      return true;
    } else if (strictValidString(transport_data.sub_account_id)) {
      return false;
    } else if (strictValidString(transport_data.trip_id)) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <div className={classes.root}>
      <WindowTitle title="Billing" />
      <CssBaseline />
      <Sidebar />
      <main className={classes.mainRoot}>
        <Grid item>
          <TabContext value={currentTab}>
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
                // variant="scrollable"
                onChange={handleTabChange}
                aria-label="lab API tabs example"
              >
                <TopTab label="Invoicing" value={1} />
                <TopTab label="Create Invoices" value={2} />
                <TopTab label="Initialized" value={3} />
                <TopTab label="Validated" value={4} />
                <TopTab label="Locked" value={5} />
                <TopTab label="Sent" value={6} />
                <TopTab label="Part Paid" value={7} />
                <TopTab label="Fully Paid" value={8} />
                <TopTab label="Refunded" value={9} />
                <TopTab label="Uninvoiced" value={10} />
                <TopTab label="Disputed" value={11} />
                <TopTab label="Dispute Accepted" value={12} />
                <TopTab label="Canceled" value={13} />
                <TopTab label="Completed Trips" value={14} />
                <TopTab label="Billing Report" value={15} />
                {strictValidObjectWithKeys(tripData) && (
                  <TopTab label="Edit Trip" value={16} />
                )}
              </TabList>
              <Stack direction="row" alignItems="center">
                <Clock>
                  {currentTab === 2 && (
                    <LoadingButton
                      size="medium"
                      loading={isLoad}
                      variant="contained"
                      color="primary"
                      onClick={() => createInvoice()}
                      startIcon={<CheckIcon />}
                      className={classes.button}
                      disabled={
                        buttonRoleAccess(
                          'CreateInvoices',
                          strictValidObjectWithKeys(userValue) &&
                            userValue.role_id,
                        ) || !strictValidArrayWithLength(createdInvoice)
                      }
                    >
                      Create Invoices
                    </LoadingButton>
                  )}
                  {currentTab === 1 && (
                    <LoadingButton
                      size="medium"
                      loading={isLoad}
                      variant="contained"
                      onClick={() => addTrip()}
                      color="primary"
                      startIcon={<CheckIcon />}
                      className={classes.button}
                      disabled={
                        (strictValidObjectWithKeys(transport) &&
                          checkValidStringInObject(transport)) ||
                        !strictValidObjectWithKeys(transport) ||
                        warning ||
                        buttonRoleAccess(
                          'InvoicingSelectTrips',
                          strictValidObjectWithKeys(userValue) &&
                            userValue.role_id,
                        )
                      }
                    >
                      Select Trips
                    </LoadingButton>
                  )}
                  {currentTab === 3 && (
                    <LoadingButton
                      size="medium"
                      loading={isLoad}
                      variant="contained"
                      onClick={() => validateAllInvoice()}
                      disabled={
                        buttonRoleAccess(
                          'InvoicingValidateAll',
                          strictValidObjectWithKeys(userValue) &&
                            userValue.role_id,
                        ) || !strictValidArrayWithLength(billedData)
                      }
                      color="primary"
                      startIcon={<CheckIcon />}
                      className={classes.button}
                    >
                      Validate All
                    </LoadingButton>
                  )}
                  {currentTab === 4 && (
                    <LoadingButton
                      size="medium"
                      loading={isLoad}
                      variant="contained"
                      onClick={() => lockedAllInvoice()}
                      disabled={
                        (strictValidObjectWithKeys(validateData) &&
                          !strictValidArrayWithLength(validateData.result)) ||
                        buttonRoleAccess('InvoicingLockAll', userValue.role_id)
                      }
                      color="primary"
                      startIcon={<CheckIcon />}
                      className={classes.button}
                    >
                      Lock All
                    </LoadingButton>
                  )}
                  {currentTab === 5 && (
                    <LoadingButton
                      size="medium"
                      loading={isLoad}
                      variant="contained"
                      onClick={() => sentAllInvoice()}
                      color="primary"
                      disabled={
                        (strictValidObjectWithKeys(lockedData) &&
                          !strictValidArrayWithLength(lockedData.result)) ||
                        buttonRoleAccess('InvoicingSentAll', userValue.role_id)
                      }
                      startIcon={<CheckIcon />}
                      className={classes.button}
                    >
                      Sent All
                    </LoadingButton>
                  )}
                </Clock>
              </Stack>
            </Box>
            <main className={classes.content}>
              {BILLING_ROUTES_MAP[currentTab] === 'invoicing' && (
                <Grid item xs={12} md={12} lg={12}>
                  <InvoicingList
                    setTripData={(e) => setTripData(e)}
                    setData={(e) => setTransport(e)}
                    setWarning={(e) => setWarning(e)}
                  />
                </Grid>
              )}
              {BILLING_ROUTES_MAP[currentTab] === 'create-invoices' && (
                <CreatedInvoice
                  setCreatedInvoices={(e) => setCreatedInvoice(e)}
                  setInvoiceData={(e) => setInvoiceAccount(e)}
                />
              )}
              {BILLING_ROUTES_MAP[currentTab] === 'initialized' && (
                <BilledInvoice
                  redirectNumber={4}
                  setCurrentTab={(tabKey) => handleTabChange(null, tabKey)}
                  redirectToMain={13}
                />
              )}
              {BILLING_ROUTES_MAP[currentTab] === 'validated' && (
                <ValidateInvoice
                  redirectNumber={5}
                  redirectFirstOption={10}
                  redirectSecondOption={13}
                  buttonText="Lock Invoice"
                  icon="locked"
                  errorFirstIcon="uninvoiced"
                  errorSecondIcon="close"
                  formType={BillingStatus.VALIDATED_STATUS}
                  errorSecondButton="Cancel Invoice"
                  errorFirstButton="Uninvoice"
                  errorFirstButtonValue={BillingStatus.UNINVOICED_STATUS}
                  errorSecondButtonValue={BillingStatus.CANCELLED_STATUS}
                  buttonValue={BillingStatus.LOCKED_STATUS}
                  emptyText="Validated"
                  currentTab={currentTab}
                  setCurrentTab={(tabKey) => handleTabChange(null, tabKey)}
                />
              )}
              {BILLING_ROUTES_MAP[currentTab] === 'locked' && (
                <LockedInvoice
                  redirectNumber={6}
                  redirectFirstOption={10}
                  redirectSecondOption={13}
                  buttonText="Send Invoice"
                  formType={BillingStatus.LOCKED_STATUS}
                  icon="sent"
                  errorFirstButton="Uninvoice"
                  errorFirstIcon="uninvoiced"
                  errorFirstButtonValue={BillingStatus.UNINVOICED_STATUS}
                  errorSecondButtonValue={BillingStatus.CANCELLED_STATUS}
                  buttonValue={BillingStatus.SEND_INVOICE_STATUS}
                  emptyText="Locked"
                  currentTab={currentTab}
                  setCurrentTab={(tabKey) => handleTabChange(null, tabKey)}
                />
              )}
              {BILLING_ROUTES_MAP[currentTab] === 'sent' && (
                <SentInvoice
                  redirectNumber={8}
                  redirectFirstOption={10}
                  redirectSecondOption={11}
                  redirectPopupNumber={7}
                  buttonText="Receive"
                  formType={BillingStatus.SEND_INVOICE_STATUS}
                  icon="receive"
                  errorFirstButton="Uninvoice"
                  errorFirstIcon="uninvoiced"
                  onSubmitValue=""
                  errorSecondButton="Open Dispute"
                  errorSecondIcon="dispute"
                  errorFirstButtonValue={BillingStatus.UNINVOICED_STATUS}
                  errorSecondButtonValue={BillingStatus.DISPUTED_STATUS}
                  buttonValue={BillingStatus.FULLY_PAID_STATUS}
                  popupButtonValue={BillingStatus.PARTIALLY_PAID_STATUS}
                  fullyPay
                  emptyText="Sent"
                  currentTab={currentTab}
                  setCurrentTab={(tabKey) => handleTabChange(null, tabKey)}
                />
              )}
              {BILLING_ROUTES_MAP[currentTab] === 'part-paid' && (
                <PartiallyPaidInvoice
                  redirectNumber={8}
                  redirectFirstOption={9}
                  redirectSecondOption={11}
                  buttonText="Receive"
                  formType={BillingStatus.PARTIALLY_PAID_STATUS}
                  errorFirstButton="Refund"
                  extraButtonIcon="refund"
                  errorFirstButtonValue={BillingStatus.REFUNDED_STATUS}
                  emptyText="Partially Paid"
                  popupButtonValue={BillingStatus.PARTIALLY_PAID_STATUS}
                  fullyPay
                  currentTab={currentTab}
                  setCurrentTab={(tabKey) => handleTabChange(null, tabKey)}
                  refundInvoice
                />
              )}
              {BILLING_ROUTES_MAP[currentTab] === 'fully-paid' && (
                <FullyPaidInvoice
                  redirectNumber={9}
                  buttonText="Refund Invoice"
                  buttonValue="refunded"
                  formType={BillingStatus.FULLY_PAID_STATUS}
                  emptyText="Fully Paid"
                  // errorFirstButton="Archive"
                  redirectFirstOption={1}
                  errorFirstButtonValue={BillingStatus.ARCHIVE_STATUS}
                  refundInvoice
                  currentTab={currentTab}
                  setCurrentTab={(tabKey) => handleTabChange(null, tabKey)}
                />
              )}
              {BILLING_ROUTES_MAP[currentTab] === 'refunded' && (
                <RefundedInvoice
                  redirectNumber={1}
                  // buttonText="Archive Invoice"
                  buttonValue={BillingStatus.ARCHIVE_STATUS}
                  formType={BillingStatus.REFUNDED_STATUS}
                  emptyText="Refunded"
                  setCurrentTab={(tabKey) => handleTabChange(null, tabKey)}
                  currentTab={currentTab}
                />
              )}
              {BILLING_ROUTES_MAP[currentTab] === 'uninvoiced' && (
                <Uninvoiced
                  redirectNumber={1}
                  // buttonText="Archive Invoice"
                  // buttonValue="disputed"
                  formType={BillingStatus.UNINVOICED_STATUS}
                  emptyText="Uninvoiced"
                  buttonValue={BillingStatus.ARCHIVE_STATUS}
                  currentTab={currentTab}
                  setCurrentTab={(tabKey) => handleTabChange(null, tabKey)}
                />
              )}
              {BILLING_ROUTES_MAP[currentTab] === 'disputed' && (
                <DisputedInvoice
                  redirectNumber={12}
                  buttonText="Dispute Accepted"
                  redirectFirstOption={6}
                  formType={BillingStatus.DISPUTED_STATUS}
                  emptyText="Disputed"
                  errorThirdButtonValue={BillingStatus.SEND_INVOICE_STATUS}
                  buttonValue={BillingStatus.DISPUTE_ACCEPTED_STATUS}
                  errorThirdButtonText={'Send Invoice'}
                  extraButtonIcon="sent"
                  currentTab={currentTab}
                  setCurrentTab={(tabKey) => handleTabChange(null, tabKey)}
                />
              )}
              {BILLING_ROUTES_MAP[currentTab] === 'dispute-accepted' && (
                <DisputedAcceptedInvoice
                  redirectNumber={4}
                  buttonText="Validate Invoice"
                  buttonValue={BillingStatus.VALIDATED_STATUS}
                  formType={BillingStatus.DISPUTE_ACCEPTED_STATUS}
                  emptyText="Disputed Accepted"
                  currentTab={currentTab}
                  setCurrentTab={(tabKey) => handleTabChange(null, tabKey)}
                />
              )}
              {BILLING_ROUTES_MAP[currentTab] === 'canceled' && (
                <CancelledInvoice
                  redirectNumber={1}
                  // buttonText="Archive Invoice"
                  buttonValue={BillingStatus.ARCHIVE_STATUS}
                  formType={BillingStatus.CANCELLED_STATUS}
                  emptyText="Canceled"
                  currentTab={currentTab}
                  setCurrentTab={(tabKey) => handleTabChange(null, tabKey)}
                />
              )}
              {BILLING_ROUTES_MAP[currentTab] === 'completed-trips' && (
                <CompletedTrips
                  setTripData={(e) => setTripData(e)}
                  setData={(e) => {
                    setTransport(e);
                  }}
                />
              )}
              {BILLING_ROUTES_MAP[currentTab] === 'billing-report' && (
                <BillingList />
              )}
              {BILLING_ROUTES_MAP[currentTab] === 'edit-trip' &&
                strictValidObjectWithKeys(tripData) && (
                  <AddTrip
                    editTripTabDisabled={true}
                    current_tripData={tripData}
                    setValue={() => {
                      handleTabChange(null, 1);
                      setTripData({});
                    }}
                  />
                )}
            </main>
          </TabContext>
        </Grid>
      </main>
    </div>
  );
};

const mapStateProps = (state) => {
  return {
    message: state.billing.filterInvoice.message,
    isLoad: state.billing.filterInvoice.isLoad,
    loadErr: state.billing.filterInvoice.loadErr,
    data: state.billing.filterInvoice.data,
    isLoadInner: state.billing.filterInvoice.isLoadInner,
    validateData: state.billing.validateInvoice.validate,
    lockedData: state.billing.validateInvoice.locked,
    billedData: state.billing.billedInvoice.data.result,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callFilterApi: (...params) => dispatch(getFilterInvoice(...params)),
  callCreateInvoicingApi: (...params) => dispatch(createInvoicing(...params)),
  callresetFilterApi: (...params) => dispatch(resetFilterInvoice(...params)),
  callUpdateValidateInvoice: (...params) =>
    dispatch(updateValidateInvoice(...params)),
  callResetAllData: (...params) => dispatch(resetInvoiceReducer(...params)),
  callInvoicingApi: (...params) => dispatch(getAllInvoicing(...params)),
  callBilledInvoiceApi: (...params) => dispatch(billedInvoiceApi(...params)),
  callValidateInvoiceApi: (...params) =>
    dispatch(getValidateInvoice(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(InvoiceManagement);
export { BILLING_ROUTES_MAP };

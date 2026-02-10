/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from 'react';
import {
  Grid,
  Stack,
  Typography,
  Box,
  IconButton,
  Tooltip,
  DialogContentText,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  DialogActions,
  Button,
  Divider,
  DialogContent,
  Checkbox,
} from '@mui/material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  defaultCurrencyFormat,
  formatDate,
  formatDateTime,
  isBlank,
  strictValidArrayWithLength,
  strictValidNumber,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/common-utils';
import BillingInfo from '../info-dialog';
import ReactTable from '../../../components/react-table';
import {
  finalizeInvoicing,
  deleteBilledInvoice,
  updateBilledInvoice,
  billedUpdateInvoice,
  updateBillingNotesInInvoice,
  getValidateInvoice,
  updateValidateInvoice,
  resetInvoiceReducer,
  getPartialInvoiceById,
  updatePaymentInvoice,
  saveInvoiceStatus,
  getPdfFromTrip,
  deleteInvoiceId,
  getPaymentMethod,
  getAllPaymentsOnBilling,
  resetInvoiceStatus,
  socketValidateInvoice,
  getBillingAudit,
  invoiceAudit,
  getTripDetails,
  saveState,
  getState,
} from '../action';
import { useEffect } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InfoTable from '../../payment/info-dialog';
import { LoadingButton } from '@mui/lab';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@mui/styles';
import {
  BillingStatus,
  BillingStatusPreDefined,
  DefaultDate,
  renderBillingStatus,
  renderPaymentStatus,
  renderPaymentType,
  transportStatus,
} from '../../../utils/constant';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import SendIcon from '@mui/icons-material/ForwardToInboxTwoTone';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import GavelIcon from '@mui/icons-material/Gavel';
import Dialog from '../../../components/dialog';
import { Field, Form } from 'react-final-form';
import FinalFormText from '../../../components/final-form/input-text';
import createDecorator from 'final-form-focus';
import RestoreIcon from '@mui/icons-material/Restore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Menu from '@mui/material/Menu';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import MDTooltip from '../../../components/tooltip';
import {
  DateFilter,
  SelectColumnFilter,
} from '../../../components/react-table/helper';
import { OnlyAdmins, OnlySuperAdmin } from '../../../utils/routesPermission';
import { updateItem } from '../../../utils/mutation';
import store from 'store2';
import { buttonRoleAccess } from '../../../utils/traits';
import InvoiceDetailModal from '../common/invoiceDetailModal';
import { SocketContext } from '../../../hooks/useSocketContext';
import { get } from 'lodash';
import EmptyContainerLoad from '../../../components/empty-container-load';

const apiHost = process.env.REACT_APP_BASE_URL;

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  bottomBar: {
    top: 'auto',
    bottom: 0,
    background: '#fff',
  },
  margin: {
    marginLeft: theme.spacing(1),
  },
  alignRight: {
    textAlign: 'right',
    display: 'block',
    width: '100%',
  },
  backDrop: {
    backgroundColor: 'rgba(235, 235, 235, 0.7)',
  },
  header: {
    width: 100,
    marginTop: theme.spacing(0.5),
  },
  headerDetails: {
    width: 140,
  },
  marginLeft: {
    margin: theme.spacing(0, 0, 0, 1),
  },
  subtitle: {
    width: 260,
    marginTop: theme.spacing(0.5),
  },
  generalMargin: {
    margin: theme.spacing(1, 0, 1),
  },
  warningTitle: {
    margin: theme.spacing(0.5, 2),
    fontSize: 20,
  },
  headerWidth: {
    width: 300,
  },
  mainHead: {
    margin: `${theme.spacing(1, 0, 0, 0)}`,
  },
  buttonForceAction: {
    width: 170,
  },
}));

const DisputedAcceptedInvoice = ({
  formType,
  buttonText,
  buttonValue,
  isLoad,
  isLoadInner,
  message,
  data,
  callAuditApi,
  callValidateInvoiceApi,
  callUpdateValidateInvoice,
  CallUpdateBillingNotesInInvoice,
  loadErr,
  errorSecondButton,
  errorFirstButton,
  icon,
  errorFirstButtonValue,
  errorSecondButtonValue,
  popupButtonText,
  emptyText = '',
  partialInvoiceData,
  partialInvoiceIsLoad,
  fullyPay = false,
  callRecievedInvoiceApi,
  callUpdatePaymentInvoiceApi,
  invoiceStatusIsLoad,
  invoiceStatusMessage,
  callDeleteInvoiceIdApi,
  callgetPdfFromTripApi,
  callInvoiceStatusApi,
  refundInvoice = false,
  errorThirdButtonText,
  errorThirdButtonValue,
  setCurrentTab,
  redirectNumber,
  redirectFirstOption,
  redirectSecondOption,
  redirectPopupNumber,
  callPaymentMethodApi,
  payments,
  paymentisLoadInner,
  callAllPaymentFromInvoiceApi,
  paymentisLoad,
  user,
  callResetInvoiceStatusApi,
  currentTab,
  callSocketValidateInvoiceApi,
  callInvoiceAudit,
  callTripDetailsApi,
  totalRecords,
  callSaveState,
  callGetState,
}) => {
  const [current, setCurrent] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [isInfoDialog, setIsInfoDialog] = useState(false);
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [isAddDialog, setIsAddDialog] = useState(false);
  const [isMoreDialog, setIsMoreDialog] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [isViewInvoice, setIsViewInvoice] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isRefundDialog, setRefundDialog] = useState(false);
  const [currentViewData, setCurrentViewData] = useState();
  const [currentData, setCurrentData] = useState({});
  const [status, setStatus] = useState('');
  const [typeOfPayment, setTypeOfPayment] = useState('');
  const [type, setType] = useState('');
  const [deleteInvoiceId, setDeleteInvoiceId] = useState('');
  const [deleteInvoiceDialog, setDeleteInvoiceDialog] = useState(false);
  const [refundInvoiceState, setRefundInvoiceState] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [paymentType, setPaymentType] = useState([]);
  const [receiveInvoice, setReceiveInvoice] = useState({});
  const [initialAmount, setInitialAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [appliedAmount, setAppliedAmount] = useState(0);
  const [selectedInvoiceId, setSelectedInvoice] = useState([]);
  const [applyPaymentData, setApplyPaymentData] = useState([]);
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const focusOnErrors = createDecorator();
  const userValue = store.get('user') || {};
  const socket = useContext(SocketContext);
  // Call Sent Invoice API

  const [total, changeTotal] = useState(0);
  const [pagination, changePagination] = useState({
    total: 0,
    recordsPerPage: null,
    pageIndex: 0,
    currentPage: 1,
  });

  const changePageSize = (pageSize) => {
    // callAllTrip({ limit: pageSize, skip: 0 });
    changePagination((prevState) => ({
      ...prevState,
      recordsPerPage: pageSize,
      pageIndex: 0,
    }));
    callValidateInvoiceApi({
      type: BillingStatus.DISPUTE_ACCEPTED_STATUS,
      reducer: 'disputedAccepted',
      search: search,
      limit: pageSize,
      skip: 0,
    });
  };

  const searchQueryFilter = (e) => {
    callValidateInvoiceApi({
      type: BillingStatus.DISPUTE_ACCEPTED_STATUS,
      reducer: 'disputedAccepted',
      limit: pagination.recordsPerPage,
      skip: 0,
      search: e,
    });
    changePagination({
      ...pagination,
      recordsPerPage: pagination.recordsPerPage,
      pageIndex: 0,
    });
    setSearch(e);
  };
  const clearQueryFilter = (text) => {
    callValidateInvoiceApi({
      type: BillingStatus.DISPUTE_ACCEPTED_STATUS,
      reducer: 'disputedAccepted',
      limit: pagination.recordsPerPage,
      skip: 0,
      search: text,
    });
    changePagination({
      ...pagination,
      recordsPerPage: pagination.recordsPerPage,
      pageIndex: 0,
    });
    setSearch(text);
  };

  const setRecordsPerPage = (size) => {
    changePagination((prevState) => ({
      ...prevState,
      recordsPerPage: size,
    }));
    callValidateInvoiceApi({
      type: BillingStatus.DISPUTE_ACCEPTED_STATUS,
      reducer: 'disputedAccepted',
      search: search,
      limit: size,
      skip: pagination.pageIndex * size,
    });
  };

  useEffect(() => {
    if (pagination.recordsPerPage !== null) {
      callValidateInvoiceApi({
        type: BillingStatus.DISPUTE_ACCEPTED_STATUS,
        reducer: 'disputedAccepted',
        search: search,
        limit: pagination.recordsPerPage,
        skip: pagination.pageIndex * pagination.recordsPerPage,
      });
    }
  }, []);

  const changePageIndex = (pageIndex) => {
    changePagination({
      ...pagination,
      pageIndex: pageIndex,
    });
    callValidateInvoiceApi({
      type: BillingStatus.DISPUTE_ACCEPTED_STATUS,
      reducer: 'disputedAccepted',
      search: search,
      limit: pagination.recordsPerPage,
      skip: pageIndex * pagination.recordsPerPage,
    });
  };

  useEffect(() => {
    changeTotal(totalRecords);
    changePagination((prevState) => ({
      ...prevState,
      total: totalRecords,
    }));
  }, [totalRecords, data]);
  const callApi = () => {
    callValidateInvoiceApi({
      type: BillingStatus.DISPUTE_ACCEPTED_STATUS,
      reducer: 'disputedAccepted',
      search: search,
      limit: pagination.recordsPerPage,
      skip: pagination.pageIndex * pagination.recordsPerPage,
    });
  };
  const socketCallApi = () => {
    callSocketValidateInvoiceApi({
      type: BillingStatus.DISPUTE_ACCEPTED_STATUS,
      reducer: 'disputedAccepted',
      search: search,
      limit: pagination.recordsPerPage,
      skip: pagination.pageIndex * pagination.recordsPerPage,
    });
  };

  useEffect(() => {
    const data = {
      type: BillingStatus.DISPUTE_ACCEPTED_STATUS,
      reducer: 'disputedAccepted',
      search: search,
      limit: pagination.recordsPerPage,
      skip: pagination.pageIndex * pagination.recordsPerPage,
    };
    callSaveState(data);
    callGetState();
  }, [pagination]);

  useEffect(() => {
    if (strictValidArrayWithLength(payments)) {
      setApplyPaymentData(payments);
    }
    return () => {
      setApplyPaymentData([]);
    };
  }, [payments]);

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const deleteToggleInvoice = () => {
    setDeleteInvoiceDialog(!deleteInvoiceDialog);
  };

  const deleteInvoiceData = async (id) => {
    const dataId = {
      id: id,
    };
    const res = await callDeleteInvoiceIdApi(dataId);
    if (res) {
      deleteToggleInvoice();
      const data = {
        invoice_id: currentId.invoice_id,
      };
      callRecievedInvoiceApi(data);
    }
  };

  const downloadFile = (val) => {
    window.open(val, '_blank');
  };

  const downloadPdf = async (val, type) => {
    let response = await callgetPdfFromTripApi({
      invoice_id: val,
      pdf_type: type,
    });
    if (response) {
      downloadFile(`${apiHost}${response}`);
    }
  };

  const deleteInvoiceIdDialog = (id) => {
    return (
      <Dialog
        fullScreen={false}
        isOpen={deleteInvoiceDialog}
        title={'Are you sure ?'}
        handleClose={() => {
          deleteToggleInvoice();
        }}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Do you want to delete this invoice id ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="outlined"
            onClick={() => deleteToggleInvoice()}
          >
            No
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => deleteInvoiceData(deleteInvoiceId)}
          >
            Yes, Do It
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const infoToggle = () => {
    setIsInfoDialog(!isInfoDialog);
  };

  const infoDialog = () => {
    return (
      <Dialog
        fullScreen={true}
        isOpen={isInfoDialog}
        fullWidth={true}
        maxWidth={false}
        closeIcon={true}
        title={`Billing Info`}
        handleClose={() => {
          infoToggle();
          callApi();
        }}
      >
        <DialogContent>
          <BillingInfo data={current} emptyText={'Dispute Accepted'} />
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: 'space-evenly', display: 'flex', mt: 2 }}
        >
          <Button
            className={classes.buttonForceAction}
            color="error"
            variant="outlined"
            onClick={() => {
              infoToggle();
              callApi();
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const socketCall = () => {
    if (currentTab === 12) {
      setRefreshing(true);
      socketCallApi();
    }
  };

  useEffect(() => {
    socket.on('refresh_payments', () => {
      socketCall();
    });
    return () => {
      socket.off('refresh_payments');
    };
  }, [currentTab]);

  const updateInvoiceId = async (id, value, redirectKey) => {
    const res = await callUpdateValidateInvoice({
      invoice_id: id,
      type: value,
    });
    if (res) {
      if (strictValidArrayWithLength(data) && data.length === 1) {
        setCurrentTab(Number(redirectKey));
      } else {
        callApi();
      }
      emitPayment();
      setIsMoreDialog(false);
      setRefundDialog(false);
    }
  };
  const showErr = (message) => {
    enqueueSnackbar(message, {
      variant: 'error',
      preventDuplicate: true,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
    });
  };
  const emitPayment = () => {
    socket.emit('add_payments');
  };
  const updateInvoice = async (id, value) => {
    setRefreshing(true);
    const res = await callUpdateValidateInvoice({
      invoice_id: id,
      type: value,
    });
    if (res) {
      setRefreshing(false);
      callApi();
      setIsMoreDialog(false);
      setStatus('');
      emitPayment();
    } else {
      setRefreshing(false);
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

  useEffect(() => {
    if (invoiceStatusMessage)
      enqueueSnackbar(invoiceStatusMessage, {
        variant: 'success',
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
  }, [invoiceStatusMessage]);

  const renderDialog = () => {
    const title = 'Update Notes';
    return (
      <Dialog
        fullScreen={false}
        isOpen={isOpenDialog}
        fullWidth
        maxWidth={'sm'}
        title={title}
        handleClose={() => {
          toggle();
        }}
      >
        <Form
          onSubmit={onSubmitNotes}
          keepDirtyOnReinitialize
          decorators={[focusOnErrors]}
          initialValues={{
            notes: strictValidObjectWithKeys(current) ? current.notes : '',
          }}
          validate={(values) => {
            const errors = {};
            if (isBlank(values.notes)) {
              errors.notes = 'Note is required';
            }
            return errors;
          }}
          render={({
            handleSubmit,
            pristine,
            submitting,
            valid,
            touched,
            errors,
            values,
          }) => {
            return (
              <form handleSubmit={(e) => e.preventDefault()}>
                <Field
                  component={FinalFormText}
                  name="notes"
                  placeholder="Note"
                  required
                  errorText={touched.notes && errors.notes}
                  multiline
                  rows={6}
                />
                <LoadingButton
                  disabled={pristine || submitting || !valid}
                  onClick={handleSubmit}
                  type="submit"
                  fullWidth
                  size="large"
                  variant="contained"
                  loading={isLoad}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {title}
                </LoadingButton>
              </form>
            );
          }}
        />
      </Dialog>
    );
  };

  const refundInvoiceDialog = () => {
    const title = 'Warning!';
    return (
      <Dialog
        fullScreen={false}
        fullWidth={true}
        maxWidth={'sm'}
        isOpen={isRefundDialog}
        sxAppBar={{ justifyContent: 'center', alignItems: 'center' }}
        sxTitle={{ fontSize: 24 }}
        closeIcon={false}
        appBarColor="error"
        title={title}
        handleClose={() => {
          setRefundDialog(!isRefundDialog);
        }}
      >
        <DialogContentText variant="h3" className={classes.warningTitle}>
          Do you want to refund the invoice ?
        </DialogContentText>
        <DialogActions>
          <Button
            color="error"
            variant="outlined"
            onClick={() => setRefundDialog(!isRefundDialog)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              updateInvoiceId(
                refundInvoiceState.invoice_id,
                buttonValue,
                redirectNumber,
              );
            }}
            color="primary"
            variant="outlined"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const toggle = (val) => {
    if (strictValidObjectWithKeys(val)) {
      setCurrent(val);
    }
    setIsOpenDialog(!isOpenDialog);
  };

  const renderIcons = (key) => {
    switch (key) {
      case 'locked':
        return <LockIcon />;
      case 'close':
        return <CloseIcon />;
      case 'uninvoice':
        return <DoDisturbOnIcon />;
      case 'sent':
        return <SendIcon />;
      case 'receive':
        return <DownloadDoneIcon />;
      case 'dispute':
        return <GavelIcon />;
      case 'refund':
        return <RestoreIcon />;
      default:
        return <CheckIcon />;
    }
  };

  const deleteToggle = async (v) => {
    const data = {
      account_id: v.account_id,
    };
    setIsDeleteDialog(!isDeleteDialog);
    callAllPaymentFromInvoiceApi(data);
  };

  const onSubmitNotes = async (val) => {
    const res = await CallUpdateBillingNotesInInvoice({
      invoice_id: current.invoice_id,
      notes: val.notes,
      type: 'dispute_accepted',
    });
    if (res) {
      callApi();
      toggle();
      emitPayment();
    }
  };

  const addPayemntToggle = () => {
    setIsAddDialog(!isAddDialog);
  };
  const clearState = () => {
    setSelectedInvoice([]);
    setInitialAmount(0);
    setTotalAmount(0);
    setAppliedAmount(0);
    setReceiveInvoice({});
    setApplyPaymentData([]);
  };

  const savePaymentsOnBilling = async (totalAmount) => {
    const invoiceStatusData = {
      invoice_id: receiveInvoice.invoice_id,
      payment_id: selectedInvoiceId,
      account_id: receiveInvoice.account_id,
      amount_due: receiveInvoice.amount_due,
    };
    const res = await callInvoiceStatusApi(invoiceStatusData);
    if (res) {
      setIsDeleteDialog(!isDeleteDialog);
      clearState();
      socket.emit('add_payments');
      if (strictValidArrayWithLength(data) && data.length === 1) {
        if (totalAmount <= 0) {
          setCurrentTab(Number(redirectNumber));
        } else {
          setCurrentTab(7);
        }
      } else {
        callApi();
      }
      setTimeout(() => {
        callResetInvoiceStatusApi();
      }, 3000);
    }
  };
  const renderContent = (header, subtitle, error = false) => {
    return (
      <Stack className={classes.mainHead} direction="row">
        <Typography variant="h4" className={classes.headerWidth}>
          {header}
        </Typography>
        <Typography color={error && 'green'} variant="h4">
          {subtitle}
        </Typography>
      </Stack>
    );
  };

  const handleChangeCheckbox = (event, id) => {
    const { checked } = event.currentTarget;

    setSelectedInvoice((prev) =>
      checked ? [...prev, id] : prev.filter((val) => val !== id),
    );
  };

  const deleteDialog = () => {
    return (
      <Dialog
        fullScreen={true}
        closeIcon={false}
        isOpen={isDeleteDialog}
        fullWidth
        maxWidth={false}
        title={'Receive Invoice'}
        handleClose={() => {
          setIsDeleteDialog(!isDeleteDialog);
        }}
      >
        <Stack
          display={'flex'}
          py={2}
          flexDirection="row"
          justifyContent="space-between"
          // alignItems="center"
        >
          <Stack py={2}>
            {renderContent(
              'Receive Invoice',
              strictValidObjectWithKeys(receiveInvoice) &&
                `${receiveInvoice.invoice_id} / ${formatDate(
                  receiveInvoice.created_at,
                )}`,
            )}{' '}
            {renderContent(
              'Account',
              strictValidObjectWithKeys(receiveInvoice) &&
                `${receiveInvoice.name}`,
            )}
            {renderContent(
              'Amount Due',
              strictValidObjectWithKeys(receiveInvoice) &&
                `${defaultCurrencyFormat(receiveInvoice.amount_due)} `,
            )}
            {renderContent(
              'Amount Paid',
              strictValidObjectWithKeys(receiveInvoice) &&
                `${defaultCurrencyFormat(receiveInvoice.amount_paid)} `,
            )}
            {renderContent(
              'Invoice Amount',
              strictValidObjectWithKeys(receiveInvoice) &&
                `${defaultCurrencyFormat(receiveInvoice.price)} `,
            )}
          </Stack>
          <Stack py={2}>
            {renderContent(
              'Invoice Balance',
              totalAmount < 0
                ? `${defaultCurrencyFormat(0)}`
                : `${defaultCurrencyFormat(totalAmount)}`,
              Math.sign(totalAmount) === -1 || Math.sign(totalAmount) === 0,
            )}
            {renderContent(
              'Total Amount Selected',
              `${defaultCurrencyFormat(initialAmount)}`,
            )}
            {renderContent(
              'Total Payment Applied',
              appliedAmount > receiveInvoice.amount_due
                ? defaultCurrencyFormat(receiveInvoice.amount_due)
                : defaultCurrencyFormat(appliedAmount),
            )}
          </Stack>
          {/* 
          500 -200 > 0 || 500 - 200 < 200 */}
        </Stack>
        <ReactTable
          globalFilterShow={false}
          height={{
            minHeight: 800,
            maxheight: 800,
          }}
          sxEmptyStyle={{ height: 300, maxHeight: 300 }}
          pagination={false}
          headerFilter={false}
          loading={paymentisLoad}
          // isLoadInner={paymentisLoadInner}
          customText={'You do not have any Invoices'}
          customHeight={true}
          getCellProperties={(cellInfo) => ({
            style: {
              backgroundColor:
                strictValidObjectWithKeys(cellInfo.row.original) &&
                cellInfo.row.original.applied_color,
            },
          })}
          columnDefs={[
            {
              Header: 'Payment Date',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  formatDate(originalRow.date)
                );
              },
              Filter: DateFilter,
              width: 100,
              Cell: (props) => (
                <>
                  <Typography>{formatDate(props.row.original.date)}</Typography>
                </>
              ),
            },
            {
              Header: 'Type',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  renderPaymentType(originalRow.payment_type)
                );
              },
              Filter: SelectColumnFilter,
              width: 100,
              Cell: (props) => (
                <>
                  <Typography>
                    {renderPaymentType(props.row.original.payment_type)}
                  </Typography>
                </>
              ),
            },
            {
              Header: 'Ref #',
              accessor: (originalRow, rowIndex) => {
                return strictValidObjectWithKeys(originalRow) &&
                  strictValidString(originalRow.reference_number)
                  ? originalRow.reference_number
                  : 'N/A';
              },
              width: 60,
              Cell: (props) => (
                <>
                  <Typography>
                    {strictValidString(props.row.original.reference_number)
                      ? props.row.original.reference_number
                      : 'N/A'}
                  </Typography>
                </>
              ),
            },
            {
              Header: 'Customer Ref #',
              accessor: (originalRow, rowIndex) => {
                return strictValidObjectWithKeys(originalRow) &&
                  strictValidString(originalRow.customer_reference_number)
                  ? originalRow.customer_reference_number
                  : 'N/A';
              },
              disableSortBy: true,
              width: 70,
            },
            {
              Header: 'Status',
              Filter: SelectColumnFilter,
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  renderPaymentStatus(originalRow.type)
                );
              },
              width: 90,
              Cell: (props) => (
                <Typography>
                  {renderPaymentStatus(props.row.original.type)}
                </Typography>
              ),
            },
            {
              Header: 'Notes',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) && originalRow.notes
                );
              },
              width: 260,
              Cell: (props) => (
                <MDTooltip title={props.row.original.notes}>
                  <Typography height={55}>
                    {strictValidString(props.row.original.notes)
                      ? props.row.original.notes
                      : 'N/A'}
                  </Typography>
                </MDTooltip>
              ),
            },
            {
              Header: 'Amount',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  `${defaultCurrencyFormat(originalRow.amount)}`
                );
              },
              width: 80,
              disableSortBy: true,
              rightAlign: true,
              Cell: (props) => (
                <Typography>
                  {defaultCurrencyFormat(props.row.original.amount)}
                </Typography>
              ),
            },
            {
              Header: 'Balance',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  `${defaultCurrencyFormat(originalRow.balance)}`
                );
              },
              width: 80,
              rightAlign: true,
              Cell: (props) => (
                <>
                  <Typography>
                    {defaultCurrencyFormat(props.row.original.balance)}
                  </Typography>
                </>
              ),
            },
            {
              Header: 'Applied Amount',
              accessor: 'applied_amount',
              width: 130,
              rightAlign: true,
              Cell: (props) => (
                <Stack>
                  <Typography>
                    {defaultCurrencyFormat(props.row.original.applied_amount)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Actions',
              accessor: '',
              width: 200,
              Filter: false,
              disableSortBy: true,
              Cell: (props) => (
                <>
                  <Checkbox
                    checked={selectedInvoiceId.some(
                      (val) => val === props.row.original.id,
                    )}
                    disabled={
                      Number(totalAmount) <= 0 &&
                      !selectedInvoiceId.some(
                        (val) => val === props.row.original.id,
                      )
                    }
                    onChange={(e) => {
                      const checkbalance =
                        totalAmount - Number(props.row.original.balance);
                      if (
                        initialAmount + Number(props.row.original.balance) <=
                          receiveInvoice.amount_due ||
                        (Math.sign(totalAmount) === 1 &&
                          Math.sign(checkbalance) === -1)
                      ) {
                        handleChangeCheckbox(e, props.row.original.id);
                        if (e.target.checked) {
                          setInitialAmount(
                            initialAmount + Number(props.row.original.balance),
                          );
                          setAppliedAmount(
                            appliedAmount + Number(props.row.original.balance),
                          );
                          setTotalAmount(
                            totalAmount - Number(props.row.original.balance),
                          );
                          updateItem(
                            applyPaymentData,
                            props.row.original.id,
                            'applied_amount',
                            Math.sign(checkbalance) === -1 ||
                              Math.sign(checkbalance) === 0
                              ? Number(totalAmount)
                              : Number(props.row.original.balance),
                          );
                          updateItem(
                            applyPaymentData,
                            props.row.original.id,
                            'applied_color',
                            Math.sign(checkbalance) === -1
                              ? '#FFFFE0'
                              : '#b1e69e',
                          );
                        } else {
                          setInitialAmount(
                            initialAmount - Number(props.row.original.balance),
                          );
                          setTotalAmount(
                            totalAmount + Number(props.row.original.balance),
                          );
                          setAppliedAmount(
                            appliedAmount - Number(props.row.original.balance),
                          );
                          updateItem(
                            applyPaymentData,
                            props.row.original.id,
                            'applied_amount',
                            0,
                          );
                          updateItem(
                            applyPaymentData,
                            props.row.original.id,
                            'applied_color',
                            null,
                          );
                        }
                      } else if (!e.target.checked) {
                        handleChangeCheckbox(e, props.row.original.id);
                        setInitialAmount(
                          initialAmount - Number(props.row.original.balance),
                        );
                        setTotalAmount(
                          totalAmount + Number(props.row.original.balance),
                        );
                        setAppliedAmount(
                          appliedAmount - Number(props.row.original.balance),
                        );
                        updateItem(
                          applyPaymentData,
                          props.row.original.id,
                          'applied_amount',
                          0,
                        );
                        updateItem(
                          applyPaymentData,
                          props.row.original.id,
                          'applied_color',
                          null,
                        );
                      } else {
                        showErr('You already cleared the invoice.');
                      }
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </>
              ),
            },
          ]}
          rowData={Array.isArray(applyPaymentData) ? applyPaymentData : []}
        />
        <Stack
          py={4}
          display={'flex'}
          justifyContent="center"
          alignItems={'center'}
          direction="row"
        >
          <LoadingButton
            onClick={() => {
              setIsDeleteDialog(!isDeleteDialog);
              clearState();
            }}
            size="large"
            color="error"
            variant="outlined"
          >
            Cancel
          </LoadingButton>
          <LoadingButton
            loading={invoiceStatusIsLoad}
            disabled={!strictValidArrayWithLength(selectedInvoiceId)}
            onClick={() => {
              savePaymentsOnBilling(totalAmount);
            }}
            sx={{ ml: 2 }}
            size="large"
            color="primary"
            variant="contained"
          >
            Save
          </LoadingButton>
        </Stack>
      </Dialog>
    );
  };

  const moreOptionToggle = () => {
    setIsMoreDialog(!isMoreDialog);
  };

  const moreOptionDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        isOpen={isMoreDialog}
        title={'Are you sure ?'}
        handleClose={() => {
          moreOptionToggle();
          setStatus('');
        }}
      >
        <Box mt={2}>
          <Stack direction="row">
            <DialogContentText className={classes.header}>
              Current Status{' '}
            </DialogContentText>
            <DialogContentText variant="h3" className={classes.subtitle}>
              {renderBillingStatus(currentData.type)}
            </DialogContentText>
          </Stack>
          <Stack alignItems="center" direction="row" mt={2}>
            <DialogContentText className={classes.header}>
              Transition To
            </DialogContentText>
            <FormControl sx={{ m: 1, minWidth: 200 }}>
              <InputLabel id="demo-simple-select-helper-label">
                Transition to
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={status}
                label="Transition to"
                onChange={handleChange}
              >
                {BillingStatusPreDefined.map((res) => {
                  return <MenuItem value={res.value}>{res.title}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Stack>
        </Box>
        <DialogActions>
          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              moreOptionToggle();
              setStatus('');
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={!status}
            onClick={() => {
              updateInvoice(currentData.invoice_id, status);
            }}
            color="primary"
            variant="outlined"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const isViewToggle = () => {
    setIsViewInvoice(!isViewInvoice);
  };

  const viewInvoiceDetails = () => {
    return (
      <InvoiceDetailModal
        currentViewData={
          strictValidObjectWithKeys(currentViewData) ? currentViewData : {}
        }
        isViewToggle={isViewToggle}
        isViewInvoice={isViewInvoice}
        fetchTripData={true}
      />
    );
  };
  return (
    <>
      <Grid>
        <ReactTable
          serverSidePagination={true}
          loading={!refreshing && isLoad}
          isLoadInner={isLoadInner}
          showExport
          recordsPerPage={pagination.recordsPerPage}
          pageNumber={pagination.pageIndex}
          changePageSize={changePageSize}
          downloadBtnBody={{
            type: 'dispute_accepted',
            name: 'Dispute Accepted Invoice',
            search: search,
          }}
          changePageIndex={changePageIndex}
          setRecordsPerPage={setRecordsPerPage}
          serverSideFilter={(e) => searchQueryFilter(e)}
          clearFilterButton={() => {
            clearQueryFilter('');
          }}
          onFilter={(dates) => {
            callValidateInvoiceApi({
              type: BillingStatus.DISPUTE_ACCEPTED_STATUS,
              reducer: 'disputedAccepted',
              limit: pagination.recordsPerPage,
              skip: 0,
              search: search,
            });
            changePagination({
              ...pagination,
              recordsPerPage: pagination.recordsPerPage,
              pageIndex: 0,
            });
          }}
          onClearFilter={() => {
            callValidateInvoiceApi({
              type: BillingStatus.DISPUTE_ACCEPTED_STATUS,
              reducer: 'disputedAccepted',
              limit: pagination.recordsPerPage,
              skip: 0,
              search: search,
            });
            changePagination({
              ...pagination,
              recordsPerPage: pagination.recordsPerPage,
              pageIndex: 0,
            });
          }}
          customText={`You do not have any ${emptyText} Invoices`}
          columnDefs={[
            {
              Header: 'Invoice Id',
              accessor: 'invoice_id',
              Cell: (props) => (
                <Stack>
                  <Typography>{props.row.original.invoice_id}</Typography>
                </Stack>
              ),
              width: 140,
            },
            {
              Header: 'Issue Date',
              Filter: DateFilter,
              accessor: (originalRow, rowIndex) => {
                return strictValidObjectWithKeys(originalRow) &&
                  strictValidString(originalRow.created_at)
                  ? formatDateTime(
                      originalRow.created_at
                        .replace('T', ' ')
                        .replace('Z', ' '),
                    )
                  : formatDateTime(new Date());
              },
              // width: 200,
              Cell: (props) => (
                <>
                  <Stack>
                    <Typography>
                      {strictValidString(props.row.original.created_at)
                        ? formatDateTime(
                            props.row.original.created_at
                              .replace('T', ' ')
                              .replace('Z', ' '),
                          )
                        : formatDateTime(new Date())}
                    </Typography>
                  </Stack>
                </>
              ),
            },
            {
              Header: 'Due Date',
              Filter: DateFilter,
              accessor: (originalRow, rowIndex) => {
                return strictValidObjectWithKeys(originalRow) &&
                  strictValidString(originalRow.created_at)
                  ? formatDateTime(
                      originalRow.created_at
                        .replace('T', ' ')
                        .replace('Z', ' '),
                    )
                  : formatDateTime(new Date());
              },
              // width: 200,
              Cell: (props) => (
                <>
                  <Stack>
                    <Typography>
                      {strictValidString(props.row.original.created_at)
                        ? formatDateTime(
                            props.row.original.created_at
                              .replace('T', ' ')
                              .replace('Z', ' '),
                            DefaultDate,
                          )
                        : formatDateTime(new Date(), DefaultDate)}
                    </Typography>
                  </Stack>
                </>
              ),
            },
            {
              Header: 'Account',
              accessor: (originalRow, rowIndex) => {
                return get(originalRow, 'cost_center_name', false)
                  ? strictValidString(
                      get(originalRow, 'corporate_account.name', ''),
                    ) &&
                      `${get(
                        originalRow,
                        'corporate_account.name',
                        '',
                      )} - ${get(originalRow, 'cost_center_name', '')}`
                  : get(originalRow, 'corporate_account.name', '');
              },
              // width: 40,
              Filter: SelectColumnFilter,
              Cell: (props) => {
                const originalRow = props.row.original;
                const accountName = get(originalRow, 'cost_center_name', false)
                  ? `${get(originalRow, 'corporate_account.name', '')} - ${get(
                      originalRow,
                      'cost_center_name',
                      '',
                    )}`
                  : get(originalRow, 'corporate_account.name', '');
                return (
                  <>
                    <MDTooltip title={accountName}>
                      <Typography height={55}>{accountName}</Typography>
                    </MDTooltip>
                  </>
                );
              },
            },
            {
              Header: 'Billing Address',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  strictValidString(
                    originalRow.corporate_account.billing_address,
                  ) &&
                  originalRow.corporate_account.billing_address
                );
              },
              Cell: (props) => (
                <>
                  {strictValidObjectWithKeys(props.row.original) &&
                  strictValidString(
                    props.row.original.corporate_account.billing_address,
                  ) ? (
                    <MDTooltip
                      title={
                        props.row.original.corporate_account.billing_address
                      }
                    >
                      <Typography height={55}>
                        {props.row.original.corporate_account.billing_address}
                      </Typography>
                    </MDTooltip>
                  ) : (
                    <Stack>
                      <Typography>N/A</Typography>
                    </Stack>
                  )}
                </>
              ),
            },
            {
              Header: 'Period',
              width: 150,
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) && originalRow.period
                );
              },
              Cell: (props) => (
                <Stack>
                  {strictValidString(props.row.original.period) &&
                  props.row.original.period !== 'Invalid date-Invalid date' ? (
                    <Typography>{props.row.original.period}</Typography>
                  ) : (
                    <Typography>N/A</Typography>
                  )}
                </Stack>
              ),
            },
            {
              Header: 'Legs Count',
              width: 100,
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  strictValidObjectWithKeys(originalRow) &&
                  originalRow.leg_count
                );
              },
              Cell: (props) => (
                <Stack>
                  {strictValidNumber(props.row.original.leg_count) ? (
                    <Typography>{props.row.original.leg_count}</Typography>
                  ) : (
                    <Typography>N/A</Typography>
                  )}
                </Stack>
              ),
            },
            {
              Header: 'Amount',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  defaultCurrencyFormat(originalRow.amount)
                );
              },
              width: 130,
              rightAlign: true,
              Cell: (props) => (
                <Stack>
                  <Typography>
                    {defaultCurrencyFormat(props.row.original.amount)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Amount Paid',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  defaultCurrencyFormat(originalRow.amount_paid)
                );
              },
              width: 130,
              rightAlign: true,
              Cell: (props) => (
                <Stack>
                  <Typography>
                    {defaultCurrencyFormat(props.row.original.amount_paid)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Amount Due',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  defaultCurrencyFormat(originalRow.amount_due)
                );
              },
              width: 130,
              rightAlign: true,
              Cell: (props) => (
                <Stack>
                  <Typography>
                    {defaultCurrencyFormat(props.row.original.amount_due)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Notes',
              accessor: 'notes',
              width: 150,
              Cell: (props) => (
                <>
                  {strictValidString(props.row.original.notes) &&
                  props.row.original.notes !== 'N/A' ? (
                    <MDTooltip title={props.row.original.notes}>
                      <Typography height={55}>
                        {props.row.original.notes}
                      </Typography>
                    </MDTooltip>
                  ) : (
                    <Stack>
                      <Typography>N/A</Typography>
                    </Stack>
                  )}
                </>
              ),
            },
            {
              Header: 'Action',
              accessor: 'Action',
              width: 220,
              Filter: false,
              Cell: (props) => (
                <Stack direction="row" spacing={1}>
                  <Tooltip title={'View Invoice'}>
                    <span>
                      <IconButton
                        onClick={async () => {
                          const data = {
                            type: 'dispute_accepted',
                            invoice_id: props.row.original.invoice_id,
                          };
                          setCurrentViewData(data);
                          isViewToggle();
                        }}
                        color="primary"
                        size="medium"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title={'Add Note'}>
                    <span>
                      <IconButton
                        onClick={() =>
                          toggle({
                            invoice_id: props.row.original.invoice_id,
                            notes: props.row.original.notes,
                          })
                        }
                        color="primary"
                        size="medium"
                      >
                        <NoteAddIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title={buttonText}>
                    <IconButton
                      onClick={() => {
                        if (fullyPay) {
                          deleteToggle(props.row.original);
                          setReceiveInvoice(props.row.original);
                          setType('fully');
                          setTotalAmount(props.row.original.amount_due);
                        } else if (refundInvoice) {
                          setRefundDialog(!isRefundDialog);
                          setRefundInvoiceState(props.row.original);
                        } else {
                          updateInvoiceId(
                            props.row.original.invoice_id,
                            buttonValue,
                            redirectNumber,
                          );
                        }
                      }}
                      disabled={buttonRoleAccess(
                        'initializedValidateInvoice',
                        strictValidObjectWithKeys(userValue) &&
                          userValue.role_id,
                      )}
                      color="primary"
                      size="medium"
                    >
                      {renderIcons(icon)}
                    </IconButton>
                  </Tooltip>

                  <PopupState variant="popover" popupId="demo-popup-menu">
                    {(popupState) => (
                      <React.Fragment>
                        <Tooltip title="Action">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => {
                              // moreOptionToggle();
                              setCurrentData(props.row.original);
                            }}
                            {...bindTrigger(popupState)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                        <Menu {...bindMenu(popupState)}>
                          {strictValidString(popupButtonText) && (
                            <MenuItem>{popupButtonText}</MenuItem>
                          )}
                          {strictValidString(errorFirstButton) && (
                            <MenuItem
                              onClick={() =>
                                updateInvoiceId(
                                  props.row.original.invoice_id,
                                  errorFirstButtonValue,
                                  redirectFirstOption,
                                )
                              }
                            >
                              {errorFirstButton}
                            </MenuItem>
                          )}
                          {strictValidString(errorSecondButton) && (
                            <MenuItem
                              onClick={() =>
                                updateInvoiceId(
                                  props.row.original.invoice_id,
                                  errorSecondButtonValue,
                                  redirectSecondOption,
                                )
                              }
                            >
                              {errorSecondButton}
                            </MenuItem>
                          )}
                          {strictValidString(errorThirdButtonText) && (
                            <MenuItem
                              onClick={() =>
                                updateInvoiceId(
                                  props.row.original.invoice_id,
                                  errorThirdButtonValue,
                                )
                              }
                            >
                              {errorThirdButtonText}
                            </MenuItem>
                          )}
                          {props.row.original.type !== 'validated' && (
                            <MenuItem
                              onClick={() =>
                                downloadPdf(
                                  props.row.original.invoice_id,
                                  'noannex',
                                )
                              }
                            >
                              Download
                            </MenuItem>
                          )}
                          {props.row.original.type !== 'validated' && (
                            <MenuItem
                              onClick={() =>
                                downloadPdf(
                                  props.row.original.invoice_id,
                                  'annex',
                                )
                              }
                            >
                              Download Annex
                            </MenuItem>
                          )}
                          {OnlySuperAdmin(user) || OnlyAdmins(user) ? (
                            <MenuItem
                              onClick={() => {
                                moreOptionToggle();
                                setCurrentData(props.row.original);
                              }}
                            >
                              Change State
                            </MenuItem>
                          ) : (
                            ''
                          )}
                        </Menu>
                      </React.Fragment>
                    )}
                  </PopupState>
                  <Tooltip title="Info" disableInteractive>
                    <IconButton
                      disabled={false}
                      variant="transparent"
                      onClick={() => {
                        const field = props.row.original;
                        setCurrent(field);
                        infoToggle();
                        callInvoiceAudit({ invoice_id: field.invoice_id });
                      }}
                    >
                      <InfoOutlinedIcon sx={{ color: '#1C2A39' }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              ),
            },
          ]}
          total={total}
          rowData={Array.isArray(data) ? data : []}
        />
      </Grid>
      {deleteDialog()}
      {renderDialog()}
      {viewInvoiceDetails()}
      {moreOptionDialog()}
      {deleteInvoiceIdDialog()}
      {refundInvoiceDialog()}
      {infoDialog()}
    </>
  );
};

DisputedAcceptedInvoice.propTypes = {
  callValidateInvoiceApi: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

DisputedAcceptedInvoice.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.billing.validateInvoice.message,
    isLoad: state.billing.validateInvoice.isLoad,
    loadErr: state.billing.validateInvoice.loadErr,
    data: state.billing.validateInvoice.disputedAccepted.result,
    isLoadInner: state.billing.validateInvoice.isLoadInner,
    partialInvoiceMessage: state.billing.partialInvoice.message,
    partialInvoiceIsLoad: state.billing.partialInvoice.isLoad,
    partialInvoiceLoadErr: state.billing.partialInvoice.loadErr,
    partialInvoiceData: state.billing.partialInvoice.data,
    partialInvoiceIsLoadInner: state.billing.partialInvoice.isLoadInner,
    invoiceStatusMessage: state.billing.invoiceStatus.message,
    invoiceStatusIsLoad: state.billing.invoiceStatus.isLoad,
    invoiceStatusLoadErr: state.billing.invoiceStatus.loadErr,
    invoiceStatusData: state.billing.invoiceStatus.data,
    invoiceStatusIsLoadInner: state.billing.invoiceStatus.isLoadInner,
    deleteInvoiceStatusIsLoad: state.billing.deleteInvoiceStatus.isLoad,
    payments: state.billing.payments.data,
    paymentisLoad: state.billing.payments.isLoad,
    paymentisLoadInner: state.billing.payments.isLoadInner,
    user: state.auth.user,
    totalRecords: state.billing.validateInvoice.total_invoice,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callValidateInvoiceApi: (...params) =>
    dispatch(getValidateInvoice(...params)),
  callSocketValidateInvoiceApi: (...params) =>
    dispatch(socketValidateInvoice(...params)),
  callUpdateBilledInvoiceApi: (...params) =>
    dispatch(billedUpdateInvoice(...params)),
  CallUpdateBillingNotesInInvoice: (...params) =>
    dispatch(updateBillingNotesInInvoice(...params)),
  callFinalizeInvoiceApi: (...params) => dispatch(finalizeInvoicing(...params)),
  callDeleteBilledInvoice: (...params) =>
    dispatch(deleteBilledInvoice(...params)),
  callUpdateValidateInvoice: (...params) =>
    dispatch(updateValidateInvoice(...params)),
  callUpdateBilledInvoice: (...params) =>
    dispatch(updateBilledInvoice(...params)),
  callResetAllData: (...params) => dispatch(resetInvoiceReducer(...params)),
  callRecievedInvoiceApi: (...params) =>
    dispatch(getPartialInvoiceById(...params)),
  callUpdatePaymentInvoiceApi: (...params) =>
    dispatch(updatePaymentInvoice(...params)),
  callInvoiceStatusApi: (...params) => dispatch(saveInvoiceStatus(...params)),
  callgetPdfFromTripApi: (...params) => dispatch(getPdfFromTrip(...params)),
  callDeleteInvoiceIdApi: (...params) => dispatch(deleteInvoiceId(...params)),
  callPaymentMethodApi: (...params) => dispatch(getPaymentMethod(...params)),
  callAllPaymentFromInvoiceApi: (...params) =>
    dispatch(getAllPaymentsOnBilling(...params)),
  callResetInvoiceStatusApi: (...params) =>
    dispatch(resetInvoiceStatus(...params)),
  callAuditApi: (...params) => dispatch(getBillingAudit(...params)),
  callInvoiceAudit: (...params) => dispatch(invoiceAudit(...params)),
  callTripDetailsApi: (...params) => dispatch(getTripDetails(...params)),
  callSaveState: (...params) => dispatch(saveState(...params)),
  callGetState: (...params) => dispatch(getState(...params)),
});

export default connect(
  mapStateProps,
  mapDispatchToProps,
)(DisputedAcceptedInvoice);

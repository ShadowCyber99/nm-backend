/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Button,
  Checkbox,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  defaultCurrencyFormat,
  formatDate,
  formatDateTime,
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/common-utils';
import ReactTable from '../../../components/react-table';
import {
  applyInvoiceId,
  deletePaymentId,
  flushPaymentId,
  getAllPayments,
  getFilterInvoice,
  getPaymentAudit,
  getPaymentByID,
  getUnApplyInvoice,
  unApplyInvoiceId,
} from '../action';
import { getCorporateAccount } from '../../trip-management/action';
import { makeStyles } from '@mui/styles';
import Dialog from '../../../components/dialog';
import {
  BillingStatus,
  DefaultDate,
  renderPaymentStatus,
  renderPaymentType,
} from '../../../utils/constant';
import MDTooltip from '../../../components/tooltip';
import EditableButton from '../../../components/react-table/components/editable-button';
import { LoadingButton } from '@mui/lab';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import PaymentInfo from '../info-dialog';
import {
  DateFilter,
  SelectColumnFilter,
} from '../../../components/react-table/helper';
import { updateItem } from '../../../utils/mutation';
import _ from 'lodash';
import { SocketContext } from '../../../hooks/useSocketContext';

const useStyles = makeStyles((theme) => ({
  input: {
    width: '10%',
    backgroundColor: '#FAFAFA',
    fontSize: 14,
  },
  button: {
    width: '10%',
  },
  errorText: {
    fontWeight: 500,
    fontSize: 18,
    color: '#fff',
  },
  header: {
    width: 400,
  },
  mainHead: {
    margin: `${theme.spacing(1, 0, 0, 0)}`,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
  },
  headerDialog: {
    marginTop: theme.spacing(0.5),
    fontSize: 18,
    textAlign: 'center',
  },
  buttonForceAction: {
    width: 170,
    textTransform: 'capitalize',
  },
}));

const PaymentList = ({
  isLoad,
  isLoadInner,
  message,
  callPaymentListApi,
  data,
  setData,
  callFilterInvoiceApi,
  isFilterLoad,
  filterdata,
  isFilterLoadInner,
  callDeletePaymentIdApi,
  loadErr,
  callApplyInvoiceIdApi,
  callUnApplyInvoiceApi,
  unapplyFilterData,
  callUnApplyInvoiceIdApi,
  unapplyFilterisLoad,
  unapplyFilterisLoadInner,
  callAuditApi,
  callPaymentByIDApi,
  filterById,
  filterByIdLoad,
  callFlushPaymentId,
}) => {
  const classes = useStyles();
  const applyDialog = useRef(false);
  const [applyActionDialog, setApplyActionDialog] = useState(
    applyDialog.current,
  );
  const unApplyDialog = useRef(false);
  const [unApplyActionDialog, setUnApplyActionDialog] = useState(
    unApplyDialog.current,
  );
  const [currentState, setCurrentState] = useState({});
  const [selectedInvoiceId, setSelectedInvoice] = useState([]);
  const [unSelectedInvoiceId, setUnSelectedInvoice] = useState([]);
  const [initialAmount, setInitialAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  //Unapply State
  // eslint-disable-next-line no-unused-vars
  const [initialUnAmount, setInitialUnAmount] = useState(0);
  const [unTotalAmount, setUnTotalAmount] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [childTripDialog, setChildTripDialog] = useState(false);
  const [deleteLoad, setDeleteLoad] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [load, setLoad] = useState(false);
  const [isInfoDialog, setIsInfoDialog] = useState(false);
  const [current, setCurrent] = useState({});
  const [applyPaymentData, setApplyPaymentData] = useState([]);
  const [unApplyPaymentData, setUnApplyPaymentData] = useState([]);
  const socket = useContext(SocketContext);

  useEffect(() => {
    let res = [];
    if (strictValidArrayWithLength(filterdata)) {
      filterdata.map((a) => {
        res.push({
          ...a,
          amount_due_cp: a.amount_due,
        });
        return null;
      });

      setApplyPaymentData(res);
    }
    return () => {
      setApplyPaymentData([]);
    };
  }, [filterdata]);

  useEffect(() => {
    let res = [];
    if (strictValidArrayWithLength(unapplyFilterData)) {
      unapplyFilterData.map((a) => {
        res.push({
          ...a,
          total_applied_amount_cp: a.total_applied_amount,
        });
        return null;
      });

      setUnApplyPaymentData(res);
    }
    return () => {
      setUnApplyPaymentData([]);
    };
  }, [unapplyFilterData]);

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
  const apiCall = () => {
    callPaymentListApi();
  };

  const callFilterInvoice = async (account_id) => {
    await callFilterInvoiceApi({
      type: [
        BillingStatus.SEND_INVOICE_STATUS,
        BillingStatus.PARTIALLY_PAID_STATUS,
      ],
      account_id: account_id,
    });
  };
  const callUnApplyFilterInvoice = async (field) => {
    await callUnApplyInvoiceApi({
      type: [
        BillingStatus.FULLY_PAID_STATUS,
        BillingStatus.PARTIALLY_PAID_STATUS,
      ],
      account_id: field.account_id,
      payment_id: field.id,
    });
  };
  useEffect(() => {
    apiCall();
  }, []);

  useEffect(() => {
    socket.on('refresh_payments', () => {
      setRefreshing(true);
      apiCall();
    });
    return () => {
      socket.off('refresh_payments');
    };
  }, []);

  const getIdByUnApplyApi = async () => {
    if (strictValidObjectWithKeys(filterById)) {
      await callUnApplyFilterInvoice(filterById);
      const res = await callPaymentByIDApi(filterById.id);
      if (res) {
        setUnTotalAmount(Number(filterById.balance));
        setCurrentState(filterById);
      }
    }
  };

  useEffect(() => {
    socket.on('refresh_payments', () => {
      getIdByUnApplyApi();
    });
    return () => {
      socket.off('refresh_payments');
    };
  }, [filterById]);

  const getIdByApi = async () => {
    if (strictValidObjectWithKeys(filterById)) {
      await callFilterInvoice(filterById.account_id);
      const res = callPaymentByIDApi(filterById.id);
      if (res) {
        setSelectedInvoice([]);
        setTotalAmount(filterById.balance);
        setCurrentState(filterById);
        setInitialAmount(0);
      }
    }
  };

  useEffect(() => {
    socket.on('refresh_payments', () => {
      getIdByApi();
    });
    return () => {
      socket.off('refresh_payments');
    };
  }, [filterById]);

  useEffect(() => {
    if (strictValidObjectWithKeys(filterById)) {
      setCurrentState(filterById);
      if (applyActionDialog) {
        setTotalAmount(filterById.balance);
      }
      if (unApplyActionDialog) {
        setUnTotalAmount(Number(filterById.balance));
      }
    }
  }, [filterById]);
  const toggleApplyAction = () => {
    if (applyDialog.current) {
      applyDialog.current = false;
      setApplyActionDialog(false);
    } else {
      applyDialog.current = true;
      setApplyActionDialog(true);
    }
  };
  const toggleUnApplyAction = () => {
    if (unApplyDialog.current) {
      unApplyDialog.current = false;
      setUnApplyActionDialog(false);
    } else {
      unApplyDialog.current = true;
      setUnApplyActionDialog(true);
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
  const renderContent = (header, subtitle, error = false, width = 1200) => {
    return (
      <Stack className={classes.mainHead} direction="row">
        <Typography variant="h4" className={classes.header}>
          {header}
        </Typography>
        <Typography sx={{ width: width }} color={error && 'error'} variant="h4">
          {subtitle}
        </Typography>
      </Stack>
    );
  };

  const handleChangeInvoice = (event, invoiceId, used) => {
    const { checked } = event.currentTarget;

    setSelectedInvoice((prev) =>
      checked ? [...prev, invoiceId] : prev.filter((val) => val !== invoiceId),
    );
  };

  const handleChangeUnInvoice = (event, invoiceId, used) => {
    const { checked } = event.currentTarget;

    setUnSelectedInvoice((prev) =>
      !checked ? [...prev, invoiceId] : prev.filter((val) => val !== invoiceId),
    );
  };

  const clearApplyState = () => {
    toggleApplyAction();
    setSelectedInvoice([]);
    setTotalAmount(0);
    setInitialAmount(0);
    setApplyPaymentData([]);
  };
  const savePaymentInvoiceId = async () => {
    setLoad(true);
    const data = {
      account_id: currentState.account_id,
      invoice_id: selectedInvoiceId,
      payment_id: currentState.id,
      data_version: currentState.data_version,
    };
    const res = await callApplyInvoiceIdApi(data);
    if (res) {
      socket.emit('add_payments');
      setLoad(false);
      callPaymentListApi();
      clearApplyState();
      callFlushPaymentId();
      setCurrentState({});
    } else {
      setLoad(false);
    }
  };
  const UnApplyInvoiceId = async () => {
    setLoad(true);
    const data = {
      account_id: currentState.account_id,
      invoice_id: unSelectedInvoiceId,
      payment_id: currentState.id,
      data_version: currentState.data_version,
    };
    const res = await callUnApplyInvoiceIdApi(data);
    if (res) {
      socket.emit('add_payments');
      setLoad(false);
      callPaymentListApi();
      toggleUnApplyAction();
      setUnSelectedInvoice([]);
      callFlushPaymentId();
      setTotalAmount(0);
      setInitialAmount(0);
    } else {
      setLoad(false);
    }
  };

  useEffect(() => {
    selectedInvoiceId.forEach((res) => {
      applyPaymentData.forEach((a) => {
        if (res === a.invoice_id && a.isFullyApplied) {
          if (
            Math.sign(totalAmount) === 1 &&
            (Number(totalAmount) >= Number(a.amount_due) ||
              Number(totalAmount) <= Number(a.amount_due))
          ) {
            setTotalAmount(
              totalAmount - (Number(a.amount_due) - Number(a.applied_amount)),
            );
            const applyNewBalance =
              Number(totalAmount) -
              (Number(a.amount_due) - Number(a.applied_amount));
            updateItem(
              applyPaymentData,
              a.id,
              'applied_color',
              Math.sign(applyNewBalance) === -1 ? '#FFFFE0' : '#b1e69e',
            );
            updateItem(
              applyPaymentData,
              a.id,
              'applied_amount',
              Math.sign(applyNewBalance) === -1
                ? Number(totalAmount) + Number(a.applied_amount)
                : Number(a.amount_due),
            );
            updateItem(
              applyPaymentData,
              a.id,
              'isFullyApplied',
              Math.sign(applyNewBalance) === -1 ? true : false,
            );
            updateItem(
              applyPaymentData,
              a.id,
              'amount_due_cp',
              Math.sign(applyNewBalance) === -1
                ? Number(a.amount_due_cp) - Number(totalAmount)
                : 0,
            );
          } else {
            setTotalAmount(
              totalAmount - (Number(a.amount_due) - Number(a.applied_amount)),
            );
          }
        }
      });
    });
  }, [selectedInvoiceId]);

  const renderSkeleton = () => {
    return (
      <React.Fragment>
        {_.range(1, 5, 1).map((a) => (
          <>
            <Stack
              display={'flex'}
              py={1}
              flexDirection="row"
              justifyContent="space-between"
            >
              <Stack>
                <Skeleton width={500} height={30} animation="wave" />
              </Stack>
              <Stack>
                <Skeleton width={500} height={30} animation="wave" />
              </Stack>
            </Stack>
          </>
        ))}
        <Stack py={2}>
          <Divider sx={{ mb: 2 }} />
          <Skeleton width={500} height={30} animation="wave" />
        </Stack>
      </React.Fragment>
    );
  };

  const renderApplyDialog = () => {
    return (
      <Dialog
        fullScreen={true}
        closeIcon={true}
        isOpen={applyActionDialog}
        fullWidth
        maxWidth={false}
        title={'Apply Payment'}
        handleClose={() => {
          clearApplyState();
          callFlushPaymentId();
          apiCall();
        }}
      >
        {filterByIdLoad ? (
          renderSkeleton()
        ) : (
          <>
            {strictValidObjectWithKeys(currentState) && (
              <>
                <Stack
                  display={'flex'}
                  py={2}
                  flexDirection="row"
                  justifyContent="space-between"
                  // alignItems="center"
                >
                  <Stack py={2}>
                    {renderContent(
                      'Account Name',
                      strictValidObjectWithKeys(
                        currentState.corporate_account,
                      ) && currentState.corporate_account.name,
                    )}
                    {renderContent('Date', formatDate(currentState.date))}
                    {renderContent(
                      'Payment Type',
                      renderPaymentType(currentState.payment_type),
                    )}
                    {renderContent(
                      'Payment Amount',
                      `${defaultCurrencyFormat(currentState.amount)}`,
                    )}
                    {renderContent(
                      'Invoices',
                      // `${(currentState.invo)}`,
                      <Typography display="inline-block" variant="h4">
                        {strictValidArrayWithLength(currentState.all_invoice)
                          ? currentState.all_invoice.map((a, index) => {
                              return (
                                <Typography variant="h4" display="inline-block">
                                  {index ? `, ${a}` : a}
                                </Typography>
                              );
                            })
                          : 'N/A'}
                      </Typography>,
                    )}
                  </Stack>
                  <Stack py={2}>
                    {renderContent(
                      'Balance Amount',
                      totalAmount < 0
                        ? `${defaultCurrencyFormat(0)}`
                        : `${defaultCurrencyFormat(totalAmount)}`,
                      Math.sign(totalAmount) === -1 ||
                        Math.sign(totalAmount) === 0,
                      200,
                    )}
                    {renderContent(
                      'Invoice(s) Amount Selected',
                      `${defaultCurrencyFormat(initialAmount)}`,
                      false,
                      200,
                    )}
                  </Stack>
                </Stack>
                <Stack py={2}>
                  <Divider sx={{ mb: 2 }} />
                  {renderContent(
                    'Due invoices for Account:',
                    strictValidObjectWithKeys(currentState.corporate_account) &&
                      `${currentState.corporate_account.name}`,
                  )}
                </Stack>
              </>
            )}
          </>
        )}

        <ReactTable
          globalFilterShow={true}
          filterButton={false}
          onFilter={(dates) => {
            callFilterInvoiceApi({
              ...dates,
              type: [
                BillingStatus.SEND_INVOICE_STATUS,
                BillingStatus.PARTIALLY_PAID_STATUS,
              ],
              account_id: currentState.account_id,
            });
            setSelectedInvoice([]);
            setTotalAmount(currentState.balance);
            setInitialAmount(0);
          }}
          onClearFilter={() => {
            callFilterInvoiceApi({
              type: [
                BillingStatus.SEND_INVOICE_STATUS,
                BillingStatus.PARTIALLY_PAID_STATUS,
              ],
              account_id: currentState.account_id,
            });
            setSelectedInvoice([]);
            setTotalAmount(currentState.balance);
            setInitialAmount(0);
          }}
          isDateFilter
          height={{
            minHeight: 500,
            maxheight: 500,
            overfleow: 'scroll',
          }}
          pagination={false}
          headerFilter={false}
          loading={isFilterLoad}
          isLoadInner={isFilterLoadInner}
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
              Header: 'Invoice Id',
              accessor: 'invoice_id',
              width: 110,
              Cell: (props) => (
                <Stack py={1}>
                  <Typography>{props.row.original.invoice_id}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Issue Date',
              accessor: 'issue_date',
              width: 90,
              Cell: (props) => (
                <Stack py={1}>
                  <Typography>
                    {strictValidString(props.row.original.issue_date)
                      ? formatDateTime(
                          props.row.original.issue_date
                            .replace('T', ' ')
                            .replace('Z', ' '),
                        )
                      : formatDateTime(new Date(), DefaultDate)}
                    {/* {formatDateTime(props.row.original.issue_date)} */}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Due Date',
              accessor: (originalRow, rowIndex) => {
                return strictValidObjectWithKeys(originalRow) &&
                  strictValidString(originalRow.due_date)
                  ? formatDateTime(
                      originalRow.due_date.replace('T', ' ').replace('Z', ' '),
                      DefaultDate,
                    )
                  : formatDateTime(new Date(), DefaultDate);
              },
              width: 80,
              Cell: (props) => (
                <Stack py={1}>
                  <Typography>
                    {strictValidString(props.row.original.due_date)
                      ? formatDateTime(
                          props.row.original.due_date
                            .replace('T', ' ')
                            .replace('Z', ' '),
                          DefaultDate,
                        )
                      : formatDateTime(new Date(), DefaultDate)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Period',
              accessor: 'period',
              width: 120,
              Cell: (props) => (
                <Stack py={1}>
                  {strictValidString(props.row.original.period) ? (
                    <Typography>{props.row.original.period}</Typography>
                  ) : (
                    <Typography>N/A</Typography>
                  )}
                </Stack>
              ),
            },
            {
              Header: 'Legs Count',
              accessor: 'legs_count',
              width: 80,
              Cell: (props) => (
                <Stack py={1}>
                  <Typography>{props.row.original.legs_count}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Amount',
              accessor: 'price',
              width: 80,
              rightAlign: true,
              Cell: (props) => (
                <Stack py={1}>
                  <Typography>
                    {defaultCurrencyFormat(props.row.original.price)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Amount Paid',
              accessor: 'amount_paid',
              width: 80,
              rightAlign: true,
              Cell: (props) => (
                <Stack py={1}>
                  <Typography>
                    {defaultCurrencyFormat(props.row.original.amount_paid)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Amount Due',
              accessor: 'amount_due_cp',
              width: 80,
              rightAlign: true,
              Cell: (props) => (
                <Stack py={1}>
                  <Typography>
                    {defaultCurrencyFormat(props.row.original.amount_due_cp)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Applied Amount',
              accessor: 'applied_amount',
              width: 130,
              rightAlign: true,
              Cell: (props) => (
                <Stack py={1}>
                  <Typography>
                    {defaultCurrencyFormat(props.row.original.applied_amount)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Notes',
              accessor: 'notes',
              width: 210,
              Cell: (props) => (
                <Stack>
                  <Typography>{props.row.original.notes}</Typography>
                </Stack>
              ),
            },

            {
              Header: 'Action',
              accessor: '',
              width: 80,
              Cell: (props) => (
                <>
                  <Checkbox
                    checked={selectedInvoiceId.some(
                      (val) => val === props.row.original.invoice_id,
                    )}
                    disabled={
                      Number(totalAmount) <= 0 &&
                      !selectedInvoiceId.some(
                        (val) => val === props.row.original.invoice_id,
                      )
                    }
                    onChange={async (e) => {
                      const checkbalance =
                        totalAmount - Number(props.row.original.amount_due);
                      if (
                        initialAmount + Number(props.row.original.amount_due) <=
                          Number(currentState.balance) ||
                        (Math.sign(totalAmount) === 1 &&
                          Math.sign(checkbalance) === -1) ||
                        Math.sign(checkbalance) === 0
                      ) {
                        handleChangeInvoice(
                          e,
                          props.row.original.invoice_id,
                          checkbalance,
                        );
                        if (e.target.checked) {
                          setInitialAmount(
                            initialAmount +
                              Number(props.row.original.amount_due),
                          );
                          updateItem(
                            applyPaymentData,
                            props.row.original.id,
                            'applied_amount',
                            Math.sign(checkbalance) === -1 ||
                              Math.sign(checkbalance) === 0
                              ? Number(totalAmount)
                              : Number(props.row.original.amount_due),
                          );
                          updateItem(
                            applyPaymentData,
                            props.row.original.id,
                            'amount_due_cp',
                            Math.sign(checkbalance) === -1 ||
                              Math.sign(checkbalance) === 0
                              ? Number(props.row.original.amount_due) -
                                  Number(totalAmount)
                              : 0,
                          );
                          updateItem(
                            applyPaymentData,
                            props.row.original.id,
                            'applied_color',
                            Math.sign(checkbalance) === -1
                              ? '#FFFFE0'
                              : '#b1e69e',
                          );
                          updateItem(
                            applyPaymentData,
                            props.row.original.id,
                            'isFullyApplied',
                            Math.sign(checkbalance) === -1 ? true : false,
                          );
                          setTotalAmount(
                            totalAmount - Number(props.row.original.amount_due),
                          );
                        } else {
                          setInitialAmount(
                            initialAmount -
                              Number(props.row.original.amount_due),
                          );
                          if (
                            Math.sign(totalAmount) === 1 ||
                            Math.sign(totalAmount) === 0
                          ) {
                            setTotalAmount(
                              totalAmount +
                                Number(props.row.original.applied_amount),
                            );
                          } else {
                            setTotalAmount(
                              0 + Number(props.row.original.applied_amount),
                            );
                          }
                          updateItem(
                            applyPaymentData,
                            props.row.original.id,
                            'applied_amount',
                            0,
                          );
                          // updateItem(
                          //   applyPaymentData,
                          //   props.row.original.id,
                          //   'amount_due',
                          //   Number(props.row.original.price) -
                          //     Number(props.row.original.amount_paid),
                          // );
                          updateItem(
                            applyPaymentData,
                            props.row.original.id,
                            'amount_due_cp',
                            Number(props.row.original.price) -
                              Number(props.row.original.amount_paid),
                          );
                          updateItem(
                            applyPaymentData,
                            props.row.original.id,
                            'applied_color',
                            null,
                          );
                          updateItem(
                            applyPaymentData,
                            props.row.original.id,
                            'isFullyApplied',
                            false,
                          );
                        }
                      } else if (!e.target.checked) {
                        handleChangeInvoice(
                          e,
                          props.row.original.invoice_id,
                          checkbalance,
                        );
                        setInitialAmount(
                          initialAmount - Number(props.row.original.amount_due),
                        );
                        if (
                          Math.sign(totalAmount) === 1 ||
                          Math.sign(totalAmount) === 0
                        ) {
                          setTotalAmount(
                            totalAmount +
                              Number(props.row.original.applied_amount),
                          );
                        } else {
                          setTotalAmount(
                            0 + Number(props.row.original.applied_amount),
                          );
                        }
                        updateItem(
                          applyPaymentData,
                          props.row.original.id,
                          'applied_amount',
                          0,
                        );
                        updateItem(
                          applyPaymentData,
                          props.row.original.id,
                          'amount_due_cp',
                          Number(props.row.original.price) -
                            Number(props.row.original.amount_paid),
                        );
                        updateItem(
                          applyPaymentData,
                          props.row.original.id,
                          'applied_color',
                          null,
                        );
                        updateItem(
                          applyPaymentData,
                          props.row.original.id,
                          'isFullyApplied',
                          false,
                        );
                      } else {
                        showErr("You don't have a sufficient balance");
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
              clearApplyState();
              callFlushPaymentId();
              apiCall();
            }}
            // loading={invoiceStatusIsLoad}
            size="large"
            color="error"
            variant="outlined"
          >
            Cancel
          </LoadingButton>
          <LoadingButton
            loading={load}
            disabled={!strictValidArrayWithLength(selectedInvoiceId)}
            onClick={() => {
              savePaymentInvoiceId();
            }}
            sx={{ ml: 2 }}
            size="large"
            color="primary"
            variant="contained"
          >
            Apply Payment
          </LoadingButton>
        </Stack>
      </Dialog>
    );
  };

  const clearUnApplyState = () => {
    toggleUnApplyAction();
    setUnSelectedInvoice([]);
    setUnTotalAmount(0);
    setInitialUnAmount(0);
    setUnApplyPaymentData([]);
  };
  const renderUnApplyDialog = () => {
    return (
      <Dialog
        fullScreen={true}
        closeIcon={true}
        isOpen={unApplyActionDialog}
        fullWidth
        maxWidth={'xl'}
        title={'UnApply Payment'}
        handleClose={() => {
          clearUnApplyState();
          callFlushPaymentId();
          apiCall();
        }}
      >
        {filterByIdLoad ? (
          renderSkeleton()
        ) : (
          <>
            {strictValidObjectWithKeys(currentState) && (
              <>
                <Stack
                  display={'flex'}
                  py={2}
                  flexDirection="row"
                  justifyContent="space-between"
                  // alignItems="center"
                >
                  <Stack py={2}>
                    {renderContent(
                      'Account Name',
                      strictValidObjectWithKeys(
                        currentState.corporate_account,
                      ) && currentState.corporate_account.name,
                    )}
                    {renderContent('Date', formatDate(currentState.date))}
                    {renderContent(
                      'Payment Type',
                      renderPaymentType(currentState.payment_type),
                    )}
                    {renderContent(
                      'Payment Amount',
                      `${defaultCurrencyFormat(currentState.amount)}`,
                    )}
                    {renderContent(
                      'Invoices',
                      // `${(currentState.invo)}`,
                      <Typography display="inline-block" variant="h4">
                        {strictValidArrayWithLength(currentState.all_invoice)
                          ? currentState.all_invoice.map((a, index) => {
                              return (
                                <Typography variant="h4" display="inline-block">
                                  {index ? `, ${a}` : a}
                                </Typography>
                              );
                            })
                          : 'N/A'}
                      </Typography>,
                    )}
                  </Stack>
                  <Stack py={2}>
                    {renderContent(
                      'Balance Amount',
                      unTotalAmount < 0
                        ? `${defaultCurrencyFormat(0)}`
                        : `${defaultCurrencyFormat(unTotalAmount)}`,
                      Math.sign(unTotalAmount) === -1 ||
                        Math.sign(unTotalAmount) === 0,
                      200,
                    )}
                  </Stack>
                </Stack>
                <Stack py={2}>
                  <Divider sx={{ mb: 2 }} />
                  {renderContent(
                    'Paid invoices for Account:',
                    strictValidObjectWithKeys(currentState.corporate_account) &&
                      `${currentState.corporate_account.name}`,
                  )}
                </Stack>
              </>
            )}
          </>
        )}

        <ReactTable
          globalFilterShow={true}
          filterButton={false}
          sxTable={{
            overflowX: 'initial',
          }}
          onFilter={(dates) => {
            callUnApplyInvoiceApi({
              ...dates,
              type: [
                BillingStatus.FULLY_PAID_STATUS,
                BillingStatus.PARTIALLY_PAID_STATUS,
              ],
              account_id: currentState.account_id,
              payment_id: currentState.id,
            });
            setUnSelectedInvoice([]);
            setUnTotalAmount(
              Number(currentState.amount) - Number(currentState.balance),
            );
          }}
          onClearFilter={() => {
            callUnApplyInvoiceApi({
              type: [
                BillingStatus.FULLY_PAID_STATUS,
                BillingStatus.PARTIALLY_PAID_STATUS,
              ],
              account_id: currentState.account_id,
              payment_id: currentState.id,
            });
            setUnSelectedInvoice([]);
            setUnTotalAmount(
              Number(currentState.amount) - Number(currentState.balance),
            );
          }}
          isDateFilter
          pagination={false}
          headerFilter={false}
          height={{
            minHeight: 500,
            maxheight: 500,
            overfleow: 'scroll',
          }}
          loading={unapplyFilterisLoad}
          isLoadInner={unapplyFilterisLoadInner}
          customText={'You do not have any Invoices'}
          customHeight={true}
          columnDefs={[
            {
              Header: 'Invoice Id',
              accessor: 'invoice_id',
              width: 110,
              Cell: (props) => (
                <Stack py={1}>
                  <Typography>{props.row.original.invoice_id}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Issue Date',
              accessor: 'issue_date',
              width: 80,
              Cell: (props) => (
                <Stack py={1}>
                  <Typography>
                    {strictValidString(props.row.original.issue_date)
                      ? formatDateTime(
                          props.row.original.issue_date
                            .replace('T', ' ')
                            .replace('Z', ' '),
                        )
                      : formatDateTime(new Date(), DefaultDate)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Due Date',
              accessor: (originalRow, rowIndex) => {
                return strictValidObjectWithKeys(originalRow) &&
                  strictValidString(originalRow.due_date)
                  ? formatDateTime(
                      originalRow.due_date.replace('T', ' ').replace('Z', ' '),
                      DefaultDate,
                    )
                  : formatDateTime(new Date(), DefaultDate);
              },
              width: 120,
              Cell: (props) => (
                <Stack py={1}>
                  <Typography>
                    {strictValidString(props.row.original.due_date)
                      ? formatDateTime(
                          props.row.original.due_date
                            .replace('T', ' ')
                            .replace('Z', ' '),
                          DefaultDate,
                        )
                      : formatDateTime(new Date(), DefaultDate)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Period',
              accessor: 'period',
              width: 120,
              Cell: (props) => (
                <Stack py={1}>
                  {strictValidString(props.row.original.period) ? (
                    <Typography>{props.row.original.period}</Typography>
                  ) : (
                    <Typography>N/A</Typography>
                  )}
                </Stack>
              ),
            },
            {
              Header: 'Legs Count',
              accessor: 'legs_count',
              width: 80,
              Cell: (props) => (
                <Stack py={1}>
                  <Typography>{props.row.original.legs_count}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Amount',
              accessor: 'price',
              width: 80,
              rightAlign: true,
              Cell: (props) => (
                <Stack py={1}>
                  <Typography>
                    {defaultCurrencyFormat(props.row.original.price)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Amount Paid',
              accessor: 'amount_paid',
              width: 80,
              rightAlign: true,
              Cell: (props) => (
                <Stack py={1}>
                  <Typography>
                    {defaultCurrencyFormat(props.row.original.amount_paid)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Amount Due',
              accessor: 'amount_due',
              width: 80,
              rightAlign: true,
              Cell: (props) => (
                <Stack py={1}>
                  <Typography>
                    {defaultCurrencyFormat(props.row.original.amount_due)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Applied Amount',
              accessor: 'total_applied_amount_cp',
              width: 80,
              rightAlign: true,
              Cell: (props) => (
                <Stack py={1}>
                  <Typography>
                    {defaultCurrencyFormat(
                      props.row.original.total_applied_amount_cp,
                    )}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Notes',
              accessor: 'notes',
              width: 80,
              Cell: (props) => (
                <Stack>
                  <Typography>{props.row.original.notes}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Action',
              accessor: '',
              width: 80,
              Cell: (props) => (
                <>
                  <Checkbox
                    checked={
                      !unSelectedInvoiceId.some(
                        (val) => val === props.row.original.invoice_id,
                      )
                    }
                    onChange={(e) => {
                      handleChangeUnInvoice(
                        e,
                        props.row.original.invoice_id,
                        // checkbalance,
                      );
                      const { checked } = e.currentTarget;
                      if (checked) {
                        updateItem(
                          unApplyPaymentData,
                          props.row.original.id,
                          'total_applied_amount_cp',
                          Number(props.row.original.total_applied_amount),
                        );
                        setUnTotalAmount(
                          unTotalAmount -
                            Number(props.row.original.total_applied_amount),
                        );
                        updateItem(
                          unApplyPaymentData,
                          props.row.original.id,
                          'amount_due',
                          Number(props.row.original.amount_due) -
                            Number(props.row.original.total_applied_amount),
                        );
                      } else {
                        updateItem(
                          unApplyPaymentData,
                          props.row.original.id,
                          'total_applied_amount_cp',
                          0,
                        );
                        updateItem(
                          unApplyPaymentData,
                          props.row.original.id,
                          'total_applied_amount_cp',
                          0,
                        );
                        setUnTotalAmount(
                          unTotalAmount +
                            Number(props.row.original.total_applied_amount),
                        );
                        updateItem(
                          unApplyPaymentData,
                          props.row.original.id,
                          'amount_due',
                          Number(props.row.original.amount_due) +
                            Number(props.row.original.total_applied_amount),
                        );
                      }
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </>
              ),
            },
          ]}
          rowData={unApplyPaymentData || []}
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
              clearUnApplyState();
              callFlushPaymentId();
              apiCall();
            }}
            // loading={invoiceStatusIsLoad}
            size="large"
            color="error"
            variant="outlined"
          >
            Cancel
          </LoadingButton>
          <LoadingButton
            loading={load}
            disabled={!strictValidArrayWithLength(unSelectedInvoiceId)}
            onClick={() => {
              UnApplyInvoiceId();
            }}
            sx={{ ml: 2 }}
            size="large"
            color="primary"
            variant="contained"
          >
            UnApply Payment
          </LoadingButton>
        </Stack>
      </Dialog>
    );
  };
  const deleteChildToggle = () => {
    setChildTripDialog(!childTripDialog);
  };
  const deleteTripWithChild = async (id) => {
    setDeleteLoad(true);
    const res = await callDeletePaymentIdApi(id);
    if (res) {
      deleteChildToggle();
      setDeleteLoad(false);
      apiCall();
      socket.emit('add_payments');
    }
  };
  const deleteDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        isOpen={childTripDialog}
        fullWidth={true}
        maxWidth={'sm'}
        sxAppBar={{ justifyContent: 'center', alignItems: 'center' }}
        sxTitle={{ fontSize: 24 }}
        closeIcon={false}
        appBarColor="error"
        title={'Warning !'}
        handleClose={() => {
          deleteChildToggle();
        }}
      >
        <DialogContent>
          {strictValidObjectWithKeys(currentState.corporate_account) && (
            <DialogContentText
              className={classes.title}
              id="alert-dialog-slide-description"
            >
              {`Do you want to delete the Payment Ref# ${
                currentState.reference_number || 'N/A'
              } / ${moment(currentState.date).format(DefaultDate)}, from ${
                currentState.corporate_account.name
              }?`}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: 'space-around', display: 'flex', mt: 2 }}
        >
          <Button
            color="error"
            className={classes.buttonForceAction}
            variant="outlined"
            onClick={() => deleteTripWithChild(currentState.id)}
          >
            {deleteLoad ? <CircularProgress size={25} color="error" /> : 'Yes'}
          </Button>
          <Button
            className={classes.buttonForceAction}
            color="success"
            variant="outlined"
            onClick={() => deleteChildToggle()}
          >
            No
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
        title={`Payment Info`}
        handleClose={() => {
          infoToggle();
          apiCall();
        }}
      >
        <DialogContent>
          <PaymentInfo data={current} />
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
              apiCall();
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      <Grid>
        <ReactTable
          onFilter={(dates) => {
            callPaymentListApi({
              ...dates,
            });
          }}
          onClearFilter={() => {
            callPaymentListApi();
          }}
          filterButton={false}
          isDateFilter
          globalFilterShow={true}
          excelName={`Payments`}
          headerFilter={strictValidArrayWithLength(data)}
          loading={!refreshing && isLoad}
          showExport
          isLoadInner={false}
          customText={'You do not have any configured Payments'}
          columnDefs={[
            {
              Header: 'Account',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  strictValidObjectWithKeys(originalRow.corporate_account) &&
                  originalRow.corporate_account.name
                );
              },
              width: 160,
              Filter: SelectColumnFilter,
              Cell: (props) => (
                <MDTooltip title={props.row.original.corporate_account.name}>
                  <Typography height={55}>
                    {strictValidObjectWithKeys(
                      props.row.original.corporate_account,
                    ) && props.row.original.corporate_account.name}
                  </Typography>
                </MDTooltip>
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
              width: 60,
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
              width: 90,
            },
            {
              Header: 'Payment Date',
              Filter: DateFilter,
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  formatDate(originalRow.date)
                );
              },
              width: 70,
              Cell: (props) => (
                <>
                  <Typography>{formatDate(props.row.original.date)}</Typography>
                </>
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
              rightAlign: true,
              width: 70,
              disableSortBy: true,
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
              width: 70,
              rightAlign: true,
              Cell: (props) => (
                <>
                  <Typography>
                    {defaultCurrencyFormat(props.row.original.balance)}{' '}
                  </Typography>
                </>
              ),
            },
            {
              Header: 'Invoice #',
              accessor: (originalRow, rowIndex) => {
                return strictValidObjectWithKeys(originalRow) &&
                  strictValidArrayWithLength(originalRow.all_invoice)
                  ? originalRow.all_invoice.map((a) => {
                      return a;
                    })
                  : 'N/A';
              },
              disableSortBy: true,
              width: 180,
              Cell: (props) => (
                <MDTooltip
                  isMultiple
                  title={
                    strictValidArrayWithLength(
                      props.row.original.all_invoice,
                    ) &&
                    props.row.original.all_invoice.map((a, index) => {
                      return (
                        <Typography
                          display="inline-block"
                          variant="subtitle1"
                          color="secondary.main"
                        >
                          {index ? `, ${a}` : a}
                        </Typography>
                      );
                    })
                  }
                >
                  <Typography display="inline-block">
                    {strictValidArrayWithLength(props.row.original.all_invoice)
                      ? props.row.original.all_invoice.map((a, index) => {
                          return (
                            <Typography display="inline-block">
                              {index ? `, ${a}` : a}
                            </Typography>
                          );
                        })
                      : 'N/A'}
                  </Typography>
                </MDTooltip>
              ),
            },

            {
              Header: 'Status',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  renderPaymentStatus(originalRow.type)
                );
              },
              width: 90,
              Filter: SelectColumnFilter,
              Cell: (props) => (
                <Typography>
                  {renderPaymentStatus(props.row.original.type)}
                </Typography>
              ),
            },
            {
              Header: 'Notes',
              accessor: (originalRow, rowIndex) => {
                return strictValidObjectWithKeys(originalRow) &&
                  strictValidString(originalRow.notes)
                  ? originalRow.notes
                  : 'N/A';
              },
              width: 230,
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
              Header: 'Actions',
              accessor: '',
              width: 130,
              Filter: false,
              disableSortBy: true,
              Cell: (props) => (
                <>
                  <EditableButton
                    infoButton={true}
                    applyAction
                    unApplyAction
                    applyButtonClicked={async () => {
                      const field = props.row.original;
                      callFilterInvoice(field.account_id);
                      toggleApplyAction();
                      callPaymentByIDApi(field.id);
                      // setCurrentState(field);
                      // setTotalAmount(field.balance);
                    }}
                    unApplyButtonClicked={() => {
                      const field = props.row.original;
                      callUnApplyFilterInvoice(field);
                      toggleUnApplyAction();
                      callPaymentByIDApi(field.id);
                      // setCurrentState(field);
                      // setUnTotalAmount(Number(field.balance));
                    }}
                    applyIconDisabled={props.row.original.type === 'applied'}
                    unApplyIconDisabled={props.row.original.type === 'created'}
                    applyIconTitle="Apply"
                    unApplyIconTitle="Unapply"
                    hideDeleteButton={
                      props.row.original.type === 'applied' ||
                      props.row.original.type === 'applied_partially'
                    }
                    deleteButtonDisabled={
                      props.row.original.type === 'applied' ||
                      props.row.original.type === 'applied_partially'
                    }
                    cancelIcon={false}
                    deleteButtonClicked={() => {
                      const field = props.row.original;
                      setCurrentState(field);

                      deleteChildToggle();
                    }}
                    editButtonClicked={() => {
                      const field = props.row.original;
                      setData(field);
                    }}
                    infoButtonClick={() => {
                      const field = props.row.original;
                      setCurrent(field);
                      infoToggle();
                      callAuditApi({ payment_id: field.id });
                    }}
                  />
                </>
              ),
            },
          ]}
          rowData={Array.isArray(data) ? data : []}
        />
      </Grid>
      {renderApplyDialog()}
      {renderUnApplyDialog()}
      {deleteDialog()}
      {infoDialog()}
    </>
  );
};

PaymentList.propTypes = {
  callPaymentListApi: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

PaymentList.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.payments.payment.message,
    isLoad: state.payments.payment.isLoad,
    loadErr: state.payments.payment.loadErr,
    data: state.payments.payment.data,
    isLoadInner: state.payments.payment.isLoadInner,
    isFilterLoad: state.payments.filterInvoice.isLoad,
    isFilterLoadInner: state.payments.filterInvoice.isLoadInner,
    filterdata: state.payments.filterInvoice.data,
    unapplyFilterData: state.payments.unapplyInvoice.data,
    unapplyFilterisLoad: state.payments.unapplyInvoice.isLoad,
    unapplyFilterisLoadInner: state.payments.unapplyInvoice.isLoadInner,
    filterById: state.payments.paymentId.data,
    filterByIdLoad: state.payments.paymentId.isLoad,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callPaymentListApi: (...params) => dispatch(getAllPayments(...params)),
  callCorporateAccountApi: (...params) =>
    dispatch(getCorporateAccount(...params)),
  callFilterInvoiceApi: (...params) => dispatch(getFilterInvoice(...params)),
  callUnApplyInvoiceApi: (...params) => dispatch(getUnApplyInvoice(...params)),
  callDeletePaymentIdApi: (...params) => dispatch(deletePaymentId(...params)),
  callApplyInvoiceIdApi: (...params) => dispatch(applyInvoiceId(...params)),
  callUnApplyInvoiceIdApi: (...params) => dispatch(unApplyInvoiceId(...params)),
  callAuditApi: (...params) => dispatch(getPaymentAudit(...params)),
  callPaymentByIDApi: (...params) => dispatch(getPaymentByID(...params)),
  callFlushPaymentId: (...params) => dispatch(flushPaymentId(...params)),
});
export default connect(mapStateProps, mapDispatchToProps)(PaymentList);

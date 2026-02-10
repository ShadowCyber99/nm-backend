/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from 'react';
import {
  Grid,
  Stack,
  Typography,
  Box,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  defaultCurrencyFormat,
  formatDateTime,
  strictValidArrayWithLength,
  strictValidNumber,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/common-utils';
import ReactTable from '../../../components/react-table';
import {
  billedInvoice,
  finalizeInvoicing,
  deleteBilledInvoice,
  updateBilledInvoice,
  updateDateBilledInvoice,
  updateValidateInvoice,
  billedUpdateInvoice,
  socketBilledInvoice,
  getTripDetails,
  saveState,
  getState,
} from '../action';
import { useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import Dialog from '../../../components/dialog';
import { DefaultDate } from '../../../utils/constant';
import {
  DateFilter,
  SelectColumnFilter,
} from '../../../components/react-table/helper';
import store from 'store2';
import { buttonRoleAccess } from '../../../utils/traits';
import EditTripInBilling from '../edit-trip';
import { tripIegId } from '../../trip-management/action';
import { getActiveCapabilityRoles } from '../../vehicle-management/action';
import { SocketContext } from '../../../hooks/useSocketContext';
import MDTooltip from '../../../components/tooltip';
import { get } from 'lodash';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BilledInvoiceInfo from '../billed-invoice-info';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const BilledInvoice = ({
  setCurrentTab,
  isLoad,
  isLoadInner,
  message,
  arrData,
  data,
  callUpdateValidateInvoice,
  callBilledInvoiceApi,
  loadErr,
  redirectNumber,
  redirectToMain,
  callCapabilityRolesApi,
  totalRecords,
  callSaveState,
  callSocketBilledInvoiceApi,
  callGetState,
}) => {
  const [loading, setloading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(false);
  const [isConfirmDialog, setIsConfirmDialog] = useState(false);
  const [currentTrip, setCurrentTrip] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [isInfoDialog, setIsInfoDialog] = useState(false);
  const socket = useContext(SocketContext);
  const userValue = store.get('user') || {};
  const [isViewInvoice, setIsViewInvoice] = useState(false);
  const [currentViewData, setCurrentViewData] = useState();
  const [total, changeTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [pagination, changePagination] = useState({
    total: 0,
    recordsPerPage: null,
    pageIndex: 0,
    currentPage: 1,
  });

  const changePageSize = (pageSize) => {
    changePagination((prevState) => ({
      ...prevState,
      recordsPerPage: pageSize,
      pageIndex: 0,
    }));
    callBilledInvoiceApi({
      type: 'initialized',
      search: search,
      limit: pageSize,
      skip: 0,
    });
  };

  const setRecordsPerPage = (size) => {
    changePagination((prevState) => ({
      ...prevState,
      recordsPerPage: size,
    }));
    callBilledInvoiceApi({
      type: 'initialized',
      limit: size,
      search: search,
      skip: pagination.pageIndex * size,
    });
  };

  useEffect(() => {
    callCapabilityRolesApi();
  }, []);
  useEffect(() => {
    if (pagination.recordsPerPage !== null) {
      callBilledInvoiceApi({
        type: 'initialized',
        search: search,
        limit: pagination.recordsPerPage,
        skip: pagination.pageIndex * pagination.recordsPerPage,
      });
    }
  }, []);

  useEffect(() => {
    const data = {
      type: 'initialized',
      search: search,
      limit: pagination.recordsPerPage,
      skip: pagination.pageIndex * pagination.recordsPerPage,
    };
    callSaveState(data);
    callGetState();
  }, [pagination, search]);

  const changePageIndex = (pageIndex) => {
    changePagination({
      ...pagination,
      pageIndex: pageIndex,
    });
    callBilledInvoiceApi({
      type: 'initialized',
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

  const emitPayment = () => {
    socket.emit('add_payments');
  };
  const callSocketApi = () => {
    callSocketBilledInvoiceApi({
      type: 'initialized',
      reducer: 'disputedAccepted',
      search: search,
      limit: pagination.recordsPerPage,
      skip: pagination.pageIndex * pagination.recordsPerPage,
    });
  };
  useEffect(() => {
    socket.on('refresh_payments', () => {
      callSocketApi();
    });
    return () => {
      socket.off('refresh_payments');
    };
  }, []);

  const searchQueryFilter = (e) => {
    callBilledInvoiceApi({
      type: 'initialized',
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
    callBilledInvoiceApi({
      type: 'initialized',
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

  const finalizeInvoice = async (invoice_id, type, redirectKey) => {
    setloading(true);
    const invoiceData = { invoice_id: invoice_id, type: type };
    const res = await callUpdateValidateInvoice(invoiceData);
    if (res) {
      emitPayment();
      setloading(false);
      callBilledInvoiceApi({
        type: 'initialized',
        search: search,
        limit: pagination.recordsPerPage,
        skip: pagination.pageIndex * pagination.recordsPerPage,
      });
      if (strictValidArrayWithLength(data) && data.length === 1) {
        setCurrentTab(redirectKey);
      }
    }
  };

  useEffect(() => {
    if (loadErr) {
      enqueueSnackbar(loadErr, {
        variant: 'error',
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
    }
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

  const infoToggle = () => {
    setIsInfoDialog(!isInfoDialog);
  };

  const confrimToggle = () => {
    setIsConfirmDialog(!isConfirmDialog);
  };

  const isViewToggle = () => {
    if (isViewInvoice) {
      callBilledInvoiceApi({
        type: 'initialized',
        search: search,
        limit: pagination.recordsPerPage,
        skip: pagination.pageIndex * pagination.recordsPerPage,
      });
    }
    setIsViewInvoice(!isViewInvoice);
  };

  const viewInvoiceDetails = () => {
    return (
      <BilledInvoiceInfo
        currentViewData={
          strictValidObjectWithKeys(currentViewData) ? currentViewData : {}
        }
        fetchTripData={true}
        isViewToggle={isViewToggle}
        isViewInvoice={isViewInvoice}
      />
    );
  };

  const confirmationDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        isOpen={isConfirmDialog}
        title={'Are you sure ?'}
        handleClose={() => {
          confrimToggle();
        }}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Do You want to cancel this invoice ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => confrimToggle()}
          >
            No
          </Button>
          {!isLoad && strictValidArrayWithLength(data) ? (
            <LoadingButton
              color="error"
              variant="outlined"
              loading={loading}
              // disabled={
              //   strictValidObjectWithKeys(arrData) ||
              //   buttonRoleAccess(
              //     'initializedCancelInvoice',
              //     strictValidObjectWithKeys(userValue) &&
              //     userValue.role_ßid,
              //   )
              // }
              onClick={() => {
                finalizeInvoice(selectedInvoice, 'cancelled', redirectToMain);

                confrimToggle();
              }}
            >
              Yes
            </LoadingButton>
          ) : null}
        </DialogActions>
      </Dialog>
    );
  };

  const infoDialog = () => {
    return (
      <Dialog
        fullScreen={true}
        isOpen={isInfoDialog}
        fullWidth={true}
        maxWidth={'xl'}
        sxAppBar={{ justifyContent: 'center' }}
        sxTitle={{ fontSize: 24, textAlign: 'center' }}
        closeIcon={true}
        title={
          strictValidObjectWithKeys(currentTrip)
            ? `Edit Trip ${currentTrip?.leg_id}`
            : 'Loading...'
        }
        handleClose={() => {
          infoToggle();
        }}
      >
        <DialogContent>
          {strictValidObjectWithKeys(currentTrip) ? (
            <EditTripInBilling
              callApiFunction={() => {
                callBilledInvoiceApi({
                  type: 'initialized',
                  search: search,
                  limit: pagination.recordsPerPage,
                  skip: pagination.pageIndex * pagination.recordsPerPage,
                });
              }}
              setValue={() => {
                infoToggle();
                setCurrentTrip({});
              }}
              current_tripData={currentTrip}
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <Grid>
        <ReactTable
          showExport
          loading={isLoad}
          serverSidePagination={true}
          downloadBtnBody={{
            type: 'initialized',
            name: 'Initialized Invoice',
            search: search,
          }}
          isLoadInner={isLoadInner}
          customText={`You do not have any Invoices`}
          recordsPerPage={pagination.recordsPerPage}
          serverSideFilter={(e) => searchQueryFilter(e)}
          clearFilterButton={() => {
            clearQueryFilter('');
          }}
          pageNumber={pagination.pageIndex}
          changePageSize={changePageSize}
          changePageIndex={changePageIndex}
          setRecordsPerPage={setRecordsPerPage}
          onFilter={(dates) => {
            callBilledInvoiceApi({
              type: 'initialized',
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
            callBilledInvoiceApi({
              type: 'initialized',
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
              Header: 'Action',
              accessor: 'Action',
              width: 120,
              Filter: false,
              Cell: (props) => (
                <Stack direction="row" spacing={1}>
                  <Tooltip title={'View Invoice'}>
                    <span>
                      <IconButton
                        onClick={async () => {
                          const data = {
                            type: 'initialized',
                            invoice_id: props.row.original.invoice_id,
                            invoice_last_date:
                              props.row.original.invoice_last_date,
                            next_invoice_date:
                              props.row.original.next_invoice_date,
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
                  <Tooltip title={'Validate Invoice'}>
                    <IconButton
                      onClick={() =>
                        finalizeInvoice(
                          props.row.original.invoice_id,
                          'validated',
                          redirectNumber,
                        )
                      }
                      disabled={buttonRoleAccess(
                        'sendReceiveDissabled',
                        strictValidObjectWithKeys(userValue) &&
                          userValue.role_id,
                      )}
                      color="primary"
                      size="medium"
                    >
                      <CheckIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={'Cancel Invoice'}>
                    <span>
                      <IconButton
                        disabled={
                          strictValidObjectWithKeys(arrData) ||
                          buttonRoleAccess(
                            'initializedCancelInvoice',
                            strictValidObjectWithKeys(userValue) &&
                              userValue.role_id,
                          )
                        }
                        onClick={async () => {
                          confrimToggle();
                          setSelectedInvoice(props.row.original.invoice_id);
                        }}
                        color="primary"
                        size="medium"
                      >
                        <CloseIcon color="error" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
              ),
            },
          ]}
          total={total}
          rowData={Array.isArray(data) ? data : []}
        />
      </Grid>
      {infoDialog()}
      {confirmationDialog()}
      {viewInvoiceDetails()}
    </>
  );
};

BilledInvoice.propTypes = {
  callBilledInvoiceApi: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

BilledInvoice.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.billing.billedInvoice.message,
    isLoad: state.billing.billedInvoice.isLoad,
    loadErr: state.billing.billedInvoice.loadErr,
    data: state.billing.billedInvoice.data.result,
    isLoadInner: state.billing.billedInvoice.isLoadInner,
    totalRecords: state.billing.billedInvoice.totalRecords,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callBilledInvoiceApi: (...params) => dispatch(billedInvoice(...params)),
  callSocketBilledInvoiceApi: (...params) =>
    dispatch(socketBilledInvoice(...params)),
  callUpdateBilledInvoiceApi: (...params) =>
    dispatch(billedUpdateInvoice(...params)),
  callFinalizeInvoiceApi: (...params) => dispatch(finalizeInvoicing(...params)),
  callDeleteBilledInvoice: (...params) =>
    dispatch(deleteBilledInvoice(...params)),
  callUpdateValidateInvoice: (...params) =>
    dispatch(updateValidateInvoice(...params)),
  callUpdateBilledInvoice: (...params) =>
    dispatch(updateBilledInvoice(...params)),
  callUpdateDateBilledInvoice: (...params) =>
    dispatch(updateDateBilledInvoice(...params)),
  callTripIegId: (...params) => dispatch(tripIegId(...params)),
  callCapabilityRolesApi: (...params) =>
    dispatch(getActiveCapabilityRoles(...params)),
  callTripDetailsApi: (...params) => dispatch(getTripDetails(...params)),
  callSaveState: (...params) => dispatch(saveState(...params)),
  callGetState: (...params) => dispatch(getState(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(BilledInvoice);

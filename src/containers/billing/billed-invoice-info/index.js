/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  Stack,
  Typography,
  Box,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  InputAdornment,
  CircularProgress,
  FormHelperText,
  TextField,
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
  formatDate,
  getPhoenixDateTime,
  zoneFormat,
  defaultPropGetter,
} from '../../../utils/common-utils';
import ReactTable from '../../../components/react-table';
import {
  billedInvoice,
  finalizeInvoicing,
  deleteBilledInvoice,
  updateBilledInvoice,
  updateDateBilledInvoice,
  updateValidateInvoice,
  socketBilledInvoice,
  getTripDetails,
} from '../action';
import { useEffect } from 'react';
import EditableButton from '../../../components/react-table/components/editable-button';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import FinalFormText from '../../../components/final-form/input-text';
import { Field, Form } from 'react-final-form';
import Dialog from '../../../components/dialog';
import createDecorator from 'final-form-focus';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { invalidSymbol, transportStatus } from '../../../utils/constant';
import MdDatePicker from '../../../components/mdDatePicker';
import store from 'store2';
import { buttonRoleAccess } from '../../../utils/traits';
import EditTripInBilling from '../edit-trip';
import { tripIegId } from '../../trip-management/action';
import { getActiveCapabilityRoles } from '../../vehicle-management/action';
// import { SocketContext } from '../../../hooks/useSocketContext';
import { makeStyles } from '@mui/styles';
import EmptyContainerLoad from '../../../components/empty-container-load';
import MDTooltip from '../../../components/tooltip';
import { trim } from 'lodash';

const focusOnErrors = createDecorator();

const useStyles = makeStyles((theme) => ({
  helperText: {
    margin: `${theme.spacing(0.2, 0, 0, 0)} !important`,
    color: theme.palette.error.main,
    backgroundColor: '#F3F3F3',
  },
}));

const BilledInvoiceInfo = ({
  isLoad,
  isLoadInner,
  message,
  currentViewData = {},
  isViewToggle = () => {},
  isViewInvoice = false,
  fetchTripData = false,
  callApiFunction = defaultPropGetter,
  callDeleteBilledInvoice,
  callUpdateBilledInvoice,
  callUpdateDateBilledInvoice,
  loadErr,
  callTripIegId,
  callCapabilityRolesApi,
  callTripDetailsApi,
}) => {
  const classes = useStyles();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isAddDailog, setAddDialog] = useState(false);
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [current, setCurrent] = useState({});
  const [addData, setAddData] = useState({});
  const [currentTrip, setCurrentTrip] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [isInfoDialog, setIsInfoDialog] = useState(false);
  const [errorData, setErrorData] = useState('');
  // const socket = useContext(SocketContext);
  const userValue = store.get('user') || {};
  const [viewData, setViewData] = useState([]);

  const callApi = async () => {
    if (strictValidObjectWithKeys(currentViewData)) {
      const res = await callTripDetailsApi(currentViewData);
      if (res) {
        setViewData(res);
      }
    }
  };
  useEffect(() => {
    callCapabilityRolesApi();
  }, []);

  // const callSocketApi = () => {
  //   callSocketBilledInvoiceApi();
  // };

  useEffect(async () => {
    if (strictValidObjectWithKeys(currentViewData)) {
      const apicalldata = {
        type: currentViewData.type,
        invoice_id: currentViewData.invoice_id,
      };
      const res = await callTripDetailsApi(apicalldata);
      if (res) {
        setViewData(res);
      }
    }
  }, [currentViewData]);

  // const emitPayment = () => {
  //   socket.emit('add_payments');
  // };
  // useEffect(() => {
  //   socket.on('refresh_payments', () => {
  //     callSocketApi();
  //   });
  //   return () => {
  //     socket.off('refresh_payments');
  //   };
  // }, []);

  const onSubmit = async (val) => {
    const res = await callUpdateBilledInvoice({
      price: val.price,
      invoice_id: current.invoice_id,
      trip_id: current.trip_id,
      service_name:
        strictValidObjectWithKeys(current) &&
        current.service_name === 'extra_charges'
          ? 'extra_charges'
          : current.service_name,
      service_description: val.description,
      capability_id: current.capability_id,
      name:
        strictValidObjectWithKeys(current) &&
        current.service_name === 'extra_charges'
          ? current.name
          : '',
    });

    if (res) {
      callApi();
      toggle();
      // setShowIcon('+');
    }
  };
  const onAddSubmit = async (val) => {
    const res = await callUpdateBilledInvoice({
      price: val.price,
      invoice_id: addData.invoice_id,
      trip_id: addData.trip_id,
      service_name: 'extra_charges',
      service_description: val.service_description,
      capability_id: addData.capability_id,
    });
    if (res) {
      callApi();
      addDialog();
      // setShowIcon('+');
    }
  };

  const onSubmitDate = async (val, button) => {
    const res = await callUpdateDateBilledInvoice({
      created_at: val,
      invoice_id: button[0],
    });
    if (res) {
      callApi();
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
      setErrorData(loadErr);
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

  const toggle = () => {
    setIsOpenDialog(!isOpenDialog);
  };
  const addDialog = () => {
    setAddDialog(!isAddDailog);
  };

  const renderAddDialog = () => {
    const title = 'Add Charges';

    return (
      <Dialog
        fullScreen={false}
        isOpen={isAddDailog}
        title={title}
        handleClose={() => {
          addDialog();
          // setShowIcon('+');
          setErrorData('');
        }}
      >
        <Form
          onSubmit={onAddSubmit}
          keepDirtyOnReinitialize
          decorators={[focusOnErrors]}
          initialValues={{
            price: strictValidObjectWithKeys(addData) ? addData.price : '+',
            leg_id: strictValidObjectWithKeys(addData) ? addData.leg_id : '',
            service_description: strictValidObjectWithKeys(addData)
              ? addData.service_description
              : '',
          }}
          validate={(values) => {
            const errors = {};
            if (!values.price) {
              errors.price = 'Price is required';
            }
            if (!values.service_description) {
              errors.service_description = 'Service Name is required';
            }
            return errors;
          }}
          render={({
            handleSubmit,
            pristine,
            values,
            form,
            submitting,
            valid,
            touched,
            errors,
          }) => {
            return (
              <form handleSubmit={(e) => e.preventDefault()}>
                <div>
                  <Field
                    component={FinalFormText}
                    name="leg_id"
                    placeholder="Leg ID"
                    required
                    disabled
                  />
                  <Field
                    component={FinalFormText}
                    name="service_description"
                    id="add_service_description"
                    required
                    type="text"
                    placeholder="Service Type"
                  >
                    {({ input, meta }) => {
                      return (
                        <>
                          <TextField
                            variant="outlined"
                            name="service_description"
                            error={values.service_description ? false : true}
                            sx={{
                              mt: 2,
                              width: '550px',
                            }}
                            required={true}
                            id="add_service_description"
                            placeholder="Service Type"
                            label="Service Type"
                            type="text"
                            {...input}
                            onChange={(e) => {
                              input.onChange(e); //final-form's
                              setErrorData('');
                            }}
                          />
                          {strictValidString(
                            touched.service_description &&
                              errors.service_description,
                          ) && (
                            <FormHelperText
                              className={classes.helperText}
                              id="component-helper-text"
                            >
                              {touched.service_description &&
                                errors.service_description}
                            </FormHelperText>
                          )}
                        </>
                      );
                    }}
                  </Field>
                  <Field
                    component={FinalFormText}
                    name="price"
                    id="add_price"
                    placeholder="Price"
                    required
                  >
                    {({ input, meta }) => {
                      return (
                        <>
                          <TextField
                            variant="outlined"
                            name="price"
                            error={values.price ? false : true}
                            sx={{
                              mt: 2,
                              width: '550px',
                            }}
                            required={true}
                            id="add_price"
                            placeholder="Price"
                            label="Price"
                            {...input}
                            type="number"
                            onKeyDown={(evt) =>
                              invalidSymbol.includes(evt.key) &&
                              evt.preventDefault()
                            }
                            onChange={(e) => {
                              input.onChange(e); //final-form's
                              setErrorData('');
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <AttachMoneyIcon />
                                </InputAdornment>
                              ),
                              // endAdornment: (
                              //   <InputAdornment position="end">
                              //     <Button
                              //       sx={{
                              //         color:
                              //           addIcon === '-' ? '#0884c7' : 'black',
                              //         padding: 0,
                              //         marginLeft: -6,
                              //         minWidth: '30px',
                              //         '&:hover': {
                              //           backgroundColor: 'transparent',
                              //         },
                              //       }}
                              //       onClick={() => {
                              //         setShowIcon('-');
                              //         form.change('price', '-');
                              //       }}
                              //       variant="tertiary"
                              //     >
                              //       <RemoveIcon />
                              //     </Button>
                              //     |
                              //     <Button
                              //       sx={{
                              //         color:
                              //           addIcon === '+' ? '#0884c7' : 'black',
                              //         padding: 0,
                              //         minWidth: '30px',
                              //         '&:hover': {
                              //           backgroundColor: 'transparent',
                              //         },
                              //       }}
                              //       variant="tertiary"
                              //       onClick={() => {
                              //         setShowIcon('+');
                              //         form.change('price', '+');
                              //       }}
                              //     >
                              //       <AddIcon />
                              //     </Button>
                              //   </InputAdornment>
                              // ),
                            }}
                          />
                          {strictValidString(touched.price && errors.price) && (
                            <FormHelperText
                              className={classes.helperText}
                              id="component-helper-text"
                            >
                              {touched.price && errors.price}
                            </FormHelperText>
                          )}
                        </>
                      );
                    }}
                  </Field>
                </div>
                <LoadingButton
                  disabled={
                    pristine ||
                    submitting ||
                    !valid ||
                    // !(
                    //   (includes(get(values, 'price', ''), '-') &&
                    //     size(get(values, 'price', '')) > 1) ||
                    //   (includes(get(values, 'price', ''), '+') &&
                    //     size(get(values, 'price', '')) > 1)
                    // ) ||
                    errorData === 'This is invalid ammount'
                  }
                  onClick={handleSubmit}
                  type="submit"
                  fullWidth
                  size="large"
                  variant="contained"
                  loading={isLoad}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {'Add Charges'}
                </LoadingButton>
              </form>
            );
          }}
        />
      </Dialog>
    );
  };

  const renderDialog = () => {
    const title = 'Update Record';

    return (
      <Dialog
        fullScreen={false}
        isOpen={isOpenDialog}
        title={title}
        handleClose={() => {
          toggle();
          setErrorData('');
        }}
      >
        <Form
          onSubmit={onSubmit}
          keepDirtyOnReinitialize
          decorators={[focusOnErrors]}
          initialValues={{
            price: strictValidObjectWithKeys(current)
              ? current.price.toString()
              : '',
            leg_id:
              strictValidObjectWithKeys(current) &&
              current.service_name === 'extra_charges'
                ? current.base_trips.leg_id
                : current.leg_id,
            description: strictValidObjectWithKeys(current)
              ? current.description
              : '',
          }}
          validate={(values) => {
            const errors = {};
            if (!values.price) {
              errors.price = 'Price is required';
            }
            return errors;
          }}
          render={({
            handleSubmit,
            pristine,
            values,
            submitting,
            valid,
            form,
            touched,
            errors,
          }) => {
            return (
              <form>
                <div>
                  <Field
                    component={FinalFormText}
                    name="leg_id"
                    placeholder="Leg ID"
                    required
                    disabled
                  />
                  <Field
                    component={FinalFormText}
                    name="description"
                    id="add_description"
                    required
                    type="text"
                    placeholder="Service Type"
                  >
                    {({ input, meta }) => {
                      return (
                        <>
                          <TextField
                            variant="outlined"
                            name="description"
                            error={values.description ? false : true}
                            sx={{
                              mt: 2,
                              width: '550px',
                            }}
                            required={true}
                            id="add_description"
                            placeholder="Service Type"
                            label="Service Type"
                            type="text"
                            {...input}
                            disabled={
                              strictValidObjectWithKeys(current) &&
                              current.service_name !== 'extra_charges'
                            }
                            onChange={(e) => {
                              input.onChange(e); //final-form's
                              setErrorData('');
                            }}
                          />
                          {strictValidString(
                            touched.description && errors.description,
                          ) && (
                            <FormHelperText
                              className={classes.helperText}
                              id="component-helper-text"
                            >
                              {touched.description && errors.description}
                            </FormHelperText>
                          )}
                        </>
                      );
                    }}
                  </Field>
                  {strictValidObjectWithKeys(current) &&
                  current.service_name === 'extra_charges' ? (
                    <Field
                      component={FinalFormText}
                      name="price"
                      id="add_price"
                      placeholder="Price"
                      required
                    >
                      {({ input, meta }) => {
                        return (
                          <>
                            <TextField
                              variant="outlined"
                              name="price"
                              error={values.price ? false : true}
                              sx={{
                                mt: 2,
                                width: '550px',
                              }}
                              required={true}
                              id="add_price"
                              placeholder="Price"
                              label="Price"
                              onKeyDown={(evt) =>
                                invalidSymbol.includes(evt.key) &&
                                evt.preventDefault()
                              }
                              type="number"
                              {...input}
                              onChange={(e) => {
                                input.onChange(e); //final-form's
                                setErrorData('');
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <AttachMoneyIcon />
                                  </InputAdornment>
                                ),
                                // endAdornment: (
                                //   <InputAdornment position="end">
                                //     <Button
                                //       sx={{
                                //         color:
                                //           addIcon === '-' ? '#0884c7' : 'black',
                                //         padding: 0,
                                //         marginLeft: -6,
                                //         minWidth: '30px',
                                //         '&:hover': {
                                //           backgroundColor: 'transparent',
                                //         },
                                //       }}
                                //       onClick={() => {
                                //         setShowIcon('-');
                                //         form.change('price', '-');
                                //       }}
                                //       variant="tertiary"
                                //     >
                                //       <RemoveIcon />
                                //     </Button>
                                //     |
                                //     <Button
                                //       sx={{
                                //         color:
                                //           addIcon === '+' ? '#0884c7' : 'black',
                                //         padding: 0,
                                //         minWidth: '30px',
                                //         '&:hover': {
                                //           backgroundColor: 'transparent',
                                //         },
                                //       }}
                                //       variant="tertiary"
                                //       onClick={() => {
                                //         setShowIcon('+');
                                //         form.change('price', '+');
                                //       }}
                                //     >
                                //       <AddIcon />
                                //     </Button>
                                //   </InputAdornment>
                                // ),
                              }}
                            />
                            {strictValidString(
                              touched.price && errors.price,
                            ) && (
                              <FormHelperText
                                className={classes.helperText}
                                id="component-helper-text"
                              >
                                {touched.price && errors.price}
                              </FormHelperText>
                            )}
                          </>
                        );
                      }}
                    </Field>
                  ) : (
                    <Field
                      component={FinalFormText}
                      name="price"
                      placeholder="Price"
                      type="number"
                      required
                      onKeyDown={(evt) =>
                        invalidSymbol.includes(evt.key) && evt.preventDefault()
                      }
                      inputProps={{
                        maxlength: 3,
                        min: 0,
                      }}
                      errorText={touched.name && errors.name}
                      startAdornment={
                        <InputAdornment position="start">
                          <AttachMoneyIcon />
                        </InputAdornment>
                      }
                    />
                  )}
                </div>
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
                  {'Update Price'}
                </LoadingButton>
              </form>
            );
          }}
        />
      </Dialog>
    );
  };
  const deleteToggle = () => {
    setIsDeleteDialog(!isDeleteDialog);
  };

  const deleteBaseInvoice = async (val) => {
    if (strictValidObjectWithKeys(val)) {
      const result = await callDeleteBilledInvoice({ initialized_data: val });
      if (result) {
        callApi();
        deleteToggle();
      }
    }
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
                callApi();
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

  const deleteDialog = () => {
    const name =
      strictValidObjectWithKeys(current) &&
      !strictValidString(current.service_name)
        ? 'trip'
        : 'service';
    return (
      <Dialog
        fullScreen={false}
        isOpen={isDeleteDialog}
        title={'Are you sure ?'}
        handleClose={() => {
          deleteToggle();
        }}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Do You want to delete this {name} from the invoice ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => deleteToggle()}
          >
            No
          </Button>
          <Button
            color="error"
            variant="outlined"
            onClick={() => deleteBaseInvoice(current)}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const renderDetails = (title, description) => {
    return (
      <Box mt={1}>
        <Stack alignItems="center" direction="row">
          <Typography variant="h7" sx={{ width: 300 }}>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ width: 700 }}>
            {description}
          </Typography>
        </Stack>
      </Box>
    );
  };

  const renderInitialDetails = (title, description, button) => {
    return (
      <Box mt={1}>
        <Stack alignItems={'center'} direction="row">
          <Typography variant="h7" sx={{ width: 300 }}>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ width: 150 }}>
            {description}
          </Typography>
          <MdDatePicker
            type="onlyIcon-datetime"
            disabled={buttonRoleAccess(
              'initializedValidateInvoice',
              strictValidObjectWithKeys(userValue) && userValue.role_id,
            )}
            value={button[1]}
            disablePast={false}
            toolbarPlaceholder={formatDate(button[1])}
            disableFuture={true}
            minDateTime={
              strictValidString(button[2]) ? new Date(button[2]) : null
            }
            maxDateTime={
              strictValidString(button[3])
                ? new Date(button[3])
                : getPhoenixDateTime()
            }
            onChange={(e) => {
              onSubmitDate(formatDateTime(e, 'YYYY-MM-DD HH:mm:00'), button);
            }}
          />
        </Stack>
      </Box>
    );
  };
  return (
    <>
      <Dialog
        fullScreen={true}
        isOpen={isViewInvoice}
        title={'Invoice View'}
        handleClose={() => {
          isViewToggle();
        }}
      >
        <Box mt={2}>
          {isLoad ? (
            <EmptyContainerLoad />
          ) : (
            <>
              {strictValidArrayWithLength(viewData) ? (
                <>
                  <Box
                    justifyContent="space-between"
                    flexDirection="row"
                    display="flex"
                    alignItems="flex-start"
                    py={1}
                  >
                    <Box>
                      {renderDetails(
                        'Account',
                        strictValidArrayWithLength(viewData) &&
                          strictValidString(viewData[0].name)
                          ? viewData[0].name
                          : 'N/A',
                      )}
                      {strictValidArrayWithLength(viewData) &&
                      strictValidString(viewData[0].cost_center_name)
                        ? renderDetails(
                            'Cost Center Name',
                            strictValidArrayWithLength(viewData)
                              ? viewData[0].cost_center_name
                              : 'N/A',
                          )
                        : ''}
                      {strictValidArrayWithLength(viewData) &&
                      strictValidString(trim(viewData[0].po_number)) &&
                      viewData[0].po_number !== 'N/A'
                        ? renderDetails(
                            'PO Number',
                            strictValidArrayWithLength(viewData)
                              ? viewData[0].po_number
                              : 'N/A',
                          )
                        : ''}
                      {strictValidArrayWithLength(viewData) &&
                      strictValidString(
                        trim(viewData[0].cost_center_po_number),
                      ) &&
                      viewData[0].cost_center_po_number !== 'N/A'
                        ? renderDetails(
                            'Cost Center PO Number',
                            strictValidArrayWithLength(viewData)
                              ? viewData[0].cost_center_po_number
                              : 'N/A',
                          )
                        : ''}
                      {renderDetails(
                        'Billing Address',
                        strictValidArrayWithLength(viewData)
                          ? viewData[0].billing_address
                          : 'N/A',
                      )}
                      {renderDetails(
                        'Invoice',
                        strictValidArrayWithLength(viewData)
                          ? viewData[0].invoice_id
                          : 'N/A',
                      )}
                      {renderInitialDetails(
                        'Date',
                        strictValidArrayWithLength(viewData) &&
                          strictValidString(viewData[0].created_at)
                          ? formatDateTime(
                              viewData[0].created_at
                                .replace('T', ' ')
                                .replace('Z', ' '),
                            )
                          : 'N/A',
                        [
                          viewData[0].invoice_id,
                          viewData[0].created_at,
                          strictValidObjectWithKeys(currentViewData) &&
                            currentViewData.invoice_last_date,
                          strictValidObjectWithKeys(currentViewData) &&
                            currentViewData.next_invoice_date,
                        ],
                      )}
                      {renderDetails(
                        'Period',
                        strictValidArrayWithLength(viewData) &&
                          strictValidObjectWithKeys(viewData[0])
                          ? strictValidString(viewData[0].period) &&
                              viewData[0].period
                          : 'N/A',
                      )}
                      {renderDetails(
                        'Legs count',
                        strictValidArrayWithLength(viewData)
                          ? viewData[0].leg_count
                          : 'N/A',
                      )}
                    </Box>
                  </Box>
                  <ReactTable
                    sxTable={{
                      overflowX: 'initial',
                    }}
                    height={{
                      minHeight: 450,
                      maxheight: 450,
                      overfleow: 'scroll',
                    }}
                    showExport
                    excelName={`${
                      strictValidArrayWithLength(viewData) &&
                      strictValidString(viewData[0].name)
                        ? viewData[0].name
                        : 'N/A'
                    } Initialized`}
                    tableSize={true}
                    customHeight={true}
                    sxEmptyStyle={{ height: 300 }}
                    pagination={false}
                    headerFilter={false}
                    boxStyle={{
                      overflow: 'scroll',
                      maxHeight: 450,
                      backgroundColor: '#fff',
                    }}
                    loading={isLoad}
                    isLoadInner={isLoadInner}
                    customText={'You do not have any Invoices'}
                    columnDefs={[
                      {
                        Header: 'Leg ID',
                        disableSortBy: true,
                        accessor: (originalRow, rowIndex) => {
                          return strictValidObjectWithKeys(originalRow) &&
                            originalRow.is_parent
                            ? originalRow.leg_id
                            : '';
                        },
                        Cell: (props) => (
                          <Stack py={1}>
                            {props.row.original.is_parent &&
                            fetchTripData &&
                            !buttonRoleAccess(
                              'CreateInvoices',
                              userValue.role_id,
                            ) ? (
                              <Typography
                                variant="body2"
                                color="#0044CC"
                                sx={{
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                }}
                                onClick={async () => {
                                  infoToggle();
                                  const res = await callTripIegId(
                                    props.row.original.leg_id,
                                  );
                                  if (res) {
                                    setCurrentTrip({
                                      ...res,
                                      trip_update:
                                        strictValidObjectWithKeys(
                                          currentViewData,
                                        ) &&
                                        strictValidString(
                                          currentViewData.trip_update,
                                        )
                                          ? currentViewData.trip_update
                                          : null,
                                    });
                                  }
                                }}
                              >
                                {props.row.original.leg_id}
                              </Typography>
                            ) : (
                              <>
                                {props.row.original.is_parent && (
                                  <Typography variant="body2">
                                    {props.row.original.leg_id}
                                  </Typography>
                                )}
                              </>
                            )}
                          </Stack>
                        ),
                        width: 20,
                      },
                      {
                        Header: 'Leg Information',
                        accessor: (originalRow, rowIndex) => {
                          return originalRow.is_parent ||
                            (strictValidObjectWithKeys(originalRow) &&
                              originalRow.correct_zone === 0 &&
                              originalRow.description ===
                                'Out of service area fee Z1')
                            ? strictValidObjectWithKeys(originalRow) &&
                              strictValidObjectWithKeys(originalRow) &&
                              !strictValidNumber(originalRow.trip_id)
                              ? originalRow.name
                              : strictValidObjectWithKeys(originalRow) &&
                                originalRow.correct_zone === 0 &&
                                originalRow.description ===
                                  'Out of service area fee Z1'
                              ? 'Error : Zone needs to be recalculated'
                              : originalRow.status === 'completed'
                              ? `Date: ${
                                  formatDateTime(
                                    originalRow.estimated_end_time,
                                  ) === 'N/A'
                                    ? formatDate(originalRow.pick_up_date_time)
                                    : formatDateTime(
                                        originalRow.pick_up_date_time,
                                      )
                                }${
                                  strictValidString(originalRow.pickup_location)
                                    ? ', PU Location: ' +
                                      originalRow.pickup_location
                                    : ''
                                }, PU ZIP: ${originalRow.pu_zipcode} ${
                                  strictValidObjectWithKeys(
                                    originalRow.all_base_invoice_charges,
                                  ) &&
                                  strictValidObjectWithKeys(
                                    originalRow.all_base_invoice_charges
                                      .invoice_details,
                                  ) &&
                                  strictValidObjectWithKeys(
                                    originalRow.all_base_invoice_charges
                                      .invoice_details.out_of_service_area,
                                  )
                                    ? zoneFormat(
                                        originalRow.all_base_invoice_charges
                                          .invoice_details.out_of_service_area
                                          .pickup_zone,
                                      )
                                    : null
                                }${
                                  strictValidString(
                                    originalRow.dropoff_location,
                                  )
                                    ? ', DO Location: ' +
                                      originalRow.dropoff_location
                                    : ''
                                }, DO ZIP: ${originalRow.do_zipcode} ${
                                  strictValidObjectWithKeys(
                                    originalRow.all_base_invoice_charges,
                                  ) &&
                                  strictValidObjectWithKeys(
                                    originalRow.all_base_invoice_charges
                                      .invoice_details,
                                  ) &&
                                  strictValidObjectWithKeys(
                                    originalRow.all_base_invoice_charges
                                      .invoice_details.out_of_service_area,
                                  )
                                    ? zoneFormat(
                                        originalRow.all_base_invoice_charges
                                          .invoice_details.out_of_service_area
                                          .dropoff_zone,
                                      )
                                    : null
                                }, Patient Name: ${originalRow.first_name} ${
                                  originalRow.last_name
                                }${originalRow.name}${
                                  strictValidObjectWithKeys(
                                    originalRow.contact_details,
                                  )
                                    ? ', \nRequested by: ' +
                                      originalRow.contact_details.first_name +
                                      ' ' +
                                      originalRow.contact_details.last_name +
                                      ', tel: ' +
                                      (strictValidObjectWithKeys(
                                        originalRow.contact_details,
                                      ) &&
                                      strictValidArrayWithLength(
                                        originalRow.contact_details.phone,
                                      ) &&
                                      strictValidString(
                                        originalRow.contact_details.phone[0],
                                      )
                                        ? originalRow.contact_details.phone[0]
                                        : 'N/A') +
                                      ', Email: ' +
                                      (strictValidString(
                                        originalRow.contact_details.email_id,
                                      )
                                        ? originalRow.contact_details.email_id
                                        : 'N/A')
                                    : ''
                                }`
                              : `Date: ${formatDateTime(
                                  originalRow.pick_up_date_time,
                                )}${
                                  strictValidString(originalRow.pickup_location)
                                    ? ', PU Location: ' +
                                      originalRow.pickup_location
                                    : ''
                                }, PU ZIP: ${originalRow.pu_zipcode} ${
                                  strictValidObjectWithKeys(
                                    originalRow.all_base_invoice_charges,
                                  ) &&
                                  strictValidObjectWithKeys(
                                    originalRow.all_base_invoice_charges
                                      .invoice_details,
                                  ) &&
                                  strictValidObjectWithKeys(
                                    originalRow.all_base_invoice_charges
                                      .invoice_details.out_of_service_area,
                                  )
                                    ? zoneFormat(
                                        originalRow.all_base_invoice_charges
                                          .invoice_details.out_of_service_area
                                          .pickup_zone,
                                      )
                                    : null
                                } ${
                                  strictValidString(
                                    originalRow.dropoff_location,
                                  )
                                    ? ', DO Location: ' +
                                      originalRow.dropoff_location
                                    : ''
                                }, DO ZIP: ${originalRow.do_zipcode} ${
                                  strictValidObjectWithKeys(
                                    originalRow.all_base_invoice_charges,
                                  ) &&
                                  strictValidObjectWithKeys(
                                    originalRow.all_base_invoice_charges
                                      .invoice_details,
                                  ) &&
                                  strictValidObjectWithKeys(
                                    originalRow.all_base_invoice_charges
                                      .invoice_details.out_of_service_area,
                                  )
                                    ? zoneFormat(
                                        originalRow.all_base_invoice_charges
                                          .invoice_details.out_of_service_area
                                          .dropoff_zone,
                                      )
                                    : null
                                }, Patient Name: ${originalRow.first_name} ${
                                  originalRow.last_name
                                }, ${transportStatus(
                                  originalRow.status,
                                )} - ${formatDateTime(
                                  originalRow.completed_time,
                                )}${
                                  strictValidObjectWithKeys(
                                    originalRow.contact_details,
                                  )
                                    ? ', \nRequested by: ' +
                                      originalRow.contact_details.first_name +
                                      ' ' +
                                      originalRow.contact_details.last_name +
                                      ',  tel: ' +
                                      (strictValidObjectWithKeys(
                                        originalRow.contact_details,
                                      ) &&
                                      strictValidArrayWithLength(
                                        originalRow.contact_details.phone,
                                      ) &&
                                      strictValidString(
                                        originalRow.contact_details.phone[0],
                                      )
                                        ? originalRow.contact_details.phone[0]
                                        : 'N/A') +
                                      ', Email: ' +
                                      (strictValidString(
                                        originalRow.contact_details.email_id,
                                      )
                                        ? originalRow.contact_details.email_id
                                        : 'N/A')
                                    : ''
                                }`
                            : '';
                        },
                        disableSortBy: true,
                        width: 280,
                        Cell: (props) => (
                          <>
                            {props.row.original.is_parent &&
                              strictValidNumber(props.row.original.trip_id) && (
                                <Stack
                                  mt={
                                    strictValidObjectWithKeys(
                                      props.row.original.contact_details,
                                    )
                                      ? -0.5
                                      : 0
                                  }
                                >
                                  {props.row.original.status === 'completed' ? (
                                    <MDTooltip
                                      title={
                                        (formatDateTime(
                                          props.row.original.estimated_end_time,
                                        ) === 'N/A'
                                          ? 'Date: ' +
                                            formatDate(
                                              props.row.original
                                                .pick_up_date_time,
                                            )
                                          : 'Date: ' +
                                            formatDateTime(
                                              props.row.original
                                                .pick_up_date_time,
                                            )) +
                                        (strictValidString(
                                          props.row.original.pickup_location,
                                        )
                                          ? ', PU Location: ' +
                                            props.row.original.pickup_location
                                          : '') +
                                        ', PU ZIP:' +
                                        props.row.original.pu_zipcode +
                                        (strictValidObjectWithKeys(
                                          props.row.original
                                            .all_base_invoice_charges,
                                        ) &&
                                        strictValidObjectWithKeys(
                                          props.row.original
                                            .all_base_invoice_charges
                                            .invoice_details,
                                        ) &&
                                        strictValidObjectWithKeys(
                                          props.row.original
                                            .all_base_invoice_charges
                                            .invoice_details
                                            .out_of_service_area,
                                        )
                                          ? zoneFormat(
                                              props.row.original
                                                .all_base_invoice_charges
                                                .invoice_details
                                                .out_of_service_area
                                                .pickup_zone,
                                            )
                                          : '') +
                                        (strictValidString(
                                          props.row.original.dropoff_location,
                                        )
                                          ? ', DO Location: ' +
                                            props.row.original.dropoff_location
                                          : '') +
                                        ', DO ZIP: ' +
                                        props.row.original.do_zipcode +
                                        (strictValidObjectWithKeys(
                                          props.row.original
                                            .all_base_invoice_charges,
                                        ) &&
                                        strictValidObjectWithKeys(
                                          props.row.original
                                            .all_base_invoice_charges
                                            .invoice_details,
                                        ) &&
                                        strictValidObjectWithKeys(
                                          props.row.original
                                            .all_base_invoice_charges
                                            .invoice_details
                                            .out_of_service_area,
                                        )
                                          ? zoneFormat(
                                              props.row.original
                                                .all_base_invoice_charges
                                                .invoice_details
                                                .out_of_service_area
                                                .dropoff_zone,
                                            )
                                          : '') +
                                        ', Patient Name: ' +
                                        props.row.original.first_name +
                                        ' ' +
                                        props.row.original.last_name +
                                        props.row.original.name +
                                        (strictValidObjectWithKeys(
                                          props.row.original.contact_details,
                                        )
                                          ? ', Requested by: ' +
                                            props.row.original.contact_details
                                              .first_name +
                                            ' ' +
                                            props.row.original.contact_details
                                              .last_name +
                                            ', tel: ' +
                                            (strictValidString(
                                              props.row.original.contact_details
                                                .phone[0],
                                            )
                                              ? props.row.original
                                                  .contact_details.phone[0]
                                              : 'N/A') +
                                            ', Email: ' +
                                            (strictValidString(
                                              props.row.original.contact_details
                                                .email_id,
                                            )
                                              ? props.row.original
                                                  .contact_details.email_id
                                              : 'N/A')
                                          : '')
                                      }
                                    >
                                      <Typography height={55} variant="body2">
                                        Date{': '}
                                        {formatDateTime(
                                          props.row.original.estimated_end_time,
                                        ) === 'N/A'
                                          ? formatDate(
                                              props.row.original
                                                .pick_up_date_time,
                                            )
                                          : formatDateTime(
                                              props.row.original
                                                .pick_up_date_time,
                                            )}
                                        {strictValidString(
                                          props.row.original.pickup_location,
                                        ) &&
                                          ', PU Location: ' +
                                            props.row.original.pickup_location}
                                        , PU ZIP:{' '}
                                        {props.row.original.pu_zipcode}{' '}
                                        {strictValidObjectWithKeys(
                                          props.row.original
                                            .all_base_invoice_charges,
                                        ) &&
                                        strictValidObjectWithKeys(
                                          props.row.original
                                            .all_base_invoice_charges
                                            .invoice_details,
                                        ) &&
                                        strictValidObjectWithKeys(
                                          props.row.original
                                            .all_base_invoice_charges
                                            .invoice_details
                                            .out_of_service_area,
                                        )
                                          ? zoneFormat(
                                              props.row.original
                                                .all_base_invoice_charges
                                                .invoice_details
                                                .out_of_service_area
                                                .pickup_zone,
                                            )
                                          : ''}
                                        {strictValidString(
                                          props.row.original.dropoff_location,
                                        ) &&
                                          ',  DO Location: ' +
                                            props.row.original.dropoff_location}
                                        , DO ZIP:{' '}
                                        {props.row.original.do_zipcode}{' '}
                                        {strictValidObjectWithKeys(
                                          props.row.original
                                            .all_base_invoice_charges,
                                        ) &&
                                        strictValidObjectWithKeys(
                                          props.row.original
                                            .all_base_invoice_charges
                                            .invoice_details,
                                        ) &&
                                        strictValidObjectWithKeys(
                                          props.row.original
                                            .all_base_invoice_charges
                                            .invoice_details
                                            .out_of_service_area,
                                        )
                                          ? zoneFormat(
                                              props.row.original
                                                .all_base_invoice_charges
                                                .invoice_details
                                                .out_of_service_area
                                                .dropoff_zone,
                                            )
                                          : ''}
                                        , Patient Name:{' '}
                                        {props.row.original.first_name}{' '}
                                        {props.row.original.last_name}
                                        {props.row.original.name}
                                        {strictValidObjectWithKeys(
                                          props.row.original.contact_details,
                                        ) &&
                                          ', Requested by: ' +
                                            props.row.original.contact_details
                                              .first_name +
                                            ' ' +
                                            props.row.original.contact_details
                                              .last_name +
                                            ', tel: ' +
                                            (strictValidString(
                                              props.row.original.contact_details
                                                .phone[0],
                                            )
                                              ? props.row.original
                                                  .contact_details.phone[0]
                                              : 'N/A') +
                                            ', Email: ' +
                                            (strictValidString(
                                              props.row.original.contact_details
                                                .email_id,
                                            )
                                              ? props.row.original
                                                  .contact_details.email_id
                                              : 'N/A')}
                                      </Typography>
                                    </MDTooltip>
                                  ) : (
                                    <MDTooltip
                                      title={
                                        'Date: ' +
                                        formatDateTime(
                                          props.row.original.pick_up_date_time,
                                        ) +
                                        (strictValidString(
                                          props.row.original.pickup_location,
                                        )
                                          ? ', PU Location: ' +
                                            props.row.original.pickup_location
                                          : '') +
                                        (', PU ZIP: ' +
                                          props.row.original.pu_zipcode +
                                          (strictValidObjectWithKeys(
                                            props.row.original
                                              .all_base_invoice_charges,
                                          ) &&
                                          strictValidObjectWithKeys(
                                            props.row.original
                                              .all_base_invoice_charges
                                              .invoice_details,
                                          ) &&
                                          strictValidObjectWithKeys(
                                            props.row.original
                                              .all_base_invoice_charges
                                              .invoice_details
                                              .out_of_service_area,
                                          )
                                            ? zoneFormat(
                                                props.row.original
                                                  .all_base_invoice_charges
                                                  .invoice_details
                                                  .out_of_service_area
                                                  .pickup_zone,
                                              )
                                            : '')) +
                                        (strictValidString(
                                          props.row.original.dropoff_location,
                                        )
                                          ? ',  DO Location: ' +
                                            props.row.original.dropoff_location
                                          : '') +
                                        (', DO ZIP: ' +
                                          props.row.original.do_zipcode) +
                                        (strictValidObjectWithKeys(
                                          props.row.original
                                            .all_base_invoice_charges,
                                        ) &&
                                        strictValidObjectWithKeys(
                                          props.row.original
                                            .all_base_invoice_charges
                                            .invoice_details,
                                        ) &&
                                        strictValidObjectWithKeys(
                                          props.row.original
                                            .all_base_invoice_charges
                                            .invoice_details
                                            .out_of_service_area,
                                        )
                                          ? zoneFormat(
                                              props.row.original
                                                .all_base_invoice_charges
                                                .invoice_details
                                                .out_of_service_area
                                                .dropoff_zone,
                                            )
                                          : '') +
                                        (', Patient Name: ' +
                                          props.row.original.first_name +
                                          ' ' +
                                          props.row.original.last_name +
                                          props.row.original.name) +
                                        ', ' +
                                        transportStatus(
                                          props.row.original.status,
                                        ) +
                                        ' - ' +
                                        formatDateTime(
                                          props.row.original.completed_time,
                                        ) +
                                        (strictValidObjectWithKeys(
                                          props.row.original.contact_details,
                                        )
                                          ? ', Requested by: ' +
                                            props.row.original.contact_details
                                              .first_name +
                                            ' ' +
                                            props.row.original.contact_details
                                              .last_name +
                                            ', tel: ' +
                                            (strictValidString(
                                              props.row.original.contact_details
                                                .phone[0],
                                            )
                                              ? props.row.original
                                                  .contact_details.phone[0]
                                              : 'N/A') +
                                            ', Email: ' +
                                            (strictValidString(
                                              props.row.original.contact_details
                                                .email_id,
                                            )
                                              ? props.row.original
                                                  .contact_details.email_id
                                              : 'N/A')
                                          : '')
                                      }
                                    >
                                      <Typography height={55} variant="body2">
                                        Date{': '}
                                        {formatDateTime(
                                          props.row.original.pick_up_date_time,
                                        )}
                                        {strictValidString(
                                          props.row.original.pickup_location,
                                        ) &&
                                          ', PU Location: ' +
                                            props.row.original.pickup_location}
                                        , PU ZIP:{' '}
                                        {props.row.original.pu_zipcode}{' '}
                                        {strictValidObjectWithKeys(
                                          props.row.original
                                            .all_base_invoice_charges,
                                        ) &&
                                        strictValidObjectWithKeys(
                                          props.row.original
                                            .all_base_invoice_charges
                                            .invoice_details,
                                        ) &&
                                        strictValidObjectWithKeys(
                                          props.row.original
                                            .all_base_invoice_charges
                                            .invoice_details
                                            .out_of_service_area,
                                        )
                                          ? zoneFormat(
                                              props.row.original
                                                .all_base_invoice_charges
                                                .invoice_details
                                                .out_of_service_area
                                                .pickup_zone,
                                            )
                                          : ''}
                                        {strictValidString(
                                          props.row.original.dropoff_location,
                                        ) &&
                                          ',  DO Location: ' +
                                            props.row.original.dropoff_location}
                                        , DO ZIP:{' '}
                                        {props.row.original.do_zipcode}{' '}
                                        {strictValidObjectWithKeys(
                                          props.row.original
                                            .all_base_invoice_charges,
                                        ) &&
                                        strictValidObjectWithKeys(
                                          props.row.original
                                            .all_base_invoice_charges
                                            .invoice_details,
                                        ) &&
                                        strictValidObjectWithKeys(
                                          props.row.original
                                            .all_base_invoice_charges
                                            .invoice_details
                                            .out_of_service_area,
                                        )
                                          ? zoneFormat(
                                              props.row.original
                                                .all_base_invoice_charges
                                                .invoice_details
                                                .out_of_service_area
                                                .dropoff_zone,
                                            )
                                          : ''}
                                        , Patient Name:{' '}
                                        {props.row.original.first_name}{' '}
                                        {props.row.original.last_name}
                                        {props.row.original.name}
                                        {', '}
                                        {transportStatus(
                                          props.row.original.status,
                                        )}{' '}
                                        -{' '}
                                        {formatDateTime(
                                          props.row.original.completed_time,
                                        )}
                                        {strictValidObjectWithKeys(
                                          props.row.original.contact_details,
                                        ) &&
                                          ', Requested by: ' +
                                            props.row.original.contact_details
                                              .first_name +
                                            ' ' +
                                            props.row.original.contact_details
                                              .last_name +
                                            ', tel: ' +
                                            (strictValidString(
                                              props.row.original.contact_details
                                                .phone[0],
                                            )
                                              ? props.row.original
                                                  .contact_details.phone[0]
                                              : 'N/A') +
                                            ', Email: ' +
                                            (strictValidString(
                                              props.row.original.contact_details
                                                .email_id,
                                            )
                                              ? props.row.original
                                                  .contact_details.email_id
                                              : 'N/A')}
                                      </Typography>
                                    </MDTooltip>
                                  )}
                                </Stack>
                              )}
                            {!strictValidNumber(props.row.original.trip_id) && (
                              <Typography variant="body2">
                                {props.row.original.name}
                              </Typography>
                            )}
                            {props.row.original.correct_zone === 0 &&
                              props.row.original.description ===
                                'Out of service area fee Z1' && (
                                <Typography
                                  textAlign="center"
                                  fontSize={20}
                                  variant="body2"
                                  color={'error'}
                                >
                                  Error : Zone needs to be recalculated
                                </Typography>
                              )}
                          </>
                        ),
                      },
                      {
                        Header: 'Service Type',
                        accessor: 'description',
                        disableSortBy: true,
                        width: 60,
                        Cell: (props) => (
                          <Stack>
                            {props.row.original.name === 'BAR' ? (
                              <Typography variant="body2" color="error">
                                ERROR! - no Transport mode defined.
                              </Typography>
                            ) : (
                              <Typography
                                color={
                                  props.row.original.out_of_service === 1 ||
                                  (props.row.original.correct_zone === 0 &&
                                    props.row.original.description ===
                                      'Out of service area fee Z1')
                                    ? 'error'
                                    : false
                                }
                              >
                                {props.row.original.description}
                              </Typography>
                            )}
                          </Stack>
                        ),
                      },
                      {
                        Header: 'Price',
                        accessor: 'price',
                        disableSortBy: true,
                        rightAlign: true,
                        width: 30,
                        Cell: (props) => (
                          <Stack py={1}>
                            {props.row.original.is_parent ? (
                              <Typography variant="body2">
                                {strictValidString(props.row.original.price)
                                  ? defaultCurrencyFormat(
                                      props.row.original.price,
                                    )
                                  : ''}
                              </Typography>
                            ) : (
                              <Typography>
                                {defaultCurrencyFormat(
                                  props.row.original.price,
                                )}
                              </Typography>
                            )}
                          </Stack>
                        ),
                      },
                      {
                        Header: 'Actions',
                        accessor: '',
                        Filter: false,
                        disableSortBy: true,
                        width: 30,
                        Cell: (props) => (
                          <>
                            <EditableButton
                              editButtonShow={
                                strictValidString(
                                  props.row.original.service_name,
                                ) ||
                                (props.row.original.is_parent &&
                                  strictValidNumber(props.row.original.id))
                              }
                              addIconShow={
                                strictValidObjectWithKeys(
                                  props.row.original.base_invoice,
                                ) &&
                                strictValidNumber(
                                  props.row.original.base_invoice.id,
                                ) &&
                                !props.row.original.service_name
                              }
                              addIconClicked={() => {
                                const field = props.row.original;
                                setAddData({
                                  ...field,
                                  price: '',
                                });
                                addDialog();
                              }}
                              deleteButtonShow={
                                strictValidString(
                                  props.row.original.service_name,
                                ) ||
                                (props.row.original.is_parent &&
                                  strictValidNumber(props.row.original.id))
                              }
                              editButtonClicked={() => {
                                const field = props.row.original;
                                setCurrent(field);
                                toggle();
                              }}
                              hideDeleteButton={
                                buttonRoleAccess(
                                  'initializedValidateInvoice',
                                  strictValidObjectWithKeys(userValue) &&
                                    userValue.role_id,
                                ) ||
                                (strictValidObjectWithKeys(
                                  props.row.original,
                                ) &&
                                  props.row.original.description ===
                                    '3% Fuel Recovery Surcharge') ||
                                (strictValidObjectWithKeys(
                                  props.row.original,
                                ) &&
                                  props.row.original.description ===
                                    'Cancellation charge')
                              }
                              deleteButtonDisabled={
                                buttonRoleAccess(
                                  'initializedValidateInvoice',
                                  strictValidObjectWithKeys(userValue) &&
                                    userValue.role_id,
                                ) ||
                                (strictValidObjectWithKeys(
                                  props.row.original,
                                ) &&
                                  props.row.original.description ===
                                    '3% Fuel Recovery Surcharge') ||
                                (strictValidObjectWithKeys(
                                  props.row.original,
                                ) &&
                                  props.row.original.description ===
                                    'Cancellation charge')
                              }
                              editButtonDisabled={
                                buttonRoleAccess(
                                  'initializedValidateInvoice',
                                  strictValidObjectWithKeys(userValue) &&
                                    userValue.role_id,
                                ) ||
                                (props.row.original.is_parent &&
                                  strictValidNumber(props.row.original.id)) ||
                                (strictValidObjectWithKeys(
                                  props.row.original,
                                ) &&
                                  props.row.original.description ===
                                    '3% Fuel Recovery Surcharge')
                              }
                              deleteButtonClicked={() => {
                                const field = props.row.original;
                                setCurrent(field);
                                deleteToggle();
                              }}
                            />
                          </>
                        ),
                      },
                    ]}
                    rowData={viewData[0].base_trips}
                  />
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </Box>
      </Dialog>
      {renderDialog()}
      {renderAddDialog()}
      {deleteDialog()}
      {infoDialog()}
    </>
  );
};

BilledInvoiceInfo.propTypes = {
  callBilledInvoiceApi: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

BilledInvoiceInfo.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.billing.billedInvoice.message,
    isLoad: state.billing.tripDetails.isLoad,
    loadErr: state.billing.billedInvoice.loadErr,
    data: state.billing.billedInvoice.data,
    isLoadInner: state.billing.billedInvoice.isLoadInner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callBilledInvoiceApi: (...params) => dispatch(billedInvoice(...params)),
  callSocketBilledInvoiceApi: (...params) =>
    dispatch(socketBilledInvoice(...params)),
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
});

export default connect(mapStateProps, mapDispatchToProps)(BilledInvoiceInfo);

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Stack,
  Typography,
  Box,
  DialogContent,
  CircularProgress,
} from '@mui/material';
import { connect } from 'react-redux';
import Dialog from '../../../components/dialog';
import ReactTable from '../../../components/react-table';
import {
  defaultCurrencyFormat,
  defaultPropGetter,
  formatDate,
  formatDateTime,
  strictValidArrayWithLength,
  strictValidNumber,
  strictValidObjectWithKeys,
  strictValidString,
  zoneFormat,
} from '../../../utils/common-utils';
import { transportStatus } from '../../../utils/constant';
import EditTripInBilling from '../edit-trip';
import { tripIegId } from '../../trip-management/action';
import { buttonRoleAccess } from '../../../utils/traits';
import store from 'store2';
import EmptyContainerLoad from '../../../components/empty-container-load';
import { getTripDetails } from '../action';
import MDTooltip from '../../../components/tooltip';
import { trim } from 'lodash';

const InvoiceDetailModal = ({
  currentViewData = {},
  isViewToggle = () => {},
  isViewInvoice = false,
  isLoad,
  tripLoad,
  isLoadInner,
  callTripIegId,
  fetchTripData = false,
  callTripDetailsApi,
  callApiFunction = defaultPropGetter,
}) => {
  const [currentTrip, setCurrentTrip] = useState({});
  const [isInfoDialog, setIsInfoDialog] = useState(false);
  const userValue = store.get('user') || {};
  const [viewData, setViewData] = useState([]);

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
  const callApi = async () => {
    if (strictValidObjectWithKeys(currentViewData)) {
      const res = await callTripDetailsApi(currentViewData);
      if (res) {
        setViewData(res);
      }
    }
  };
  useEffect(async () => {
    if (strictValidObjectWithKeys(currentViewData)) {
      const res = await callTripDetailsApi(currentViewData);
      if (res) {
        setViewData(res);
      }
    }
  }, [currentViewData]);

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
          {tripLoad ? (
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
                        strictValidArrayWithLength(viewData)
                          ? viewData[0].name
                          : 'N/A',
                      )}
                      {strictValidArrayWithLength(viewData) &&
                      strictValidString(viewData[0].cost_center_name)
                        ? renderDetails(
                            'Cost Center Name',
                            strictValidArrayWithLength(viewData) &&
                              strictValidString(viewData[0].cost_center_name)
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
                          return (
                            strictValidObjectWithKeys(originalRow) &&
                            originalRow.leg_id
                          );
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
                        width: 30,
                      },
                      {
                        Header: 'Leg Information',
                        accessor: (originalRow, rowIndex) => {
                          return originalRow.is_parent
                            ? strictValidObjectWithKeys(originalRow) &&
                              !strictValidNumber(originalRow.trip_id)
                              ? originalRow.name
                              : originalRow.status === 'completed'
                              ? `Date : ${formatDateTime(
                                  originalRow.pick_up_date_time,
                                )}, PU : ${originalRow.pu_zipcode} ${
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
                                    : ''
                                }, DO : ${originalRow.do_zipcode} ${
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
                                    : ''
                                }, Patient Name : ${originalRow.first_name} ${
                                  originalRow.last_name
                                } ${' '} ${originalRow.name}`
                              : `${originalRow.status} : ${formatDateTime(
                                  originalRow.pick_up_date_time,
                                )}, PU :${originalRow.pu_zipcode} ${
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
                                    : ''
                                }, DO :${originalRow.do_zipcode} ${
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
                                    : ''
                                } ${transportStatus(
                                  originalRow.status,
                                )} -{' '}${formatDateTime(
                                  originalRow.completed_time,
                                )}`
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
                                          props.row.original
                                            .trip_pickup_location,
                                        )
                                          ? ', PU Location: ' +
                                            props.row.original
                                              .trip_pickup_location
                                          : '') +
                                        (', PU ZIP: ' +
                                          props.row.original.pu_zipcode) +
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
                                          props.row.original
                                            .trip_dropoff_location,
                                        )
                                          ? ', DO Location: ' +
                                            props.row.original
                                              .trip_dropoff_location
                                          : '') +
                                        (' , DO ZIP: ' +
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
                                        ', Patient Name: ' +
                                        props.row.original.first_name +
                                        ' ' +
                                        props.row.original.last_name +
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
                                          props.row.original
                                            .trip_pickup_location,
                                        ) &&
                                          ', PU Location: ' +
                                            props.row.original
                                              .trip_pickup_location}
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
                                          props.row.original
                                            .trip_dropoff_location,
                                        ) &&
                                          ',  DO Location: ' +
                                            props.row.original
                                              .trip_dropoff_location}
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
                                          props.row.original
                                            .trip_pickup_location,
                                        )
                                          ? ', PU Location: ' +
                                            props.row.original
                                              .trip_pickup_location
                                          : '') +
                                        (', PU ZIP: ' +
                                          props.row.original.pu_zipcode) +
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
                                          props.row.original
                                            .trip_dropoff_location,
                                        )
                                          ? ', DO Location: ' +
                                            props.row.original
                                              .trip_dropoff_location
                                          : '') +
                                        (' , DO ZIP: ' +
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
                                          props.row.original
                                            .trip_pickup_location,
                                        ) &&
                                          ', PU Location: ' +
                                            props.row.original
                                              .trip_pickup_location}
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
                                          props.row.original
                                            .trip_dropoff_location,
                                        ) &&
                                          ',  DO Location: ' +
                                            props.row.original
                                              .trip_dropoff_location}
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
                        width: 50,
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
      {infoDialog()}
    </>
  );
};

const mapStateProps = (state) => {
  return {
    message: state.billing.validateInvoice.message,
    isLoad: state.billing.validateInvoice.isLoad,
    isLoadInner: state.billing.validateInvoice.isLoadInner,
    tripLoad: state.billing.tripDetails.isLoad,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callTripIegId: (...params) => dispatch(tripIegId(...params)),
  callTripDetailsApi: (...params) => dispatch(getTripDetails(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(InvoiceDetailModal);

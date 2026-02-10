/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import {
  Grid,
  Stack,
  Box,
  Typography,
  Checkbox,
  Popper,
  Fade,
  Button,
} from '@mui/material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  checktheItemInArray,
  defaultCurrencyFormat,
  defaultPhoenixDateTime,
  formatDate,
  formatDateTime,
  strictValidArrayWithLength,
  strictValidNumber,
  strictValidObjectWithKeys,
  strictValidString,
  zoneFormat,
} from '../../../utils/common-utils';
import EmptyContainer from '../../../components/empty-container';
import ReactTable from '../../../components/react-table';
import { getFilterInvoice } from '../action';
import { DefaultDate, transportStatus } from '../../../utils/constant';
import { makeStyles } from '@mui/styles';
import MDTooltip from '../../../components/tooltip';
import { trim } from 'lodash';

const useStyles = makeStyles((theme) => ({
  popper: {
    width: '400px',
    height: '90px',
    padding: 5,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    borderRadius: theme.shape.borderRadius,
    position: 'relative',
    border: '1px solid #ccc',
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderBottom: '10px solid #ccc', // You can adjust the color
    top: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
}));

const CreatedInvoice = ({
  setValue,
  isLoad,
  isLoadInner,
  setInvoiceData,
  setCreatedInvoices,
  data,
}) => {
  const [checkboxWarning, setCheckboxWarning] = useState([]);

  const LegInfoComponent = ({ props }) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(props.row.original.is_valid_version);
    const anchorEl = useRef();
    return (
      <>
        <span ref={anchorEl}>
          {props.row.original.is_parent &&
            strictValidNumber(props.row.original.trip_id) && (
              <Stack
                mt={
                  strictValidObjectWithKeys(
                    props.row.original.base_trips.contact_details,
                  )
                    ? -0.5
                    : 0
                }
              >
                {props.row.original.base_trips.status === 'completed' ? (
                  <MDTooltip
                    title={
                      (formatDateTime(
                        props.row.original.base_trips.estimated_end_time,
                      ) === 'N/A'
                        ? 'Date: ' +
                          formatDate(
                            props.row.original.base_trips.pick_up_date_time,
                          )
                        : 'Date: ' +
                          formatDateTime(
                            props.row.original.base_trips.pick_up_date_time,
                          )) +
                      (strictValidString(
                        props.row.original.base_trips.trip_pickup_location,
                      ) &&
                        ', PU Location: ' +
                          props.row.original.base_trips.trip_pickup_location) +
                      ', PU ZIP:' +
                      props.row.original.base_trips.pu_zipcode +
                      ' ' +
                      zoneFormat(
                        props.row.original.base_trips.out_of_service_area
                          .pickup_zone,
                      ) +
                      (strictValidString(
                        props.row.original.base_trips.trip_dropoff_location,
                      ) &&
                        ',  DO Location: ' +
                          props.row.original.base_trips.trip_dropoff_location) +
                      ', DO ZIP: ' +
                      props.row.original.base_trips.do_zipcode +
                      ' ' +
                      zoneFormat(
                        props.row.original.base_trips.out_of_service_area
                          .dropoff_zone,
                      ) +
                      ', Patient Name: ' +
                      props.row.original.base_trips.first_name +
                      ' ' +
                      props.row.original.base_trips.last_name +
                      (strictValidObjectWithKeys(
                        props.row.original.base_trips.contact_details,
                      )
                        ? ', Requested by: ' +
                          props.row.original.base_trips.contact_details
                            .first_name +
                          ' ' +
                          props.row.original.base_trips.contact_details
                            .last_name +
                          ', tel: ' +
                          (strictValidString(
                            props.row.original.base_trips.contact_details
                              .phone_number[0],
                          )
                            ? props.row.original.base_trips.contact_details
                                .phone_number[0]
                            : 'N/A') +
                          ', Email: ' +
                          (strictValidString(
                            props.row.original.base_trips.contact_details
                              .email_id,
                          )
                            ? props.row.original.base_trips.contact_details
                                .email_id
                            : 'N/A')
                        : '')
                    }
                  >
                    <Typography height={55} variant="body2">
                      Date{': '}
                      {formatDateTime(
                        props.row.original.base_trips.estimated_end_time,
                      ) === 'N/A'
                        ? formatDate(
                            props.row.original.base_trips.pick_up_date_time,
                          )
                        : formatDateTime(
                            props.row.original.base_trips.pick_up_date_time,
                          )}
                      {strictValidString(
                        props.row.original.base_trips.trip_pickup_location,
                      ) &&
                        ', PU Location: ' +
                          props.row.original.base_trips.trip_pickup_location}
                      , PU ZIP: {props.row.original.base_trips.pu_zipcode}{' '}
                      {zoneFormat(
                        props.row.original.base_trips.out_of_service_area
                          .pickup_zone,
                      )}
                      {strictValidString(
                        props.row.original.base_trips.trip_dropoff_location,
                      ) &&
                        ',  DO Location: ' +
                          props.row.original.base_trips.trip_dropoff_location}
                      , DO ZIP: {props.row.original.base_trips.do_zipcode}{' '}
                      {zoneFormat(
                        props.row.original.base_trips.out_of_service_area
                          .dropoff_zone,
                      )}
                      , Patient Name: {props.row.original.base_trips.first_name}{' '}
                      {props.row.original.base_trips.last_name}
                      {strictValidObjectWithKeys(
                        props.row.original.base_trips.contact_details,
                      ) &&
                        ', Requested by: ' +
                          props.row.original.base_trips.contact_details
                            .first_name +
                          ' ' +
                          props.row.original.base_trips.contact_details
                            .last_name +
                          ', tel: ' +
                          (strictValidString(
                            props.row.original.base_trips.contact_details
                              .phone_number[0],
                          )
                            ? props.row.original.base_trips.contact_details
                                .phone_number[0]
                            : 'N/A') +
                          ', Email: ' +
                          (strictValidString(
                            props.row.original.base_trips.contact_details
                              .email_id,
                          )
                            ? props.row.original.base_trips.contact_details
                                .email_id
                            : 'N/A')}
                    </Typography>
                  </MDTooltip>
                ) : (
                  <MDTooltip
                    title={
                      (formatDateTime(
                        props.row.original.base_trips.estimated_end_time,
                      ) === 'N/A'
                        ? 'Date: ' +
                          formatDate(
                            props.row.original.base_trips.pick_up_date_time,
                          )
                        : 'Date: ' +
                          formatDateTime(
                            props.row.original.base_trips.pick_up_date_time,
                          )) +
                      (strictValidString(
                        props.row.original.base_trips.trip_pickup_location,
                      ) &&
                        ', PU Location: ' +
                          props.row.original.base_trips.trip_pickup_location) +
                      ', PU ZIP:' +
                      props.row.original.base_trips.pu_zipcode +
                      ' ' +
                      zoneFormat(
                        props.row.original.base_trips.out_of_service_area
                          .pickup_zone,
                      ) +
                      (strictValidString(
                        props.row.original.base_trips.trip_dropoff_location,
                      ) &&
                        ',  DO Location: ' +
                          props.row.original.base_trips.trip_dropoff_location) +
                      ', DO ZIP: ' +
                      props.row.original.base_trips.do_zipcode +
                      ' ' +
                      zoneFormat(
                        props.row.original.base_trips.out_of_service_area
                          .dropoff_zone,
                      ) +
                      ', Patient Name: ' +
                      props.row.original.base_trips.first_name +
                      ' ' +
                      props.row.original.base_trips.last_name +
                      ', ' +
                      (transportStatus(props.row.original.base_trips.status) +
                        ' - ' +
                        formatDateTime(
                          props.row.original.base_trips.completed_time,
                        )) +
                      (strictValidObjectWithKeys(
                        props.row.original.base_trips.contact_details,
                      )
                        ? ', Requested by: ' +
                          props.row.original.base_trips.contact_details
                            .first_name +
                          ' ' +
                          props.row.original.base_trips.contact_details
                            .last_name +
                          ', tel: ' +
                          (strictValidString(
                            props.row.original.base_trips.contact_details
                              .phone_number[0],
                          )
                            ? props.row.original.base_trips.contact_details
                                .phone_number[0]
                            : 'N/A') +
                          ', Email: ' +
                          (strictValidString(
                            props.row.original.base_trips.contact_details
                              .email_id,
                          )
                            ? props.row.original.base_trips.contact_details
                                .email_id
                            : 'N/A')
                        : '')
                    }
                  >
                    <Typography height={55} variant="body2">
                      Date{': '}
                      {formatDateTime(
                        props.row.original.base_trips.pick_up_date_time,
                      )}
                      {strictValidString(
                        props.row.original.base_trips.trip_pickup_location,
                      ) &&
                        ', PU Location: ' +
                          props.row.original.base_trips.trip_pickup_location}
                      , PU ZIP: {props.row.original.base_trips.pu_zipcode}{' '}
                      {zoneFormat(
                        props.row.original.base_trips.out_of_service_area
                          .pickup_zone,
                      )}
                      {strictValidString(
                        props.row.original.base_trips.trip_dropoff_location,
                      ) &&
                        ',  DO Location: ' +
                          props.row.original.base_trips.trip_dropoff_location}
                      , DO ZIP: {props.row.original.base_trips.do_zipcode}{' '}
                      {zoneFormat(
                        props.row.original.base_trips.out_of_service_area
                          .dropoff_zone,
                      )}
                      , Patient Name: {props.row.original.base_trips.first_name}{' '}
                      {props.row.original.base_trips.last_name}
                      {', '}
                      {transportStatus(
                        props.row.original.base_trips.status,
                      )} -{' '}
                      {formatDateTime(
                        props.row.original.base_trips.completed_time,
                      )}
                      {strictValidObjectWithKeys(
                        props.row.original.base_trips.contact_details,
                      ) &&
                        ', Requested by: ' +
                          props.row.original.base_trips.contact_details
                            .first_name +
                          ' ' +
                          props.row.original.base_trips.contact_details
                            .last_name +
                          ', tel: ' +
                          (strictValidString(
                            props.row.original.base_trips.contact_details
                              .phone_number[0],
                          )
                            ? props.row.original.base_trips.contact_details
                                .phone_number[0]
                            : 'N/A') +
                          ', Email: ' +
                          (strictValidString(
                            props.row.original.base_trips.contact_details
                              .email_id,
                          )
                            ? props.row.original.base_trips.contact_details
                                .email_id
                            : 'N/A')}
                    </Typography>
                  </MDTooltip>
                )}
              </Stack>
            )}
          {!strictValidNumber(props.row.original.trip_id) && (
            <Typography variant="body2">{props.row.original.name}</Typography>
          )}
          {props.row.original.base_trips.correct_zone === 0 &&
            props.row.original.description === 'Out of service area fee Z1' && (
              <Typography
                textAlign="center"
                variant="body2"
                fontSize={20}
                color={'error'}
              >
                Error : Zone needs to be recalculated
              </Typography>
            )}
        </span>
        {strictValidObjectWithKeys(props.row.original) &&
        !props.row.original.is_valid_version &&
        props.row.original.is_parent &&
        props.row.original.name === '' ? (
          <Popper open={!open} anchorEl={anchorEl.current} transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <div className={classes.popper}>
                  <div className={classes.arrow}></div>
                  {/* Add your content inside the Popper here */}
                  <Typography variant="inherit">
                    Trip {props.row.original.base_trips.leg_id}, trip version
                    mistmatch in invoice calculation (charge version{' '}
                    {props.row.original.billing_charge_version} / trip version{' '}
                    {props.row.original.trip_version})
                  </Typography>
                  <Box display={'flex'} mt={0.5} justifyContent={'center'}>
                    <Button
                      onClick={() => {
                        setOpen(true);
                      }}
                      variant="contained"
                      size="small"
                    >
                      ok
                    </Button>
                  </Box>
                </div>
              </Fade>
            )}
          </Popper>
        ) : (
          ''
        )}
      </>
    );
  };

  useEffect(() => {
    setCreatedInvoices(data);
  }, [data]);

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
  return (
    <>
      <Grid>
        {isLoad && (
          <ReactTable
            showExport
            sxTable={{
              overflowX: 'initial',
            }}
            height={{
              minHeight: 450,
              maxheight: 450,
              overfleow: 'scroll',
            }}
            sxEmptyStyle={{ height: 300 }}
            pagination={false}
            boxStyle={{
              overflow: 'scroll',
              maxHeight: 450,
              backgroundColor: '#fff',
            }}
            loading={true}
            columnDefs={[
              {
                Header: 'Leg ID',
                accessor: 'Leg ID',
              },
              {
                Header: 'Leg Information',
                accessor: 'Leg Information',
              },
              {
                Header: 'Service Type',
                accessor: 'Service Type',
              },
              {
                Header: 'Price',
                accessor: 'Price',
              },
              {
                Header: 'Action',
                accessor: '',
              },
            ]}
            rowData={[]}
          />
        )}
        {!isLoad && strictValidArrayWithLength(data) ? (
          data.map((arrData, index) => {
            return (
              <Box mt={2}>
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
                      strictValidArrayWithLength(arrData) &&
                        strictValidObjectWithKeys(arrData[0].base_trips)
                        ? arrData[0].base_trips.name
                        : 'N/A',
                    )}
                    {strictValidArrayWithLength(arrData) &&
                    strictValidObjectWithKeys(arrData[0].base_trips) &&
                    arrData[0].base_trips.cost_center_name !== ''
                      ? renderDetails(
                          'Cost Center Name',
                          strictValidArrayWithLength(arrData) &&
                            strictValidObjectWithKeys(arrData[0].base_trips)
                            ? arrData[0].base_trips.cost_center_name
                            : 'N/A',
                        )
                      : ''}
                    {strictValidArrayWithLength(arrData) &&
                    strictValidObjectWithKeys(arrData[0].base_trips) &&
                    strictValidString(trim(arrData[0].base_trips.po_number)) &&
                    arrData[0].base_trips.po_number !== 'N/A'
                      ? renderDetails(
                          'PO Number',
                          strictValidArrayWithLength(arrData) &&
                            strictValidObjectWithKeys(arrData[0].base_trips)
                            ? arrData[0].base_trips.po_number
                            : 'N/A',
                        )
                      : ''}
                    {strictValidArrayWithLength(arrData) &&
                    strictValidObjectWithKeys(arrData[0].base_trips) &&
                    strictValidString(
                      trim(arrData[0].base_trips.cost_center_po_number),
                    ) &&
                    arrData[0].base_trips.cost_center_po_number !== 'N/A'
                      ? renderDetails(
                          'Cost Center PO Number',
                          strictValidArrayWithLength(arrData) &&
                            strictValidObjectWithKeys(arrData[0].base_trips)
                            ? arrData[0].base_trips.cost_center_po_number
                            : 'N/A',
                        )
                      : ''}

                    {renderDetails(
                      'Billing Address',
                      strictValidArrayWithLength(arrData) &&
                        strictValidObjectWithKeys(arrData[0].base_trips)
                        ? arrData[0].base_trips.billing_address
                        : 'N/A',
                    )}
                    {renderDetails(
                      'Invoice',
                      strictValidArrayWithLength(arrData) &&
                        strictValidObjectWithKeys(arrData[0].base_trips)
                        ? arrData[0].invoice_id
                        : 'N/A',
                    )}
                    {renderDetails(
                      'Date',
                      strictValidArrayWithLength(arrData) &&
                        strictValidObjectWithKeys(arrData[0])
                        ? defaultPhoenixDateTime(new Date(), 'MM/DD/YY HHmm')
                        : 'N/A',
                    )}
                    {renderDetails(
                      'Period',
                      strictValidArrayWithLength(arrData) &&
                        strictValidObjectWithKeys(arrData[0])
                        ? formatDateTime(arrData[0].period_min, DefaultDate) +
                            ' - ' +
                            formatDateTime(arrData[0].period_max, DefaultDate)
                        : 'N/A',
                    )}
                    {renderDetails(
                      'Legs count',
                      strictValidArrayWithLength(arrData) &&
                        arrData[0].base_trips.legs_count,
                    )}
                  </Box>
                  <Stack direction="row">
                    {data.length !== 1 && (
                      <Box>
                        <Checkbox
                          checked={
                            checktheItemInArray(
                              checkboxWarning,
                              arrData[0].invoice_id,
                            )
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCheckboxWarning([
                                ...checkboxWarning,
                                arrData[0].invoice_id,
                              ]);
                              setInvoiceData([
                                ...checkboxWarning,
                                arrData[0].invoice_id,
                              ]);
                            } else {
                              setCheckboxWarning(
                                checkboxWarning.filter(
                                  (people) => people !== arrData[0].invoice_id,
                                ),
                              );
                              setInvoiceData(
                                checkboxWarning.filter(
                                  (people) => people !== arrData[0].invoice_id,
                                ),
                              );
                            }
                            // setOpen(!open);e
                          }}
                        />
                        Exclude Invoice
                      </Box>
                    )}
                  </Stack>
                </Box>
                <ReactTable
                  sxTable={{
                    overflowX: 'initial',
                  }}
                  tableSize={true}
                  customHeight={true}
                  showExport
                  headerFilter={false}
                  excelName={`${
                    strictValidArrayWithLength(arrData) &&
                    strictValidObjectWithKeys(arrData[0].base_trips)
                      ? arrData[0].base_trips.name
                      : 'N/A'
                  } Created Invoices`}
                  clearFilters={false}
                  height={{
                    minHeight: 450,
                    maxheight: 450,
                    overfleow: 'scroll',
                  }}
                  sxEmptyStyle={{ height: 300 }}
                  pagination={false}
                  boxStyle={{
                    overflow: 'scroll',
                    maxHeight: 450,
                    backgroundColor: '#fff',
                  }}
                  loading={isLoad}
                  isLoadInner={isLoadInner}
                  customText={'You do not have any billed Invoices'}
                  columnDefs={[
                    {
                      Header: 'Leg ID',
                      disableSortBy: true,
                      accessor: (originalRow, rowIndex) => {
                        return strictValidObjectWithKeys(originalRow) &&
                          originalRow.is_parent &&
                          strictValidObjectWithKeys(originalRow.base_trips)
                          ? originalRow.base_trips.leg_id
                          : '';
                      },
                      Cell: (props) => (
                        <Stack py={1}>
                          {props.row.original.is_parent ? (
                            <Typography variant="body2">
                              {props.row.original.base_trips.leg_id}
                            </Typography>
                          ) : (
                            ''
                          )}
                        </Stack>
                      ),
                      width: 50,
                    },
                    {
                      Header: 'Leg Information',
                      accessor: (originalRow, rowIndex) => {
                        return originalRow.is_parent ||
                          (originalRow.base_trips.correct_zone === 0 &&
                            originalRow.description ===
                              'Out of service area fee Z1')
                          ? strictValidObjectWithKeys(originalRow) &&
                            strictValidObjectWithKeys(originalRow.base_trips) &&
                            !strictValidNumber(originalRow.trip_id)
                            ? originalRow.name
                            : originalRow.base_trips.correct_zone === 0 &&
                              originalRow.description ===
                                'Out of service area fee Z1'
                            ? 'Error : Zone needs to be recalculated'
                            : originalRow.base_trips.status === 'completed'
                            ? `Date: ${
                                formatDateTime(
                                  originalRow.base_trips.estimated_end_time,
                                ) === 'N/A'
                                  ? formatDate(
                                      originalRow.base_trips.pick_up_date_time,
                                    )
                                  : formatDateTime(
                                      originalRow.base_trips.pick_up_date_time,
                                    )
                              }${
                                strictValidString(
                                  originalRow.base_trips.trip_pickup_location,
                                )
                                  ? ', PU Location: ' +
                                    originalRow.base_trips.trip_pickup_location
                                  : ''
                              }, PU ZIP: ${
                                originalRow.base_trips.pu_zipcode
                              } ${zoneFormat(
                                originalRow.base_trips.out_of_service_area
                                  .pickup_zone,
                              )}${
                                strictValidString(
                                  originalRow.base_trips.trip_dropoff_location,
                                )
                                  ? ', DO Location: ' +
                                    originalRow.base_trips.trip_dropoff_location
                                  : ''
                              }, DO ZIP: ${
                                originalRow.base_trips.do_zipcode
                              } ${zoneFormat(
                                originalRow.base_trips.out_of_service_area
                                  .dropoff_zone,
                              )}, Patient Name: ${
                                originalRow.base_trips.first_name
                              } ${originalRow.base_trips.last_name}${
                                originalRow.name
                              }${
                                strictValidObjectWithKeys(
                                  originalRow.base_trips.contact_details,
                                )
                                  ? ', \nRequested by: ' +
                                    originalRow.base_trips.contact_details
                                      .first_name +
                                    ' ' +
                                    originalRow.base_trips.contact_details
                                      .last_name +
                                    ', tel: ' +
                                    (strictValidString(
                                      originalRow.base_trips.contact_details
                                        .phone_number[0],
                                    )
                                      ? originalRow.base_trips.contact_details
                                          .phone_number[0]
                                      : 'N/A') +
                                    ', Email: ' +
                                    (strictValidString(
                                      originalRow.base_trips.contact_details
                                        .email_id,
                                    )
                                      ? originalRow.base_trips.contact_details
                                          .email_id
                                      : 'N/A')
                                  : ''
                              }
                              `
                            : `Date: ${formatDateTime(
                                originalRow.base_trips.pick_up_date_time,
                              )}${
                                strictValidString(
                                  originalRow.base_trips.trip_pickup_location,
                                )
                                  ? ', PU Location: ' +
                                    originalRow.base_trips.trip_pickup_location
                                  : ''
                              }, PU ZIP: ${
                                originalRow.base_trips.pu_zipcode
                              } ${zoneFormat(
                                originalRow.base_trips.out_of_service_area
                                  .pickup_zone,
                              )}${
                                strictValidString(
                                  originalRow.base_trips.trip_dropoff_location,
                                )
                                  ? ', DO Location: ' +
                                    originalRow.base_trips.trip_dropoff_location
                                  : ''
                              }, DO ZIP: ${
                                originalRow.base_trips.do_zipcode
                              } ${zoneFormat(
                                originalRow.base_trips.out_of_service_area
                                  .dropoff_zone,
                              )}, Patient Name: ${
                                originalRow.base_trips.first_name
                              } ${
                                originalRow.base_trips.last_name
                              }, ${transportStatus(
                                originalRow.base_trips.status,
                              )} - ${formatDateTime(
                                originalRow.base_trips.completed_time,
                              )}${
                                strictValidObjectWithKeys(
                                  originalRow.base_trips.contact_details,
                                )
                                  ? ', \nRequested by: ' +
                                    originalRow.base_trips.contact_details
                                      .first_name +
                                    ' ' +
                                    originalRow.base_trips.contact_details
                                      .last_name +
                                    ', tel: ' +
                                    (strictValidString(
                                      originalRow.base_trips.contact_details
                                        .phone_number[0],
                                    )
                                      ? originalRow.base_trips.contact_details
                                          .phone_number[0]
                                      : 'N/A') +
                                    ', Email: ' +
                                    (strictValidString(
                                      originalRow.base_trips.contact_details
                                        .email_id,
                                    )
                                      ? originalRow.base_trips.contact_details
                                          .email_id
                                      : 'N/A')
                                  : ''
                              }`
                          : '';
                      },
                      disableSortBy: true,
                      width: 280,
                      Cell: (props) => <LegInfoComponent props={props} />,
                    },
                    {
                      Header: 'Service Type',
                      accessor: 'description',
                      disableSortBy: true,
                      width: 70,
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
                                (props.row.original.base_trips.correct_zone ===
                                  0 &&
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
                      disableSortBy: true,
                      rightAlign: true,
                      accessor: (originalRow, rowIndex) => {
                        return defaultCurrencyFormat(originalRow.price);
                      },
                      width: 40,
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
                              {defaultCurrencyFormat(props.row.original.price)}
                            </Typography>
                          )}
                        </Stack>
                      ),
                    },
                  ]}
                  rowData={Array.isArray(arrData) ? arrData : []}
                />
              </Box>
            );
          })
        ) : (
          <EmptyContainer text="You do not have any billed Invoices" />
        )}
      </Grid>
    </>
  );
};

CreatedInvoice.propTypes = {
  callFilterApi: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

CreatedInvoice.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.billing.filterInvoice.message,
    isLoad: state.billing.filterInvoice.isLoad,
    loadErr: state.billing.filterInvoice.loadErr,
    data: state.billing.filterInvoice.data,
    corporateAccountFromState: state.trip.allTrips.all_corporates,
    isLoadInner: state.billing.filterInvoice.isLoadInner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callFilterApi: (...params) => dispatch(getFilterInvoice(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(CreatedInvoice);

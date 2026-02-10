import { Box, Typography, Stack } from '@mui/material';
import React from 'react';
import {
  defaultCurrencyFormat,
  formatDateTime,
  strictValidArrayWithLength,
  strictValidNumber,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/common-utils';
import MDTooltip from '../../../components/tooltip';
import { DefaultDate } from '../../../utils/constant';
import ReactTable from '../../../components/react-table';
import { connect } from 'react-redux';

const BillingInfo = ({
  data,
  message,
  isLoad,
  loadErr,
  auditLoad,
  auditData,
  isLoadInner,
  invoiceAuditData,
}) => {
  // data;

  const renderColor = (obj, index) => {
    if (strictValidString(obj.invoice_id) && index === 0) {
      return obj.invoice_id;
    }
    if (strictValidString(obj.issue_date) && index === 1) {
      return obj.issue_date;
    }
    if (strictValidString(obj.due_date) && index === 2) {
      return obj.due_date;
    }
    if (strictValidString(obj.account_name) && index === 3) {
      return obj.account_name;
    }
    if (strictValidString(obj.type) && index === 10) {
      return obj.type;
    }
    if (strictValidString(obj.billing_address) && index === 4) {
      return obj.billing_address;
    }
    if (strictValidString(obj.legs_count) && index === 5) {
      return obj.legs_count;
    }
    if (strictValidString(obj.amount) && index === 6) {
      return obj.amount;
    }
    if (strictValidString(obj.amount_paid) && index === 7) {
      return obj.amount_paid;
    }
    if (strictValidString(obj.amount_due) && index === 8) {
      return obj.amount_due;
    }
    if (strictValidString(obj.notes) && index === 9) {
      return obj.notes;
    } else {
      return null;
    }
  };
  const statusNames = (key) => {
    switch (key) {
      case 'send_invoiced':
        return 'Sent';
      case 'locked':
        return 'Locked';
      case 'validated':
        return 'Validated';
      case 'disputed':
        return 'Disputed';
      case 'dispute_accepted':
        return 'Dispute Accepted';
      case 'part_paid':
        return 'Part Paid';
      case 'fully_paid':
        return 'Fully Paid';
      case 'refunded':
        return 'Refunded';
      case 'cancelled':
        return 'Cancelled';
      case 'uninvoiced':
        return 'Uninvoiced';
      case 'sent':
        return 'Sent';
      case 'initialized':
        return 'Initialized';
      default:
        return key;
    }
  };
  return (
    <Box>
      <Typography variant="h1">Billing Info</Typography>
      <ReactTable
        customHeight={true}
        height={{ minHeight: 87, maxHeight: 100 }}
        globalFilterShow={false}
        headerFilter={false}
        customText={'You do not have any configured Bills'}
        pagination={false}
        columnDefs={[
          {
            Header: 'Invoice Id',
            accessor: 'invoice_id',
            width: 75,
            Cell: (props) => (
              <Stack py={1}>
                <Typography>{props.row.original.invoice_id}</Typography>
              </Stack>
            ),
          },
          {
            Header: 'Issue Date',
            // Filter: DateFilter,
            accessor: (originalRow, rowIndex) => {
              return strictValidString(originalRow.created_at)
                ? formatDateTime(
                    originalRow.created_at.replace('T', ' ').replace('Z', ' '),
                  )
                : formatDateTime(new Date());
            },
            width: 100,
            Cell: (props) => (
              <>
                <Stack>
                  <Typography>
                    {/* {formatDateTime(
                      props.row.original.created_at
                        .replace('T', ' ')
                        .replace('Z', ' '),
                    )} */}
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
            width: 80,
            // Filter: DateFilter,
            accessor: (originalRow, rowIndex) => {
              return strictValidString(originalRow.created_at)
                ? formatDateTime(
                    originalRow.created_at.replace('T', ' ').replace('Z', ' '),
                    DefaultDate,
                  )
                : formatDateTime(new Date(), DefaultDate);
            },
            Cell: (props) => (
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
            ),
          },
          {
            Header: 'Account',
            width: 180,
            // Filter: SelectColumnFilter,
            Cell: (props) => (
              <Stack>
                <Typography>
                  {strictValidObjectWithKeys(
                    props.row.original.corporate_account,
                  ) && props.row.original.corporate_account.name}
                  {strictValidObjectWithKeys(data) &&
                    strictValidString(data.cost_center_name) &&
                    ` - ${data.cost_center_name}`}
                </Typography>
              </Stack>
            ),
          },
          {
            Header: 'Billing Address',
            width: 180,
            accessor: (originalRow, rowIndex) => {
              return (
                strictValidObjectWithKeys(originalRow) &&
                strictValidObjectWithKeys(originalRow) &&
                originalRow.billing_address
              );
            },
            Cell: (props) => (
              <>
                {strictValidObjectWithKeys(
                  props.row.original.corporate_account,
                ) &&
                strictValidString(
                  props.row.original.corporate_account.billing_address,
                ) ? (
                  <MDTooltip
                    title={props.row.original.corporate_account.billing_address}
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
            Header: 'Legs Count',
            width: 90,
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
            width: 90,
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
            width: 90,
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
            width: 120,
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
            width: 250,
            accessor: 'notes',
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
            Header: 'Invoice Status',
            width: 225,
            accessor: (originalRow, rowIndex) => {
              return strictValidArrayWithLength(invoiceAuditData) &&
                strictValidObjectWithKeys(invoiceAuditData[0]) &&
                strictValidNumber(invoiceAuditData[0].type)
                ? statusNames(invoiceAuditData[0].type)
                : 'N/A';
            },
            Cell: (props) => (
              <>
                <MDTooltip
                  title={
                    strictValidArrayWithLength(invoiceAuditData) &&
                    strictValidObjectWithKeys(invoiceAuditData[0]) &&
                    strictValidString(invoiceAuditData[0].type)
                      ? statusNames(invoiceAuditData[0].type)
                      : 'N/A'
                  }
                >
                  <Typography height={55}>
                    {strictValidArrayWithLength(invoiceAuditData) &&
                    strictValidObjectWithKeys(invoiceAuditData[0]) &&
                    strictValidString(invoiceAuditData[0].type)
                      ? statusNames(invoiceAuditData[0].type)
                      : 'N/A'}
                  </Typography>
                </MDTooltip>
              </>
            ),
          },
          {
            Header: 'Ver',
            accessor: (originalRow, rowIndex) => {
              return strictValidArrayWithLength(invoiceAuditData) &&
                strictValidObjectWithKeys(invoiceAuditData[0]) &&
                strictValidNumber(invoiceAuditData[0].data_version)
                ? invoiceAuditData[0].data_version
                : 'N/A';
            },
            width: 35,
            Cell: (props) => (
              <Typography height={55}>
                {strictValidArrayWithLength(invoiceAuditData) &&
                strictValidObjectWithKeys(invoiceAuditData[0]) &&
                strictValidNumber(invoiceAuditData[0].data_version)
                  ? invoiceAuditData[0].data_version
                  : 'N/A'}
              </Typography>
            ),
          },
        ]}
        rowData={[data]}
      />
      <Typography mt={3} variant="h1">
        Audit Log
      </Typography>
      <ReactTable
        // customHeight={true}
        // height={{ minHeight: 1000, maxHeight: 1000 }}
        globalFilterShow={false}
        headerFilter={false}
        loading={auditLoad}
        customText={'You do not have any Audit Logs'}
        isLoadInner={isLoadInner}
        // pagination={false}
        getCellProperties={(cellInfo, index) => ({
          style: {
            backgroundColor:
              strictValidObjectWithKeys(cellInfo.row.original) &&
              strictValidObjectWithKeys(cellInfo.row.original.color_object) &&
              renderColor(cellInfo.row.original.color_object, index),
          },
        })}
        columnDefs={[
          {
            Header: 'Invoice Id',
            accessor: 'invoice_id',
            width: 80,
            Cell: (props) => (
              <Stack py={1}>
                <Typography>{'0' + props.row.original.invoice_id}</Typography>
              </Stack>
            ),
          },
          {
            Header: 'Issue Date',
            // Filter: DateFilter,
            accessor: (originalRow, rowIndex) => {
              return strictValidObjectWithKeys(originalRow) &&
                strictValidString(originalRow.issue_date)
                ? formatDateTime(
                    originalRow.issue_date.replace('T', ' ').replace('Z', ' '),
                  )
                : strictValidObjectWithKeys(data) &&
                  strictValidString(data.created_at)
                ? formatDateTime(
                    data.created_at.replace('T', ' ').replace('Z', ' '),
                  )
                : 'N/A';
            },
            width: 110,
            Cell: (props) => (
              <>
                <Stack>
                  <Typography>
                    {strictValidString(props.row.original.issue_date)
                      ? formatDateTime(
                          props.row.original.issue_date
                            .replace('T', ' ')
                            .replace('Z', ' '),
                        )
                      : strictValidObjectWithKeys(data) &&
                        strictValidString(data.created_at)
                      ? formatDateTime(
                          data.created_at.replace('T', ' ').replace('Z', ' '),
                        )
                      : 'N/A'}
                  </Typography>
                </Stack>
              </>
            ),
          },
          {
            Header: 'Due Date',
            width: 90,
            // Filter: DateFilter,
            accessor: (originalRow, rowIndex) => {
              return strictValidObjectWithKeys(originalRow) &&
                strictValidString(originalRow.due_date) &&
                formatDateTime(originalRow.due_date, DefaultDate) !== 'N/A'
                ? formatDateTime(originalRow.due_date, DefaultDate)
                : strictValidObjectWithKeys(data) &&
                  strictValidString(data.created_at)
                ? formatDateTime(
                    data.created_at.replace('T', ' ').replace('Z', ' '),
                    DefaultDate,
                  )
                : 'N/A';
            },
            Cell: (props) => (
              <Stack>
                <Typography>
                  {strictValidString(props.row.original.due_date) &&
                  formatDateTime(props.row.original.due_date, DefaultDate) !==
                    'N/A'
                    ? formatDateTime(props.row.original.due_date, DefaultDate)
                    : strictValidObjectWithKeys(data) &&
                      strictValidString(data.created_at)
                    ? formatDateTime(
                        data.created_at.replace('T', ' ').replace('Z', ' '),
                        DefaultDate,
                      )
                    : 'N/A'}
                </Typography>
              </Stack>
            ),
          },
          {
            Header: 'Account',
            // Filter: SelectColumnFilter,
            Cell: (props) => (
              <Stack>
                <Typography>{props.row.original.account_name}</Typography>
              </Stack>
            ),
          },
          {
            Header: 'Billing Address',
            accessor: (originalRow, rowIndex) => {
              return (
                strictValidObjectWithKeys(originalRow) &&
                strictValidObjectWithKeys(originalRow) &&
                originalRow.billing_address
              );
            },
            Cell: (props) => (
              <>
                {strictValidString(props.row.original.billing_address) ? (
                  <MDTooltip title={props.row.original.billing_address}>
                    <Typography height={55}>
                      {props.row.original.billing_address}
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
          // {
          //   Header: 'Period',
          //   width: 140,
          //   accessor: (originalRow, rowIndex) => {
          //     return (
          //       strictValidObjectWithKeys(originalRow) &&
          //       formatDateTime(originalRow.issue_date, DefaultDate) +
          //         ' - ' +
          //         formatDateTime(originalRow.due_date, DefaultDate)
          //     );
          //   },
          //   Cell: (props) => (
          //     <Stack>
          //       {strictValidString(props.row.original.due_date) ? (
          //         <Typography>
          //           {formatDateTime(
          //             props.row.original.issue_date,
          //             DefaultDate,
          //           ) +
          //             ' - ' +
          //             formatDateTime(props.row.original.due_date, DefaultDate)}
          //         </Typography>
          //       ) : (
          //         <Typography>N/A</Typography>
          //       )}
          //     </Stack>
          //   ),
          // },
          {
            Header: 'Legs Count',
            width: 100,
            accessor: (originalRow, rowIndex) => {
              return (
                strictValidObjectWithKeys(originalRow) &&
                strictValidObjectWithKeys(originalRow) &&
                originalRow.legs_count
              );
            },
            Cell: (props) => (
              <Stack>
                {strictValidNumber(props.row.original.legs_count) ? (
                  <Typography>{props.row.original.legs_count}</Typography>
                ) : props.row.original.legs_count === null ? (
                  <Typography>0</Typography>
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
            width: 100,
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
            width: 100,
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
            accessor: (originalRow, rowIndex) => {
              return (
                strictValidObjectWithKeys(originalRow) && originalRow.notes
              );
            },
            width: 190,
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
            Header: 'Invoice Status',
            accessor: (originalRow, rowIndex) => {
              return strictValidObjectWithKeys(originalRow) && originalRow.type;
            },
            width: 80,
            Cell: (props) => (
              <>
                {strictValidString(props.row.original.type) ? (
                  <MDTooltip title={statusNames(props.row.original.type)}>
                    <Typography height={55}>
                      {statusNames(props.row.original.type)}
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
            Header: 'Time Stamp',
            // Filter: DateFilter,
            accessor: (originalRow, rowIndex) => {
              return (
                strictValidObjectWithKeys(originalRow) &&
                formatDateTime(
                  originalRow.createdAt.replace('T', ' ').replace('Z', ' '),
                )
              );
            },
            width: 80,
            Cell: (props) => (
              <>
                <Stack>
                  <Typography>
                    {formatDateTime(
                      props.row.original.createdAt
                        .replace('T', ' ')
                        .replace('Z', ' '),
                    )}
                  </Typography>
                </Stack>
              </>
            ),
          },
          {
            Header: 'Transition Info',
            // Filter: DateFilter,
            accessor: (originalRow, rowIndex) => {
              return (
                strictValidObjectWithKeys(originalRow) &&
                strictValidString(originalRow.tansition_info)
              );
            },
            width: 180,
            Cell: (props) => (
              <>
                <Stack>
                  {strictValidString(props.row.original.tansition_info) && (
                    <MDTooltip title={props.row.original.tansition_info}>
                      <Typography>
                        {props.row.original.tansition_info}
                      </Typography>
                    </MDTooltip>
                  )}
                </Stack>
              </>
            ),
          },
          {
            Header: 'Ver',
            accessor: (originalRow, rowIndex) => {
              return strictValidObjectWithKeys(originalRow) &&
                strictValidNumber(originalRow.data_version)
                ? originalRow.data_version
                : 'N/A';
            },
            width: 40,
            Cell: (props) => (
              <Typography height={55}>
                {strictValidNumber(props.row.original.data_version)
                  ? props.row.original.data_version
                  : 'N/A'}
              </Typography>
            ),
          },
        ]}
        rowData={invoiceAuditData}
      />
    </Box>
  );
};
const mapStateProps = (state) => {
  return {
    message: state.payments.audit.message,
    isLoad: state.payments.audit.isLoad,
    loadErr: state.payments.audit.loadErr,
    auditData: state.payments.audit.data,
    isLoadInner: state.payments.audit.isLoadInner,
    invoiceAuditData: state.billing.invoiceAudit.invoice_audit,
    auditLoad: state.billing.invoiceAudit.isLoad,
  };
};

export default connect(mapStateProps, null)(BillingInfo);

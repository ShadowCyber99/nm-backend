import { Box, Typography } from '@mui/material';
import React from 'react';
import {
  defaultCurrencyFormat,
  formatDate,
  formatDateTime,
  strictValidArrayWithLength,
  strictValidNumber,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/common-utils';
import MDTooltip from '../../../components/tooltip';
import {
  renderPaymentStatus,
  renderPaymentType,
} from '../../../utils/constant';
import ReactTable from '../../../components/react-table';
import { connect } from 'react-redux';

const PaymentInfo = ({
  data,
  message,
  isLoad,
  loadErr,
  auditData,
  isLoadInner,
}) => {
  const renderColor = (obj, index) => {
    if (strictValidString(obj.account_id) && index === 0) {
      return obj.account_id;
    }
    if (strictValidString(obj.payment_type) && index === 1) {
      return obj.payment_type;
    }
    if (strictValidString(obj.reference_number) && index === 2) {
      return obj.reference_number;
    }
    if (strictValidString(obj.customer_reference_number) && index === 3) {
      return obj.customer_reference_number;
    }
    if (strictValidString(obj.payment_date) && index === 4) {
      return obj.payment_date;
    }
    if (strictValidString(obj.amount) && index === 5) {
      return obj.amount;
    }
    if (strictValidString(obj.balance) && index === 6) {
      return obj.balance;
    }
    if (strictValidString(obj.invoice_ref) && index === 7) {
      return obj.invoice_ref;
    }
    if (strictValidString(obj.type) && index === 8) {
      return obj.type;
    }
    if (strictValidString(obj.notes) && index === 9) {
      return obj.notes;
    } else {
      return null;
    }
  };
  return (
    <Box>
      <Typography variant="h1">Payment Info</Typography>
      <ReactTable
        customHeight={true}
        height={{ minHeight: 87, maxHeight: 100 }}
        globalFilterShow={false}
        headerFilter={false}
        customText={'You do not have any configured Payments'}
        pagination={false}
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
            width: 70,
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
            width: 70,
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
            width: 100,
          },
          {
            Header: 'Payment Date',
            accessor: (originalRow, rowIndex) => {
              return (
                strictValidObjectWithKeys(originalRow) &&
                formatDate(originalRow.date)
              );
            },
            width: 95,
            Cell: (props) => (
              <>
                <Typography>
                  {formatDate(props.row.original.date)}
                </Typography>
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
            width: 70,
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
            Cell: (props) => (
              <MDTooltip
                isMultiple
                title={
                  strictValidArrayWithLength(props.row.original.all_invoice) &&
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
            width: 200,
          },

          {
            Header: 'Status',
            accessor: (originalRow, rowIndex) => {
              return (
                strictValidObjectWithKeys(originalRow) &&
                renderPaymentStatus(originalRow.type)
              );
            },
            width: 80,
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
            width: 658,
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
        loading={isLoad}
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
            Header: 'Account',
            accessor: (originalRow, rowIndex) => {
              return (
                strictValidObjectWithKeys(originalRow) &&
                strictValidObjectWithKeys(originalRow.corporate_account) &&
                originalRow.corporate_account.name
              );
            },
            width: 160,
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
            width: 70,
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
            width: 70,
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
            width: 100,
          },
          {
            Header: 'Payment Date',
            accessor: (originalRow, rowIndex) => {
              return (
                strictValidObjectWithKeys(originalRow) &&
                formatDate(originalRow.payment_date)
              );
            },
            width: 95,
            Cell: (props) => (
              <>
                <Typography>
                  {formatDate(props.row.original.payment_date)}
                </Typography>
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
            width: 70,
            rightAlign: true,
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
                strictValidArrayWithLength(originalRow.invoice_ref)
                ? originalRow.invoice_ref.map((a) => {
                    return a;
                  })
                : 'N/A';
            },
            disableSortBy: true,
            Cell: (props) => (
              <MDTooltip
                isMultiple
                title={
                  strictValidArrayWithLength(props.row.original.invoice_ref) &&
                  props.row.original.invoice_ref.map((a, index) => {
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
                  {strictValidArrayWithLength(props.row.original.invoice_ref)
                    ? props.row.original.invoice_ref.map((a, index) => {
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
            width: 200,
          },

          {
            Header: 'Status',
            accessor: (originalRow, rowIndex) => {
              return (
                strictValidObjectWithKeys(originalRow) &&
                renderPaymentStatus(originalRow.type)
              );
            },
            width: 80,
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
            width: 290,
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
            Header: 'Time Stamp',
            accessor: (originalRow, rowIndex) => {
              return strictValidObjectWithKeys(originalRow) &&
                strictValidString(originalRow.createdAt)
                ? originalRow.createdAt
                : 'N/A';
            },
            width: 90,
            Cell: (props) => (
              <Typography height={55}>
                {strictValidString(props.row.original.createdAt)
                  ? formatDateTime(props.row.original.createdAt)
                  : 'N/A'}
              </Typography>
            ),
          },
          {
            Header: 'Transition Info',
            accessor: (originalRow, rowIndex) => {
              return strictValidObjectWithKeys(originalRow) &&
                strictValidString(originalRow.tansition_info)
                ? originalRow.tansition_info
                : 'N/A';
            },
            width: 280,
            Cell: (props) => (
              <Typography height={55}>
                {strictValidString(props.row.original.tansition_info)
                  ? props.row.original.tansition_info
                  : 'N/A'}
              </Typography>
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
        rowData={auditData}
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
  };
};

export default connect(mapStateProps, null)(PaymentInfo);

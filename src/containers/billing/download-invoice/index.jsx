/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  formatDateTime,
  strictValidObjectWithKeys,
} from '../../../utils/common-utils';
import ReactTable from '../../../components/react-table';
import { getDownloadedInvocing, getPdfFromTrip } from '../action';
import DownloadIcon from '@mui/icons-material/Download';
const apiHost = process.env.REACT_APP_BASE_URL;

const DownloadedInvoice = ({
  setValue,
  isLoad,
  isLoadInner,
  message,
  setData,
  data,
  callDownloadedInvoicingApi,
  callgetPdfFromTripApi,
}) => {
  useEffect(() => {
    callDownloadedInvoicingApi();
  }, []);

  const downloadFile = (val) => {
    window.open(val, '_blank');
  };

  const downloadPdf = async (val) => {
    let response = await callgetPdfFromTripApi({ trip_id: val.trip_id });
    if (response) {
      downloadFile(`${apiHost}${response}`);
    }
  };

  return (
    <>
      <Grid>
        <ReactTable
          loading={isLoad}
          isLoadInner={isLoadInner}
          customText={'You do not have any Finalized Invoices'}
          columnDefs={[
            {
              Header: 'Leg ID',
              accessor: 'leg_id',
              width: 50,
              Cell: (props) => (
                <Stack py={1}>
                  <Typography>{props.row.original.leg_id}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Information',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) && originalRow.name
                );
              },
              width: 200,
              Cell: (props) => (
                <Stack py={1}>
                  {props.row.original.status === 'completed' ? (
                    <Typography>
                      Date {': '}
                      {formatDateTime(props.row.original.pick_up_date_time)}, PU
                      {': '}
                      {props.row.original.billing_postal_code}, PD
                      {': '}
                      {props.row.original.billing_postal_code}, Patient Name
                      {': '}
                      {props.row.original.first_name}
                      {props.row.original.last_name}
                    </Typography>
                  ) : (
                    <Typography>
                      {props.row.original.status}{' '}
                      {formatDateTime(props.row.original.pick_up_date_time)}, PU{' '}
                      {props.row.original.billing_postal_code}, PD{' '}
                      {props.row.original.billing_postal_code}
                    </Typography>
                  )}
                </Stack>
              ),
            },
            {
              Header: 'Price',
              accessor: 'price',
              width: 40,
              Cell: (props) => (
                <Stack py={1}>
                  <Typography>{props.row.original.price} USD</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Download Invoice',
              accessor: 'download',
              width: 40,
              minWidth: 40,
              Filter: false,
              Cell: (props) => (
                <Stack py={0.5}>
                  <Button
                    startIcon={<DownloadIcon />}
                    variant="contained"
                    onClick={() => downloadPdf(props.row.original)}
                  >
                    Download
                  </Button>
                </Stack>
              ),
            },
          ]}
          rowData={data}
        />
      </Grid>
    </>
  );
};

DownloadedInvoice.propTypes = {
  callFilterApi: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

DownloadedInvoice.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.billing.downloadedInvoice.message,
    isLoad: state.billing.downloadedInvoice.isLoad,
    loadErr: state.billing.downloadedInvoice.loadErr,
    data: state.billing.downloadedInvoice.data,
    isLoadInner: state.billing.downloadedInvoice.isLoadInner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callDownloadedInvoicingApi: (...params) =>
    dispatch(getDownloadedInvocing(...params)),
  callgetPdfFromTripApi: (...params) => dispatch(getPdfFromTrip(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(DownloadedInvoice);

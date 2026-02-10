/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Button, Checkbox, Grid } from '@mui/material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactTable from '../../../components/react-table';
const PreviewInvoice = () => {
  return (
    <>
      <Grid>
        <ReactTable
          // loading={isLoad}
          // isLoadInner={isLoadInner}
          customText={'You do not have any configured Trips'}
          height={{ minHeight: 750, maxHeight: 750 }}
          pagination={false}
          columnDefs={[
            {
              Header: 'Entity',
              accessor: 'entity',
            },
            {
              Header: 'Customer',
              accessor: 'customer',
              width: 100,
              disableSortBy: true,
            },
            {
              Header: '# of Segments',
              accessor: 'number_of_segments',
            },
            {
              Header: 'Segment Total',
              accessor: 'total_segments',
              disableSortBy: true,
            },
            {
              Header: 'Segment Balance',
              accessor: 'segment_balance',
              disableSortBy: true,
            },
            {
              Header: 'Segment Payments',
              accessor: 'segment_payment',
              width: 150,
              disableSortBy: true,
            },
            {
              Header: 'Invoice Date',
              accessor: 'invoice_date',
              width: 150,
              disableSortBy: true,
            },
            {
              Header: 'Exclude',
              accessor: 'trip_id',
              width: 140,
              Filter: false,
              Cell: (props) => (
                <>
                  <Checkbox
                    onChange={(e) => {}}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </>
              ),
            },
          ]}
          rowData={[
            {
              entity: 'Reno',
              customer: '10350',
              number_of_segments: '15',
              total_segments: '1500',
              segment_balance: '2070',
              segment_payment: '0.00',
              invoice_date: '05/10/2022',
            },
          ]}
        />
        <Grid
          container
          spacing={{
            xs: 2,
            md: 4,
          }}
          columns={{
            xs: 4,
            sm: 4,
            md: 12,
          }}
        >
          <Grid sx={{ ml: 1 }} item xs={4} sm={6} md={8}>
            <Button
              // disabled={pristine || submitting || !valid}
              // disabled={!strictValidArrayWithLength(merge_transports)}
              // onClick={handleSubmit}
              type="submit"
              variant="outlined"
              size="large"
              color="error"
              // startIcon={<CheckIcon />}
              sx={{
                mt: 2,
                mb: 2,
                mr: 2,
              }}
            >
              {'Cancel'}
            </Button>
            <Button
              // onClick={() => setValue(1)}
              type="submit"
              size="large"
              variant="contained"
              sx={{
                mt: 2,
                mb: 2,
                mr: 2,
              }}
            >
              Next
            </Button>
            <Button
              // onClick={() => setValue(1)}
              type="submit"
              size="large"
              variant="contained"
              sx={{
                mt: 2,
                mb: 2,
                mr: 2,
              }}
            >
              Process Invoice
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

PreviewInvoice.propTypes = {
  callAllTrip: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

PreviewInvoice.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.trip.message,
    isLoad: state.trip.isLoad,
    loadErr: state.trip.loadErr,
    all_trips: state.trip.completed,
    isLoadInner: state.trip.isLoadInner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  // callAllTrip: (...params) => dispatch(getCompletedTrip(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(PreviewInvoice);

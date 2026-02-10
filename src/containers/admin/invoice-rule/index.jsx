/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, Grid, Button, Stack, Typography, Chip } from '@mui/material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  defaultCurrencyFormat,
  formatDate,
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/common-utils';
import { Field, Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import createDecorator from 'final-form-focus';
import MDSelect from '../../../components/mdselect';
import { getCorporateAccountSu, getInvoiceCharges } from '../action';
import { map } from 'lodash';
import ReactTable from '../../../components/react-table';
const focusOnErrors = createDecorator();

const InvoiceRule = ({
  callCorporateAccountApi,
  corporateAccountFromState,
  callInvoicePriceApi,
}) => {
  const [corporate_account, setCorporateAccountApi] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [filteredList, setFilteredList] = useState();
  const [heading, setHeading] = useState();

  useEffect(() => {
    callCorporateAccountApi();
  }, []);

  useEffect(() => {
    const corporateAccountArray = [];
    if (strictValidArrayWithLength(corporateAccountFromState)) {
      corporateAccountFromState.map((a) => {
        corporateAccountArray.push({
          value: a.account_id,
          title: a.name,
        });
      });
    }
    setCorporateAccountApi(corporateAccountArray);
  }, [corporateAccountFromState]);

  useEffect(() => {
    if (strictValidArrayWithLength(priceList)) {
      const arr = [];
      const arr2 = [];
      priceList.map((a) => {
        if (
          strictValidString(a.service_name) &&
          a.service_name !== 'account_id' &&
          a.service_name !== 'id' &&
          a.service_name !== 'Version' &&
          a.service_name !== 'Start Date' &&
          a.service_name !== 'End Date' &&
          a.service_name !== 'Cancellation Fee'
        ) {
          arr.push({
            service_name: a.service_name,
            service_charge: a.service_charge,
          });
          return a.service_name;
        } else {
          a.service_name !== 'account_id' &&
            a.service_name !== 'id' &&
            a.service_name !== 'Cancellation Fee' &&
            a.service_name !== 'Start Date' &&
            a.service_name !== 'End Date' &&
            arr2.push({
              service_name: a.service_name,
              service_charge: a.service_charge,
            });
          return a.service_name;
        }
      });
      setFilteredList(arr);
      setHeading(arr2);
    }
  }, [priceList]);

  const onSubmit = async (val) => {
    const data = {
      ...val,
      page: 'invoice',
    };

    const res = await callInvoicePriceApi(data);
    if (res) {
      setPriceList(res);
    }
  };

  return (
    <div>
      <Stack mt={1} spacing={2}>
        <Form
          onSubmit={onSubmit}
          decorators={[focusOnErrors]}
          mutators={{
            // potentially other mutators could be merged here
            ...arrayMutators,
          }}
          keepDirtyOnReinitialize
          validate={(values) => {
            const errors = {};
            if (!values.account_id) {
              errors.account_id = '';
            }
            return errors;
          }}
          initialValues={{
            account_id: null,
          }}
          render={({ handleSubmit, pristine, submitting, valid, form }) => {
            return (
              <Grid container>
                <Grid xs={3} sm={1} md={3}>
                  <Field id="trip_add_account" name="account_id">
                    {({ meta, input }) => (
                      <>
                        <MDSelect
                          onChange={(e) => {
                            input.onChange(e.target.value);
                            form.batch(() => {
                              form.change('account_id', e.target.value);
                              setPriceList([]);
                              setFilteredList([]);
                              setHeading([]);
                            });
                          }}
                          required
                          value={input.value}
                          id="trip_add_account"
                          disabled={false}
                          data={corporate_account}
                          errorText={meta.touched && meta.error}
                          placeholder="Account"
                          onBlur={(e) => {
                            input.onBlur(e.target.value);
                          }}
                        />
                      </>
                    )}
                  </Field>
                </Grid>
                <Box>
                  <Button
                    onClick={handleSubmit}
                    type="submit"
                    size="large"
                    variant="contained"
                    sx={{
                      mt: 2,
                      ml: 4,
                      height: 50,
                    }}
                  >
                    search
                  </Button>
                  <Button
                    onClick={() => {
                      form.batch(() => {
                        form.change('account_id', '');
                      });
                      setPriceList([]);
                      setFilteredList([]);
                      setHeading([]);
                    }}
                    type="submit"
                    id="trip_add_btn_cancel_trip"
                    size="large"
                    variant="contained"
                    sx={{
                      mt: 2,
                      ml: 2,
                      height: 50,
                    }}
                  >
                    Clear filter
                  </Button>
                </Box>
              </Grid>
            );
          }}
        />
      </Stack>
      {strictValidArrayWithLength(heading) && (
        <Box my={2}>
          {map(heading, (i) => (
            <Chip
              sx={{
                p: 2,
                mr: 0.5,
                height: '40px',
                fontWeight: '600',
                fontSize: '18px',
              }}
              size="large"
              label={`${i.service_name}: ${
                i.service_name === 'Start Date' || i.service_name === 'End Date'
                  ? formatDate(i.service_charge)
                  : i.service_charge === null
                  ? 'N/A'
                  : i.service_charge
              }`}
            />
          ))}
        </Box>
      )}
      {strictValidArrayWithLength(filteredList) ? (
        <>
          <Grid item sx={{width: '40%'}} xs={5} md={5}>
            <ReactTable
              globalFilterShow={false}
              customHeight={true}
              headerFilter={false}
              tableSize={true}
              height={{ maxHeight: '78vh', minHeight: '78vh' }}
              loading={false}
              pagination={false}
              fontSizeLg={true}
              customText="No Feedbacks Found"
              columnDefs={[
                {
                  Header: 'Service Name',
                  accessor: 'service_name',
                  width: 120,
                  disableSortBy: true,
                  Cell: (props) => (
                    <Stack>
                      <Typography sx={{ fontSize: 17 }}>
                        {props.row.original.service_name}
                      </Typography>
                    </Stack>
                  ),
                },
                {
                  Header: 'Price',
                  accessor: (originalRow, rowIndex) => {
                    return (
                      strictValidObjectWithKeys(originalRow) &&
                      originalRow.event
                    );
                  },
                  width: 60,
                  disableSortBy: true,
                  Cell: (props) => (
                    <Stack>
                      <Typography sx={{ fontSize: 17 }}>
                        {defaultCurrencyFormat(
                          props.row.original.service_charge,
                        )}
                      </Typography>
                    </Stack>
                  ),
                },
              ]}
              rowData={filteredList}
            />
          </Grid>
        </>
      ) : (
        <>
          <Box
            sx={{
              height: '80vh',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <Typography sx={{ fontSize: 17, fontWeight: 500 }}>
              Select Account To Load Charges
            </Typography>
          </Box>
        </>
      )}
    </div>
  );
};

InvoiceRule.propTypes = {
  callAllTransportApi: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

InvoiceRule.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    corporateAccountFromState: state.admin.all_corporates,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callInvoicePriceApi: (...params) => dispatch(getInvoiceCharges(...params)),
  callCorporateAccountApi: (...params) =>
    dispatch(getCorporateAccountSu(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(InvoiceRule);

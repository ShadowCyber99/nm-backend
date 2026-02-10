/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  formatDate,
  formatDateTime,
  strictValidArrayWithLength,
  strictValidNumber,
  strictValidObjectWithKeys,
  strictValidString,
  validObjectWithParameterKeys,
} from '../../../utils/common-utils';
import ReactTable from '../../../components/react-table';
import {
  getAllInvoicing,
  getCorporateAccounts,
  getExcelFromAccount,
} from '../action';
import CellMapTypes from '../../../components/react-table/components/renderMapTypes';
import {
  SelectColumnFilter,
  DateFilter,
  PhoneFilters,
} from '../../../components/react-table/helper';
import DownloadIcon from '@mui/icons-material/Download';
import { makeStyles } from '@mui/styles';
import _ from 'lodash';
import { transportStatus } from '../../../utils/constant';

import MDTooltip from '../../../components/tooltip';
import MdDatePicker from '../../../components/mdDatePicker';
const apiHost = process.env.REACT_APP_BASE_URL;
const useStyles = makeStyles(() => ({
  input: {
    width: '10%',
    backgroundColor: '#FAFAFA',
    fontSize: 14,
  },
  button: {
    width: '10%',
  },
}));

const BillingList = ({
  setValue,
  isLoad,
  isLoadInner,
  message,
  setData,
  total_invoice,
  callInvoicingApi,
  callCorporateAccountBilling,
  callExcelFromAccountApi,
  data,
  corporateAccountFromState,
}) => {
  const classes = useStyles();
  const [total, changeTotal] = useState(total_invoice);
  const [search, setSearch] = useState('');
  const [state, setState] = useState({
    account_id: '',
    start_date: null,
    end_date: null,
    sub_account_id: '',
    choose_account: '',
    selected: false,
  });
  const [mul_trip_id, setMulTripId] = useState([]);
  const [pagination, changePagination] = useState({
    total: 0,
    recordsPerPage: null,
    pageIndex: 0,
    currentPage: 1,
  });
  const { account_id, sub_account_id, start_date, end_date, choose_account } =
    state;
  const [corporate_account, setCorporateAccountApi] = useState([]);

  useEffect(() => {
    callCorporateAccountBilling();
  }, []);

  useEffect(() => {
    if (pagination.recordsPerPage) {
      callInvoicingApi({
        ...state,
        limit: pagination.recordsPerPage,
        skip: pagination.pageIndex * pagination.recordsPerPage,
        search: search,
      });
    }
  }, []);

  useEffect(() => {
    changeTotal(total_invoice);
  }, [total_invoice]);

  const setRecordsPerPage = (size) => {
    changePagination({
      ...pagination,
      recordsPerPage: size,
    });
    callInvoicingApi({
      ...state,
      limit: size,
      skip: pagination.pageIndex * size,
      search: search,
    });
  };

  useEffect(() => {
    filterValues();
  }, [state]);

  const changePageSize = (pageSize) => {
    changePagination({
      ...pagination,
      recordsPerPage: pageSize,
      pageIndex: 0,
    });
    callInvoicingApi({
      ...state,
      limit: pageSize,
      skip: 0,
      search: search,
    });
  };

  const changePageIndex = (pageIndex) => {
    changePagination({
      ...pagination,
      pageIndex: pageIndex,
    });
    callInvoicingApi({
      ...state,
      limit: pagination.recordsPerPage,
      skip: pageIndex * pagination.recordsPerPage,
      search: search,
    });
  };
  useEffect(() => {
    const corporateAccountArray = [];
    if (strictValidArrayWithLength(corporateAccountFromState)) {
      corporateAccountFromState.map((a) => {
        return corporateAccountArray.push({
          value: a.account_id,
          title: a.name,
          sub_account_id: a.sub_account_id,
        });
      });
    }
    setCorporateAccountApi(corporateAccountArray);
  }, [corporateAccountFromState]);

  const downloadFile = (val) => {
    window.open(val);
  };

  const setMulTripIdFun = (val, checkbox) => {
    const value = val;
    // Check if the val is checked or unchecked
    if (checkbox) {
      // Add the value to the array if it's not already present
      if (!mul_trip_id.includes(value)) {
        mul_trip_id.push(value);
      }
    } else {
      // Remove the value from the array if it exists
      const index = mul_trip_id.indexOf(value);
      if (index !== -1) {
        mul_trip_id.splice(index, 1);
      }
    }
    setMulTripId(mul_trip_id);
  };

  const downloadExcelFile = async (
    account_id,
    sub_account_id,
    start_date,
    end_date,
    search,
  ) => {
    let response = await callExcelFromAccountApi({
      account_id: account_id,
      sub_account_id: sub_account_id,
      start_date: start_date,
      end_date: end_date,
      trip_id: mul_trip_id,
      search: search,
      account_field: 'true',
    });
    if (response) {
      downloadFile(`${apiHost}${response}`);
    }
  };

  const AccountFilters = () => {
    // Render a multi-select box
    return (
      <FormControl className={classes.input} size="small" variant="outlined">
        <InputLabel id="demo-simple-select-helper-label">
          Select Corporate Account
        </InputLabel>
        <Select
          defaultValue=""
          labelId="demo-simple-select-helper-label"
          id="select_corporate_account"
          value={choose_account}
          label="Select Corporate Account"
          onChange={(e) => {
            const string = e.target.value;
            const values =
              string === 'all'
                ? 'all'
                : strictValidString(string) && string.split(',');
            const secondValue =
              string === 'all'
                ? ''
                : strictValidArrayWithLength(values) && values[1].trim();
            setState((prevState) => ({
              ...prevState,
              choose_account: e.target.value,
              sub_account_id:
                typeof e.target.value === 'string' ? secondValue : '',
              account_id:
                typeof e.target.value === 'string' && e.target.value !== 'all'
                  ? null
                  : string,
              selected: e.target.value ? true : false,
            }));
          }}
        >
          <MenuItem value={'all'}>All</MenuItem>
          {strictValidArrayWithLength(corporate_account) &&
            corporate_account.map((option, i) => (
              <MenuItem
                sx={{ textTransform: 'capitalize' }}
                key={i}
                value={
                  option.sub_account_id
                    ? `${option.value},${option.sub_account_id}`
                    : option.value
                }
              >
                {option.title}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    );
  };

  const DateFilterStartDate = (updateVal, value, label) => {
    const handleChange = (newValue) => {
      if (newValue === null) {
        setState((prevState) => ({
          ...prevState,
          [updateVal]: null,
        }));
      } else {
        const d = formatDate(newValue);
        setState((prevState) => ({
          ...prevState,
          [updateVal]: d,
        }));
      }
    };
    return (
      <MdDatePicker
        name={value}
        id="unit_add_start_time"
        value={value}
        placeholder={label}
        type="onlydate-small"
        onAccept={handleChange}
        onChange={(w) => handleChange(w)}
        compareTime={false}
        onSave={(e) => {}}
        maxDate={strictValidString(end_date) ? new Date(end_date) : null}
        closeOnSelect
      />
    );
  };
  const DateFilterEndDate = (updateVal, value, label) => {
    const handleChange = (newValue) => {
      if (newValue === null) {
        setState((prevState) => ({
          ...prevState,
          [updateVal]: null,
        }));
      } else {
        const d = formatDate(newValue);
        setState((prevState) => ({
          ...prevState,
          [updateVal]: d,
        }));
      }
    };
    return (
      <MdDatePicker
        name={value}
        id="unit_add_start_time"
        value={value}
        placeholder={label}
        type="onlydate-small"
        onAccept={handleChange}
        onChange={(w) => handleChange(w)}
        compareTime={false}
        minDate={strictValidString(start_date) ? new Date(start_date) : null}
        onSave={(e) => {}}
        closeOnSelect
      />
    );
  };

  const searchQueryFilter = (e) => {
    callInvoicingApi({
      ...state,
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
    callInvoicingApi({
      ...state,
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

  const filterValues = async () => {
    if (pagination.recordsPerPage) {
      const data = {
        ...state,
        limit: pagination.recordsPerPage,
        skip: 0,
        search: search,
      };
      changePagination({
        ...pagination,
        pageIndex: 0,
      });
      const res = await callInvoicingApi(data);
      if (res) {
        // setData(state);
      }
    }
  };
  const checkValidStringInObject = (transport_data) => {
    if (strictValidString(transport_data.start_date)) {
      return false;
    } else if (strictValidString(transport_data.end_date)) {
      return false;
    } else if (strictValidNumber(transport_data.account_id)) {
      return false;
    } else if (strictValidString(transport_data.choose_account)) {
      return false;
    } else if (strictValidString(transport_data.sub_account_id)) {
      return false;
    } else if (transport_data.zero_bal) {
      return false;
    } else {
      return true;
    }
  };
  return (
    <>
      <Grid>
        <Stack mt={2} direction="row" spacing={2}>
          {AccountFilters()}
          {DateFilterStartDate('start_date', start_date, 'Start Date')}
          {DateFilterEndDate('end_date', end_date, 'End Date')}
          <Button
            variant="contained"
            disabled={
              strictValidObjectWithKeys(state) &&
              checkValidStringInObject(state)
            }
            onClick={() => {
              setState({
                start_date: null,
                end_date: null,
                account_id: '',
                choose_account: '',
                sub_account_id: '',
              });
            }}
          >
            Clear Filters
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            variant="contained"
            onClick={() =>
              downloadExcelFile(
                account_id,
                sub_account_id,
                start_date,
                end_date,
                search,
              )
            }
          >
            Download Report
          </Button>
        </Stack>
        <ReactTable
          loading={isLoad}
          isLoadInner={isLoadInner}
          DateFilterCss={true}
          customText={'You do not have any configured Invoicing'}
          serverSideFilter={(e) => searchQueryFilter(e)}
          serverSidePagination={true}
          clearFilterButton={() => {
            clearQueryFilter('');
          }}
          headerFilter={false}
          recordsPerPage={pagination.recordsPerPage}
          setRecordsPerPage={setRecordsPerPage}
          pageNumber={pagination.pageIndex}
          total={total}
          changePageSize={changePageSize}
          changePageIndex={changePageIndex}
          columnDefs={[
            {
              Header: 'Pick-up Time',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  formatDateTime(originalRow.pick_up_date_time)
                );
              },
              Filter: DateFilter,
              width: 140,
              Cell: (props) => (
                <>
                  <Typography>
                    {formatDateTime(props.row.original.estimated_end_time) ===
                      'N/A' && props.row.original.status === 'completed'
                      ? props.row.original.type === 'will_call'
                        ? 'N/A'
                        : formatDate(props.row.original.pick_up_date_time)
                      : props.row.original.type === 'will_call'
                      ? 'N/A'
                      : formatDateTime(props.row.original.pick_up_date_time)}
                    {/* {formatDateTime(props.row.original.pick_up_date_time)} */}
                  </Typography>
                </>
              ),
            },
            {
              Header: 'ETA Drop-off',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  formatDateTime(originalRow.estimated_end_time)
                );
              },
              Filter: DateFilter,
              width: 140,
              Cell: (props) => (
                <>
                  <Typography>
                    {formatDateTime(props.row.original.estimated_end_time)}
                  </Typography>
                </>
              ),
            },
            {
              Header: 'Leg ID',
              accessor: 'leg_id',
              width: 120,
            },
            {
              Header: 'Status',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  transportStatus(originalRow.status)
                );
              },
              Filter: SelectColumnFilter,
              width: 140,
              Cell: (props) => (
                <>
                  <Typography>
                    {transportStatus(props.row.original.status)}
                  </Typography>
                </>
              ),
            },
            {
              Header: 'Pick-up Location',
              accessor: 'trip_pickup_location',
              disableSortBy: true,
            },
            {
              Header: 'Drop-off Location',
              accessor: 'trip_dropoff_location',
              disableSortBy: true,
            },
            {
              Header: 'Patient',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  strictValidObjectWithKeys(originalRow.base_patient) &&
                  originalRow.base_patient.last_name +
                    ', ' +
                    originalRow.base_patient.first_name
                );
              },
              width: 140,
              Cell: (props) => (
                <>
                  <Typography>
                    {props.row.original.base_patient.last_name +
                      ', ' +
                      props.row.original.base_patient.first_name}
                  </Typography>
                </>
              ),
            },
            {
              Header: 'Account',
              accessor: (originalRow, rowIndex) => {
                return strictValidObjectWithKeys(originalRow) &&
                  validObjectWithParameterKeys(originalRow, [
                    'cost_center_name',
                  ])
                  ? strictValidObjectWithKeys(originalRow.corporate_account) &&
                      `${originalRow.corporate_account.name} - ${originalRow.cost_center_name}`
                  : strictValidObjectWithKeys(originalRow.corporate_account) &&
                      originalRow.corporate_account.name;
              },
              Filter: SelectColumnFilter,
              Cell: (props) => {
                const accountName = validObjectWithParameterKeys(
                  props.row.original,
                  ['cost_center_name'],
                )
                  ? `${props.row.original.corporate_account.name} - ${props.row.original.cost_center_name}`
                  : props.row.original.corporate_account.name;
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
              Header: 'Account Contact',
              accessor: (originalRow, rowIndex) => {
                let output = [];
                _.map(originalRow.company_contact, (res) => {
                  output.push(`${res.last_name}, ${res.first_name}`);
                });
                return output.join(', ');
              },
              id: 'name',
              width: 140,
              disableSortBy: true,
              Cell: (props) => (
                <>
                  <CellMapTypes
                    type="company_contact"
                    renderValue="first_name"
                    data={props.row.original.company_contact}
                  />
                </>
              ),
            },
            {
              Header: 'C. Phone Number',
              accessor: (originalRow, rowIndex) => {
                let output = [];
                _.map(originalRow.company_contact, (res) => {
                  output.push(res.phone_number);
                });
                return output.join(', ');
              },
              width: 180,
              disableSortBy: true,
              Filter: PhoneFilters,
              id: 'company_phone',
              Cell: (props) => (
                <>
                  <CellMapTypes
                    type="corporate_contact_phone"
                    renderValue="phone_number"
                    renderType="phone"
                    data={props.row.original.company_contact}
                  />
                </>
              ),
            },
            {
              Header: 'Actions',
              accessor: 'trip_id',
              width: 140,
              Filter: false,
              Cell: (props) => (
                <>
                  <Checkbox
                    onChange={(e) => {
                      setMulTripIdFun(
                        props.row.original.trip_id,
                        e.target.checked,
                      );
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </>
              ),
            },
          ]}
          rowData={Array.isArray(data) ? data : []}
        />
      </Grid>
    </>
  );
};

BillingList.propTypes = {
  callInvoicingApi: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

BillingList.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.billing.invoice.message,
    isLoad: state.billing.invoice.isLoad,
    loadErr: state.billing.invoice.loadErr,
    data: state.billing.invoice.data,
    total_invoice: state.billing.invoice.total,
    corporateAccountFromState: state.billing.invoice.all_corporates_billing,
    isLoadInner: state.billing.invoice.isLoadInner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callInvoicingApi: (...params) => dispatch(getAllInvoicing(...params)),
  callCorporateAccountBilling: (...params) =>
    dispatch(getCorporateAccounts(...params)),
  callExcelFromAccountApi: (...params) =>
    dispatch(getExcelFromAccount(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(BillingList);

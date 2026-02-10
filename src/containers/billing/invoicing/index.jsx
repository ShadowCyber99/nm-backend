/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Checkbox,
  Collapse,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
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
  deleteInvoice,
  getAllInvoicing,
  getCorporateAccounts,
} from '../action';
import CellMapTypes from '../../../components/react-table/components/renderMapTypes';
import {
  SelectColumnFilter,
  DateFilter,
  PhoneFilters,
} from '../../../components/react-table/helper';
import { formatPhoneNumber } from '../../../utils/regexs';
import { LoadingButton } from '@mui/lab';
// import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { makeStyles } from '@mui/styles';
import _ from 'lodash';
import ErrorIcon from '@mui/icons-material/Error';
import { transportStatus } from '../../../utils/constant';
import SearchIcon from '@mui/icons-material/Search';
import { billingExportConstants } from '../constants';
import MDTooltip from '../../../components/tooltip';
import MdDatePicker from '../../../components/mdDatePicker';
const useStyles = makeStyles(() => ({
  input: {
    width: '10%',
    backgroundColor: '#FAFAFA',
    fontSize: 14,
  },
  errorText: {
    fontWeight: 500,
    fontSize: 18,
    color: '#fff',
  },
}));

const InvoicingList = ({
  isLoad,
  isLoadInner,
  message,
  setData,
  setTripData,
  callInvoicingApi,
  callCorporateAccountBilling,
  data,
  total_invoice,
  corporateAccountFromState,
  callDeleteInvoiceApi,
  errorMessage,
  setWarning,
}) => {
  const classes = useStyles();
  const [total, changeTotal] = useState(total_invoice);
  const [search, setSearch] = useState('');
  const [state, setState] = useState({
    start_date: null,
    end_date: null,
    account_id: '',
    zero_bal: false,
    sub_account_id: '',
    choose_account: '',
    selected: false,
  });
  const [pagination, changePagination] = useState({
    total: 0,
    recordsPerPage: null,
    pageIndex: 0,
    currentPage: 1,
  });
  const { start_date, end_date, zero_bal, choose_account } = state;
  const [corporate_account, setCorporateAccountApi] = useState([]);
  const [trip_id, setTripId] = useState('');
  const [open, setOpen] = useState(false);
  const [checkboxWarning, setCheckboxWarning] = useState(false);

  useEffect(() => {
    callCorporateAccountBilling();
  }, []);

  useEffect(() => {
    if (strictValidString(errorMessage)) {
      setOpen(true);
      setWarning(true);
    } else {
      setOpen(false);
      setWarning(false);
    }
  }, [errorMessage]);

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

    const maxDate = new Date(state?.end_date);
    maxDate.setDate(maxDate.getDate() - 30);
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
        minDate={
          state.account_id === 'all' && strictValidString(state.end_date)
            ? maxDate
            : null
        }
        maxDate={
          state.account_id === 'all' && strictValidString(state.end_date)
            ? new Date(state?.end_date)
            : state.account_id !== 'all' && strictValidString(state.end_date)
            ? new Date(state?.end_date)
            : null
        }
        closeOnSelect
        required={
          state.account_id === 'all' &&
          (state.start_date === null ||
            state.start_date === '' ||
            state.start_date === undefined)
            ? true
            : false
        }
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
    const maxDate = new Date(state?.start_date);
    maxDate.setDate(maxDate.getDate() + 30);
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
        minDate={
          state.account_id === 'all' && strictValidString(state.start_date)
            ? new Date(state?.start_date)
            : state.account_id !== 'all' && strictValidString(state.start_date)
            ? new Date(state?.start_date)
            : null
        }
        maxDate={
          state.account_id === 'all' && strictValidString(state.start_date)
            ? maxDate
            : null
        }
        closeOnSelect
        required={
          state.account_id === 'all' &&
          (state.end_date === null ||
            state.end_date === '' ||
            state.end_date === undefined)
            ? true
            : false
        }
      />
    );
  };

  const AccountFilters = () => {
    // Render a multi-select box
    return (
      <FormControl
        required
        className={classes.input}
        size="small"
        variant="outlined"
        error={!state.selected}
      >
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
            if (
              (!strictValidString(start_date) ||
                !strictValidString(end_date)) &&
              string !== 'all'
            ) {
              setState({
                ...state,
                start_date: null,
                end_date: null,
              });
            }
            const values =
              string === 'all'
                ? 'all'
                : strictValidString(string) && string.split(',');
            const secondValue =
              string === 'all'
                ? ''
                : strictValidArrayWithLength(values) && values[1].trim();
            setCheckboxWarning(false);
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
  const filterValues = async () => {
    if (pagination.recordsPerPage) {
      const data = {
        ...state,
        trip_id: trip_id,
        limit: pagination.recordsPerPage,
        skip: 0,
        search: search,
      };
      changePagination({
        ...pagination,
        pageIndex: 0,
      });
      const res = await callInvoicingApi(data);
      if (
        strictValidObjectWithKeys(res) &&
        strictValidArrayWithLength(res.data)
      ) {
        setData(data);
      } else {
        setData({});
        setCheckboxWarning(false);
      }
    }
  };

  const checkValidStringInObject = (transport_data) => {
    if (strictValidString(transport_data.start_date)) {
      return false;
    } else if (strictValidString(transport_data.end_date)) {
      return false;
    } else if (strictValidString(transport_data.sub_account_id)) {
      return false;
    } else if (strictValidNumber(transport_data.account_id)) {
      return false;
    } else if (transport_data.account_id === 'all') {
      return false;
    } else if (
      transport_data.account_id === 'all' &&
      strictValidString(transport_data.start_date) &&
      strictValidString(transport_data.end_date)
    ) {
      return false;
    } else if (strictValidString(trip_id)) {
      return false;
    } else if (transport_data.zero_bal) {
      return false;
    } else {
      return true;
    }
  };
  const searchQueryFilter = async (e) => {
    const data = {
      ...state,
      limit: pagination.recordsPerPage,
      skip: 0,
      search: e,
    };
    changePagination({
      ...pagination,
      recordsPerPage: pagination.recordsPerPage,
      pageIndex: 0,
    });
    const res = await callInvoicingApi(data);
    if (
      strictValidObjectWithKeys(res) &&
      strictValidArrayWithLength(res.data)
    ) {
      setData({ ...data, trip_id: trip_id });
      setCheckboxWarning(false);
    } else {
      setData({});
      setCheckboxWarning(false);
    }
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
  return (
    <>
      <Grid>
        <Stack mt={2} direction="row" spacing={2}>
          {AccountFilters()}
          {DateFilterStartDate('start_date', start_date, 'Start Date')}
          {DateFilterEndDate('end_date', end_date, 'End Date')}
          <FormControl
            size="small"
            className={classes.input}
            variant="outlined"
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Trip Id
            </InputLabel>
            <OutlinedInput
              size="small"
              id="search_invoice_trip_id"
              label="Trip Id"
              variant="outlined"
              onChange={(e) => setTripId(e.target.value)}
              // onBlur={() => {
              //   filterValues();
              // }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  filterValues();
                }
              }}
              value={trip_id}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => {
                      filterValues();
                    }}
                    // onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControlLabel
            sx={{ mt: 2 }}
            control={
              <Checkbox
                size="small"
                disabled
                checked={zero_bal === 0 ? false : true}
                onChange={() => {
                  if (zero_bal === 0) {
                    setState((prevState) => ({
                      ...prevState,
                      zero_bal: 1,
                    }));
                  } else {
                    setState((prevState) => ({
                      ...prevState,
                      zero_bal: 0,
                    }));
                  }
                }}
              />
            }
            label="Include $0 balance trips"
          />

          <LoadingButton
            id="invoice_clear_btn_filters"
            loading={isLoad}
            disabled={checkValidStringInObject(state)}
            onClick={() => {
              setData({});
              setCheckboxWarning(false);
              setState({
                ...state,
                start_date: null,
                end_date: null,
              });
              setState({
                start_date: null,
                end_date: null,
                account_id: '',
                trip_id: '',
                zero_bal: false,
                choose_account: '',
                sub_account_id: '',
                selected: false,
              });
              setTripId('');
            }}
            loadingIndicator="Loading..."
            variant="contained"
          >
            Clear Filters
          </LoadingButton>
        </Stack>
        {
          <Collapse in={open}>
            <Stack mt={2}>
              <Alert
                iconMapping={{
                  error: <ErrorIcon sx={{ fontSize: 28 }} />,
                }}
                action={
                  <FormControlLabel
                    // sx={{ l: '#fff' }}
                    label={
                      <Typography variant="body2" sx={{ color: '#fff' }}>
                        Ignore Warnings
                      </Typography>
                    }
                    control={
                      <Checkbox
                        checked={checkboxWarning}
                        sx={{
                          color: '#fff',
                          '&.Mui-checked': {
                            color: '#fff',
                          },
                        }}
                        onChange={() => {
                          // setOpen(!open);
                          if (checkboxWarning) {
                            setCheckboxWarning(!checkboxWarning);
                            setWarning(true);
                          } else {
                            setCheckboxWarning(!checkboxWarning);

                            if (state.selected) {
                              setWarning(false);
                            }
                          }
                        }}
                      />
                    }
                  />
                }
                variant="filled"
                severity="error"
                color="error"
              >
                <Typography className={classes.errorText}>
                  {strictValidString(errorMessage) && errorMessage}
                </Typography>
              </Alert>
            </Stack>
          </Collapse>
        }
        <ReactTable
          // globalFilterShow={false}
          showExport
          excelName={`Invoicing`}
          headerFilter={false}
          DateFilterCss={true}
          loading={isLoad}
          isLoadInner={isLoadInner}
          serverSideFilter={(e) => searchQueryFilter(e)}
          serverSidePagination={true}
          clearFilterButton={() => {
            clearQueryFilter('');
          }}
          downloadBtnBody={{
            name: billingExportConstants.Invoicing,
            start_date: state.start_date,
            end_date: state.end_date,
            account_id: state.account_id,
            trip_id: trip_id,
            search: search,
            sub_account_id: state.sub_account_id,
            account_field: 'true',
          }}
          recordsPerPage={pagination.recordsPerPage}
          setRecordsPerPage={setRecordsPerPage}
          pageNumber={pagination.pageIndex}
          total={total}
          changePageSize={changePageSize}
          changePageIndex={changePageIndex}
          customText={'You do not have any configured Invoicing'}
          columnDefs={[
            {
              Header: 'Pick-up Time',
              accessor: (originalRow, rowIndex) => {
                return formatDateTime(originalRow.estimated_end_time) ===
                  'N/A' && originalRow.status === 'completed'
                  ? formatDate(originalRow.pick_up_date_time)
                  : formatDateTime(originalRow.pick_up_date_time);
              },
              Filter: DateFilter,
              width: 140,
              Cell: (props) => (
                <>
                  <Typography>
                    {formatDateTime(props.row.original.estimated_end_time) ===
                      'N/A' &&
                    (props.row.original.status === 'completed' ||
                      props.row.original.type === 'will_call')
                      ? formatDate(props.row.original.pick_up_date_time)
                      : formatDateTime(props.row.original.pick_up_date_time)}
                    {/* {formatDateTime(props.row.original.pick_up_date_time)} */}
                  </Typography>
                </>
              ),
            },
            {
              Header: 'ETA Drop-off',
              accessor: 'estimated_end_time',
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
              Header: 'PT Phone Number',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  strictValidObjectWithKeys(originalRow.base_patient) &&
                  originalRow.base_patient.phone
                );
              },
              id: 'base_patient',
              Filter: PhoneFilters,
              width: 170,
              disableSortBy: true,
              Cell: (props) => (
                <Typography>
                  {formatPhoneNumber(props.row.original.base_patient.phone)}
                </Typography>
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
          ]}
          rowData={Array.isArray(data) ? data : []}
        />
      </Grid>
    </>
  );
};

InvoicingList.propTypes = {
  callInvoicingApi: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

InvoicingList.defaultProps = {
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
    errorMessage: state.billing.invoice.errorMessage,
    corporateAccountFromState: state.billing.invoice.all_corporates_billing,
    isLoadInner: state.billing.invoice.isLoadInner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callInvoicingApi: (...params) => dispatch(getAllInvoicing(...params)),
  callDeleteInvoiceApi: (...params) => dispatch(deleteInvoice(...params)),
  callCorporateAccountBilling: (...params) =>
    dispatch(getCorporateAccounts(...params)),
});
export default connect(mapStateProps, mapDispatchToProps)(InvoicingList);

/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { makeStyles } from '@mui/styles';
import {
  defaultPropGetter,
  formatDate,
  strictValidArrayWithLength,
  strictValidString,
} from '../../utils/common-utils';
import { useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputMask from 'react-input-mask';
import {
  downloadExcel,
  downloadInvoiceExcel,
  downloadAccountExcel,
} from '../../containers/billing/action';
import { LoadingButton } from '@mui/lab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const apiHost = process.env.REACT_APP_BASE_URL;
const useStyles = makeStyles((theme) => ({
  input: {
    width: '100%',
    backgroundColor: '#FAFAFA',
    fontSize: 14,
  },
  globalInput: {
    backgroundColor: '#FAFAFA',
    fontSize: 16,
    width: '20%',
  },
  disabledCheckbox: {
    backgroundColor: '#F3F3F3',
  },
}));
export const DownloadExcel = (body) => {
  const [loader, setloader] = React.useState(false);
  const downloadFile = (val) => {
    const bodyObj = body.body;
    window.open(val, bodyObj.name);
  };
  const downloadExcelFile = async () => {
    const bodyObj = body.body;
    setloader(true);
    if (bodyObj.type) {
      const response = await downloadInvoiceExcel(bodyObj);
      if (response) {
        setloader(false);
        downloadFile(`${apiHost}${response}`);
      } else {
        setloader(false);
      }
    } else if (bodyObj.name === 'completed-tripAcc') {
      const response = await downloadAccountExcel(bodyObj);
      if (response) {
        setloader(false);
        downloadFile(`${apiHost}${response}`);
      } else {
        setloader(false);
      }
    } else {
      const response = await downloadExcel(bodyObj);
      if (response) {
        setloader(false);
        downloadFile(`${apiHost}${response}`);
      } else {
        setloader(false);
      }
    }
  };

  return (
    <LoadingButton
      loading={loader}
      startIcon={<DownloadIcon />}
      variant="contained"
      size="small"
      style={{
        maxHeight: '37px',
        marginRight: '7px',
        marginTop: 16,
        textTransform: 'capitalize',
      }}
      onClick={() => downloadExcelFile()}
    >
      Export Excel
    </LoadingButton>
  );
};
const GlobalFilter = function ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  ClearButton,
  disabled,
  setPageSize,
  serverSidePagination = false,
  serverSidefilter = defaultPropGetter,
  filterValues = defaultPropGetter,
  filterText = '',
}) {
  const classes = useStyles();
  const [value, setValue] = React.useState('');

  useEffect(() => {
    if (serverSidePagination) {
      setValue(filterText);
    } else {
      setValue(globalFilter);
    }
  }, [globalFilter, serverSidePagination, filterText]);

  const onChange = useAsyncDebounce((v) => {
    if (serverSidePagination) {
      serverSidefilter(v);
    } else {
      setGlobalFilter(v || undefined);
      setPageSize();
    }
  }, 200);
  return (
    <Stack my={2} direction="row" spacing={2}>
      <TextField
        disabled={disabled}
        classes={{ disabled: classes.disabledCheckbox }}
        size="small"
        variant="outlined"
        label={`Search`}
        className={classes.globalInput}
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`Search`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && serverSidePagination) {
            filterValues(value);
          }
        }}
        // endAdornment={<></>}
      />
      {serverSidePagination && (
        <Button
          size="medium"
          variant="contained"
          onClick={() => {
            filterValues(value);
          }}
          color="primary"
          a
          className={classes.button}
          disabled={value === '2'}
        >
          Search
        </Button>
      )}
      <Button
        className={classes.button}
        onClick={() => {
          ClearButton();
          setGlobalFilter('');
          setValue('');
          setPageSize();
        }}
        variant="contained"
      >
        Clear Filters
      </Button>
    </Stack>
  );
};

const DateFilter = function ({
  column: { filterValue, setFilter, Header },
  gotoPage,
}) {
  useEffect(() => {
    if (!filterValue) {
      setDate(null);
    }
  }, [filterValue]);

  const [date, setDate] = useState(null);
  const handleChange = (newValue) => {
    setDate(newValue);
    const date = formatDate(newValue);
    if (newValue === null) {
      setDate(null);
      setFilter('');
    } else {
      gotoPage(0);
      setFilter(date);
    }
  };
  const classes = useStyles();
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        size="small"
        id={`datePicker_${Header.replaceAll(' ', '_')}`}
        label={`Select`}
        clearable
        autocomplete="off"
        componentsProps={{
          actionBar: {
            // The actions will be the same between desktop and mobile
            actions: ['clear'],
          },
        }}
        showToolbar={false}
        value={date}
        onChange={(event) => handleChange(event)}
        inputFormat="MM/dd/yyyy"
        renderInput={(params) => (
          <TextField
            id={`datePicker_${Header.replaceAll(' ', '_')}`}
            className={classes.input}
            size="small"
            {...params}
          />
        )}
      />
    </LocalizationProvider>
  );
};

const CapabilityFilters = function ({ column }) {
  const { Header, filterValue, setFilter, preFilteredRows } = column;
  const classes = useStyles();
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    preFilteredRows.forEach((row) => {});

    setFilter(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  const capabilities = useSelector((state) => state.drivers.roles);
  return (
    <FormControl size="small" className={classes.input}>
      <InputLabel size="small" id="demo-multiple-name-label">
        Select
      </InputLabel>
      <Select
        placeholder="Select"
        labelId="demo-multiple-name-label"
        id={`capabilities_${Header.replaceAll(' ', '_')}`}
        multiple
        value={filterValue || []}
        onChange={handleChange}
        input={<OutlinedInput size="small" label="Select" />}
        MenuProps={MenuProps}
        size="small"
      >
        {strictValidArrayWithLength(capabilities) &&
          capabilities.map((name) => (
            <MenuItem
              key={name.capability_id}
              value={name.capability_id}
              // style={getStyles(name.name, filterValue, theme)}
            >
              {name.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};
const DefaultColumnFilter = function ({
  column: { filterValue, setFilter, Header, id },
  gotoPage,
}) {
  const classes = useStyles();
  return (
    <TextField
      size="small"
      id={`search_${Header.replaceAll(' ', '_')}`}
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
        gotoPage(0); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search`}
      variant="outlined"
      label={`Search`}
      className={classes.input}
    />
  );
};

const renderValues = (v, type) => {
  if (type === 'vehicle_status') {
    switch (v) {
      case 1:
        return 'In Service';
      case 0:
        return 'Out of Service';
      default:
        return 'All';
    }
  } else if (type === 'trip_status') {
    switch (v) {
      case 'Pending':
        return 'Pending';
      case 'planned':
        return 'Planned';
      case 'executing':
        return 'Executing';
      default:
        return 'All';
    }
  } else if (type === 'status') {
    switch (v) {
      case 'requested':
        return 'Requested';
      case 'allocated':
        return 'Allocated';
      case 'dispatch_requested':
        return 'Dispatch Requested';
      case 'noshow':
        return 'No Show';
      case 'en_route':
        return 'En Route';
      case 'arrived_at_pick_up':
        return 'Arrived at pick-up';
      case 'confirm_dob':
        return 'Confirmed DOB';
      case 'patient_loaded':
        return 'Patient loaded';
      case 'arrived_at_drop_off':
        return 'Arrived at drop-off';
      case 'rejected':
        return 'Rejected';
      case 'completed':
        return 'Completed';
      case 'planned':
        return 'Planned';
      case 'cancelled':
        return 'Canceled';
      default:
        return v;
    }
  } else if (type === 'invoice_status') {
    switch (v) {
      case 'validated':
        return 'Validated';
      case 'locked':
        return 'Locked';
      case 'uninvoiced':
        return 'Uninvoiced';
      case 'part_paid':
        return 'Partially Paid';
      case 'disputed':
        return 'Disputed';
      case 'fully_paid':
        return 'Fully Paid';
      case 'refunded':
        return 'Refunded';
      case 'send_invoiced':
        return 'Invoice Sent';
      case 'dispute_accepted':
        return 'Dispute Accepted';
      case 'invoiced':
        return 'Invoiced';
      case 'on_hold':
        return 'On Hold';
      case 'none':
        return 'N/A';
      case 'in_progress':
        return 'In Progress';
      case 'cancelled':
        return 'Canceled';
      default:
        return v;
    }
  } else if (type === 'type') {
    switch (v) {
      case 'string':
        return 'String';
      case 'float':
        return 'Float';
      case 'integer':
        return 'Integer';
      case 'positiveinteger':
        return 'Positive Integer';
      default:
        return v;
    }
  } else {
    return v;
  }
};

const SelectColumnFilter = function ({
  column: { filterValue, setFilter, preFilteredRows, id, Header },
  gotoPage,
}) {
  useEffect(() => {
    if (!strictValidString(filterValue)) {
      setFilter('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValue]);

  const classes = useStyles();
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <FormControl size="small" variant="outlined" className={classes.input}>
      <InputLabel id="demo-simple-select-helper-label">{`Select`}</InputLabel>
      <Select
        defaultValue=""
        labelId="demo-simple-select-helper-label"
        id={`search_${Header.replaceAll(' ', '_')}`}
        value={filterValue || ''}
        label={`Select`}
        placeholder={`Select`}
        onChange={(e) => {
          setFilter(e.target.value || '');
          gotoPage(0);
        }}
      >
        <MenuItem value="">All</MenuItem>
        {options.map((option, i) => (
          <MenuItem
            sx={{ textTransform: 'capitalize' }}
            key={i}
            value={`${option}`}
          >
            {renderValues(option, id)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const PhoneFilters = function ({
  column: { filterValue, setFilter, preFilteredRows, id, Header },
  gotoPage,
}) {
  const inputElement = useRef();
  const classes = useStyles();
  useEffect(() => {
    if (!strictValidString(filterValue)) {
      inputElement.current.setInputValue('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValue]);
  return (
    <InputMask
      className={classes.input}
      mask="+1(999) 999-9999"
      maskChar={null}
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value);
        gotoPage(0);
      }}
      ref={inputElement}
    >
      {(params) => (
        <TextField
          size="small"
          placeholder={`Search`}
          id={`search_${Header.replaceAll(' ', '_')}`}
          label={`Search`}
          fullWidth
          {...params}
        />
      )}
    </InputMask>
  );
};

export {
  SelectColumnFilter,
  DefaultColumnFilter,
  GlobalFilter,
  CapabilityFilters,
  DateFilter,
  PhoneFilters,
};

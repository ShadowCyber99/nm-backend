/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { flushAppLogs, getAuditLogsWithFilter } from '../action';
import PropTypes from 'prop-types';
import {
  formatDate,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/common-utils';
import ReactTable from '../../../components/react-table';
import { useSnackbar } from 'notistack';
import MDTooltip from '../../../components/tooltip';
// import { SocketContext } from "../../../hooks/useSocketContext";
import Dialog from '../../../components/dialog';
import { makeStyles } from '@mui/styles';
// import { LocalizationProvider, MobileDatePicker } from "@mui/lab";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { get } from 'lodash';
import { Box } from '@mui/system';

const useStyles = makeStyles(() => ({
  input: {
    width: '10%',
    backgroundColor: '#FAFAFA',
    fontSize: 14,
  },
  button: {
    width: '10%',
  },
  errorText: {
    fontWeight: 500,
    fontSize: 18,
    color: '#fff',
  },
}));
const AuditLogs = ({
  isLoad,
  isLoadInner,
  message,
  callAuditLogs,
  data,
  setLog,
  loadErr,
  callApplogFlush,
  limitRecords,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  // const socket = useContext(SocketContext);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const classes = useStyles();
  const [state, setState] = useState({
    start_date: null,
    end_date: null,
  });

  const { start_date, end_date } = state;
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (loadErr)
      enqueueSnackbar(loadErr, {
        variant: 'error',
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
  }, [loadErr]);

  useEffect(() => {
    if (message)
      enqueueSnackbar(message, {
        variant: 'success',
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
  }, [message]);

  useEffect(() => {
    callApplogFlush();
    setLog(false);
  }, []);

  const toggle = () => {
    setIsOpenDialog(!isOpenDialog);
  };

  const renderDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        fullWidth={true}
        maxWidth={'md'}
        sxAppBar={{ justifyContent: 'center', alignItems: 'center' }}
        sxTitle={{ fontSize: 24 }}
        closeIcon={false}
        isOpen={isOpenDialog}
        appBarColor="error"
        title={'Warning !'}
        handleClose={() => {
          toggle();
        }}
      >
        <DialogContent
          sx={{ justifyContent: 'center', display: 'flex', mt: 2 }}
        >
          <Typography mr={1} variant="h4">
            Only 1000 logs will be shown, use filters to reduce the scope!
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: 'space-evenly', display: 'flex', mt: 2 }}
        >
          <Button
            className={classes.buttonForceAction}
            color="error"
            variant="outlined"
            onClick={() => toggle()}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const checkValidStringInObject = () => {
    if (
      strictValidString(state.start_date) &&
      strictValidString(state.end_date)
    ) {
      return false;
    } else if (strictValidString(search)) {
      return false;
    } else {
      return true;
    }
  };

  const changeHandler = (e) => {
    setSearch(e);
  };

  const filterValues = async () => {
    const data = {
      ...state,
      search: search,
    };
    const res = await callAuditLogs(data);
    if (
      res &&
      strictValidObjectWithKeys(res) &&
      get(res, 'totalRecords', 0) > 1000
    ) {
      setIsOpenDialog(!isOpenDialog);
    }
  };

  const DateFilterView = (updateVal, value, label) => {
    const handleChange = (newValue) => {
      if (updateVal === 'start_date') {
        if (new Date(newValue) >= new Date(state.end_date)) {
          setState((prevState) => ({
            ...prevState,
            end_date: null,
          }));
        }
      }

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
      callApplogFlush();
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDatePicker
          size="small"
          label={label}
          className={classes.input}
          value={value}
          componentsProps={{
            actionBar: {
              // The actions will be the same between desktop and mobile
              actions: ['cancel'],
            },
          }}
          onChange={() => {}}
          minDate={
            updateVal === 'end_date'
              ? new Date(state.start_date)
              : new Date('01/01/1990')
          }
          maxDate={new Date()}
          onAccept={(w) => handleChange(w)}
          showToolbar={false}
          closeOnSelect
          inputFormat="MM/dd/yy"
          renderInput={(params) => (
            <TextField className={classes.input} size="small" {...params} />
          )}
        />
      </LocalizationProvider>
    );
  };

  return (
    <div>
      <Stack mt={2} direction="row" spacing={2}>
        {DateFilterView('start_date', start_date, 'Start Date')}
        {DateFilterView('end_date', end_date, 'End Date')}
        <FormControl size="small" className={classes.input} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Search</InputLabel>
          <OutlinedInput
            size="small"
            id="search_invoice_trip_id"
            label="Search"
            variant="outlined"
            onChange={(e) => changeHandler(e.target.value)}
            // onBlur={() => {
            //   filterValues();
            // }}
            value={search}
          />
        </FormControl>
        <Button
          className={classes.button}
          id="invoice_clear_btn_filters"
          loading={isLoad}
          disabled={
            strictValidObjectWithKeys(state) && checkValidStringInObject(state)
          }
          onClick={() => {
            filterValues();
          }}
          variant="contained"
        >
          {isLoad ? <CircularProgress size={20} color="secondary" /> : 'Search'}
        </Button>
        <Button
          className={classes.button}
          id="invoice_clear_btn_filters"
          loading={isLoad}
          // disabled={
          //   strictValidObjectWithKeys(state) && checkValidStringInObject(state)
          // }
          onClick={() => {
            setSearch('');
            callApplogFlush();
            setState({
              start_date: null,
              end_date: null,
              search: '',
            });
          }}
          variant="contained"
        >
          Clear Filters
        </Button>
      </Stack>
      <Grid>
        {strictValidObjectWithKeys(limitRecords) &&
        limitRecords.totalRecords !== 0 &&
        get(data, 'logsAudit.logs_audit.data', []) ? (
          <>
            <ReactTable
              loading={isLoad}
              isLoadInner={isLoadInner}
              pagination={false}
              excelName={'Audit Log'}
              customHeight={false}
              tableSize={false}
              showExport
              height={{ maxHeight: '85vh', minHeight: '85vh' }}
              customText={'You do not have any Logs'}
              columnDefs={[
                {
                  Header: 'Time stamp',
                  accessor: (originalRow, rowIndex) => {
                    return (
                      strictValidObjectWithKeys(originalRow) &&
                      originalRow.Timestamp
                    );
                  },
                  width: 140,
                  disableSortBy: true,
                  Cell: (props) => (
                    <Stack>
                      <Typography>{props.row.original.Timestamp}</Typography>
                    </Stack>
                  ),
                },
                {
                  Header: 'Id',
                  accessor: 'id',
                  width: 100,
                },
                {
                  Header: 'User Name',
                  accessor: 'user_name',
                  width: 270,
                  Cell: (props) => (
                    <Typography height={55}>
                      {strictValidString(props.row.original.user_name)
                        ? props.row.original.user_name
                        : 'N/A'}
                    </Typography>
                  ),
                },
                {
                  Header: 'Object Name',
                  accessor: 'object_name',
                  width: 100,
                },
                {
                  Header: 'Info',
                  accessor: 'info',
                  width: 300,
                  Cell: (props) => (
                    <MDTooltip title={props.row.original.info}>
                      <Typography>{props.row.original.info}</Typography>
                    </MDTooltip>
                  ),
                },
              ]}
              rowData={get(data, 'logsAudit.logs_audit.data', [])}
            />
          </>
        ) : (
          <Box
            display="flex"
            sx={{
              justifyContent: 'center',
              mt: 63,
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" sx={{ fontSize: 16 }}>
              {strictValidObjectWithKeys(limitRecords) &&
              limitRecords.totalRecords === 0
                ? 'You do not have any Logs'
                : 'Set Filters to Load Logs'}
            </Typography>
          </Box>
        )}
      </Grid>
      {renderDialog()}
    </div>
  );
};

AuditLogs.propTypes = {
  callAuditLogs: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

AuditLogs.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.logs.audit.message,
    isLoad: state.logs.audit.isLoad,
    loadErr: state.logs.audit.loadErr,
    data: state.logs,
    isLoadInner: state.logs.audit.isLoadInner,
    limitRecords: state.logs.logsAudit.logs_audit,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callAuditLogs: (...params) => dispatch(getAuditLogsWithFilter(...params)),
  callApplogFlush: (...params) => dispatch(flushAppLogs(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(AuditLogs);

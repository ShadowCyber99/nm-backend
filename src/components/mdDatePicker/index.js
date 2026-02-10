/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import TextField from '@mui/material/TextField';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormHelperText,
  IconButton,
} from '@mui/material';
import {
  getPhoenixDateTime,
  strictValidString,
} from '../../utils/common-utils';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { MobileDatePicker as MobileDate } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ClockIcon from '@mui/icons-material/AccessTime';
import Dialog from '../dialog';
import WarningAmberIcon from '@mui/icons-material/Warning';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { ClickAwayListener } from '@mui/material';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  withoutLabel: {
    marginTop: theme.spacing(2),
    backgroundColor: '#FAFAFA',
  },
  textField: {
    width: '100%',
  },
  input: {
    fontSize: 14,
  },
  helperText: {
    margin: `${theme.spacing(0.2, 0, 0, 0)} !important`,
    backgroundColor: '#F3F3F3',
    color: theme.palette.error.main,
  },
  disabledCheckbox: {
    backgroundColor: '#F3F3F3',
  },
  header: {
    marginTop: theme.spacing(0.5),
    fontSize: 18,
  },
  button: {
    width: 200,
    textTransform: 'capitalize',
  },
}));
const defaultPropGetter = () => ({});

export default function MdDatePicker({
  placeholder,
  required,
  onChange,
  onBlur,
  name,
  input,
  value,
  renderValue,
  errorText,
  type,
  otherProps,
  disabled,
  maxTime,
  minTime,
  minDateTime,
  minDate,
  disableFuture,
  maxDate,
  id,
  disablePast = true,
  maxDateTime,
  closeOnSelect = true,
  compareTime = true,
  clearText = false,
  onSave = defaultPropGetter,
  readOnly = false,
  inputFormat = 'MM/dd/yyyy',
  toolbarPlaceholder = 'MM/DD/YYYY',
  onError = defaultPropGetter,
  pickerActions = ['', 'cancel'],
}) {
  const classes = useStyles();
  const [datetime, setdatetime] = React.useState(value || null);
  const [isDeleteDialog, setIsDeleteDialog] = React.useState(false);
  const [time, setTime] = React.useState('');
  const [openPicker, setOpenPicker] = React.useState(false);

  React.useEffect(() => {
    if (!datetime && required) {
      setdatetime('');
    } else if (!datetime) {
      setdatetime(null);
    }
  }, [required]);
  React.useEffect(() => {
    if (value === null || value === undefined) {
      setdatetime(null);
    }
  }, [value]);

  const deleteToggle = () => {
    setIsDeleteDialog(!isDeleteDialog);
  };
  const deleteDialog = (id) => {
    return (
      <Dialog
        appBarColor="error"
        title={'Warning !'}
        closeIcon={false}
        fullScreen={false}
        maxWidth={'sm'}
        sxAppBar={{ justifyContent: 'center', alignItems: 'center' }}
        sxTitle={{ fontSize: 24 }}
        fullWidth
        isOpen={isDeleteDialog}
        handleClose={() => {
          deleteToggle();
        }}
      >
        <DialogContent
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <WarningAmberIcon
            color="error"
            sx={{ height: 60, width: 60, mb: 3 }}
          />
          <DialogContentText
            className={classes.header}
            id="alert-dialog-slide-description"
          >
            {type === 'onlydate'
              ? 'Pick-up date set in the past'
              : 'Pick-up Time set in the past'}
            ,
          </DialogContentText>
          <DialogContentText
            className={classes.header}
            id="alert-dialog-slide-description"
          >
            are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: 'space-around', display: 'flex', mt: 2 }}
        >
          <Button
            className={classes.button}
            color="success"
            variant="outlined"
            onClick={() => {
              deleteToggle();
              setdatetime(time);
              onChange(time);
            }}
          >
            Yes, Continue
          </Button>
          <Button
            className={classes.button}
            color="error"
            variant="outlined"
            onClick={() => {
              deleteToggle();
              setdatetime(null);
              onChange(null);
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const handleChange = (v) => {
    if (v) {
      if (!compareTime) {
      } else {
        setdatetime(v);
        onChange(v);
        onSave(v);
      }
    }
  };
  const onSubmit = (v) => {
    const pheonixTime = getPhoenixDateTime();

    if (!compareTime) {
      const parsedSelectedTime =
        type === 'onlydate'
          ? Date.parse(moment(v).format('MM/DD/YYYY 23:59:59'))
          : Date.parse(v);
      if (parsedSelectedTime < pheonixTime) {
        deleteToggle();
        setTime(v);
      } else {
        setdatetime(v);
        onChange(v);
        onSave(v);
      }
    }
  };

  const onlyDateSubmit = (v) => {
    if (!compareTime) {
      setdatetime(v);
      onChange(v);
      onSave(v);
    }
  };

  if (type === 'onlydate-small') {
    return (
      <>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MobileDate
            sx={{
              '& .MuiSvgIcon-fontSizeMedium': { display: 'none' },
            }}
            disableHighlightToday
            DialogProps={{
              onClose: () => {},
            }}
            componentsProps={{
              actionBar: {
                // The actions will be the same between desktop and mobile
                actions: ['cancel'],
              },
            }}
            // disablePast
            closeOnSelect={true}
            showTodayButton={false}
            allowSameDateSelection={true}
            // clearText={true}
            allowKeyboardControl={true}
            showToolbar={false}
            toolbarTitle="Select Date and Time"
            inputFormat="MM/dd/yy"
            label={placeholder}
            value={datetime}
            onChange={(v) => {
              handleChange(v);
            }}
            onError={onError}
            minutesStep={5}
            components={{
              OpenPickerIcon: ClockIcon,
            }}
            onAccept={onlyDateSubmit}
            // onAccept={onlyDateSubmit}
            disabled={disabled}
            disableFuture={disableFuture}
            maxDateTime={maxDateTime}
            maxDate={maxDate}
            minDateTime={minDateTime || null}
            minTime={minTime}
            minDate={minDate}
            className={clsx(classes.withoutLabel)}
            InputProps={{ classes: { disabled: classes.disabledCheckbox } }}
            maxTime={maxTime}
            renderInput={(params) => (
              <>
                <TextField
                  onBlur={onBlur}
                  required={required}
                  sx={{ backgroundColor: '#F3F3F3' }}
                  size="small"
                  id={id}
                  error={
                    strictValidString(errorText) ||
                    (required &&
                      !disabled &&
                      !strictValidString(params.inputProps.value))
                  }
                  {...params}
                />
              </>
            )}
            {...otherProps}
          />
          {strictValidString(errorText) && (
            <FormHelperText
              className={classes.helperText}
              id="component-helper-text"
            >
              {errorText}
            </FormHelperText>
          )}
        </LocalizationProvider>
        {deleteDialog()}
      </>
    );
  }

  if (type === 'onlydate') {
    return (
      <>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MobileDate
            sx={{
              '& .MuiSvgIcon-fontSizeMedium': { display: 'none' },
            }}
            disableHighlightToday
            className={clsx(classes.withoutLabel, classes.textField)}
            DialogProps={{
              onClose: () => {},
            }}
            // disablePast
            closeOnSelect={true}
            componentsProps={{
              actionBar: {
                // The actions will be the same between desktop and mobile
                actions: [clearText ? 'clear' : 'cancel'],
              },
            }}
            showTodayButton={false}
            allowSameDateSelection={true}
            // clearText={true}
            allowKeyboardControl={true}
            showToolbar={false}
            toolbarTitle="Select Date and Time"
            inputFormat="MM/dd/yy"
            clearable
            label={placeholder}
            value={datetime}
            onChange={(v) => {
              handleChange(v);
            }}
            onError={onError}
            minutesStep={5}
            components={{
              OpenPickerIcon: ClockIcon,
            }}
            onAccept={onSubmit}
            disabled={disabled}
            disableFuture={disableFuture}
            maxDateTime={maxDateTime}
            maxDate={maxDate}
            minDateTime={minDateTime || null}
            minTime={minTime}
            minDate={minDate}
            // InputProps={{ classes: { disabled: classes.disabledCheckbox } }}
            maxTime={maxTime}
            renderInput={(params) => (
              <>
                <TextField
                  onBlur={onBlur}
                  required={required}
                  sx={{ backgroundColor: '#F3F3F3' }}
                  id={id}
                  error={
                    strictValidString(errorText) ||
                    (required &&
                      !disabled &&
                      !strictValidString(params.inputProps.value))
                  }
                  {...params}
                />
              </>
            )}
            {...otherProps}
          />
          {strictValidString(errorText) && (
            <FormHelperText
              className={classes.helperText}
              id="component-helper-text"
            >
              {errorText}
            </FormHelperText>
          )}
        </LocalizationProvider>
        {deleteDialog()}
      </>
    );
  }
  if (type === 'date') {
    return (
      <ClickAwayListener>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            className={clsx(classes.withoutLabel, classes.textField)}
            disablePast={disablePast}
            todayText="now"
            showTodayButton
            inputFormat={inputFormat}
            toolbarPlaceholder={toolbarPlaceholder}
            value={datetime}
            showToolbar={false}
            // clearable
            allowSameDateSelection={true}
            DialogProps={{
              onClose: () => {},
            }}
            onError={onError}
            label={placeholder}
            onChange={handleChange}
            disabled={disabled}
            disableFuture={disableFuture}
            minDateTime={minDateTime || null}
            minDate={minDate || null}
            maxDate={maxDate}
            error={
              strictValidString(errorText) ||
              (required && !disabled && !strictValidString(datetime))
            }
            InputProps={{ classes: { disabled: classes.disabledCheckbox } }}
            renderInput={(params) => (
              <TextField
                className={clsx(classes.withoutLabel, classes.textField)}
                id={id}
                variant="outlined"
                onBlur={onBlur}
                required={required}
                error={
                  strictValidString(errorText) ||
                  (required && !disabled && !strictValidString(datetime))
                }
                {...params}
              />
            )}
            {...otherProps}
          />
          {strictValidString(errorText) && (
            <FormHelperText
              className={classes.helperText}
              id="component-helper-text"
            >
              {errorText}
            </FormHelperText>
          )}
        </LocalizationProvider>
      </ClickAwayListener>
    );
  }
  if (type === 'onlyIcon') {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDatePicker
          disablePast={disablePast}
          todayText={'Now'}
          showTodayButton
          inputFormat={inputFormat}
          toolbarPlaceholder={toolbarPlaceholder}
          value={datetime}
          showToolbar={false}
          clearable
          allowSameDateSelection={true}
          label={placeholder}
          onChange={() => {}}
          disabled={disabled}
          disableFuture={disableFuture}
          minDateTime={minDateTime || null}
          minDate={minDate || null}
          DialogProps={{
            onClose: () => {},
          }}
          onError={onError}
          maxDate={maxDate}
          error={
            strictValidString(errorText) ||
            (required && !disabled && !strictValidString(datetime))
          }
          onOpen={() => setOpenPicker(!openPicker)}
          open={openPicker}
          cancelText={false}
          clearText="Cancel"
          onAccept={handleChange}
          onClose={() => setOpenPicker(false)}
          InputProps={{ classes: { disabled: classes.disabledCheckbox } }}
          renderInput={(params) => (
            <IconButton
              disabled={disabled}
              onClick={() => setOpenPicker(!openPicker)}
              {...params}
            >
              <CalendarMonthIcon {...params} />
            </IconButton>
          )}
          {...otherProps}
        />
        {strictValidString(errorText) && (
          <FormHelperText
            className={classes.helperText}
            id="component-helper-text"
          >
            {errorText}
          </FormHelperText>
        )}
      </LocalizationProvider>
    );
  }
  if (type === 'onlyIcon-datetime') {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDateTimePicker
          disablePast={disablePast}
          sx={{
            '& .MuiSvgIcon-fontSizeMedium': { display: 'none' },
          }}
          componentsProps={{
            actionBar: {
              // The actions will be the same between desktop and mobile
              actions: pickerActions,
            },
          }}
          // todayText={'Now'}
          // showTodayButton
          inputFormat={inputFormat}
          toolbarPlaceholder={toolbarPlaceholder}
          value={datetime}
          showToolbar={true}
          clearable
          defaultValue
          closeOnSelect={true}
          allowSameDateSelection={true}
          label={placeholder}
          onChange={() => {}}
          disabled={disabled}
          disableFuture={disableFuture}
          minDateTime={minDateTime || null}
          minDate={minDate || null}
          maxDateTime={maxDateTime}
          maxDate={maxDate}
          DialogProps={{
            onClose: () => {},
          }}
          onError={onError}
          error={
            strictValidString(errorText) ||
            (required && !disabled && !strictValidString(datetime))
          }
          onOpen={() => setOpenPicker(!openPicker)}
          open={openPicker}
          onAccept={(a) => {
            handleChange(a);
            setOpenPicker(false);
          }}
          onClose={() => setOpenPicker(false)}
          InputProps={{ classes: { disabled: classes.disabledCheckbox } }}
          renderInput={(params) => (
            <IconButton
              disabled={disabled}
              onClick={() => setOpenPicker(!openPicker)}
              {...params}
            >
              <CalendarMonthIcon {...params} />
            </IconButton>
          )}
          {...otherProps}
        />
        {strictValidString(errorText) && (
          <FormHelperText
            className={classes.helperText}
            id="component-helper-text"
          >
            {errorText}
          </FormHelperText>
        )}
      </LocalizationProvider>
    );
  } else {
    return (
      <>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MobileDateTimePicker
            sx={{
              '& .MuiSvgIcon-fontSizeMedium': { display: 'none' },
            }}
            componentsProps={{
              actionBar: {
                // The actions will be the same between desktop and mobile
                actions: [clearText ? 'clear' : 'cancel'],
              },
            }}
            disableHighlightToday
            DialogProps={{
              onClose: () => {},
            }}
            // disablePast
            closeOnSelect={true}
            todayText="now"
            cancelText={null}
            showTodayButton={false}
            allowSameDateSelection={true}
            // clearText={true}
            allowKeyboardControl={true}
            toolbarTitle="Select Date and Time"
            inputFormat="MM/dd/yy HHmm"
            label={placeholder}
            value={datetime}
            onChange={(v) => {
              handleChange(v);
            }}
            onError={onError}
            minutesStep={5}
            components={{
              OpenPickerIcon: ClockIcon,
            }}
            onAccept={onSubmit}
            disabled={disabled}
            disableFuture={disableFuture}
            className={clsx(classes.withoutLabel, classes.textField)}
            maxDateTime={maxDateTime}
            maxDate={maxDate}
            minDateTime={minDateTime || null}
            minTime={minTime}
            InputProps={{ classes: { disabled: classes.disabledCheckbox } }}
            maxTime={maxTime}
            renderInput={(params) => (
              <>
                <TextField
                  onBlur={onBlur}
                  required={required}
                  id={id}
                  error={
                    strictValidString(errorText) ||
                    (required &&
                      !disabled &&
                      !strictValidString(params.inputProps.value))
                  }
                  {...params}
                />
              </>
            )}
            {...otherProps}
          />
          {strictValidString(errorText) && (
            <FormHelperText
              className={classes.helperText}
              id="component-helper-text"
            >
              {errorText}
            </FormHelperText>
          )}
        </LocalizationProvider>
        {deleteDialog()}
      </>
    );
  }
}

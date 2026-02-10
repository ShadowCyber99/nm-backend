import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { strictValidString } from '../../utils/common-utils';
import { validateField } from '../../utils/validation';

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
  },
  disabledCheckbox: {
    backgroundColor: '#F3F3F3',
  },
}));
function MDSelect({
  input,
  data,
  value,
  onChange,
  errorText,
  required,
  disabled,
  placeholder,
  isMultiple,
  renderValue,
  otherProps,
  onBlur,
}) {
  const classes = useStyles();
  return (
    <FormControl
      className={clsx(classes.withoutLabel, classes.textField)}
      fullWidth
      required={required}
      error={
        strictValidString(errorText) ||
        (required && !disabled && validateField(value))
      }
    >
      <InputLabel id={`select_${placeholder.replaceAll(' ', '_')}`}>
        {placeholder}
      </InputLabel>
      <Select
        classes={{ disabled: classes.disabledCheckbox }}
        {...input}
        labelId="demo-simple-select-label"
        id={`select_${placeholder.replaceAll(' ', '_')}`}
        variant="outlined"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required
        fullWidth
        disabled={disabled}
        size="medium"
        label={placeholder}
        placeholder={placeholder}
        multiple={isMultiple}
        renderValue={renderValue}
        {...otherProps}
      >
        {data.map((a) => {
          return (
            <MenuItem disabled={a.disabled} id={a.value} value={a.value}>
              {a.title}
            </MenuItem>
          );
        })}
      </Select>
      {strictValidString(errorText) && (
        <FormHelperText
          className={classes.helperText}
          id="component-helper-text"
        >
          {errorText}
        </FormHelperText>
      )}
    </FormControl>
  );
}

export default MDSelect;

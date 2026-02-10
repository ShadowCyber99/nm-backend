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
import {
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/common-utils';
import { validateField } from '../../../utils/validation';

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

const FinalFormSelect = ({
  input,
  placeholder,
  meta,
  meta: { touched, error },
  onChange,
  autoFocus,
  style,
  labelWidth = 70,
  disabled,
  inlinePlaceholder,
  items,
  required,
  errorText,
  isMultiple = false,
  renderValue,
  ...otherProps
}) => {
  const classes = useStyles();

  return (
    <>
      <FormControl
        className={clsx(classes.withoutLabel, classes.textField)}
        fullWidth
        required={required}
        error={
          strictValidString(errorText) ||
          (required && !disabled && validateField(input.value))
        }
      >
        <InputLabel className={classes.input} id="demo-simple-select-label">
          {placeholder}
        </InputLabel>
        <Select
          classes={{ disabled: classes.disabledCheckbox }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          variant="outlined"
          {...input}
          required
          error={
            strictValidString(errorText) ||
            (required && validateField(input.value))
          }
          fullWidth
          placeholder={inlinePlaceholder || placeholder}
          disabled={disabled}
          size="medium"
          label={placeholder}
          multiple={isMultiple}
          renderValue={renderValue}
          {...otherProps}
        >
          {strictValidArrayWithLength(items) &&
            items.map((v) =>
              strictValidObjectWithKeys(v) ? (
                <MenuItem value={v.value}>{v.title}</MenuItem>
              ) : (
                <MenuItem value={v}>{v}</MenuItem>
              ),
            )}
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
    </>
  );
};

export default FinalFormSelect;

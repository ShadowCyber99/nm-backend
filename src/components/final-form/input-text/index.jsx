import React, { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  FormControl,
  IconButton,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { strictValidString } from '../../../utils/common-utils';

const useStyles = makeStyles((theme) => ({
  withoutLabel: {
    margin: `${theme.spacing(2, 0, 0, 0)} !important`,
    width: '100%',
    backgroundColor: '#FAFAFA',
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

const FinalFormText = ({
  input,
  input: { type = 'text' },
  placeholder,
  meta,
  meta: { touched, error },
  onChange,
  autoFocus,
  style,
  disabled,
  inlinePlaceholder,
  inputType,
  required,
  errorText,
  inputComponent,
  startAdornment,
  endAdornment,
  inputProps,
  multiline,
  onKeyDown,
  ...otherProps
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const classes = useStyles();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (e) => {
    const { onChange: onChangeInput } = input;
    if (onChange) onChange(e);

    if (onChangeInput) onChangeInput(e);
  };

  const fieldType = showPassword ? 'text' : inputType;

  const renderPassword = () => {
    return (
      inputType === 'password' && (
        <InputAdornment position="end">
          <IconButton
            onClick={handleClickShowPassword}
            edge="end"
            onMouseDown={handleMouseDownPassword}
          >
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </InputAdornment>
      )
    );
  };
  return (
    <>
      <FormControl
        disabled={disabled}
        className={classes.withoutLabel}
        required={required}
        variant="outlined"
        error={
          strictValidString(errorText) ||
          (required && !disabled && !strictValidString(input.value))
        }
      >
        <InputLabel className={classes.input} htmlFor="component-outlined">
          {placeholder}
        </InputLabel>
        <OutlinedInput
          classes={{ disabled: classes.disabledCheckbox }}
          id="component-outlined"
          type={fieldType}
          label={placeholder}
          placeholder={inlinePlaceholder || placeholder}
          fullWidth
          autoFocus={autoFocus}
          onChange={handleChange}
          size="medium"
          inputProps={inputProps}
          onKeyDown={onKeyDown}
          onBlur={handleChange}
          inputComponent={inputComponent}
          startAdornment={startAdornment}
          multiline={multiline}
          endAdornment={endAdornment || renderPassword()}
          {...input}
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
      </FormControl>
    </>
  );
};

export default FinalFormText;

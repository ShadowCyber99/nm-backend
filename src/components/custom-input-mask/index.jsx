import React from "react";
import InputMask from "react-input-mask";
import { TextField, FormHelperText } from '@mui/material';
import { makeStyles } from "@mui/styles";
import { strictValidString } from "../../utils/common-utils";
import { validateField } from "../../utils/validation";

// to run more then once, comment next line out
// injectTapEventPlugin()

const useStyles = makeStyles((theme) => ({
  withoutLabel: {
    margin: `${theme.spacing(2, 0, 0, 0)} !important`,
    width: "100%",
    backgroundColor: "#FAFAFA",
  },
  input: {
    fontSize: 14,
  },
  helperText: {
    margin: `${theme.spacing(0.2, 0, 0, 0)} !important`,
    color:theme.palette.error.main,
    backgroundColor: "#F3F3F3",
  },
  disabledCheckbox: {
    backgroundColor: "#F3F3F3",
  },
}));
const TextMaskCustom = ({
  onChangeText,
  defaultValue,
  input,
  errorText,
  label,
  required,
  disabled,
  inputProps,
  onBlur,
  id
}) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <InputMask
        className={classes.withoutLabel}
        mask="+1(999) 999-9999"
        maskChar={null}
        value={defaultValue}
        disabled={disabled}
        onChange={(e) => onChangeText(e.target.value)}
        onBlur={onBlur}
        {...input}
      >
        {(params) => (
          <TextField
            inputProps={inputProps}
            InputProps={{ classes: { disabled: classes.disabledCheckbox } }}
            error={errorText || (required && validateField(defaultValue))}
            required={required}
            label={label}
            id={id}
            placeholder={label}
            disabled={disabled}
            fullWidth
            {...params}
          />
        )}
      </InputMask>
      {strictValidString(errorText) && (
        <FormHelperText
          className={classes.helperText}
          id="component-helper-text"
        >
          {errorText}
        </FormHelperText>
      )}
    </React.Fragment>
  );
};

export default TextMaskCustom;

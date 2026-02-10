import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import React, { useEffect } from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  withoutLabel: {
    margin: `${theme.spacing(2, 0, 0, 0)} !important`,
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
const FinalFormCheckbox = ({
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
  valueDefault,
  ...otherProps
}) => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(valueDefault || false);

  useEffect(() => {
    setChecked(valueDefault);
  }, [valueDefault]);

  const handleChange = (e) => {
    const { onChange: onChangeInput } = input;
    if (onChange) onChange(e);

    if (onChangeInput) onChangeInput(e);
  };
  return (
    <FormGroup className={classes.withoutLabel} aria-label="position" row>
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
            checked={checked}
            // value={false}
            {...otherProps}
          />
        }
        label={placeholder}
        labelPlacement="end"
        disabled={disabled}
        onChange={handleChange}
      />
    </FormGroup>
  );
};

export default FinalFormCheckbox;

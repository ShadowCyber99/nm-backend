/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';
import { makeStyles } from '@mui/styles';
import {
  defaultPropGetter,
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../utils/common-utils';
import { FormHelperText } from '@mui/material';
import { connect } from 'react-redux';
import { getLatLng, getLoc, pocFlush } from '../../containers/poc/action';
import { validateField } from '../../utils/validation';
import { debounce } from 'lodash';

// function loadScript(src, position, id) {
//   if (!position) {
//     return;
//   }

//   const script = document.createElement('script');
//   script.setAttribute('async', '');
//   script.setAttribute('id', id);
//   script.src = src;
//   position.appendChild(script);
// }

// const autocompleteService = { current: null };

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
    color: theme.palette.error.main,
  },
  disabledCheckbox: {
    backgroundColor: '#F3F3F3',
  },
}));

function GoogleMapsPoc({
  label,
  callGetLoc,
  errorText,
  callGetLatLng,
  callPocFlush,
  onChangeText,
  defaultValue,
  selectOption,
  disabled,
  required,
  onBlur,
  isSetLatLong = false,
  setLatLong,
  setResults = defaultPropGetter,
  ...input
}) {
  const [value, setValue] = React.useState(defaultValue || '');
  const [inputValue, setInputValue] = React.useState(defaultValue || '');
  const [options, setOptions] = React.useState([]);
  // const loaded = React.useRef(false);
  const classes = useStyles();
  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const fetch = React.useMemo(
    () =>
      debounce(async (request, callback) => {
        if (request.input.length >= 4) {
          const decryptedData = await callGetLoc(request.input);
          if (strictValidArrayWithLength(decryptedData)) {
            callback(decryptedData);
          }
        }
      }, 300),
    [],
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);
  const id = label.replaceAll(' ', '_');
  return (
    <>
      <Autocomplete
        id={id.replaceAll('-', '_')}
        sx={{ width: 300 }}
        style={{ backgroundColor: disabled ? '#F3F3F3' : '#FAFAFA' }}
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : option.description
        }
        filterOptions={(x) => x}
        options={options}
        autoComplete
        includeInputInList
        filterSelectedOptions
        disabled={disabled}
        className={classes.withoutLabel}
        value={value}
        onBlur={onBlur}
        onChange={async (event, newValue) => {
          setValue(newValue?.description);
          selectOption(newValue);
          onChangeText(newValue);
          if (strictValidString(newValue.description)) {
            const res = await callGetLatLng(newValue.place_id);
            if (strictValidObjectWithKeys(res)) {
              setResults(res);
            }
            const { latitude, longitude } = res;
            setLatLong({
              lat: latitude,
              lng: longitude,
            });
          }
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
          // callPocFlush();
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            required={required}
            label={label}
            fullWidth
            value={value}
            error={
              strictValidString(errorText) ||
              (required && !disabled && validateField(value))
            }
          />
        )}
        renderOption={(props, option) => {
          const matches =
            strictValidObjectWithKeys(option) &&
            strictValidObjectWithKeys(option.structured_formatting) &&
            option.structured_formatting.main_text_matched_substrings;
          const parts =
            strictValidArrayWithLength(matches) &&
            parse(
              option.structured_formatting.main_text,
              matches.map((match) => [
                match.offset,
                match.offset + match.length,
              ]),
            );

          return (
            <li {...props}>
              <Grid container alignItems="center">
                <Grid item>
                  <Box
                    component={LocationOnIcon}
                    sx={{ color: 'text.secondary', mr: 2 }}
                  />
                </Grid>
                <Grid item xs>
                  {strictValidArrayWithLength(parts) &&
                    parts.map((part, index) => (
                      <span
                        key={index}
                        style={{
                          fontWeight: part.highlight ? 700 : 400,
                        }}
                      >
                        {part.text}
                      </span>
                    ))}

                  <Typography variant="body2" color="text.secondary">
                    {strictValidObjectWithKeys(option) &&
                      strictValidObjectWithKeys(option.structured_formatting) &&
                      option.structured_formatting.secondary_text}
                  </Typography>
                </Grid>
              </Grid>
            </li>
          );
        }}
      />
      {strictValidString(errorText) && (
        <FormHelperText
          className={classes.helperText}
          id="component-helper-text"
        >
          {errorText}
        </FormHelperText>
      )}
    </>
  );
}

const mapStateProps = (state) => {
  return {
    // decryptedData: state.pocReducer.getLocation.data,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callGetLoc: (...params) => dispatch(getLoc(...params)),
  callGetLatLng: (...params) => dispatch(getLatLng(...params)),
  callPocFlush: (...params) => dispatch(pocFlush(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(GoogleMapsPoc);

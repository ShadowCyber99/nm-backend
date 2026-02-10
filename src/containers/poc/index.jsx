import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import GoogleMapsPoc from '../../components/poc-google';
import arrayMutators from 'final-form-arrays';
import createDecorator from 'final-form-focus';
import { Field, Form } from 'react-final-form';
import { connect } from 'react-redux';
import {
  strictValidObjectWithKeys,
  strictValidString,
} from '../../utils/common-utils';
const focusOnErrors = createDecorator();

const pocGoogle = ({ locData }) => {
  return (
    <Box>
      <Form
        onSubmit={() => {}}
        decorators={[focusOnErrors]}
        mutators={{
          // potentially other mutators could be merged here
          ...arrayMutators,
        }}
        keepDirtyOnReinitialize
        validate={(values) => {
          const errors = {};
          return errors;
        }}
        initialValues={{
          poc: '',
        }}
        render={({
          handleSubmit,
          pristine,
          values,
          submitting,
          touched,
          errors,
          valid,
          form,
        }) => {
          return (
            <Box sx={{ ml: 5 }}>
              <Grid
                container
                spacing={{
                  xs: 2,
                  md: 4,
                }}
                columns={{
                  xs: 4,
                  sm: 4,
                  md: 12,
                }}
              >
                <Grid item xs={3} sm={2} md={3}>
                  <Field
                    id="trip_add_trip_pickup_location"
                    name="trip_pickup_location"
                  >
                    {({ meta, input }) => (
                      <div>
                        <GoogleMapsPoc
                          {...input}
                          label={'Search Location'}
                          defaultValue={input.value}
                          setResults={(e) => {}}
                          selectOption={async (v) => {}}
                          onBlur={(e) => {
                            input.onBlur(e.target.value);
                          }}
                          isSetLatLong={true}
                          setLatLong={(e) => {}}
                        />
                      </div>
                    )}
                  </Field>
                </Grid>
              </Grid>
              <Box sx={{ mt: 5 }}>
                {strictValidObjectWithKeys(locData) ? (
                  <>
                    <Typography style={{ fontSize: 22, fontWeight: 600 }}>
                      We are using these keys in PU & DO Location
                    </Typography>
                    <Typography style={{ fontSize: 20, fontWeight: 400 }}>
                      Full Address:{' '}
                      {strictValidString(locData.fullAddress)
                        ? locData.fullAddress
                        : 'N/A'}
                    </Typography>
                    <Typography style={{ fontSize: 20, fontWeight: 400 }}>
                      Latitude: {locData.latitude}
                    </Typography>
                    <Typography style={{ fontSize: 20, fontWeight: 400 }}>
                      Longitude: {locData.longitude}
                    </Typography>
                    <Typography style={{ fontSize: 20, fontWeight: 400 }}>
                      Zip Code:{' '}
                      {strictValidString(locData.zip) ? locData.zip : 'N/A'}
                    </Typography>
                    <Typography
                      style={{ fontSize: 22, fontWeight: 600, marginTop: 10 }}
                    >
                      These keys is just for info
                    </Typography>
                    <Typography style={{ fontSize: 20, fontWeight: 400 }}>
                      City:{' '}
                      {strictValidString(locData.city) ? locData.city : 'N/A'}
                    </Typography>
                    <Typography style={{ fontSize: 20, fontWeight: 400 }}>
                      Country:{' '}
                      {strictValidString(locData.country)
                        ? locData.country
                        : 'N/A'}
                    </Typography>
                    <Typography style={{ fontSize: 20, fontWeight: 400 }}>
                      Locality:{' '}
                      {strictValidString(locData.locality)
                        ? locData.locality
                        : 'N/A'}
                    </Typography>
                    <Typography style={{ fontSize: 20, fontWeight: 400 }}>
                      State:{' '}
                      {strictValidString(locData.state) ? locData.state : 'N/A'}
                    </Typography>
                  </>
                ) : (
                  <></>
                )}
              </Box>
            </Box>
          );
        }}
      />
    </Box>
  );
};
const mapStateProps = (state) => {
  return {
    locData: state.pocReducer.getLocation.locations,
  };
};

export default connect(mapStateProps, null)(pocGoogle);

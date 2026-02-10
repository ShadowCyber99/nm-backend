import React from 'react';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { Divider, Grid, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  AccountImage,
  ContactImage,
  DestinationLine,
  DropOffImage,
  PatientImage,
  PickupImage,
  WarningIcon,
} from '../../../assets/icons';
import {
  dobFormatTime,
  formatDateTime,
  strictValidArrayWithLength,
  strictValidNumber,
  strictValidObject,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/common-utils';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  bottomBar: {
    top: 'auto',
    bottom: 0,
    background: '#fff',
  },
  margin: {
    marginLeft: theme.spacing(1),
  },
  alignRight: {
    textAlign: 'right',
    display: 'block',
    width: '100%',
  },
  backDrop: {
    backgroundColor: 'rgba(235, 235, 235, 0.7)',
  },
  header: {
    width: 160,
    marginTop: theme.spacing(0.5),
  },
  headerDetails: {
    width: 140,
  },
  marginLeft: {
    margin: theme.spacing(0, 0, 0, 1),
  },
  subtitle: {
    width: 260,
    marginTop: theme.spacing(0.5),
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const TransitionNormal = React.forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />;
});

const ReviewDialog = ({
  children,
  isOpen,
  handleClose,
  title,
  fullScreen = true,
  maxWidth,
  fullWidth,
  header = true,
  transition = true,
  style,
  overlayStyle,
  className,
  data,
  ...rest
}) => {
  const classes = useStyles();
  const renderAccountDetails = () => {
    return (
      <Box>
        <Stack direction="row" alignItems={'center'}>
          <AccountImage />
          <Typography className={classes.marginLeft} variant="h2">
            Account :{' '}
          </Typography>
        </Stack>
        <Box ml={4} mt={1}>
          <Stack direction="row">
            <Typography className={classes.headerDetails}>Name</Typography>
            <Typography>
              {strictValidObject(data) ? data.corporate_account.name : ''}
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography className={classes.headerDetails}>
              Billing Address
            </Typography>
            <Typography sx={{ width: 210 }}>
              {strictValidObject(data) ? data.corporate_account.address : ''}
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography className={classes.headerDetails}>
              ER Phone Number
            </Typography>
            <Typography>
              {strictValidObjectWithKeys(data) ? data.hospital_phone : ''}
            </Typography>
          </Stack>
          {strictValidArrayWithLength(data.trip_account_field) &&
            data.trip_account_field.map((a) => {
              return (
                <Box>
                  {a.ui_section === 'account' && (
                    <Stack direction="row">
                      <Typography className={classes.headerDetails}>
                        {a.label}
                      </Typography>
                      <Typography>
                        {' '}
                        {strictValidObjectWithKeys(data) &&
                        strictValidString(data.cost_center_name)
                          ? data.cost_center_name
                          : a.default_value}
                      </Typography>
                    </Stack>
                  )}
                </Box>
              );
            })}
        </Box>
      </Box>
    );
  };

  const renderContactDetails = () => {
    return (
      <Box>
        <Stack direction="row" alignItems={'center'}>
          <ContactImage />
          <Typography className={classes.marginLeft} variant="h2">
            Contact :
          </Typography>
        </Stack>
        <Box ml={4} mt={1}>
          <Stack direction="row">
            <Typography className={classes.headerDetails}>Name</Typography>
            <Typography>
              {strictValidArrayWithLength(data.company_contact)
                ? data.company_contact[0].last_name +
                  ', ' +
                  data.company_contact[0].first_name
                : 'N/A'}
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography className={classes.headerDetails}>
              Phone Number
            </Typography>
            <Typography>
              {strictValidArrayWithLength(data.company_contact) &&
              strictValidString(data.company_contact[0].phone_number[0])
                ? data.company_contact[0].phone_number[0]
                : 'N/A'}
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography className={classes.headerDetails}>Email</Typography>
            <Typography>
              {strictValidArrayWithLength(data.company_contact)
                ? strictValidString(data.company_contact[0].email_id) &&
                  data.company_contact[0].email_id !== 'null'
                  ? data.company_contact[0].email_id
                  : 'N/A'
                : 'N/A'}
            </Typography>
          </Stack>
          {strictValidArrayWithLength(data.trip_account_field) &&
            data.trip_account_field.map((a) => {
              return (
                <Box>
                  {a.ui_section === 'contact' && (
                    <Stack direction="row">
                      <Typography className={classes.headerDetails}>
                        {a.label}
                      </Typography>
                      <Typography> {a.default_value}</Typography>
                    </Stack>
                  )}
                </Box>
              );
            })}
        </Box>
      </Box>
    );
  };
  const renderPickupLocation = () => {
    return (
      <Box>
        <Stack direction="row" alignItems={'center'}>
          <PickupImage />
          <Typography className={classes.marginLeft} variant="h2">
            Pick Up Location :
          </Typography>
        </Stack>
        <Box ml={4} mt={1}>
          <Stack direction="row">
            <Typography className={classes.headerDetails}>Address</Typography>
            <Typography sx={{ width: 180 }}>
              {data.trip_pickup_location}
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography className={classes.headerDetails}>
              Date and Time
            </Typography>
            <Typography className={classes.headerDetails}>
              {formatDateTime(data.pick_up_date_time)}
            </Typography>
          </Stack>
        </Box>
      </Box>
    );
  };

  const renderPatientDetails = () => {
    return (
      <Box>
        <Stack direction="row" alignItems={'center'}>
          <PatientImage />
          <Typography className={classes.marginLeft} variant="h2">
            Patient :
          </Typography>
        </Stack>
        <Box ml={4} mt={1}>
          <Stack direction="row">
            <Typography className={classes.headerDetails}>Name</Typography>
            <Typography>
              {strictValidObjectWithKeys(data)
                ? data.base_patient.first_name +
                  ' ' +
                  data.base_patient.last_name
                : ''}
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography className={classes.headerDetails}>
              Date Of Birth
            </Typography>
            <Typography>
              {strictValidObjectWithKeys(data)
                ? dobFormatTime(data.base_patient.dob)
                : ''}
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography className={classes.headerDetails}>
              Phone Number
            </Typography>
            <Typography>
              {strictValidObjectWithKeys(data) &&
              strictValidString(data.base_patient.phone)
                ? data.base_patient.phone
                : 'N/A'}
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography className={classes.headerDetails}>Email</Typography>
            <Typography>
              {strictValidObjectWithKeys(data) &&
              strictValidString(data.base_patient.email_id)
                ? data.base_patient.email_id
                : 'N/A'}
            </Typography>
          </Stack>
          {strictValidArrayWithLength(data.trip_account_field) &&
            data.trip_account_field.map((a) => {
              return (
                <Box>
                  {a.ui_section === 'patient' && (
                    <Stack direction="row">
                      <Typography className={classes.headerDetails}>
                        {a.label}
                      </Typography>
                      <Typography> {a.default_value}</Typography>
                    </Stack>
                  )}
                </Box>
              );
            })}
        </Box>
      </Box>
    );
  };
  const renderDropOffLocation = () => {
    return (
      <Box>
        <Stack direction="row" alignItems={'center'}>
          <DropOffImage />
          <Typography className={classes.marginLeft} variant="h2">
            Drop Off Location :
          </Typography>
        </Stack>
        <Box ml={4} mt={1}>
          <Stack direction="row">
            <Typography className={classes.headerDetails}>Address</Typography>
            <Typography sx={{ width: 180 }}>
              {data.trip_dropoff_location}
            </Typography>
          </Stack>
        </Box>
      </Box>
    );
  };
  return (
    <Dialog
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      open={isOpen}
      maxWidth={maxWidth}
      // onClose={handleClose}
      TransitionComponent={transition ? Transition : TransitionNormal}
      style={style}
      className={className}
      BackdropProps={{
        classes: {
          root: classes.backDrop,
        },
      }}
      {...rest}
    >
      {strictValidObjectWithKeys(data) && (
        <Box m={3} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={3} md={3} lg={3}>
              <Box>
                <Box
                  my={2}
                  sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                  }}
                >
                  <WarningIcon />
                  <Typography className={classes.marginLeft} variant="h1">
                    Transport details
                  </Typography>
                </Box>
                <Stack direction="row">
                  <Typography variant="h2">
                    Planned trip Information{' '}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography className={classes.header}>Trip ID</Typography>
                  <Typography className={classes.subtitle} variant="h3">
                    {data.leg_id}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography className={classes.header}>PU Time</Typography>
                  <Typography className={classes.subtitle}>
                    {' '}
                    {formatDateTime(data.pick_up_date_time)}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography className={classes.header}>PU </Typography>
                  <Typography className={classes.subtitle}>
                    {' '}
                    {data.trip_pickup_location}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography className={classes.header}>
                    Stairs at PU
                  </Typography>
                  <Typography className={classes.subtitle}>
                    {data.pick_up_stairs}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography className={classes.header}>
                    Room Number at PU
                  </Typography>
                  <Typography className={classes.subtitle}>
                    {strictValidObjectWithKeys(data.base_patient)
                      ? data.base_patient.room_no
                      : 'N/A'}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography className={classes.header}>DO </Typography>
                  <Typography className={classes.subtitle}>
                    {data.trip_dropoff_location}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography className={classes.header}>
                    Stairs at DO
                  </Typography>
                  <Typography className={classes.subtitle}>
                    {data.drop_off_stairs}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography className={classes.header}>
                    Room Number at DO
                  </Typography>
                  <Typography className={classes.subtitle}>
                    {strictValidObjectWithKeys(data.base_patient)
                      ? data.base_patient.drop_off_room_no
                      : 'N/A'}
                  </Typography>
                </Stack>

                <Stack direction="row">
                  <Typography className={classes.header}>Patient </Typography>
                  <Typography className={classes.subtitle}>
                    {strictValidObjectWithKeys(data)
                      ? data.base_patient.first_name +
                        ' ' +
                        data.base_patient.last_name
                      : ''}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography className={classes.header}>DOB </Typography>
                  <Typography className={classes.subtitle}>
                    {strictValidObjectWithKeys(data)
                      ? dobFormatTime(data.base_patient.dob)
                      : ''}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography className={classes.header}>PT Phone </Typography>
                  <Typography className={classes.subtitle}>
                    {strictValidObjectWithKeys(data)
                      ? strictValidString(data.base_patient.phone)
                        ? data.base_patient.phone
                        : 'N/A'
                      : ''}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography className={classes.header}>PT Weight </Typography>
                  <Typography className={classes.subtitle}>
                    {strictValidObjectWithKeys(data)
                      ? strictValidString(data.base_patient.weight)
                        ? data.base_patient.weight_in === 'KG'
                          ? `${data.base_patient.weight / 2.205} KG`
                          : `${data.base_patient.weight} LBS`
                        : 'N/A'
                      : ''}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography className={classes.header}>Oxygen </Typography>
                  <Typography className={classes.subtitle}>
                    {strictValidNumber(data.base_patient.oxygen)
                      ? `${data.base_patient.oxygen} L`
                      : 'N/A'}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography className={classes.header}>
                    Ride Along{' '}
                  </Typography>
                  <Typography className={classes.subtitle}>
                    {strictValidNumber(data.base_patient.ride_along_person)
                      ? data.base_patient.ride_along_person
                      : 'N/A'}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography className={classes.header}>
                    Transport Mode
                  </Typography>
                  <Typography className={classes.subtitle}>
                    <Stack direction="row">
                      <Typography className={classes.header}>
                        {data.capability_name}
                      </Typography>
                    </Stack>
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography className={classes.header}>
                    Clarification
                  </Typography>
                  <Typography className={classes.subtitle}>
                    {strictValidString(data.capability_clarification)
                      ? data.capability_clarification
                      : 'N/A'}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography className={classes.header}>
                    Special Instructions
                  </Typography>
                  <Typography className={classes.subtitle}>
                    {strictValidObjectWithKeys(data) &&
                    strictValidObjectWithKeys(data.base_patient) &&
                    strictValidString(data.base_patient.description)
                      ? data.base_patient.description
                      : 'N/A'}
                  </Typography>
                </Stack>
                {strictValidArrayWithLength(data.trip_account_field) &&
                  data.trip_account_field.map((a) => {
                    return (
                      <Box>
                        {a.ui_section === 'transport_detail' && (
                          <Stack direction="row">
                            <Typography className={classes.headerDetails}>
                              {a.label}
                            </Typography>
                            <Typography> {a.default_value}</Typography>
                          </Stack>
                        )}
                      </Box>
                    );
                  })}
              </Box>
            </Grid>
            <Grid item xs={0.2}>
              <Divider orientation="vertical" variant="middle" />
            </Grid>

            <Grid item xs={8}>
              <Stack
                mt={2}
                px={2}
                direction="row"
                justifyContent="space-between"
              >
                {renderAccountDetails()}
                {renderContactDetails()}
                <Box>
                  <Typography></Typography>
                </Box>
              </Stack>
              <Stack mt={6} mb={3} px={2} direction="row" alignItems="center">
                <DestinationLine />
              </Stack>

              <Stack px={2} direction="row" justifyContent="space-between">
                {renderPickupLocation()}
                {renderPatientDetails()}
                {renderDropOffLocation()}
              </Stack>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-start"
              item
              xs={0.8}
              md={0.8}
              lg={0.8}
            >
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      )}
      <Divider variant="middle" />
      <Box m={3}>{children}</Box>
    </Dialog>
  );
};

export default ReviewDialog;

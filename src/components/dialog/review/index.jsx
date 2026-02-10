import React from 'react';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { Divider, Grid, IconButton, Stack } from '@mui/material';
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
  strictFindObjectWithKey,
  strictValidArrayWithLength,
  strictValidNumber,
  strictValidObjectWithKeys,
  strictValidString,
  validObjectWithParameterKeys,
} from '../../../utils/common-utils';
import CloseIcon from '@mui/icons-material/Close';
import { connect } from 'react-redux';
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
    overflowWrap: 'anywhere',
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
  saved,
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
  let contact_data = {};
  if (strictValidArrayWithLength(data.emailArray)) {
    if (
      strictValidArrayWithLength(data.new_corporate_contact) &&
      data.new_corporate_contact[0] &&
      data.new_corporate_contact[0].first_name
    ) {
      contact_data = data.new_corporate_contact[0];
    } else {
      contact_data = strictFindObjectWithKey(
        data.emailArray,
        'value',
        data.corporate_contact[0].corporate_contact_id,
      );
      contact_data.first_name = data.corporate_contact[0].first_name;
    }
  }

  const renderAccountDetails = () => {
    return (
      <Box>
        <Stack direction="row" alignItems={'center'}>
          <AccountImage />
          <Typography className={classes.marginLeft} variant="h2">
            Account :
          </Typography>
        </Stack>
        <Box ml={4} mt={1}>
          <Stack direction="row">
            <Typography className={classes.headerDetails}>Name</Typography>
            <Typography>{data.hospital_name}</Typography>
          </Stack>
          <Stack direction="row">
            <Typography className={classes.headerDetails}>
              Billing Address
            </Typography>
            <Typography sx={{ width: 210 }}>{data.hospital_address}</Typography>
          </Stack>
          <Stack direction="row">
            <Typography className={classes.headerDetails}>
              ER Phone Number
            </Typography>
            <Typography>{data.hospital_phone}</Typography>
          </Stack>
          {strictValidObjectWithKeys(data) &&
            strictValidObjectWithKeys(data.trip_ui_section_field) &&
            strictValidArrayWithLength(
              data.trip_ui_section_field.ui_section_account,
            ) &&
            data.trip_ui_section_field.ui_section_account.map((a) => {
              return (
                <Stack direction="row">
                  <Typography className={classes.headerDetails}>
                    {a.label}
                  </Typography>
                  {strictValidObjectWithKeys(a) && a.type === 'enum' ? (
                    strictValidObjectWithKeys(saved) && (
                      <>
                        <Typography>{saved.cost_center_name}</Typography>
                      </>
                    )
                  ) : (
                    <Typography> {a.default_value}</Typography>
                  )}
                </Stack>
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
              {strictValidObjectWithKeys(data)
                ? data.corporate_contact_name
                : 'N/A'}
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography className={classes.headerDetails}>
              Phone Number
            </Typography>
            <Typography>
              {strictValidObjectWithKeys(contact_data) &&
              strictValidString(contact_data.phone_number[0])
                ? contact_data.phone_number[0]
                : 'N/A'}
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography className={classes.headerDetails}>Email</Typography>
            <Typography>
              {strictValidObjectWithKeys(contact_data)
                ? strictValidString(contact_data.email_id) &&
                  contact_data.email_id !== 'null'
                  ? contact_data.email_id
                  : 'N/A'
                : 'N/A'}
            </Typography>
          </Stack>
          {strictValidObjectWithKeys(data) &&
            strictValidObjectWithKeys(data.trip_ui_section_field) &&
            strictValidArrayWithLength(
              data.trip_ui_section_field.ui_section_contact,
            ) &&
            data.trip_ui_section_field.ui_section_contact.map((a) => {
              return (
                <Stack direction="row">
                  <Typography className={classes.headerDetails}>
                    {a.label}
                  </Typography>
                  <Typography> {a.default_value}</Typography>
                </Stack>
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
              {data.pick_up_date_time}
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
            <Typography>{data.first_name + ' ' + data.last_name}</Typography>
          </Stack>
          <Stack direction="row">
            <Typography className={classes.headerDetails}>
              Date Of Birth
            </Typography>
            <Typography>{dobFormatTime(data.dob)}</Typography>
          </Stack>
          <Stack direction="row">
            <Typography className={classes.headerDetails}>
              Phone Number
            </Typography>
            <Typography>
              {strictValidString(data.phone) ? data.phone : 'N/A'}
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography className={classes.headerDetails}>Email</Typography>
            <Typography>
              {strictValidString(data.email_id) ? data.email_id : 'N/A'}
            </Typography>
          </Stack>
          {strictValidObjectWithKeys(data) &&
            strictValidObjectWithKeys(data.trip_ui_section_field) &&
            strictValidArrayWithLength(
              data.trip_ui_section_field.ui_section_patient,
            ) &&
            data.trip_ui_section_field.ui_section_patient.map((a) => {
              return (
                <Stack direction="row">
                  <Typography className={classes.headerDetails}>
                    {a.label}
                  </Typography>
                  <Typography> {a.default_value}</Typography>
                </Stack>
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
                  Trip details
                </Typography>
              </Box>
              <Stack direction="row">
                <Typography variant="h2">Planned trip Information </Typography>
              </Stack>
              <Stack direction="row">
                <Typography className={classes.header}>Trip ID</Typography>
                <Typography className={classes.subtitle} variant="h3">
                  {data.leg_id}
                </Typography>
              </Stack>
              <Stack direction="row">
                <Typography className={classes.header}>PU Time </Typography>
                <Typography className={classes.subtitle}>
                  {data.pick_up_date_time}
                </Typography>
              </Stack>
              <Stack direction="row">
                <Typography className={classes.header}>PU </Typography>
                <Typography className={classes.subtitle}>
                  {data.trip_pickup_location}
                </Typography>
              </Stack>
              <Stack direction="row">
                <Typography className={classes.header}>Stairs at PU</Typography>
                <Typography className={classes.subtitle}>
                  {data.pick_up_stairs}
                </Typography>
              </Stack>
              <Stack direction="row">
                <Typography className={classes.header}>
                  Room Number at PU
                </Typography>
                <Typography className={classes.subtitle}>
                  {data.room_no || 'N/A'}
                </Typography>
              </Stack>

              <Stack direction="row">
                <Typography className={classes.header}>DO </Typography>
                <Typography className={classes.subtitle}>
                  {data.trip_dropoff_location}
                </Typography>
              </Stack>
              <Stack direction="row">
                <Typography className={classes.header}>Stairs at DO</Typography>
                <Typography className={classes.subtitle}>
                  {data.drop_off_stairs}
                </Typography>
              </Stack>
              <Stack direction="row">
                <Typography className={classes.header}>
                  Room Number at DO
                </Typography>
                <Typography className={classes.subtitle}>
                  {data.drop_off_room_no || 'N/A'}
                </Typography>
              </Stack>
              <Stack direction="row">
                <Typography className={classes.header}>Miles </Typography>
                <Typography className={classes.subtitle}>
                  {data.distance}
                </Typography>
              </Stack>

              <Stack direction="row">
                <Typography className={classes.header}>Patient </Typography>
                <Typography className={classes.subtitle}>
                  {data.first_name + ' ' + data.last_name}
                </Typography>
              </Stack>
              <Stack direction="row">
                <Typography className={classes.header}>DOB </Typography>
                <Typography className={classes.subtitle}>
                  {dobFormatTime(data.dob)}
                </Typography>
              </Stack>
              <Stack direction="row">
                <Typography className={classes.header}> PT Phone </Typography>
                <Typography className={classes.subtitle}>
                  {data.phone || 'N/A'}
                </Typography>
              </Stack>
              <Stack direction="row">
                <Typography className={classes.header}>PT Weight </Typography>
                <Typography className={classes.subtitle}>
                  {strictValidObjectWithKeys(data)
                    ? `${data.weight}  ${data.weight_in}`
                    : 'N/A'}
                </Typography>
              </Stack>
              <Stack direction="row">
                <Typography className={classes.header}>Oxygen </Typography>
                <Typography className={classes.subtitle}>
                  {validObjectWithParameterKeys(data, ['oxygen'])
                    ? `${data.oxygen} L`
                    : 'N/A'}
                </Typography>
              </Stack>
              <Stack direction="row">
                <Typography className={classes.header}>Ride Along </Typography>
                <Typography className={classes.subtitle}>
                  {strictValidNumber(data.ride_along_person)
                    ? data.ride_along_person
                    : strictValidString(data.ride_along_person) &&
                      data.ride_along_person}
                </Typography>
              </Stack>
              <Stack direction="row">
                <Typography className={classes.header}>
                  Transport Mode
                </Typography>
                <Typography className={classes.subtitle}>
                  <Stack direction="row">
                    {strictValidString(data.capability_name)
                      ? data.capability_name
                      : 'N/A'}
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
                  <Stack direction="row">
                    {strictValidString(data.description)
                      ? data.description
                      : 'N/A'}
                  </Stack>
                </Typography>
              </Stack>
              {strictValidObjectWithKeys(data) &&
                strictValidObjectWithKeys(data.trip_ui_section_field) &&
                strictValidArrayWithLength(
                  data.trip_ui_section_field.ui_section_transport,
                ) &&
                data.trip_ui_section_field.ui_section_transport.map((a) => {
                  return (
                    <Stack direction="row">
                      <Typography className={classes.header}>
                        {a.label}
                      </Typography>
                      <Typography className={classes.subtitle}>
                        {a.default_value}
                      </Typography>
                    </Stack>
                  );
                })}
              <Box pt={2}>
                {/* <Typography>
                  The billable acount is {data.hospital_name}.
                </Typography> */}
              </Box>
            </Box>
          </Grid>
          <Grid item>
            <Divider orientation="vertical" variant="middle" />
          </Grid>

          <Grid item xs={8} md={8} lg={8}>
            <Stack mt={2} px={2} direction="row" justifyContent="space-between">
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
      <Divider variant="middle" />
      <Box m={3}>{children}</Box>
    </Dialog>
  );
};

const mapStateProps = (state) => {
  return {
    saved: state.trip.allTrips.saved_item,
  };
};

export default connect(mapStateProps, null)(ReviewDialog);

// export default ReviewDialog;

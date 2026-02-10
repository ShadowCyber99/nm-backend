import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useMemo, useState } from 'react';
import {
  convertToPounds,
  dobFormatTime,
  formatDate,
  formatDateTime,
  strictValidArrayWithLength,
  strictValidNumber,
  strictValidObjectWithKeys,
  strictValidString,
  validValue,
} from '../../../utils/common-utils';
import { makeStyles } from '@mui/styles';
import CellTypes from '../../../components/react-table/components/renderTypes';
import MDTooltip from '../../../components/tooltip';
import ReactTable from '../../../components/react-table';
import { connect } from 'react-redux';
import { generateTripTypes, transportStatus } from '../../../utils/constant';
import { toNumber } from 'lodash';
import { getTripLogs } from '../action';

const useStyles = makeStyles((theme) => ({
  generalMargin: {
    margin: theme.spacing(2, 0),
  },
  margin: {
    margin: theme.spacing(0.5, 0, 0),
  },
  defineWidth: {
    width: 250,
    margin: theme.spacing(0, 1),
  },
  bottomMargin: {
    padding: theme.spacing(0.5, 0, 1),
    margin: theme.spacing(0, 1),
  },
  marginHorizontal: {
    margin: theme.spacing(0, 1),
  },
  accordion: {
    border: '1px solid #00000018',
    borderBottom: 'unset',
  },
}));

const TripInfoBilling = ({
  data,
  tripLogs,
  isLoad,
  callGetTripLogs,
  logLoad,
}) => {
  const classes = useStyles();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAccordionChange = (event, expanded) => {
    setIsExpanded(expanded);

    if (expanded) {
      const legId = {
        leg_id: data.leg_id,
      };
      callGetTripLogs(legId);
    }
  };
  const renderTitleWithSpace = (title) => {
    return (
      <Box className={classes.defineWidth}>
        <Typography variant="headerTitle">{title}</Typography>
      </Box>
    );
  };
  const renderSubtitleWithSpace = (
    subtitle,
    numberOfLines = 3,
    tooltip = false,
  ) => {
    return (
      <Box className={classes.defineWidth}>
        {tooltip ? (
          <MDTooltip title={subtitle}>
            <Typography
              sx={
                numberOfLines && {
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: numberOfLines,
                }
              }
              className={classes.margin}
            >
              {strictValidString(subtitle) || strictValidNumber(subtitle)
                ? subtitle
                : 'N/A'}
            </Typography>
          </MDTooltip>
        ) : (
          <Typography
            sx={
              numberOfLines && {
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: numberOfLines,
              }
            }
            className={classes.margin}
          >
            {strictValidString(subtitle) || strictValidNumber(subtitle)
              ? subtitle
              : 'N/A'}
          </Typography>
        )}
      </Box>
    );
  };

  const tripLogsData = useMemo(
    () => getOnlyUpdatedTripLogs(tripLogs),
    [tripLogs],
  );

  return (
    <Box>
      {strictValidObjectWithKeys(data) && (
        <React.Fragment>
          <Stack mt={2} direction={'row'} display="flex">
            <Box>
              {renderTitleWithSpace('Account')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data.corporate_account) &&
                  data.corporate_account.name,
              )}
            </Box>
            <Box direction={'row'} display="flex">
              {strictValidArrayWithLength(data.trip_account_field) &&
                data.trip_account_field.map((a) => {
                  return (
                    <Box>
                      {a.ui_section === 'account' &&
                        strictValidObjectWithKeys(data) &&
                        data.account_field_id !== 0 && (
                          <>
                            {renderTitleWithSpace(a.label)}
                            {a.type === 'enum'
                              ? renderSubtitleWithSpace(data.cost_center_name)
                              : renderSubtitleWithSpace(a.default_value)}
                          </>
                        )}
                    </Box>
                  );
                })}
            </Box>
          </Stack>
          <Divider className={classes.generalMargin} />
          {/* Company Contacts */}
          <Box className={classes.bottomMargin}>
            <Typography variant="headerMainTitle">Contacts</Typography>
          </Box>
          {strictValidArrayWithLength(data.company_contact) &&
            data.company_contact.map((contact) => {
              return (
                <Stack mt={2} direction={'row'} display="flex">
                  <Box>
                    {renderTitleWithSpace('First Name')}
                    {renderSubtitleWithSpace(contact.first_name)}
                  </Box>

                  <Box>
                    {renderTitleWithSpace('Last Name')}
                    {renderSubtitleWithSpace(contact.last_name)}
                  </Box>
                  <Box>
                    {renderTitleWithSpace('Phone Number')}
                    {renderSubtitleWithSpace(contact.phone_number[0])}
                  </Box>
                  <Box>
                    {renderTitleWithSpace('Email')}
                    {renderSubtitleWithSpace(
                      contact.email_id === 'null' ||
                        contact.email_id === 'undefined'
                        ? 'N/A'
                        : contact.email_id,
                    )}
                  </Box>
                </Stack>
              );
            })}
          <Box mt={2} direction={'row'} display="flex">
            {strictValidArrayWithLength(data.trip_account_field) &&
              data.trip_account_field.map((a) => {
                return (
                  <Box>
                    {a.ui_section === 'contact' && (
                      <>
                        {renderTitleWithSpace(a.label)}
                        {renderSubtitleWithSpace(a.default_value)}
                      </>
                    )}
                  </Box>
                );
              })}
          </Box>
          <Divider className={classes.generalMargin} />
          {/* Patient Details */}
          <Box className={classes.bottomMargin}>
            <Typography variant="headerMainTitle">Patient</Typography>
          </Box>
          <Stack mt={2} direction={'row'} display="flex">
            <Box>
              {renderTitleWithSpace('First Name')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data.base_patient) &&
                  data.base_patient.first_name,
              )}
            </Box>

            <Box>
              {renderTitleWithSpace('Last Name')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data.base_patient) &&
                  data.base_patient.last_name,
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('Date Of Birth')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data.base_patient) &&
                  dobFormatTime(data.base_patient.dob),
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('Phone Number')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data.base_patient) &&
                  data.base_patient.phone,
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('Email')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data.base_patient) &&
                  data.base_patient.email_id !== 'null'
                  ? data.base_patient.email_id
                  : 'N/A',
              )}
            </Box>
          </Stack>
          <Stack mt={3} direction={'row'} display="flex">
            <Box>
              {renderTitleWithSpace('Weight')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data.base_patient) &&
                  data.base_patient.weight_in === 'KG'
                  ? toNumber(data.base_patient.weight) / 2.205 +
                      ' ' +
                      data.base_patient.weight_in
                  : data.base_patient.weight +
                      ' ' +
                      data.base_patient.weight_in,
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('Oxygen')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data.base_patient) &&
                  data.base_patient.oxygen + ' L',
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('Ride Along')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data.base_patient) &&
                  data.base_patient.ride_along_person,
              )}
            </Box>
            <Box direction={'row'} display="flex">
              {strictValidArrayWithLength(data.trip_account_field) &&
                data.trip_account_field.map((a) => {
                  return (
                    <Box>
                      {a.ui_section === 'patient' && (
                        <>
                          {renderTitleWithSpace(a.label)}
                          {renderSubtitleWithSpace(a.default_value)}
                        </>
                      )}
                    </Box>
                  );
                })}
            </Box>
          </Stack>
          <Divider className={classes.generalMargin} />
          {/* Transport Details */}
          <Box className={classes.bottomMargin}>
            <Typography variant="headerMainTitle">Transport Details</Typography>
          </Box>
          <Stack mt={2} direction={'row'} display="flex">
            <Box>
              {renderTitleWithSpace('Transport Mode')}
              <Box className={classes.defineWidth}>
                {strictValidArrayWithLength(data.capability_id) && (
                  <CellTypes
                    type="capability_role"
                    value={
                      strictValidArrayWithLength(data.capability_id) &&
                      data.capability_id.toString()
                    }
                  />
                )}
              </Box>
            </Box>
            <Box>
              {renderTitleWithSpace('Clarifications')}
              {renderSubtitleWithSpace(data.capability_clarification)}
            </Box>
            <Box>
              {renderTitleWithSpace('Special Instructions')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data.base_patient) &&
                  data.base_patient.description,
                3,
                true,
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('Miles')}
              {renderSubtitleWithSpace(
                strictValidString(data.distance) ? data.distance : 'N/A',
              )}
            </Box>
            <Box>
              {strictValidString(data.non_billable_reason) &&
                renderTitleWithSpace('Non Billable Reason')}
              {strictValidString(data.non_billable_reason) &&
                renderSubtitleWithSpace(
                  strictValidString(data.non_billable_reason) &&
                    data.non_billable_reason,
                  3,
                  true,
                )}
            </Box>
          </Stack>
          <Stack mt={3} direction={'row'} display="flex">
            <Box>
              {renderTitleWithSpace('PU Date Time')}
              {renderSubtitleWithSpace(
                (formatDateTime(data.estimated_end_time) === 'N/A' &&
                  !data.completed) ||
                  (formatDateTime(data.estimated_end_time) === 'Invalid date' &&
                    !data.completed)
                  ? formatDate(data.pick_up_date_time)
                  : formatDateTime(data.pick_up_date_time),
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('PU Location')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data.base_patient) &&
                  data.trip_pickup_location,
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('PU ZIP')}
              {renderSubtitleWithSpace(
                strictValidString(data.pu_zipcode) ? data.pu_zipcode : 'N/A',
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('DO Location')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data.base_patient) &&
                  data.trip_dropoff_location,
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('DO ZIP')}
              {renderSubtitleWithSpace(
                strictValidString(data.do_zipcode) ? data.do_zipcode : 'N/A',
              )}
            </Box>
          </Stack>
          <Stack mt={3} direction={'row'} display="flex">
            <Box>
              {renderTitleWithSpace('Stairs at PU')}
              {renderSubtitleWithSpace(data.pick_up_stairs)}
            </Box>
            <Box>
              {renderTitleWithSpace('Room Number at PU')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data.base_patient) &&
                  data.base_patient.room_no,
              )}
            </Box>
            <Box>{renderTitleWithSpace('')}</Box>
            <Box>
              {renderTitleWithSpace('Stairs at DO')}
              {renderSubtitleWithSpace(data.drop_off_stairs)}
            </Box>
            <Box>
              {renderTitleWithSpace('Room number at DO')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data.base_patient) &&
                  data.base_patient.drop_off_room_no,
              )}
            </Box>
          </Stack>
          <Box mt={2} direction={'row'} display="flex">
            {strictValidArrayWithLength(data.trip_account_field) &&
              data.trip_account_field.map((a) => {
                return (
                  <Box>
                    {a.ui_section === 'transport_detail' && (
                      <>
                        {renderTitleWithSpace(a.label)}
                        {renderSubtitleWithSpace(a.default_value)}
                      </>
                    )}
                  </Box>
                );
              })}
          </Box>
          <Divider className={classes.generalMargin} />
          <Box mt={2}>
            <Accordion
              onChange={handleAccordionChange}
              expanded={isExpanded}
              className={classes.accordion}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="trip-logs"
                id="trip-logs"
              >
                {renderTitleWithSpace('Trip Logs')}
              </AccordionSummary>
              <AccordionDetails>
                {logLoad ? (
                  <>
                    <Box
                      sx={{
                        display: 'flex',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  </>
                ) : tripLogsData.length > 0 ? (
                  <ReactTable
                    globalFilterShow={false}
                    customHeight={true}
                    headerFilter={false}
                    tableSize={true}
                    loading={isLoad}
                    pagination={false}
                    height={{
                      minHeight: 100,
                      maxheight: 100,
                      overfleow: 'scroll',
                    }}
                    customText="No Trip Logs Found"
                    columnDefs={[
                      {
                        Header: 'Timestamp',
                        accessor: (originalRow, rowIndex) => {
                          return (
                            strictValidObjectWithKeys(originalRow) &&
                            originalRow.timestamp
                          );
                        },
                        width: 50,
                        Cell: (props) => (
                          <>
                            <Typography>
                              {props.row.original.timestamp}
                            </Typography>
                          </>
                        ),
                      },
                      {
                        Header: 'User',
                        accessor: (originalRow, rowIndex) => {
                          return (
                            strictValidObjectWithKeys(originalRow) &&
                            originalRow.user_name
                          );
                        },
                        width: 110,
                        Cell: (props) => (
                          <>
                            <Typography>
                              {props.row.original.user_name}
                            </Typography>
                          </>
                        ),
                      },
                      {
                        Header: 'Attribute',
                        accessor: (originalRow, rowIndex) => {
                          return (
                            strictValidObjectWithKeys(originalRow) &&
                            originalRow.attribute
                          );
                        },
                        width: 100,
                        Cell: (props) => (
                          <>
                            <MDTooltip title={props.row.original.attribute}>
                              <Typography>
                                {props.row.original.attribute}
                              </Typography>
                            </MDTooltip>
                          </>
                        ),
                      },
                      {
                        Header: 'Old Value',
                        accessor: (originalRow, rowIndex) => {
                          return (
                            strictValidObjectWithKeys(originalRow) &&
                            originalRow.oldValue
                          );
                        },
                        width: 160,
                        Cell: (props) => (
                          <>
                            <MDTooltip title={props.row.original.oldValue}>
                              <Typography>
                                {props.row.original.oldValue}
                              </Typography>
                            </MDTooltip>
                          </>
                        ),
                      },
                      {
                        Header: 'New Value',
                        accessor: (originalRow, rowIndex) => {
                          return (
                            strictValidObjectWithKeys(originalRow) &&
                            originalRow.newValue
                          );
                        },
                        width: 160,
                        Cell: (props) => (
                          <>
                            <MDTooltip title={props.row.original.newValue}>
                              <Typography>
                                {props.row.original.newValue}
                              </Typography>
                            </MDTooltip>
                          </>
                        ),
                      },
                      {
                        Header: 'Type',
                        accessor: (originalRow, rowIndex) => {
                          return (
                            strictValidObjectWithKeys(originalRow) &&
                            originalRow.type
                          );
                        },
                        width: 50,
                        Cell: (props) => (
                          <>
                            <MDTooltip title={props.row.original.type}>
                              <Typography>{props.row.original.type}</Typography>
                            </MDTooltip>
                          </>
                        ),
                      },
                    ]}
                    rowData={tripLogsData}
                  />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                      }}
                      className={classes.margin}
                      style={{ fontSize: 15 }}
                    >
                      You do not have any configured Trip logs
                    </Typography>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
};

function getOnlyUpdatedTripLogs(tripLogs) {
  return tripLogs
    ?.map((tripLog) => {
      const logs = [];
      const newLogs = JSON.parse(tripLog?.new_log) || {};
      const previousLogs = JSON.parse(tripLog?.previous_log) || {};

      if (
        tripLog?.type === 'created' &&
        newLogs?.toUpperCase() === 'N/A' &&
        previousLogs?.toUpperCase() === 'N/A'
      ) {
        logs.push(['Trip', '', '']);
      } else if (
        Object.keys(newLogs).length === Object.keys(previousLogs).length
      ) {
        logs.push([
          'Account Name',
          previousLogs?.corporate_account?.name,
          newLogs?.corporate_account?.name,
        ]);
        logs.push([
          'Trip Label',
          previousLogs?.trip_account_field?.label,
          newLogs?.trip_account_field?.label,
        ]);

        const contactValue = (() => {
          let previousValue = '';
          let newValue = '';
          if (previousLogs?.company_contact?.length) {
            previousValue = previousLogs?.company_contact
              .map((contact) =>
                `${contact.first_name} ${contact.last_name}`.trim(),
              )
              .join(', ');
          }
          if (newLogs?.company_contact?.length) {
            newValue = newLogs?.company_contact
              .map((contact) =>
                `${contact.first_name} ${contact.last_name}`.trim(),
              )
              .join(', ');
          }
          return {
            previousValue,
            newValue,
          };
        })();
        logs.push([
          'Contacts',
          contactValue.previousValue,
          contactValue.newValue,
        ]);

        const tripAccountFieldContact = (() => {
          const previousContactObj = Array.isArray(
            previousLogs?.trip_account_field,
          )
            ? previousLogs?.trip_account_field?.find(
                (v) => v?.ui_section === 'contact',
              )
            : previousLogs?.trip_account_field;

          const newContactObj = Array.isArray(newLogs?.trip_account_field)
            ? newLogs?.trip_account_field?.find(
                (v) => v?.ui_section === 'contact',
              )
            : newLogs?.trip_account_field;

          return {
            previousLogs: previousContactObj?.default_value?.trim(),
            newLogs: newContactObj?.default_value?.trim(),
          };
        })();

        logs.push([
          'Approved By',
          tripAccountFieldContact?.previousLogs,
          tripAccountFieldContact?.newLogs,
        ]);

        logs.push([
          'Patient - First Name',
          previousLogs?.base_patient?.first_name,
          newLogs?.base_patient?.first_name,
        ]);
        logs.push([
          'Patient - Last Name',
          previousLogs?.base_patient?.last_name,
          newLogs?.base_patient?.last_name,
        ]);
        logs.push([
          'Patient - DOB',
          validValue(previousLogs?.base_patient?.dob)
            ? dobFormatTime(previousLogs?.base_patient?.dob)
            : '',
          validValue(newLogs?.base_patient?.dob)
            ? dobFormatTime(newLogs?.base_patient?.dob)
            : '',
        ]);
        logs.push([
          'Patient - Phone',
          previousLogs?.base_patient?.phone,
          newLogs?.base_patient?.phone,
        ]);
        logs.push([
          'Patient - Email',
          previousLogs?.base_patient?.email_id,
          newLogs?.base_patient?.email_id,
        ]);
        // logs.push([
        //   'Patient - Weight',
        //   previousLogs?.base_patient?.weight ||
        //     `${previousLogs?.base_patient?.weight} lbs`,
        //   newLogs?.base_patient?.weight ||
        //     `${previousLogs?.base_patient?.weight} lbs`,
        // ]);
        const oldWeight = convertToPounds(
          previousLogs?.base_patient?.weight,
          previousLogs?.base_patient?.weight_in,
        );

        const newWeight = convertToPounds(
          newLogs?.base_patient?.weight,
          newLogs?.base_patient?.weight_in,
        );

        if (parseFloat(oldWeight) !== parseFloat(newWeight)) {
          logs.push(['Patient - Weight', `${oldWeight}`, `${newWeight}`]);
        }
        logs.push([
          'Unit Measurement',
          previousLogs?.base_patient?.weight_in ||
            `${previousLogs?.base_patient?.weight_in}`,
          newLogs?.base_patient?.weight_in ||
            `${previousLogs?.base_patient?.weight_in}`,
        ]);
        logs.push([
          'Patient - Oxygen',
          validValue(previousLogs?.base_patient?.oxygen) &&
            `${previousLogs?.base_patient?.oxygen} L`,
          validValue(newLogs?.base_patient?.oxygen) &&
            `${newLogs?.base_patient?.oxygen} L`,
        ]);
        logs.push([
          'Patient - Ride Along',
          previousLogs?.base_patient?.ride_along_person,
          newLogs?.base_patient?.ride_along_person,
        ]);

        logs.push([
          'Transport Mode',
          previousLogs?.capability_name,
          newLogs?.capability_name,
        ]);
        logs.push([
          'Clarification',
          previousLogs?.capability_clarification,
          newLogs?.capability_clarification,
        ]);
        logs.push([
          'Special Instructions',
          previousLogs?.base_patient?.description,
          newLogs?.base_patient?.description,
        ]);
        logs.push(['Miles', previousLogs?.distance, newLogs?.distance]);
        logs.push([
          'Non Billable Reason',
          previousLogs?.non_billable_reason,
          newLogs?.non_billable_reason,
        ]);

        logs.push([
          'PU Date Time',
          strictValidString(previousLogs?.pick_up_date_time)
            ? previousLogs?.type?.toLowerCase() === 'will_call' ||
              previousLogs?.type?.toLowerCase() === 'on_hold'
              ? formatDate(
                  previousLogs?.pick_up_date_time
                    .replace('T', ' ')
                    .replace('Z', ''),
                )
              : formatDateTime(
                  previousLogs?.pick_up_date_time
                    .replace('T', ' ')
                    .replace('Z', ''),
                )
            : 'N/A',
          strictValidString(newLogs?.pick_up_date_time)
            ? newLogs?.type?.toLowerCase() === 'will_call' ||
              newLogs?.type?.toLowerCase() === 'on_hold'
              ? formatDate(
                  newLogs?.pick_up_date_time.replace('T', ' ').replace('Z', ''),
                )
              : formatDateTime(
                  newLogs?.pick_up_date_time.replace('T', ' ').replace('Z', ''),
                )
            : 'N/A',
        ]);

        logs.push([
          'PU Location',
          previousLogs?.trip_pickup_location,
          newLogs?.trip_pickup_location,
        ]);
        logs.push(['PU ZIP', previousLogs?.pu_zipcode, newLogs?.pu_zipcode]);
        logs.push([
          'DO Location',
          previousLogs?.trip_dropoff_location,
          newLogs?.trip_dropoff_location,
        ]);
        logs.push(['DO ZIP', previousLogs?.do_zipcode, newLogs?.do_zipcode]);
        logs.push([
          'Stairs at PU',
          previousLogs?.pick_up_stairs,
          newLogs?.pick_up_stairs,
        ]);
        logs.push([
          'Room Number at PU',
          previousLogs?.base_patient?.room_no,
          newLogs?.base_patient?.room_no,
        ]);
        logs.push([
          'Stairs at DO',
          previousLogs?.drop_off_stairs,
          newLogs?.drop_off_stairs,
        ]);
        logs.push([
          'Room number at DO',
          previousLogs?.base_patient?.drop_off_room_no,
          newLogs?.base_patient?.drop_off_room_no,
        ]);

        logs.push([
          'Status',
          transportStatus(previousLogs?.status),
          transportStatus(newLogs?.status),
        ]);
        logs.push([
          'Type',
          generateTripTypes(previousLogs?.type),
          generateTripTypes(newLogs?.type),
        ]);
        logs.push([
          'Invoice Status',
          previousLogs?.invoice_status,
          newLogs?.invoice_status,
        ]);
      }

      const skipNullishCheckFor = ['Trip'];
      return logs
        .filter(
          (log) =>
            skipNullishCheckFor.includes(log[0]) ||
            (log[1] !== log[2] && (!!log[1] || !!log[2])),
        )
        .map((log) => ({
          logId: tripLog?.id,
          timestamp:
            (tripLog?.updated_on && formatDateTime(tripLog?.updated_on)) ||
            null,
          user_name: tripLog?.user_name,
          attribute: log[0],
          oldValue: log[1] || 'N/A',
          newValue: log[2] || 'N/A',
          type:
            tripLog?.type?.charAt(0).toUpperCase() + tripLog?.type?.slice(1),
        }));
    })
    .flat()
    .sort((logA, logB) => {
      return logB.logId - logA.logId;
    });
}

const mapStateProps = (state) => {
  return {
    tripLogs: state.billing?.getTripLogs?.get_triplog?.trip_logs || [],
    isLoad: state.trip.getFeedback.isLoad,
    load: state.trip.getReasons.isLoad,
    logLoad: state.billing.getTripLogs.logs_load,
  };
};
const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callGetTripLogs: (...params) => dispatch(getTripLogs(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(TripInfoBilling);

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import {
  dobFormatTime,
  formatDate,
  formatDateTime,
  strictValidArrayWithLength,
  strictValidNumber,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/common-utils';
import { makeStyles } from '@mui/styles';
import CellTypes from '../../../components/react-table/components/renderTypes';
import MDTooltip from '../../../components/tooltip';
import ReactTable from '../../../components/react-table';
import { connect } from 'react-redux';
import { get, size, toNumber } from 'lodash';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
}));

const InfoTransportDetails = ({
  data,
  userFeedback,
  isLoad,
  reasonData,
  load,
}) => {
  const classes = useStyles();

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
                      {a.ui_section === 'account' && (
                        <>
                          {renderTitleWithSpace(a.label)}
                          {strictValidObjectWithKeys(data) &&
                          strictValidString(data.base_trip.cost_center_name)
                            ? renderSubtitleWithSpace(
                                data.base_trip.cost_center_name,
                              )
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
                {strictValidObjectWithKeys(data.base_trip) &&
                  strictValidString(data.base_trip.capability_id) && (
                    <CellTypes
                      type="capability_role"
                      value={data.base_trip.capability_id}
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
                strictValidObjectWithKeys(data.base_trip) &&
                  strictValidString(data.base_trip.distance)
                  ? data.base_trip.distance
                  : 'N/A',
              )}
            </Box>
            <Box>
              {strictValidString(data.base_trip.non_billable_reason) &&
                renderTitleWithSpace('Non Billable Reason')}
              {strictValidObjectWithKeys(data.base_trip) &&
                strictValidString(data.base_trip.non_billable_reason) &&
                renderSubtitleWithSpace(
                  strictValidObjectWithKeys(data.base_trip) &&
                    strictValidString(data.base_trip.non_billable_reason) &&
                    data.base_trip.non_billable_reason,
                  3,
                  true,
                )}
            </Box>
          </Stack>
          <Stack mt={3} direction={'row'} display="flex">
            <Box>
              {renderTitleWithSpace('PU Date Time')}
              {renderSubtitleWithSpace(
                formatDateTime(data.base_trip.estimated_end_time) === 'N/A' &&
                  strictValidObjectWithKeys(data) &&
                  !data.finished
                  ? formatDate(data.base_trip.pick_up_date_time)
                  : formatDateTime(data.base_trip.pick_up_date_time),
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('PU Location')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data.base_trip) &&
                  data.base_trip.trip_pickup_location,
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('PU ZIP')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data.base_trip) &&
                  strictValidString(data.base_trip.pu_zipcode)
                  ? data.base_trip.pu_zipcode
                  : 'N/A',
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('DO Location')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data.base_trip) &&
                  data.base_trip.trip_dropoff_location,
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('DO ZIP')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data.base_trip) &&
                  strictValidString(data.base_trip.do_zipcode)
                  ? data.base_trip.do_zipcode
                  : 'N/A',
              )}
            </Box>
          </Stack>
          <Stack mt={3} direction={'row'} display="flex">
            <Box>
              {renderTitleWithSpace('Stairs at PU')}
              {renderSubtitleWithSpace(data.base_trip.pick_up_stairs)}
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
              {renderSubtitleWithSpace(data.base_trip.drop_off_stairs)}
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
          {size(get(reasonData, 'get_reason', [])) > 0 &&
            strictValidObjectWithKeys(data) &&
            data.finished === true && (
              <>
                <Divider className={classes.generalMargin} />
                <Stack mt={2}>
                  <Accordion
                    className={classes.accordion}
                    defaultExpanded={false}
                  >
                    <AccordionSummary
                      classes={{
                        root: classes.accordionSummary,
                        content: classes.accordionSummaryContent,
                      }}
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="execution-details"
                      id="execution-details"
                      style={{ position: 'relative' }}
                    >
                      {renderTitleWithSpace('Execution Details')}
                    </AccordionSummary>
                    <AccordionDetails>
                      <ReactTable
                        globalFilterShow={false}
                        customHeight={true}
                        headerFilter={false}
                        tableSize={true}
                        loading={load}
                        pagination={false}
                        height={{
                          minHeight: 100,
                          maxheight: 100,
                          overfleow: 'scroll',
                        }}
                        customText="No Execution Details Found"
                        columnDefs={[
                          {
                            Header: 'Timestamp',
                            accessor: (originalRow, rowIndex) => {
                              return (
                                strictValidObjectWithKeys(originalRow) &&
                                originalRow.created_on
                              );
                            },
                            width: 50,
                            Cell: (props) => (
                              <>
                                <Typography>
                                  {formatDateTime(
                                    props.row.original.created_on,
                                  )}
                                </Typography>
                              </>
                            ),
                          },
                          {
                            Header: 'User',
                            accessor: (originalRow, rowIndex) => {
                              return (
                                strictValidObjectWithKeys(originalRow) &&
                                originalRow.user_email
                              );
                            },
                            width: 120,
                            Cell: (props) => (
                              <>
                                <Typography>
                                  {props.row.original.user_email}
                                </Typography>
                              </>
                            ),
                          },
                          {
                            Header: 'Event',
                            accessor: (originalRow, rowIndex) => {
                              return (
                                strictValidObjectWithKeys(originalRow) &&
                                originalRow.event
                              );
                            },
                            width: 160,
                            Cell: (props) => (
                              <>
                                <MDTooltip
                                  title={props.row.original.event + ' min'}
                                >
                                  <Typography>
                                    {props.row.original.event} min
                                  </Typography>
                                </MDTooltip>
                              </>
                            ),
                          },
                          {
                            Header: 'Details',
                            accessor: (originalRow, rowIndex) => {
                              return strictValidObjectWithKeys(originalRow) &&
                                originalRow.other_reason === ''
                                ? originalRow.reason + ', ' + originalRow.charge
                                : originalRow.other_reason +
                                    ', ' +
                                    originalRow.charge;
                            },
                            width: 160,
                            Cell: (props) => (
                              <>
                                <MDTooltip
                                  title={
                                    props.row.original.other_reason === ''
                                      ? props.row.original.reason +
                                        ', ' +
                                        props.row.original.charge
                                      : props.row.original.other_reason +
                                        ', ' +
                                        props.row.original.charge
                                  }
                                >
                                  <Typography>
                                    {strictValidObjectWithKeys(
                                      props.row.original,
                                    ) && props.row.original.other_reason === ''
                                      ? props.row.original.reason +
                                        ', ' +
                                        props.row.original.charge
                                      : props.row.original.other_reason +
                                        ', ' +
                                        props.row.original.charge}
                                  </Typography>
                                </MDTooltip>
                              </>
                            ),
                          },
                        ]}
                        rowData={get(reasonData, 'get_reason', [])}
                      />
                    </AccordionDetails>
                  </Accordion>
                </Stack>
              </>
            )}
          {size(
            get(userFeedback, 'getFeedback.get_feedback.trip_feedbacks', []),
          ) > 0 && (
            <>
              <Divider className={classes.generalMargin} />
              <Stack mt={2}>
                <Accordion
                  className={classes.accordion}
                  defaultExpanded={false}
                >
                  <AccordionSummary
                    classes={{
                      root: classes.accordionSummary,
                      content: classes.accordionSummaryContent,
                    }}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="feedback"
                    id="feedback"
                    style={{ position: 'relative' }}
                  >
                    {renderTitleWithSpace('Feedback')}
                  </AccordionSummary>
                  <AccordionDetails>
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
                      customText="No Feedbacks Found"
                      columnDefs={[
                        {
                          Header: 'Timestamp',
                          accessor: (originalRow, rowIndex) => {
                            return (
                              strictValidObjectWithKeys(originalRow) &&
                              originalRow.feedback_time
                            );
                          },
                          width: 50,
                          Cell: (props) => (
                            <>
                              <Typography>
                                {props.row.original.feedback_time}
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
                          width: 120,
                          Cell: (props) => (
                            <>
                              <Typography>
                                {props.row.original.user_name}
                              </Typography>
                            </>
                          ),
                        },
                        {
                          Header: 'Feedback',
                          accessor: (originalRow, rowIndex) => {
                            return (
                              strictValidObjectWithKeys(originalRow) &&
                              originalRow.feedback
                            );
                          },
                          width: 160,
                          Cell: (props) => (
                            <>
                              <MDTooltip title={props.row.original.feedback}>
                                <Typography>
                                  {props.row.original.feedback}
                                </Typography>
                              </MDTooltip>
                            </>
                          ),
                        },
                      ]}
                      rowData={get(
                        userFeedback,
                        'getFeedback.get_feedback.trip_feedbacks',
                        [],
                      )}
                    />
                  </AccordionDetails>
                </Accordion>
              </Stack>
            </>
          )}
        </React.Fragment>
      )}
    </Box>
  );
};
const mapStateProps = (state) => {
  return {
    userFeedback: state.trip,
    isLoad: state.trip.getFeedback.isLoad,
    reasonData: state.trip.getReasons,
    load: state.trip.getReasons.isLoad,
  };
};

export default connect(mapStateProps, null)(InfoTransportDetails);
// export default InfoTransportDetails;

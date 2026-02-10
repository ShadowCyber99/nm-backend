/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  CssBaseline,
  DialogContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  formatDateTime,
  strictValidObjectWithKeys,
} from '../../../utils/common-utils';
import ReactTable from '../../../components/react-table';
import { deleteUnit, getDataByFilters } from '../action';
import EditableButton from '../../../components/react-table/components/editable-button';
import { transportStatus } from '../../../utils/constant';
import Dialog from '../../../components/dialog';
import SuperAdminEditTrips from '../su-edit-trips/index';
import { tripIegId } from '../../trip-management/action';

const SuperAdminTrips = ({
  setValue,
  isLoad,
  isLoadInner,
  message,
  setData,
  callAllFilterApi,
  callDeleteUnitApi,
  trips,
  callTripIegId,
}) => {
  const [isEditDialog, setisEditDialog] = useState(false);
  const [currentTrip, setCurrentTrip] = useState({});
  useEffect(() => {
    const data = {
      page: 'trip',
    };
    callAllFilterApi(data);
  }, []);

  const editToggle = () => {
    setisEditDialog(!isEditDialog);
  };

  const editDialog = () => {
    return (
      <Dialog
        fullScreen={true}
        isOpen={isEditDialog}
        fullWidth={true}
        maxWidth={'xl'}
        sxAppBar={{ justifyContent: 'center' }}
        sxTitle={{ fontSize: 24, textAlign: 'center' }}
        closeIcon={true}
        title={
          strictValidObjectWithKeys(currentTrip)
            ? `Edit Trip ${currentTrip?.leg_id}`
            : 'Loading...'
        }
        handleClose={() => {
          editToggle();
        }}
      >
        <DialogContent>
          {strictValidObjectWithKeys(currentTrip) ? (
            <SuperAdminEditTrips
              setValue={() => {
                editToggle();
                setCurrentTrip({});
              }}
              current_tripData={currentTrip}
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
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <Grid>
        <CssBaseline />
        <ReactTable
          loading={isLoad}
          isLoadInner={isLoadInner}
          customText={'You do not have any configured Trips'}
          columnDefs={[
            {
              Header: 'Trip Id',
              accessor: 'trip_id',
              width: 80,

              Cell: (props) => (
                <Stack>
                  <Typography>{props.row.original.trip_id}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'User Id',
              accessor: 'user_id',
              width: 80,
              Cell: (props) => (
                <Stack>
                  <Typography>{props.row.original.user_id}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Leg Id',
              accessor: 'leg_id',
              width: 100,
              Cell: (props) => (
                <Stack>
                  <Typography>{props.row.original.leg_id}</Typography>
                </Stack>
              ),
            },

            {
              Header: 'Corp Acct',
              accessor: 'corporate_account_id',
              width: 100,
              Cell: (props) => (
                <Stack>
                  <Typography>
                    {props.row.original.corporate_account_id}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Patient Id',
              accessor: 'patient_id',
              width: 100,
              Cell: (props) => (
                <Stack>
                  <Typography>{props.row.original.patient_id}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Trip PU Location',
              accessor: 'trip_pickup_location',
              width: 250,
              disableSortBy: true,
              Cell: (props) => (
                <Stack>
                  <Typography>
                    {props.row.original.trip_pickup_location}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Trip DO Location',
              accessor: 'trip_dropoff_location',
              width: 250,
              disableSortBy: true,
              Cell: (props) => (
                <Stack>
                  <Typography>
                    {props.row.original.trip_dropoff_location}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'PU Date Time',
              accessor: 'pick_up_date_time',
              width: 140,
              disableSortBy: true,
              Cell: (props) => (
                <Stack>
                  <Typography>
                    {formatDateTime(props.row.original.pick_up_date_time)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Est. End Time',
              accessor: 'estimated_end_time',
              width: 140,
              disableSortBy: true,
              Cell: (props) => (
                <Stack>
                  <Typography>
                    {formatDateTime(props.row.original.estimated_end_time)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Capability Id',
              accessor: 'capability_id',
              width: 120,
              disableSortBy: true,
              Cell: (props) => (
                <Stack>
                  <Typography>{props.row.original.capability_id}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Question Id',
              accessor: 'question_id',
              width: 120,
              disableSortBy: true,
              Cell: (props) => (
                <Stack>
                  <Typography>{props.row.original.question_id}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Status',
              accessor: (originalRow, rowIndex) => {
                return (
                  strictValidObjectWithKeys(originalRow) &&
                  transportStatus(originalRow.status)
                );
              },
              width: 120,
              disableSortBy: true,
              Cell: (props) => (
                <Stack>
                  <Typography>
                    {transportStatus(props.row.original.status)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Invoice Status',
              accessor: 'invoice_status',
              width: 120,
              disableSortBy: true,
              Cell: (props) => (
                <Stack>
                  <Typography>{props.row.original.invoice_status}</Typography>
                </Stack>
              ),
            },
            {
              Header: 'Enabled',
              accessor: 'enabled',
              width: 120,
              disableSortBy: true,
              Cell: (props) => (
                <Stack>
                  <Typography>
                    {props.row.original.enabled === 1 ? 'Enabled' : 'Disabled'}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Created On',
              accessor: 'created_on',
              width: 140,
              disableSortBy: true,
              Cell: (props) => (
                <Stack>
                  <Typography>
                    {formatDateTime(props.row.original.created_on)}
                  </Typography>
                </Stack>
              ),
            },
            {
              Header: 'Actions',
              accessor: '',
              Filter: false,
              disableSortBy: true,
              width: 60,
              Cell: (props) => (
                <>
                  <EditableButton
                    hideDeleteButton={true}
                    PowerButton={false}
                    showDisabledPowerButton={false}
                    deleteButtonShow={false}
                    editButtonClicked={async () => {
                      // setData(props.row.original);
                      editToggle();
                      const res = await callTripIegId(
                        props.row.original.leg_id,
                      );

                      if (res) {
                        setCurrentTrip(res);
                      }
                    }}
                  />
                </>
              ),
            },
          ]}
          rowData={Array.isArray(trips) ? trips : []}
        />
      </Grid>
      {editDialog()}
    </>
  );
};

SuperAdminTrips.propTypes = {
  callAllFilterApi: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

SuperAdminTrips.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.admin.message,
    isLoad: state.admin.isLoad,
    loadErr: state.admin.loadErr,
    trips: state.admin.units,
    userprofile: state.auth.user,
    isLoadInner: state.admin.isLoadInner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callAllFilterApi: (...params) => dispatch(getDataByFilters(...params)),
  callDeleteUnitApi: (...params) => dispatch(deleteUnit(...params)),
  callTripIegId: (...params) => dispatch(tripIegId(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(SuperAdminTrips);

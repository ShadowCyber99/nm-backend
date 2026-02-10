/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Chip, Divider, Grid, Stack } from "@mui/material";
import { Field, Form } from "react-final-form";
import Typography from "@mui/material/Typography";
import FinalFormText from "../../../components/final-form/input-text";
import FinalFormSelect from "../../../components/final-form/final-form-dropdown";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import { CircularProgress } from "@mui/material";
import createDecorator from "final-form-focus";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { createVehicle, getVehicle, getActiveCapabilityRoles } from "../action";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidArray,
  strictValidString,
  encrypted,
} from "../../../utils/common-utils";
import { useSnackbar } from "notistack";
const apiHost = process.env.REACT_APP_BASE_URL;

const focusOnErrors = createDecorator();

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
    backgroundColor: "#F3F3F3",
  },
  tabStyle: {
    backgroundColor: "#E3E3E3",
  },
  margin: {
    margin: theme.spacing(4, 0, 1),
  },
  generalMargin: {
    margin: theme.spacing(1, 0, 0),
  },
  input: { display: "none" },
  profileContainer: {
    marginLeft: theme.spacing(2),
  },
  headerText: {
    fontSize: 14,
    fontWeight: "700",
  },
  mainHeaderText: {
    fontSize: 16,
    fontWeight: "700",
  },
  editicon: {
    left: theme.spacing(25),
    top: theme.spacing(22),
  },
}));

const AddVehicleDetails = ({
  setValue,
  type,
  callCreateVehicleApi,
  capabilityRolesFromState,
  callCapabilityRolesApi,
  callAllVehicleApi,
  userData,
}) => {
  const classes = useStyles();
  const [isLoad, setLoad] = useState(false);
  const [capabilityRole, setCapabilityRole] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    callCapabilityRolesApi();
  }, []);

  const onSubmit = async (val) => {
    setLoad(true);

    const { capability_id, vehicle_code, vehicle_status, notes } = val;

    const token = await localStorage.getItem("authToken");
    const parsedToken = JSON.parse(token);
    const updateData = {
      vehicle_code: vehicle_code,
      capability_id: capability_id,
      enabled: 1,
      vehicle_status: vehicle_status,
      notes: notes,
    };
    const encryptUpdatedData = encrypted(updateData);
    if (strictValidObjectWithKeys(userData)) {
      axios
        .put(
          `${apiHost}/admin/vehicle/${userData.vehicle_id}`,
          encryptUpdatedData,
          {
            headers: {
              authorization: `${parsedToken}`,
            },
          }
        )
        .then((res) => {
          setLoad(false);
          if (res.data.status === 1) {
            setValue();
            callAllVehicleApi();
            success(res.data.message);
          } else if (res.data.status === 0) {
            errorSnack(res.data.message);
          }
        });
    } else {
      axios
        .post(`${apiHost}/admin/vehicle`, encryptUpdatedData, {
          headers: {
            authorization: `${parsedToken}`,
          },
        })
        .then((res) => {
          setLoad(false);
          if (res.data.status === 1) {
            setValue();
            callAllVehicleApi();
            success(res.data.message);
          } else if (res.data.status === 0) {
            errorSnack(res.data.message);
          }
        });
    }
  };

  const success = (message) => {
    enqueueSnackbar(message, {
      variant: "success",
      preventDuplicate: true,
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
  };

  const errorSnack = (loadErr) => {
    enqueueSnackbar(loadErr, {
      variant: "error",
      preventDuplicate: true,
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
  };

  useEffect(() => {
    const roleArray = [];
    if (strictValidArrayWithLength(capabilityRolesFromState)) {
      capabilityRolesFromState.map((a) => {
        roleArray.push({
          value: a.capability_id,
          title: a.name,
        });
      });
    }
    setCapabilityRole(roleArray);
  }, [capabilityRolesFromState]);
  const checkSelected = (v) => {
    let obj =
      strictValidArrayWithLength(capabilityRolesFromState) &&
      capabilityRolesFromState.filter((o) => o.capability_id === v);
    return obj;
  };

  const buttonName =
    type === "edit" &&
    strictValidObjectWithKeys(userData) &&
    userData.edit === true
      ? "Update Vehicle"
      : "Create Vehicle";
  return (
    <Grid item xs={12} md={12} lg={12}>
      <Form
        onSubmit={onSubmit}
        decorators={[focusOnErrors]}
        keepDirtyOnReinitialize
        validate={(values) => {
          const errors = {};
          if (!values.vehicle_code) {
            errors.vehicle_code = "Vehicle Code is Required";
          }
          if (!strictValidArrayWithLength(values.capability_id)) {
            errors.capability_id =
              "Please select at least one capability from the dropdown";
          }
          return errors;
        }}
        initialValues={{
          capability_id:
            strictValidObjectWithKeys(userData) &&
            strictValidArray(userData.capability_id)
              ? userData.capability_id
              : [],
          withValidation: strictValidObjectWithKeys(userData),
          vehicle_status: strictValidObjectWithKeys(userData)
            ? userData.vehicle_status
            : "",
          notes: strictValidObjectWithKeys(userData) ? userData.notes : "",
          vehicle_code: strictValidObjectWithKeys(userData)
            ? userData.vehicle_code
            : "",
        }}
        render={({
          handleSubmit,
          pristine,
          values,
          submitting,
          valid,
          touched,
          errors,
        }) => {
          return (
            <Box>
              <Typography className={classes.mainHeaderText}>
                {strictValidObjectWithKeys(userData)
                  ? "Edit Vehicle"
                  : "Setup Vehicle"}
              </Typography>
              <Divider className={classes.generalMargin} />
              <Stack mt={3}>
                <Typography className={classes.headerText}>
                  General Information
                </Typography>
              </Stack>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Grid
                    container
                    spacing={{
                      xs: 2,
                      md: 3,
                    }}
                    columns={{
                      xs: 4,
                      sm: 4,
                      md: 12,
                    }}
                  >
                    <Grid item xs={4} sm={2} md={4}>
                      <Field
                        component={FinalFormText}
                        name="vehicle_code"
                        id="add_vehicle_vehicle_code"
                        placeholder="Vehicle code"
                        required
                        errorText={touched.vehicle_code && errors.vehicle_code}
                      />
                    </Grid>
                  </Grid>
                  {strictValidObjectWithKeys(userData) && (
                    <Grid
                      container
                      spacing={{
                        xs: 2,
                        md: 3,
                      }}
                      columns={{
                        xs: 4,
                        sm: 4,
                        md: 12,
                      }}
                    >
                      <Grid item xs={4} sm={2} md={4}>
                        <Field
                          component={FinalFormSelect}
                          name="vehicle_status"
                          placeholder="Vehicle Status"
                          id="add_vehicle_vehicle_status"
                          required
                          items={[
                            {
                              title: "In Service",
                              value: 1,
                            },
                            {
                              title: "Out of Service",
                              value: 0,
                            },
                          ]}
                          errorText={
                            touched.vehicle_status && errors.vehicle_status
                          }
                        />
                      </Grid>
                    </Grid>
                  )}
                  <Grid
                    container
                    spacing={{
                      xs: 2,
                      md: 3,
                    }}
                    columns={{
                      xs: 4,
                      sm: 4,
                      md: 12,
                    }}
                  >
                    <Grid item xs={4} sm={2} md={4}>
                      <Field
                        component={FinalFormText}
                        name="notes"
                        id="add_vehicle_notes"
                        placeholder="Notes"
                        errorText={touched.notes && errors.notes}
                      />
                    </Grid>
                  </Grid>

                  {strictValidArrayWithLength(capabilityRole) && (
                    <Grid
                      container
                      spacing={{
                        xs: 2,
                        md: 3,
                      }}
                      columns={{
                        xs: 4,
                        sm: 4,
                        md: 12,
                      }}
                    >
                      <Grid item xs={4} sm={2} md={3}>
                        <Field
                          component={FinalFormSelect}
                          name="capability_id"
                          placeholder="Capability"
                          required
                          id="add_vehicle_capability_id"
                          isMultiple
                          items={capabilityRole}
                          renderValue={(selected) => (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {selected.map((value) => {
                                const chipName = checkSelected(value);
                                const name =
                                  strictValidArrayWithLength(chipName) &&
                                  strictValidObjectWithKeys(chipName[0])
                                    ? chipName[0].name
                                    : "";
                                const chipColor =
                                  strictValidArrayWithLength(chipName) &&
                                  strictValidObjectWithKeys(chipName[0])
                                    ? chipName[0].color
                                    : "#0884c7";
                                return (
                                  <>
                                    {strictValidString(name) && (
                                      <Chip
                                        key={value}
                                        style={{
                                          textTransform: "uppercase",
                                          marginTop: 5,
                                          backgroundColor: chipColor,
                                          color: "#ffff",
                                        }}
                                        size="small"
                                        label={name}
                                      />
                                    )}
                                  </>
                                );
                              })}
                            </Box>
                          )}
                          errorText={
                            touched.capability_id && errors.capability_id
                          }
                        />
                      </Grid>
                    </Grid>
                  )}

                  <Divider className={classes.margin} />
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
                    <Grid item xs={4} sm={6} md={8}>
                      <Button
                        disabled={pristine || submitting || !valid}
                        onClick={handleSubmit}
                        type="submit"
                        id="add_vehicle_btn_submit"
                        size="large"
                        variant="contained"
                        startIcon={<CheckIcon />}
                        sx={{
                          mt: 2,
                          mb: 2,
                        }}
                      >
                        {isLoad ? (
                          <CircularProgress size={15} color="secondary" />
                        ) : (
                          buttonName
                        )}
                      </Button>
                      <Button
                        onClick={() => setValue(1)}
                        type="submit"
                        color="error"
                        id="add_vehicle_btn_cancel"
                        size="large"
                        variant="outlined"
                        startIcon={<CloseIcon />}
                        sx={{
                          mt: 2,
                          mb: 2,
                          mx: 2,
                        }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          );
        }}
      />
    </Grid>
  );
};
AddVehicleDetails.propTypes = {
  callAllVehicleApi: PropTypes.func,
  callCreateVehicleApi: PropTypes.func,
  isLoad: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.string,
};

AddVehicleDetails.defaultProps = {
  isLoad: false,
  loadErr: "",
  message: "",
  type: "add",
};

const mapStateProps = (state) => {
  return {
    message: state.drivers.message,
    isLoad: state.drivers.isLoad,
    loadErr: state.drivers.loadErr,
    allDriversFromState: state.drivers.all_drivers,
    capabilityRolesFromState: state.drivers.roles,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callCreateVehicleApi: (...params) => dispatch(createVehicle(...params)),
  callAllVehicleApi: (...params) => dispatch(getVehicle(...params)),
  callCapabilityRolesApi: (...params) =>
    dispatch(getActiveCapabilityRoles(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(AddVehicleDetails);

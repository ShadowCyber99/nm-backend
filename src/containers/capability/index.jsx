/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Button,
  CssBaseline,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  Stack,
  IconButton,
  Tooltip,
  TextField,
} from '@mui/material';
import Sidebar from '../../components/sidebar';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import TopTab from '../../components/top-tab';
import {
  checkArrayObjectOfKeys,
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
} from '../../utils/common-utils';
import Dialog from '../../components/dialog';
import { Field, Form } from 'react-final-form';
import FinalFormText from '../../components/final-form/input-text';
import createDecorator from 'final-form-focus';
import {
  createCapabilityRoles,
  deleteCapabilityRoles,
  getActiveCapabilityRoles,
  resetMessage,
  changecapabilityStatus,
  updateCapabilityRoles,
  updateCapability,
} from '../drivers-management/action';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import ReactTable from '../../components/react-table';
import EditableButton from '../../components/react-table/components/editable-button';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import RemoveIcon from '@mui/icons-material/Remove';
import CellMapTypes from '../../components/react-table/components/renderMapTypes';
import _ from 'lodash';
import WindowTitle from '../../components/window-name';
import Clock from '../../components/clock';
import { tablePadding } from '../../assets/styles';
const focusOnErrors = createDecorator();
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    backgroundColor: '#F3F3F3',
  },
  tabStyle: {
    backgroundColor: '#E3E3E3',
  },
  button: {
    margin: theme.spacing(1),
  },
  buttonMargin: {
    margin: theme.spacing(3, 0),
  },
  input: {
    width: '100%',
    // height: 100,
    margin: theme.spacing(2, 0, 0),
  },
}));

const Capability = ({
  isLoad,
  callCapabilityRolesApi,
  capabilityRolesFromState,
  callCreateCapabilityRolesApi,
  loadErr,
  message,
  callResetMessageApi,
  callUpdateCapabilitiesApi,
  callDeleteCapabilitiesApi,
  callchangecapabilityStatusApi,
  isLoadInner,
  callUpdateCapabilities,
}) => {
  const [current, setCurrent] = useState({});
  const [value, setValue] = useState(1);
  const classes = useStyles();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    callCapabilityRolesApi();
  }, []);

  const toggle = () => {
    setIsOpenDialog(!isOpenDialog);
  };

  const deleteToggle = () => {
    setIsDeleteDialog(!isDeleteDialog);
  };
  const onSubmit = async (val) => {
    if (strictValidObjectWithKeys(current) && current.capability_id) {
      const result = await callUpdateCapabilitiesApi({
        id: current.capability_id,
        values: {
          name: val.name,
          description: val.description,
          enabled: val.vehicle_status,
          clarification: val.clarification,
          color: val.color,
        },
      });

      if (result) {
        callCapabilityRolesApi();
        toggle();
        callResetMessageApi();
        setCurrent({});
      }
    } else {
      const result = await callCreateCapabilityRolesApi({ ...val });
      if (result) {
        callCapabilityRolesApi();
        toggle();
        callResetMessageApi();
      }
    }
  };

  const deleteCapability = async (val) => {
    const result = await callDeleteCapabilitiesApi(val);
    if (result) {
      callCapabilityRolesApi();
      callResetMessageApi();
      deleteToggle();
    }
  };

  useEffect(() => {
    if (loadErr)
      enqueueSnackbar(loadErr, {
        variant: 'error',
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
  }, [loadErr]);

  useEffect(() => {
    if (message)
      enqueueSnackbar(message, {
        variant: 'success',
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
  }, [message]);

  const deleteDialog = (id) => {
    return (
      <Dialog
        fullScreen={false}
        isOpen={isDeleteDialog}
        title={'Are you sure ?'}
        handleClose={() => {
          deleteToggle();
        }}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Do you want to delete this capability from the list ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => deleteToggle()}
          >
            No
          </Button>
          <Button
            color="error"
            variant="outlined"
            onClick={() => deleteCapability(current.capability_id)}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderDialog = () => {
    const title = strictValidObjectWithKeys(current)
      ? 'Update Capability'
      : 'Add New Capability';
    return (
      <Dialog
        fullScreen={false}
        isOpen={isOpenDialog}
        title={title}
        handleClose={() => {
          toggle();
        }}
      >
        <Form
          onSubmit={onSubmit}
          keepDirtyOnReinitialize
          mutators={{
            ...arrayMutators,
          }}
          decorators={[focusOnErrors]}
          initialValues={{
            name: strictValidObjectWithKeys(current) ? current.name : '',
            description: strictValidObjectWithKeys(current)
              ? current.description
              : '',
            vehicle_status: strictValidObjectWithKeys(current)
              ? current.enabled
              : false,
            color: strictValidObjectWithKeys(current)
              ? current.color
              : '#0884c7',
            clarification:
              strictValidObjectWithKeys(current) &&
              strictValidArrayWithLength(current.clarification)
                ? current.clarification
                : [
                    {
                      question: '',
                      question_id: 0,
                    },
                  ],
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = 'Name is required';
            }
            if (!values.description) {
              errors.description = 'Description is required';
            }

            return errors;
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
              <form handleSubmit={(e) => e.preventDefault()}>
                <Field
                  component={FinalFormText}
                  name="name"
                  id="add_capability_name"
                  placeholder="Capability Name"
                  required
                  errorText={touched.name && errors.name}
                />
                <Field
                  component={FinalFormText}
                  name="description"
                  id="add_capability_description"
                  placeholder="Capability Description"
                  required
                  errorText={touched.description && errors.description}
                />
                <Field id="add_capability_color" name="color">
                  {({ meta, input }) => (
                    <div>
                      <TextField
                        id="contained-button-file"
                        type="color"
                        placeholder="Choose color"
                        value={input.value}
                        label="Choose color"
                        onChange={(event) => {
                          input.onChange(event.target.value);
                        }}
                        className={classes.input}
                      />
                    </div>
                  )}
                </Field>
                <FieldArray
                  id="add_capability_clarification"
                  name="clarification"
                >
                  {({ fields }) => (
                    <>
                      {fields.map((name, index) => (
                        <div
                          style={{
                            flexDirection: 'row',
                            display: 'flex',
                            flex: 1,
                            width: 500,
                          }}
                        >
                          <Field
                            component={FinalFormText}
                            name={`${name}.question`}
                            placeholder="Clarification"
                          />
                          {index === 0 ? (
                            <Tooltip title="Add">
                              <IconButton
                                aria-label="delete"
                                onClick={() =>
                                  fields.push({
                                    question: '',
                                    question_id: 0,
                                  })
                                }
                                color="primary"
                                disableFocusRipple
                                disableRipple
                                disabled={checkArrayObjectOfKeys(
                                  ['question'],
                                  fields.value,
                                )}
                              >
                                <AddIcon />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Remove">
                              <IconButton
                                size="medium"
                                variant="text"
                                onClick={() => fields.remove(index)}
                                // className={classes.buttonMargin}
                                color="error"
                                disableFocusRipple
                                disableRipple
                              >
                                <RemoveIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </FieldArray>

                <LoadingButton
                  disabled={pristine || submitting || !valid}
                  onClick={handleSubmit}
                  type="submit"
                  id="add_capability_btn_submit"
                  fullWidth
                  size="large"
                  variant="contained"
                  loading={isLoad}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {title}
                </LoadingButton>
              </form>
            );
          }}
        />
      </Dialog>
    );
  };
  const updateData = (data) => {
    callUpdateCapabilities(data);
  };
  return (
    <div className={classes.root}>
      <CssBaseline />
      <WindowTitle title="Capability" />
      <Sidebar onChange={() => console.log()} />
      <main className={classes.content}>
        <Grid item>
          <TabContext value={value}>
            <Box
              style={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'space-between',
              }}
              className={classes.tabStyle}
              flexDirection={'row'}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <TopTab label="Capabilities" value={1} />
              </TabList>
              <Stack direction="row" alignItems="center">
                <Clock>
                  <Button
                    size="medium"
                    variant="contained"
                    onClick={() => {
                      setCurrent({});
                      toggle();
                    }}
                    color="primary"
                    startIcon={<AddIcon />}
                    className={classes.button}
                  >
                    Add Capability
                  </Button>
                </Clock>
              </Stack>
            </Box>
            <TabPanel sx={tablePadding} value={1} index={1}>
              <Grid item xs={12} md={12} lg={12}>
                <ReactTable
                  loading={isLoad}
                  isLoadInner={isLoadInner}
                  setDragDropData={(e) => updateData(e)}
                  customText={'You do not have any configured Capabilities'}
                  columnDefs={[
                    {
                      Header: 'Name',
                      accessor: 'name',
                    },
                    {
                      Header: 'Description',
                      accessor: 'description',
                    },
                    {
                      Header: 'Clarification',
                      accessor: (originalRow, rowIndex) => {
                        let output = [];
                        _.map(originalRow.clarification, (res) => {
                          output.push(`${res.question}`);
                        });
                        return output.join(', ');
                      },
                      id: 'question',
                      disableSortBy: true,
                      Cell: (props) => (
                        <>
                          <CellMapTypes
                            type="company_contact"
                            renderValue="question"
                            data={props.row.original.clarification}
                          />
                        </>
                      ),
                    },
                    {
                      Header: 'Actions',
                      accessor: '',
                      Filter: false,
                      width: 80,
                      disableSortBy: true,
                      Cell: (props) => (
                        <>
                          <EditableButton
                            hideDeleteButton={
                              props.row.original.is_deleted === false
                            }
                            editButtonClicked={() => {
                              const field = props.row.original;
                              setCurrent(field);
                              toggle();
                            }}
                            deleteButtonClicked={() => {
                              const field = props.row.original;
                              deleteToggle();
                              setCurrent(field);
                            }}
                          />
                        </>
                      ),
                    },
                  ]}
                  rowData={
                    Array.isArray(capabilityRolesFromState)
                      ? capabilityRolesFromState
                      : []
                  }
                />
              </Grid>
            </TabPanel>
          </TabContext>
        </Grid>
      </main>
      {renderDialog()}
      {deleteDialog()}
    </div>
  );
};

Capability.propTypes = {
  callCapabilityRolesApi: PropTypes.func,
  isLoad: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.string,
};

Capability.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.drivers.message,
    isLoad: state.drivers.isLoad,
    loadErr: state.drivers.loadErr,
    capabilityRolesFromState: state.drivers.roles,
    isLoadInner: state.drivers.isLoadInner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callCapabilityRolesApi: (...params) =>
    dispatch(getActiveCapabilityRoles(...params)),
  callUpdateCapabilities: (...params) => dispatch(updateCapability(...params)),
  callCreateCapabilityRolesApi: (...params) =>
    dispatch(createCapabilityRoles(...params)),
  callResetMessageApi: (...params) => dispatch(resetMessage(...params)),
  callUpdateCapabilitiesApi: (...params) =>
    dispatch(updateCapabilityRoles(...params)),
  callchangecapabilityStatusApi: (...params) =>
    dispatch(changecapabilityStatus(...params)),
  callDeleteCapabilitiesApi: (...params) =>
    dispatch(deleteCapabilityRoles(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(Capability);

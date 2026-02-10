/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Button,
  CssBaseline,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormHelperText,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Sidebar from '../../components/sidebar';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import TopTab from '../../components/top-tab';
import {
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
  validStringinArray,
} from '../../utils/common-utils';
import Dialog from '../../components/dialog';
import { Field, Form } from 'react-final-form';
import FinalFormText from '../../components/final-form/input-text';
import createDecorator from 'final-form-focus';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import ReactTable from '../../components/react-table';
import EditableButton from '../../components/react-table/components/editable-button';
import arrayMutators from 'final-form-arrays';
import WindowTitle from '../../components/window-name';
import Clock from '../../components/clock';
import { tablePadding } from '../../assets/styles';
import {
  createCdf,
  deleteCdf,
  getCdf,
  updateCdf,
  resetMessage,
  flushError,
} from './action';
import FinalFormSelect from '../../components/final-form/final-form-dropdown/final-form-dropdown';
import { invalidChars } from '../../utils/constant';
import { SelectColumnFilter } from '../../components/react-table/helper';
import { FieldArray } from 'react-final-form-arrays';
import RemoveIcon from '@mui/icons-material/Remove';
import MDSelect from '../../components/mdselect';
import MDTooltip from '../../components/tooltip';

const focusOnErrors = createDecorator();
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  helperText: {
    margin: `${theme.spacing(0.2, 0, 0, 0)} !important`,
    color: theme.palette.error.main,
    backgroundColor: '#F3F3F3',
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

const CDF = ({
  isLoad,
  callCDFApi,
  cdf_list,
  callCreateCDFApi,
  loadErr,
  message,
  callResetMessageApi,
  callUpdateCDFApi,
  callDeleteCDF,
  isLoadInner,
  callErrorFlushApi,
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
    callErrorFlushApi();
    callCDFApi();
  }, []);

  const toggle = () => {
    setIsOpenDialog(!isOpenDialog);
  };

  const deleteToggle = () => {
    setIsDeleteDialog(!isDeleteDialog);
  };
  const onSubmit = async (val) => {
    if (strictValidObjectWithKeys(current) && current.id) {
      const result = await callUpdateCDFApi({
        id: current.id,
        values: { ...val },
      });

      if (result) {
        callCDFApi();
        toggle();
        callResetMessageApi();
        setCurrent({});
      }
    } else {
      const result = await callCreateCDFApi({ ...val });
      if (result) {
        callCDFApi();
        toggle();
        callResetMessageApi();
      }
    }
  };

  const deleteCdf = async (val) => {
    const result = await callDeleteCDF(val);
    if (result) {
      callCDFApi();
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
            Do you want to delete this cdf from the list ?
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
            onClick={() => deleteCdf(current.id)}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderDialog = () => {
    const title = strictValidObjectWithKeys(current)
      ? 'Update CDF'
      : 'Add New CDF';
    return (
      <Dialog
        fullScreen={false}
        isOpen={isOpenDialog}
        title={title}
        handleClose={() => {
          toggle();
          callErrorFlushApi();
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
            ui_section: strictValidObjectWithKeys(current)
              ? current.ui_section
              : '',
            ui_section_order: strictValidObjectWithKeys(current)
              ? current.ui_section_order
              : '',
            default_value: strictValidObjectWithKeys(current)
              ? current.default_value
              : '',
            type: strictValidObjectWithKeys(current) ? current.type : '',
            cost_center_value:
              strictValidObjectWithKeys(current) &&
              strictValidArrayWithLength(current.cost_center_value)
                ? current.cost_center_value
                : [''],
            shown_to_driver: strictValidObjectWithKeys(current)
              ? current.shown_to_driver
              : '',
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = 'Name is required';
            }
            if (!values.description) {
              errors.description = 'Description is required';
            }
            if (!values.ui_section) {
              errors.ui_section = 'Ui Section is required';
            }
            if (!values.type) {
              errors.type = 'Type is required';
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
            form,
            errors,
            fields,
          }) => {
            return (
              <form handleSubmit={(e) => e.preventDefault()}>
                <Field
                  id="add_cdf_name"
                  component={FinalFormText}
                  name="name"
                  placeholder="CDF Name"
                  required
                >
                  {({ input, meta }) => {
                    return (
                      <>
                        <TextField
                          variant="outlined"
                          name="name"
                          error={values.name ? false : true}
                          sx={{
                            background: '#fafafa',
                            width: '100%',
                            mt: 2,
                          }}
                          required={true}
                          id="add_cdf_name"
                          placeholder="CDF Name"
                          label="CDF Name"
                          {...input}
                          onChange={(e) => {
                            input.onChange(e); //final-form's onChange
                            callErrorFlushApi();
                          }}
                        />
                        {strictValidString(touched.name && errors.name) && (
                          <FormHelperText
                            className={classes.helperText}
                            id="component-helper-text"
                          >
                            {touched.name && errors.name}
                          </FormHelperText>
                        )}
                      </>
                    );
                  }}
                </Field>
                <Field
                  component={FinalFormText}
                  id="add_cdf_description"
                  name="description"
                  placeholder="CDF Description"
                  required
                  errorText={touched.description && errors.description}
                />
                <Field name="type">
                  {({ meta, input }) => (
                    <>
                      <MDSelect
                        required={true}
                        name="type"
                        onChange={(e) => {
                          input.onChange(e.target.value);
                          if (e.target.value === 'enum') {
                            form.change('ui_section', 'account');
                            form.change('shown_to_driver', '0');
                          } else {
                            form.change('ui_section', '');
                            form.change('shown_to_driver', '');
                          }
                        }}
                        placeholder="Type"
                        id="type"
                        errorText={touched.label && errors.label}
                        value={input.value}
                        data={[
                          {
                            title: 'String',
                            value: 'string',
                          },
                          { title: 'Float', value: 'float', disabled: false },
                          {
                            title: 'Integer',
                            value: 'integer',
                            disabled: false,
                          },
                          {
                            title: 'Enum',
                            value: 'enum',
                            disabled:
                              strictValidObjectWithKeys(current) &&
                              current.type !== 'enum',
                          },
                          {
                            title: 'Positive Integer',
                            value: 'positiveinteger',
                            disabled: false,
                          },
                        ]}
                        onBlur={(e) => {
                          input.onBlur(e.target.value);
                        }}
                      />
                    </>
                  )}
                </Field>
                {values.type === 'enum' && (
                  <FieldArray id="add_c_account_phone" name="cost_center_value">
                    {({ fields }) => (
                      <>
                        {fields.map((name, index) => (
                          <Grid
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            key={name}
                          >
                            <Field
                              id="add_c_account_er_phone_number"
                              name={`cost_center_value[${index}]`}
                              component={FinalFormText}
                              placeholder="Cost Center"
                              label="Cost Center"
                              required
                            />
                            <Grid item>
                              {index === 0 ? (
                                <Button
                                  size="medium"
                                  variant="text"
                                  onClick={() => {
                                    fields.push('');
                                    callErrorFlushApi();
                                  }}
                                  id="add_c_account_add_er_phone_number"
                                  color="primary"
                                  sx={{ pr: 4.5 }}
                                  startIcon={<AddIcon />}
                                  className={classes.button}
                                  // disabled={values.phone.length > 3}
                                >
                                  Add
                                </Button>
                              ) : (
                                <Button
                                  size="medium"
                                  variant="text"
                                  id="add_c_account_remove_er_phone_number"
                                  onClick={() => {
                                    fields.remove(index);
                                    callErrorFlushApi();
                                  }}
                                  sx={{ mt: 2.5 }}
                                  color="error"
                                  startIcon={<RemoveIcon />}
                                  className={classes.button}
                                >
                                  Remove
                                </Button>
                              )}
                            </Grid>
                          </Grid>
                        ))}
                      </>
                    )}
                  </FieldArray>
                )}
                <Field
                  component={FinalFormSelect}
                  id="add_cdf_ui_section"
                  name="ui_section"
                  disabled={
                    strictValidObjectWithKeys(values) &&
                    strictValidString(values.type) &&
                    values.type === 'enum'
                  }
                  placeholder="UI Section"
                  items={[
                    { title: 'Account', value: 'account' },
                    { title: 'Contact', value: 'contact' },
                    { title: 'Patient', value: 'patient' },
                    {
                      title: 'Transport Detail',
                      value: 'transport_detail',
                    },
                  ]}
                  required
                  errorText={touched.ui_section && errors.ui_section}
                />
                <Field
                  component={FinalFormText}
                  name="default_value"
                  id="add_cdf_default_value"
                  placeholder="Default Value"
                  type={
                    ['integer', 'positiveinteger', 'float'].includes(
                      values.type,
                    )
                      ? 'number'
                      : 'text'
                  }
                  inputProps={{
                    min:
                      (values.type === 'positiveinteger' ||
                        values.type === 'float') &&
                      0,
                    step: values.type === 'float' && 0.1,
                  }}
                  onKeyDown={(evt) => {
                    if (
                      values.type === 'positiveinteger' ||
                      values.type === 'float' ||
                      values.type === 'integer'
                    ) {
                      invalidChars.includes(evt.key) && evt.preventDefault();
                    }
                  }}
                  errorText={touched.default_value && errors.default_value}
                />
                <Field
                  component={FinalFormText}
                  name="ui_section_order"
                  id="add_cdf_ui_section_order"
                  placeholder="UI Section Order"
                  type={'number'}
                  inputProps={{
                    min: 0,
                  }}
                  onKeyDown={(evt) => {
                    invalidChars.includes(evt.key) && evt.preventDefault();
                  }}
                  errorText={
                    touched.ui_section_order && errors.ui_section_order
                  }
                />
                <Field
                  component={FinalFormSelect}
                  name="shown_to_driver"
                  id="add_cdf_shown_to_driver"
                  disabled={
                    strictValidObjectWithKeys(values) &&
                    strictValidString(values.type) &&
                    values.type === 'enum'
                  }
                  placeholder="Shown To Driver"
                  items={[
                    { title: 'Yes', value: '1' },
                    { title: 'No', value: '0' },
                  ]}
                  errorText={touched.shown_to_driver && errors.shown_to_driver}
                />

                <LoadingButton
                  disabled={
                    pristine ||
                    submitting ||
                    !valid ||
                    (values.type === 'enum' &&
                      strictValidArrayWithLength(values.cost_center_value) &&
                      validStringinArray(values.cost_center_value)) ||
                    loadErr
                  }
                  onClick={handleSubmit}
                  type="submit"
                  id="add_cdf_btn_submit"
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
  const UiSectionNames = (key) => {
    switch (key) {
      case 'transport_detail':
        return 'Transport Detail';
      case 'contact':
        return 'Contact';
      case 'account':
        return 'Account';
      case 'patient':
        return 'Patient';

      default:
        return key;
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <WindowTitle title="Custom defined fields" />
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
                <TopTab label="CDF" value={1} />
              </TabList>
              <Stack direction="row" alignItems="center">
                <Clock>
                  <Button
                    size="medium"
                    variant="contained"
                    onClick={() => {
                      toggle();
                      setCurrent({});
                    }}
                    color="primary"
                    startIcon={<AddIcon />}
                    className={classes.button}
                  >
                    Add CDF
                  </Button>
                </Clock>
              </Stack>
            </Box>
            <TabPanel sx={tablePadding} value={1} index={1}>
              <Grid item xs={12} md={12} lg={12}>
                <ReactTable
                  loading={isLoad}
                  isLoadInner={isLoadInner}
                  customText={'You do not have any configured CDF'}
                  columnDefs={[
                    {
                      Header: 'Name',
                      accessor: 'name',
                      width: 150,
                    },
                    {
                      Header: 'Description',
                      accessor: 'description',
                      width: 250,
                    },
                    {
                      Header: 'Cost Center',
                      accessor: 'cost_center_value',
                      Cell: (props) => (
                        <MDTooltip title={props.row.original.cost_center_value}>
                          <Typography sx={{ textTransform: 'capitalize' }}>
                            {props.row.original.cost_center_value}
                          </Typography>
                        </MDTooltip>
                      ),
                      width: 100,
                      Filter: SelectColumnFilter,
                    },
                    {
                      Header: 'Type',
                      accessor: 'type',
                      Cell: (props) => (
                        <Typography sx={{ textTransform: 'capitalize' }}>
                          {props.row.original.type}
                        </Typography>
                      ),
                      width: 100,
                      Filter: SelectColumnFilter,
                    },
                    {
                      Header: 'Default Value',
                      accessor: 'default_value',
                      width: 100,
                    },
                    {
                      Header: 'Ui Section',
                      accessor: 'ui_section',
                      width: 100,
                      Cell: (props) => (
                        <Typography>
                          {UiSectionNames(props.row.original.ui_section)}
                        </Typography>
                      ),
                    },

                    {
                      Header: 'Ui Section Order',
                      accessor: 'ui_section_order',
                      width: 80,
                    },
                    {
                      Header: 'Shown To Driver',
                      width: 80,
                      accessor: (originalRow, rowIndex) => {
                        return strictValidObjectWithKeys(originalRow) &&
                          originalRow.shown_to_driver === '1'
                          ? 'Yes'
                          : 'No';
                      },
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
                              props.row.original.is_deleted === 0
                            }
                            editButtonDisabled={
                              props.row.original.is_deleted === 0
                            }
                            editButtonClicked={() => {
                              const field = props.row.original;
                              const cost_center =
                                props.row.original.cost_center_value;

                              const data = {
                                ...field,
                                cost_center_value:
                                  strictValidString(cost_center) &&
                                  cost_center.split(','),
                              };
                              setCurrent(data);
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
                  rowData={Array.isArray(cdf_list) ? cdf_list : []}
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

CDF.propTypes = {
  callCDFApi: PropTypes.func,
  isLoad: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.string,
};

CDF.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.cdf.message,
    isLoad: state.cdf.isLoad,
    loadErr: state.cdf.loadErr,
    cdf_list: state.cdf.cdf,
    isLoadInner: state.cdf.isLoadInner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callDeleteCDF: (...params) => dispatch(deleteCdf(...params)),
  callCDFApi: (...params) => dispatch(getCdf(...params)),
  callUpdateCDFApi: (...params) => dispatch(updateCdf(...params)),
  callCreateCDFApi: (...params) => dispatch(createCdf(...params)),
  callResetMessageApi: (...params) => dispatch(resetMessage(...params)),
  callErrorFlushApi: (...params) => dispatch(flushError(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(CDF);

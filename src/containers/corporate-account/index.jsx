/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Button,
  CssBaseline,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import Sidebar from '../../components/sidebar';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import InfoDetails from './info-dialog/index';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { connect } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import TopTab from '../../components/top-tab';
import AddCorporateAccount from './add-corporate-account';
import {
  getCorporateAccounts,
  deleteCorporateAccountByID,
  invoiceFlush,
} from './action';
import { getCdf } from './../cdf/action';
import PropTypes from 'prop-types';
import Dialog from '../../components/dialog';
import ReactTable from '../../components/react-table';
import CellMapTypes from '../../components/react-table/components/renderMapTypes';
import EditableButton from '../../components/react-table/components/editable-button';
import {
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
} from '../../utils/common-utils';
import _, { map } from 'lodash';
import { PhoneFilters } from '../../components/react-table/helper';
import WindowTitle from '../../components/window-name';
import Clock from '../../components/clock';
import { tablePadding } from '../../assets/styles';
import { useSnackbar } from 'notistack';
import MDTooltip from '../../components/tooltip';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    height: '94vh',
    overflow: 'auto',
    backgroundColor: '#F3F3F3',
  },
  mainRoot: {
    width: '100vw',
  },
  tabStyle: {
    backgroundColor: '#E3E3E3',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const CorporateAccount = ({
  isLoad,
  callCorporateAccountApi,
  callDeleteCorporateAccount,
  callGetCdf,
  corporateAcc,
  message,
  isLoadInner,
  callInvoiceFlush,
}) => {
  const [type, setType] = useState('add');
  const [userData, setUserData] = useState({});
  const [value, setValue] = useState(1);
  const [isInfoDialog, setIsInfoDialog] = useState(false);
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [current, setCurrent] = useState({});
  const classes = useStyles();

  useEffect(() => {
    if (value) {
      callCorporateAccountApi();
      callGetCdf();
      callInvoiceFlush();
    }
  }, [value]);

  const deleteVehicle = async (val) => {
    const result = await callDeleteCorporateAccount(val);
    if (result) {
      callCorporateAccountApi();
      deleteToggle();
    }
  };

  const deleteToggle = () => {
    setIsDeleteDialog(!isDeleteDialog);
  };

  const handleChange = (event, newValue) => {
    if (newValue === 2) {
      setValue(newValue);
      setType('add');
    } else {
      setValue(newValue);
      setUserData({});
    }
  };

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

  const deleteDialog = () => {
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
            Do you want to delete this corporate account from the list ?
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
            onClick={() => deleteVehicle(current.account_id)}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const infoDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        isOpen={isInfoDialog}
        fullWidth={true}
        maxWidth={'xl'}
        sxAppBar={{ justifyContent: 'center' }}
        sxTitle={{ fontSize: 24, textAlign: 'center' }}
        closeIcon={true}
        title={`Account Name - ${current.name ? current.name : 'N/A'}`}
        handleClose={() => {
          infoToggle();
        }}
      >
        <DialogContent>
          <InfoDetails data={current} />
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: 'space-evenly', display: 'flex', mt: 2 }}
        >
          <Button
            className={classes.buttonForceAction}
            color="error"
            variant="outlined"
            onClick={() => infoToggle()}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const infoToggle = () => {
    setIsInfoDialog(!isInfoDialog);
  };

  const clearDataToDeault = () => {
    setValue(1);
    setUserData({});
    setType('add');
  };

  return (
    <div className={classes.root}>
      <WindowTitle title="Corporate Account" />
      <CssBaseline />
      <Sidebar onChange={() => setValue(1)} />
      <main className={classes.mainRoot}>
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
                <TopTab label="C-Accounts List" value={1} />
                <TopTab
                  label={
                    strictValidObjectWithKeys(userData)
                      ? 'Edit C-Account'
                      : 'Add C-Account'
                  }
                  value={2}
                />
              </TabList>
              <Stack direction="row" alignItems="center">
                <Clock>
                  <Button
                    size="medium"
                    variant="contained"
                    onClick={() => {
                      setValue(2);
                      setUserData({});
                    }}
                    color="primary"
                    startIcon={<AddIcon />}
                    className={classes.button}
                    disabled={value === 2}
                  >
                    Add C-Account
                  </Button>
                </Clock>
              </Stack>
            </Box>
            <main className={classes.content}>
              <TabPanel sx={tablePadding} value={1} index={1}>
                <Grid item xs={12} md={12} lg={12}>
                  <ReactTable
                    isLoadInner={isLoadInner}
                    loading={isLoad}
                    customText={
                      "You don't have any configured Corporate Accounts"
                    }
                    columnDefs={[
                      {
                        Header: 'Name',
                        accessor: 'name',
                        width: 240,
                        Cell: (props) => (
                          <>
                            <MDTooltip title={props.row.original.name}>
                              <Typography height={55}>
                                {props.row.original.name}
                              </Typography>
                            </MDTooltip>
                          </>
                        ),
                      },
                      {
                        Header: 'Physical Address',
                        width: 230,
                        accessor: (originalRow, rowIndex) => {
                          return (
                            strictValidObjectWithKeys(originalRow) &&
                            originalRow.address +
                              ' ' +
                              originalRow.postal_code +
                              ' ' +
                              originalRow.country
                          );
                        },
                        Cell: (props) => (
                          <>
                            <MDTooltip
                              title={
                                props.row.original.address +
                                ' ' +
                                props.row.original.postal_code +
                                ' ' +
                                props.row.original.country
                              }
                            >
                              <Typography height={55}>
                                {props.row.original.address +
                                  ' ' +
                                  props.row.original.postal_code +
                                  ' ' +
                                  props.row.original.country}
                              </Typography>
                            </MDTooltip>
                          </>
                        ),
                      },
                      {
                        Header: 'Billing Address',
                        width: 230,
                        accessor: (originalRow, rowIndex) => {
                          return (
                            strictValidObjectWithKeys(originalRow) &&
                            originalRow.billing_address +
                              ' ' +
                              originalRow.billing_postal_code +
                              ' ' +
                              originalRow.billing_country
                          );
                        },
                        Cell: (props) => (
                          <MDTooltip
                            title={
                              props.row.original.billing_address +
                              ' ' +
                              props.row.original.billing_postal_code +
                              ' ' +
                              props.row.original.billing_country
                            }
                          >
                            <Typography height={55}>
                              {props.row.original.billing_address +
                                ' ' +
                                props.row.original.billing_postal_code +
                                ' ' +
                                props.row.original.billing_country}
                            </Typography>
                          </MDTooltip>
                        ),
                      },
                      {
                        Header: 'Account Email',
                        accessor: 'email_id',
                      },
                      {
                        Header: 'ER Phone Number',
                        width: 160,
                        accessor: (originalRow, rowIndex) => {
                          let output = [];
                          _.map(originalRow.company_contact, (res) => {
                            output.push(res.phone);
                          });
                          return output.join(', ');
                        },
                        Filter: PhoneFilters,
                        Cell: (props) => (
                          <>
                            <CellMapTypes
                              type="company_contact"
                              renderValue="phone"
                              renderType="phone"
                              data={props.row.original.company_contact}
                            />
                          </>
                        ),
                      },
                      {
                        Header: 'Contact Name',
                        width: 160,
                        accessor: (originalRow, rowIndex) => {
                          let output = [];
                          _.map(originalRow.corporate_contact, (res) => {
                            output.push(`${res.last_name}, ${res.first_name}`);
                          });
                          return output.join(', ');
                        },
                        id: 'company_first_name',
                        Cell: (props) => (
                          <>
                            <CellMapTypes
                              renderValue="first_name"
                              data={props.row.original.corporate_contact}
                            />
                          </>
                        ),
                      },
                      {
                        Header: 'Contact Email',
                        width: 230,
                        accessor: (originalRow, rowIndex) => {
                          let output = [];
                          _.map(originalRow.corporate_contact, (res) => {
                            output.push(res.email_id);
                          });
                          return output.join(', ');
                        },
                        id: 'company_email_id',
                        Cell: (props) => (
                          <>
                            <CellMapTypes
                              renderValue="email_id"
                              data={props.row.original.corporate_contact}
                            />
                          </>
                        ),
                      },
                      {
                        Header: 'Contact Phone',
                        Filter: PhoneFilters,
                        accessor: (originalRow, rowIndex) => {
                          let output = [];
                          _.map(originalRow.corporate_contact, (res) => {
                            output.push(res.phone_number);
                          });
                          return output.join(', ');
                        },
                        id: 'company_phone',
                        Cell: (props) => (
                          <>
                            <CellMapTypes
                              renderValue="phone_number"
                              type="corporate_contact_phone"
                              data={props.row.original.corporate_contact}
                            />
                          </>
                        ),
                      },
                      {
                        Header: 'Actions',
                        accessor: '',
                        width: 140,
                        Filter: false,
                        Cell: (props) => (
                          <>
                            <EditableButton
                              infoButton={true}
                              editButtonClicked={() => {
                                const field = props.row.original;
                                setUserData({
                                  ...field,
                                  account_field: (field.account_field =
                                    strictValidArrayWithLength(
                                      field.account_field,
                                    ) &&
                                    field.account_field.map((a) => {
                                      let arr = [];
                                      if (a.type === 'enum') {
                                        a.po_per_cost = map(
                                          a.cost_center_value,
                                          (item) => {
                                            const {
                                              value,
                                              po_number,
                                              show_po,
                                            } = item;
                                            arr.push(value);
                                            return {
                                              name: item.value,
                                              po_number,
                                              show_po,
                                            };
                                          },
                                        );
                                        a.cost_center_value = arr;
                                      }
                                      return a;
                                    })),
                                });
                                setValue(2);
                                setType('edit');
                                // setUserData(field);
                              }}
                              deleteButtonClicked={() => {
                                const field = props.row.original;
                                deleteToggle();
                                setCurrent(field);
                              }}
                              infoButtonClick={() => {
                                const field = props.row.original;
                                infoToggle();
                                setCurrent(field);
                              }}
                            />
                          </>
                        ),
                      },
                    ]}
                    rowData={Array.isArray(corporateAcc) ? corporateAcc : []}
                  />
                </Grid>
              </TabPanel>
              <TabPanel value={2}>
                <AddCorporateAccount
                  type={type}
                  setValue={() => clearDataToDeault()}
                  userData={userData}
                />
              </TabPanel>
              <TabPanel value={3}></TabPanel>
            </main>
          </TabContext>
        </Grid>
      </main>
      {deleteDialog()}
      {infoDialog()}
    </div>
  );
};

CorporateAccount.propTypes = {
  callCorporateAccountApi: PropTypes.func,
  isLoad: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

CorporateAccount.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.corporateAccounts.message,
    isLoad: state.corporateAccounts.isLoad,
    isLoadInner: state.corporateAccounts.isLoadInner,
    loadErr: state.corporateAccounts.loadErr,
    corporateAcc: state.corporateAccounts.all_corporate_acounts,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callCorporateAccountApi: (...params) =>
    dispatch(getCorporateAccounts(...params)),
  callGetCdf: (...params) => dispatch(getCdf(...params)),
  callDeleteCorporateAccount: (...params) =>
    dispatch(deleteCorporateAccountByID(...params)),
  callInvoiceFlush: (...params) => dispatch(invoiceFlush(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(CorporateAccount);

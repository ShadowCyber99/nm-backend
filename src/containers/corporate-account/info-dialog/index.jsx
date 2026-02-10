/* eslint-disable array-callback-return */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  defaultCurrencyFormat,
  strictValidArrayWithLength,
  strictValidNumber,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/common-utils';
import { makeStyles } from '@mui/styles';
import MDTooltip from '../../../components/tooltip';
import { compact, get, join, map, size, truncate } from 'lodash';
import ReactTable from '../../../components/react-table';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getInvoiceCharge } from '../action';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  generalMargin: {
    margin: theme.spacing(2, 0),
  },
  margin: {
    margin: theme.spacing(0.5, 0, 0),
    width: 'fit-content',
  },
  defineWidth: {
    width: 320,
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

const InfoDetails = ({ data, callGetInvoiceCharges, charges, isLoad }) => {
  const classes = useStyles();
  const [priceList, setPriceList] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAccordionChange = (event, expanded) => {
    setIsExpanded(expanded);

    if (expanded) {
      const newdata = {
        account_id: data?.account_id,
      };
      callGetInvoiceCharges(newdata);
    }
  };

  const renderTitleWithSpace = (title) => {
    return (
      <Box className={classes.defineWidth}>
        <Typography variant="headerTitle">{title}</Typography>
      </Box>
    );
  };

  const renderTextWithSpace = (title) => {
    return (
      <Box className={classes.defineWidth}>
        <Typography style={{ fontSize: 18 }} variant="body2">
          {title}
        </Typography>
      </Box>
    );
  };

  useEffect(() => {
    if (strictValidArrayWithLength(charges)) {
      const arr = [];
      charges.map((a) => {
        if (
          strictValidString(a.service_name) &&
          a.service_name !== 'account_id' &&
          a.service_name !== 'id' &&
          a.service_name !== 'Version' &&
          a.service_name !== 'Start Date' &&
          a.service_name !== 'End Date' &&
          a.service_name !== 'Cancellation Fee'
        ) {
          arr.push({
            service_name: a.service_name,
            service_charge: a.service_charge,
          });
          return a.service_name;
        }
      });
      setPriceList(arr);
    }
  }, [charges]);

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
  const renderInvoice = (user) => {
    switch (user) {
      case true:
        return 'Yes';
      case false:
        return 'No';
      default:
        return '';
    }
  };
  const CostCenterStr = ({ item }) => {
    const tempStr =
      strictValidObjectWithKeys(item) &&
      strictValidArrayWithLength(item.cost_center_value)
        ? join(
            compact(map(get(item, 'cost_center_value', []), (i) => i.value)),
            ', ',
          )
        : '';
    return (
      <Typography
        sx={{
          ml: 1,
        }}
      >
        {size(tempStr) > 50 ? (
          <MDTooltip title={tempStr}>
            <Typography id="label-unq-id1">
              {truncate(tempStr, {
                length: 50,
                omission: '....',
              })}
            </Typography>
          </MDTooltip>
        ) : (
          tempStr
        )}
      </Typography>
    );
  };

  return (
    <Box>
      {strictValidObjectWithKeys(data) && (
        <React.Fragment>
          <Box className={classes.bottomMargin}>
            <Typography variant="headerMainTitle">
              General Information
            </Typography>
          </Box>
          <Stack mt={2} direction={'row'} display="flex">
            <Box>
              {renderTitleWithSpace('Name')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data) && data.name,
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('Legal ID')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data) && data.legal_id,
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('Legal Name')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data) && data.legal_name,
              )}
            </Box>
          </Stack>
          <Stack mt={2} direction={'row'} display="flex">
            <Box>
              {renderTitleWithSpace('Physical Address')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data) && data.address,
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('Postal Code')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data) && data.postal_code,
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('Country')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data) && data.country,
              )}
            </Box>
          </Stack>
          <Stack mt={2} direction={'row'} display="flex">
            <Box>
              {renderTitleWithSpace('Billing Address')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data) && data.billing_address,
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('Postal Code')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data) && data.billing_postal_code,
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('Country')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data) && data.billing_country,
              )}
            </Box>
          </Stack>
          <Stack mt={2} direction={'row'} display="flex">
            <Box>
              {renderTitleWithSpace('Account Email')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data) && data.email_id,
              )}
            </Box>
          </Stack>
          <Stack mt={2} direction={'row'} display="flex">
            <Box>
              {renderTitleWithSpace('Er Phone Number')}
              {data.company_contact.map((item, index) => (
                <div>{renderSubtitleWithSpace(item.phone)}</div>
              ))}
            </Box>
          </Stack>
          <Stack mt={2} direction={'row'} display="flex">
            <Box>
              {renderTitleWithSpace('Customer #')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data) && data.customer_ref_no,
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('Billing Period')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data) && data.billing_period,
              )}
            </Box>
            <Box>
              {renderTitleWithSpace('Balance')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data) && data.balance,
              )}
            </Box>
          </Stack>
          <Stack mt={2} direction={'row'} display="flex">
            <Box>
              {renderTitleWithSpace('PO Number')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data) && data.po_number,
              )}
            </Box>
          </Stack>
          <Divider className={classes.generalMargin} />
          {/* Company Contacts */}
          <Box className={classes.bottomMargin}>
            <Typography variant="headerMainTitle">Contacts</Typography>
          </Box>
          {strictValidArrayWithLength(data.corporate_contact) &&
            data.corporate_contact.map((item) => {
              return (
                <Stack mt={2} direction={'row'} display="flex">
                  <Box>
                    {renderTitleWithSpace('First Name')}
                    {renderSubtitleWithSpace(item.first_name)}
                  </Box>

                  <Box>
                    {renderTitleWithSpace('Last Name')}
                    {renderSubtitleWithSpace(item.last_name)}
                  </Box>
                  <Box>
                    {renderTitleWithSpace('Phone Number')}
                    {item.phone_number?.length > 0
                      ? item.phone_number.map((item, index) => {
                          return <div>{renderSubtitleWithSpace(item)}</div>;
                        })
                      : renderSubtitleWithSpace('N/A')}
                    {/* {renderSubtitleWithSpace(item.phone_number[0])} */}
                  </Box>
                  <Box>
                    {renderTitleWithSpace('Email')}
                    {renderSubtitleWithSpace(
                      item.email_id === 'null' || item.email_id === 'undefined'
                        ? 'N/A'
                        : item.email_id,
                    )}
                  </Box>
                </Stack>
              );
            })}
          <Divider className={classes.generalMargin} />
          {/* Invoicing Options */}
          <Box className={classes.bottomMargin}>
            <Typography variant="headerMainTitle">Invoicing Options</Typography>
          </Box>
          <Stack mt={2} direction={'row'} display="flex">
            <Box>
              {renderTitleWithSpace(`Add Contact's details in the invoice`)}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data) &&
                  renderInvoice(data.invoice_contact),
              )}
            </Box>
            <Box>
              {renderTitleWithSpace(`Invoice per patient`)}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data) &&
                  renderInvoice(data.invoice_per_patient),
              )}
            </Box>
            <Box>
              {renderTitleWithSpace(`Invoice Cycle`)}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data) && data.invoice_cycle,
              )}
            </Box>
          </Stack>
          <Divider className={classes.generalMargin} />
          <Box className={classes.bottomMargin}>
            <Typography variant="headerMainTitle">Invoicing Rules</Typography>
          </Box>
          <Stack mt={2} direction={'column'} display="flex">
            <Box>
              {renderTitleWithSpace('Discount')}
              {renderSubtitleWithSpace(
                strictValidObjectWithKeys(data) && data.discount + '%',
              )}
            </Box>
            <Grid mt={2} item xs={2} md={8}>
              <Accordion
                className={classes.accordion}
                defaultExpanded={false}
                onChange={handleAccordionChange}
                expanded={isExpanded}
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
                  {renderTextWithSpace('Invoice Charges')}
                </AccordionSummary>
                <AccordionDetails>
                  {isLoad ? (
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
                  ) : (
                    strictValidArrayWithLength(priceList) && (
                      <>
                        <ReactTable
                          globalFilterShow={false}
                          customHeight={true}
                          headerFilter={false}
                          tableSize={true}
                          height={{
                            minHeight: 100,
                            maxheight: 100,
                            overfleow: 'scroll',
                          }}
                          loading={false}
                          pagination={false}
                          fontSizeLg={true}
                          customText="No Feedbacks Found"
                          columnDefs={[
                            {
                              Header: 'Service Name',
                              accessor: 'service_name',
                              width: 120,
                              disableSortBy: true,
                              Cell: (props) => (
                                <Stack>
                                  <Typography sx={{ fontSize: 17 }}>
                                    {props.row.original.service_name}
                                  </Typography>
                                </Stack>
                              ),
                            },
                            {
                              Header: 'Price',

                              width: 60,
                              disableSortBy: true,
                              Cell: (props) => (
                                <Stack>
                                  <Typography sx={{ fontSize: 17 }}>
                                    {defaultCurrencyFormat(
                                      props.row.original.service_charge,
                                    )}
                                  </Typography>
                                </Stack>
                              ),
                            },
                          ]}
                          rowData={priceList || []}
                        />
                      </>
                    )
                  )}
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Stack>
          <Divider className={classes.generalMargin} />
          {/* Custom Fields */}
          <Box className={classes.bottomMargin}>
            <Typography variant="headerMainTitle">Custom Fields</Typography>
          </Box>
          {strictValidArrayWithLength(data.account_field) &&
            data.account_field.map((item) => {
              return (
                <Stack mt={2} direction={'row'} display="flex">
                  <Box>
                    {renderTitleWithSpace('Label')}
                    {renderSubtitleWithSpace(item.label)}
                  </Box>

                  <Box>
                    {renderTitleWithSpace('Mandatory')}
                    {renderSubtitleWithSpace(item.mandatory)}
                  </Box>
                  <Box sx={{ flexDirection: 'row' }}>
                    {strictValidObjectWithKeys(item) &&
                    strictValidArrayWithLength(item.cost_center_value) ? (
                      <>
                        {renderTitleWithSpace(item.label)}
                        <CostCenterStr item={item} />
                      </>
                    ) : (
                      ''
                    )}
                  </Box>
                </Stack>
              );
            })}
          <Divider className={classes.generalMargin} />
        </React.Fragment>
      )}
    </Box>
  );
};

const mapStateProps = (state) => {
  return {
    charges: state.corporateAccounts.charges,
    isLoad: state.corporateAccounts.charges_load,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callGetInvoiceCharges: (...params) => dispatch(getInvoiceCharge(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(InfoDetails);

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Divider, Link } from '@mui/material';

import {
  formatDate,
  validObjectWithParameterKeys,
} from '../../../utils/common-utils';
import Dialog from '../../../components/dialog';

const AcknowledgeDialog = ({
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
  // let contact_data = {};
  // if (strictValidArrayWithLength(data.emailArray)) {
  //   if (
  //     strictValidArrayWithLength(data.new_corporate_contact) &&
  //     data.new_corporate_contact[0] &&
  //     data.new_corporate_contact[0].first_name
  //   ) {
  //     contact_data = data.new_corporate_contact[0];
  //   } else {
  //     contact_data = strictFindObjectWithKey(
  //       data.emailArray,
  //       'value',
  //       data.corporate_contact[0].corporate_contact_id,
  //     );
  //     contact_data.first_name = data.corporate_contact[0].first_name;
  //   }
  // }

  return (
    // <Dialog
    //   fullWidth={fullWidth}
    //   fullScreen={fullScreen}
    //   open={isOpen}
    //   maxWidth={maxWidth}
    //   // onClose={handleClose}
    //   TransitionComponent={transition ? Transition : TransitionNormal}
    //   style={style}
    //   className={className}
    //   BackdropProps={{
    //     classes: {
    //       root: classes.backDrop,
    //     },
    //   }}
    //   {...rest}
    // >
    <Dialog
      appBarColor="info"
      title={'Info'}
      fullScreen={false}
      closeIcon={false}
      isOpen={isOpen}
      fullWidth={true}
      maxWidth={'md'}
      sxAppBar={{ justifyContent: 'center', alignItems: 'center' }}
      sxTitle={{ fontSize: 24 }}
    >
      <Box
        m={3}
        sx={{ mt: 1 }}
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        <Typography display="inline-block" variant="body4">
          Your{' '}
          <Typography display="inline-block" variant="headerTitle">
            {validObjectWithParameterKeys(data, ['capability_name'])
              ? data.capability_name
              : 'N/A'}
          </Typography>{' '}
          transportation request for{' '}
          <Typography display="inline-block" variant="headerTitle">
            {data.last_name + ' ' + data.first_name}
          </Typography>{' '}
          on {''}
          <Typography display="inline-block" variant="headerTitle">
            {formatDate(data.date, 'dddd')}
          </Typography>
          ,{' '}
          <Typography display="inline-block" variant="headerTitle">
            {formatDate(data.date)}
          </Typography>{' '}
          has been received.
        </Typography>
        <Box flexDirection="column" display="flex" alignItems="center">
          <Typography
            display="inline-block"
            sx={{ mt: 0.5 }}
            align="center"
            variant="body4"
          >
            For last minute updates, questions, or changes please contact us at{' '}
            <Link
              href="tel:(480) 217-3920"
              display="inline-block"
              variant="headerTitle"
            >
              (480) 217-3920
            </Link>
            {' . '}
          </Typography>
          <Typography sx={{ mt: 0.5 }} align="center" variant="body4">
            If there is any reason GMTCare cannot accommodate the request as
            received, we will contact you ASAP to discuss.
          </Typography>
          <Typography sx={{ mt: 0.5 }} align="center" variant="body4">
            To avoid a cancellation fee, please cancel the request no later than
            2 hours before the transport time.
          </Typography>
          <Typography sx={{ mt: 0.5 }} align="center" variant="headerTitle">
            Thank you for trusting GMTCare!
          </Typography>
        </Box>
      </Box>
      <Divider variant="middle" />
      <Box justifyContent="center" alignItems="center" display="flex" m={3}>
        {children}
      </Box>
    </Dialog>
  );
};

export default AcknowledgeDialog;

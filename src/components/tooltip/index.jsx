import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { strictValidArrayWithLength, strictValidString } from '../../utils/common-utils';
const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip placement="top" {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'rgb(8, 132, 199)',
    color: 'rgba(255,255,255,1)',
    boxShadow: theme.shadows[1],
    fontSize: 16,
  },
}));

const MDTooltip = ({ title, children, isMultiple = false }) => {
  const titleVal = isMultiple
    ? strictValidArrayWithLength(title) ? title : 'N/A'
    : strictValidString(title)
    ? title
    : 'N/A';
  return (
    <>
      <LightTooltip title={titleVal}>{children}</LightTooltip>
    </>
  );
};
export default MDTooltip;

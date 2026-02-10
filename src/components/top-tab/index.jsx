import { styled } from '@mui/material/styles';
import { Tab } from '@mui/material';
const TopTab = styled((props) => {
  return <Tab disableRipple {...props} id={props.ids} />;
})(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  [theme.breakpoints.up('sm')]: {
    minWidth: 0,
  },
  fontWeight: '700',
  marginRight: theme.spacing(1),
  color: '#7E8287',
  backgroundColor: '#EBEBEB',
  margin: theme.spacing(1, 0, 0, 1),
  borderRadius: 5,
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  '&:hover': {
    color: theme.palette.primary.main,
    opacity: 1,
    fontWeight: '700',
  },
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    backgroundColor: '#F3F3F3',
    fontWeight: '700',
    boxShadow:
      '0px 3px 1px -2px red,0px 2px 2px 0px #F3F3F3,0px 1px 5px 0px rgba(0,0,0,0.12)',
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#d1eaff',
  },
}));

export default TopTab;

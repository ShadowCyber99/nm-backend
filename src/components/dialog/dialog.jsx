import React from 'react';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  bottomBar: {
    top: 'auto',
    bottom: 0,
    background: '#fff',
  },
  margin: {
    marginLeft: theme.spacing(1),
  },
  alignRight: {
    textAlign: 'right',
    display: 'block',
    width: '100%',
  },
  backDrop: {
    backgroundColor: 'rgba(235, 235, 235, 0.7)',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const TransitionNormal = React.forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />;
});

const DialogComponent = ({
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
  closeIcon = true,
  scroll = 'paper',
  appBarColor = 'primary',
  sxTitle,
  sxAppBar,
  ...rest
}) => {
  const classes = useStyles();
  return (
    <Dialog
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      open={isOpen}
      maxWidth={maxWidth}
      scroll={scroll}
      // onClose={handleClose}
      TransitionComponent={transition ? Transition : TransitionNormal}
      style={style}
      className={className}
      BackdropProps={{
        classes: {
          root: classes.backDrop,
        },
      }}
      {...rest}
    >
      <AppBar sx={sxAppBar} color={appBarColor} className={classes.appBar}>
        {header && (
          <Toolbar>
            <Typography sx={sxTitle} variant="h6" className={classes.title}>
              {title}
            </Typography>
            {closeIcon && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            )}
          </Toolbar>
        )}
      </AppBar>
      <Box m={3} sx={{overflow: 'auto'}}>{children}</Box>
    </Dialog>
  );
};

export default DialogComponent;

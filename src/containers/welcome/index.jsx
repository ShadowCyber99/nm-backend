/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { CssBaseline, Grid, Typography } from "@mui/material";
import Sidebar from "../../components/sidebar";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  MotionContainer,
  varBounceIn,
  varBounceInWelcome,
} from "../../components/animate";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";
import { strictValidObjectWithKeys, titleCase } from "../../utils/common-utils";
import WindowTitle from "../../components/window-name/index.jsx";
import Clock from "../../components/clock";
import BGLOGO from "./../../assets/GMT.png";
import { getActiveCapabilityRoles } from "../drivers-management/action";
import { getMyProfile } from "./action";
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
  button: {
    margin: theme.spacing(1),
  },
  buttonMargin: {
    margin: theme.spacing(3, 0),
  },
  titleWidth: {
    width: 250,
    margin: theme.spacing(1, 0),
    fontSize: 35,
    textAlign: "left",
  },
  subtitleWidth: {
    width: 400,
    margin: theme.spacing(1, 0),
    fontSize: 40,
    textAlign: "left",
  },
}));

const Welcome = ({
  isLoad,
  isLoadInner,
  message,
  setData,
  userprofile,
  callCapabilityRolesApi,
  loadErr,
  callGetMyProfileApi
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  useEffect(() => {
    callCapabilityRolesApi();
    callGetMyProfileApi();
  }, []);

  useEffect(() => {
    if (loadErr)
      enqueueSnackbar(loadErr, {
        variant: "error",
        preventDuplicate: true,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
  }, [loadErr]);

  const renderDetails = (title, subtitle) => {
    return (
      <Box
        flexDirection="row"
        display={"flex"}
        justifyContent="space-around"
        alignItems="center"
        sx={{ width: 900, ml: 12 }}
      >
        <Typography className={classes.titleWidth} variant="h4">
          {title}
        </Typography>
        <Typography className={classes.subtitleWidth} variant="h4">
          {titleCase(subtitle)}
        </Typography>
      </Box>
    );
  };

  return (
    <div className={classes.root}>
      <WindowTitle title="Welcome" />
      <CssBaseline />
      <Sidebar onChange={() => console.log()} />
      <main className={classes.content}>
        <Grid item>
          <Box
            style={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              paddingBottom: 15,
              paddingTop: 15,
            }}
            className={classes.tabStyle}
            flexDirection={'row'}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Typography variant="h4">{}</Typography>
            <Clock />
          </Box>
          <Grid item xs={12} md={12} lg={12}>
            <Box
              sx={{
                // margin: 'auto',
                textAlign: 'center',
                marginTop: 25,
              }}
            >
              <MotionContainer initial="initial" open>
                <motion.div variants={varBounceInWelcome}>
                  <Box
                    sx={{
                      height: 300,
                      mx: 'auto',
                    }}
                  >
                    <img
                      src={BGLOGO}
                      style={{ height: 220, width: 700 }}
                      alt="logo"
                    />
                  </Box>
                </motion.div>
              </MotionContainer>
              {strictValidObjectWithKeys(userprofile) && (
                <motion.div variants={varBounceIn}>
                  <Typography
                    sx={{ fontSize: 50, mb: 5, letterSpacing: 1.5 }}
                    variant="h4"
                  >
                    Welcome to GMTCare New Mexico
                  </Typography>
                </motion.div>
              )}
              <Box
                alignItems="center"
                justifyContent="center"
                display="flex"
                flexDirection="column"
              >
                {renderDetails(
                  'Name',
                  strictValidObjectWithKeys(userprofile) &&
                    userprofile.first_name + ' ' + userprofile.last_name,
                )}
                {renderDetails(
                  'Email',
                  strictValidObjectWithKeys(userprofile) &&
                    (`${userprofile.email_id}` || 'N/A'),
                )}
                {renderDetails(
                  'Role',
                  strictValidObjectWithKeys(userprofile) &&
                    (`${userprofile.role}` || 'N/A'),
                )}
                {renderDetails(
                  'Version',
                  strictValidObjectWithKeys(userprofile) &&
                    (`${userprofile.backend_version}` || 'N/A'),
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </main>
    </div>
  );
};

Welcome.propTypes = {
  callGetMyProfileApi: PropTypes.func,
  isLoad: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.string,
};

Welcome.defaultProps = {
  isLoad: false,
  loadErr: "",
  message: "",
};

const mapStateProps = (state) => {
  return {
    message: state.user.message,
    isLoad: state.user.isLoad,
    loadErr: state.user.loadErr,
    userprofile: state.profile.userprofile,
    isLoadInner: state.user.isLoadInner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callGetMyProfileApi: (...params) => dispatch(getMyProfile(...params)),
  callCapabilityRolesApi: (...params) =>
    dispatch(getActiveCapabilityRoles(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(Welcome);

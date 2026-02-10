/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid, Skeleton, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { getApplicationLogs, getSocketApplicationLogs } from "../action";
import PropTypes from "prop-types";
import {
  formatDateTime,
  strictValidArrayWithLength,
} from "../../../utils/common-utils";
import { useSnackbar } from "notistack";
import "./style.css";
import _ from "lodash";
import { SocketContext } from "../../../hooks/useSocketContext";
const ApplicationLogs = ({
  isLoad,
  isLoadInner,
  freeze,
  message,
  callApplicationLogs,
  data,
  loadErr,
  callSocketApplicationLogs,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const socket = useContext(SocketContext);

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

  useEffect(() => {
    if (message)
      enqueueSnackbar(message, {
        variant: "success",
        preventDuplicate: true,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
  }, [message]);

  useEffect(() => {
    callApplicationLogs();
  }, []);

  useEffect(() => {
    socket.on("audit_log", () => {
      callSocketApplicationLogs(freeze);
    });
    return () => {
      socket.off("audit_log");
    };
  }, []);

  return (
    <div>
      <Box py={0.5} display="flex" justifyContent="center" alignItems="center">
        <Typography
          variant="h4"
          sx={{
            fontSize: 30,
          }}
        >
          Only last 100 Logs are shown
        </Typography>
      </Box>
      <div style={{ backgroundColor: "#fff", height: "100%" }}>
        <Grid sx={{ mt: 1 }}>
          <div className="ListStyle">
            {isLoad && (
              <React.Fragment>
                {_.range(1, 50, 1).map((a) => (
                  <>
                    <Skeleton height={20} animation="wave" />
                  </>
                ))}
              </React.Fragment>
            )}
            {!isLoad && strictValidArrayWithLength(data)
              ? data.map((a, index) => {
                  return (
                    <Grid item xs={12} md={12} key={a.id}>
                      <React.Fragment>
                        <Box
                          className={index % 2 ? "ListItemOdd" : "ListItemEven"}
                          display="flex"
                          flexDirection="row"
                          px={1}
                        >
                          <Typography
                            display="inline-block"
                            variant="subtitle1"
                          >
                            {formatDateTime(a.created_on)}
                            <Typography
                              display="inline-block"
                              variant="subtitle1"
                            >
                              &nbsp; {a.user_name}
                            </Typography>
                            <Typography
                              display="inline-block"
                              variant="subtitle1"
                            >
                              &nbsp;{a.object_name}
                            </Typography>
                            <Typography
                              display="inline-block"
                              variant="subtitle1"
                            >
                              &nbsp;{a.info}
                            </Typography>
                          </Typography>
                        </Box>
                      </React.Fragment>
                    </Grid>
                  );
                })
              : null}
          </div>
        </Grid>
      </div>
    </div>
  );
};

ApplicationLogs.propTypes = {
  callApplicationLogs: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

ApplicationLogs.defaultProps = {
  isLoad: false,
  loadErr: "",
  message: "",
};

const mapStateProps = (state) => {
  return {
    message: state.logs.application.message,
    isLoad: state.logs.application.isLoad,
    loadErr: state.logs.application.loadErr,
    data: state.logs.application.data,
    freeze: state.logs.audit.data,
    isLoadInner: state.logs.application.isLoadInner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callApplicationLogs: (...params) => dispatch(getApplicationLogs(...params)),
  callSocketApplicationLogs: (...params) =>
    dispatch(getSocketApplicationLogs(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(ApplicationLogs);

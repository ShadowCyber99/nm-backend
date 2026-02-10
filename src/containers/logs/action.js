import { decrypted, encrypted } from "../../utils/common-utils";
import { logsConstants } from "./constants";

export const getApplicationLogs = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: logsConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get("/admin/application-log");
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: logsConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    // Else if valid response continue
    await dispatch({
      type: logsConstants.APPLICATION_LOGS,
      application_log: decrypted(res.data),
    });
    await dispatch({
      type: logsConstants.LOAD_SUCCESS,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: logsConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getSocketApplicationLogs =
  () => async (dispatch, getState, api) => {
    const data = getState().logs.audit.audit_log;
    // Start loading
    try {
      // Call api to authenticate user
      if (!data) {
        const res = await api.get("/admin/application-log");
        // If not valid response object
        if (res.status === 0) {
          await dispatch({
            error: res.message,
          });
          return false;
        }
        // Else if valid response continue
        await dispatch({
          type: logsConstants.APPLICATION_LOGS,
          application_log: decrypted(res.data),
        });
        return true;
      }
    } catch (error) {
      return false;
    }
  };
// export const getSocketAuditLogs = (data) => async (dispatch, getState, api) => {
//   // Start loading
//   data = encrypted(data);
//   try {
//     // Call api to authenticate user
//     const res = await api.post("/admin/audit-log", { data });
//     // If not valid response object
//     if (res.status === 0) {
//       await dispatch({
//         error: res.message,
//       });
//       return false;
//     }
//     // Else if valid response continue
//     await dispatch({
//       type: logsConstants.AUDIT_LOGS,
//       application_log: decrypted(res.data),
//     });
//     return true;
//   } catch (error) {
//     return false;
//   }
// };

export const flushAppLogs = (data) => async (dispatch, getState) => {
  dispatch({
    type: logsConstants.FLUSH_APPLICATION_LOGS,
    data: {},
  });
};
export const getAuditLogs = (data) => async (dispatch, getState, api) => {
  // Start loading
  try {
    // Call api to authenticate user
    await dispatch({
      type: logsConstants.AUDIT_LOGS,
      audit_log: data,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    return false;
  }
};

export const getAuditLogsWithFilter =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: logsConstants.LOAD });
    data = encrypted(data);
    try {
      // Call api to authenticate user
      const res = await api.post("/admin/application-log", { data });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: logsConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }
      // Else if valid response continue
      await dispatch({
        type: logsConstants.LOGS_AUDIT,
        logs_audit: decrypted(res.data),
      });
      await dispatch({
        type: logsConstants.LOAD_SUCCESS,
      });
      return decrypted(res.data);
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: logsConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };

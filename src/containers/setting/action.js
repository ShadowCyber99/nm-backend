import { encrypted } from "../../utils/common-utils";
import { passwordConstants } from "./constants";


export const passwordUpdate = (data) => async (dispatch, getState, api) => {
    // Start loading
    try {
        // Call api to authenticate user
        data = encrypted(data);
        const res = await api.post("/update-password", { data });
        // If not valid response object
        if (res.status === 0) {
            await dispatch({
                type: passwordConstants.LOAD_FAIL,
                error: res.message,
            });
            return false;
        }
        // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
        await dispatch({
            type: passwordConstants.LOAD_SUCCESS,
            message: res.message,
        });
        return true;
    } catch (error) {
        // If an error occurs, set error field
        dispatch({
            type: passwordConstants.LOAD_FAIL,
            error,
        });
        return false;
    }
};
export const passwordMessageReset = (id) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: passwordConstants.FLUSH_MESSAGES });
};
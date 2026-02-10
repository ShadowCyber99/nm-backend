import {vehicleConstants} from './constants'
import {decrypted, encrypted, validObjectWithParameterKeys} from '../../utils/common-utils'

export const createVehicle = (data) => async (dispatch, getState, api) => {
	// Start loading
	dispatch({type: vehicleConstants.LOAD})
	try {
		// Call api to authenticate user
		data = encrypted(data); 
		const res = await api.post('/admin/driver', {data})
		// If not valid response object
		if (res.status === 0) {
			await dispatch({
				type: vehicleConstants.LOAD_FAIL,
				error: res.message,
			})
			return false
		}

		// Else if valid response continue
		await dispatch({
      type: vehicleConstants.SAVE_VEHICEL,
      save_item: decrypted(res.data),
    });
		// dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
		await dispatch({
			type: vehicleConstants.LOAD_SUCCESS,
			message: res.message,
		})
		return true
	} catch (error) {
		// If an error occurs, set error field
		dispatch({
			type: vehicleConstants.LOAD_FAIL,
			error,
		})
		return false
	}
}

export const getActiveCapabilityRoles = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: vehicleConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get('/admin/active-capability', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: vehicleConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: vehicleConstants.CAPABILITY_ROLES,
      roles: decrypted(res.data),
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: vehicleConstants.LOAD_SUCCESS,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: vehicleConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getCapabilityRoles = (data) => async (dispatch, getState, api) => {
	// Start loading
	dispatch({type: vehicleConstants.LOAD})
	try {
		// Call api to authenticate user
		const res = await api.get('/admin/capability', {data})
		// If not valid response object
		if (res.status === 0) {
			await dispatch({
				type: vehicleConstants.LOAD_FAIL,
				error: res.message,
			})
			return false
		}

		// Else if valid response continue
		await dispatch({
      type: vehicleConstants.CAPABILITY_ROLES,
      roles: decrypted(res.data),
    });
		// dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
		await dispatch({
			type: vehicleConstants.LOAD_SUCCESS,
		})
		return true
	} catch (error) {
		// If an error occurs, set error field
		dispatch({
			type: vehicleConstants.LOAD_FAIL,
			error,
		})
		return false
	}
}

export const getVehicle = (data) => async (dispatch, getState, api) => {
	// Start loading
	dispatch({type: vehicleConstants.LOAD})
	try {
		// Call api to authenticate user
		const res = await api.get('/admin/vehicle', {data})
		// If not valid response object
		if (!validObjectWithParameterKeys(res, ['data'])) {
			await dispatch({
				type: vehicleConstants.LOAD_FAIL,
				error: res.message,
			})
			return false
		}

		// Else if valid response continue
		await dispatch({
      type: vehicleConstants.ALL_VEHICEL,
      all_vehicles: decrypted(res.data),
    });
		// dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
		await dispatch({
			type: vehicleConstants.LOAD_SUCCESS,
		})
		return true
	} catch (error) {
		// If an error occurs, set error field
		dispatch({
			type: vehicleConstants.LOAD_FAIL,
			error,
		})
		return false
	}
}

export const deleteVehicles = (data) => async (dispatch, getState, api) => {
	// Start loading
	dispatch({type: vehicleConstants.LOAD})
	try {
		// Call api to authenticate user
		const res = await api.delete(`/admin/vehicle/${data}`)
		// If not valid response object
		if (res.status === 0) {
			await dispatch({
				type: vehicleConstants.LOAD_FAIL,
				error: res.message,
			})
			return false
		}

		// Else if valid response continue

		// dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
		await dispatch({
			type: vehicleConstants.LOAD_SUCCESS,
			message: res.message,
		})
		return true
	} catch (error) {
		// If an error occurs, set error field
		dispatch({
			type: vehicleConstants.LOAD_FAIL,
			error,
		})
		return false
	}
}

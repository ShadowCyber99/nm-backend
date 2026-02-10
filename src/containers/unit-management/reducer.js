import {unitConstants} from './constants'

const initialState = {
    isLoadInner: false,
    isLoadPastInner: false,
    isLoad: false,
    message: null,
    loadErr: null,
    units: [],
    pastUnits: [],
    drivers: [],
    vehicles_code: [],
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
      // Loading
      case unitConstants.LOAD:
        return {
          ...state,
          isLoad: true,
          loadErr: null,
        };
      case unitConstants.LOAD_SUCCESS:
        return {
          ...state,
          isLoad: false,
          loadErr: null,
          message: action.message,
        };
      case unitConstants.LOAD_FAIL:
        return {
          ...state,
          isLoad: false,
          loadErr: action.error,
          message: null,
        };

      case unitConstants.FLUSH:
        return {
          ...state,
          message: null,
        };
      case unitConstants.ALL_UNITS:
        return {
          ...state,
          units: action.units,
          isLoadInner: true,
        };
      case unitConstants.PAST_UNITS:
        return {
          ...state,
          pastUnits: action.pastUnits,
          isLoadPastInner: true,
        };
      case unitConstants.ALL_UNIT_DRIVERS:
        return {
          ...state,
          drivers: action.drivers,
        };
      case unitConstants.ALL_VEHICLE_CODE:
        return {
          ...state,
          vehicles_code: action.vehicles_code,
        };
      case unitConstants.RESET_MESSAGE:
        return {
          ...state,
          message: null,
          loadErr: null,
        };
      // Default
      default:
        return state;
    }
}

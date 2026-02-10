import {driverConstants} from './constants'

const initialState = {
	isLoadInner: false,
	isLoad: false,
	message: null,
	loadErr: null,
	save_item: null,
	roles: [],
	all_drivers: [],
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
    // Loading
    case driverConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case driverConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
      };
    case driverConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };

    case driverConstants.ALL_DRIVERS:
      return {
        ...state,
        all_drivers: action.all_drivers,
        isLoadInner: true,
      };

    case driverConstants.USER_DRIVER_LIST:
      return {
        ...state,
        user_driver_list: action.user_driver_list,
        isLoadInner: true,
      };

    case driverConstants.CAPABILITY_ROLES:
      return {
        ...state,
        roles: action.roles,
      };
    // Reset reducer
    case driverConstants.FLUSH:
      return {
        ...state,
        message: null,
      };
    case driverConstants.SAVE_DRIVER:
      return {
        ...state,
        save_item: action.save_item,
      };
    case driverConstants.SAVED_CAPABILITY_ROLES:
      return {
        ...state,
        saved_roles: action.saved_roles,
      };
    // Default
    default:
      return state;
  }
}

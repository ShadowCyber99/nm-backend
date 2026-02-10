import {userConstants} from './constants'

const initialState = {
	isLoad: false,
	message: null,
	loadErr: null,
	userprofile: [],
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
    // Loading
    case userConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case userConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
      };
    case userConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };
    case userConstants.PROFILE:
      return {
        ...state,
        userprofile: action.userprofile,
        isLoad: false,
      };
    // Default
    default:
      return state;
  }
}

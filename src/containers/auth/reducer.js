import store from 'store2';
import { authConstants } from './constants';

const initialState = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  user: store.get('user') || null,
  sessionExpired: false,
  loadErrRegister: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // Loading
    case authConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case authConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
      };
    case authConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };

    case authConstants.ASSIGN_USER:
      return {
        ...state,
        user: { ...state.user, ...action.user },
      };
    // Reset reducer

    case authConstants.FLUSH:
      return {
        isLoadInner: false,
        isLoad: false,
        message: null,
        loadErr: null,
        user: null,
        sessionExpired: false,
        loadErrRegister: null,
      };
    case authConstants.SESSION_EXPIRED:
      return {
        ...state,
        sessionExpired: true,
      };
    // Default
    default:
      return state;
  }
}

import { userConstants } from './constants';

const initialState = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  saved_user: null,
  roles: [],
  all_users: [],
  total_users: 0,
  success_message: '',
  costCenter: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // Loading
    case userConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: '',
        success_message: '',
      };
    case userConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
        success_message: '',
      };
    case userConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
        success_message: '',
      };
    case userConstants.COST_CENTER:
      return {
        ...state,
        costCenter: action.costCenter,
        isLoadInner: true,
        isLoad: false,
      };
    case userConstants.SAVE_USER:
      return {
        ...state,
        saved_user: { ...state.saved_user, ...action.saved_user },
        isLoadInner: false,
        isLoad: false,
      };

    case userConstants.ROLES:
      return {
        ...state,
        roles: action.roles,
        isLoad: false,
      };
    // Reset reducer
    case userConstants.FLUSH:
      return {
        ...state,
        message: null,
        isLoad: false,
        loadErr: null,
        success_message: '',
      };
    case userConstants.ALL_USER:
      return {
        ...state,
        all_users: action.all_users,
        total_users: action.total_users,
        isLoadInner: true,
        isLoad: false,
      };
    case userConstants.SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        success_message: action.message,
      };
    case userConstants.FLUSH_MESSAGES:
      return {
        ...state,
        message: null,
        loadErr: null,
        isLoad: false,
        success_message: '',
      };
    // Default
    default:
      return state;
  }
}

import { corporateConstants } from './constants';

const initialState = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  all_corporate_acounts: [],
  saved_item: null,
  charges: [],
  charges_load: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // Loading
    case corporateConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case corporateConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
      };
    case corporateConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };

    case corporateConstants.GET_INVOICE_LOAD:
      return {
        ...state,
        charges_load: true,
        loadErr: null,
      };
    case corporateConstants.GET_INVOICE_SUCCESS:
      return {
        ...state,
        charges_load: false,
        loadErr: null,
        charges: action.data,
      };
    case corporateConstants.GET_INVOICE_FAIL:
      return {
        ...state,
        charges_load: false,
        loadErr: action.error,
        charges: [],
      };
    case corporateConstants.INVOICE_FLUSH:
      return {
        ...state,
        charges_load: false,
        loadErr: '',
        charges: [],
      };

    case corporateConstants.FLUSH:
      return {
        ...state,
        message: null,
      };
    case corporateConstants.FLUSH_ERROR:
      return {
        ...state,
        loadErr: null,
      };
    case corporateConstants.ALL_CORPORATE_ACCOUNTS:
      return {
        ...state,
        all_corporate_acounts: action.all_accounts,
        isLoadInner: true,
      };
    case corporateConstants.SAVE_CORPORATE_ACCOUNTS:
      return {
        ...state,
        saved_item: action.save_item,
      };
    // Default
    default:
      return state;
  }
}

import {vehicleConstants} from './constants'

const initialState = {
    isLoadInner: false,
    isLoad: false,
    message: null,
    loadErr: null,
    all_vehicles: [],
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        // Loading
        case vehicleConstants.LOAD:
            return {
                ...state,
                isLoad: true,
                loadErr: null,
            }
        case vehicleConstants.LOAD_SUCCESS:
            return {
                ...state,
                isLoad: false,
                loadErr: null,
                message: action.message,
            }
        case vehicleConstants.LOAD_FAIL:
            return {
                ...state,
                isLoad: false,
                loadErr: action.error,
                message: null,
            }

        case vehicleConstants.ROLES:
            return {
                ...state,
                roles: action.roles,
            }
        // Reset reducer
        case vehicleConstants.FLUSH:
            return {
                ...state,
                message: null,
            }
        case vehicleConstants.ALL_VEHICEL:
            return {
                ...state,
                all_vehicles: action.all_vehicles,
                isLoadInner: true,
            }
        // Default
        default:
            return state
    }
}

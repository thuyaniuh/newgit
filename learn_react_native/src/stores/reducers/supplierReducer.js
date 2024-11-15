import {
    FETCH_SUPPLIER,
    ADD_SUPPLIER,
    EDIT_SUPPLIER,
    DELETE_SUPPLIER,
} from "../actions/supplierActions";

const initialState = {
    suppliers: [],
    totalPages: 1,
    currentPage: 1,
};

export const supplierReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SUPPLIER:
            return {
                ...state,
                suppliers: action.payload.data || [],
                totalPages: action.payload.totalPages || 1,
                currentPage: action.payload.currentPage || 1,
            };
        case ADD_SUPPLIER:
            return {
                ...state,
                suppliers: [action.payload, ...state.suppliers],
            };
        case EDIT_SUPPLIER:
            if (!action.payload || !action.payload.supplier_id) {
                console.log("Invalid payload for EDIT_SUPPLIER action");
                return state;
            }
            return {
                ...state,
                suppliers: state.suppliers.map((supplier) =>
                    supplier.supplier_id === action.payload.supplier_id ? action.payload : supplier
                ),
            };
        case DELETE_SUPPLIER:
            return {
                ...state,
                suppliers: state.suppliers.filter((supplier) => supplier.supplier_id !== action.payload),
            };
        default:
            return state;
    }
};

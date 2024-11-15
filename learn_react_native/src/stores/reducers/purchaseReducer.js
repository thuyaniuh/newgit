import { FETCH_PURCHASE, ADD_PURCHASE, EDIT_PURCHASE, DELETE_PURCHASE } from "../actions/purchaseAction";

const initialState = {
    purchases: [],
    totalPage: 1,
    currentPage: 1,
}

const purchaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PURCHASE:
            return {
                ...state,
                purchases: action.payload,
            };
        case ADD_PURCHASE:
            return {
                ...state,
                purchases: [...state.purchases, action.payload],
            };
        case EDIT_PURCHASE: // Đã đổi tên từ UPDATE_PURCHASE
            return {
                ...state,
                purchases: state.purchases.map(purchase =>
                    purchase.id === action.payload.id ? action.payload : purchase
                ),
            };
        case DELETE_PURCHASE:
            return {
                ...state,
                purchases: state.purchases.filter(purchase => purchase.id !== action.payload),
            };
        default:
            return state;
    }
};

export default purchaseReducer;

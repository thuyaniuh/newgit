import { FETCH_MATERIAL } from "../actions/materialAction";

const initialState = {
    materials: [],
    totalPages: 1,
    currentPage: 1,
};

export const materialReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_MATERIAL:
            return {
                ...state,
                materials: action.payload.data,
                totalPages: action.payload.last_page,
                currentPage: action.payload.current_page,
            };
        default:
            return state;
    }
};

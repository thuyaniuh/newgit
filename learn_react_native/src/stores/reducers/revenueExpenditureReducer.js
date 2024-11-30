import { FETCH_RE, ADD_USER, EDIT_USER, DELETE_USER } from '../actions/reAction';

const initialState = {
    revenue_expenditure: [],
    totalPages: 1,
    currentPage: 1,
};

const revenueExpenditureReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_RE:
            // console.log(action.payload)
            return {
                ...state,
                revenue_expenditure: action.payload,
                totalPages: action.payload.last_page,
                currentPage: action.payload.current_page,
            };
        case ADD_USER:
            return {
                ...state,
                revenue_expenditure: [...state.revenue_expenditure, action.payload],
            };
        case EDIT_USER:
            return {
                ...state,
                revenue_expenditure: state.revenue_expenditure.map(user =>
                    user.user_id === action.payload.user_id ? action.payload : user
                ),
            };
        case DELETE_USER:
            return {
                ...state,
                revenue_expenditure: state.revenue_expenditure.filter(user => user.user_id !== action.payload),
            };
        default:
            return state;
    }
};
export default revenueExpenditureReducer;
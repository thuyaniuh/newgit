const initialState = {
    user: null,
    token: null,
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
            };
        case "LOGOUT":
            return {
                ...state,
                user: null,
                token: null,
            };
        case 'TOKEN_VALID':
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,
            };
        default:
            return state;
    }
};

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
// Action to handle login
export const login = (formData) => async (dispatch) => {
    try {
        const response = await api.post("api/login", formData, {
            "Content-Type": "multipart/form-data",
        });

        const token = response.data.access_token;

        const user = response.data.user;
        await AsyncStorage.setItem("user", JSON.stringify(user)); //lưu người dùng và token vào thiết bị
        await AsyncStorage.setItem("token", token);

        dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
                user: user,
                token,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
    }
};

export const signup = (formData) => async (dispatch) => {
    try {
        const reponse = await api.post("api/register", formData, {
            "Content-Type": "multipart/form-data",
        });
    } catch (error) {
        console.log(error);
    }
};

export const checkToken = () => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        console.log("token", token);
        if (await !token) {
            dispatch(logout());
            return false;
        }

        const response = await api.get("api/user-profile", {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        });

        if (response.data) {
            const user = response.data;
            dispatch({
                type: "TOKEN_VALID",
                payload: { token: token, user: user },
            });
            return true;
        } else {
            dispatch(logout());
            return false;
        }
    } catch (error) {
        dispatch(logout());
        return false;
    }
};

export const logout = () => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            await api.post(
                "api/logout",
                { token: token },
                {
                    "Content-Type": "multipart/form-data",
                }
            );

            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");

            dispatch({ type: "LOGOUT" });
        }

        // Update the Redux state
    } catch (error) {
        console.error("Logout error:", error);
    }
};

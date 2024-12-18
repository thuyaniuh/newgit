import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

// Action types
export const FETCH_RE = "FETCH_RE";
export const ADD_USER = "ADD_USER";
export const EDIT_USER = "EDIT_USER";
export const DELETE_USER = "DELETE_USER";

// Fetch RE with pagination and search
export const fetchRE = (page = 1, search = "", end = "") => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        // console.log("aaaa", token);
        const response = await api.get(`api/revenue_expenditure?page=${page}&search=${search}&end=${end}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch({
            type: FETCH_RE,
            payload: response.data,
        });
    } catch (error) {
        console.error("Error fetching RE:", error);
    }
};

// Add a new user
export const addRE = (userData) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await api.post("api/revenue_expenditure/store", userData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return true
        // dispatch({
        //     type: ADD_USER,
        //     payload: response.data,
        // });
    } catch (error) {
        console.error("Error adding user:", error);
        return false
    }
};

// Edit an existing user
export const editUser = (id, userData) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await api.put(`api/RE/${id}`, userData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch({
            type: EDIT_USER,
            payload: response.data,
        });
    } catch (error) {
        console.error("Error editing user:", error);
    }
};

// Delete a user
export const deleteRE = (id) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        await api.delete(`api/revenue_expenditure/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch({
            type: DELETE_USER,
            payload: id,
        });
    } catch (error) {
        console.error("Error deleting user:", error);
    }
};

import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const FETCH_PURCHASE = "FETCH_PURCHASE";
export const ADD_PURCHASE = "ADD_PURCHASE";
export const EDIT_PURCHASE = "EDIT_PURCHASE";
export const DELETE_PURCHASE = "DELETE_PURCHASE";

// Fetch purchases list
export const fetch_purchases = (page = 1, search = "") => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            console.log("Token not found");
            return;
        }

        const response = await api.get(`api/purchases?page=${page}&search=${search}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch({
            type: FETCH_PURCHASE,
            payload: response.data, // Ensure this matches the reducer structure
        });
    } catch (error) {
        console.log("Error fetching purchases:", error);
        console.log("Error response:", error.response?.data);
    }
};

// Add new purchase
export const add_purchase = (data) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            console.log("Token not found");
            return;
        }

        const response = await api.post("api/purchases/store", data, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });

        dispatch({
            type: ADD_PURCHASE,
            payload: response.data,
        });
    } catch (error) {
        console.log("Error adding purchase:", error);
        console.log("Error response:", error.response?.data);
    }
};

// Edit existing purchase
export const update_purchase = (id, data) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            console.log("Token not found");
            return;
        }

        console.log("Updating purchase data:", data);

        const response = await api.put(`api/purchases/update/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data) {
            console.log("Response from update API:", response.data);
            dispatch({
                type: EDIT_PURCHASE,
                payload: response.data,
            });
        } else {
            console.log("Response from update API is empty or undefined");
            throw new Error("Invalid response from API");
        }
    } catch (error) {
        console.log("Error editing purchase:", error);
        console.log("Error response:", error.response?.data);
    }
};

// Delete purchase
export const delete_purchase = (id) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            console.log("Token not found");
            return;
        }

        await api.delete(`api/purchases/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        dispatch({
            type: DELETE_PURCHASE,
            payload: id,
        });
    } catch (error) {
        console.log("Error deleting purchase:", error);
        console.log("Error response:", error.response?.data);
    }
};

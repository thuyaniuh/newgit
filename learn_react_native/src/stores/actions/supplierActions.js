import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const FETCH_SUPPLIER = "FETCH_SUPPLIER";
export const ADD_SUPPLIER = "ADD_SUPPLIER";
export const EDIT_SUPPLIER = "EDIT_SUPPLIER";
export const DELETE_SUPPLIER = "DELETE_SUPPLIER";

// Fetch supplier list
export const fetch_suppliers = (page = 1, search = "", phoneNumber = "") => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            console.log("Token not found");
            return;
        }

        const response = await api.get(
            `api/suppliers?page=${page}&search=${search}&phoneNumber=${phoneNumber}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        dispatch({
            type: FETCH_SUPPLIER,
            payload: response.data, // Ensure this contains `data`, `totalPages`, `currentPage`
        });
    } catch (error) {
        console.log("Error fetching suppliers:", error);
    }
};

// Add new supplier
export const add_supplier = (supplierData) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            console.log("Token not found");
            return;
        }

        const response = await api.post("api/suppliers/store", supplierData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        dispatch({
            type: ADD_SUPPLIER,
            payload: response.data,
        });
    } catch (error) {
        console.log("Error adding supplier:", error);
    }
};

// Edit existing supplier
export const edit_supplier = (supplierData) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            console.log("Token not found");
            return;
        }

        console.log("Updating supplier data:", supplierData);

        const response = await api.put(`api/suppliers/update/${supplierData.supplier_id}`, supplierData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        // Kiểm tra phản hồi từ API
        if (response.data) {
            console.log("Response from update API:", response.data);
            dispatch({
                type: EDIT_SUPPLIER,
                payload: response.data,
            });
        } else {
            console.log("Response from update API is empty or undefined");
            throw new Error("Invalid response from API");
        }
    } catch (error) {
        console.log("Error editing supplier:", error);
        console.log("Error response:", error.response?.data); // Xem chi tiết lỗi từ phản hồi
    }
};



// Delete supplier
export const delete_supplier = (id) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            console.log("Token not found");
            return;
        }

        await api.delete(`api/suppliers/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        dispatch({
            type: DELETE_SUPPLIER,
            payload: id,
        });
    } catch (error) {
        console.log("Error deleting supplier:", error);
    }
};

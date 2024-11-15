import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export const FETCH_MATERIAL = "FETCH_MATERIAL";
export const ADD_MATERIAL = "ADD_MATERIAL";
export const EDIT_MATERIAL = "EDIT_MATERIAL";
export const DELETE_MATERIAL = "DELETE_MATERIAL";

export const fetch_materials = (page = 1, search = "", phoneNumber = "") => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await api.get(
            `api/materials?page=${page}&search=${search}&phoneNumber=${phoneNumber}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            }
        );
        dispatch({
            type: FETCH_MATERIAL,
            payload: response.data,
        });
    } catch (error) {
        console.error("Error fetching materials:", error);
    }
};

export const add_materials = (materialData) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return false;

        await api.post("api/materials/store", materialData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + token,
            },
        });
        Toast.show({
            type: "success",
            text1: "Vật tư đã được thêm mới thành công",
        });
    } catch (error) {
        console.error("Error adding material:", error);
        Toast.show({
            type: "error",
            text1: "Thêm mới thất bại",
            text2: error.message || "Vui lòng thử lại",
        });
    }
};

export const edit_materials = (materialData) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            throw new Error("Token không tồn tại");
        }
        const response = await api.put(
            `api/materials/update/${materialData.material_id}`, // Đảm bảo đường dẫn đúng
            materialData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
            dispatch(fetch_materials(1)); // Tải lại danh sách vật tư
            Toast.show({
                type: "success",
                text1: "Vật tư đã được cập nhật thành công",
            });
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật vật tư:", error);
        Toast.show({
            type: "error",
            text1: "Cập nhật thất bại",
            text2: error.message || "Vui lòng thử lại",
        });
    }
};


export const delete_materials = (id) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return false;

        await api.delete(`api/materials/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });
        Toast.show({
            type: "success",
            text1: "Vật tư đã được xóa thành công",
        });
    } catch (error) {
        console.error("Error deleting material:", error);
        Toast.show({
            type: "error",
            text1: "Xóa thất bại",
            text2: error.message || "Vui lòng thử lại",
        });
    }
};

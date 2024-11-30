import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { editUser } from "../stores/actions/userActions";
import axios from "axios";
import DropDownPicker from "react-native-dropdown-picker";

export default function EditUserScreen({ route, navigation }) {
    const { user } = route.params;
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [projects, setProject] = useState([]);
    const api_url = process.env.API_URL;
    const [typeOpen, setTypeOpen] = useState(false);
    const [type, setType] = useState();

    const dispatch = useDispatch();

    useEffect(() => {
        getUsers();
    }, []);

    async function getUsers() {
        const axiosInstance = await axios.create({
            baseURL: api_url,
            timeout: 60000, // 60 giây
        });

        const data = await axiosInstance.get(api_url + "api/projects_all", {
            headers: { "Content-Type": "application/json" },
        });

        const dataa = await data?.data.map((item) => ({
            label: item.name,
            value: item.project_id,
        }));
        await console.log(dataa);
        await setProject(dataa);
    }

    // Hàm lưu dữ liệu khi chỉnh sửa
    const handleSave = () => {
        const updateUser = { name, email, type };
        // console.log(updateUser)
        dispatch(editUser(user.user_id, updateUser));
        navigation.goBack();
    };
    return (
        <View style={styles.container}>
            <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                mode="outlined"
            />
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                mode="outlined"
            />

            <DropDownPicker
                open={typeOpen}
                value={type}
                items={projects}
                setOpen={setTypeOpen}
                setValue={setType}
                placeholder="Select Project"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
            />
            <Button
                mode="contained"
                onPress={handleSave}
                style={styles.saveButton}
            >
                Save
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        marginBottom: 10,
    },
    saveButton: {
        marginTop: 20,
    },
});

import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { editUser } from "../stores/actions/userActions";

export default function EditUserScreen({ route, navigation }) {
    const { user } = route.params;
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);

    const dispatch = useDispatch();

    // Hàm lưu dữ liệu khi chỉnh sửa
    const handleSave = () => {
        const updateUser = { ...user, name, email }
        dispatch(editUser(user.user_id, updateUser))
        navigation.goBack()
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
            <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
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

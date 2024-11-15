import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { addSupplier, fetch_supplier } from "../stores/actions/supplierActions";
import Toast from "react-native-toast-message";
function AddSupplier({props, navigation}) {
    const [supplier_name, setSupplierName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    const dispatch = useDispatch();

    const handleAddSupplier = async () => {
        let formData = new FormData();
        formData.append("supplier_name", supplier_name);
        formData.append("address", address);
        formData.append("phone", phone);
        // dispatch(addSupplier(formData));
        try {
            await dispatch(addSupplier(formData));
            await dispatch(fetch_supplier());

            Toast.show({
                type: "success",
                text1: "Add supplier successful",
            });
            navigation.navigate("SupplierManagement");
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Add supplier failed",
                text2: "Invalid email or password",
            });
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Supplier</Text>
            <TextInput
                label="Supplier name"
                mode="outlined"
                style={styles.input}
                value={supplier_name}
                onChangeText={setSupplierName}
            />
            <TextInput
                label="Address"
                mode="outlined"
                style={styles.input}
                value={address}
                onChangeText={setAddress}
            />
            <TextInput
                label="Phone"
                mode="outlined"
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
            />

            <Button
                mode="contained"
                onPress={() => handleAddSupplier()}
                style={styles.button}
            >
                Add Supplier
            </Button>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        marginBottom: 20,
    },
    imagePreview: {
        width: "100%",
        height: 150,
        marginBottom: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    button: {
        paddingVertical: 10,
    },
});
export default AddSupplier;

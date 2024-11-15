import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { add_materials, fetch_materials } from "../stores/actions/materialAction";
import Toast from "react-native-toast-message";

function AddMaterialScreen({props, navigation}) {
    const [material_name, setMaterialName] = useState("");
    const [unit, setUnit] = useState("");
    const [price, setPrice] = useState("");

    const dispatch = useDispatch();

    const handleAddSupplier = async () => {
        let formData = new FormData();
        formData.append("material_name", material_name);
        formData.append("unit", unit);
        formData.append("price", price);
        // dispatch(addSupplier(formData));
        try {
            await dispatch(add_materials(formData));
            await dispatch(fetch_materials());

            Toast.show({
                type: "success",
                text1: "Add Material successful",
            });
            navigation.navigate("MaterialScreen");
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Add Material failed",
                text2: "Invalid email or password",
            });
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Material</Text>
            <TextInput
                label="Material name"
                mode="outlined"
                style={styles.input}
                value={material_name}
                onChangeText={setMaterialName}
            />
            <TextInput
                label="Unit"
                mode="outlined"
                style={styles.input}
                value={unit}
                onChangeText={setUnit}
            />
            <TextInput
                label="Price"
                mode="outlined"
                style={styles.input}
                value={price}
                onChangeText={setPrice}
            />

            <Button
                mode="contained"
                onPress={() => handleAddSupplier()}
                style={styles.button}
            >
                Add Material
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
export default AddMaterialScreen;

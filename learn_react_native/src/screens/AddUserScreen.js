import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { addUser, fetchUsers } from "../stores/actions/userActions";
import DateTimePicker from "@react-native-community/datetimepicker";
import { launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-toast-message";

export default function AddUserScreen({ navigation }) {
    const [name, setName] = useState("user test 123");
    const [email, setEmail] = useState("admin@gmai.com");
    const [password, setPassword] = useState("Password123.");
    const [imageUri, setImageUri] = useState(null);
    // const [imageUri, setImageUri] = useState(null);
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [typeOpen, setTypeOpen] = useState(false);
    const [type, setType] = useState("worker");

    const dispatch = useDispatch();

    const roles = [
        { label: "worker", value: "worker" },
        { label: "manager", value: "manager" },
    ];

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, []);

    const handleAddUser = () => {
        if (!imageUri) return;
        const fileUri = imageUri;
        const fileType = fileUri.split('.').pop();
        let formData = new FormData();
        formData.append('avatar', {
            uri: fileUri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
        });
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('active_status', 'active');
        formData.append('dateOfBirth', dateOfBirth);
        formData.append('role', type);
        // console.log(dateOfBirth)
        // console.log(name)
        // console.log(email)
        // console.log(password)
        dispatch(addUser(formData));
        dispatch(fetchUsers(1, "", 0))
        Toast.show({
            type: "success",
            text1: "Add User successful",
        });
        navigation.goBack();
    };

    const selectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            // aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.canceled) {
            setImageUri(result.assets[0].uri); // Fix the URI path
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add User</Text>
            <TextInput
                label="Name"
                mode="outlined"
                style={styles.input}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                label="Email"
                mode="outlined"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                label="Password"
                mode="outlined"
                style={styles.input}
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            />

<DropDownPicker
                        open={typeOpen}
                        value={type}
                        items={roles}
                        setOpen={setTypeOpen}
                        setValue={setType}
                        placeholder="Select Project Type"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                    />

            {/* Show selected image */}
            {imageUri && (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            )}

            <Button mode="outlined" onPress={selectImage} style={styles.input}>
                {imageUri ? "Change Image" : "Upload Image"}
            </Button>

            <Button
                onPress={() => setShowDatePicker(true)}
                mode="outlined"
                style={styles.input}
            >
                {dateOfBirth
                    ? dateOfBirth.toDateString()
                    : "Select Date of Birth"}
            </Button>

            {showDatePicker && (
                <DateTimePicker
                    value={dateOfBirth}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        const currentDate = selectedDate || dateOfBirth;
                        setShowDatePicker(false);
                        setDateOfBirth(currentDate);
                    }}
                />
            )}

            <Button
                mode="contained"
                onPress={handleAddUser}
                style={styles.button}
            >
                Add User
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
        marginTop: 20,
    },
    dropdown: {
        marginTop: 20,
    },
    imagePreview: {
        width: "100%",
        height: 150,
        marginTop: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    button: {
        paddingVertical: 10,
        marginTop: 20,
    },
});

import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { addUser } from "../stores/actions/userActions";
import DateTimePicker from "@react-native-community/datetimepicker";
import { launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";

export default function AddUserScreen({ navigation }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [imageUri, setImageUri] = useState(null);
    // const [imageUri, setImageUri] = useState(null);
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const dispatch = useDispatch();

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
        // console.log(dateOfBirth)
        // console.log(name)
        // console.log(email)
        // console.log(password)
        dispatch(addUser(formData));
        // navigation.goBack();
    };

    const selectImage = async () => {
        // ImagePicker.launchCameraAsync({
        //     mediaType: 'photo',
        //     base64: true,
        //     maxHeight: 200,
        //     maxWidth: 200,
        // }).then((response) => {
        //     console.log(response);
        //     if (!response.cancelled && !response.errorCode) {
        //         const base64Image = response.base64;
        //         console.log(base64Image);
        //         setImageUri(base64Image);
        //     } else {
        //         console.log(response);
        //     }
        // }).catch((error) => {
        //     console.log(error);
        // })

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

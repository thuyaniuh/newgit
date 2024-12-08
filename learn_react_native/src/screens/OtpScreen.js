import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    TextInput,
    Alert,
} from "react-native";
import { signup } from "../stores/actions/authActions";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import axios from "axios";


function OtpScreen({ route, props, navigation }) {
    const { phone } = route.params;
    const [otp, setOtp] = useState();
    // const [phone, setPhone] = useState("0335431858");
    const api_url = process.env.API_URL;

    const dispatch = useDispatch();

    async function handleSignUp() {
        const form_data = new FormData();
        form_data.append("otp", otp);
        form_data.append("phone", phone);

        try {
            
            const axiosInstance = axios.create({
                baseURL: api_url,
                timeout: 60000,
            });
            const response = await axiosInstance.post('api/users/otp', form_data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log(response)

            Toast.show({
                type: 'success',
                text1: 'Active successful',
            });
            navigation.navigate('Login');
        } catch (error) {
            console.log(error)
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data.error || 'Invalid data provided';
                Toast.show({
                    type: 'error',
                    text1: 'Sign up failed',
                    text2: errorMessage,
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Sign up failed',
                    text2: 'An unexpected error occurred',
                });
            }
        }
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Confirm OTP</Text>
            <TextInput
                style={styles.input}
                placeholder="OTP"
                value={otp}
                onChangeText={setOtp}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone"
                readOnly
                value={phone}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() => handleSignUp()}
            >
                <Text style={styles.text}>Confirm OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    button: {
        backgroundColor: "#F5C518",
        paddingVertical: 15,
        borderRadius: 8,
    },
    text: {
        textAlign: "center",
        color: "white",
        fontSize: 18,
    },
    link: {
        color: "#F5C518",
        textAlign: "center",
        paddingVertical: 15,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default OtpScreen;

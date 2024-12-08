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
function SignupScreen({ props, navigation }) {
    const [email, setEmail] = useState("test@admin.com");
    const [username, setUsername] = useState("user test");
    const [password, setPassword] = useState("Password123@");
    const [phone, setPhone] = useState("0335431858");
    const [confirm, setConfirm] = useState("Password123@");
    const [passwordError, setPasswordError] = useState("");

    const dispatch = useDispatch();

    function checkRequired() {
        if (email === "" || username === "" || password === "" || confirm === "") {
            Alert.alert("Vui lòng nhập đầy đủ thông tin");
            return false; // Trả về false nếu có trường rỗng
        }
        return true; // Trả về true nếu tất cả các trường đã được điền
    }

    function validatePassword(password) {
        const regexUppercase = /[A-Z]/;
        const regexLowercase = /[a-z]/;
        const regexNumber = /[0-9]/;
        const regexSpecialChar = /[@$!%*?&]/;

        if (password.length < 6) {
            return "Mật khẩu phải chứa ít nhất 6 kí tự, một chữ cái viết hoa một chữ cái viết thường, và kí tự đặc biệt.";
        }
        if (!regexUppercase.test(password)) {
            return "Mật khẩu phải chứa ít nhất 6 kí tự, một chữ cái viết hoa một chữ cái viết thường, và kí tự đặc biệt.";
        }
        if (!regexLowercase.test(password)) {
            return "Mật khẩu phải chứa ít nhất 6 kí tự, một chữ cái viết hoa một chữ cái viết thường, và kí tự đặc biệt.";
        }
        if (!regexNumber.test(password)) {
            return "Mật khẩu phải chứa ít nhất 6 kí tự, một chữ cái viết hoa một chữ cái viết thường, và kí tự đặc biệt.";
        }
        if (!regexSpecialChar.test(password)) {
            return "Mật khẩu phải chứa ít nhất 6 kí tự, một chữ cái viết hoa một chữ cái viết thường, và kí tự đặc biệt.";
        }

        return "";
    }

    async function handleSignUp() {
        const passwordValidationError = validatePassword(password);
        if (passwordValidationError) {
            setPasswordError(passwordValidationError);
            return;
        } else {
            setPasswordError(""); // Xóa lỗi nếu mật khẩu hợp lệ
        }

        if (!checkRequired()) {
            return;
        }

        const form_data = new FormData();
        form_data.append("email", email);
        form_data.append("phone", phone);
        form_data.append("name", username);
        form_data.append("password", password);
        form_data.append("password_confirmation", confirm);

        try {
            await dispatch(signup(form_data));
            Toast.show({
                type: 'success',
                text1: 'Sign up successful',
            });
            navigation.navigate('OtpScreen', { phone: phone });
        } catch (error) {
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
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
            />
            {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}

            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirm}
                onChangeText={setConfirm}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() => handleSignUp()}
            >
                <Text style={styles.text}>Sign Up</Text>
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

export default SignupScreen;

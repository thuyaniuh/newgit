import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import Animated from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { login } from "../stores/actions/authActions";
import Toast from "react-native-toast-message";

export default function LoginScreen({ navigation }) {

    const [email, setEmail] = useState("admin@example.com");

    const [password, setPassword] = useState("123456");

    const dispatch = useDispatch();

    const handleLogin = async () => {
        const form_data = new FormData();
        form_data.append('email', email);
        form_data.append('password', password);

        try {
            await dispatch(login(form_data));

            Toast.show({
                type: 'success',
                text1: 'Login successful',
            });
            navigation.navigate('Home');
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Login failed',
                text2: 'Invalid email or password',
            });
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={styles.title}>Login</Text>
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
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
            />
            <Button
                mode="contained"
                onPress={() => handleLogin()}
                style={styles.button}
            >
                Login
            </Button>

            <Button
                mode="text"
                onPress={() => navigation.navigate("Signup")}
                style={styles.link}
            >
                <Text style={styles.text}>Don't have account? </Text>
                Sign up
            </Button>
            <Button
                mode="text"
                style={styles.link}
                onPress={() => navigation.navigate("ForgotPassword")}
            >
                Forgot Password?
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: "#F4F3EF",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
        textAlign: "center",
    },
    input: {
        marginBottom: 20,
        backgroundColor: "#FFF9E1",
    },
    button: {
        marginTop: 20,
        paddingVertical: 10,
        backgroundColor: "#F5C518",
    },
    link: {
        marginTop: 10,
        color: "#F5C518",
    },
    text: {
        color: 'black',
    }
});

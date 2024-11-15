import { StyleSheet, Text, View, } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import React from 'react'

export default function ForgotPasswordScreen({ props }) {
    return (
        <View style={styles.container}>
            <TextInput placeholder="Nhập email hoặc số điện thoại" style={styles.textInput} mode="outlined" label="Email"></TextInput>
            <Button mode="text" style={styles.button}><Text style={styles.text}>Gửi mã OTP</Text></Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    textInput: {
        marginTop: 50,
        width: "90%",
        height: 50,
        textAlign: "center"
    },
    button: {
        marginTop: 20,
        backgroundColor: "#F5C518",
        width: "90%",
    },
    text: {
        color: "white"
    }
})
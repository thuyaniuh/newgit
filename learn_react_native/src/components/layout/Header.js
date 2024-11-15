import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SignupScreen from "../../screens/SignupScreen";

function Header({ props, navigation }) {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View>
            <View style={styles.header}>
                <Text style={styles.logo}>Logo</Text>

                <View style={styles.icons}>
                    <Ionicons
                        name="notifications-outline"
                        size={24}
                        color="back"
                    />
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Ionicons name="menu" size={24} color="back" />
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <View>
                            <Text
                                style={styles.modalLink}
                                onPress={() => navigation.navigate("Login")}
                            >
                                Login
                            </Text>
                        </View>
                        <View>
                            <Text
                                style={styles.modalLink}
                                onPress={() => navigation.navigate("Signup")}
                            >
                                Sign up
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "#f8f8f8",
        alignItems: "center",
    },
    logo: {
        fontSize: 20,
        fontWeight: "bold",
    },
    icons: {
        flexDirection: "row",
        alignItems: "center",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-start",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        width: "80%",
        height: "100%",
        // marginTop: 60,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    modalLink: {
        marginVertical: 10,
        fontSize: 18,
        color: "blue",
        fontWeight: "bold",
    },
});

export default Header;

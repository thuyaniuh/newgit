import React, { useEffect } from "react";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { View, StyleSheet } from "react-native";
import {
    Drawer,
    Avatar,
    Title,
    Caption,
    Text,
    Button,
} from "react-native-paper";
import { checkToken, logout } from "../../stores/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function DrawerContent(props) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        dispatch(checkToken());
    }, [dispatch]);

    const handleLogout = () => {
        // console.log("logout");
        dispatch(logout());
        props.navigation.navigate("Login");
    };

    return (
        <DrawerContentScrollView {...props} style={styles.drawerContent}>
            <View style={styles.userInfoSection}>
                {user ? (
                    <>
                        <Avatar.Image
                            source={{
                                uri:
                                    user.avatar ||
                                    "https://placekitten.com/200/200",
                            }}
                            size={50}
                        />
                        <Title style={styles.title}>{user.name}</Title>
                        <Caption style={styles.caption}>@{user.email}</Caption>
                    </>
                ) : (
                    <View style={styles.authLinks}>
                        <Button
                            mode="text"
                            onPress={() => props.navigation.navigate("Login")}
                        >
                            Login
                        </Button>
                        <Button
                            mode="text"
                            onPress={() => props.navigation.navigate("Signup")}
                        >
                            Sign up
                        </Button>
                    </View>
                )}
            </View>
            <Drawer.Section>
                <Drawer.Item
                    label="Home"
                    onPress={() => props.navigation.navigate("Home")}
                />
                <Drawer.Item
                    label="To do"
                    onPress={() => props.navigation.navigate("todo")}
                />
                {user && (
                    <>
                        <Drawer.Item
                            label="User Management"
                            onPress={() =>
                                props.navigation.navigate("UserManagement")
                            }
                        />
                        <Drawer.Item
                            label="Supplier Management"
                            onPress={() =>
                                props.navigation.navigate("SupplierManagement")
                            }
                        />
                        <Drawer.Item
                            label="Material Management"
                            onPress={() =>
                                props.navigation.navigate("MaterialScreen")
                            }
                        />
                        <Drawer.Item
                            label="Project Management"
                            onPress={() =>
                                props.navigation.navigate("ProjectManagement")
                            }
                        />
                        <Drawer.Item
                            label="Purchase Management"
                            onPress={() => props.navigation.navigate("PurchaseScreen")} />
                        <Drawer.Item
                            label="Revenue Expenditure"
                            onPress={() => props.navigation.navigate("RevenueExpenditureScreen")} />
                    </>
                )}
                {user && (
                    <Drawer.Section>
                        <Drawer.Item label="Logout" onPress={() => handleLogout()} />
                    </Drawer.Section>
                )}
            </Drawer.Section>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
        backgroundColor: "#F4F3EF",
    },
    userInfoSection: {
        paddingLeft: 20,
        marginVertical: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    caption: {
        fontSize: 14,
        color: "#777",
    },
    authLinks: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
    },
});

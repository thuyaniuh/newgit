import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, ScrollView, Text, Image } from "react-native";
import { Button, TextInput, Card } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { addRE, fetchRE } from "../stores/actions/reAction";
import { userAction } from "../stores/actions/userActions";
import { convertNumberToVietnameseText } from "../utils/numberToText"; // Hàm chuyển đổi số thành chữ tiếng Việt
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

function AddRevenueExpenditureScreen({ navigation }) {
    const api_url = process.env.API_URL;
    const { revenue_expenditure, totalPages, currentPage } = useSelector(
        (state) => state.revenue_expenditure
    );

    const [name, setName] = useState("Tên dự án a");
    const [users, setUser] = useState([]);
    const [budget, setBudget] = useState(20000);
    const [type, setType] = useState("Xây dựng");
    const [description, setDescription] = useState("Mô tả dự án ...");
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [status, setStatus] = useState("active");
    const [status1, setStatus1] = useState(0);
    const [statusOpen, setStatusOpen] = useState(false);
    const [statusOpen1, setStatusOpen1] = useState(false);
    const [typeOpen, setTypeOpen] = useState(false);
    const [imageUri, setImageUri] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        (async () => {
            const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                alert(
                    "Sorry, we need camera roll permissions to make this work!"
                );
            }
        })();
    }, []);

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

    async function getUsers() {
        const axiosInstance = await axios.create({
            baseURL: api_url,
            timeout: 60000, // 60 giây
        });
        // console.log(api_url + 'api/users');
        const data = await axiosInstance.get(api_url + "api/users", {
            headers: { "Content-Type": "application/json" },
        });

        // console.log(data?.data)
        const dataa = await data?.data?.data.map((item) => ({
            label: item.name,
            value: item.user_id,
        }));
        await console.log(dataa);
        await setUser(dataa);
    }

    // const projectTypes = [
    //     { label: "Xây dựng", value: "0" },
    //     { label: "Thiết kế", value: "1" },
    // ];

    const projectStatuses = [
        { label: "Phiếu thu", value: "0" },
        { label: "Phiếu chi", value: "1" },
    ];

    const money_type = [
        { label: "Tiền mặt", value: "0" },
        { label: "Chuyển khoản", value: "1" },
    ];

    // const handleDateChange = (event, selectedDate, type) => {
    //     // const currentDate = selectedDate || (type === "start" ? startDay : endDay);
    //     if (type === "start") {
    //         setShowStartPicker(false);
    //         setStartDay(currentDate);
    //     } else {
    //         setShowEndPicker(false);
    //         setEndDay(currentDate);
    //     }
    // };

    const handleSubmit = async () => {
        if (!budget || !type || !description || !status) {
            Alert.alert("Error", "Please fill all fields correctly");
            return;
        }

        if (!imageUri) return;

        let formData = new FormData();

        const fileUri = imageUri;
        const fileType = fileUri.split(".").pop();
        formData.append("images", {
            uri: fileUri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
        });

        // formData.append("name", name);
        formData.append("user_id", type);
        formData.append("type_trans", status1);
        // console.log(status1)
        // return
        formData.append("money", budget);
        formData.append("type_re", status);
        formData.append("note", description);
        try {
            if (dispatch(addRE(formData))) {
                dispatch(fetchRE(1, new Date().toISOString().split("T")[0]));
                setTimeout(function () {
                    navigation.goBack();
                }, 1500);
            } else {
                Alert.alert("Error", "Vui lòng kiểm tra lại thông tin nhập");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to add");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Add New Revenue Expenditure" />
                <Card.Content>
                    <DropDownPicker
                        open={statusOpen}
                        value={status}
                        items={projectStatuses}
                        setOpen={setStatusOpen}
                        setValue={setStatus}
                        placeholder="Select Type"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                    />

                    <DropDownPicker
                        open={statusOpen1}
                        value={status1}
                        items={money_type}
                        setOpen={setStatusOpen1}
                        setValue={setStatus1}
                        placeholder="Select type transaction"
                        style={styles.dropdown1}
                        dropDownContainerStyle={styles.dropdownContainer1}
                    />

                    <TextInput
                        label="Money"
                        value={budget}
                        onChangeText={(text) => setBudget(text)}
                        style={styles.input}
                        keyboardType="numeric"
                        mode="outlined"
                    />
                    <Text style={styles.textInVietnamese}>
                        {budget &&
                            convertNumberToVietnameseText(parseInt(budget))}
                    </Text>

                    <TextInput
                        label="Description"
                        value={description}
                        onChangeText={setDescription}
                        style={styles.input}
                        mode="outlined"
                        multiline
                    />
                    {imageUri && (
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.imagePreview}
                        />
                    )}

                    <Button
                        mode="outlined"
                        onPress={selectImage}
                        style={styles.input}
                    >
                        {imageUri ? "Change Image" : "Upload Image"}
                    </Button>

                    <DropDownPicker
                        open={typeOpen}
                        value={type}
                        items={users}
                        setOpen={setTypeOpen}
                        setValue={setType}
                        placeholder="Select User"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                    />
                </Card.Content>
            </Card>
            <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
            >
                Add Revenue Expenditure
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#f8f8f8",
    },
    card: {
        padding: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#dcdcdc",
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    imagePreview: {
        width: "100%",
        height: 150,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    input: {
        marginBottom: 10,
    },
    textInVietnamese: {
        fontStyle: "italic",
        marginBottom: 10,
        color: "#555",
    },
    dropdown: {
        marginBottom: 10,
        borderColor: "#dcdcdc",
        zIndex: 10,
    },
    dropdownContainer: {
        borderColor: "#dcdcdc",
        zIndex: 9,
    },

    dropdown1: {
        marginBottom: 10,
        borderColor: "#dcdcdc",
        zIndex: 8,
    },
    dropdownContainer1: {
        borderColor: "#dcdcdc",
        Index: 7,
    },
    submitButton: {
        backgroundColor: "#28a745",
        marginTop: 20,
        paddingVertical: 10,
    },
    dateButton: {
        marginVertical: 10,
    },
});

export default AddRevenueExpenditureScreen;

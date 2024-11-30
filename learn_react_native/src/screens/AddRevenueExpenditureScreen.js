import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, ScrollView, Text } from "react-native";
import { Button, TextInput, Card } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { addRE, fetchRE } from "../stores/actions/reAction";
import { userAction } from "../stores/actions/userActions";
import { convertNumberToVietnameseText } from "../utils/numberToText"; // Hàm chuyển đổi số thành chữ tiếng Việt
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

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
    const [statusOpen, setStatusOpen] = useState(false);
    const [typeOpen, setTypeOpen] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        getUsers();
    }, []);

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

        let formData = new FormData();
        // formData.append("name", name);
        formData.append("user_id", type);
        formData.append("money", budget);
        formData.append("type_re", status);
        formData.append("note", description);
        try {
            if (dispatch(addRE(formData))) {
                fetchRE(1, new Date().toISOString().split("T")[0]);
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
    },
    dropdownContainer: {
        borderColor: "#dcdcdc",
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

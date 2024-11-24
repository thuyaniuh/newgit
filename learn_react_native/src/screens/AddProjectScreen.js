import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView, Text } from "react-native";
import { Button, TextInput, Card } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { useDispatch } from "react-redux";
import { add_projects } from "../stores/actions/projectAction";
import { convertNumberToVietnameseText } from "../utils/numberToText"; // Hàm chuyển đổi số thành chữ tiếng Việt

function AddProjectScreen({ navigation }) {
    const [name, setName] = useState("Tên dự án a");
    const [budget, setBudget] = useState(20000);
    const [type, setType] = useState("Xây dựng");
    const [description, setDescription] = useState("Mô tả dự án ...");
    const [startDay, setStartDay] = useState(new Date('2024-10-10'));
    const [endDay, setEndDay] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [status, setStatus] = useState("active");
    const [statusOpen, setStatusOpen] = useState(false);
    const [typeOpen, setTypeOpen] = useState(false);

    const dispatch = useDispatch();

    const projectTypes = [
        { label: "Xây dựng", value: "Xây dựng" },
        { label: "Thiết kế", value: "Thiết kế" },
    ];

    const projectStatuses = [
        { label: "active", value: "active" },
        { label: "completed", value: "completed" },
    ];

    const handleDateChange = (event, selectedDate, type) => {
        const currentDate = selectedDate || (type === "start" ? startDay : endDay);
        if (type === "start") {
            setShowStartPicker(false);
            setStartDay(currentDate);
        } else {
            setShowEndPicker(false);
            setEndDay(currentDate);
        }
    };

    const handleSubmit = async () => {
        if (!name || !budget || !type || !description || !status) {
            Alert.alert("Error", "Please fill all fields correctly");
            return;
        }

        if (new Date(endDay) < new Date(startDay)) {
            Alert.alert("Error", "End date cannot be before start date");
            return;
        }

        let formData = new FormData();
        formData.append("name", name);
        formData.append("budget", budget);
        formData.append("type", type);
        formData.append("start_day", startDay.toISOString().split("T")[0]);
        formData.append("end_day", endDay.toISOString().split("T")[0]);
        formData.append("status", status);
        formData.append("description", description);
        
        console.log(name, budget,type, status,description, startDay.toISOString().split("T")[0])
        console.log(endDay.toISOString().split("T")[0])
        
        // return

        try {
            await dispatch(add_projects(formData));
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to add project");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Add New Project" />
                <Card.Content>
                    <TextInput
                        label="Project Name"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        mode="outlined"
                    />
                    <TextInput
                        label="Budget"
                        value={budget}
                        onChangeText={(text) => setBudget(text)}
                        style={styles.input}
                        keyboardType="numeric"
                        mode="outlined"
                    />
                    {/* Hiển thị số tiền bằng chữ */}
                    <Text style={styles.textInVietnamese}>
                        {budget && convertNumberToVietnameseText(parseInt(budget))}
                    </Text>
                    <DropDownPicker
                        open={typeOpen}
                        value={type}
                        items={projectTypes}
                        setOpen={setTypeOpen}
                        setValue={setType}
                        placeholder="Select Project Type"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                    />
                    <DropDownPicker
                        open={statusOpen}
                        value={status}
                        items={projectStatuses}
                        setOpen={setStatusOpen}
                        setValue={setStatus}
                        placeholder="Select Status"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                    />
                    <TextInput
                        label="Description"
                        value={description}
                        onChangeText={setDescription}
                        style={styles.input}
                        mode="outlined"
                        multiline
                    />
                    <Button
                        mode="outlined"
                        onPress={() => setShowStartPicker(true)}
                        style={styles.dateButton}
                    >
                        Select Start Date: {startDay.toISOString().split("T")[0]}
                    </Button>
                    {showStartPicker && (
                        <DateTimePicker
                            value={startDay}
                            mode="date"
                            display="default"
                            onChange={(e, date) => handleDateChange(e, date, "start")}
                        />
                    )}
                    <Button
                        mode="outlined"
                        onPress={() => setShowEndPicker(true)}
                        style={styles.dateButton}
                    >
                        Select End Date: {endDay.toISOString().split("T")[0]}
                    </Button>
                    {showEndPicker && (
                        <DateTimePicker
                            value={endDay}
                            mode="date"
                            display="default"
                            onChange={(e, date) => handleDateChange(e, date, "end")}
                        />
                    )}
                </Card.Content>
            </Card>
            <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
            >
                Add Project
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

export default AddProjectScreen;

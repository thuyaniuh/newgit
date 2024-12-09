import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView, Text } from "react-native";
import { Button, TextInput, Card } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { useDispatch } from "react-redux";
import { edit_projects ,fetch_projects } from "../stores/actions/projectAction";
import { convertNumberToVietnameseText } from "../utils/numberToText"; // Hàm chuyển đổi số thành chữ tiếng Việt
import Toast from "react-native-toast-message";

function EditProjectScreen({ route, navigation }) {
    const { project } = route.params;
    const [name, setName] = useState(project.name);
    // const [budget, setBudget] = useState(project.budget);
    const [type, setType] = useState(project.type);
    const [description, setDescription] = useState(project.description);
    // const [startDay, setStartDay] = useState(new Date(project.start_day));
    // const [endDay, setEndDay] = useState(new Date(project.end_day));
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [status, setStatus] = useState(project.status);
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
        const currentDate =
            selectedDate || (type === "start" ? startDay : endDay);
        if (type === "start") {
            setShowStartPicker(false);
            setStartDay(currentDate);
        } else {
            setShowEndPicker(false);
            setEndDay(currentDate);
        }
    };

    const handleSubmit = async () => {
        if (!name || !type || !description || !status) {
            Alert.alert("Error", "Please fill all fields correctly");
            return;
        }

        // if (new Date(endDay) < new Date(startDay)) {
        //     Alert.alert("Error", "End date cannot be before start date");
        //     return;
        // }

        let formData = new FormData();
        formData.append("name", name);
        formData.append("project_id", project.project_id);
        formData.append("type", type);
        // formData.append("start_day", startDay.toISOString().split("T")[0]);
        // formData.append("end_day", endDay.toISOString().split("T")[0]);
        formData.append("status", status);
        formData.append("description", description);

        // return

        try {
            if (await dispatch(edit_projects(formData))) {
                await dispatch(fetch_projects(1, ""));
                await navigation.goBack();
                Toast.show({
                    type: "success",
                    text1: "Đã sửa dự án thành công",
                });
            } else {
                Alert.alert("Error", "Vui lòng kiểm tra lại thông tin nhập");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to add project");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Edit Project" />
                <Card.Content>
                    <TextInput
                        label="Project Name"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        mode="outlined"
                    />
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
                    {/* <Button
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
                    )} */}
                </Card.Content>
            </Card>
            <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
            >
                Edit Project
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

export default EditProjectScreen;

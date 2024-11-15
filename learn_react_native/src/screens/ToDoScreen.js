import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ToDoScreen = () => {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [currentTodo, setCurrentTodo] = useState(null);

    // Hàm lưu danh sách nhiệm vụ vào AsyncStorage
    const storeTodos = async (todos) => {
        try {
            const jsonValue = JSON.stringify(todos);
            await AsyncStorage.setItem("todos", jsonValue);
        } catch (e) {
            console.log("Saving error", e);
        }
    };

    // Hàm lấy danh sách nhiệm vụ từ AsyncStorage
    const loadTodos = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem("todos");
            console.log(jsonValue);
            if (jsonValue != null) {
                setTodos(JSON.parse(jsonValue));
            }
        } catch (e) {
            console.log("Loading error", e);
        }
    };

    useEffect(() => {
        // Tải danh sách nhiệm vụ từ AsyncStorage khi ứng dụng mở
        loadTodos();
    }, []);

    useEffect(() => {
        // Lưu lại danh sách mỗi khi có sự thay đổi
        if (todos.length > 0) {
            storeTodos(todos);
        }
    }, [todos]);

    const addTodo = () => {
        if (text.trim()) {
            const newTodos = [...todos, { id: Date.now().toString(), text }];
            setTodos(newTodos);
            setText("");
        }
    };

    const editTodo = () => {
        if (currentTodo) {
            const updatedTodos = todos.map((todo) =>
                todo.id === currentTodo.id ? { ...todo, text } : todo
            );
            setTodos(updatedTodos);
            setText("");
            setIsEditing(false);
            setCurrentTodo(null);
        }
    };

    const deleteTodo = (id) => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
    };

    const startEdit = (todo) => {
        setText(todo.text);
        setCurrentTodo(todo);
        setIsEditing(true);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Add a new task"
                value={text}
                onChangeText={setText}
            />
            <Button
                title={isEditing ? "Update Task" : "Add Task"}
                onPress={isEditing ? editTodo : addTodo}
            />

            <FlatList
                data={todos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.todoItem}>
                        <Text>{item.text}</Text>
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => startEdit(item)}>
                                <Text style={styles.editText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => deleteTodo(item.id)}
                            >
                                <Text style={styles.deleteText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 10,
        padding: 8,
    },
    todoItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    actions: {
        flexDirection: "row",
    },
    editText: {
        color: "blue",
        marginRight: 10,
    },
    deleteText: {
        color: "red",
    },
});

export default ToDoScreen;

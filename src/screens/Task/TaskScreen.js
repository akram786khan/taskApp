import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  setFilter,
  addTask,
  editTask,
  deleteTask,
} from "../../redux/feature/tasksSlice";

const TaskScreen = () => {
  const dispatch = useDispatch();
  const { allTasks, filter, loading, error } = useSelector(
    (state) => state.tasks
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    id: null,
    userId: "",
    title: "",
    completed: null,
  });

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const filteredTasks = allTasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  const handleSubmit = () => {
    if (!form.userId.trim())
      return Alert.alert("Validation", "User ID is required");
    if (!form.title.trim())
      return Alert.alert("Validation", "Title is required");
    if (form.completed === null)
      return Alert.alert("Validation", "Status is required");

    if (editMode) {
      dispatch(editTask({ id: form.id, updates: form }));
    } else {
      dispatch(addTask({ ...form, userId: Number(form.userId) }));
    }

    resetForm();
  };

  const resetForm = () => {
    setForm({
      id: null,
      userId: "",
      title: "",
      completed: null,
    });
    setModalVisible(false);
    setEditMode(false);
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => dispatch(deleteTask(id)) },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.taskTitle}>Title: {item.title}</Text>
      <Text>User ID: {item.userId}</Text>
      <Text>Status: {item.completed ? "✅ Completed" : "❌ Incomplete"}</Text>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setForm({ ...item, userId: String(item.userId) });
            setEditMode(true);
            setModalVisible(true);
          }}
        >
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📝 Task Manager</Text>
      <Text style={[styles.heading, { fontSize: 15 }]}>
        You can filter out from these buttons
      </Text>
      <View style={styles.filterContainer}>
        <Button title="All" onPress={() => dispatch(setFilter("all"))} />
        <Button
          title="Completed"
          onPress={() => dispatch(setFilter("completed"))}
        />
        <Button
          title="Incomplete"
          onPress={() => dispatch(setFilter("incomplete"))}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addText}>+ Add Task</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editMode ? "Edit Task" : "Add Task"}
            </Text>

            <TextInput
              placeholder="User ID *"
              keyboardType="numeric"
              value={form.userId}
              onChangeText={(text) => setForm({ ...form, userId: text })}
              style={styles.input}
            />

            <TextInput
              placeholder="Title *"
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
              style={styles.input}
            />

            <Text style={{ marginTop: 10 }}>Status *</Text>
            {["Completed", "Incomplete"].map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() =>
                  setForm({ ...form, completed: status === "Completed" })
                }
                style={[
                  styles.priorityBtn,
                  form.completed === (status === "Completed") &&
                    styles.prioritySelected,
                ]}
              >
                <Text style={styles.btnText}>{status}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={resetForm} color="grey" />
              <Button
                title={editMode ? "Update" : "Add"}
                onPress={handleSubmit}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TaskScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskTitle: { fontSize: 16, fontWeight: "600" },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },
  editButton: { backgroundColor: "#4caf50", padding: 8, borderRadius: 5 },
  deleteButton: { backgroundColor: "#f44336", padding: 8, borderRadius: 5 },
  btnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  addButton: {
    backgroundColor: "#2196f3",
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  addText: { color: "#fff", fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 8,
    borderRadius: 6,
  },
  priorityBtn: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#aaa",
    marginTop: 5,
  },
  prioritySelected: { backgroundColor: "#2196f3" },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  errorText: { color: "red", textAlign: "center" },
});

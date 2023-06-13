import { Button, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import ToDoList from "../components/ToDoList";
import { StatusBar } from "expo-status-bar";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useCompleteTodo, useTodosQuery } from "../api";
import OfflineSimulator from "../components/OfflineSimulator";

type ToDoListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ToDoList"
>;

const ToDoListScreen = ({ navigation }: ToDoListScreenProps) => {
  useEffect(() => {
    navigation.setOptions({
      title: "List",
      headerRight: () => (
        <Button title="Add" onPress={() => navigation.navigate("AddToDo")} />
      ),
    });
  }, [navigation]);

  const queryClient = useQueryClient();
  const { mutate } = useCompleteTodo(queryClient);

  const handleCompleteToDo = (toDoId: string) =>
    mutate({ id: toDoId, completed: true });

  const { data, isLoading, isError, error } = useTodosQuery();

  return (
    <View style={styles.container}>
      <OfflineSimulator />
      <View style={styles.list}>
        {isError && (
          <View>
            <Text>Error {JSON.stringify(error)}</Text>
            <Button
              onPress={() => {
                queryClient.invalidateQueries({ queryKey: ["todos"] });
              }}
              title="Clear"
            />
          </View>
        )}
        {isLoading && <Text>Loading..</Text>}
        {data && <ToDoList toDos={data} onCompleteToDo={handleCompleteToDo} />}
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

export default ToDoListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: "black",
    fontSize: 24,
    fontWeight: "500",
    marginTop: 0,
    marginBottom: 24,
    borderColor: "green",
    borderWidth: 1,
  },
  list: {
    flex: 1,
  },
});

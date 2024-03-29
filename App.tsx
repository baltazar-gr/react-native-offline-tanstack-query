import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { MutationCache, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { addTodoMutationFn, completeTodoMutationFn } from "./api";
import AddToDoScreen from "./screens/AddToDoScreen";
import ToDoListScreen from "./screens/ToDoListScreen";
import { RootStackParamList } from "./types/navigation";
import { useOnAppFocus, useOnlineManager } from "./hooks";
import { ToastAndroid } from "react-native";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
  // configure global cache callbacks to show toast notifications
  mutationCache: new MutationCache({
    onSuccess: (data) => {
      ToastAndroid.show("Sucessfully added mutation", ToastAndroid.LONG);
    },
    onError: (error) => {
      ToastAndroid.show("Error in mutation", ToastAndroid.LONG);
    },
  }),
});

queryClient.setMutationDefaults(["addTodo"], {
  mutationFn: async ({ name, description }) => {
    await queryClient.cancelQueries({ queryKey: ["todos"] });
    return addTodoMutationFn({ name, description });
  },
});

queryClient.setMutationDefaults(["completeTodo"], {
  mutationFn: ({ id, completed }) => {
    return completeTodoMutationFn({ id, completed });
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 1000,
});

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useOnAppFocus();
  useOnlineManager();

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
      onSuccess={() => {
        queryClient
          .resumePausedMutations()
          .then(() => queryClient.invalidateQueries());
      }}
    >
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            contentStyle: {
              backgroundColor: "#ffffff",
            },
          }}
        >
          <Stack.Screen name="ToDoList" component={ToDoListScreen} />
          <Stack.Screen name="AddToDo" component={AddToDoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PersistQueryClientProvider>
  );
}

import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import PocketBase, { ClientResponseError } from "pocketbase";
import { REACT_APP_API_URL } from "@env";
import { AddToDoInput, AddTodoWithIdInput, ToDo } from "./types/ToDo";
import uuid from "react-native-uuid";
import { AsyncAuthStore } from "./store/AsyncAuthStore";
import { todoKeys } from "./queryKeys";

const pb = new PocketBase(REACT_APP_API_URL, new AsyncAuthStore());

export const useTodosQuery = () => {
  return useQuery({
    queryKey: todoKeys.all,
    queryFn: async () => {
      const todos = await pb.collection("todos").getFullList<ToDo>({
        sort: "-created",
      });
      return todos;
    },
    staleTime: 3000,
  });
};

export const completeTodoMutationFn = async ({
  id,
  completed = true,
}: {
  id: string;
  completed: boolean;
}) => {
  const completeTodo = await pb
    .collection("todos")
    .update<ToDo>(id, { completed });
  return completeTodo;
};

export const useCompleteTodo = (queryClient: QueryClient) => {
  return useMutation({
    mutationKey: ["completeTodo"],
    mutationFn: completeTodoMutationFn,
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousToDos = queryClient.getQueryData<ToDo[]>(["todos"]);

      queryClient.setQueryData<ToDo[]>(["todos"], (old) => {
        return (
          old?.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                completed,
              };
            } else {
              return item;
            }
          }) || []
        );
      });

      return { previousToDos };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["todos"], context?.previousToDos);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};

export const addTodoMutationFn = async ({
  name,
  description,
}: AddToDoInput) => {
  const addTodo = await pb.collection("todos").create({ name, description });
  return addTodo;
};

export const useAddTodo = (queryClient: QueryClient) => {
  return useMutation({
    mutationKey: ["addTodo"],
    mutationFn: addTodoMutationFn,
    onMutate: async (addedToDo) => {
      console.log("onMutate: ", addedToDo);
      await queryClient.cancelQueries({ queryKey: todoKeys.all });

      const previousToDos = queryClient.getQueryData<ToDo[]>(["todos"]);

      queryClient.setQueryData<ToDo[]>(["todos"], (old) => {
        return (
          (old && [
            ...old,
            {
              ...addedToDo,
              completed: false,
              // random ID that will be overwritten when invalidating
              id: uuid.v4().toString(),
            },
          ]) ||
          []
        );
      });
      return { previousToDos };
    },
    onError: (err: ClientResponseError, newTodo, context) => {
      queryClient.setQueryData(["todos"], context?.previousToDos);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};

export const addTodoWithIdMutationFn = async ({
  id,
  name,
  description,
}: AddTodoWithIdInput) => {
  const addTodoWithId = await pb
    .collection("todos")
    .create({ id, name, description });
  return addTodoWithId;
};

export const useAddTodoWithId = (queryClient: QueryClient) => {
  return useMutation({
    mutationKey: ["addTodoWithId"],
    mutationFn: addTodoWithIdMutationFn,
    onMutate: async (addedToDo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousToDos = queryClient.getQueryData<ToDo[]>(["todos"]);

      queryClient.setQueryData<ToDo[]>(["todos"], (old) => {
        return (
          (old && [
            ...old,
            {
              ...addedToDo,
              completed: false,
            },
          ]) ||
          []
        );
      });

      return { previousToDos };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["todos"], context?.previousToDos);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};

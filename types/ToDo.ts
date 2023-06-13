export type ToDo = {
  id: string;
  name: string;
  description: string;
  completed: boolean;
};

export type AddToDoInput = {
  name: string;
  description: string;
};

export type AddTodoWithIdInput = {
  id: string;
  name: string;
  description: string;
};

export const todoKeys = {
  all: ["todos"] as const,
  lists: () => [...todoKeys.all, "list"] as const,
  list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, "detail"] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
};

export const movieKeys = {
  all: () => ["movies"],
  list: () => [...movieKeys.all(), "list"],
  details: () => [...movieKeys.all(), "detail"],
  detail: (id: string) => [...movieKeys.details(), id],
};

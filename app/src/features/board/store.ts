import { boardAPI, Task } from "api/board";
import { selector } from "recoil";

export const columnsStore = selector({
  key: "columnsStore",
  get: () => boardAPI.getBoardColumns().then((res) => res.data),
});

export const tasksStore = selector({
  key: "tasksStore",
  get: async () => {
    const tasks = await boardAPI.getTasks().then((res) => res.data);

    const tasksByGroup = tasks.reduce<Record<string, Task[]>>((acc, curr) => {
      acc[curr.columnId] = (acc[curr.columnId] || []).concat(curr);

      return acc;
    }, {});

    return tasksByGroup;
  },
});

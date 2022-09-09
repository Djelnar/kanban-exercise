import { boardAPI, Task } from "api/board";
import { keyBy, orderBy } from "lodash";
import { atom, selector } from "recoil";

const getTasks = async () => {
  const tasks = await boardAPI.getTasks().then((res) => res.data);

  return orderBy(tasks, "sortOrder", "asc");
};

export const columnsStore = selector({
  key: "columnsStore",
  get: () => boardAPI.getBoardColumns().then((res) => res.data),
});

export const tasksArray = atom({
  key: "tasksArray",
  default: getTasks(),
});

export const tasksMap = selector({
  key: "tasksMap",
  get: ({ get }) => {
    const tasks = get(tasksArray);

    const tasksByKey = tasks.reduce<Record<string, Task>>(
      (acc, curr) => ((acc[curr.id] = curr), acc),
      {}
    );

    return tasksByKey;
  },
});

export const tasksStore = selector({
  key: "tasksStore",
  get: ({ get }) => {
    const tasks = get(tasksArray);
    const columns = get(columnsStore);
    const columnsObject = columns.reduce<Record<string, Task[]>>(
      (acc, curr) => ((acc[curr.id] = []), acc),
      {}
    );

    const tasksByGroup = tasks.reduce<Record<string, Task[]>>((acc, curr) => {
      acc[curr.columnId] = (acc[curr.columnId] || []).concat(curr);

      return acc;
    }, columnsObject);

    return tasksByGroup;
  },
});

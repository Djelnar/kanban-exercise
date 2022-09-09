import { boardAPI, Task } from "api/board";
import { groupBy, keyBy, orderBy } from "lodash";
import { atom, selector } from "recoil";

const getTasks = () => boardAPI.getTasks().then((res) => res.data);

export const columnsStore = selector({
  key: "columnsStore",
  get: () => boardAPI.getBoardColumns().then((res) => res.data),
});

export const tasksArrayStore = atom({
  key: "tasksArrayStore",
  default: getTasks(),
});

export const tasksMap = selector({
  key: "tasksMap",
  get: ({ get }) => {
    const tasks = get(tasksArrayStore);

    return keyBy(tasks, "id");
  },
});

export const tasksGroupsStore = selector({
  key: "tasksGroupsStore",
  get: ({ get }) => {
    const tasks = get(tasksArrayStore);

    return groupBy(tasks, "columnId");
  },
});

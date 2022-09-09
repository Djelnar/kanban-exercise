import * as mockData from "./mockData";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "lodash";

export type BoardColumn = {
  id: string;
  name: string;
};
export type Task = {
  id: string;
  name: string;
  assigned: string[];
  importance: number;
  description: string;
  columnId: string;
  sortOrder: number;
};

const tasksLoaded = JSON.parse(localStorage.getItem("tasks") ?? "null") as
  | Task[]
  | null;

class BoardAPI {
  private boardColumns: BoardColumn[] = mockData.boardColumns;
  private tasks: Task[] = tasksLoaded ?? mockData.tasks;

  private saveState = () => {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  };

  getBoardColumns = () =>
    new Promise<{ status: number; data: BoardColumn[] }>((resolve, reject) => {
      setTimeout(
        () =>
          resolve({
            status: 200,
            data: cloneDeep(this.boardColumns),
          }),
        250
      );
    });

  getTasks = () =>
    new Promise<{ status: number; data: Task[] }>((resolve, reject) => {
      setTimeout(
        () =>
          resolve({
            status: 200,
            data: cloneDeep(this.tasks),
          }),
        250
      );
    });

  createTask = (data: Omit<Task, "id" | "columnId" | "sortOrder">) =>
    new Promise<{ status: number; data: Task }>((resolve, reject) => {
      const id = uuidv4();

      const newTask: Task = {
        ...data,
        id,
        sortOrder: this.tasks.length,
        columnId: this.boardColumns[0].id,
      };

      this.tasks.push(newTask);
      this.saveState();
      setTimeout(
        () =>
          resolve({
            status: 201,
            data: newTask,
          }),
        250
      );
    });

  deleteTask = (id: string) =>
    new Promise((resolve, reject) => {
      this.tasks = this.tasks.filter((tsk) => tsk.id !== id);

      this.saveState();
      setTimeout(() => resolve({ status: 204 }), 250);
    });

  editTask = (data: Omit<Task, "sortOrder" | "columnId">) =>
    new Promise((resolve, reject) => {
      const taskIndex = this.tasks.findIndex((tsk) => tsk.id === data.id);

      if (taskIndex > -1) {
        this.tasks[taskIndex] = {
          ...this.tasks[taskIndex],
          ...data,
        };

        this.saveState();
        return setTimeout(() => resolve({ status: 200 }), 250);
      } else {
        return setTimeout(() => reject(new Error("Task not found")), 250);
      }
    });

  bulkReorderTasks = (
    data: Record<string, Pick<Task, "id" | "sortOrder" | "columnId">>
  ) =>
    new Promise((resolve, reject) => {
      this.tasks = this.tasks.map((item) => {
        const changes = data[item.id];

        if (changes) {
          return {
            ...item,
            ...changes,
          };
        }
        return item;
      });

      this.saveState();
      return setTimeout(() => resolve({ status: 200 }), 250);
    });
}

export const boardAPI = new BoardAPI();

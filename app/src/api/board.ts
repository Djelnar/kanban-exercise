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

class BoardAPI {
  private boardColumns: BoardColumn[] = mockData.boardColumns;
  private tasks: Task[] = mockData.tasks;
  private firstId = "104d81c0-b63b-4387-b6d8-2c19333e85a7";
  private lastId = "b49a55ba-c280-40ae-a217-8d64dbb53257";

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

  createTask = (data: Omit<Task, "id" | "columnId">) =>
    new Promise<{ status: number; data: Task }>((resolve, reject) => {
      const id = uuidv4();

      const newTask: Task = {
        ...data,
        id,
        sortOrder: this.tasks.length,
        columnId: this.boardColumns[0].id,
      };

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

      setTimeout(() => resolve({ status: 204 }), 250);
    });

  editTask = (data: Task) =>
    new Promise((resolve, reject) => {
      const taskIndex = this.tasks.findIndex((tsk) => tsk.id === data.id);

      if (taskIndex > -1) {
        this.tasks[taskIndex] = {
          ...this.tasks[taskIndex],
          ...data,
        };

        return setTimeout(() => resolve({ status: 200 }), 250);
      } else {
        return setTimeout(() => reject(new Error("Task not found")), 250);
      }
    });
}

export const boardAPI = new BoardAPI();

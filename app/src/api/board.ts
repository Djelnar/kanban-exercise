import * as mockData from "./mockData";
import { v4 as uuidv4 } from "uuid";

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
  prevId: string | null;
  nextId: string | null;
};

class BoardAPI {
  private boardColumns: BoardColumn[] = mockData.boardColumns;
  private tasks: Record<string, Task> = mockData.tasks;
  private firstId = "104d81c0-b63b-4387-b6d8-2c19333e85a7";
  private lastId = "b49a55ba-c280-40ae-a217-8d64dbb53257";

  getBoardColumns = () =>
    new Promise<{ status: number; data: BoardColumn[] }>((resolve, reject) => {
      setTimeout(
        () =>
          resolve({
            status: 200,
            data: JSON.parse(JSON.stringify(this.boardColumns)),
          }),
        250
      );
    });

  getTasks = () =>
    new Promise<{ status: number; data: Task[] }>((resolve, reject) => {
      const firstTask = this.tasks[this.firstId];

      const getNext = (task: Task): Task[] => {
        if (task.nextId) {
          return [task, ...getNext(this.tasks[task.nextId])];
        } else {
          return [task];
        }
      };

      const taskList = getNext(firstTask);

      setTimeout(
        () =>
          resolve({
            status: 200,
            data: JSON.parse(JSON.stringify(taskList)),
          }),
        250
      );
    });

  createTask = (data: Omit<Task, "id" | "prevId" | "nextId">) =>
    new Promise((resolve, reject) => {
      if (!this.boardColumns.find((column) => column.id === data.columnId)) {
        reject(new Error("Column not found"));
      }
      const id = uuidv4();

      const newTask: Task = { id, ...data, prevId: this.lastId, nextId: null };

      this.tasks[this.lastId].nextId = id;

      this.lastId = id;

      this.tasks[id] = newTask;

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
      const task = this.tasks[id];

      if (task) {
        const { prevId, nextId } = task;
        if (prevId) {
          this.tasks[prevId].nextId = nextId;
        }
        if (nextId) {
          this.tasks[nextId].prevId = prevId;
        }
        delete this.tasks[id];
      }

      setTimeout(() => resolve({ status: 204 }), 250);
    });

  editTask = (data: Omit<Task, "prevId" | "nextId">) =>
    new Promise((resolve, reject) => {
      const task = this.tasks[data.id];

      if (task) {
        this.tasks[data.id] = {
          ...task,
          ...data,
          prevId: task.prevId,
          nextId: task.nextId,
        };

        return setTimeout(() => resolve({ status: 200 }), 250);
      } else {
        return setTimeout(() => reject(new Error("Task not found")), 250);
      }
    });
}

export const boardAPI = new BoardAPI();

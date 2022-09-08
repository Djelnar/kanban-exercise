//@ts-check
import * as mockData from "./mockData";
import { v4 as uuidv4 } from "uuid";

class BoardAPI {
  boardColumns = mockData.boardColumns;
  tasks = mockData.tasks;

  getBoardColumns = () =>
    new Promise((resolve, reject) => {
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
    new Promise((resolve, reject) => {
      setTimeout(
        () =>
          resolve({
            status: 200,
            data: JSON.parse(JSON.stringify(this.tasks)),
          }),
        250
      );
    });

  createTask = (data) =>
    new Promise((resolve, reject) => {
      if (!this.boardColumns.find((column) => column.id === data.columnId)) {
        reject(new Error("Column not found"));
      }
      const id = uuidv4();
      const newTask = { id, ...data };

      this.tasks.push(newTask);

      setTimeout(
        () =>
          resolve({
            status: 201,
            data: newTask,
          }),
        250
      );
    });

  deleteTask = (id) =>
    new Promise((resolve, reject) => {
      this.tasks = this.tasks.filter((task) => task.id !== id);

      setTimeout(() => resolve({ status: 204 }), 250);
    });

  editTask = (id, data) =>
    new Promise((resolve, reject) => {
      const taskIndex = this.tasks.findIndex((t) => t.id === id);

      if (taskIndex != null && taskIndex > -1) {
        this.tasks[taskIndex] = { ...data, id };
        return setTimeout(() => resolve({ status: 200 }), 250);
      } else {
        return setTimeout(() => reject(new Error("Task not found")), 250);
      }
    });
}

export default new BoardAPI();

import { cloneDeep } from "lodash";
import { users } from "./mockData";

export type User = {
  id: string;
  name: string;
};

class UserAPI {
  getUsers = () =>
    new Promise<{ status: number; data: User[] }>((resolve, reject) => {
      setTimeout(
        () =>
          resolve({
            status: 200,
            data: cloneDeep(users),
          }),
        250
      );
    });
}

export const userAPI = new UserAPI();

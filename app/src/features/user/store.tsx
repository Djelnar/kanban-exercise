import { User, userAPI } from "api/user";
import { selector } from "recoil";

export const usersStore = selector({
  key: "usersStore",
  get: async () => {
    const users = await userAPI.getUsers().then((res) => res.data);

    const usersByKey = users.reduce<Record<string, User>>(
      (acc, curr) => ((acc[curr.id] = curr), acc),
      {}
    );

    return usersByKey;
  },
});

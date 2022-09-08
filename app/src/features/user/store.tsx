import { User, userAPI } from "api/user";
import { selector } from "recoil";

export const usersArray = selector({
  key: "usersArray",
  get: async () => {
    const users = await userAPI.getUsers().then((res) => res.data);

    return users;
  },
});

export const usersStore = selector({
  key: "usersStore",
  get: async ({ get }) => {
    const users = get(usersArray);

    const usersByKey = users.reduce<Record<string, User>>(
      (acc, curr) => ((acc[curr.id] = curr), acc),
      {}
    );

    return usersByKey;
  },
});

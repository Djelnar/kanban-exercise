import { userAPI } from "api/user";
import { selector } from "recoil";

export const usersStore = selector({
  key: "usersStore",
  get: () => userAPI.getUsers().then((res) => res.data),
});

import { Board } from "features/board";
import { TaskView } from "features/task-view";
import { usersStore } from "features/user/store";
import { Navigate, Route, Routes } from "react-router";
import { useRecoilValueLoadable } from "recoil";
import { SplashScreen } from "ui/splash-screen";

export const App = () => {
  const { contents, state } = useRecoilValueLoadable(usersStore);

  switch (state) {
    case "hasValue":
      return (
        <Routes>
          <Route path="/board" element={<Board />} />
          <Route path="/board/:task" element={<TaskView />} />
          <Route path="*" element={<Navigate to={"/board"} />} />
        </Routes>
      );
    case "hasError":
      return <SplashScreen>{contents.message}</SplashScreen>;
    case "loading":
    default:
      return <SplashScreen>Loading</SplashScreen>;
  }
};

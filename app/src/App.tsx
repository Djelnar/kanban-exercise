import React from "react";

import { Board } from "features/board";
import { TaskView } from "features/task-view";
import { Navigate, Route, Routes } from "react-router";

export const App = () => {
  return (
    <Routes>
      <Route path="/board" element={<Board />} />
      <Route
        path="/board/:task"
        element={
          <>
            <TaskView />
            <Board />
          </>
        }
      />
      <Route path="*" element={<Navigate to={"/board"} />} />
    </Routes>
  );
};

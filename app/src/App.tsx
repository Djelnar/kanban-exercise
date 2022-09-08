import React, { useEffect } from "react";
import { Routes, Route } from "react-router";
import { boardAPI } from "./api/board";
import Board from "./features/board";
import View from "./features/board";

const App = () => {
  useEffect(() => {
    boardAPI.getTasks().then((res) => console.log(res));
  }, []);
  return (
    <Routes>
      <Route path="/board" element={<Board />} />
      <Route path="/board/:task" element={<View />} />
    </Routes>
  );
};

export default App;

import { tasks } from "api/mockData";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { columnsStore, tasksStore } from "./store";
import "./style.css";
import { TaskCard } from "./task-card";

export function Board() {
  const columns = useRecoilValue(columnsStore);
  const tasksGroups = useRecoilValue(tasksStore);

  const navigate = useNavigate();
  const handleAddNew = () => {
    navigate("/board/new");
  };
  return (
    <div className="board">
      {columns.map((column, idx) => (
        <div className="column" key={column.id}>
          <p className="columnHeader">{column.name}</p>
          <div className="columnInner">
            {tasksGroups[column.id]?.map((task) => (
              <TaskCard task={task} key={task.id} />
            ))}
            {idx === 0 && (
              <button
                key="addNewTask"
                onClick={handleAddNew}
                className="addNewTask"
              >
                Add new
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

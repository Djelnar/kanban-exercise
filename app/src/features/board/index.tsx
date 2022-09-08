import { tasks } from "api/mockData";
import React from "react";
import { useRecoilValue } from "recoil";
import { columnsStore, tasksStore } from "./store";
import "./style.css";
import { TaskCard } from "./task-card";

export function Board() {
  const columns = useRecoilValue(columnsStore);
  const tasksGroups = useRecoilValue(tasksStore);

  return (
    <div className="board">
      {columns.map((column) => (
        <div className="column" key={column.id}>
          <p className="columnHeader">{column.name}</p>
          <div className="columnInner">
            {tasksGroups[column.id]?.map((task) => (
              <TaskCard task={task} key={task.id} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

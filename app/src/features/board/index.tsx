import { tasks } from "api/mockData";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import {
  DragDropContext,
  DropResult,
  ResponderProvided,
  Draggable,
  Droppable,
} from "react-beautiful-dnd";
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

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    console.log(result);
    console.log(
      "🚀 ~ file: index.tsx ~ line 23 ~ onDragEnd ~ provided",
      provided
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board">
        {columns.map((column, idx) => (
          <div className="column" key={column.id}>
            <p className="columnHeader">{column.name}</p>
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  className={`columnInner ${
                    snapshot.draggingOverWith && !snapshot.draggingFromThisWith
                      ? "columnInnerDraggingOver"
                      : ""
                  }`}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {tasksGroups[column.id]?.map((task, taskIndex) => (
                    <TaskCard
                      task={task}
                      key={task.id}
                      index={taskIndex}
                      done={idx === columns.length - 1}
                    />
                  ))}
                  {provided.placeholder}
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
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}

import { tasks } from "api/mockData";
import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  DragDropContext,
  DropResult,
  ResponderProvided,
  Draggable,
  Droppable,
} from "react-beautiful-dnd";
import { columnsStore, tasksStore, tasksArray } from "./store";
import "./style.css";
import { TaskCard } from "./task-card";
import { clone, cloneDeep, keyBy } from "lodash";
import { Task } from "api/board";

export function Board() {
  const columns = useRecoilValue(columnsStore);
  const tasksGroups = useRecoilValue(tasksStore);

  const navigate = useNavigate();
  const handleAddNew = () => {
    navigate("/board/new");
  };

  const onDragEnd = useCallback(
    (result: DropResult, provided: ResponderProvided) => {
      const taskId = result.draggableId;

      const sourceColumnId = result.source?.droppableId;
      const destinationColumnId = result.destination?.droppableId;

      const sourceIndex = result.source.index;
      const destIndex = result.destination?.index;
    },
    []
  );

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
                  {tasksGroups[column.id]?.map((task) => (
                    <TaskCard
                      task={task}
                      key={task.id}
                      index={task.sortOrder}
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

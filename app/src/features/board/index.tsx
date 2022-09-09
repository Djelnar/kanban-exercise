import { tasks } from "api/mockData";
import React, { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  DragDropContext,
  DropResult,
  ResponderProvided,
  Draggable,
  Droppable,
} from "react-beautiful-dnd";
import { columnsStore, tasksGroupsStore, tasksArrayStore } from "./store";
import "./style.css";
import { TaskCard } from "./task-card";
import { clone, cloneDeep, groupBy, keyBy, orderBy } from "lodash";
import { boardAPI, Task } from "api/board";

export function Board() {
  const columns = useRecoilValue(columnsStore);
  const [tasksArray, setTasksArray] = useRecoilState(tasksArrayStore);
  const tasksGroups = useRecoilValue(tasksGroupsStore);

  const navigate = useNavigate();
  const handleAddNew = () => {
    navigate("/board/new");
  };

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const taskId = result.draggableId;

    const sourceColumnId = result.source?.droppableId;
    const destinationColumnId = result.destination?.droppableId;

    const sourceIndex = result.source.index;
    const destIndex = result.destination?.index;

    if (destIndex != null && destinationColumnId) {
      let column = cloneDeep(tasksGroups[destinationColumnId]);
      const ids = column?.map((item) => item.id) ?? [];

      if (destinationColumnId === sourceColumnId) {
        ids.splice(destIndex, 0, ids.splice(sourceIndex, 1)[0]);
      } else {
        ids.splice(destIndex, 0, taskId);
      }

      const idsObjects = ids.map((id, index) => ({
        id,
        sortOrder: index,
        columnId: destinationColumnId,
      }));

      const idsByKey = keyBy(idsObjects, "id");

      const clonedTasks = cloneDeep(tasksArray).map((item) => {
        const changes = idsByKey[item.id];
        if (changes) {
          return {
            ...item,
            ...changes,
          };
        }
        return item;
      });

      boardAPI.bulkReorderTasks(idsByKey);

      setTasksArray(orderBy(clonedTasks, "sortOrder", "asc"));
    }
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
                  {tasksGroups[column.id]?.map((task, index) => (
                    <TaskCard
                      task={task}
                      key={task.id}
                      index={index}
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

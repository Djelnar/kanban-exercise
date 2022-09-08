import { Task } from "api/board";
import { usersStore } from "features/user/store";
import React from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Draggable } from "react-beautiful-dnd";

type Props = {
  task: Task;
  done?: boolean;
  index: number;
};

export function TaskCard({ task, done, index }: Props) {
  const usersByKey = useRecoilValue(usersStore);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`card ${done ? "card-done" : `card-${task.importance}`}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Link to={`/board/${task.id}`} className="cardTitle">
            {task.name}
          </Link>
          <div className="cardUsers">
            <p className="cardUserTitle">Assigned to:</p>
            {task.assigned?.map((user) => (
              <p key={user} className="cardUser">
                — {usersByKey[user].name}
              </p>
            ))}
          </div>
        </div>
      )}
    </Draggable>
  );
}

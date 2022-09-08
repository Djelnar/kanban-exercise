import { Task } from "api/board";
import { usersStore } from "features/user/store";
import React from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";

type Props = {
  task: Task;
};

export function TaskCard({ task }: Props) {
  const usersByKey = useRecoilValue(usersStore);

  return (
    <div className={`card card-${task.importance}`}>
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
  );
}

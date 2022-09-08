import { Task } from "api/board";
import { usersStore } from "features/user/store";
import React from "react";
import { useRecoilValue } from "recoil";

type Props = {
  task: Task;
};

export function TaskCard({ task }: Props) {
  const usersByKey = useRecoilValue(usersStore);

  return (
    <div className={`card card-${task.importance}`}>
      <a href={`/board/${task.id}`} className="cardTitle">
        {task.name}
      </a>
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

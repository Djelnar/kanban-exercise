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
      <p className="cardTitle">{task.name}</p>
      <div className="cardUsers">
        <p className="cardUserTitle">Assigned to:</p>
        {task.assigned?.map((user) => (
          <p className="cardUser">— {usersByKey[user].name}</p>
        ))}
      </div>
    </div>
  );
}

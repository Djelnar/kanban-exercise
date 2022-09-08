import { boardAPI } from "api/board";
import { tasksArray as _tasksArray, tasksMap } from "features/board/store";
import { usersArray } from "features/user/store";
import React, { useCallback, useMemo, useState } from "react";
import Modal from "react-modal";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { SplashScreen } from "ui/splash-screen";

type Props = {};

export function TaskView(props: Props) {
  const navigate = useNavigate();
  const params = useParams();
  const tasks = useRecoilValue(tasksMap);
  const [tasksArray, setTasksArray] = useRecoilState(_tasksArray);

  const [loading, setLoading] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(true);
  const closeModal = () => {
    navigate("/board");
    setModalIsOpen(false);
  };

  const task = useMemo(() => tasks[params.task!], [params.task]);

  const users = useRecoilValue(usersArray);

  const [name, setName] = useState(task.name ?? "");
  const [description, setDescription] = useState(task.description ?? "");
  const [importance, setImportance] = useState(task.importance ?? 0);
  const [assigned, setAssigned] = useState(task.assigned ?? []);
  const handleChangeAssigned: React.ChangeEventHandler<HTMLSelectElement> = (
    e
  ) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setAssigned(values);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      setLoading(true);

      const data = {
        id: task.id,
        name,
        description,
        importance,
        assigned,
      };
      boardAPI
        .editTask(data)
        .then(() => {
          setTasksArray(
            tasksArray.map((tsk: any) =>
              tsk.id === task.id
                ? {
                    ...tsk,
                    ...data,
                  }
                : tsk
            )
          );
          closeModal();
        })
        .finally(() => setLoading(false));
    },
    [
      boardAPI,
      tasksArray,
      setTasksArray,
      task,
      name,
      description,
      importance,
      assigned,
    ]
  );

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={{
        content: {
          width: "50vw",
          height: "50vh",
          margin: "auto",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
        <select
          name="importance"
          value={importance}
          onChange={(e) => setImportance(+e.target.value)}
          disabled={loading}
        >
          <option value={0}>Low</option>
          <option value={1}>Medium</option>
          <option value={2}>High</option>
        </select>
        <select
          name="assigned"
          value={assigned}
          onChange={handleChangeAssigned}
          multiple
          disabled={loading}
        >
          {users.map((user) => (
            <option value={user.id} key={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading}>
          Save
        </button>
        <button type="button" onClick={closeModal} disabled={loading}>
          Cancel
        </button>
      </form>
    </Modal>
  );
}

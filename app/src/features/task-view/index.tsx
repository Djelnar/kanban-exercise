import { boardAPI } from "api/board";
import { tasksArrayStore, tasksMap } from "features/board/store";
import { usersArray } from "features/user/store";
import React, { useCallback, useMemo, useState } from "react";
import Modal from "react-modal";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { SplashScreen } from "ui/splash-screen";
import "./style.css";
type Props = {};

export function TaskView(props: Props) {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.task!;
  const tasks = useRecoilValue(tasksMap);
  const [tasksArray, setTasksArray] = useRecoilState(tasksArrayStore);

  const [loading, setLoading] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(true);
  const closeModal = () => {
    navigate("/board");
    setModalIsOpen(false);
  };

  const task = useMemo(() => tasks[id] ?? {}, [id]);

  const users = useRecoilValue(usersArray);

  const [name, setName] = useState(task.name ?? "");
  const [description, setDescription] = useState(task.description ?? "");
  const [importance, setImportance] = useState(task.importance ?? 0);
  const [assigned, setAssigned] = useState(task.assigned ?? []);

  const [error, setError] = useState("");

  const handleChangeAssigned: React.ChangeEventHandler<HTMLSelectElement> = (
    e
  ) => {
    setError("");
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setAssigned(values);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();

      if (name.length === 0) {
        setError("Name must not be empty");
        return;
      }
      if (assigned.length === 0) {
        setError("Task must be assigned to a person");
        return;
      }

      setLoading(true);

      const data = {
        id: task.id,
        name,
        description,
        importance,
        assigned,
      };

      if (id === "new") {
        boardAPI
          .createTask(data)
          .then((res) => {
            setTasksArray(tasksArray.concat(res.data));

            closeModal();
          })
          .finally(() => setLoading(false));
      } else {
        boardAPI
          .editTask(data)
          .then(() => {
            setTasksArray(
              tasksArray.map((tsk) =>
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
      }
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

  const metaKey = navigator.userAgent.includes("Mac OS X") ? "⌘" : "Ctrl";

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={{
        content: {
          width: "50vw",
          height: "60vh",
          margin: "auto",
        },
      }}
    >
      <form onSubmit={handleSubmit} className="taskForm">
        <h1>
          {id === "new" ? "Create" : "Edit"} task {id !== "new" && task.id}
        </h1>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          className="taskInput"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          className="taskTextArea"
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
          className="taskUsersSelect"
        >
          {users.map((user) => (
            <option value={user.id} key={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <p>Use {metaKey} key to multi-select users</p>
        <div className="taskButtons">
          <button className="taskButton" type="submit" disabled={loading}>
            Save
          </button>
          <button
            className="taskButton"
            type="button"
            onClick={closeModal}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
        <p className="taskError">{error}</p>
      </form>
    </Modal>
  );
}

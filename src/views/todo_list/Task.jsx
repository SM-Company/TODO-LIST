import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { openDeleteModal, openUpdateTaskFromModal } from "../../feartures/tasks/taskSlice";

function Task({ task }) {
  const [taskCompleted, setTaskCompleted] = useState(task.completed)
  const dispatch = useDispatch();

  const handleOpenDeleteTask = (taskID) => {
    dispatch(openDeleteModal(taskID))
  };

  const handleOpenUpdateTaskFormModal = (task) => {
    dispatch(openUpdateTaskFromModal(task));
  }

  return (
    <div className="d-flex justify-content-between bg-white w-100 rounded p-3 mb-4">
      <div className="task-title-info-container d-flex">
        <div className="d-flex align-items-center me-3">
          <input
            type="checkbox"
            checked={taskCompleted}
            disabled={true}
            className="form-check-input p-3"
          />
        </div>
        <div className="d-flex flex-column">
          <p className="mb-0">{task.title}</p>
          <p className="mb-0">{task.date}</p>
        </div>
      </div>
      <div className="me-3">
        <p className="mb-0">{task.description}</p>
      </div>
      <div className="d-flex">
        <div className="d-flex align-items-center">
          <button className="btn btn-danger me-2" onClick={() => {handleOpenDeleteTask(task.id)}}>
            <i className="bi bi-x-square"></i>
          </button>
        </div>
        <div className="d-flex align-items-center">
          <button
            className="btn btn-secondary"
            onClick={() => {handleOpenUpdateTaskFormModal(task)}}
          >
            <i className="bi bi-pencil-square"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Task;

import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import "./Todolist.css";
import Task from "./Task";
import TaskFormModal from "../../components/task-form/TaskFormModal";
import { useDispatch, useSelector } from "react-redux";
import AlertModal from "../../components/alert_modal/AlertModal";
import {
  getAllTasks,
  orderByCompleted,
  orderByDate,
  orderByPending,
} from "../../feartures/tasks/taskSlice";

function ToDoList() {
  const [showTaskFormModal, setShowTaskFormModal] = useState(false);
  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllTasks());
  }, []);

  const handleOrderTasks = (e) => {
    const option = e.target.value;
    switch (option) {
      case "all":
        dispatch(orderByDate());
        break;
      case "pending":
        dispatch(orderByPending());
        break;
      case "completed":
        dispatch(orderByCompleted());
        break;
    }
  };

  return (
    <>
      <Header />

      {/* Modals */}
      <TaskFormModal
        show={showTaskFormModal}
        onHide={() => setShowTaskFormModal(false)}
      />
      <AlertModal />

      {/* Modals */}

      <div className="d-flex justify-content-center">
        <div className="p-5 todo-list-container ">
          <div className="d-flex">
            <div className="d-flex flex-start me-3">
              <button
                className="btn btn-primary px-4"
                onClick={() => {

                  setShowTaskFormModal(true);
                }}
              >
                Add Task
              </button>
            </div>
            <div className="d-flex flex-start">
              <select
                className="form-select"
                defaultValue="all"
                onChange={handleOrderTasks}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="tasks-container d-flex flex-column align-items-start rounded sbg-one-2 mt-4 p-4 ">
            {tasks.is_loading ? (
              <div className="d-flex justify-content-center align-items-center w-100" style={{height: "300px"}}>
                <div
                  className="spinner-border spinner-border text-primary"
                  role="status"
                  style={{ width: "4rem", height: "4rem" }}
                ></div>
              </div>
            ) : (
              <>
                {tasks.tasks.length > 0 ? (
                  tasks.tasks.map((task) => <Task task={task} key={task.id} />)
                ) : (
                  <div className="d-flex justify-content-center align-items-center w-100">
                    <h3>No task added yet</h3>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ToDoList;

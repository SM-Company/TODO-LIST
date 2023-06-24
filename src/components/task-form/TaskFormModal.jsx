import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { getCurrentTime } from "../get_time/getTime";
import { useDispatch } from "react-redux";
import {
  addTask,
  closeAlertModal,
  closeUpdateFormModal,
  updateTask,
} from "../../feartures/tasks/taskSlice";
import { useSelector } from "react-redux";

function TaskFormModal({ show, onHide }) {
  const tasks = useSelector((state) => state.tasks);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskState, setTaskState] = useState(useSelector((state) => state.tasks.task_form_modal.task.completed));

  useEffect(() => {
    setTaskTitle(tasks.task_form_modal.task.title);
    setTaskDescription(tasks.task_form_modal.task.description);
  }, [tasks]);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (tasks.task_form_modal.show_form) {
      const task = tasks.task_form_modal.task;
      const taskUpdated = {
        ...task,
        title: taskTitle,
        description: taskDescription,
        completed: taskState,
      }
      dispatch(updateTask(taskUpdated))
    } else {
      const newTask = {
        title: taskTitle,
        description: taskDescription,
        date: getCurrentTime(),
        completed: false,
      };

      dispatch(addTask(newTask)).then((res) => {
        setTimeout(() => {
          dispatch(closeAlertModal());
        }, 3000);
      });
    }
  };

  const handleCloseModall = () => {
    onHide();
    dispatch(closeUpdateFormModal());
  };

  return (
    <Modal
      show={show || tasks.task_form_modal.show_form}
      onHide={handleCloseModall}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {tasks.task_form_modal.show_form ? "Update Task" : "Add Task"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div>
          <form action="" className="p-2" onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              value={taskTitle}
              className="form-control"
              placeholder="Title"
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <textarea
              name="description"
              value={taskDescription}
              cols="30"
              rows="4"
              className="form-control mt-3"
              placeholder="Description"
              onChange={(e) => setTaskDescription(e.target.value)}
            ></textarea>
            <select
              className={`form-select mt-3 w-50 ${tasks.task_form_modal.show_form ? "" : "d-none"}`}
              defaultValue={taskState ? "completed" : "pending"}
              onChange={(e) => {
                setTaskState(e.target.value === "pending" ? false : true);
              }}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <div className="d-flex  mt-4">
              <div>
                {tasks.btn_submit_loader ? (
                  <button className="btn btn-primary me-2" style={{ width: "131px", }} >
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    ></div>
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary me-2 px-5">
                    Save
                  </button>
                )}
              </div>
              <button type="button" className="btn btn-secondary px-5" onClick={handleCloseModall} >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default TaskFormModal;

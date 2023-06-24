import Modal from "react-bootstrap/Modal";
import { closeAlertModal, deleteTask } from "../../feartures/tasks/taskSlice";
import { useDispatch, useSelector } from "react-redux";

function AlertModal() {
  const {alert_modal, btn_submit_loader} = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    dispatch(closeAlertModal());
  };

  const handleDeleteTask = () => {
    const taskId = alert_modal.task_id;
    dispatch(deleteTask(taskId));
  }

  return (
    <div>
      <Modal
        show={alert_modal.show}
        onHide={handleCloseModal}
      >
        <Modal.Body>
          <div>
            <div className="d-flex justify-content-center">
              <i
                className={`bi ${alert_modal.success ? "bi-clipboard2-check text-success" : "bi-clipboard-x text-danger"} `}
                style={{ fontSize: "100px" }}
              ></i>
            </div>
            <div className="d-flex flex-column align-items-center">
              <h2 className={`${alert_modal.success ? "text-success" : "text-danger"}`}>{alert_modal.message}</h2>
              <p className="text-muted">
                {alert_modal.description}
              </p>
            </div>
          </div>
          <div className="d-flex justify-content-center mb-2 mt-3">
            <button className={`btn px-5 ${alert_modal.success ? "btn-success" : "btn-danger"}`} onClick={handleCloseModal}>Accept</button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={alert_modal.delete_modal}
        onHide={handleCloseModal}
      >
        <Modal.Body>
          <div>
            <div className="d-flex justify-content-center">
              <i
                className="bi bi-exclamation-circle text-danger"
                style={{ fontSize: "100px" }}
              ></i>
            </div>
            <div className="d-flex flex-column align-items-center">
              <h2 className="text-danger">{alert_modal.message}</h2>
              <p className="text-muted">
                {alert_modal.description}
              </p>
            </div>
          </div>
          <div className="d-flex justify-content-center mb-2 mt-3">
            <div>
                {btn_submit_loader ? (
                  <button className="btn btn-danger me-3" style={{width: "143px"}}>
                    <div className="spinner-border spinner-border-sm"  role="status"></div>
                  </button>
                ) : (
                    <button className="btn btn-danger px-5 me-3" onClick={handleDeleteTask}>Delete</button>
                )}
              </div>
            <button className="btn btn-secondary px-5" onClick={handleCloseModal}>Cancel</button>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  );
}

export default AlertModal;

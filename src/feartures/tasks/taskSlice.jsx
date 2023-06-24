import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebase";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const initialState = {
  tasks: { tasks: [], is_loading: true },
  btn_submit_loader: false,
  alert_modal: {
    message: "",
    description: "",
    success: false,
    show: false,
    delete_modal: false,
    task_id: "",
  },
  task_form_modal: {
    show_form: false,
    task: {
      id: "",
      title: "",
      description: "",
      date: "",
      completed: false,
    },
  },
};

export const getAllTasks = () => {
  return async (dispatch) => {
    try {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      dispatch(setAllTasks(tasks));
    } catch (error) {
      dispatch(handelIsFetchingDocuments(false));
      console.error("Error retrieving tasks:", error);
    }
  };
};

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (taskData, { dispatch }) => {
    try {
      const ref = await addDoc(collection(db, "tasks"), taskData);
      const newTaskData = { ...taskData, id: ref.id };
      dispatch(addTaskToArray(newTaskData));
      return ref;
    } catch (error) {
      throw new Error("Error adding document: " + error.message);
    }
  }
);

export const updateTask = (task) => {
  return async (dispatch) => {
    try {
      dispatch(handleBtnSubmitLoader(true));
      await updateDoc(doc(db, "tasks", task.id), task);

      dispatch(updateTaskToArray(task));
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };
};

export const deleteTask = (taskId) => {
  return async (dispatch) => {
    try {
      // Eliminar la tarea de Firestore
      dispatch(handleBtnSubmitLoader(true));
      await deleteDoc(doc(db, "tasks", taskId));

      // Despachar la acción para eliminar la tarea del estado
      dispatch(removeTask(taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Handle tasks
    setAllTasks: (state, action) => {
      state.tasks.tasks = action.payload;
      state.tasks.tasks.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
      state.tasks.is_loading = false;
    },

    addTaskToArray: (state, action) => {
      const task = action.payload;
      state.tasks.tasks.unshift(task);
    },

    updateTaskToArray: (state, action) => {
      const updatedTask = action.payload;
      const index = state.tasks.tasks.findIndex(
        (task) => task.id === updatedTask.id
      );
      if (index !== -1) {
        state.tasks.tasks.splice(index, 1, updatedTask);
      }
      state.task_form_modal.task = updatedTask;
      state.btn_submit_loader = false;
      state.task_form_modal.show_form = false;
    },

    removeTask: (state, action) => {
      const taskId = action.payload;
      state.tasks.tasks = state.tasks.tasks.filter(
        (task) => task.id !== taskId
      );
      state.alert_modal = {
        message: "",
        description: "",
        success: false,
        show: false,
        delete_modal: false,
        task_id: "",
      };
      state.btn_submit_loader = false;
    },

    // Handle modals
    closeUpdateFormModal: (state) => {
      state.task_form_modal.show_form = false;
      state.task_form_modal.task = {
        title: "",
        description: "",
        date: "",
        pending: true,
      };
    },

    closeAlertModal: (state) => {
      state.alert_modal = {
        message: "",
        description: "",
        success: false,
        show: false,
        delete_modal: false,
        task_id: "",
      };
    },
    openDeleteModal: (state, action) => {
      const task_id = action.payload;
      state.alert_modal = {
        message: "Delete task?",
        description: "Are you sure to delete this task",
        success: false,
        show: false,
        delete_modal: true,
        task_id,
      };
    },

    openUpdateTaskFromModal: (state, action) => {
      const task = action.payload;
      state.task_form_modal.task = task;
      state.task_form_modal.show_form = true;
    },

    // Handle loaders
    handelIsFetchingDocuments: (state, action) => {
      state.tasks.is_loading = action.payload;
    },

    handleBtnSubmitLoader: (state, action) => {
      state.btn_submit_loader = action.payload;
    },

    // Handle order of tasks
    orderByDate: (state) => {
      state.tasks.tasks.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
    },

    orderByPending: (state) => {
      state.tasks.tasks.sort((a, b) => {
        if (!a.completed && b.completed) {
          return -1;
        } else if (a.completed && !b.completed) {
          return 1;
        } else {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        }
      });
    },

    orderByCompleted: (state) => {
      state.tasks.tasks.sort((a, b) => {
        if (a.completed && !b.completed) {
          return -1;
        } else if (!a.completed && b.completed) {
          return 1;
        } else {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        }
      });
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(addTask.pending, (state) => {
        state.btn_submit_loader = true;
      })
      .addCase(addTask.fulfilled, (state) => {
        state.btn_submit_loader = false;
        state.alert_modal.show = true;
        state.alert_modal.success = true;
        state.alert_modal.message = "Successful";
        state.alert_modal.description = "The task has been added successfully";
      })
      .addCase(addTask.rejected, (state) => {
        state.btn_submit_loader = false;
        state.alert_modal.show = true;
        state.alert_modal.success = false;
        state.alert_modal.message = "An error ocurred";
        state.alert_modal.description =
          "Sorry, something went wrong. Please try again!";
      });
  },
});

export const {
  closeAlertModal,
  setAllTasks,
  handelIsFetchingDocuments,
  orderByDate,
  orderByPending,
  orderByCompleted,
  removeTask,
  openDeleteModal,
  handleBtnSubmitLoader,
  addTaskToArray,
  openUpdateTaskFromModal,
  closeUpdateFormModal,
  updateTaskToArray,
} = taskSlice.actions;

export default taskSlice.reducer;

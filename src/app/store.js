import { configureStore, getDefaultMiddleware  } from "@reduxjs/toolkit";
import tasksReducer from "../feartures/tasks/taskSlice";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

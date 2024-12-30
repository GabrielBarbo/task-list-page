import React from "react";
import ReactDOM from "react-dom";
import "./styles.css"; // Importe o arquivo CSS
import TaskListPage from "./pages/TaskListPage";

ReactDOM.render(
  <React.StrictMode>
    <TaskListPage />
  </React.StrictMode>,
  document.getElementById("root")
);

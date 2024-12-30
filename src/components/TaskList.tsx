import React, { useState } from "react";
import { Task, Subtask } from "../types/types";

interface TaskListProps {
  tasks: Task[];
  onAddTask: (
    title: string,
    category: string,
    dueDate: Date,
    priority: "High" | "Medium" | "Low",
    notes: string
  ) => void;
  onRemove: (id: number) => void;
  onToggleCompletion: (id: number) => void;
  onAddSubtask: (taskId: number, title: string) => void;
  onToggleSubtaskCompletion: (taskId: number, subtaskId: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onAddTask,
  onRemove,
  onToggleCompletion,
  onAddSubtask,
  onToggleSubtaskCompletion,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("Trabalho");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<
    "High" | "Medium" | "Low"
  >("Medium");
  const [newTaskNotes, setNewTaskNotes] = useState("");

  const handleAddTask = () => {
    if (newTaskTitle.trim() && newTaskDueDate) {
      onAddTask(
        newTaskTitle,
        newTaskCategory,
        new Date(newTaskDueDate),
        newTaskPriority,
        newTaskNotes
      );
      setNewTaskTitle("");
      setNewTaskDueDate("");
      setNewTaskNotes("");
    }
  };

  const handleAddSubtask = (taskId: number, title: string) => {
    if (title.trim()) {
      onAddSubtask(taskId, title);
    }
  };

  const getPriorityClass = (priority: "High" | "Medium" | "Low") => {
    switch (priority) {
      case "High":
        return "list-group-item-danger";
      case "Medium":
        return "list-group-item-warning";
      case "Low":
        return "list-group-item-info";
      default:
        return "";
    }
  };

  return (
    <div>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Título da nova tarefa"
        />
        <select
          className="form-control"
          value={newTaskCategory}
          onChange={(e) => setNewTaskCategory(e.target.value)}
        >
          <option value="Trabalho">Trabalho</option>
          <option value="Pessoal">Pessoal</option>
          <option value="Urgente">Urgente</option>
        </select>
        <input
          type="date"
          className="form-control"
          value={newTaskDueDate}
          onChange={(e) => setNewTaskDueDate(e.target.value)}
        />
        <select
          className="form-control"
          value={newTaskPriority}
          onChange={(e) =>
            setNewTaskPriority(e.target.value as "High" | "Medium" | "Low")
          }
        >
          <option value="High">Alta</option>
          <option value="Medium">Média</option>
          <option value="Low">Baixa</option>
        </select>
        <input
          type="text"
          className="form-control"
          value={newTaskNotes}
          onChange={(e) => setNewTaskNotes(e.target.value)}
          placeholder="Notas"
        />
        <div className="input-group-append">
          <button className="btn btn-primary" onClick={handleAddTask}>
            Adicionar Tarefa
          </button>
        </div>
      </div>
      <ul className="list-group">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              task.completed ? "list-group-item-success" : ""
            } ${getPriorityClass(task.priority)}`}
          >
            <div>
              <span
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  cursor: "pointer",
                }}
                onClick={() => onToggleCompletion(task.id)}
              >
                {task.title} - <em>{task.category}</em> -{" "}
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "Sem data de vencimento"}{" "}
                - {task.priority}
              </span>
              <p>{task.notes}</p>
              <ul className="list-group mt-2">
                {task.subtasks &&
                  task.subtasks.map((subtask) => (
                    <li
                      key={subtask.id}
                      className={`list-group-item d-flex justify-content-between align-items-center ${
                        subtask.completed ? "list-group-item-success" : ""
                      }`}
                    >
                      <span
                        style={{
                          textDecoration: subtask.completed
                            ? "line-through"
                            : "none",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          onToggleSubtaskCompletion(task.id, subtask.id)
                        }
                      >
                        {subtask.title}
                      </span>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() =>
                          onToggleSubtaskCompletion(task.id, subtask.id)
                        }
                      >
                        {subtask.completed ? "Desfazer" : "Completar"}
                      </button>
                    </li>
                  ))}
                <li className="list-group-item">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Título da nova subtarefa"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddSubtask(
                          task.id,
                          (e.target as HTMLInputElement).value
                        );
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />
                </li>
              </ul>
            </div>
            <div>
              <button
                className="btn btn-success btn-sm mr-2"
                onClick={() => onToggleCompletion(task.id)}
              >
                {task.completed ? "Desfazer" : "Completar"}
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onRemove(task.id)}
              >
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

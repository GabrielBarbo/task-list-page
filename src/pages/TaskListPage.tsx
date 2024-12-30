import React, { useState, useEffect } from "react";
import TaskList from "../components/TaskList";
import Login from "../components/Login";
import Register from "../components/Register";
import { Task, Subtask } from "../types/types";
import { supabase } from "../supabaseConfig";

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>("Todas");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [showRegister, setShowRegister] = useState<boolean>(false);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user ?? null);
        }
      );

      return () => {
        authListener?.subscription.unsubscribe();
      };
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Erro ao buscar tarefas:", error);
    } else {
      setTasks(data);
    }
  };

  const addTask = async (
    title: string,
    category: string,
    dueDate: Date,
    priority: "High" | "Medium" | "Low",
    notes: string
  ) => {
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          user_id: user.id,
          title,
          category,
          due_date: dueDate,
          priority,
          notes,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Erro ao adicionar tarefa:", error);
    } else {
      setTasks([...tasks, data]);
    }
  };

  const removeTask = async (id: number) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error("Erro ao remover tarefa:", error);
    } else {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const toggleTaskCompletion = async (id: number) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      const { data, error } = await supabase
        .from("tasks")
        .update({ completed: !task.completed })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Erro ao alternar conclusão da tarefa:", error);
      } else {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, completed: data.completed } : task
          )
        );
      }
    }
  };

  const addSubtask = async (taskId: number, title: string) => {
    const { data, error } = await supabase
      .from("subtasks")
      .insert([{ task_id: taskId, title }])
      .select()
      .single();

    if (error) {
      console.error("Erro ao adicionar subtarefa:", error);
    } else {
      setTasks(
        tasks.map((task) =>
          task.id === taskId
            ? { ...task, subtasks: [...task.subtasks, data] }
            : task
        )
      );
    }
  };

  const toggleSubtaskCompletion = async (taskId: number, subtaskId: number) => {
    const task = tasks.find((task) => task.id === taskId);
    if (task) {
      const subtask = task.subtasks.find((subtask) => subtask.id === subtaskId);
      if (subtask) {
        const { data, error } = await supabase
          .from("subtasks")
          .update({ completed: !subtask.completed })
          .eq("id", subtaskId)
          .select()
          .single();

        if (error) {
          console.error("Erro ao alternar conclusão da subtarefa:", error);
        } else {
          setTasks(
            tasks.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    subtasks: task.subtasks.map((subtask) =>
                      subtask.id === subtaskId
                        ? { ...subtask, completed: data.completed }
                        : subtask
                    ),
                  }
                : task
            )
          );
        }
      }
    }
  };

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter((task) => task.completed).length;
    return (completedTasks / tasks.length) * 100;
  };

  const filteredTasks = tasks.filter((task) => {
    if (!task) return false;
    const matchesCategory = filter === "Todas" || task.category === filter;
    const matchesSearchTerm = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
  };

  if (!user) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4">Lista de Tarefas</h2>
        {showRegister ? (
          <Register onRegisterSuccess={handleRegisterSuccess} />
        ) : (
          <>
            <Login />
            <button
              className="btn btn-link mt-3"
              onClick={() => setShowRegister(true)}
            >
              Registrar-se
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lista de Tarefas</h2>
      <button className="btn btn-secondary mb-4" onClick={handleLogout}>
        Sair
      </button>
      <div className="progress mb-4">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${calculateProgress()}%` }}
          aria-valuenow={calculateProgress()}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {calculateProgress().toFixed(0)}%
        </div>
      </div>
      <div className="filter-group mb-4">
        <label>Filtrar por Categoria:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="Todas">Todas</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Pessoal">Pessoal</option>
          <option value="Urgente">Urgente</option>
        </select>
      </div>
      <div className="search-bar mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar tarefas"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary">Buscar</button>
      </div>
      <TaskList
        tasks={filteredTasks}
        onAddTask={addTask}
        onRemove={removeTask}
        onToggleCompletion={toggleTaskCompletion}
        onAddSubtask={addSubtask}
        onToggleSubtaskCompletion={toggleSubtaskCompletion}
      />
    </div>
  );
};

export default TaskListPage;

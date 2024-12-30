export interface Subtask {
  id: number;
  title: string;
  completed: boolean;
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  category: string;
  dueDate: Date;
  priority: "High" | "Medium" | "Low";
  subtasks: Subtask[];
  notes: string; // Adicionando anotações
}

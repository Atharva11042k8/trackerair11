export interface Task {
  task: string;
  done: boolean;
}

export interface TasksData {
  [date: string]: Task[];
}

export interface HoursData {
  [date: string]: number;
}

export interface ChartDataPoint {
  day: number;
  value: number;
  date: string;
}

export interface AppState {
  tasks: TasksData;
  study: HoursData;
  sleep: HoursData;
  isLoading: boolean;
  error: string | null;
}
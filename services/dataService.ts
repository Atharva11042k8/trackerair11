import { TasksData, HoursData } from '../types';

// Helper to fetch JSON with error handling
const fetchJson = async <T,>(url: string): Promise<T> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load ${url}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

export const fetchAllData = async () => {
  const [tasks, study, sleep] = await Promise.all([
    fetchJson<TasksData>('public/data/tasks.json'),
    fetchJson<HoursData>('public/data/study.json'),
    fetchJson<HoursData>('public/data/sleep.json'),
  ]);

  return { tasks, study, sleep };
};

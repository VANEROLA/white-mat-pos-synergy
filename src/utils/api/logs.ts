import { LogEntry } from "@/types";

/**
 * Add a log entry
 */
export const addLogEntry = (entry: Pick<LogEntry, 'action' | 'details' | 'userId'>): void => {
  try {
    const existingLogsJson = localStorage.getItem('systemLogs') || '[]';
    const existingLogs: LogEntry[] = JSON.parse(existingLogsJson);
    
    const newLog: LogEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    
    const updatedLogs = [newLog, ...existingLogs];
    
    // Keep only the last 100 logs
    const trimmedLogs = updatedLogs.slice(0, 100);
    
    localStorage.setItem('systemLogs', JSON.stringify(trimmedLogs));
  } catch (error) {
    console.error("Failed to add log entry:", error);
  }
};

/**
 * Get system logs
 */
export const getSystemLogs = (): LogEntry[] => {
  try {
    const logsJson = localStorage.getItem('systemLogs') || '[]';
    return JSON.parse(logsJson);
  } catch (error) {
    console.error("Failed to retrieve system logs:", error);
    return [];
  }
};

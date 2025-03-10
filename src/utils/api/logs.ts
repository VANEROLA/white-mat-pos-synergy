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
    
    // Keep only the last 50 logs to save space
    const trimmedLogs = updatedLogs.slice(0, 50);
    
    try {
      localStorage.setItem('systemLogs', JSON.stringify(trimmedLogs));
    } catch (storageError) {
      // If we hit storage limit, keep even fewer logs
      if (storageError instanceof DOMException && 
          (storageError.name === "QuotaExceededError" || storageError.code === 22)) {
        
        try {
          // Try with just 10 logs
          const minimalLogs = updatedLogs.slice(0, 10);
          localStorage.setItem('systemLogs', JSON.stringify(minimalLogs));
        } catch (fallbackError) {
          // If that still fails, just store the current log
          try {
            localStorage.setItem('systemLogs', JSON.stringify([newLog]));
          } catch (finalError) {
            console.error("Could not store logs at all due to storage limitations");
            // At this point we've tried our best
          }
        }
      } else {
        throw storageError; // Re-throw if it's not a storage quota issue
      }
    }
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

/**
 * Clear old logs to free up storage space
 */
export const clearOldLogs = (): boolean => {
  try {
    const existingLogsJson = localStorage.getItem('systemLogs') || '[]';
    const existingLogs: LogEntry[] = JSON.parse(existingLogsJson);
    
    // Keep only logs from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentLogs = existingLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate > sevenDaysAgo;
    });
    
    // Keep at most 50 logs
    const trimmedLogs = recentLogs.slice(0, 50);
    
    localStorage.setItem('systemLogs', JSON.stringify(trimmedLogs));
    return true;
  } catch (error) {
    console.error("Failed to clear old logs:", error);
    return false;
  }
};

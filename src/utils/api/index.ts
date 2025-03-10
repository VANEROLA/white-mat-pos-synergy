
// Export all API functions from their specific modules
export { updateInventory, generateOrderId } from './inventory';
export { getOrderHistory, updateOrder } from './orders';
export { addLogEntry, getSystemLogs } from './logs';

// オフラインログを同期する関数をエクスポート
export const syncOfflineLogs = async () => {
  try {
    const offlineLogsJson = localStorage.getItem('offlineLogs');
    if (!offlineLogsJson) return true;
    
    const offlineLogs = JSON.parse(offlineLogsJson);
    if (offlineLogs.length === 0) return true;
    
    const { addLogEntry } = await import('./logs');
    
    // オフラインログを順番に処理
    for (const log of offlineLogs) {
      await addLogEntry(log);
    }
    
    // すべてのログが同期されたらクリア
    localStorage.removeItem('offlineLogs');
    return true;
  } catch (error) {
    console.error("Failed to sync offline logs:", error);
    return false;
  }
};

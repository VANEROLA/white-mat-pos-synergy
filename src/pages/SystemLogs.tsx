
import React, { useState, useEffect } from 'react';
import { LogEntry } from '@/types';
import { getSystemLogs } from '@/utils/api';
import POSHeader from '@/components/POSHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load logs
    const loadLogs = () => {
      const systemLogs = getSystemLogs();
      setLogs(systemLogs);
      setFilteredLogs(systemLogs);
    };
    
    loadLogs();
  }, []);

  useEffect(() => {
    // Filter logs when search query changes
    if (!searchQuery) {
      setFilteredLogs(logs);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = logs.filter(
      log => 
        log.action.toLowerCase().includes(query) || 
        log.details.toLowerCase().includes(query)
    );
    
    setFilteredLogs(filtered);
  }, [searchQuery, logs]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP');
  };

  const getActionColor = (action: string) => {
    if (action.includes('error')) {
      return 'text-red-600';
    } else if (action.includes('update')) {
      return 'text-blue-600';
    } else {
      return 'text-green-600';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        <POSHeader 
          toggleMenu={() => setIsSidebarOpen(!isSidebarOpen)}
          isMenuOpen={isSidebarOpen}
        />
        
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="mr-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Button>
          <h1 className="text-2xl font-semibold">システムログ</h1>
        </div>
        
        <div className="glass rounded-xl p-6 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary/70" />
              <span>システム操作ログ</span>
            </div>
            
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="ログを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[250px] bg-white/50 backdrop-blur-sm border-muted"
              />
            </div>
          </div>
          
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">ログデータがありません</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">タイムスタンプ</th>
                    <th className="text-left py-3 px-4">アクション</th>
                    <th className="text-left py-3 px-4">詳細</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs">{log.id}</td>
                      <td className="py-3 px-4">{formatDate(log.timestamp)}</td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm max-w-md truncate">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;

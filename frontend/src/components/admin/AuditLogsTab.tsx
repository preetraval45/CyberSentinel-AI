'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, User, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  resource: string;
  resource_id: string;
  details: string;
  ip_address: string;
  user_agent: string;
  timestamp: string;
  user: { email: string; name: string };
}

export default function AuditLogsTab() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { t } = useTranslation();

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch('/api/audit-logs');
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'LOGIN': return 'text-green-400';
      case 'LOGOUT': return 'text-blue-400';
      case 'DELETE': return 'text-red-400';
      case 'UPDATE': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN': return Shield;
      case 'LOGOUT': return Shield;
      default: return Activity;
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading audit logs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Audit Logs</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="glass-input"
        >
          <option value="all">All Actions</option>
          <option value="LOGIN">Login Events</option>
          <option value="DELETE">Delete Actions</option>
          <option value="UPDATE">Update Actions</option>
        </select>
      </div>

      <div className="space-y-4">
        {logs
          .filter(log => filter === 'all' || log.action === filter)
          .map((log, index) => {
            const ActionIcon = getActionIcon(log.action);
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-4 hover:bg-blue-500/5 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full bg-gray-800 ${getActionColor(log.action)}`}>
                    <ActionIcon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`font-semibold ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                      <span className="text-gray-400">on</span>
                      <span className="text-white">{log.resource}</span>
                      {log.resource_id && (
                        <>
                          <span className="text-gray-400">ID:</span>
                          <span className="text-blue-400">{log.resource_id}</span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{log.user?.email || 'System'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      {log.ip_address && (
                        <span>IP: {log.ip_address}</span>
                      )}
                    </div>
                    
                    {log.details && (
                      <div className="mt-2 p-2 bg-gray-800/50 rounded text-sm text-gray-300">
                        {JSON.stringify(JSON.parse(log.details), null, 2)}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}
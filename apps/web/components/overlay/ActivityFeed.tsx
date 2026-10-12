'use client';

import { useAgentStore } from '@/stores/useAgentStore';
import { useUIStore } from '@/stores/useUIStore';
import { Radio, ChevronDown, ChevronUp } from 'lucide-react';

export const ActivityFeed = () => {
  const activityLogs = useAgentStore((s) => s.activityLogs);
  const showLogsPanel = useUIStore((s) => s.showLogsPanel);
  const toggleLogsPanel = useUIStore((s) => s.toggleLogsPanel);

  return (
    <div className="fixed bottom-20 left-3 z-30 pointer-events-none hidden md:flex flex-col">
      <div className="glass-panel rounded-2xl w-80 p-3 shadow-2xl pointer-events-auto">
        <div
          onClick={toggleLogsPanel}
          className="flex items-center justify-between pb-1.5 cursor-pointer border-b border-white/10"
        >
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Activity Feed
            </span>
          </div>
          <button className="text-slate-400 hover:text-white">
            {showLogsPanel ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showLogsPanel && (
          <div className="mt-2 space-y-2 max-h-36 overflow-y-auto pr-1">
            {activityLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="text-[11px] leading-tight flex items-start gap-2">
                <span className="text-slate-500 font-mono text-[10px] mt-0.5">{log.timestamp}</span>
                <span className="text-sm">{log.icon || '📌'}</span>
                <div className="flex-1">
                  <span className="font-semibold text-slate-200">{log.agentName ? `${log.agentName}: ` : ''}</span>
                  <span className="text-slate-400">{log.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

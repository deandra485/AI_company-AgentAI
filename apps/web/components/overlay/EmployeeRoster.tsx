'use client';

import { useAgentStore } from '@/stores/useAgentStore';
import { useUIStore } from '@/stores/useUIStore';
import { Users, ChevronLeft, ChevronRight, Activity } from 'lucide-react';

export const EmployeeRoster = () => {
  const agents = useAgentStore((s) => s.agents);
  const selectedAgentId = useAgentStore((s) => s.selectedAgentId);
  const selectAgent = useAgentStore((s) => s.selectAgent);

  const showRosterPanel = useUIStore((s) => s.showRosterPanel);
  const toggleRosterPanel = useUIStore((s) => s.toggleRosterPanel);

  return (
    <div className="fixed top-20 left-3 z-30 pointer-events-none flex items-start gap-2">
      {/* Drawer Toggle */}
      <button
        onClick={toggleRosterPanel}
        className="glass-panel p-2 rounded-xl text-slate-300 hover:text-white pointer-events-auto transition-all cursor-pointer shadow-lg"
        title={showRosterPanel ? 'Collapse Employee Roster' : 'Expand Employee Roster'}
      >
        {showRosterPanel ? <ChevronLeft className="w-4 h-4" /> : <Users className="w-4 h-4 text-indigo-400" />}
      </button>

      {/* Roster Card */}
      {showRosterPanel && (
        <div className="glass-panel rounded-2xl w-72 max-h-[calc(100vh-160px)] flex flex-col p-3 shadow-2xl pointer-events-auto overflow-hidden animate-fadeIn">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                AI Employees ({agents.length})
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Active
            </span>
          </div>

          {/* List of Agents */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {agents.map((agent) => {
              const isSelected = selectedAgentId === agent.id;
              return (
                <div
                  key={agent.id}
                  onClick={() => selectAgent(isSelected ? null : agent.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-400/80 shadow-md ring-1 ring-indigo-400/50'
                      : 'bg-slate-800/40 hover:bg-slate-800/80 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: agent.avatarColor }}
                      />
                      <span className="text-xs font-bold text-slate-100">{agent.name}</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-300">
                      {agent.role}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1 mb-1.5">
                    {agent.currentActivity}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-700/60 h-1 rounded-full overflow-hidden mb-1.5">
                    <div
                      className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${agent.progress || 0}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-cyan-400" />
                      <span>{agent.status}</span>
                    </div>
                    <span className="text-cyan-300 font-semibold">{agent.progress || 0}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

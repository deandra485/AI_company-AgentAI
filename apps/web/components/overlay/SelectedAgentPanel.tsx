'use client';

import { useAgentStore } from '@/stores/useAgentStore';
import { useUIStore } from '@/stores/useUIStore';
import { useJobdeskStore } from '@/stores/useJobdeskStore';
import { X, MapPin, Zap, CheckCircle2, Briefcase, PlusCircle } from 'lucide-react';

export const SelectedAgentPanel = () => {
  const selectedAgentId = useAgentStore((s) => s.selectedAgentId);
  const selectAgent = useAgentStore((s) => s.selectAgent);
  const agents = useAgentStore((s) => s.agents);
  const setActiveLocationView = useUIStore((s) => s.setActiveLocationView);
  const openJobdeskModal = useJobdeskStore((s) => s.openModal);
  const jobdesks = useJobdeskStore((s) => s.jobdesks);

  if (!selectedAgentId) return null;

  const agent = agents.find((a) => a.id === selectedAgentId);
  if (!agent) return null;

  // Active user-assigned jobdesk for this agent
  const activeJob = jobdesks.find(
    (j) => j.agentId === agent.id && j.status === 'IN_PROGRESS'
  );

  return (
    <div className="fixed top-20 right-3 z-30 pointer-events-auto w-84 max-w-[calc(100vw-24px)] animate-fadeIn">
      <div className="glass-panel rounded-2xl p-4 shadow-2xl border border-white/15">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-md"
              style={{ backgroundColor: agent.avatarColor }}
            >
              {agent.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">{agent.name}</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] font-semibold text-cyan-300 uppercase">
                  {agent.role}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-[11px] text-slate-400">{agent.department}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => selectAgent(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status & Energy */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
              Status
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-200">{agent.status}</span>
            </div>
          </div>

          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Energy</span>
              <span className="text-[11px] font-bold text-emerald-400">{agent.energy}%</span>
            </div>
            <div className="w-full bg-slate-700/60 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${agent.energy}%` }}
              />
            </div>
          </div>
        </div>

        {/* Current Activity */}
        <div className="mb-3">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
            Aktivitas Saat Ini
          </span>
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-white/5 text-xs text-slate-200 flex items-start gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{agent.currentActivity}</span>
          </div>
        </div>

        {/* Active Jobdesk Progress / Assigned Task */}
        {activeJob ? (
          <div className="mb-3 bg-cyan-950/40 p-3 rounded-xl border border-cyan-500/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-cyan-300 uppercase font-bold flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-cyan-400" />
                Jobdesk Aktif
              </span>
              <span className="text-[11px] font-extrabold text-cyan-300">
                {activeJob.progress}%
              </span>
            </div>
            <p className="text-xs font-semibold text-white truncate">{activeJob.title}</p>
            <p className="text-[10px] text-cyan-200/80 mt-0.5 truncate">
              {activeJob.currentSubStep}
            </p>
            {/* Animated Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2 border border-cyan-500/20">
              <div
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${activeJob.progress}%` }}
              />
            </div>
          </div>
        ) : (
          agent.currentTaskTitle && (
            <div className="mb-3 bg-slate-800/60 p-2.5 rounded-xl border border-white/5 text-xs text-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Tugas Rutin</span>
                <span className="text-[10px] text-slate-400">{agent.progress || 0}%</span>
              </div>
              <p className="font-semibold truncate">{agent.currentTaskTitle}</p>
            </div>
          )
        )}

        {/* Quick Action: Assign Jobdesk directly to this agent */}
        <div className="space-y-2">
          <button
            onClick={() => openJobdeskModal(agent.id)}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tugaskan Jobdesk Baru</span>
          </button>

          {/* Quick Action: Panggil ke Meja Kerja */}
          {!activeJob && (
            <button
              onClick={() => {
                useJobdeskStore.getState().assignJobdesk({
                  agentId: agent.id,
                  title: `Fokus Bekerja di Meja (${agent.name.split(' ')[0]})`,
                  priority: 'MEDIUM',
                  durationSec: 30,
                  description: 'Kembali dan fokus bekerja di meja kerja pribadi',
                });
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-amber-500/20 cursor-pointer"
              title="Panggil karyawan ini agar segera kembali ke meja kerjanya"
            >
              <span>💻 Panggil ke Meja Kerja</span>
            </button>
          )}

          {/* Location Action */}
          <button
            onClick={() => setActiveLocationView(agent.locationId)}
            className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-white/5 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Fokus Lokasi ({agent.locationId})</span>
          </button>
        </div>
      </div>
    </div>
  );
};

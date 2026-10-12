'use client';

import { useState, useEffect } from 'react';
import { useJobdeskStore } from '@/stores/useJobdeskStore';
import { useAgentStore } from '@/stores/useAgentStore';
import { useUIStore } from '@/stores/useUIStore';
import { X, Briefcase, Zap, Sparkles, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const PRESETS = [
  {
    title: 'Build OAuth2 Authentication & Session API',
    description: 'Implement JWT token verification, refresh token rotation, and redis session caching.',
    role: 'developer',
    agentId: 'agent_bima',
    priority: 'HIGH' as const,
  },
  {
    title: 'Desain 3D Landing Page & Design Tokens',
    description: 'Create modern glassmorphism design system, responsive HUD layouts, and dark mode accents.',
    role: 'designer',
    agentId: 'agent_maya',
    priority: 'MEDIUM' as const,
  },
  {
    title: 'Audit Keamanan Sistem & Rate Limiting',
    description: 'Scan API endpoints against OWASP Top 10, implement IP rate limiters, and secure headers.',
    role: 'developer',
    agentId: 'agent_bima',
    priority: 'CRITICAL' as const,
  },
  {
    title: 'Fine-tuning Prompt Pipeline & RAG Embeddings',
    description: 'Optimize vector database retrieval latency and benchmark LLM response quality.',
    role: 'researcher',
    agentId: 'agent_sarah',
    priority: 'HIGH' as const,
  },
  {
    title: 'Kampanye Peluncuran Produk & Growth Funnel',
    description: 'Design multi-channel onboarding campaign, referral tracking, and analytics dashboards.',
    role: 'marketing',
    agentId: 'agent_ryan',
    priority: 'MEDIUM' as const,
  },
  {
    title: 'Sprint Backlog Review & Resource Planning',
    description: 'Align deliverables for the upcoming release and resolve technical blockers across teams.',
    role: 'manager',
    agentId: 'agent_arya',
    priority: 'HIGH' as const,
  },
];

export const AssignJobdeskModal = () => {
  const isModalOpen = useJobdeskStore((s) => s.isModalOpen);
  const closeModal = useJobdeskStore((s) => s.closeModal);
  const selectedAgentIdForModal = useJobdeskStore((s) => s.selectedAgentIdForModal);
  const assignJobdesk = useJobdeskStore((s) => s.assignJobdesk);

  const agents = useAgentStore((s) => s.agents);
  const selectAgent = useAgentStore((s) => s.selectAgent);
  const addActivityLog = useAgentStore((s) => s.addActivityLog);
  const setFollowAgentId = useUIStore((s) => s.setFollowAgentId);

  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent_bima');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [durationSec, setDurationSec] = useState<number>(30);

  // Sync preselected agent when opened from agent panel
  useEffect(() => {
    if (selectedAgentIdForModal) {
      setSelectedAgentId(selectedAgentIdForModal);
    }
  }, [selectedAgentIdForModal]);

  if (!isModalOpen) return null;

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setSelectedAgentId(preset.agentId);
    setPriority(preset.priority);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const targetAgent = agents.find((a) => a.id === selectedAgentId);

    assignJobdesk({
      agentId: selectedAgentId,
      title: title.trim(),
      description: description.trim() || 'Melaksanakan instruksi jobdesk prioritas.',
      priority,
      durationSec,
    });

    addActivityLog({
      agentId: selectedAgentId,
      agentName: targetAgent ? targetAgent.name : 'AI Agent',
      message: `Menerima jobdesk baru: "${title.trim()}"`,
      icon: '📋',
      type: 'task',
      timestamp: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    });

    // Select the agent so the user can immediately observe them
    selectAgent(selectedAgentId);
    setFollowAgentId(selectedAgentId);

    // Reset form
    setTitle('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn select-none pointer-events-auto">
      <div className="relative w-full max-w-xl bg-slate-900/95 border border-white/15 rounded-3xl p-6 shadow-2xl text-white overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Tugaskan Jobdesk AI
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-medium border border-cyan-500/30">
                  Realtime Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Beri perintah pekerjaan langsung. Agent akan segera mengeksekusi tugas di meja kerjanya.
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Pilih AI Agent */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Pilih Karyawan AI
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {agents.map((ag) => {
                const isSelected = ag.id === selectedAgentId;
                return (
                  <button
                    key={ag.id}
                    type="button"
                    onClick={() => setSelectedAgentId(ag.id)}
                    className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg'
                        : 'bg-slate-800/60 border-white/5 hover:border-white/20 hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white mb-1 shadow-sm"
                      style={{ backgroundColor: ag.avatarColor }}
                    >
                      {ag.name.charAt(0)}
                    </div>
                    <span className="text-[11px] font-semibold text-white truncate w-full">
                      {ag.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-slate-400 capitalize truncate w-full">
                      {ag.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-2 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Template Pekerjaan Cepat:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p, i) => (
                <button
                  key={`preset-${i}`}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-[11px] text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  {p.title.split(' ')[0]} {p.title.split(' ')[1]}...
                </button>
              ))}
            </div>
          </div>

          {/* 2. Judul Pekerjaan */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Judul Jobdesk / Task
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Implementasi Otentikasi OAuth2 dan Redis Caching..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          {/* 3. Rincian / Instruksi */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Instruksi / Rincian Pekerjaan
            </label>
            <textarea
              rows={2}
              placeholder="Jelaskan spesifikasi teknis, dependensi, atau hasil yang diharapkan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
            />
          </div>

          {/* 4. Prioritas & Durasi Sprint */}
          <div className="grid grid-cols-2 gap-3">
            {/* Prioritas */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Prioritas
              </label>
              <div className="grid grid-cols-4 gap-1">
                {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((pr) => (
                  <button
                    key={pr}
                    type="button"
                    onClick={() => setPriority(pr)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      priority === pr
                        ? pr === 'CRITICAL'
                          ? 'bg-rose-500/30 text-rose-300 border-rose-400 ring-1 ring-rose-400'
                          : pr === 'HIGH'
                          ? 'bg-amber-500/30 text-amber-300 border-amber-400 ring-1 ring-amber-400'
                          : pr === 'MEDIUM'
                          ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400 ring-1 ring-cyan-400'
                          : 'bg-slate-700 text-slate-200 border-slate-500'
                        : 'bg-slate-800/60 text-slate-400 border-white/5 hover:border-white/20'
                    }`}
                  >
                    {pr}
                  </button>
                ))}
              </div>
            </div>

            {/* Durasi Pengerjaan */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Durasi Sprint
              </label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { sec: 15, label: '15d (Cepat)' },
                  { sec: 40, label: '40d (Standar)' },
                  { sec: 90, label: '90d (Lengkap)' },
                ].map(({ sec, label }) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setDurationSec(sec)}
                    className={`py-1.5 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                      durationSec === sec
                        ? 'bg-indigo-600 text-white border-indigo-400 ring-1 ring-indigo-400'
                        : 'bg-slate-800/60 text-slate-400 border-white/5 hover:border-white/20'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Mulai Kerjakan Sekarang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

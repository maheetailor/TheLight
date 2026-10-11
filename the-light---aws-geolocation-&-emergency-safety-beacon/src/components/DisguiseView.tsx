import React, { useState } from 'react';
import {
  CheckSquare,
  FileText,
  Calendar,
  Search,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  Radio,
} from 'lucide-react';

interface DisguiseViewProps {
  onExitDisguise: () => void;
  onSilentSosTrigger: () => void;
  silentAlertSent: boolean;
}

export const DisguiseView: React.FC<DisguiseViewProps> = ({
  onExitDisguise,
  onSilentSosTrigger,
  silentAlertSent,
}) => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Review quarterly project architecture notes', done: true },
    { id: 2, text: 'Consolidate CloudFront distribution telemetry metrics', done: false },
    { id: 3, text: 'Prepare documentation for sprint retrospective', done: false },
    { id: 4, text: 'Update system dependencies & client tests', done: true },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1e1e2e] text-slate-200 flex flex-col font-sans select-none">
      {/* Top Disguise Header Bar */}
      <header className="h-12 bg-[#181825] border-b border-[#313244] px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Workspace Docs &bull; Sprint 42 Notes</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Last saved 2m ago</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Secret SOS Trigger disguised as Cloud Sync button */}
          <button
            onClick={onSilentSosTrigger}
            className={`text-xs px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
              silentAlertSent
                ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#313244]'
            }`}
            title="Sync Workspace"
          >
            <Radio className={`w-3.5 h-3.5 ${silentAlertSent ? 'animate-pulse text-emerald-400' : 'text-slate-500'}`} />
            <span>{silentAlertSent ? 'Sync Dispatched' : 'Cloud Sync'}</span>
          </button>

          {/* Discreet Exit Disguise */}
          <button
            onClick={onExitDisguise}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-[#313244] hover:bg-[#45475a] transition-colors flex items-center gap-1"
            title="Return to The Light [D]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Exit Disguise</span>
          </button>
        </div>
      </header>

      {/* Main Content Area disguised as work notes */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 space-y-6 overflow-y-auto">
        <div className="border-b border-[#313244] pb-4">
          <h1 className="text-2xl font-bold text-white mb-2">Q4 Engineering Sprint Priorities</h1>
          <p className="text-sm text-slate-400">
            Internal meeting summary &bull; Project status & roadmap milestones
          </p>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Action Items</h2>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="flex items-center gap-3 p-3 rounded-lg bg-[#181825] border border-[#313244] hover:border-[#45475a] cursor-pointer transition-colors"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                    task.done ? 'bg-indigo-600 border-indigo-500' : 'border-slate-600'
                  }`}
                >
                  {task.done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className={`text-sm ${task.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {task.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Meeting Notes */}
        <div className="space-y-3 pt-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Architecture Notes</h2>
          <div className="p-4 rounded-lg bg-[#181825] border border-[#313244] text-xs font-mono text-slate-300 space-y-2 leading-relaxed">
            <p>// AWS Location Service tracker telemetry ingestion</p>
            <p>- CloudFront Viewer Geo header parsing enabled on origin requests</p>
            <p>- Lambda handler evaluates geofence boundaries for safe haven notifications</p>
            <p>- Latency optimization: &lt;75ms response globally</p>
          </div>
        </div>
      </main>

      {/* Bottom Hint */}
      <footer className="h-8 bg-[#181825] border-t border-[#313244] px-4 flex items-center justify-between text-[11px] text-slate-500">
        <span>Covert Mode Active &bull; Press D or Esc to return</span>
        <span className="font-mono">Status: Connected</span>
      </footer>
    </div>
  );
};

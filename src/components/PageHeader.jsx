import React from 'react';
import { Tag, ChevronDown, Settings, Keyboard } from 'lucide-react';

export default function PageHeader({
  title,
  rightActions,
  showManageOffer = true,
  showReports = true
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
      <div className="flex items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {rightActions}

        {showManageOffer && (
          <button
            type="button"
            onClick={() => alert('Manage Offers: No active promotional campaigns currently.')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#4F3DE0] bg-[#eeecfc] hover:bg-[#e3dffc] border border-[#d3ccfb] rounded-lg transition-colors cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Manage Offer</span>
          </button>
        )}

        {showReports && (
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <span className="text-[#4F3DE0]">📋</span>
              <span>Reports</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        )}

        <button
          type="button"
          title="Settings"
          onClick={() => alert('Settings: Company profile, GSTIN & print invoice configurations.')}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          type="button"
          title="Keyboard Shortcuts"
          onClick={() => alert('Keyboard Shortcuts:\n• Press "/" to search\n• Press "Alt+N" to create item\n• Press "Esc" to close modals')}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
        >
          <Keyboard className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

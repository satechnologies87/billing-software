import React from 'react';
import { Info, ExternalLink } from 'lucide-react';

export default function SummaryCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-indigo-600',
  infoText,
  onClick
}) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:shadow-sm transition-all duration-150 flex flex-col justify-between min-h-[105px]">
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
          <span className="text-slate-600">{title}</span>
          {infoText && (
            <span title={infoText} className="cursor-help text-slate-400 hover:text-slate-600">
              <Info className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
        {onClick && (
          <button
            type="button"
            onClick={onClick}
            title="View details"
            className="text-slate-400 hover:text-[#4F3DE0] p-0.5 rounded transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
        {value}
      </div>
    </div>
  );
}

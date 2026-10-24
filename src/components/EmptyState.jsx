import React from 'react';
import { PackagePlus, FileSpreadsheet } from 'lucide-react';

export default function EmptyState({ onCreateClick, onExcelClick }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center flex flex-col items-center justify-center my-6 max-w-2xl mx-auto shadow-2xs">
      {/* Decorative Inventory Stack Illustration */}
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-indigo-50/80 rounded-2xl flex items-center justify-center shadow-inner text-amber-500">
          <div className="text-4xl">📦</div>
        </div>
        <div className="absolute -top-2 -right-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
          Bulk Add
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-2">
        Add all your Items at once!
      </h3>
      <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
        For quicker and easier experience of creating sales invoices and tracking your stock effortlessly.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onCreateClick}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#4F3DE0] hover:bg-[#4332ca] text-white rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-[0.98]"
        >
          <PackagePlus className="w-4 h-4" />
          <span>Create Item</span>
        </button>

        <button
          type="button"
          onClick={onExcelClick}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-sm font-semibold transition-all active:scale-[0.98]"
        >
          <FileSpreadsheet className="w-4 h-4 text-sky-600" />
          <span>Add Items with excel</span>
        </button>
      </div>
    </div>
  );
}

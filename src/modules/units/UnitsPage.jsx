import React, { useState } from 'react';
import { Plus, Trash2, Scale } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { getStoredUnits, saveUnits } from '../../services/itemStorage';
import { useToast } from '../../components/Toast';

export default function UnitsPage() {
  const { showToast } = useToast();
  const [units, setUnits] = useState(getStoredUnits);
  const [unitName, setUnitName] = useState('');
  const [shortName, setShortName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!unitName.trim() || !shortName.trim()) return;

    const newUnit = {
      id: 'u-' + Date.now(),
      name: unitName.trim(),
      shortName: shortName.trim().toUpperCase()
    };
    const updated = [...units, newUnit];
    saveUnits(updated);
    setUnits(updated);
    showToast(`Unit "${newUnit.shortName}" added`);
    setUnitName('');
    setShortName('');
    setModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (units.length <= 1) {
      showToast('At least one unit must remain', 'error');
      return;
    }
    const updated = units.filter((u) => u.id !== id);
    saveUnits(updated);
    setUnits(updated);
    showToast(`Unit "${name}" removed`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Measuring Units"
        showManageOffer={false}
        rightActions={
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#4F3DE0] hover:bg-[#4332ca] text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Unit</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {units.map((unit) => (
          <div
            key={unit.id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-[#4F3DE0] rounded-lg">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">{unit.name}</h4>
                <span className="text-[11px] font-mono font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                  {unit.shortName}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleDelete(unit.id, unit.name)}
              className="p-1.5 text-slate-300 hover:text-rose-600 rounded"
              title="Delete Unit"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Unit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Add Measuring Unit</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Unit Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kilograms, Cartons..."
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4F3DE0]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Short Symbol / Abbreviation
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KG, CTN, BTL..."
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4F3DE0]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#4F3DE0] hover:bg-[#4332ca] rounded-lg"
                >
                  Save Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

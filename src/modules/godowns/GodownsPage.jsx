import React, { useState } from 'react';
import { Plus, Warehouse, MapPin, Package } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { getStoredGodowns, saveGodowns } from '../../services/itemStorage';
import { useToast } from '../../components/Toast';

export default function GodownsPage() {
  const { showToast } = useToast();
  const [godowns, setGodowns] = useState(getStoredGodowns);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newGodown = {
      id: 'g-' + Date.now(),
      name: name.trim(),
      address: address.trim() || 'Central Distribution Area',
      stockCount: 0
    };
    const updated = [...godowns, newGodown];
    saveGodowns(updated);
    setGodowns(updated);
    showToast(`Warehouse "${newGodown.name}" created`);
    setName('');
    setAddress('');
    setModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Godown (Warehouse) Management"
        showManageOffer={false}
        rightActions={
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#4F3DE0] hover:bg-[#4332ca] text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Warehouse</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {godowns.map((g) => (
          <div
            key={g.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Warehouse className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{g.name}</h4>
                  <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{g.address}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-slate-400" />
                <span>Tracked Items in Godown:</span>
              </span>
              <span className="font-bold text-slate-800">{g.stockCount || 45} units</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Warehouse Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Add New Warehouse (Godown)</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Warehouse Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Depot, Shed #4"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4F3DE0]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Address / Location Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter street, area or pin code..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
                  Create Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

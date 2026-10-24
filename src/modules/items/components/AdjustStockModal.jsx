import React, { useState } from 'react';
import { X, ArrowDown, ArrowUp } from 'lucide-react';
import { adjustItemStock } from '../../../services/itemStorage';
import { useToast } from '../../../components/Toast';

export default function AdjustStockModal({
  isOpen,
  onClose,
  item,
  onAdjusted
}) {
  const { showToast } = useToast();
  const [type, setType] = useState('add');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('Manual Stock Adjustment');

  if (!isOpen || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      alert('Please enter a valid positive quantity');
      return;
    }

    if (type === 'reduce' && item.stock < qty) {
      if (!confirm(`Current stock is ${item.stock}. Reducing by ${qty} will result in negative stock. Proceed?`)) {
        return;
      }
    }

    const updated = adjustItemStock(item.id, type, qty, reason);
    showToast(`Stock updated! Current balance: ${updated.stock} ${item.unit || ''}`);
    if (onAdjusted) onAdjusted(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Adjust Stock</h3>
            <p className="text-xs text-slate-500 mt-0.5">{item.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Current Stock Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex justify-between items-center text-xs">
            <span className="text-slate-600 font-medium">Current Available Stock:</span>
            <span className="font-bold text-slate-900 text-sm">
              {item.stock} {item.unit ? item.unit.split('(')[1]?.replace(')', '') || '' : ''}
            </span>
          </div>

          {/* Action Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Adjustment Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('add')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                  type === 'add'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ArrowUp className="w-4 h-4 text-emerald-600" />
                <span>Add Stock (+)</span>
              </button>

              <button
                type="button"
                onClick={() => setType('reduce')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                  type === 'reduce'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-200'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ArrowDown className="w-4 h-4 text-rose-600" />
                <span>Reduce Stock (-)</span>
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quantity to {type === 'add' ? 'Add' : 'Reduce'} <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              required
              placeholder="e.g. 10"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#4F3DE0]"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason / Remark
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 mb-2 focus:outline-none focus:ring-2 focus:ring-[#4F3DE0]"
            >
              <option value="Manual Stock Adjustment">Manual Stock Adjustment</option>
              <option value="Physical Count Correction">Physical Count Correction</option>
              <option value="Damaged / Expired Goods">Damaged / Expired Goods</option>
              <option value="Internal Store Consumption">Internal Store Consumption</option>
              <option value="Returned from Client">Returned from Client</option>
            </select>
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#4F3DE0] hover:bg-[#4332ca] rounded-lg shadow-sm"
            >
              Confirm Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React from 'react';
import { Info } from 'lucide-react';

export default function ItemPricingDetails({
  formData,
  setFormData,
  errors
}) {
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-5">
      {/* Sales Price & Purchase Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Sales Price
          </label>
          <div className="flex rounded-lg shadow-2xs border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#4F3DE0]">
            <span className="inline-flex items-center px-3 bg-slate-50 text-slate-500 text-xs border-r border-slate-300">
              ₹
            </span>
            <input
              type="number"
              placeholder="ex: 200"
              value={formData.salesPrice ?? ''}
              onChange={(e) => handleChange('salesPrice', e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 text-xs text-slate-800 focus:outline-none"
            />
            <select
              value={formData.salesPriceTaxType || 'With Tax'}
              onChange={(e) => handleChange('salesPriceTaxType', e.target.value)}
              className="bg-slate-50 text-xs px-2.5 py-2 text-slate-600 border-l border-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="With Tax">With Tax</option>
              <option value="Without Tax">Without Tax</option>
            </select>
          </div>
          {errors.salesPrice && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.salesPrice}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Purchase Price
          </label>
          <div className="flex rounded-lg shadow-2xs border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#4F3DE0]">
            <span className="inline-flex items-center px-3 bg-slate-50 text-slate-500 text-xs border-r border-slate-300">
              ₹
            </span>
            <input
              type="number"
              placeholder="ex: 150"
              value={formData.purchasePrice ?? ''}
              onChange={(e) => handleChange('purchasePrice', e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 text-xs text-slate-800 focus:outline-none"
            />
            <select
              value={formData.purchasePriceTaxType || 'With Tax'}
              onChange={(e) => handleChange('purchasePriceTaxType', e.target.value)}
              className="bg-slate-50 text-xs px-2.5 py-2 text-slate-600 border-l border-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="With Tax">With Tax</option>
              <option value="Without Tax">Without Tax</option>
            </select>
          </div>
        </div>
      </div>

      {/* GST Tax Rate & Discount */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            GST Tax Rate (%)
          </label>
          <select
            value={formData.taxRate || 'None'}
            onChange={(e) => handleChange('taxRate', e.target.value)}
            className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4F3DE0]"
          >
            <option value="None">None</option>
            <option value="0%">GST @ 0%</option>
            <option value="0.25%">GST @ 0.25%</option>
            <option value="3%">GST @ 3%</option>
            <option value="5%">GST @ 5%</option>
            <option value="12%">GST @ 12%</option>
            <option value="18%">GST @ 18%</option>
            <option value="28%">GST @ 28%</option>
            <option value="Exempted">Exempted</option>
          </select>
        </div>

        <div>
          <div className="flex items-center gap-1 mb-1">
            <label className="text-xs font-medium text-slate-700">
              Discount on Sales Price
            </label>
            <span title="Default discount applied during invoicing" className="cursor-help text-slate-400">
              <Info className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex rounded-lg shadow-2xs border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#4F3DE0]">
            <input
              type="number"
              placeholder="ex: 12"
              value={formData.discount ?? ''}
              onChange={(e) => handleChange('discount', e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 text-xs text-slate-800 focus:outline-none"
            />
            <span className="inline-flex items-center px-3 bg-slate-50 text-slate-500 text-xs border-l border-slate-300 font-bold">
              %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

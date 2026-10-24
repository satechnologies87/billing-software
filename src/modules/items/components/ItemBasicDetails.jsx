import React from 'react';
import { Search } from 'lucide-react';

export default function ItemBasicDetails({
  formData,
  setFormData,
  errors,
  categories,
  units
}) {
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-5">
      {/* Item Type: Product vs Service */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Item Type <span className="text-rose-500">*</span>
        </label>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
            <input
              type="radio"
              name="itemType"
              value="Product"
              checked={formData.type === 'Product'}
              onChange={() => handleChange('type', 'Product')}
              className="w-4 h-4 text-[#4F3DE0] focus:ring-[#4F3DE0] border-slate-300"
            />
            <span>Product</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
            <input
              type="radio"
              name="itemType"
              value="Service"
              checked={formData.type === 'Service'}
              onChange={() => handleChange('type', 'Service')}
              className="w-4 h-4 text-[#4F3DE0] focus:ring-[#4F3DE0] border-slate-300"
            />
            <span>Service</span>
          </label>
        </div>
      </div>

      {/* Row: Category & Show in Online Store */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4F3DE0] focus:border-[#4F3DE0]"
          >
            <option value="">Search Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between sm:justify-end sm:gap-4 pt-4 sm:pt-6">
          <span className="text-xs font-medium text-slate-700">
            Show Item in Online Store
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!!formData.showInOnlineStore}
              onChange={(e) => handleChange('showInOnlineStore', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4F3DE0]"></div>
          </label>
        </div>
      </div>

      {/* Item Name (Required) */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Item Name <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          placeholder="ex: Maggi 20gm"
          value={formData.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`w-full text-xs bg-white border rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 ${
            errors.name
              ? 'border-rose-400 focus:ring-rose-200'
              : 'border-slate-300 focus:ring-indigo-100 focus:border-[#4F3DE0]'
          }`}
        />
        {errors.name && (
          <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.name}</p>
        )}
      </div>

      {/* Row: Sales Price & GST Tax Rate */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Sales Price
          </label>
          <div className="flex rounded-lg shadow-2xs border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-[#4F3DE0]">
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
      </div>

      {/* Row: Measuring Unit & Opening Stock */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Measuring Unit
          </label>
          <select
            value={formData.unit}
            onChange={(e) => handleChange('unit', e.target.value)}
            className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4F3DE0]"
          >
            {units.map((u) => (
              <option key={u.id} value={`${u.name} (${u.shortName})`}>
                {u.name} ({u.shortName})
              </option>
            ))}
          </select>
        </div>

        {formData.type !== 'Service' && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Opening Stock
            </label>
            <div className="flex rounded-lg shadow-2xs border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-[#4F3DE0]">
              <input
                type="number"
                placeholder="ex: 150"
                value={formData.openingStock ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    openingStock: val,
                    stock: val // keep synchronized on new item
                  }));
                }}
                className="flex-1 min-w-0 px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
              <span className="inline-flex items-center px-3 bg-slate-50 text-slate-500 text-xs border-l border-slate-300 font-mono">
                {formData.unit ? formData.unit.split('(')[1]?.replace(')', '') || 'PCS' : 'PCS'}
              </span>
            </div>
            {errors.openingStock && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.openingStock}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

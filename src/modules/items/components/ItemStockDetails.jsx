import React, { useRef } from 'react';
import { Upload, X, Info } from 'lucide-react';

export default function ItemStockDetails({
  formData,
  setFormData,
  errors,
  units
}) {
  const fileInputRef = useRef(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateBarcode = () => {
    const randomBarcode = '890' + Math.floor(1000000000 + Math.random() * 9000000000);
    handleChange('barcode', randomBarcode);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Support up to 5 images max
    const currentImages = formData.images || [];
    const remainingSlots = 5 - currentImages.length;
    const filesToRead = files.slice(0, remainingSlots);

    filesToRead.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== indexToRemove)
    }));
  };

  return (
    <div className="space-y-5">
      {/* Row 1: Item Code & Barcode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Item Code / SKU
          </label>
          <input
            type="text"
            placeholder="ex: ITM12549"
            value={formData.itemCode || ''}
            onChange={(e) => handleChange('itemCode', e.target.value)}
            className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F3DE0]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Barcode
          </label>
          <div className="flex rounded-lg shadow-2xs border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#4F3DE0]">
            <input
              type="text"
              placeholder="Barcode number"
              value={formData.barcode || ''}
              onChange={(e) => handleChange('barcode', e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 text-xs text-slate-800 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleGenerateBarcode}
              className="bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs px-3 py-2 border-l border-slate-300 font-medium transition-colors"
            >
              Generate Barcode
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: HSN/SAC Code & Measuring Unit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-slate-700">HSN/SAC Code</label>
            <button
              type="button"
              onClick={() => {
                const sampleHsn = ['8525', '8471', '1902', '8528'][Math.floor(Math.random() * 4)];
                handleChange('hsnCode', sampleHsn);
              }}
              className="text-[11px] text-[#4F3DE0] hover:underline font-medium"
            >
              Find HSN Code
            </button>
          </div>
          <input
            type="text"
            placeholder="ex: 4010"
            value={formData.hsnCode || ''}
            onChange={(e) => handleChange('hsnCode', e.target.value)}
            className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F3DE0]"
          />
        </div>

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
      </div>

      {/* Alternative Unit Option */}
      <div>
        <button
          type="button"
          onClick={() => {
            const hasAlt = !!formData.hasAltUnit;
            setFormData((prev) => ({
              ...prev,
              hasAltUnit: !hasAlt,
              secondaryUnit: !hasAlt ? 'Kilograms (KG)' : '',
              conversionRate: !hasAlt ? 1 : ''
            }));
          }}
          className="text-xs font-semibold text-[#4F3DE0] hover:underline flex items-center gap-1"
        >
          <span>{formData.hasAltUnit ? '- Remove Alternative Unit' : '+ Alternative Unit'}</span>
        </button>

        {formData.hasAltUnit && (
          <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 mb-1">Secondary Unit</label>
              <select
                value={formData.secondaryUnit || ''}
                onChange={(e) => handleChange('secondaryUnit', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded p-1.5"
              >
                {units.map((u) => (
                  <option key={u.id} value={`${u.name} (${u.shortName})`}>
                    {u.name} ({u.shortName})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Conversion Factor</label>
              <input
                type="number"
                placeholder="1 Base Unit = X Sec Units"
                value={formData.conversionRate || ''}
                onChange={(e) => handleChange('conversionRate', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded p-1.5"
              />
            </div>
          </div>
        )}
      </div>

      {/* Row 3: Opening Stock & As of Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Opening Stock
          </label>
          <div className="flex rounded-lg shadow-2xs border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#4F3DE0]">
            <input
              type="number"
              placeholder="ex: 150"
              value={formData.openingStock ?? ''}
              onChange={(e) => {
                const val = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  openingStock: val,
                  stock: val
                }));
              }}
              className="flex-1 min-w-0 px-3 py-2 text-xs text-slate-800 focus:outline-none"
            />
            <span className="inline-flex items-center px-3 bg-slate-50 text-slate-500 text-xs border-l border-slate-300 font-mono">
              {formData.unit ? formData.unit.split('(')[1]?.replace(')', '') || 'PCS' : 'PCS'}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            As of Date
          </label>
          <input
            type="date"
            value={formData.asOfDate || new Date().toISOString().split('T')[0]}
            onChange={(e) => handleChange('asOfDate', e.target.value)}
            className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4F3DE0]"
          />
        </div>
      </div>

      {/* Low Stock Warning Toggle and Field */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            id="lowStockToggle"
            checked={!!formData.enableLowStockWarning}
            onChange={(e) => handleChange('enableLowStockWarning', e.target.checked)}
            className="rounded border-slate-300 text-[#4F3DE0] focus:ring-[#4F3DE0]"
          />
          <label
            htmlFor="lowStockToggle"
            className="text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Enable Low stock quantity warning</span>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </label>
        </div>

        {formData.enableLowStockWarning && (
          <div className="max-w-xs">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Low Stock Quantity
            </label>
            <input
              type="number"
              placeholder="ex: 10"
              value={formData.lowStockQuantity ?? ''}
              onChange={(e) => handleChange('lowStockQuantity', e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4F3DE0]"
            />
            {errors.lowStockQuantity && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.lowStockQuantity}</p>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Enter item description, specifications or notes..."
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F3DE0]"
        />
      </div>

      {/* Image Upload Box */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Item Images (Up to 5)
        </label>

        <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 shadow-2xs">
              <Upload className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-700">
                Please select or drag and drop 5 files.
              </div>
              <div className="text-[11px] text-slate-400">
                Maximum of 5 images in PNG or JPEG, file size no more than 5 MB
              </div>
            </div>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              multiple
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              disabled={(formData.images || []).length >= 5}
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-sky-50 hover:bg-sky-100 disabled:opacity-50 text-sky-700 border border-sky-200 rounded-lg text-xs font-semibold transition-colors"
            >
              Select File
            </button>
          </div>
        </div>

        {/* Image Previews */}
        {formData.images && formData.images.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {formData.images.map((imgSrc, idx) => (
              <div
                key={idx}
                className="relative w-16 h-16 rounded-lg border border-slate-200 overflow-hidden group shadow-2xs bg-white"
              >
                <img
                  src={imgSrc}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-rose-600 text-white p-0.5 rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

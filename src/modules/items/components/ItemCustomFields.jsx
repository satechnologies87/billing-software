import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function ItemCustomFields({ formData, setFormData }) {
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState('Text');
  const [fieldVal, setFieldVal] = useState('');

  const handleAddField = (e) => {
    e.preventDefault();
    if (!fieldLabel.trim()) {
      alert('Field Label is required');
      return;
    }

    const currentFields = formData.customFields || [];
    const newField = {
      id: 'cf-' + Date.now(),
      label: fieldLabel.trim(),
      type: fieldType,
      value: fieldVal
    };

    setFormData((prev) => ({
      ...prev,
      customFields: [...currentFields, newField]
    }));

    setFieldLabel('');
    setFieldVal('');
  };

  const removeField = (id) => {
    setFormData((prev) => ({
      ...prev,
      customFields: (prev.customFields || []).filter((f) => f.id !== id)
    }));
  };

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-xs font-semibold text-slate-800 mb-1">Custom Attributes</h4>
        <p className="text-xs text-slate-500">
          Add custom business parameters like Warranty, Serial Tag, Color, Brand, or Expiry.
        </p>
      </div>

      {/* Add Field Form */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Field Label</label>
            <input
              type="text"
              placeholder="ex: Brand / Warranty"
              value={fieldLabel}
              onChange={(e) => setFieldLabel(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Field Type</label>
            <select
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
            >
              <option value="Text">Text</option>
              <option value="Number">Number</option>
              <option value="Date">Date</option>
              <option value="Dropdown">Dropdown</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Field Value</label>
            <input
              type={fieldType === 'Date' ? 'date' : fieldType === 'Number' ? 'number' : 'text'}
              placeholder="Value"
              value={fieldVal}
              onChange={(e) => setFieldVal(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddField}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4F3DE0] hover:bg-[#4332ca] text-white text-xs font-semibold rounded-lg shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Custom Field</span>
        </button>
      </div>

      {/* Active Fields List */}
      <div className="space-y-2">
        {!formData.customFields || formData.customFields.length === 0 ? (
          <div className="p-4 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-400">
            No custom fields configured for this item.
          </div>
        ) : (
          formData.customFields.map((field) => (
            <div
              key={field.id}
              className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg text-xs"
            >
              <div>
                <span className="font-semibold text-slate-800">{field.label}:</span>{' '}
                <span className="text-slate-600">{field.value || '(Empty)'}</span>{' '}
                <span className="text-[10px] text-slate-400 px-1.5 py-0.5 bg-slate-100 rounded ml-2">
                  {field.type}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeField(field.id)}
                className="text-slate-400 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

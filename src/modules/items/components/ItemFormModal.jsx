import React, { useState, useEffect } from 'react';
import { X, Layers, Boxes, CircleDollarSign, Users, SlidersHorizontal } from 'lucide-react';
import ItemBasicDetails from './ItemBasicDetails';
import ItemStockDetails from './ItemStockDetails';
import ItemPricingDetails from './ItemPricingDetails';
import PartyWisePrices from './PartyWisePrices';
import ItemCustomFields from './ItemCustomFields';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { saveItem, getStoredCategories, getStoredUnits } from '../../../services/itemStorage';
import { useToast } from '../../../components/Toast';

const INITIAL_FORM = {
  name: '',
  type: 'Product',
  category: '',
  salesPrice: '',
  salesPriceTaxType: 'With Tax',
  purchasePrice: '',
  purchasePriceTaxType: 'With Tax',
  taxRate: 'None',
  unit: 'Pieces (PCS)',
  stock: '',
  openingStock: '',
  asOfDate: new Date().toISOString().split('T')[0],
  enableLowStockWarning: false,
  lowStockQuantity: '',
  itemCode: '',
  barcode: '',
  hsnCode: '',
  description: '',
  showInOnlineStore: false,
  discount: '',
  images: [],
  partyPrices: [],
  customFields: []
};

export default function ItemFormModal({
  isOpen,
  onClose,
  initialData = null,
  onSaved
}) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setCategories(getStoredCategories());
      setUnits(getStoredUnits());
      if (initialData) {
        setFormData({ ...INITIAL_FORM, ...initialData });
      } else {
        setFormData({
          ...INITIAL_FORM,
          asOfDate: new Date().toISOString().split('T')[0]
        });
      }
      setErrors({});
      setActiveTab('basic');
    }
  }, [isOpen, initialData]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleCloseRequest();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, formData]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name || !formData.name.trim()) {
      errs.name = 'Please enter the item name';
    }
    if (formData.salesPrice !== '' && Number(formData.salesPrice) < 0) {
      errs.salesPrice = 'Sales price must be positive';
    }
    if (formData.openingStock !== '' && Number(formData.openingStock) < 0) {
      errs.openingStock = 'Opening stock cannot be negative';
    }
    if (formData.enableLowStockWarning && Number(formData.lowStockQuantity) < 0) {
      errs.lowStockQuantity = 'Low stock threshold cannot be negative';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (andNew = false) => {
    if (!validate()) {
      setActiveTab('basic');
      showToast('Please fix highlighted form errors', 'error');
      return;
    }

    const payload = {
      ...formData,
      salesPrice: formData.salesPrice !== '' ? Number(formData.salesPrice) : 0,
      purchasePrice: formData.purchasePrice !== '' ? Number(formData.purchasePrice) : 0,
      openingStock: formData.openingStock !== '' ? Number(formData.openingStock) : 0,
      stock: formData.stock !== '' ? Number(formData.stock) : Number(formData.openingStock || 0),
      lowStockQuantity: formData.lowStockQuantity !== '' ? Number(formData.lowStockQuantity) : 0
    };

    const saved = saveItem(payload);
    showToast(
      initialData ? `Item "${saved.name}" updated successfully!` : `Item "${saved.name}" created successfully!`
    );

    if (onSaved) onSaved(saved);

    if (andNew) {
      setFormData({
        ...INITIAL_FORM,
        asOfDate: new Date().toISOString().split('T')[0]
      });
      setActiveTab('basic');
    } else {
      onClose();
    }
  };

  const isFormDirty = () => {
    if (!initialData) {
      return !!formData.name.trim() || !!formData.salesPrice || !!formData.openingStock;
    }
    return JSON.stringify(formData) !== JSON.stringify({ ...INITIAL_FORM, ...initialData });
  };

  const handleCloseRequest = () => {
    if (isFormDirty()) {
      setConfirmCancelOpen(true);
    } else {
      onClose();
    }
  };

  const navItems = [
    { id: 'basic', label: 'Basic Details', icon: Layers, required: true },
    { id: 'stock', label: 'Stock Details', icon: Boxes },
    { id: 'pricing', label: 'Pricing Details', icon: CircleDollarSign },
    { id: 'party', label: 'Party Wise Prices', icon: Users },
    { id: 'custom', label: 'Custom Fields', icon: SlidersHorizontal }
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="bg-white rounded-2xl w-full max-w-4xl h-[92vh] max-h-[720px] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
          {/* Top Modal Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {initialData ? 'Edit Item' : 'Create New Item'}
            </h2>
            <button
              type="button"
              onClick={handleCloseRequest}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body: Left Section Nav + Right Form */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
            {/* Left Section Navigation */}
            <div className="w-full md:w-64 bg-slate-50/70 border-b md:border-b-0 md:border-r border-slate-200 p-3 md:p-4 shrink-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto">
              <div className="hidden md:block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
                Advance Details
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all text-left ${
                      isActive
                        ? 'bg-[#eeecfc] text-[#4F3DE0] shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#4F3DE0]' : 'text-slate-400'}`} />
                    <span className="flex-1">{item.label}</span>
                    {item.required && <span className="text-rose-500 font-bold">*</span>}
                  </button>
                );
              })}
            </div>

            {/* Right Form Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0 bg-white">
              {activeTab === 'basic' && (
                <ItemBasicDetails
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  categories={categories}
                  units={units}
                />
              )}

              {activeTab === 'stock' && (
                <ItemStockDetails
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  units={units}
                />
              )}

              {activeTab === 'pricing' && (
                <ItemPricingDetails
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
              )}

              {activeTab === 'party' && (
                <PartyWisePrices
                  formData={formData}
                  setFormData={setFormData}
                />
              )}

              {activeTab === 'custom' && (
                <ItemCustomFields
                  formData={formData}
                  setFormData={setFormData}
                />
              )}
            </div>
          </div>

          {/* Sticky Modal Footer */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={handleCloseRequest}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2.5">
              {!initialData && (
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  className="px-4 py-2 text-xs font-semibold text-[#4F3DE0] bg-[#eeecfc] hover:bg-[#e4e0fb] border border-[#d6cffb] rounded-lg transition-colors"
                >
                  Save & New
                </button>
              )}

              <button
                type="button"
                onClick={() => handleSave(false)}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#4F3DE0] hover:bg-[#4332ca] rounded-lg shadow-sm transition-all"
              >
                {initialData ? 'Update Item' : 'Save Item'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Discard confirmation dialog */}
      <ConfirmDialog
        isOpen={confirmCancelOpen}
        title="Discard unsaved changes?"
        message="You have unsaved changes in this item form. Leaving now will discard your inputs."
        confirmText="Discard"
        cancelText="Keep Editing"
        onConfirm={() => {
          setConfirmCancelOpen(false);
          onClose();
        }}
        onCancel={() => setConfirmCancelOpen(false)}
      />
    </>
  );
}

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Tags, Layers } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  getStoredCategories,
  saveCategories,
  getStoredItems
} from '../../services/itemStorage';
import { useToast } from '../../components/Toast';

export default function CategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState(getStoredCategories);
  const [items] = useState(getStoredItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    let updated;
    if (editingCategory) {
      updated = categories.map((c) =>
        c.id === editingCategory.id ? { ...c, name: categoryName.trim() } : c
      );
      showToast(`Category updated to "${categoryName}"`);
    } else {
      const newCat = {
        id: 'cat-' + Date.now(),
        name: categoryName.trim(),
        count: 0
      };
      updated = [...categories, newCat];
      showToast(`Category "${categoryName}" created`);
    }

    saveCategories(updated);
    setCategories(updated);
    setCategoryName('');
    setEditingCategory(null);
    setModalOpen(false);
  };

  const handleDelete = () => {
    // Check if category is used by items
    const inUse = items.some((i) => i.category === deleteTarget.name);
    if (inUse) {
      showToast(
        `Cannot delete "${deleteTarget.name}". Items are currently assigned to this category.`,
        'error',
        4000
      );
      setDeleteTarget(null);
      return;
    }

    const updated = categories.filter((c) => c.id !== deleteTarget.id);
    saveCategories(updated);
    setCategories(updated);
    showToast(`Category "${deleteTarget.name}" deleted`);
    setDeleteTarget(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Item Categories"
        showManageOffer={false}
        rightActions={
          <button
            onClick={() => {
              setEditingCategory(null);
              setCategoryName('');
              setModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#4F3DE0] hover:bg-[#4332ca] text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        }
      />

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Category Name</th>
              <th className="py-3 px-4">Items Count</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => {
              const count = items.filter((i) => i.category === cat.name).length;
              return (
                <tr key={cat.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                    <Tags className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{cat.name}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{count} items</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setCategoryName(cat.name);
                        setModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-amber-600 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beverages, Stationery..."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title={`Delete Category "${deleteTarget?.name}"?`}
        message="Are you sure you want to delete this category? If any items use it, deletion will be blocked."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

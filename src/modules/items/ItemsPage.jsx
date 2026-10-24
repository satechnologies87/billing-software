import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  Package,
  Search,
  Filter,
  ChevronDown,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  FileSpreadsheet,
  Download,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import SummaryCard from '../../components/SummaryCard';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import ItemFormModal from './components/ItemFormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  getStoredItems,
  deleteItem,
  getStoredCategories
} from '../../services/itemStorage';
import { calculateStockValue, countLowStockItems } from '../../utils/stock';
import { formatINR } from '../../utils/currency';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/Toast';

export default function ItemsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [excelImportOpen, setExcelImportOpen] = useState(false);

  const loadData = () => {
    setItems(getStoredItems());
    setCategories(getStoredCategories());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('billing_items_updated', loadData);
    return () => window.removeEventListener('billing_items_updated', loadData);
  }, []);

  // Filtered items computation
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.itemCode && item.itemCode.toLowerCase().includes(q)) ||
        (item.barcode && item.barcode.toLowerCase().includes(q));

      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;

      const matchesLowStock = !lowStockFilter || (
        item.enableLowStockWarning && Number(item.stock) <= Number(item.lowStockQuantity)
      );

      return matchesSearch && matchesCategory && matchesLowStock;
    });
  }, [items, searchQuery, selectedCategory, lowStockFilter]);

  // Bulk selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItemIds(filteredItems.map((i) => i.id));
    } else {
      setSelectedItemIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSingle = (id) => {
    deleteItem(id);
    showToast('Item deleted successfully', 'info');
    setItemToDelete(null);
    setSelectedItemIds((prev) => prev.filter((i) => i !== id));
    loadData();
  };

  const handleBulkDelete = () => {
    selectedItemIds.forEach((id) => deleteItem(id));
    showToast(`Deleted ${selectedItemIds.length} items`, 'info');
    setSelectedItemIds([]);
    setBulkDeleteOpen(false);
    loadData();
  };

  const exportCSV = () => {
    if (items.length === 0) {
      showToast('No items to export', 'error');
      return;
    }
    const headers = ['Name', 'Item Code', 'Barcode', 'Category', 'Stock', 'Unit', 'Sales Price', 'Purchase Price', 'Tax Rate'];
    const rows = items.map((i) => [
      `"${i.name || ''}"`,
      `"${i.itemCode || ''}"`,
      `"${i.barcode || ''}"`,
      `"${i.category || ''}"`,
      i.stock || 0,
      `"${i.unit || ''}"`,
      i.salesPrice || 0,
      i.purchasePrice || 0,
      `"${i.taxRate || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Items_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Items exported to CSV');
  };

  // Stock summary calculation
  const totalStockValue = useMemo(() => calculateStockValue(items), [items]);
  const totalLowStockCount = useMemo(() => countLowStockItems(items), [items]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Page Header */}
      <PageHeader
        title="Items"
        showManageOffer={true}
        showReports={true}
      />

      {/* Two Stock Summary Cards matching screenshot 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SummaryCard
          title="Stock Value"
          value={formatINR(totalStockValue)}
          icon={TrendingUp}
          iconColor="text-blue-500"
          infoText="Calculated as available stock * purchase price (or sales price)"
          onClick={() => showToast(`Total inventory valuation: ${formatINR(totalStockValue)}`, 'info')}
        />

        <SummaryCard
          title="Low Stock"
          value={totalLowStockCount}
          icon={Package}
          iconColor="text-amber-500"
          infoText="Items at or below configured warning threshold"
          onClick={() => setLowStockFilter((prev) => !prev)}
        />
      </div>

      {/* Search and Action Toolbar matching screenshot 1 */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Left Search and Filters */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Item Name or Serial No."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F3DE0] focus:border-[#4F3DE0]"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4F3DE0] cursor-pointer"
          >
            <option value="">Search Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Low Stock Filter Button */}
          <button
            type="button"
            onClick={() => setLowStockFilter(!lowStockFilter)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              lowStockFilter
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-amber-500" />
            <span>Low Stock</span>
          </button>

          {/* Bulk Actions Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>Bulk Actions</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <div className="absolute left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 hidden group-hover:block z-30">
              <button
                type="button"
                onClick={() => setSelectedItemIds(items.map((i) => i.id))}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
              >
                Select All ({items.length})
              </button>
              <button
                type="button"
                onClick={exportCSV}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export CSV</span>
              </button>
              {selectedItemIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setBulkDeleteOpen(true)}
                  className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Delete Selected ({selectedItemIds.length})</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Primary Action: Create Item Button */}
        <div>
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setIsCreateModalOpen(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4F3DE0] hover:bg-[#4332ca] text-white rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Item</span>
          </button>
        </div>
      </div>

      {/* Main Table or Empty State */}
      {items.length === 0 ? (
        <EmptyState
          onCreateClick={() => {
            setEditingItem(null);
            setIsCreateModalOpen(true);
          }}
          onExcelClick={() => setExcelImportOpen(true)}
        />
      ) : filteredItems.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-xs">
          No items match your active search and filter criteria.
          <div className="mt-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setLowStockFilter(false);
              }}
              className="text-[#4F3DE0] font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        filteredItems.length > 0 &&
                        selectedItemIds.length === filteredItems.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-[#4F3DE0] focus:ring-[#4F3DE0]"
                    />
                  </th>
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">Item Code / SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Stock Qty</th>
                  <th className="py-3 px-4">Measuring Unit</th>
                  <th className="py-3 px-4 text-right">Sales Price</th>
                  <th className="py-3 px-4 text-right">Purchase Price</th>
                  <th className="py-3 px-4">GST Rate</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedItemIds.includes(item.id)}
                        onChange={() => handleToggleSelect(item.id)}
                        className="rounded border-slate-300 text-[#4F3DE0] focus:ring-[#4F3DE0]"
                      />
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <button
                        onClick={() => navigate(`/app/home/items/${item.id}`)}
                        className="hover:text-[#4F3DE0] transition-colors text-left flex items-center gap-2"
                      >
                        <span>{item.name}</span>
                        {item.type === 'Service' && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-normal">
                            Service
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {item.itemCode || '-'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.category || '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800">
                      {item.stock ?? 0}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {item.unit ? item.unit.split('(')[1]?.replace(')', '') || item.unit : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-800">
                      {formatINR(item.salesPrice)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600">
                      {formatINR(item.purchasePrice)}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.taxRate || 'None'}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge item={item} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => navigate(`/app/home/items/${item.id}`)}
                          title="View Details"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem(item);
                            setIsCreateModalOpen(true);
                          }}
                          title="Edit Item"
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemToDelete(item)}
                          title="Delete Item"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>Showing {filteredItems.length} of {items.length} items</span>
            {selectedItemIds.length > 0 && (
              <span className="font-semibold text-indigo-600">
                {selectedItemIds.length} item(s) selected
              </span>
            )}
          </div>
        </div>
      )}

      {/* Create / Edit Item Modal */}
      <ItemFormModal
        isOpen={isCreateModalOpen}
        initialData={editingItem}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingItem(null);
        }}
        onSaved={loadData}
      />

      {/* Single Item Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!itemToDelete}
        title="Delete Item?"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? All associated transaction history and records will be removed.`}
        confirmText="Yes, Delete"
        onConfirm={() => handleDeleteSingle(itemToDelete.id)}
        onCancel={() => setItemToDelete(null)}
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog
        isOpen={bulkDeleteOpen}
        title={`Delete ${selectedItemIds.length} items?`}
        message="This action will permanently remove all selected items from your inventory."
        confirmText="Delete Selected"
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteOpen(false)}
      />

      {/* Excel Import Demo Modal */}
      {excelImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Import Items via Excel</h3>
                <p className="text-xs text-slate-500">Upload your product catalog sheet (.xlsx / .csv)</p>
              </div>
            </div>

            <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50">
              <p className="text-xs text-slate-600 mb-2">Drag and drop your spreadsheet here or</p>
              <input
                type="file"
                accept=".csv, .xlsx"
                className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setExcelImportOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Sample items spreadsheet uploaded and imported successfully');
                  setExcelImportOpen(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#4F3DE0] hover:bg-[#4332ca] rounded-lg"
              >
                Start Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

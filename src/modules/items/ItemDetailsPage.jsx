import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Plus,
  Sliders,
  Edit,
  Trash2,
  Keyboard,
  Info,
  Calendar,
  Layers,
  CircleDollarSign,
  Boxes,
  FileText
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import ItemFormModal from './components/ItemFormModal';
import AdjustStockModal from './components/AdjustStockModal';
import {
  getStoredItems,
  getItemById,
  deleteItem
} from '../../services/itemStorage';
import { formatINR } from '../../utils/currency';
import { useToast } from '../../components/Toast';

export default function ItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchSidebar, setSearchSidebar] = useState('');
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'stock' | 'party_report' | 'party_prices'

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAdjustStockOpen, setIsAdjustStockOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const refreshData = () => {
    const all = getStoredItems();
    setItems(all);
    const found = getItemById(id);
    setSelectedItem(found || null);
  };

  useEffect(() => {
    refreshData();
  }, [id]);

  const handleDelete = () => {
    deleteItem(id);
    showToast('Item deleted successfully', 'info');
    setIsDeleteConfirmOpen(false);
    navigate('/app/home/items');
  };

  if (!selectedItem) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Item Not Found</h2>
        <p className="text-xs text-slate-500">
          The item with ID "{id}" could not be located in your local storage.
        </p>
        <button
          onClick={() => navigate('/app/home/items')}
          className="px-4 py-2 bg-[#4F3DE0] text-white text-xs font-semibold rounded-lg hover:bg-[#4332ca]"
        >
          Return to Items List
        </button>
      </div>
    );
  }

  const filteredSidebarItems = items.filter(
    (item) =>
      !searchSidebar ||
      item.name.toLowerCase().includes(searchSidebar.toLowerCase())
  );

  const unitShort = selectedItem.unit
    ? selectedItem.unit.split('(')[1]?.replace(')', '') || selectedItem.unit
    : 'PCS';

  // Demo stock value
  const stockVal =
    Number(selectedItem.stock || 0) *
    Number(selectedItem.purchasePrice || selectedItem.salesPrice || 0);

  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-50">
      {/* Left Item-List Panel (matching Screenshot 5) */}
      <aside className="w-64 sm:w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        {/* Search Input in Left Panel */}
        <div className="p-3 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Custom Field"
              value={searchSidebar}
              onChange={(e) => setSearchSidebar(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#4F3DE0]"
            />
          </div>
        </div>

        {/* + Create Item Dashed Action Button */}
        <div className="p-3 border-b border-slate-100">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full py-2 px-3 border border-dashed border-[#4F3DE0] text-[#4F3DE0] hover:bg-indigo-50/50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Create Item</span>
          </button>
        </div>

        {/* Scrollable list of items */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredSidebarItems.map((item) => {
            const isSelected = item.id === selectedItem.id;
            return (
              <div
                key={item.id}
                onClick={() => navigate(`/app/home/items/${item.id}`)}
                className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between text-xs ${
                  isSelected
                    ? 'bg-[#eeecfc] text-[#4F3DE0] font-bold shadow-2xs border border-[#d8d2fb]'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="truncate min-w-0 pr-2">
                  <div className="truncate">{item.name}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[11px] font-mono ${isSelected ? 'text-[#4F3DE0]' : 'text-slate-400'}`}>
                    {item.stock} {item.unit ? item.unit.split('(')[1]?.replace(')', '') || '' : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Details Area on Right */}
      <div className="flex-1 overflow-y-auto flex flex-col p-4 sm:p-6 lg:p-8 space-y-5 min-w-0">
        {/* Top Header Row: Back button, Name, Status, Action buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate('/app/home/items')}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              title="Back to items list"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
              {selectedItem.name}
            </h1>
            <StatusBadge item={selectedItem} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAdjustStockOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Adjust Stock</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors"
            >
              <Edit className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
              title="Delete Item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              title="Keyboard Shortcuts"
              onClick={() => alert('Item Shortcuts: Press "E" to edit, "A" to adjust stock.')}
              className="p-2 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg transition-colors"
            >
              <Keyboard className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Matching Screenshot 5) */}
        <div className="flex border-b border-slate-200 space-x-6 text-xs font-semibold">
          {[
            { id: 'details', label: 'Item Details' },
            { id: 'stock', label: 'Stock Details' },
            { id: 'party_report', label: 'Party Wise Report' },
            { id: 'party_prices', label: 'Party Wise Prices' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 transition-colors relative ${
                activeTab === tab.id
                  ? 'text-[#4F3DE0] font-bold border-b-2 border-[#4F3DE0]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Item Details */}
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Details Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>General Details</span>
              </div>

              <div className="grid grid-cols-2 gap-y-4 text-xs">
                <div>
                  <div className="text-slate-400 mb-0.5">Item Name</div>
                  <div className="font-semibold text-slate-800">{selectedItem.name}</div>
                </div>

                <div>
                  <div className="text-slate-400 mb-0.5">Item Code</div>
                  <div className="font-semibold text-slate-800">{selectedItem.itemCode || '-'}</div>
                </div>

                <div>
                  <div className="text-slate-400 mb-0.5">Category</div>
                  <div className="font-semibold text-slate-800">{selectedItem.category || '-'}</div>
                </div>

                <div>
                  <div className="text-slate-400 mb-0.5">Current Stock</div>
                  <div className="font-semibold text-slate-800">{selectedItem.stock} {unitShort}</div>
                </div>

                <div>
                  <div className="text-slate-400 mb-0.5 flex items-center gap-1">
                    <span>Stock Value</span>
                    <Info className="w-3 h-3" />
                  </div>
                  <div className="font-semibold text-slate-800">{formatINR(stockVal)}</div>
                </div>

                <div>
                  <div className="text-slate-400 mb-0.5">Low Stock Warning</div>
                  <div className={`font-semibold ${selectedItem.enableLowStockWarning ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {selectedItem.enableLowStockWarning ? 'Enabled' : 'Disabled'}
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 mb-0.5">Low Stock Quantity</div>
                  <div className="font-semibold text-slate-800">
                    {selectedItem.enableLowStockWarning ? `${selectedItem.lowStockQuantity} ${unitShort}` : '-'}
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 mb-0.5">Measuring Unit</div>
                  <div className="font-semibold text-slate-800">{selectedItem.unit || '-'}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs">
                <div className="text-slate-400 mb-0.5">Item Description</div>
                <div className="text-slate-600 leading-relaxed">
                  {selectedItem.description || '-'}
                </div>
              </div>
            </div>

            {/* Pricing Details Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">
                <CircleDollarSign className="w-4 h-4 text-emerald-500" />
                <span>Pricing Details</span>
              </div>

              <div className="grid grid-cols-2 gap-y-4 text-xs">
                <div>
                  <div className="text-slate-400 mb-0.5">Sales Price</div>
                  <div className="font-semibold text-slate-800">
                    {formatINR(selectedItem.salesPrice)}{' '}
                    <span className="text-[10px] text-slate-400 font-normal">
                      {selectedItem.salesPriceTaxType}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 mb-0.5">Purchase Price</div>
                  <div className="font-semibold text-slate-800">
                    {formatINR(selectedItem.purchasePrice)}{' '}
                    <span className="text-[10px] text-slate-400 font-normal">
                      {selectedItem.purchasePriceTaxType}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 mb-0.5">GST Tax Rate</div>
                  <div className="font-semibold text-slate-800">{selectedItem.taxRate || 'None'}</div>
                </div>

                <div>
                  <div className="text-slate-400 mb-0.5">HSN Code</div>
                  <div className="font-semibold text-slate-800">{selectedItem.hsnCode || '-'}</div>
                </div>

                <div>
                  <div className="text-slate-400 mb-0.5">Secondary Unit</div>
                  <div className="font-semibold text-slate-800">{selectedItem.secondaryUnit || '-'}</div>
                </div>

                <div>
                  <div className="text-slate-400 mb-0.5">Barcode / Serial</div>
                  <div className="font-mono text-slate-700">{selectedItem.barcode || '-'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Stock Details & Adjustment Movement History */}
        {activeTab === 'stock' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Stock Movement Ledger</h3>
                <p className="text-xs text-slate-500">Chronological history of additions and reductions</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAdjustStockOpen(true)}
                className="px-3 py-1.5 bg-[#4F3DE0] text-white text-xs font-semibold rounded-lg hover:bg-[#4332ca]"
              >
                + Adjust Stock
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Transaction / Event</th>
                    <th className="py-3 px-4">Adjustment Qty</th>
                    <th className="py-3 px-4">Resulting Balance</th>
                    <th className="py-3 px-4">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(!selectedItem.stockHistory || selectedItem.stockHistory.length === 0) ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No previous stock movements recorded.
                      </td>
                    </tr>
                  ) : (
                    selectedItem.stockHistory.map((hist, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-3 px-4 text-slate-600">{hist.date}</td>
                        <td className="py-3 px-4 font-medium text-slate-900">{hist.type}</td>
                        <td className={`py-3 px-4 font-bold ${hist.qty >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {hist.qty >= 0 ? `+${hist.qty}` : hist.qty}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">{hist.balance}</td>
                        <td className="py-3 px-4 text-slate-500">{hist.reason || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Party Wise Report */}
        {activeTab === 'party_report' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Party Wise Transactions</h3>
              <p className="text-xs text-slate-500">Invoices, sales orders and returns for this product</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Party Name</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Ref No.</th>
                    <th className="py-3 px-4 text-right">Quantity</th>
                    <th className="py-3 px-4 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { date: '23 Oct 2026', party: 'Ramesh Electronics', type: 'Sales Invoice', ref: 'INV-00102', qty: 1, amount: selectedItem.salesPrice || 42000 },
                    { date: '20 Oct 2026', party: 'Global Tech Wholesale', type: 'Purchase Bill', ref: 'PUR-00084', qty: 5, amount: (selectedItem.purchasePrice || 36000) * 5 }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-600">{row.date}</td>
                      <td className="py-3 px-4 font-medium text-slate-900">{row.party}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                          {row.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-indigo-600">{row.ref}</td>
                      <td className="py-3 px-4 text-right font-semibold">{row.qty} {unitShort}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-800">{formatINR(row.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Party Wise Prices */}
        {activeTab === 'party_prices' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Custom Party Pricing Rules</h3>
              <p className="text-xs text-slate-500">Agreed specific price lists for preferred customers</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Price Rule</th>
                    <th className="py-3 px-4 text-right">Agreed Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(!selectedItem.partyPrices || selectedItem.partyPrices.length === 0) ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-400">
                        No customized party pricing configured for this item.
                      </td>
                    </tr>
                  ) : (
                    selectedItem.partyPrices.map((p, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-semibold text-slate-900">{p.party}</td>
                        <td className="py-3 px-4 text-slate-500">{p.priceType}</td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-600">{formatINR(p.price)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <ItemFormModal
        isOpen={isEditModalOpen}
        initialData={selectedItem}
        onClose={() => setIsEditModalOpen(false)}
        onSaved={refreshData}
      />

      {/* Create Modal */}
      <ItemFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSaved={(newItem) => {
          refreshData();
          navigate(`/app/home/items/${newItem.id}`);
        }}
      />

      {/* Adjust Stock Modal */}
      <AdjustStockModal
        isOpen={isAdjustStockOpen}
        item={selectedItem}
        onClose={() => setIsAdjustStockOpen(false)}
        onAdjusted={refreshData}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title={`Delete "${selectedItem.name}"?`}
        message="Are you sure you want to delete this item? This action will remove the item permanently."
        confirmText="Yes, Delete"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />
    </div>
  );
}

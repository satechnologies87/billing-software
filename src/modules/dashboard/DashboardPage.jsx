import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingCart,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Building2,
  Plus,
  Users,
  Box,
  FileText,
  Clock,
  AlertTriangle
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import SummaryCard from '../../components/SummaryCard';
import { formatINR } from '../../utils/currency';
import { useNavigate } from 'react-router-dom';
import { getStoredItems } from '../../services/itemStorage';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('This Month');
  const [items] = useState(getStoredItems);

  const lowStockList = items.filter(
    (i) => i.enableLowStockWarning && Number(i.stock) <= Number(i.lowStockQuantity)
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Financial & inventory performance overview
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Custom Range</option>
          </select>

          <button
            onClick={() => alert('New invoice draft opened.')}
            className="flex items-center gap-2 px-4 py-2 bg-[#4F3DE0] hover:bg-[#4332ca] text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Sales Invoice</span>
          </button>
        </div>
      </div>

      {/* 6 Key Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <SummaryCard
          title="Total Sales"
          value="₹1,24,500"
          icon={TrendingUp}
          iconColor="text-emerald-600"
          infoText="Total gross sales within selected period"
        />
        <SummaryCard
          title="Total Purchases"
          value="₹78,200"
          icon={ShoppingCart}
          iconColor="text-blue-600"
          infoText="Total inventory purchases"
        />
        <SummaryCard
          title="Receivables"
          value="₹32,500"
          icon={ArrowDownLeft}
          iconColor="text-teal-600"
          infoText="Payments to be received from customers"
        />
        <SummaryCard
          title="Payables"
          value="₹18,750"
          icon={ArrowUpRight}
          iconColor="text-rose-600"
          infoText="Outstanding supplier payments"
        />
        <SummaryCard
          title="Cash in Hand"
          value="₹12,400"
          icon={Wallet}
          iconColor="text-amber-600"
          infoText="Physical cash balance"
        />
        <SummaryCard
          title="Bank Balance"
          value="₹84,000"
          icon={Building2}
          iconColor="text-indigo-600"
          infoText="Aggregate active bank accounts"
        />
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
        <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3">
          Quick Actions
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => alert('Opening sales invoice creator...')}
            className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 hover:text-[#4F3DE0] text-xs font-medium transition-all"
          >
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>Create Invoice</span>
          </button>
          <button
            onClick={() => navigate('/app/home/items')}
            className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 hover:text-[#4F3DE0] text-xs font-medium transition-all"
          >
            <Box className="w-4 h-4 text-blue-500" />
            <span>Add Item</span>
          </button>
          <button
            onClick={() => alert('Add Customer modal opened')}
            className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 hover:text-[#4F3DE0] text-xs font-medium transition-all"
          >
            <Users className="w-4 h-4 text-emerald-500" />
            <span>Add Customer</span>
          </button>
          <button
            onClick={() => alert('Add Purchase Bill modal opened')}
            className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 hover:text-[#4F3DE0] text-xs font-medium transition-all"
          >
            <ShoppingCart className="w-4 h-4 text-amber-500" />
            <span>Add Purchase</span>
          </button>
        </div>
      </div>

      {/* Middle Row: Sales Overview & Low Stock Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart (Clean SVG Chart) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sales Overview</h3>
              <p className="text-xs text-slate-400">Past 7 days performance</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
              +14.2% vs last week
            </span>
          </div>

          {/* SVG Line / Bar Chart */}
          <div className="relative h-48 w-full mt-2 flex items-end justify-between gap-3 px-2 pt-6">
            {[
              { day: 'Mon', val: 12000, h: '45%' },
              { day: 'Tue', val: 18500, h: '65%' },
              { day: 'Wed', val: 14000, h: '50%' },
              { day: 'Thu', val: 26000, h: '85%' },
              { day: 'Fri', val: 22000, h: '75%' },
              { day: 'Sat', val: 32000, h: '98%' },
              { day: 'Sun', val: 8000, h: '30%' }
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[11px] font-semibold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatINR(col.val)}
                </div>
                <div
                  style={{ height: col.h }}
                  className="w-full max-w-[42px] bg-indigo-100 group-hover:bg-[#4F3DE0] rounded-t-md transition-all duration-200"
                />
                <span className="text-[11px] font-medium text-slate-400">{col.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Items Widget */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Low Stock Alert</h3>
              </div>
              <button
                onClick={() => navigate('/app/home/items')}
                className="text-xs text-[#4F3DE0] font-semibold hover:underline"
              >
                View All
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">Items nearing zero inventory</p>

            <div className="space-y-2.5">
              {lowStockList.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  All items have healthy stock levels.
                </div>
              ) : (
                lowStockList.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/app/home/items/${item.id}`)}
                    className="p-2.5 rounded-lg border border-amber-100 bg-amber-50/40 hover:bg-amber-50 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-400">SKU: {item.itemCode || 'N/A'}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-700">
                        {item.stock} left
                      </span>
                      <div className="text-[10px] text-slate-400">Min: {item.lowStockQuantity}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 text-[11px] text-slate-400 text-center">
            Automatic low-stock reminders active
          </div>
        </div>
      </div>

      {/* Recent Activity: Sales Invoices Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900">Recent Sales Invoices</h3>
          </div>
          <span className="text-xs text-slate-400">Sample Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { date: '23 Oct 2026', id: 'INV-00104', party: 'Shree Krishna Store', status: 'Paid', amount: 14200 },
                { date: '22 Oct 2026', id: 'INV-00103', party: 'Metro Supermarket', status: 'Pending', amount: 28500 },
                { date: '22 Oct 2026', id: 'INV-00102', party: 'Ramesh Electronics', status: 'Paid', amount: 42000 },
                { date: '21 Oct 2026', id: 'INV-00101', party: 'City Retailers', status: 'Paid', amount: 8900 }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-600">{row.date}</td>
                  <td className="py-3 px-4 font-mono font-medium text-indigo-600">{row.id}</td>
                  <td className="py-3 px-4 font-medium text-slate-900">{row.party}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        row.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-800">
                    {formatINR(row.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

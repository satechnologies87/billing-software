import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Box,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  ShoppingCart,
  Receipt,
  FileBarChart,
  Settings,
  ShieldCheck,
  Plus,
  Warehouse,
  Tags,
  Scale,
  X
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [itemsOpen, setItemsOpen] = React.useState(true);
  const [partiesOpen, setPartiesOpen] = React.useState(false);
  const [salesOpen, setSalesOpen] = React.useState(false);
  const [purchasesOpen, setPurchasesOpen] = React.useState(false);

  // Auto expand items if on any item route
  React.useEffect(() => {
    if (location.pathname.startsWith('/app/home/item') || 
        location.pathname.startsWith('/app/home/godown') || 
        location.pathname.startsWith('/app/home/categor') || 
        location.pathname.startsWith('/app/home/unit')) {
      setItemsOpen(true);
    }
  }, [location.pathname]);

  const navItemClass = (isActive) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
      isActive
        ? 'bg-[#303F79] text-white font-semibold shadow-sm'
        : 'text-slate-300 hover:bg-[#16203a] hover:text-white'
    }`;

  const subNavItemClass = (isActive) =>
    `flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
      isActive
        ? 'bg-[#303F79] text-white font-semibold'
        : 'text-slate-400 hover:text-white hover:bg-[#1b2645]'
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 lg:w-76 bg-[#0D1629] text-slate-200 flex flex-col border-r border-[#1e2a4a] transition-transform duration-200 ease-in-out shrink-0 select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header / Business Profile */}
        <div className="p-4 border-b border-[#1b2542] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-900 font-bold flex items-center justify-center text-base shrink-0 shadow-inner">
              B
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-white text-sm truncate">My Billing App</span>
              </div>
              <div className="text-xs text-slate-400 truncate">bsdfhgjhklk</div>
              <div className="text-[11px] text-slate-500 font-mono">9961292492</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1b2645]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Action Button: + Create Sales Invoice */}
        <div className="p-3">
          <button
            onClick={() => {
              navigate('/app/home');
              if (onClose) onClose();
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-[#4F3DE0] hover:bg-[#4332ca] text-white rounded-lg font-medium text-sm shadow-md shadow-indigo-950/40 transition-all active:scale-[0.99] group"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Create Sales Invoice</span>
            </span>
            <ChevronDown className="w-4 h-4 text-indigo-200 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Navigation list - Scrollable */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 text-xs">
          {/* GENERAL Section */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              General
            </div>
            <nav className="space-y-1">
              <NavLink
                to="/app/home"
                end
                onClick={onClose}
                className={({ isActive }) => navItemClass(isActive)}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Dashboard</span>
              </NavLink>

              {/* Parties with collapsible submenu */}
              <div>
                <button
                  type="button"
                  onClick={() => setPartiesOpen(!partiesOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-[#16203a] hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Parties</span>
                  </span>
                  {partiesOpen ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                {partiesOpen && (
                  <div className="pl-9 pr-1 pt-1 pb-1 space-y-1">
                    <button
                      onClick={() => navigate('/app/home')}
                      className={subNavItemClass(false)}
                    >
                      Customers
                    </button>
                    <button
                      onClick={() => navigate('/app/home')}
                      className={subNavItemClass(false)}
                    >
                      Suppliers
                    </button>
                  </div>
                )}
              </div>

              {/* Items Section - Active module */}
              <div>
                <button
                  type="button"
                  onClick={() => setItemsOpen(!itemsOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/app/home/item') ||
                    location.pathname.startsWith('/app/home/godown') ||
                    location.pathname.startsWith('/app/home/categor') ||
                    location.pathname.startsWith('/app/home/unit')
                      ? 'text-white'
                      : 'text-slate-300 hover:bg-[#16203a] hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Box className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="font-semibold">Items</span>
                  </span>
                  {itemsOpen ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {itemsOpen && (
                  <div className="pl-6 pr-1 pt-1 pb-1 space-y-1">
                    <NavLink
                      to="/app/home/items"
                      onClick={onClose}
                      className={({ isActive }) => subNavItemClass(isActive)}
                    >
                      <Box className="w-3.5 h-3.5 shrink-0" />
                      <span>Inventory</span>
                    </NavLink>
                    <NavLink
                      to="/app/home/godowns"
                      onClick={onClose}
                      className={({ isActive }) => subNavItemClass(isActive)}
                    >
                      <Warehouse className="w-3.5 h-3.5 shrink-0" />
                      <span>Godown (Warehouse)</span>
                    </NavLink>
                    <NavLink
                      to="/app/home/categories"
                      onClick={onClose}
                      className={({ isActive }) => subNavItemClass(isActive)}
                    >
                      <Tags className="w-3.5 h-3.5 shrink-0" />
                      <span>Item Categories</span>
                    </NavLink>
                    <NavLink
                      to="/app/home/units"
                      onClick={onClose}
                      className={({ isActive }) => subNavItemClass(isActive)}
                    >
                      <Scale className="w-3.5 h-3.5 shrink-0" />
                      <span>Units</span>
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Sales Menu */}
              <div>
                <button
                  type="button"
                  onClick={() => setSalesOpen(!salesOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-[#16203a] hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Sales</span>
                  </span>
                  {salesOpen ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                {salesOpen && (
                  <div className="pl-9 pr-1 pt-1 pb-1 space-y-1">
                    <button onClick={() => navigate('/app/home')} className={subNavItemClass(false)}>
                      Sales Invoices
                    </button>
                    <button onClick={() => navigate('/app/home')} className={subNavItemClass(false)}>
                      Estimates / Quotations
                    </button>
                    <button onClick={() => navigate('/app/home')} className={subNavItemClass(false)}>
                      Payment In
                    </button>
                  </div>
                )}
              </div>

              {/* Purchases Menu */}
              <div>
                <button
                  type="button"
                  onClick={() => setPurchasesOpen(!purchasesOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-[#16203a] hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <ShoppingCart className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Purchases</span>
                  </span>
                  {purchasesOpen ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                {purchasesOpen && (
                  <div className="pl-9 pr-1 pt-1 pb-1 space-y-1">
                    <button onClick={() => navigate('/app/home')} className={subNavItemClass(false)}>
                      Purchase Bills
                    </button>
                    <button onClick={() => navigate('/app/home')} className={subNavItemClass(false)}>
                      Payment Out
                    </button>
                  </div>
                )}
              </div>

              {/* Expenses */}
              <button
                onClick={() => navigate('/app/home')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-[#16203a] hover:text-white transition-colors"
              >
                <Receipt className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Expenses</span>
              </button>

              {/* Reports */}
              <button
                onClick={() => navigate('/app/home')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-[#16203a] hover:text-white transition-colors"
              >
                <FileBarChart className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Reports</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Scroll helper button as seen in MyBillBook */}
        <div className="px-4 py-1.5 flex justify-center">
          <button
            onClick={() => {
              const el = document.querySelector('aside div.overflow-y-auto');
              if (el) el.scrollTop += 120;
            }}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1.5 bg-[#1b2645] hover:bg-[#233157] px-3 py-1 rounded-full transition-colors"
          >
            <span>Scroll for more options</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Bottom Bar: Settings & Security Status */}
        <div className="p-3 border-t border-[#1b2542] space-y-2">
          <button
            onClick={() => navigate('/app/home')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-[#16203a] hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Settings</span>
          </button>

          <div className="flex items-center justify-between px-3 pt-2 text-[11px] text-slate-500 border-t border-[#16203a]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <span>ISO Certified</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

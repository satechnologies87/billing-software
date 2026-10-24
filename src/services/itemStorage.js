// Measuring Units default data
export const DEFAULT_UNITS = [
  { id: 'u1', name: 'Pieces', shortName: 'PCS' },
  { id: 'u2', name: 'Kilograms', shortName: 'KG' },
  { id: 'u3', name: 'Grams', shortName: 'G' },
  { id: 'u4', name: 'Liters', shortName: 'LTR' },
  { id: 'u5', name: 'Milliliters', shortName: 'ML' },
  { id: 'u6', name: 'Boxes', shortName: 'BOX' },
  { id: 'u7', name: 'Packets', shortName: 'PACK' },
  { id: 'u8', name: 'Meters', shortName: 'MTR' }
];

// Categories default data
export const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Electronics', count: 3 },
  { id: 'cat-2', name: 'Camera', count: 1 },
  { id: 'cat-3', name: 'Groceries', count: 2 },
  { id: 'cat-4', name: 'Hardware', count: 1 }
];

// Godowns default data
export const DEFAULT_GODOWNS = [
  { id: 'g1', name: 'Main Godown', address: 'Plot 14, Industrial Area Phase 1', stockCount: 145 },
  { id: 'g2', name: 'City Store Warehouse', address: 'Shop 22, Central Market, City Center', stockCount: 68 }
];

// Sample Initial Items
export const INITIAL_ITEMS = [
  {
    id: 'item-1',
    name: 'Canon EOS 1500D Camera',
    type: 'Product',
    itemCode: 'CAM-CAN-1500',
    barcode: '8901234567890',
    category: 'Camera',
    salesPrice: 42000,
    salesPriceTaxType: 'With Tax',
    purchasePrice: 36000,
    purchasePriceTaxType: 'With Tax',
    taxRate: '18%',
    unit: 'Pieces (PCS)',
    stock: 5,
    openingStock: 5,
    asOfDate: '2026-10-23',
    enableLowStockWarning: true,
    lowStockQuantity: 2,
    hsnCode: '8525',
    description: 'High performance DSLR Camera with 18-55mm lens kit.',
    showInOnlineStore: true,
    partyPrices: [
      { id: 'pp-1', party: 'Ramesh Electronics', price: 41000, priceType: 'Fixed' }
    ],
    customFields: [
      { id: 'cf-1', label: 'Warranty', type: 'Text', value: '2 Years Manufacturer' }
    ],
    stockHistory: [
      { date: '2026-10-20', type: 'Opening Stock', qty: 5, balance: 5, reason: 'Initial Inventory Entry' }
    ]
  },
  {
    id: 'item-2',
    name: 'Logitech Wireless Mouse M235',
    type: 'Product',
    itemCode: 'LOG-M235',
    barcode: '8909876543210',
    category: 'Electronics',
    salesPrice: 750,
    salesPriceTaxType: 'With Tax',
    purchasePrice: 520,
    purchasePriceTaxType: 'Without Tax',
    taxRate: '18%',
    unit: 'Pieces (PCS)',
    stock: 24,
    openingStock: 24,
    asOfDate: '2026-10-21',
    enableLowStockWarning: true,
    lowStockQuantity: 5,
    hsnCode: '8471',
    description: 'Compact wireless optical mouse with USB nano receiver.',
    showInOnlineStore: true,
    partyPrices: [],
    customFields: [],
    stockHistory: [
      { date: '2026-10-21', type: 'Opening Stock', qty: 24, balance: 24, reason: 'Initial Inventory' }
    ]
  },
  {
    id: 'item-3',
    name: 'Maggi 2-Minute Noodles 70g',
    type: 'Product',
    itemCode: 'MAG-70G',
    barcode: '8901058852331',
    category: 'Groceries',
    salesPrice: 14,
    salesPriceTaxType: 'With Tax',
    purchasePrice: 11.5,
    purchasePriceTaxType: 'With Tax',
    taxRate: '12%',
    unit: 'Packets (PACK)',
    stock: 1,
    openingStock: 50,
    asOfDate: '2026-10-18',
    enableLowStockWarning: true,
    lowStockQuantity: 10,
    hsnCode: '1902',
    description: 'Instant noodles with tastemaker spice mix.',
    showInOnlineStore: false,
    partyPrices: [],
    customFields: [],
    stockHistory: [
      { date: '2026-10-18', type: 'Opening Stock', qty: 50, balance: 50, reason: 'Batch arrival' },
      { date: '2026-10-22', type: 'Sales Reduction', qty: -49, balance: 1, reason: 'Invoice #INV-004' }
    ]
  },
  {
    id: 'item-4',
    name: 'Samsung 24-inch Curved Monitor',
    type: 'Product',
    itemCode: 'SAM-CRV-24',
    barcode: '8903344556677',
    category: 'Electronics',
    salesPrice: 9400,
    salesPriceTaxType: 'With Tax',
    purchasePrice: 7800,
    purchasePriceTaxType: 'With Tax',
    taxRate: '18%',
    unit: 'Pieces (PCS)',
    stock: 0,
    openingStock: 0,
    asOfDate: '2026-10-22',
    enableLowStockWarning: true,
    lowStockQuantity: 3,
    hsnCode: '8528',
    description: '1080p FHD 75Hz AMD FreeSync Curved Desktop Monitor.',
    showInOnlineStore: true,
    partyPrices: [],
    customFields: [],
    stockHistory: []
  }
];

const ITEMS_KEY = 'my_billing_app_items';
const CATEGORIES_KEY = 'my_billing_app_categories';
const UNITS_KEY = 'my_billing_app_units';
const GODOWNS_KEY = 'my_billing_app_godowns';

export function getStoredItems() {
  try {
    const raw = localStorage.getItem(ITEMS_KEY);
    if (!raw) {
      localStorage.setItem(ITEMS_KEY, JSON.stringify(INITIAL_ITEMS));
      return INITIAL_ITEMS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load items from storage:', e);
    return INITIAL_ITEMS;
  }
}

export function saveItems(items) {
  try {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('billing_items_updated'));
  } catch (e) {
    console.error('Failed to save items to storage:', e);
  }
}

export function getItemById(id) {
  const items = getStoredItems();
  return items.find(item => String(item.id) === String(id));
}

export function saveItem(item) {
  const items = getStoredItems();
  const index = items.findIndex(i => String(i.id) === String(item.id));
  let updated;
  if (index >= 0) {
    updated = [...items];
    updated[index] = { ...updated[index], ...item };
  } else {
    const newItem = {
      ...item,
      id: item.id || 'item-' + Date.now(),
      stockHistory: item.stockHistory || [
        {
          date: new Date().toISOString().split('T')[0],
          type: 'Opening Stock',
          qty: Number(item.openingStock || 0),
          balance: Number(item.openingStock || 0),
          reason: 'Initial creation'
        }
      ]
    };
    updated = [newItem, ...items];
  }
  saveItems(updated);
  return index >= 0 ? updated[index] : updated[0];
}

export function deleteItem(id) {
  const items = getStoredItems();
  const filtered = items.filter(i => String(i.id) !== String(id));
  saveItems(filtered);
}

export function adjustItemStock(itemId, adjustmentType, quantity, reason) {
  const items = getStoredItems();
  const index = items.findIndex(i => String(i.id) === String(itemId));
  if (index === -1) return null;

  const currentItem = items[index];
  const qty = Number(quantity);
  const newStock = adjustmentType === 'add' ? (currentItem.stock + qty) : (currentItem.stock - qty);
  
  const historyEntry = {
    date: new Date().toISOString().split('T')[0],
    type: adjustmentType === 'add' ? 'Stock Added' : 'Stock Reduced',
    qty: adjustmentType === 'add' ? qty : -qty,
    balance: Math.max(0, newStock),
    reason: reason || 'Manual adjustment'
  };

  const updatedItem = {
    ...currentItem,
    stock: Math.max(0, newStock),
    stockHistory: [historyEntry, ...(currentItem.stockHistory || [])]
  };

  items[index] = updatedItem;
  saveItems(items);
  return updatedItem;
}

// Category helpers
export function getStoredCategories() {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

// Units helpers
export function getStoredUnits() {
  try {
    const raw = localStorage.getItem(UNITS_KEY);
    if (!raw) {
      localStorage.setItem(UNITS_KEY, JSON.stringify(DEFAULT_UNITS));
      return DEFAULT_UNITS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_UNITS;
  }
}

export function saveUnits(units) {
  localStorage.setItem(UNITS_KEY, JSON.stringify(units));
}

// Godowns helpers
export function getStoredGodowns() {
  try {
    const raw = localStorage.getItem(GODOWNS_KEY);
    if (!raw) {
      localStorage.setItem(GODOWNS_KEY, JSON.stringify(DEFAULT_GODOWNS));
      return DEFAULT_GODOWNS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_GODOWNS;
  }
}

export function saveGodowns(godowns) {
  localStorage.setItem(GODOWNS_KEY, JSON.stringify(godowns));
}

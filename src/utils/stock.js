// Stock calculations and status detection
export function getStockStatus(item) {
  const stock = Number(item.stock ?? 0);
  if (stock <= 0) {
    return { label: 'Out of Stock', color: 'red', bg: 'bg-red-50 text-red-700 border-red-200' };
  }
  if (item.enableLowStockWarning && stock <= Number(item.lowStockQuantity ?? 0)) {
    return { label: 'Low Stock', color: 'amber', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
  }
  return { label: 'In Stock', color: 'green', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
}

export function calculateStockValue(items) {
  if (!items || !items.length) return 0;
  // Calculate based on purchase price (or sales price if purchase price is 0) * available stock
  return items.reduce((acc, item) => {
    const qty = Number(item.stock || 0);
    const price = Number(item.purchasePrice || item.salesPrice || 0);
    return acc + (qty * price);
  }, 0);
}

export function countLowStockItems(items) {
  if (!items || !items.length) return 0;
  return items.filter(item => {
    const stock = Number(item.stock ?? 0);
    return item.enableLowStockWarning && stock <= Number(item.lowStockQuantity ?? 0);
  }).length;
}

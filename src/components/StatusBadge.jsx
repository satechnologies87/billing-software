import React from 'react';
import { getStockStatus } from '../utils/stock';

export default function StatusBadge({ item, customStatus }) {
  const status = customStatus || getStockStatus(item);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.bg}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status.color === 'green'
            ? 'bg-emerald-500'
            : status.color === 'amber'
            ? 'bg-amber-500'
            : 'bg-red-500'
        }`}
      />
      {status.label}
    </span>
  );
}

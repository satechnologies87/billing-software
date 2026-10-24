import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { formatINR } from '../../../utils/currency';

export default function PartyWisePrices({ formData, setFormData }) {
  const [selectedParty, setSelectedParty] = useState('Ramesh Electronics');
  const [partyPrice, setPartyPrice] = useState('');
  const [priceType, setPriceType] = useState('Fixed Price');

  const dummyParties = [
    'Ramesh Electronics',
    'Metro Supermarket',
    'Shree Krishna Store',
    'City Retailers',
    'Apex Technologies'
  ];

  const handleAddPartyPrice = (e) => {
    e.preventDefault();
    if (!partyPrice || isNaN(partyPrice)) {
      alert('Please enter a valid price amount');
      return;
    }

    const currentPrices = formData.partyPrices || [];
    const newEntry = {
      id: 'pp-' + Date.now(),
      party: selectedParty,
      price: Number(partyPrice),
      priceType: priceType
    };

    setFormData((prev) => ({
      ...prev,
      partyPrices: [...currentPrices, newEntry]
    }));

    setPartyPrice('');
  };

  const removePartyPrice = (id) => {
    setFormData((prev) => ({
      ...prev,
      partyPrices: (prev.partyPrices || []).filter((p) => p.id !== id)
    }));
  };

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-xs font-semibold text-slate-800 mb-1">
          Party Wise Customized Pricing
        </h4>
        <p className="text-xs text-slate-500">
          Configure preferential or negotiated selling rates for specific clients or dealers.
        </p>
      </div>

      {/* Add new party rule form */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Customer / Party</label>
            <select
              value={selectedParty}
              onChange={(e) => setSelectedParty(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
            >
              {dummyParties.map((p, idx) => (
                <option key={idx} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Custom Price</label>
            <input
              type="number"
              placeholder="ex: 190"
              value={partyPrice}
              onChange={(e) => setPartyPrice(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Price Type</label>
            <select
              value={priceType}
              onChange={(e) => setPriceType(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
            >
              <option value="Fixed Price">Fixed Price</option>
              <option value="Discount %">Special Rate</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddPartyPrice}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4F3DE0] hover:bg-[#4332ca] text-white text-xs font-semibold rounded-lg shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Party Price</span>
        </button>
      </div>

      {/* Party Prices Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3">Party / Customer</th>
              <th className="p-3">Price Type</th>
              <th className="p-3">Custom Rate</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!formData.partyPrices || formData.partyPrices.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-400">
                  No party-specific prices added yet. Standard sales price will apply.
                </td>
              </tr>
            ) : (
              formData.partyPrices.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-800">{row.party}</td>
                  <td className="p-3 text-slate-500">{row.priceType}</td>
                  <td className="p-3 font-semibold text-emerald-600">
                    {formatINR(row.price)}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => removePartyPrice(row.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Save, RefreshCw, AlertCircle } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { Karat } from "../../types";

export const SettingsModule: React.FC = () => {
  const { config, updateGoldPrice, updateConfig } = useStore();
  const [localPrices, setLocalPrices] = useState(config.prices);
  const [shopName, setShopName] = useState("Aurum Gold Shop");
  const [currency, setCurrency] = useState(config.currency);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      for (const [karat, price] of Object.entries(localPrices)) {
        await updateGoldPrice(karat as Karat, price);
      }
      await updateConfig({ currency });
      setSaveMessage("Prices updated successfully!");
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const fetchMarketData = async () => {
    // Simulated market fetch - in production, connect to real gold API
    const basePrice24K = 77.5 + (Math.random() * 4 - 2);
    setLocalPrices({
      "14K": parseFloat((basePrice24K * 0.585).toFixed(2)),
      "18K": parseFloat((basePrice24K * 0.75).toFixed(2)),
      "22K": parseFloat((basePrice24K * 0.916).toFixed(2)),
      "24K": parseFloat(basePrice24K.toFixed(2)),
    });
    setSaveMessage("Market data fetched (simulated)");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Store Configuration</h2>
        <p className="text-white/50">Manage gold market rates and shop settings.</p>
      </div>

      <div className="glass-card p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Gold Pricing Engine</h3>
          <button
            onClick={fetchMarketData}
            className="text-gold text-xs flex items-center gap-2 hover:underline"
          >
            <RefreshCw size={14} />
            Fetch Market Data
          </button>
        </div>

        <div className="bg-gold/5 border border-gold/20 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-gold flex-shrink-0" size={20} />
          <p className="text-xs text-gold/80 leading-relaxed">
            Updating the price per gram will automatically recalculate the selling price
            for all matching inventory items in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(Object.entries(localPrices) as [Karat, number][]).map(([karat, price]) => (
            <div key={karat} className="space-y-2">
              <label className="text-sm font-medium text-white/50">
                {karat} Gold Price (per gram)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="input-field w-full pl-8"
                  value={price}
                  onChange={(e) =>
                    setLocalPrices({
                      ...localPrices,
                      [karat]: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {saveMessage && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm text-green-500">
            {saveMessage}
          </div>
        )}

        <div className="pt-4 border-t border-white/5">
          <button
            disabled={isSaving}
            onClick={handleSave}
            className="gold-button w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {isSaving ? "Saving..." : "Save Prices"}
          </button>
        </div>
      </div>

      <div className="glass-card p-8 space-y-6">
        <h3 className="font-semibold text-lg">Shop Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/50">Shop Name</label>
            <input
              type="text"
              className="input-field w-full"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/50">Base Currency</label>
            <select
              className="input-field w-full"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="AED">AED (د.إ)</option>
              <option value="SAR">SAR (ر.س)</option>
              <option value="EGP">EGP (ج.م)</option>
            </select>
          </div>
        </div>
        <button onClick={handleSave} className="secondary-button">
          Update Profile
        </button>
      </div>
    </div>
  );
};
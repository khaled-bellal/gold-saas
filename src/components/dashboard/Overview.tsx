import React from "react";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { formatCurrency, formatNumber, cn } from "../../lib/utils";
import { aiService } from "../../services/aiService";

interface StatCardProps {
  title: string;
  value: string;
  detail: string;
  icon: React.ElementType;
  trend?: { value: string; positive: boolean };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, detail, icon: Icon, trend }) => (
  <div className="glass-card p-6 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gold">
        <Icon size={20} />
      </div>
      {trend && (
        <span
          className={cn(
            "flex items-center text-xs font-medium px-2 py-1 rounded-full",
            trend.positive
              ? "bg-green-500/10 text-green-500"
              : "bg-red-500/10 text-red-500"
          )}
        >
          {trend.positive ? (
            <ArrowUpRight size={12} className="mr-1" />
          ) : (
            <ArrowDownRight size={12} className="mr-1" />
          )}
          {trend.value}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-sm font-medium text-white/50">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-xs text-white/30">{detail}</span>
      </div>
    </div>
  </div>
);

export const Overview: React.FC = () => {
  const { config, products, sales } = useStore();
  const [aiInsight, setAiInsight] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const generateAIInsight = async () => {
    setIsGenerating(true);
    try {
      const insight = await aiService.getBusinessInsights(sales, products, config);
      setAiInsight(insight);
    } finally {
      setIsGenerating(false);
    }
  };

  const totalSales = sales.reduce((acc, sale) => acc + sale.finalPrice, 0);
  const totalStock = products.reduce((acc, p) => acc + p.weight, 0);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Daily Revenue"
          value={formatCurrency(totalSales)}
          detail={`From ${sales.length} sales`}
          icon={DollarSign}
          trend={{ value: "+12.5%", positive: true }}
        />
        <StatCard
          title="Total Stock"
          value={`${formatNumber(totalStock)}g`}
          detail={`${products.length} active items`}
          icon={Package}
        />
        <StatCard
          title="Sales Volume"
          value={sales.length.toString()}
          detail="Today's performance"
          icon={ShoppingCart}
          trend={{ value: "-2.3%", positive: false }}
        />
        <StatCard
          title="Avg. Gold Price"
          value={formatCurrency(config.prices["24K"])}
          detail="Per gram (24K)"
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pricing Table */}
        <div className="lg:col-span-1 glass-card overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-semibold">Gold Market Rates</h3>
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono">
              Live Sync
            </span>
          </div>
          <div className="divide-y divide-white/5">
            {(Object.entries(config.prices) as [string, number][]).map(([karat, price]) => (
              <div
                key={karat}
                className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gold/10 text-gold flex items-center justify-center font-mono text-xs">
                    {karat.replace("K", "")}
                  </div>
                  <span className="font-medium">{karat} Gold</span>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm">{formatCurrency(price)}</p>
                  <p className="text-[10px] text-white/30 uppercase">Per Gram</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-semibold">Recent Transactions</h3>
            <button className="text-xs text-gold hover:underline">View All</button>
          </div>
          <div className="flex-1 overflow-auto">
            {sales.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-10 text-white/30">
                <ShoppingCart size={40} className="mb-4 opacity-20" />
                <p>No sales recorded today.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs uppercase text-white/30 tracking-widest border-b border-white/5">
                    <th className="px-6 py-4 font-normal">Product</th>
                    <th className="px-6 py-4 font-normal">Method</th>
                    <th className="px-6 py-4 font-normal">Amount</th>
                    <th className="px-6 py-4 font-normal text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sales.slice(0, 10).map((sale) => (
                    <tr key={sale.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-medium">{sale.productName}</p>
                        <p className="text-xs text-white/30">ID: {sale.id.slice(0, 8)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] px-2 py-1 bg-white/5 rounded border border-white/10 uppercase tracking-tighter">
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-gold">
                        {formatCurrency(sale.finalPrice)}
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-white/30">
                        {new Date(sale.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="glass-card p-8 border-gold/20 bg-gold/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 text-gold/10 group-hover:text-gold/20 transition-colors">
          <Sparkles size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="text-gold" size={20} />
              AI Business Intelligence
            </h3>
            <p className="text-sm text-white/50 mt-1">
              Get optimized sales strategies and profit analysis based on your shop's
              performance and current gold market rates.
            </p>
          </div>
          <button
            onClick={generateAIInsight}
            disabled={isGenerating}
            className="gold-button whitespace-nowrap flex items-center gap-2 self-start"
          >
            {isGenerating ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Sparkles size={18} />
            )}
            Generate Insight
          </button>
        </div>

        {aiInsight && (
          <div className="mt-8 p-6 bg-surface border border-white/5 rounded-xl animate-fade-in">
            <div className="text-sm max-w-none text-white/80 leading-relaxed whitespace-pre-wrap font-sans">
              {aiInsight}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
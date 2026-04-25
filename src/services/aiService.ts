import { Product, Sale, StoreConfig } from "../types";

/**
 * AI Service - Calls backend API securely
 * API key is stored server-side (Cloudflare secrets), NEVER exposed to frontend
 */
class AIService {
  async getBusinessInsights(
    sales: Sale[],
    products: Product[],
    config: StoreConfig
  ): Promise<string> {
    try {
      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salesCount: sales.length,
          productsCount: products.length,
          prices: config.prices,
          totalRevenue: sales.reduce((acc, s) => acc + s.finalPrice, 0),
          topProducts: products.slice(0, 5).map((p) => ({
            name: p.name,
            karat: p.karat,
            weight: p.weight,
          })),
        }),
      });

      if (!response.ok) {
        // Fallback to local generated insight
        return this.getLocalInsight(sales, products, config);
      }

      const data = await response.json();
      return data.insight || this.getLocalInsight(sales, products, config);
    } catch (error) {
      console.warn("AI backend not available, using local insights:", error);
      return this.getLocalInsight(sales, products, config);
    }
  }

  /**
   * Smart local fallback - works without any API key
   * Provides real business insights based on actual data
   */
  private getLocalInsight(
    sales: Sale[],
    products: Product[],
    config: StoreConfig
  ): string {
    const totalRevenue = sales.reduce((acc, s) => acc + s.finalPrice, 0);
    const avgSale = sales.length > 0 ? totalRevenue / sales.length : 0;
    const totalDiscount = sales.reduce((acc, s) => acc + s.discount, 0);
    const discountRate =
      totalRevenue > 0 ? ((totalDiscount / totalRevenue) * 100).toFixed(1) : "0";

    // Karat distribution
    const karatCounts: Record<string, number> = {};
    products.forEach((p) => {
      karatCounts[p.karat] = (karatCounts[p.karat] || 0) + 1;
    });
    const dominantKarat =
      Object.entries(karatCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    // Payment methods analysis
    const paymentStats: Record<string, number> = {};
    sales.forEach((s) => {
      paymentStats[s.paymentMethod] = (paymentStats[s.paymentMethod] || 0) + 1;
    });

    const topPaymentMethod =
      Object.entries(paymentStats).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "CASH";

    return `🏆 STRATEGIC BUSINESS INTELLIGENCE REPORT

📊 PERFORMANCE OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Total Transactions: ${sales.length}
• Revenue Generated: $${totalRevenue.toFixed(2)}
• Average Sale Value: $${avgSale.toFixed(2)}
• Discount Rate: ${discountRate}%
• Inventory Items: ${products.length}
• Dominant Karat: ${dominantKarat}
• Preferred Payment: ${topPaymentMethod}

💡 INSIGHT 1 — PROFIT LEAKS
Your current discount rate stands at ${discountRate}%. ${
      parseFloat(discountRate) > 10
        ? "⚠️ This is relatively high. Consider tightening discount policies or requiring manager approval for discounts exceeding 5%."
        : "✅ Your discount discipline is healthy. Maintain this approach to preserve margins."
    } Additionally, with 24K gold at $${config.prices["24K"]}/gram, every 1% price adjustment has significant impact on total revenue.

🎯 INSIGHT 2 — SALES OPTIMIZATION
${
      sales.length === 0
        ? "No sales recorded yet. Focus on: (1) Display high-margin items prominently, (2) Train staff on upselling making-cost services, (3) Offer bundle deals combining multiple karat tiers."
        : `With ${topPaymentMethod} being your top payment method, optimize checkout flow for this channel. Average transaction of $${avgSale.toFixed(
            2
          )} suggests opportunity for premium upsells — consider introducing pieces in the $${(
            avgSale * 1.5
          ).toFixed(0)}-$${(avgSale * 2).toFixed(0)} range.`
    }

📦 INSIGHT 3 — INVENTORY RECOMMENDATIONS
Your dominant inventory is ${dominantKarat} (${
      karatCounts[dominantKarat] || 0
    } items). ${
      dominantKarat === "18K" || dominantKarat === "22K"
        ? "This aligns with wedding market demand. Consider expanding 24K investment pieces for high-net-worth clientele."
        : dominantKarat === "24K"
        ? "Premium positioning detected. Balance with mid-tier 18K pieces to capture daily-wear buyers."
        : "Consider diversifying karat mix to serve broader customer segments."
    } Target a 40/30/20/10 split across 18K/22K/24K/14K for optimal market coverage.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💎 Aurum Gold SaaS — Powered by Business Intelligence`;
  }
}

export const aiService = new AIService();
// Cloudflare Pages Function - /api/ai/insights
// Securely handles Gemini API calls (API key stays on server)

interface Env {
    GEMINI_API_KEY?: string;
  }
  
  export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
      const { request, env } = context;
      const body = await request.json<{
        salesCount: number;
        productsCount: number;
        prices: Record<string, number>;
        totalRevenue: number;
        topProducts: Array<{ name: string; karat: string; weight: number }>;
      }>();
  
      // If no API key configured, return 501 so frontend uses local fallback
      if (!env.GEMINI_API_KEY) {
        return new Response(
          JSON.stringify({
            error: "GEMINI_API_KEY not configured",
            useLocal: true,
          }),
          { status: 501, headers: { "Content-Type": "application/json" } }
        );
      }
  
      const prompt = `You are a senior business consultant for a premium Gold Store.
  
  Current Data:
  - Total Sales: ${body.salesCount} transactions
  - Total Revenue: $${body.totalRevenue.toFixed(2)}
  - Inventory: ${body.productsCount} items
  - Market Prices (per gram): ${JSON.stringify(body.prices)}
  - Top Products: ${JSON.stringify(body.topProducts)}
  
  Provide 3 concise strategic insights in a professional tone:
  1. Profit Leaks — identify where margins may be lost
  2. Sales Optimization — recommend specific tactics
  3. Inventory Recommendations — suggest stock adjustments
  
  Format clearly with headers. Keep it under 400 words.`;
  
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            },
          }),
        }
      );
  
      if (!geminiResponse.ok) {
        return new Response(
          JSON.stringify({ error: "Gemini API error", useLocal: true }),
          { status: 502, headers: { "Content-Type": "application/json" } }
        );
      }
  
      const data = await geminiResponse.json<any>();
      const insight =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Unable to generate insights at this time.";
  
      return new Response(JSON.stringify({ insight }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : "Unknown error",
          useLocal: true,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  };
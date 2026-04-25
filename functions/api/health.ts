// Cloudflare Pages Function - /api/health
export const onRequestGet: PagesFunction = async () => {
    return new Response(
      JSON.stringify({
        status: "ok",
        service: "Aurum Gold SaaS",
        timestamp: Date.now(),
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  };
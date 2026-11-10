export function allowedOrigin(request: Request): string | null {
  const origin = request.headers.get('origin');
  if (!origin) return '';
  const allowed = (Deno.env.get('ALLOWED_ORIGINS') || '')
    .split(',').map((item) => item.trim()).filter(Boolean);
  return allowed.includes(origin) ? origin : null;
}

export function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin'
  };
  if (origin) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

export function jsonResponse(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

export function safeText(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

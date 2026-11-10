import { createClient } from 'npm:@supabase/supabase-js@2';
import { allowedOrigin, corsHeaders, jsonResponse } from '../_shared/http.ts';

const url = Deno.env.get('SUPABASE_URL') || '';
const publishableKeys = JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') || '{}');
const secretKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}');
const anon = createClient(url, publishableKeys.default || Deno.env.get('SUPABASE_ANON_KEY') || '', { auth: { persistSession: false } });
const admin = createClient(url, secretKeys.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '', { auth: { persistSession: false } });

Deno.serve(async (request: Request) => {
  const origin = allowedOrigin(request);
  if (request.method === 'OPTIONS') return new Response(null, { status: origin === null ? 403 : 204, headers: corsHeaders(origin) });
  if (origin === null) return jsonResponse({ ok: false, error: 'Origen no autorizado.' }, 403, null);
  if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'Método no permitido.' }, 405, origin);
  try {
    const token = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
    if (!token) return jsonResponse({ ok: false, error: 'Inicia sesión como administrador.' }, 401, origin);
    const { data: userData, error: authError } = await anon.auth.getUser(token);
    if (authError || !userData.user) return jsonResponse({ ok: false, error: 'La sesión administrativa no es válida.' }, 401, origin);
    const allowedEmails = (Deno.env.get('ADMIN_EMAILS') || '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean);
    if (!userData.user.email || !allowedEmails.includes(userData.user.email.toLowerCase())) {
      return jsonResponse({ ok: false, error: 'Esta cuenta no tiene acceso al panel de Gorilla Labs.' }, 403, origin);
    }
    const { data, error } = await admin.from('gorilla_profiles')
      .select('id, submission_id, created_at, profile, notification_status')
      .order('created_at', { ascending: false }).limit(1000);
    if (error) throw error;
    return jsonResponse({ ok: true, profiles: data || [] }, 200, origin);
  } catch (error) {
    console.error('admin-profiles failed:', error instanceof Error ? error.message : 'unknown error');
    return jsonResponse({ ok: false, error: 'No se pudo cargar el registro central.' }, 500, origin);
  }
});

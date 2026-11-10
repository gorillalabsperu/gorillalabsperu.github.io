import { createClient } from 'npm:@supabase/supabase-js@2';
import { allowedOrigin, corsHeaders, jsonResponse, safeText } from '../_shared/http.ts';

const url = Deno.env.get('SUPABASE_URL') || '';
const secretKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}');
const admin = createClient(url, secretKeys.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '', {
  auth: { persistSession: false, autoRefreshToken: false }
});

function validate(profile: Record<string, unknown>, submissionId: string): string | null {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId)) return 'Identificador de envío inválido.';
  if (safeText(profile.name, 120).length < 2) return 'Falta el nombre completo.';
  if (!/^9\d{8}$/.test(String(profile.phone || '').replace(/\D/g, ''))) return 'El teléfono debe tener nueve dígitos y empezar por 9.';
  const age = Number(profile.age);
  const height = Number(profile.height);
  const weight = Number(profile.weight);
  if (!Number.isInteger(age) || age < 18 || age > 90) return 'La edad debe estar entre 18 y 90 años.';
  if (!['Mujer', 'Hombre'].includes(String(profile.sex))) return 'Selecciona mujer u hombre.';
  if (!Number.isInteger(height) || height < 145 || height > 200) return 'La estatura debe estar entre 145 y 200 cm.';
  if (!Number.isInteger(weight) || weight < 40 || weight > 200) return 'El peso está fuera del rango permitido.';
  if (!['Aumentar masa muscular', 'Reducir grasa corporal', 'Mejorar resistencia física', 'Mejorar el rendimiento deportivo', 'Mejorar resistencia', 'Mejorar rendimiento deportivo'].includes(String(profile.goal))) return 'Selecciona un objetivo válido.';
  if (!['No entreno actualmente', 'Ejercicio', 'Gimnasio', 'Otro deporte'].includes(String(profile.activity))) return 'Selecciona una actividad válida.';
  if (!['Bajo', 'Intermedio', 'Alto'].includes(String(profile.activityLevel))) return 'Selecciona un nivel de actividad válido.';
  if (!Number.isInteger(Number(profile.days)) || Number(profile.days) < 0 || Number(profile.days) > 7) return 'Los días de entrenamiento no son válidos.';
  if (!['No aplica', 'Menos de 30 min', '30–45 min', '45–60 min', 'Más de 60 min'].includes(String(profile.duration))) return 'Selecciona una duración válida.';
  if (!['Menos de 1 litro', '1 a 2 litros', 'Más de 2 litros'].includes(String(profile.water))) return 'Completa la frecuencia de agua.';
  if (!['Menos de 5 horas', '5 a 6 horas', '7 a 8 horas', 'Más de 8 horas'].includes(String(profile.sleep))) return 'Completa las horas de sueño.';
  if (!['1 a 2', '3', '4 o más'].includes(String(profile.meals))) return 'Completa las comidas al día.';
  if (!['Sí, casi siempre', 'A veces', 'Casi nunca'].includes(String(profile.protein))) return 'Completa la pregunta de proteína.';
  const frequencyChoices = ['Diario', '3–5 veces por semana', '1–2 veces por semana', 'Rara vez o nunca'];
  for (const key of ['fruitFrequency', 'vegetableFrequency', 'fishFrequency', 'animalProteinFrequency', 'legumeFrequency', 'processedFoodsFrequency']) {
    if (!frequencyChoices.includes(String(profile[key]))) return 'Completa todas las preguntas de alimentación.';
  }
  for (const [key, allowed] of [
    ['historyTags', ['Ninguno', 'Presión alta', 'Diabetes', 'Asma', 'Tiroides', 'Condición cardiovascular', 'Pancreatitis', 'Problemas digestivos', 'Problemas renales', 'Problemas hepáticos', 'Otro']],
    ['allergyTags', ['Ninguna', 'Medicamentos', 'Alimentos', 'Picaduras', 'Suplementos', 'Otra']],
    ['supplementTags', ['Proteína', 'Creatina', 'Glutamina', 'BCAA', 'Otro']]
  ]) {
    const value = profile[key];
    if (value !== undefined && (!Array.isArray(value) || value.some((item) => !allowed.includes(String(item))))) return 'Una de las opciones de salud no es válida.';
  }
  const historyTags = Array.isArray(profile.historyTags) ? profile.historyTags.map(String) : [];
  const allergyTags = Array.isArray(profile.allergyTags) ? profile.allergyTags.map(String) : [];
  const supplementTags = Array.isArray(profile.supplementTags) ? profile.supplementTags.map(String) : [];
  if (historyTags.length === 0) return 'Completa la pregunta de antecedentes.';
  if (allergyTags.length === 0) return 'Completa la pregunta de alergias.';
  if (historyTags.includes('Ninguno') && historyTags.length !== 1) return 'La opción “Ninguno” no puede combinarse con otras respuestas.';
  if (allergyTags.includes('Ninguna') && allergyTags.length !== 1) return 'La opción “Ninguna” no puede combinarse con otras respuestas.';
  if (historyTags.includes('Otro') && !safeText(profile.historyOther, 500)) return 'Especifica el antecedente seleccionado.';
  if (allergyTags.includes('Otra') && !safeText(profile.allergyOther, 500)) return 'Especifica la alergia seleccionada.';
  if (!['No', 'Sí'].includes(String(profile.supplementStatus))) return 'Completa la pregunta de suplementos.';
  if (profile.supplementStatus === 'Sí' && (!Array.isArray(profile.supplementTags) || profile.supplementTags.length === 0)) return 'Selecciona los suplementos que consumes.';
  if (supplementTags.includes('Otro') && !safeText(profile.supplementOther, 500)) return 'Especifica el suplemento seleccionado.';
  if (!['No', 'Sí'].includes(String(profile.medicationStatus))) return 'Completa la pregunta de medicamentos.';
  if (profile.medicationStatus === 'Sí' && !safeText(profile.medicationDetails, 1000)) return 'Indica qué medicamentos tomas.';
  if (!['Omitir', 'Sí'].includes(String(profile.commentStatus))) return 'Completa la pregunta de comentario opcional.';
  if (profile.commentStatus === 'Sí' && !safeText(profile.commentDetails, 2000)) return 'Completa el comentario opcional.';
  if (profile.prefilterAccepted !== true) return 'Se requiere aceptar el aviso informativo.';
  if (profile.consent !== true) return 'Se necesita el consentimiento para guardar el perfil.';
  if (!Number.isInteger(Number(profile.rating)) || Number(profile.rating) < 1 || Number(profile.rating) > 5) return 'Completa la calificación final.';
  const json = JSON.stringify(profile);
  if (json.length > 24000) return 'La ficha supera el tamaño permitido.';
  return null;
}

async function hashIp(ip: string): Promise<string> {
  const secret = Deno.env.get('RATE_LIMIT_HMAC_SECRET') || '';
  if (!secret) throw new Error('Missing RATE_LIMIT_HMAC_SECRET');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ip));
  return Array.from(new Uint8Array(signature)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function sendNotification(profileId: string, submissionId: string, createdAt: string): Promise<boolean> {
  const apiKey = Deno.env.get('RESEND_API_KEY') || '';
  const from = Deno.env.get('RESEND_FROM') || '';
  const to = Deno.env.get('ADMIN_NOTIFICATION_EMAIL') || '';
  if (!apiKey || !from || !to) return false;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
      headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json', 'Idempotency-Key': 'gorilla-profile-' + submissionId },
    body: JSON.stringify({
      from,
      to: [to],
      subject: 'Nueva ficha recibida · Gorilla Labs',
      text: 'Se recibió una nueva ficha de inscripción. Fecha: ' + createdAt + '. ID: ' + profileId + '. Accede al panel administrativo para consultarla. No se incluyen respuestas personales ni de salud en este correo.',
    })
  });
  return response.ok;
}

Deno.serve(async (request: Request) => {
  const origin = allowedOrigin(request);
  if (request.method === 'OPTIONS') return new Response(null, { status: origin === null ? 403 : 204, headers: corsHeaders(origin) });
  if (origin === null) return jsonResponse({ ok: false, error: 'Origen no autorizado.' }, 403, null);
  if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'Método no permitido.' }, 405, origin);
  try {
    const raw = await request.text();
    if (raw.length > 26000) return jsonResponse({ ok: false, error: 'La solicitud supera el tamaño permitido.' }, 413, origin);
    const body = JSON.parse(raw);
    const profile = body.profile && typeof body.profile === 'object' ? body.profile as Record<string, unknown> : {};
    const submissionId = safeText(body.submissionId, 50);
    const invalid = validate(profile, submissionId);
    if (invalid) return jsonResponse({ ok: false, error: invalid }, 400, origin);

    const ip = safeText(request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('cf-connecting-ip') || 'unknown', 100);
    const ipHash = await hashIp(ip);
    const { data: allowed, error: limitError } = await admin.rpc('gorilla_take_submission_slot', { p_ip_hash: ipHash });
    if (limitError) throw new Error('No se pudo verificar el límite de envíos.');
    if (!allowed) return jsonResponse({ ok: false, error: 'Se alcanzó el límite temporal de envíos. Intenta más tarde.' }, 429, origin);

    const allowedFields = [
      'name', 'age', 'sex', 'height', 'weight', 'weightTouched', 'goal', 'activity', 'activityLevel', 'sport',
      'days', 'duration', 'water', 'sleep', 'meals', 'protein', 'fruitFrequency', 'vegetableFrequency',
      'fishFrequency', 'animalProteinFrequency', 'legumeFrequency', 'processedFoodsFrequency', 'historyTags',
      'historyOther', 'allergyTags', 'allergyOther', 'supplementStatus', 'supplementTags', 'supplementOther',
      'medicationStatus', 'medicationDetails', 'commentStatus', 'commentDetails', 'prefilterAccepted', 'consent',
      'rating', 'ratingComment', 'internalRoute'
    ];
    const cleanProfile: Record<string, unknown> = {};
    for (const key of allowedFields) if (profile[key] !== undefined) cleanProfile[key] = profile[key];
    cleanProfile.name = safeText(profile.name, 120);
    cleanProfile.phone = String(profile.phone || '').replace(/\D/g, '');
    cleanProfile.submissionId = submissionId;
    cleanProfile.createdISO = new Date().toISOString().slice(0, 10);
    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() + 90);
    cleanProfile.reviewISO = reviewDate.toISOString().slice(0, 10);
    const { data: inserted, error: insertError } = await admin.from('gorilla_profiles').insert({
      submission_id: submissionId,
      full_name: cleanProfile.name,
      phone: cleanProfile.phone,
      profile: cleanProfile,
      notification_status: 'pending'
    }).select('id, created_at, notification_status').single();

    if (insertError?.code === '23505') {
      const { data: existing, error: existingError } = await admin.from('gorilla_profiles')
        .select('id, created_at, notification_status').eq('submission_id', submissionId).single();
      if (existingError) throw existingError;
      let notificationSent = existing.notification_status === 'sent';
      if (!notificationSent) {
        try {
          notificationSent = await sendNotification(existing.id, submissionId, existing.created_at);
          await admin.from('gorilla_profiles').update({ notification_status: notificationSent ? 'sent' : 'failed' }).eq('id', existing.id);
        } catch (_) { notificationSent = false; }
      }
      return jsonResponse({ ok: true, duplicate: true, notificationSent }, 200, origin);
    }
    if (insertError) throw insertError;

    let notificationSent = false;
    try { notificationSent = await sendNotification(inserted.id, submissionId, inserted.created_at); } catch (_) { notificationSent = false; }
    await admin.from('gorilla_profiles').update({ notification_status: notificationSent ? 'sent' : 'failed' }).eq('id', inserted.id);
    return jsonResponse({ ok: true, duplicate: false, notificationSent, receiptId: inserted.id }, 201, origin);
  } catch (error) {
    console.error('submit-profile failed:', error instanceof Error ? error.message : 'unknown error');
    return jsonResponse({ ok: false, error: 'No pudimos guardar la ficha. Intenta de nuevo; tus datos no se confirmarán hasta que el servidor responda.' }, 500, origin);
  }
});

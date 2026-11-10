# Conectar Gorilla Labs a internet

La interfaz existente se conserva. Para registrar clientes reales, primero conecta el backend y prueba la recepción antes de publicar el formulario.

## Servicios

- **Sitio público:** GitHub Pages (solo archivos estáticos).
- **Recepción, base de datos e inicio de sesión administrativo:** Supabase.
- **Aviso de nuevas inscripciones por correo:** Resend, llamado desde la función del servidor.

## Preparación en Supabase

1. Crea un proyecto Supabase y ejecuta `supabase/migrations/202611090001_gorilla_profiles.sql` en el SQL Editor.
2. Crea una cuenta de administrador en Supabase Auth. Añade su correo a `ADMIN_EMAILS` en los secretos del proyecto. La cuenta también deberá usar contraseña y, si está disponible, MFA.
3. Configura estos secretos de Edge Functions en el panel de Supabase: `ADMIN_EMAILS`, `ALLOWED_ORIGINS`, `RATE_LIMIT_HMAC_SECRET`, `ADMIN_NOTIFICATION_EMAIL`, `RESEND_API_KEY` y `RESEND_FROM`. `ALLOWED_ORIGINS` debe contener el dominio publicado y, mientras se prueba, `http://localhost:8000,http://127.0.0.1:8000`. Usa un secreto aleatorio largo para `RATE_LIMIT_HMAC_SECRET`.
4. Instala y enlaza la CLI desde esta carpeta (`npm install supabase --save-dev`, `npx supabase login`, `npx supabase link --project-ref TU_PROJECT_REF`). Luego aplica la migración (`npx supabase db push`) y despliega las funciones (`npx supabase functions deploy submit-profile` y `npx supabase functions deploy admin-profiles`). `supabase/config.toml` permite envíos públicos a `submit-profile` y exige JWT a `admin-profiles`; el propio handler limita la consulta al correo administrador autorizado.
5. En `cloud-config.js`, coloca el URL del proyecto y su clave publicable. Esa clave puede estar en el navegador porque la tabla no concede acceso a `anon` ni `authenticated`; la clave secreta de Supabase y la clave Resend se quedan solo en los secretos del servidor.

## Publicación y pruebas

1. Publica los archivos de `outputs/gorilla-labs` en GitHub Pages y agrega el dominio exacto a `ALLOWED_ORIGINS`.
2. Envía una ficha de prueba autorizada. Comprueba en Supabase que aparece una sola fila, que los reintentos con el mismo identificador no duplican el perfil y que el aviso llega al correo de administración.
3. Abre “Acceso administrador”, inicia sesión, consulta los registros centrales y descarga `.xlsx`.
4. Repite en teléfono y computadora. No publiques hasta que la prueba de recepción, notificación, descarga y rechazo de acceso no autorizado pase.

El cliente podrá ver su resumen y descargar su PNG. Los datos de salud no se guardan ni se confirman como recibidos si el servidor falla. Los registros antiguos que ya existan en `localStorage` permanecen en ese navegador; esta integración no los copia ni los borra automáticamente.

## Límites actuales

La prevención de duplicados usa un identificador de envío estable frente a reintentos, no el teléfono como identificador único, para permitir futuras inscripciones del mismo cliente. Se aplica un límite de ocho envíos por hora por IP seudonimizada. La notificación por correo no incluye respuestas ni datos de salud.

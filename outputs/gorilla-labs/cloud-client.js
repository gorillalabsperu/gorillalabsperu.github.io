(function () {
  'use strict';

  const config = window.GORILLA_CLOUD_CONFIG || {};
  let adminAccessToken = '';
  let adminRefreshToken = '';

  function configured() {
    const url = String(config.supabaseUrl || '');
    const secureRemote = /^https:\/\//i.test(url);
    const loopbackLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(url);
    return Boolean(config.publishableKey && (secureRemote || loopbackLocal));
  }

  function endpoint(name) {
    return config.supabaseUrl.replace(/\/$/, '') + '/functions/v1/' + name;
  }

  async function functionCall(name, payload, accessToken) {
    if (!configured()) throw new Error('El servicio de inscripción aún no está conectado.');
    const headers = {
      'Content-Type': 'application/json',
      'apikey': config.publishableKey
    };
    if (accessToken) headers.Authorization = 'Bearer ' + accessToken;
    const response = await fetch(endpoint(name), {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload || {})
    });
    let result = {};
    try { result = await response.json(); } catch (_) {}
    if (!response.ok || result.ok === false) {
      const error = new Error(result.error || 'No se pudo completar la solicitud.');
      error.status = response.status;
      throw error;
    }
    return result;
  }

  async function submitProfile(profile) {
    const submissionId = profile.submissionId || (window.crypto && crypto.randomUUID ? crypto.randomUUID() : fallbackId());
    profile.submissionId = submissionId;
    return functionCall('submit-profile', { submissionId: submissionId, profile: profile });
  }

  function fallbackId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 3 | 8)).toString(16);
    });
  }

  async function adminSignIn(email, password) {
    if (!configured()) throw new Error('El panel central todavía no está conectado.');
    const response = await fetch(config.supabaseUrl.replace(/\/$/, '') + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: config.publishableKey },
      body: JSON.stringify({ email: email, password: password })
    });
    const session = await response.json().catch(function () { return {}; });
    if (!response.ok || !session.access_token) throw new Error(session.msg || session.message || 'No se pudo iniciar sesión. Revisa el correo y la contraseña administrativa.');
    adminAccessToken = session.access_token;
    adminRefreshToken = session.refresh_token || '';
    return session.user;
  }

  async function adminListProfiles() {
    if (!adminAccessToken) throw new Error('Inicia sesión para consultar los registros.');
    try {
      return await functionCall('admin-profiles', {}, adminAccessToken);
    } catch (error) {
      if (error.status === 401 && adminRefreshToken) {
        const response = await fetch(config.supabaseUrl.replace(/\/$/, '') + '/auth/v1/token?grant_type=refresh_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: config.publishableKey },
          body: JSON.stringify({ refresh_token: adminRefreshToken })
        });
        const session = await response.json().catch(function () { return {}; });
        if (response.ok && session.access_token) {
          adminAccessToken = session.access_token;
          adminRefreshToken = session.refresh_token || adminRefreshToken;
          return functionCall('admin-profiles', {}, adminAccessToken);
        }
        adminSignOut();
      }
      throw error;
    }
  }

  function adminSignOut() {
    adminAccessToken = '';
    adminRefreshToken = '';
  }

  window.GorillaCloud = {
    isConfigured: configured,
    submitProfile: submitProfile,
    adminSignIn: adminSignIn,
    adminListProfiles: adminListProfiles,
    adminSignOut: adminSignOut
  };
})();

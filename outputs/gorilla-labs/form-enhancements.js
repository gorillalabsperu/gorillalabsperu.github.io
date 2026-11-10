(function () {
  const style = document.createElement('style');
  style.textContent = `
    .step-brand{display:flex;justify-content:center;align-items:center;margin:-10px 0 16px}
    .step-brand img{width:54px;height:54px;object-fit:contain;filter:drop-shadow(0 5px 10px #25112b14)}
    .sex-options{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .sex-choice{display:flex;align-items:center;gap:11px;min-height:58px;padding:10px 14px;border:1px solid #dfd9e3;border-radius:15px;background:#ffffffbd;color:var(--ink);text-align:left;font-weight:700}
    .sex-choice strong{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#f1ebf6;color:#5d287e;font-size:16px}
    .sex-choice.selected{border-color:var(--violet);background:#f6effd;box-shadow:0 0 0 3px #782ab214}
    .sex-choice.selected strong{background:var(--violet);color:white}
    .sex-choice.is-male strong{background:#e7eff8;color:#527ba9}
    .sex-choice.is-female strong{background:#f7e9ee;color:#a86c83}
    .sex-choice.is-male.selected{border-color:#6289b7;background:linear-gradient(120deg,#edf3f9,#faf8fc);box-shadow:0 0 0 3px #6289b71c}
    .sex-choice.is-female.selected{border-color:#bd8298;background:linear-gradient(120deg,#fbf0f3,#faf8fc);box-shadow:0 0 0 3px #bd82981c}
    .sex-choice.is-male.selected strong{background:#6289b7;color:#fff}
    .sex-choice.is-female.selected strong{background:#bd8298;color:#fff}
    .weight-control{padding:14px 16px 12px;border:1px solid #e2dce5;border-radius:17px;background:linear-gradient(145deg,#fff,#f8f5fa)}
    .weight-readout{display:flex;align-items:baseline;justify-content:center;gap:7px;margin-bottom:9px;color:#2c2431;font-size:32px;font-weight:800;letter-spacing:-.04em}
    .weight-readout small{font-size:14px;font-weight:650;color:#716b77;letter-spacing:0}
    .weight-scale{height:68px;position:relative;overflow:hidden;border-radius:12px;background:linear-gradient(#fbfaff,#f3edf8);touch-action:none;cursor:grab;user-select:none;outline:none}
    .weight-scale:before{content:'';position:absolute;z-index:2;left:var(--weight-needle,50%);top:0;transform:translateX(-50%);border-left:7px solid transparent;border-right:7px solid transparent;border-top:9px solid var(--violet);pointer-events:none}
    .weight-scale:after{content:'';position:absolute;z-index:2;left:var(--weight-needle,50%);top:8px;bottom:0;width:2px;transform:translateX(-50%);background:#7027b5;opacity:.78;pointer-events:none}
    .weight-scale:focus-visible{box-shadow:0 0 0 3px #8d39c129}
    .weight-scale.is-dragging{cursor:grabbing}
    .weight-tape{position:absolute;inset:0;width:100%;pointer-events:none}
    .weight-tick{position:absolute;top:22px;width:1px;height:9px;background:#b9adbf;color:#746b79;font-size:10px;text-align:center}
    .weight-tick.major{top:17px;height:16px;background:#75677d}
    .weight-tick span{position:absolute;top:19px;left:50%;transform:translateX(-50%);font-weight:650;white-space:nowrap}
    .weight-control:focus-within{outline:3px solid #8d39c129}
    .weight-help{display:flex;align-items:center;justify-content:center;gap:7px;margin:8px 0 0;text-align:center;font-size:12px;color:#77717e;line-height:1.35}
    .weight-guide-motion{display:inline-block;color:#7027b5;font-weight:800;animation:weightGuideMove 1.2s ease-in-out infinite alternate}
    @keyframes weightGuideMove{from{transform:translateX(-4px)}to{transform:translateX(4px)}}
    .body-card.is-first-step .stats{display:none}
    .body-card.is-first-step .visual-choice{display:none}
    .body-card.is-first-step .body-visual{background:none!important;filter:none}
    .body-visual{transition:width .4s ease,height .4s ease,filter .35s ease;display:grid;place-items:end center;overflow:visible;background-color:transparent!important;background-repeat:no-repeat;background-size:400% 200%;border-radius:0!important}
    .body-visual.is-photographic{border-radius:20px!important;overflow:hidden;box-shadow:0 14px 34px #2415311b;outline:1px solid #ffffffb8;outline-offset:-1px}
    .body-visual svg{display:block;width:100%;height:100%;overflow:visible}
    .body-comparison{height:100%;display:grid;grid-template-columns:1fr;gap:8px;align-items:end}
    .body-option{height:100%;min-width:0;display:grid;grid-template-rows:auto 1fr auto;align-items:center;justify-items:center;text-align:center}
    .body-option[hidden]{display:none!important}
    .body-tag{font-size:10px;font-weight:800;letter-spacing:.09em;color:#7027b5;text-transform:uppercase;line-height:1.2;min-height:26px;display:flex;align-items:center;justify-content:center}
    .body-stage{width:100%;height:100%;display:flex;align-items:end;justify-content:center;overflow:hidden}
    .body-meta{font-size:10px;line-height:1.25;color:#736b78;margin:3px 0 0;min-height:26px}
    .body-visual.is-neutral svg{opacity:.68}
    .prefilter-check{flex-direction:row!important;align-items:flex-start;gap:10px;padding:12px 14px;border:1px solid #e4d5f0;border-radius:15px;background:#faf7fc;color:#5b5261;font-size:12px;font-weight:550;line-height:1.45}
    .prefilter-check input{width:18px;height:18px;flex:none;margin:1px 0 0;accent-color:#7027b5}
    .welcome-mark{width:220px;height:auto;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;margin-bottom:18px}
    .welcome-mark img{width:132px;height:118px;object-fit:contain;filter:drop-shadow(0 8px 14px #25112b16)}
    .welcome-wordmark{display:flex;flex-direction:column;align-items:center;font-weight:900;line-height:.88;letter-spacing:.08em}
    .welcome-wordmark span:first-child{font-size:26px;color:#211a25}
    .welcome-wordmark span:last-child{font-size:19px;color:#7027b5;letter-spacing:.28em;padding-left:.28em;margin-top:5px}
    .welcome p{font-family:'Trebuchet MS','Segoe UI',system-ui,sans-serif;font-size:clamp(15px,2vw,19px);font-weight:650;letter-spacing:.045em;color:#6d6475}
    .goal-choices .choice{min-height:108px;display:flex;align-items:center;text-align:left}
    .goal-choices{grid-template-columns:repeat(2,minmax(0,1fr))}
    .goal-choices .choice:after{display:none}
    .goal-choices .choice.selected{border-color:#e6e0e9;background:#ffffffa8;box-shadow:none}
    .goal-choices .choice:hover .goal-copy strong,.goal-choices .choice:focus-visible .goal-copy strong,.goal-choices .choice.selected .goal-copy strong{color:#7027b5}
    .goal-choices .choice:hover .goal-copy strong,.goal-choices .choice:focus-visible .goal-copy strong{letter-spacing:.006em}
    .goal-choices .choice.is-male:hover .goal-copy strong,.goal-choices .choice.is-male:focus-visible .goal-copy strong,.goal-choices .choice.is-male.selected .goal-copy strong{color:#6289b7}
    .goal-choices .choice.is-female:hover .goal-copy strong,.goal-choices .choice.is-female:focus-visible .goal-copy strong,.goal-choices .choice.is-female.selected .goal-copy strong{color:#bd8298}
    .activity-level-choices{grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin:2px 0 0}
    .activity-level-choices .choice{min-height:64px;text-align:center;padding:10px;transition:color .18s ease}
    .activity-level-choices .choice span{margin-top:3px;font-size:11px}
    .activity-level-choices .choice:hover,.activity-level-choices .choice:focus-visible{color:#7027b5}
    .activity-level-choices .choice.selected:after{display:block}
    .goal-copy{display:block;min-width:0}
    .goal-copy strong{display:block;font-size:16px;line-height:1.18;margin-bottom:6px;padding-right:14px}
    .goal-copy span{display:block;font-size:12px;line-height:1.35;color:var(--muted);font-weight:500}
    .goal-label{font-size:11px;display:inline-block;padding:5px 9px;border-radius:999px;background:#f3eafb;color:#5a2685;font-weight:800;letter-spacing:.04em;text-transform:uppercase}
    .reference-box{margin-top:18px;padding:16px;border:1px solid #ded4e5;border-radius:16px;background:#fff}
    .reference-box h3{margin:0 0 8px;font-size:15px;color:#352a3b}
    .reference-box p{margin:0 0 7px;font-size:13px;line-height:1.45;color:#625b67}
    .reference-box p:last-child{margin-bottom:0}
    .xlsx-card{border:1px solid #ded3e7;border-radius:18px;padding:20px;background:#fff;box-shadow:0 8px 25px #3d1b570d}
    .xlsx-goal{border-left:5px solid #7027b5;background:#f6effb;padding:13px 15px;border-radius:10px;margin:12px 0}
    .xlsx-goal strong{display:block;font-size:18px;color:#54247b}
    .food-checkin{display:grid;gap:12px}
    .food-question{padding:14px;border:1px solid #e8e2eb;border-radius:17px;background:#ffffffad}
    .food-question h3{margin:0 0 4px;font-size:14px;color:#37313d}
    .food-question p{margin:0 0 10px;font-size:12px;color:#77717e}
    .food-options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}
    .food-choice{min-height:42px;padding:8px 6px;border:1px solid #e1dbe5;border-radius:12px;background:#fff;color:#514a56;font-size:12px;font-weight:650}
    .food-choice.selected{border-color:var(--violet);background:#f5eefb;color:#572484;box-shadow:0 0 0 2px #782ab214}
    .habits-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
    .habit-question{padding:14px;border:1px solid #e8e2eb;border-radius:17px;background:#ffffffad}
    .habit-question h3{margin:0 0 9px;font-size:14px;color:#37313d}
    .habit-options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin:0}
    .habit-options.sleep-options{grid-template-columns:repeat(4,minmax(0,1fr))}
    .habit-options .choice{min-height:65px;text-align:center;padding:9px 7px;font-size:13px;line-height:1.2;transition:color .18s ease,border-color .18s ease,background .18s ease}
    .habit-options .choice span{font-size:11px;line-height:1.25;margin-top:4px}
    .habit-options .choice:hover,.habit-options .choice:focus-visible{color:#7027b5;border-color:#cbb1df}
    .habit-options .choice.selected:after{right:7px;top:7px}
    .orientation-box{margin-top:16px;padding:16px;border:1px solid #e4d5f0;border-radius:17px;background:linear-gradient(135deg,#f7f0fc,#fff)}
    .orientation-box h3{margin:0 0 8px;font-size:16px}
    .orientation-box ul{margin:0;padding-left:20px;color:#514758;font-size:14px}
    .orientation-box li+li{margin-top:6px}
    .pregnancy-alert{border-color:#d8c3e8!important;background:linear-gradient(135deg,#f7f0fc,#fff)!important;color:#4e3262}
    .pregnancy-alert h3{color:#56208a}
    .rating-box{margin-top:20px;padding:16px;border:1px solid #e8e2eb;border-radius:17px;background:#fff}
    .rating-box h3{margin:0 0 10px;font-size:15px}
    .rating-stars{display:flex;gap:8px}
    .rating-star{width:43px;height:43px;border:1px solid #e3dbe8;border-radius:12px;background:#fff;color:#b4a9bb;font-size:25px;line-height:1}
    .rating-star.selected{color:#8c59c2;border-color:#c9a8e4;background:#f6effd}
    .rating-hint{font-size:12px;color:#77717e;margin:7px 0 0}
    .share-consent{display:flex;align-items:flex-start;gap:10px;margin:18px 0 12px;padding:13px;border:1px solid #e5dfe9;border-radius:14px;background:#faf8fc;font-size:13px;color:#544c58}
    .share-consent input{width:18px;height:18px;flex:none;margin:1px 0 0}
    .share-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}
    .share-actions .primary,.share-actions .next{flex:1;min-width:220px}
    .community-benefits{display:grid;gap:8px;margin:10px 0 2px;padding:0;list-style:none;text-align:left;color:#6f6874;font-size:13px;line-height:1.4}
    .community-benefits li{display:flex;align-items:flex-start;gap:9px}
    .community-check{display:inline-grid;flex:none;place-items:center;width:16px;height:16px;margin-top:1px;border-radius:50%;background:#f3eafa;color:#6d2da7;font-size:10px;font-weight:800;line-height:1}
    .download-link{display:flex;align-items:center;justify-content:center;text-decoration:none;text-align:center}
    .secondary-action{border:1px solid #ded5e6;border-radius:14px;background:white;padding:12px 16px;color:#4f4555;font-weight:700}
    .record-png{padding:8px 11px;border-radius:10px;white-space:nowrap;font-size:12px}
    .message-preview{margin:15px 0;padding:14px 16px;border:1px solid #e4dce9;border-radius:15px;background:#faf8fc;text-align:left;font-size:13px;color:#514758}
    .message-preview strong{display:block;color:#572484;margin-bottom:6px}
    .message-preview p{margin:0;color:#514758;line-height:1.5}
    .share-actions .primary:disabled{opacity:.45;cursor:not-allowed}
    .final-actions{display:grid;gap:10px;width:min(100%,520px);margin:18px auto 0}
    .final-actions>button{width:100%;min-height:54px}
    .final-actions .primary{font-size:15px;letter-spacing:.015em}
    .final-actions .secondary-action{background:#ffffffd9;color:#4d315c;border-color:#ded2e8}
    .final-actions>button:disabled{opacity:.55;cursor:not-allowed;box-shadow:none}
    .final-actions .hint{margin:0 auto 2px;max-width:480px;text-align:center;line-height:1.45}
    .final-actions .community-benefits{margin:2px 0 0}
    .visual-question{margin:8px 0 9px;text-align:center;font-size:14px;font-weight:750;color:#3d3145}
    .visual-toggle{display:block;width:min(100%,300px);margin:0 auto 12px;padding:12px 16px;border:0;border-radius:14px;background:linear-gradient(120deg,#56208a,#8e3bd0);color:#fff;font-size:14px;font-weight:750;box-shadow:0 7px 18px #56208a20;cursor:pointer}
    .visual-toggle:disabled{opacity:.48;cursor:not-allowed;box-shadow:none}
    .visual-toggle:focus-visible{outline:3px solid #b881eb;outline-offset:3px}
    .success-card .note{margin-top:12px}
    .finish-action{margin-top:16px}
    .success-card{text-align:center;padding:14px 4px 8px;background:radial-gradient(ellipse at 50% 0%,#f1e7fa 0,transparent 55%)}
    .success-brand{display:grid;justify-items:center;gap:4px;margin:0 auto 15px}
    .success-brand img{width:58px;height:58px;object-fit:contain}
    .success-brand strong{font-size:13px;letter-spacing:.16em;color:#56208a}
    .success-mark{width:58px;height:58px;margin:0 auto 15px;border-radius:50%;display:grid;place-items:center;background:#f0e6f8;color:#6729a2;font-size:28px;font-weight:800}
    .success-card h1{font-size:clamp(29px,4vw,39px)}
    .success-card .note{text-align:left}
    .intro-media{position:relative;display:block;width:max-content;height:max-content;max-width:96vw;max-height:96svh;transform:scale(1.035);transform-origin:center;transition:transform .8s ease}
    .intro video{display:block;width:auto;height:auto;max-width:96vw;max-height:96svh;object-fit:contain;object-position:center;filter:brightness(.97) contrast(1.08) saturate(1.07);transform:none;image-rendering:auto}
    .intro-glow{position:absolute;inset:0;z-index:2;pointer-events:none;mix-blend-mode:screen;opacity:.75;filter:blur(12px);background:radial-gradient(ellipse 35% 28% at 50% 35%,rgba(176,72,255,.23),transparent 74%),radial-gradient(ellipse 53% 24% at 50% 52%,rgba(133,58,216,.16),transparent 75%)}
    .intro-watermark-mask{position:absolute;z-index:3;right:-1%;bottom:-1%;width:24%;height:15%;background-color:#050505;pointer-events:none;filter:blur(2px);-webkit-mask-image:radial-gradient(ellipse at 72% 68%,#000 30%,rgba(0,0,0,.9) 52%,transparent 100%);mask-image:radial-gradient(ellipse at 72% 68%,#000 30%,rgba(0,0,0,.9) 52%,transparent 100%);transition:background-color .9s ease,opacity .9s ease,filter .9s ease}
    .intro.is-ending .intro-media{transform:scale(1.035)}
    .intro.is-ending .intro-glow{opacity:.3}
    .intro.is-ending .intro-watermark-mask{background-color:#f7f6f8;filter:blur(7px)}
    .sound-toggle{z-index:5}
    @media(max-width:760px){.food-options{grid-template-columns:repeat(2,minmax(0,1fr))}.habits-form{grid-template-columns:1fr;gap:10px}.habit-options{grid-template-columns:repeat(2,minmax(0,1fr))}.habit-options.sleep-options{grid-template-columns:repeat(2,minmax(0,1fr))}.habit-options .choice{min-height:58px}.goal-choices{grid-template-columns:1fr}.goal-choices .choice{min-height:82px}.activity-level-choices{grid-template-columns:1fr}.activity-level-choices .choice{min-height:58px;text-align:left;padding:12px 16px}.activity-level-choices .choice span{display:inline;margin-left:5px}.weight-control{padding:12px}.share-actions{display:grid}.share-actions .primary,.share-actions .next{min-width:0}.rating-stars{justify-content:space-between}.body-tag{font-size:9px}.body-meta{font-size:9px}.welcome-mark{width:180px}.welcome-mark img{width:118px;height:105px}.welcome-wordmark span:first-child{font-size:23px}.welcome-wordmark span:last-child{font-size:17px}.records th:nth-child(5),.records td:nth-child(5),.records th:nth-child(6),.records td:nth-child(6){display:none}.records th:last-child,.records td:last-child{display:table-cell}}
    @media(max-width:760px){.intro-media{max-width:96vw;max-height:96svh}.intro video{width:auto;height:auto;max-width:96vw;max-height:96svh}}
  `;
  document.head.appendChild(style);

  const baseRender = render;
  const baseSync = sync;
  const baseValid = valid;
  const baseUpdateModel = updateModel;
  const baseShowAdmin = showAdmin;
  const contactDigits = '51986663258';
  let targetViewSelected = false;
  let summaryDownloadUrl = null;
  let remoteProfiles = [];
  let adminEmail = '';
  function isPregnantProfile(profile) {
    return !!(window.GorillaFinalScreenUtils && window.GorillaFinalScreenUtils.isPregnant(profile));
  }
  valid = function () {
    if (step === 6) return !!data.consent;
    return baseValid();
  };

  steps[4].id = 'professional';
  steps[5].id = 'summary';
  steps.splice(4, 0, {
    id: 'food',
    title: '¿Qué alimentos forman parte de tu semana?',
    sub: 'Elige la frecuencia que más se parece a tu rutina. Esto ayuda a preparar una conversación con el profesional.',
    render: function () {
      return '<div class="food-checkin">' +
        foodQuestion('fruitFrequency', 'Frutas', '¿Con qué frecuencia comes fruta?') +
        foodQuestion('vegetableFrequency', 'Verduras', '¿Con qué frecuencia incluyes verduras?') +
        foodQuestion('fishFrequency', 'Pescado', '¿Con qué frecuencia comes pescado?') +
        foodQuestion('animalProteinFrequency', 'Carne, pollo o huevos', '¿Con qué frecuencia consumes estas fuentes de proteína?') +
        foodQuestion('legumeFrequency', 'Menestras', '¿Con qué frecuencia comes lentejas, frejoles, garbanzos u otras menestras?') +
        foodQuestion('processedFoodsFrequency', 'Productos salados o procesados', '¿Con qué frecuencia comes embutidos, snacks salados, sopas instantáneas o comida lista?') +
      '</div>';
    }
  });
  const baseProfessionalRender = steps[5].render;
  steps[5].render = function () {
    if (!window.GorillaFinalScreenUtils || !window.GorillaFinalScreenUtils.showPregnancyQuestion(data)) return baseProfessionalRender();
    const pregnancyQuestion = '<section class="health-question pregnancy-question"><h3>¿Estás embarazada actualmente?</h3><div class="binary-options" role="group" aria-label="Embarazo actual">' +
      '<button type="button" class="binary-choice ' + (data.pregnancyStatus === 'No' ? 'selected' : '') + '" data-binary-key="pregnancyStatus" data-binary-value="No" aria-pressed="' + (data.pregnancyStatus === 'No') + '">No</button>' +
      '<button type="button" class="binary-choice ' + (data.pregnancyStatus === 'Sí' ? 'selected' : '') + '" data-binary-key="pregnancyStatus" data-binary-value="Sí" aria-pressed="' + (data.pregnancyStatus === 'Sí') + '">Sí</button></div></section>';
    if (window.GorillaFinalScreenUtils.isPregnant(data)) {
      return '<div class="health-form">' + pregnancyQuestion + '<div class="note pregnancy-alert" role="status">Indicaste un embarazo actual. Este prefiltro general termina aquí; continúa con una evaluación personalizada antes de considerar suplementos.</div></div>';
    }
    return baseProfessionalRender().replace('<div class="health-form">', '<div class="health-form">' + pregnancyQuestion);
  };
  document.addEventListener('click', function (event) {
    const button = event.target && event.target.closest ? event.target.closest('[data-binary-key="pregnancyStatus"]') : null;
    if (!button || button.dataset.binaryValue !== 'Sí' || !steps[step] || steps[step].id !== 'professional') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    sync();
    data.pregnancyStatus = 'Sí';
    targetViewSelected = false;
    step = 6;
    render();
  }, true);
  steps[1].render = function () {
    return '<div class="choice-grid goal-choices" data-key="goal">' +
      goalChoice('Aumentar masa muscular','Aumentar masa muscular','Quiero desarrollar músculo.','muscle',2) +
      goalChoice('Reducir grasa corporal','Reducir grasa corporal','Quiero reducir grasa corporal cuidando mi bienestar.','definition',3) +
      goalChoice('Mejorar resistencia física','Mejorar resistencia física','Quiero sostener mejor el esfuerzo y tener más energía.','endurance',1) +
      goalChoice('Mejorar rendimiento deportivo','Mejorar el rendimiento deportivo','Quiero optimizar mi desempeño y recuperación.','performance',2) +
      '</div><div class="hint">Elige un objetivo principal. El especialista revisará contigo la estrategia y los siguientes pasos.</div>';
  };
  steps[3].render = function () {
    return '<div class="habits-form">' +
      habitQuestion('Agua al día','water',[
        ['Menos de 1 litro','0–1 L al día'],
        ['1 a 2 litros','Promedio: 1–2 L'],
        ['Más de 2 litros','Más de 2 L al día']
      ]) +
      habitQuestion('Horas de sueño','sleep',[
        ['Menos de 5 horas','Menos de 5 h'],
        ['5 a 6 horas','Promedio: 5–6 h'],
        ['7 a 8 horas','Promedio: 7–8 h'],
        ['Más de 8 horas','Más de 8 h']
      ],'sleep-options') +
      habitQuestion('Comidas al día','meals',[
        ['1 a 2','1–2 comidas'],
        ['3','3 comidas'],
        ['4 o más','4 o más comidas']
      ]) +
      habitQuestion('¿Incluyes proteína regularmente?','protein',[
        ['Sí, casi siempre','Casi siempre'],
        ['A veces','Algunas veces'],
        ['Casi nunca','Casi nunca']
      ]) +
      '</div><div class="note">Estos datos describen hábitos. Las recomendaciones nutricionales específicas deben ser validadas por un profesional.</div>';
  };

  function habitQuestion(title, key, items, extraClass) {
    return '<section class="habit-question"><h3>' + title + '</h3>' + choices(key, items, 'habit-options ' + (extraClass || '')) + '</section>';
  }

  function weightWindow(weight) {
    const start = Math.max(40, Math.min(180, Number(weight) - 10));
    const end = start + 20;
    const needle = Math.max(0, Math.min(100, ((Number(weight) - start) / 20) * 100));
    return { start: start, end: end, needle: needle };
  }

  function weightTicksHTML(weight) {
    const window = weightWindow(weight);
    let ticks = '';
    for (let kg = window.start; kg <= window.end; kg += 1) {
      const major = kg % 5 === 0 || kg === window.start || kg === window.end;
      const left = ((kg - window.start) / 20) * 100;
      ticks += '<span class="weight-tick ' + (major ? 'major' : '') + '" style="left:' + left + '%">' +
        (major ? '<span>' + kg + '</span>' : '') + '</span>';
    }
    return { html: ticks, start: window.start, end: window.end, needle: window.needle };
  }

  function weightGuideHTML() {
    let seen = false;
    try { seen = localStorage.getItem('gorillaWeightGuideSeen') === '1'; } catch (_) {}
    return '<p class="weight-help ' + (seen ? 'hidden' : '') + '" id="weightGuide"><span class="weight-guide-motion" aria-hidden="true">↔</span><span>Ventana de 20 kg: haz clic o arrastra; la aguja marca tu peso.</span></p>';
  }

  steps[0].render = function () {
    const phone = formatPhone(data.phone || '9');
    const ageOptions = Array.from({ length: 73 }, function (_, i) {
      const age = i + 18;
      return '<option value="' + age + '" ' + (data.age == age ? 'selected' : '') + '>' + age + '</option>';
    }).join('');
    const heightOptions = Array.from({ length: 56 }, function (_, i) {
      const height = i + 145;
      return '<option value="' + height + '" ' + (data.height == height ? 'selected' : '') + '>' + height + '</option>';
    }).join('');
    const weight = Number(data.weight || 60);
    data.weight = weight;
    const scaleTicks = weightTicksHTML(weight);
    return '<div class="field-grid">' +
      '<div class="field full"><label for="name">Nombre completo</label><input id="name" autocomplete="name" placeholder="Escribe tu nombre" value="' + (data.name || '') + '"></div>' +
      '<div class="field"><label for="phone">Teléfono</label><input id="phone" type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="11" placeholder="9## ### ###" value="' + phone + '"></div>' +
      '<div class="field"><label for="age">Edad</label><select id="age"><option value="">Selecciona</option>' + ageOptions + '</select></div>' +
      '<div class="field"><label>Sexo</label><div class="sex-options" role="group" aria-label="Selecciona tu sexo">' +
        sexButton('Mujer', 'F') + sexButton('Hombre', 'M') + '</div></div>' +
      '<div class="field"><label for="height">Altura (cm)</label><select id="height"><option value="">Selecciona</option>' + heightOptions + '</select></div>' +
      '<div class="field full"><label for="weightScale">Peso actual</label><div class="weight-control"><div class="weight-readout"><span id="weightReadout">' + weight + '</span><small>kg</small></div>' +
        '<div class="weight-scale" id="weightScale" role="slider" tabindex="0" aria-label="Elige tu peso en kilogramos" aria-valuemin="40" aria-valuemax="200" aria-valuenow="' + weight + '" aria-valuetext="' + weight + ' kilogramos" style="--weight-needle:' + scaleTicks.needle + '%"><div class="weight-tape" id="weightTape">' + scaleTicks.html + '</div></div>' +
        weightGuideHTML() + '</div></div>' +
      '<label class="prefilter-check field full"><input id="prefilterAccepted" type="checkbox" ' + (data.prefilterAccepted ? 'checked' : '') + '><span>Entiendo que estos datos son un prefiltro informativo y no un diagnóstico; los revisaré con el especialista.</span></label>' +
    '</div>';
  };

  steps[6].render = function () {
    const isPregnancyPath = isPregnantProfile(data);
    const profileRows = [
      ['Edad', data.age ? data.age + ' años' : '—'], ['Sexo', data.sex || '—'],
      ['Altura', data.height ? data.height + ' cm' : '—'], ['Peso actual', data.weight ? data.weight + ' kg' : '—'],
    ];
    if (!isPregnancyPath) profileRows.push(['IMC orientativo', calcBMI() ? calcBMI().toFixed(1) : '—']);
    profileRows.push(['Objetivo', displayGoal(data.goal) || '—'],
      ['Actividad', data.activity || '—'], ['Frecuencia de entrenamiento', data.days !== undefined ? data.days + ' día(s) por semana' : '—'],
      ['Duración por sesión', data.duration || '—'], ['Agua al día', data.water || '—'],
      ['Sueño', data.sleep || '—'], ['Comidas al día', data.meals || '—'],
      ['Frutas', data.fruitFrequency || '—'], ['Verduras', data.vegetableFrequency || '—'],
      ['Pescado', data.fishFrequency || '—'], ['Carne, pollo o huevos', data.animalProteinFrequency || '—'],
      ['Menestras', data.legumeFrequency || '—'], ['Productos salados o procesados', data.processedFoodsFrequency || '—'],
      ['Calificación', data.rating ? data.rating + ' de 5 estrellas' : '—']);
    if (!isPregnancyPath) profileRows.push(
      ['Antecedentes', listAnswer(data.historyTags, data.historyOther)],
      ['Alergias', listAnswer(data.allergyTags, data.allergyOther)],
      ['Suplementos actuales', data.supplementStatus === 'No' ? 'No' : listAnswer(data.supplementTags, data.supplementOther)],
      ['Medicamentos', data.medicationStatus === 'No' ? 'No' : data.medicationDetails || '—'],
      ['Comentario de salud', data.commentStatus === 'Sí' ? data.commentDetails || '—' : 'Omitido']);
    if (window.GorillaFinalScreenUtils && window.GorillaFinalScreenUtils.showPregnancyQuestion(data)) {
      profileRows.splice(2, 0, ['Embarazo actual', data.pregnancyStatus || '—']);
    }
    return '<div class="summary-list">' + profileRows.map(function (row) {
      return '<div class="summary-row"><span>' + escapeHTML(row[0]) + '</span><b>' + escapeHTML(String(row[1])) + '</b></div>';
    }).join('') + '</div>' +
      '<div class="orientation-box' + (isPregnancyPath ? ' pregnancy-alert' : '') + '"><h3>' + (isPregnancyPath ? 'Atención personalizada' : 'Orientación preliminar para tu evaluación') + '</h3><ul>' + orientationTopics().map(function (topic) {
        return '<li>' + escapeHTML(topic) + '</li>';
      }).join('') + '</ul></div>' +
      '<div class="note">' + (isPregnancyPath ? 'Indicaste que estás embarazada. Este prefiltro general termina aquí; coordina una evaluación personalizada con un profesional antes de considerar suplementos.' : 'Esta orientación no diagnostica ni confirma carencias. Las respuestas sobre alimentos no bastan para determinar si necesitas creatina, glutamina, omega‑3 u otro suplemento. La decisión requiere una evaluación profesional presencial y, si corresponde, pruebas clínicas. Coordina tu cita con Gorilla Labs por WhatsApp al <strong>986‑663‑258</strong>.') + '</div>' +
      '<div class="rating-box"><h3>¿Cómo fue tu experiencia?</h3><div class="rating-stars" role="radiogroup" aria-label="Califica tu experiencia del 1 al 5">' +
        [1,2,3,4,5].map(function (n) { return '<button type="button" class="rating-star ' + (Number(data.rating) >= n ? 'selected' : '') + '" data-rating="' + n + '" aria-label="' + n + ' estrellas" aria-pressed="' + (Number(data.rating) === n) + '">★</button>'; }).join('') +
        '</div><p class="rating-hint">Selecciona de 1 a 5 estrellas. El comentario es opcional.</p><div class="field detail-field"><label for="ratingComment">Comentario opcional</label><textarea id="ratingComment" placeholder="Si quieres, cuéntanos cómo fue">' + escapeHTML(data.ratingComment || '') + '</textarea></div></div>' +
      '<label class="consent"><input type="checkbox" id="consent" ' + (data.consent ? 'checked' : '') + '><span>Autorizo a Gorilla Labs a guardar estos datos para gestionar mi perfil inicial y compartirlos con el profesional que realizará mi evaluación.</span></label>' +
      '<div class="note">' + (isPregnancyPath ? 'La estatura y el peso son datos declarados. Este prefiltro no calcula estimaciones corporales durante el embarazo.' : 'Rango general por estatura: ' + referenceWeightRange() + '. Es una referencia estadística, no un peso ideal individual.') + '</div>';
  };

  const originalSync = baseSync;
  sync = function () {
    originalSync();
    const ratingComment = value('ratingComment');
    if (ratingComment !== undefined) data.ratingComment = ratingComment;
    const consent = document.querySelector('#consent');
    if (consent) data.consent = consent.checked;
    updateModel();
  };

  valid = function () {
    if (step === 0) {
      const digits = String(data.phone || '').replace(/\D/g, '');
      return Boolean(data.name && /^9\d{8}$/.test(digits) && data.age && data.sex &&
        Number(data.height) >= 145 && Number(data.height) <= 200 && Number(data.weight) >= 40 &&
        Number(data.weight) <= 200 && data.weightTouched && data.prefilterAccepted);
    }
    if (steps[step] && steps[step].id === 'food') {
      return ['fruitFrequency','vegetableFrequency','fishFrequency','animalProteinFrequency','legumeFrequency','processedFoodsFrequency'].every(function (key) { return Boolean(data[key]); });
    }
    if (steps[step] && steps[step].id === 'professional') {
      if (window.GorillaFinalScreenUtils && window.GorillaFinalScreenUtils.showPregnancyQuestion(data)) {
        if (!data.pregnancyStatus) return false;
        if (window.GorillaFinalScreenUtils.isPregnant(data)) return true;
      }
      return validProfessionalInfo();
    }
    if (steps[step] && steps[step].id === 'summary') return Boolean(data.consent && data.rating);
    return baseValid();
  };

  updateModel = function () {
    const h = Number(data.height), w = Number(data.weight);
    const firstStep = step === 0;
    const mobileLayout = window.matchMedia('(max-width:760px)').matches;
    const pregnancyPath = isPregnantProfile(data);
    const bmi = !pregnancyPath && h && w ? w / ((h / 100) ** 2) : 0;
    const days = Number(data.days || 0);
    const training = data.activity === 'Gimnasio' || data.activity === 'Otro deporte' || data.activity === 'Ejercicio';
    const active = data.activityLevel === 'Alto' || data.activityLevel === 'Activo' || (training && days >= 3);
    if (firstStep) targetViewSelected = false;
    const currentShape = pregnancyPath ? 1 : bodyShapeValue(bmi, active);
    let targetShape = currentShape;
    if (isMuscleGoal(data.goal)) targetShape = bmi >= 28 ? 1.85 : 2;
    if (isDefinitionGoal(data.goal)) targetShape = bmi && bmi < 19 ? .25 : 1;
    const bodyCard = document.querySelector('.body-card');
    if (bodyCard) bodyCard.classList.toggle('is-first-step', firstStep);
    if (bodyCard) {
      const heading = bodyCard.querySelector('h2');
      const description = Array.from(bodyCard.querySelectorAll('p')).find(function (p) { return !p.classList.contains('eyebrow'); });
      if (heading) heading.textContent = firstStep ? 'Conoce tu punto de partida' : pregnancyPath ? 'Atención personalizada' : (isEnduranceGoal(data.goal) || isPerformanceGoal(data.goal)) ? 'Tu referencia corporal' : 'Hoy y tu meta visual';
      if (description) description.textContent = firstStep ? 'Primero registramos tus datos. La silueta cambia a una referencia según el sexo y las medidas que elijas.' : pregnancyPath ? 'En este caso no mostramos una meta visual. Un profesional podrá orientar el seguimiento de forma personalizada.' : (isEnduranceGoal(data.goal) || isPerformanceGoal(data.goal)) ? 'La figura ilustra tu complexión actual; resistencia y rendimiento no predicen cambios corporales.' : 'Alterna entre tu punto actual y una meta visual ligada al objetivo. Es ilustrativa, no predice un resultado.';
    }
    const model = document.querySelector('.model');
    if (model) {
      if (firstStep) {
        if (!model.querySelector('#bodyVisual')) model.innerHTML = '<div class="body-visual is-neutral" id="bodyVisual" role="img" aria-label="Silueta neutra de referencia"></div>';
        const visual = model.querySelector('#bodyVisual');
        const figureHeight = h ? Math.round((mobileLayout ? 290 : 365) + ((Math.max(145, Math.min(200, h)) - 145) / 55) * (mobileLayout ? 32 : 40)) : (mobileLayout ? 340 : 420);
        visual.style.height = figureHeight + 'px';
        visual.style.backgroundImage = 'none';
        if (data.sex) {
          visual.classList.remove('is-neutral');
          visual.classList.remove('is-placeholder');
          setFigure(visual, data.sex, currentShape, figureHeight, 'Silueta inicial');
          visual.setAttribute('aria-label', 'Silueta ' + data.sex.toLowerCase() + ' ajustada según altura y peso');
        } else {
          visual.classList.add('is-neutral');
          visual.style.width = Math.round(figureHeight * .395) + 'px';
          visual.style.backgroundImage = 'none';
          visual.innerHTML = makeSilhouetteSVG('Neutral', 1, 'Silueta neutra');
          visual.setAttribute('aria-label', 'Silueta neutra de referencia');
        }
      } else {
        if (!model.querySelector('#currentBodyVisual')) {
          model.innerHTML = '<div class="body-comparison">' +
            '<div class="body-option" id="currentBodyOption"><span class="body-tag">TU ESTADO ACTUAL</span><div class="body-stage"><div class="body-visual" id="currentBodyVisual" role="img"></div></div><p class="body-meta" id="currentBodyMeta"></p></div>' +
            '<div class="body-option" id="targetBodyOption" hidden><span class="body-tag" id="targetBodyTag">META VISUAL</span><div class="body-stage"><div class="body-visual" id="targetBodyVisual" role="img"></div></div><p class="body-meta" id="targetBodyMeta"></p></div>' +
          '</div>';
        }
        const currentVisual = model.querySelector('#currentBodyVisual');
        const targetVisual = model.querySelector('#targetBodyVisual');
        const visualHeight = h ? Math.round((mobileLayout ? 240 : 300) + ((Math.max(145, Math.min(200, h)) - 145) / 55) * (mobileLayout ? 35 : 45)) : (mobileLayout ? 275 : 345);
        const currentSex = data.sex === 'Mujer' ? 'Mujer' : 'Hombre';
        setFigure(currentVisual, currentSex, currentShape, visualHeight, 'Referencia de hoy');
        setFigure(targetVisual, currentSex, pregnancyPath ? currentShape : targetShape, visualHeight, pregnancyPath ? 'Referencia actual' : 'Meta visual referencial');
        const tag = model.querySelector('#targetBodyTag');
        const currentOption = model.querySelector('#currentBodyOption');
        const targetOption = model.querySelector('#targetBodyOption');
        const currentMeta = model.querySelector('#currentBodyMeta');
        const targetMeta = model.querySelector('#targetBodyMeta');
        const targetDate = proposedReviewDate();
        const route = internalRoute(bmi);
        if (tag) tag.textContent = pregnancyPath ? 'REFERENCIA ACTUAL' : data.goal ? (route.indexOf('Revisar el objetivo') === 0 ? 'OBJETIVO A REVISAR' : (isEnduranceGoal(data.goal) || isPerformanceGoal(data.goal)) ? 'REFERENCIA CORPORAL' : 'META VISUAL') : 'ELIGE TU OBJETIVO';
        if (currentMeta) currentMeta.textContent = h && w ? h + ' cm · ' + w + ' kg' : 'Completa altura y peso';
        if (targetMeta) targetMeta.textContent = pregnancyPath ? 'No se proyecta una meta corporal en este prefiltro' : !data.goal ? 'Elige un objetivo para continuar' : (isEnduranceGoal(data.goal) || isPerformanceGoal(data.goal)) ? 'No predice cambios de composición corporal' : 'Revisión sugerida: ' + targetDate;
        if (currentOption) currentOption.hidden = targetViewSelected && !pregnancyPath;
        if (targetOption) targetOption.hidden = pregnancyPath || !targetViewSelected;
        const visualToggle = document.querySelector('#toggleTargetView');
        if (visualToggle) {
          visualToggle.disabled = !data.goal || pregnancyPath;
          visualToggle.textContent = pregnancyPath ? 'Evaluación personalizada requerida' : targetViewSelected ? 'Volver a mi estado actual' : !data.goal ? 'Elige un objetivo primero' : (isEnduranceGoal(data.goal) || isPerformanceGoal(data.goal)) ? 'Ver mi referencia corporal' : 'Ver mi meta visual';
          visualToggle.setAttribute('aria-pressed', String(targetViewSelected));
        }
        const visualQuestion = document.querySelector('.visual-question');
        if (visualQuestion) visualQuestion.textContent = pregnancyPath ? 'Tu seguimiento requiere orientación personalizada.' : (isEnduranceGoal(data.goal) || isPerformanceGoal(data.goal)) ? '¿Quieres ver una referencia de tu complexión?' : '¿Quieres ver cómo podrías verte?';
      }
    }
    const heightStat = document.querySelector('#heightStat');
    const weightStat = document.querySelector('#weightStat');
    const bmiStat = document.querySelector('#bmiStat');
    if (heightStat) heightStat.textContent = !firstStep && h ? h + ' cm' : '—';
    if (weightStat) weightStat.textContent = !firstStep && w ? w + ' kg' : '—';
    if (bmiStat) bmiStat.textContent = pregnancyPath ? '—' : !firstStep && bmi ? bmi.toFixed(1) : '—';
    const caption = document.querySelector('#caption');
    if (caption) caption.textContent = firstStep ? (data.sex ? 'Tu silueta se ajusta como referencia con la altura y el peso que eliges.' : 'Elige mujer u hombre para adaptar la silueta; la altura y el peso ajustan su forma.') : pregnancyPath ? 'La visualización representa únicamente tu punto actual; no proyecta una meta.' :
      (bmi ? (targetViewSelected ? 'Esta referencia ilustra una posible meta; no predice un resultado.' : 'Este es tu punto de partida. Puedes alternar a una referencia visual según tu objetivo.') : 'Completa altura y peso para ver una referencia visual.');
  };

  function setFigure(element, sex, category, height, label) {
    if (!element) return;
    element.style.height = height + 'px';
    const shape = Math.max(0, Math.min(3, Number(category) || 0));
    const frame = Math.round(shape);
    const female = sex === 'Mujer';
    element.style.width = Math.round(height * .375) + 'px';
    const spriteURL = window.GORILLA_BODY_SPRITE_DATA || 'assets/body-reference-sprite.png';
    element.style.backgroundImage = 'url("' + spriteURL + '")';
    element.style.backgroundSize = '400% 200%';
    element.style.backgroundPosition = 'center';
    element.style.backgroundPosition = (frame * (100 / 3)) + '% ' + (female ? '100%' : '0%');
    element.style.backgroundRepeat = 'no-repeat';
    element.style.mixBlendMode = 'normal';
    element.style.filter = 'none';
    element.classList.add('is-photographic');
    element.innerHTML = '';
    element.dataset.sex = female ? 'female' : 'male';
    element.dataset.bodyFrame = String(frame);
    element.setAttribute('aria-label', label + ' · silueta ' + sex.toLowerCase());
  }

  let bodySpritePromise;
  function bodySpriteFrame(sex, category) {
    if (!bodySpritePromise) bodySpritePromise = new Promise(function (resolve, reject) {
      const image = new Image();
      image.onload = function () { resolve(image); };
      image.onerror = reject;
      image.src = window.GORILLA_BODY_SPRITE_DATA || 'assets/body-reference-sprite.png';
    });
    return bodySpritePromise.then(function (image) {
      const frame = Math.max(0, Math.min(3, Math.round(Number(category) || 0)));
      const sourceWidth = image.naturalWidth / 4, sourceHeight = image.naturalHeight / 2;
      const output = document.createElement('canvas');
      output.width = Math.round(sourceWidth * 2);
      output.height = Math.round(sourceHeight * 2);
      const context = output.getContext('2d');
      context.drawImage(image, frame * sourceWidth, (sex === 'Mujer' ? sourceHeight : 0), sourceWidth, sourceHeight, 0, 0, output.width, output.height);
      return output;
    });
  }

  function makeSilhouetteSVG(sex, category, label) {
    const female = sex === 'Mujer';
    const neutral = sex === 'Neutral';
    const col = Math.max(0, Math.min(3, Number(category) || 0));
    const interpolate = function (values) {
      const low = Math.floor(col), high = Math.min(3, Math.ceil(col)), blend = col - low;
      return values[low] + (values[high] - values[low]) * blend;
    };
    const shoulder = interpolate(neutral ? [96,114,125,130] : female ? [90,108,119,125] : [98,116,128,130]);
    const waist = interpolate(neutral ? [62,78,92,118] : female ? [60,76,90,118] : [60,78,90,118]);
    const hips = interpolate(neutral ? [66,85,100,122] : female ? [76,95,112,128] : [64,82,100,120]);
    const arm = interpolate(neutral ? [14,19,23,29] : female ? [13,18,23,29] : [14,19,24,29]);
    const thigh = interpolate(neutral ? [30,42,54,64] : female ? [32,44,56,66] : [30,42,54,64]);
    const calf = interpolate(neutral ? [16,22,27,34] : female ? [17,22,28,34] : [16,22,27,34]);
    const neck = female ? 30 : neutral ? 32 : 34;
    const lShoulder = 150 - shoulder;
    const outer = Math.max(8, lShoulder - arm);
    const arms = 'M ' + (lShoulder + 12) + ' 163 C ' + (lShoulder - 2) + ' 177 ' + (outer + 5) + ' 212 ' + (outer + 2) + ' 255 C ' + (outer - 1) + ' 300 ' + (outer - 5) + ' 352 ' + (outer - 4) + ' 393 L ' + (outer - 2) + ' 433 C ' + (outer - 1) + ' 449 ' + (outer + 6) + ' 455 ' + (outer + 15) + ' 451 L ' + (outer + 19) + ' 435 L ' + (outer + 16) + ' 398 C ' + (outer + 20) + ' 348 ' + (outer + arm - 1) + ' 300 ' + (outer + arm + 1) + ' 255 C ' + (outer + arm + 3) + ' 216 ' + (lShoulder + 29) + ' 186 ' + (lShoulder + 27) + ' 176 Z';
    const torso = 'M ' + (150 - shoulder + 10) + ' 163 C ' + (150 - shoulder - 4) + ' 174 ' + (150 - shoulder - 8) + ' 202 ' + (150 - shoulder + 1) + ' 231 C ' + (150 - waist - 4) + ' 258 ' + (150 - waist) + ' 290 ' + (150 - waist + 2) + ' 322 C ' + (150 - waist + 2) + ' 351 ' + (150 - hips + 6) + ' 393 ' + (150 - hips + 12) + ' 425 C ' + (150 - hips + 21) + ' 447 ' + (150 - 30) + ' 454 ' + (150 - 12) + ' 455 L ' + (150 + 12) + ' 455 C ' + (150 + 30) + ' 454 ' + (150 + hips - 21) + ' 447 ' + (150 + hips - 12) + ' 425 C ' + (150 + hips - 6) + ' 393 ' + (150 + waist - 2) + ' 351 ' + (150 + waist - 2) + ' 322 C ' + (150 + waist) + ' 290 ' + (150 + waist + 4) + ' 258 ' + (150 + shoulder - 1) + ' 231 C ' + (150 + shoulder + 8) + ' 202 ' + (150 + shoulder + 4) + ' 174 ' + (150 + shoulder - 10) + ' 163 Z';
    const legCenter = 122, thighHalf = thigh / 2, calfHalf = calf / 2;
    const leg = 'M ' + (legCenter - thighHalf - 8) + ' 421 C ' + (legCenter - thighHalf - 11) + ' 460 ' + (legCenter - thighHalf - 8) + ' 500 ' + (legCenter - thighHalf - 2) + ' 535 C ' + (legCenter - thighHalf + 3) + ' 566 ' + (legCenter - calfHalf - 4) + ' 598 ' + (legCenter - calfHalf - 4) + ' 630 C ' + (legCenter - calfHalf - 4) + ' 666 ' + (legCenter - 8) + ' 698 ' + (legCenter - 6) + ' 720 Q ' + (legCenter - 2) + ' 739 ' + (legCenter + 16) + ' 744 L ' + (legCenter + 30) + ' 739 Q ' + (legCenter + 39) + ' 735 ' + (legCenter + 28) + ' 725 L ' + (legCenter + calfHalf + 8) + ' 708 C ' + (legCenter + calfHalf + 7) + ' 674 ' + (legCenter + calfHalf + 13) + ' 641 ' + (legCenter + calfHalf + 12) + ' 608 C ' + (legCenter + thighHalf + 7) + ' 577 ' + (legCenter + thighHalf + 12) + ' 545 ' + (legCenter + thighHalf + 10) + ' 518 C ' + (legCenter + thighHalf + 7) + ' 482 ' + (legCenter + 18) + ' 450 ' + (legCenter + 18) + ' 421 Z';
    const fill = neutral ? '#7027b5' : '#7027b5';
    const hair = female ? '<path d="M137 55 C124 42 108 48 107 65 C106 81 94 90 101 106 C91 122 97 138 83 153 C101 148 109 137 117 123 C111 141 115 153 129 160 C119 144 131 121 140 105 Z"/>' : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 760" preserveAspectRatio="xMidYMid meet" role="img" aria-label="' + label + '"><title>' + label + '</title><g fill="' + fill + '">' + hair + '<path d="' + arms + '"/><path d="' + arms + '" transform="translate(300 0) scale(-1 1)"/><path d="' + leg + '"/><path d="' + leg + '" transform="translate(300 0) scale(-1 1)"/><path d="' + torso + '"/><rect x="' + (150 - neck/2) + '" y="112" width="' + neck + '" height="57" rx="9"/><circle cx="150" cy="75" r="' + (female ? 33 : 35) + '"/><ellipse cx="' + (150-(female?35:36)) + '" cy="82" rx="5" ry="10"/><ellipse cx="' + (150+(female?35:36)) + '" cy="82" rx="5" ry="10"/></g></svg>';
  }

  function bodyShapeValue(bmi, active) {
    if (!bmi) return 1;
    if (bmi < 18.5) return 0;
    if (bmi >= 28) return active ? 2 : 3;
    if (active || bmi >= 25) return 2;
    return 1;
  }

  function proposedReviewDate(reviewISO) {
    const date = reviewISO ? new Date(String(reviewISO).slice(0, 10) + 'T12:00:00') : new Date();
    if (!reviewISO) date.setDate(date.getDate() + 90);
    return new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  }

  function internalRoute(bmi, profile) {
    const record = profile || data;
    if (isPregnantProfile(record)) return 'Atención personalizada: prefiltro general finalizado; revisar con profesional.';
    if (isMuscleGoal(record.goal) && bmi >= 28) return 'Ruta interna: evaluar primero definición y composición corporal; después valorar ganancia muscular con especialista.';
    if (isMuscleGoal(record.goal) && bmi > 0 && bmi < 19) return 'Evaluar una ruta de ganancia muscular con especialista';
    if (isMuscleGoal(record.goal)) return 'Evaluar ganancia muscular con especialista';
    if (isDefinitionGoal(record.goal) && bmi > 0 && bmi < 19) return 'Revisar el objetivo de definición con especialista antes de sugerir cambios de peso.';
    if (isDefinitionGoal(record.goal)) return 'Evaluar una ruta de definición con especialista';
    if (isEnduranceGoal(record.goal)) return 'Evaluar una ruta progresiva de resistencia con especialista';
    if (isPerformanceGoal(record.goal)) return 'Evaluar una estrategia de rendimiento deportivo con especialista';
    return 'Pendiente de objetivo';
  }

  function isMuscleGoal(goal) { return goal === 'Aumento de masa muscular' || goal === 'Aumentar masa muscular'; }
  function isDefinitionGoal(goal) { return goal === 'Definición' || goal === 'Oxidar grasa' || goal === 'Reducir grasa corporal'; }
  function isEnduranceGoal(goal) { return goal === 'Mejorar resistencia' || goal === 'Aumentar resistencia' || goal === 'Mejorar resistencia física'; }
  function isPerformanceGoal(goal) { return goal === 'Mejorar el rendimiento deportivo' || goal === 'Mejorar rendimiento deportivo' || goal === 'Rendimiento deportivo'; }
  function displayGoal(goal) { return isMuscleGoal(goal) ? 'Aumentar masa muscular' : isDefinitionGoal(goal) ? 'Reducir grasa corporal' : isEnduranceGoal(goal) ? 'Mejorar resistencia física' : isPerformanceGoal(goal) ? 'Mejorar el rendimiento deportivo' : (goal || ''); }

  function describeShape(bmi, activityLevel, goal, future) {
    if (future) {
      if (isMuscleGoal(goal)) return 'silueta con mayor desarrollo muscular como meta visual';
      if (isDefinitionGoal(goal)) return bmi > 0 && bmi < 19 ? 'silueta actual, objetivo a revisar' : 'silueta natural de definición, sin marcar musculatura';
      if (isEnduranceGoal(goal) || isPerformanceGoal(goal)) return 'referencia corporal; el objetivo se centra en rendimiento, no predice cambios de composición corporal';
      return 'elige un objetivo para ver una referencia';
    }
    if (bmi > 0 && bmi < 19) return 'silueta delgada de referencia';
    if (bmi >= 28) return activityLevel === 'Alto' || activityLevel === 'Activo' ? 'silueta robusta con actividad reportada' : 'silueta de mayor volumen';
    if (activityLevel === 'Alto' || activityLevel === 'Activo' || data.activity === 'Gimnasio') return 'silueta activa';
    return 'silueta de complexión intermedia';
  }

  let lastRenderedStep = 0;
  let pendingStepScrollFrame = 0;

  function scrollToStepStart() {
    if (pendingStepScrollFrame) window.cancelAnimationFrame(pendingStepScrollFrame);
    pendingStepScrollFrame = window.requestAnimationFrame(function () {
      pendingStepScrollFrame = 0;
      const card = document.querySelector('#formCard');
      if (!card) return;
      const topbar = document.querySelector('.topbar');
      const headerBottom = topbar ? Math.max(0, topbar.getBoundingClientRect().bottom) : 0;
      const cardTop = card.getBoundingClientRect().top + window.scrollY;
      const targetTop = Math.max(0, cardTop - headerBottom - 14);
      if (Math.abs(targetTop - window.scrollY) < 4) return;
      const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: targetTop, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  render = function () {
    const previousStep = lastRenderedStep;
    baseRender();
    const topbarBrand=document.querySelector('.topbar .brand'); if(topbarBrand) topbarBrand.remove();
    if (step === 0) bindFirstStep();
    if (steps[step] && steps[step].id === 'food') bindFoodStep();
    if (steps[step] && steps[step].id === 'summary') bindSummaryStep();
    updateModel();
    bindVisualToggle();
    if (step !== previousStep) scrollToStepStart();
    if (step > previousStep && step <= steps.length - 1) toast(stepDoneMessage(previousStep));
    lastRenderedStep = step;
  };

  function bindVisualToggle() {
    const button = document.querySelector('#toggleTargetView');
    if (!button || button.dataset.bound) return;
    button.dataset.bound = 'true';
    button.addEventListener('click', function () {
      if (!data.goal) return;
      targetViewSelected = !targetViewSelected;
      updateModel();
    });
  }

  window.addEventListener('resize', updateModel);

  function stepDoneMessage(completedStep) {
    const messages = [
      '¡Buen comienzo! Ya registraste tu punto de partida.',
      '¡Objetivo elegido! Cada cambio empieza con una decisión.',
      '¡Buen avance! Ya conocemos tu actividad actual.',
      'Tus hábitos ya están registrados. Un paso a la vez.',
      'Gracias por completar el perfil de alimentación.',
      'Información lista para conversar con el especialista.'
    ];
    return messages[completedStep] || '¡Un paso más completado!';
  }

  save = async function () {
    preparedSummaryBlob = null;
    preparedSummaryPngBlob = null;
    data.createdAt = new Date().toLocaleString('es-PE');
    const today = new Date();
    data.createdISO = today.toISOString().slice(0, 10);
    const review = new Date(today); review.setDate(review.getDate() + 90);
    data.reviewISO = review.toISOString().slice(0, 10);
    data.internalRoute = internalRoute(calcBMI());
    if (!data.submissionId) data.submissionId = window.crypto && crypto.randomUUID ? crypto.randomUUID() : fallbackSubmissionId();
    const nextButton = document.querySelector('#next');
    if (nextButton) { nextButton.disabled = true; nextButton.textContent = 'Enviando…'; }
    let submission;
    try {
      if (!window.GorillaCloud || !window.GorillaCloud.isConfigured()) throw new Error('El registro en línea aún no está conectado. Tus datos no se guardaron.');
      submission = await window.GorillaCloud.submitProfile(Object.assign({}, data));
    } catch (error) {
      if (nextButton) { nextButton.disabled = false; nextButton.textContent = 'Guardar perfil'; }
      submission = { ok: false, duplicate: false, notificationSent: false, error: error && error.message ? error.message : 'No se pudo enviar la ficha.' };
    }
    const savedOnline = !!(submission && submission.ok);
    const communityInviteUrl = window.GorillaFinalScreenUtils
      ? window.GorillaFinalScreenUtils.getCommunityInviteUrl(window.GORILLA_COMMUNITY_CONFIG)
      : '';
    const receiptMessage = savedOnline
      ? (submission.duplicate ? 'Esta ficha ya estaba registrada.' : 'Tu perfil quedó registrado para la revisión.')
      : 'No pudimos registrar la ficha en línea. Descárgala y envíasela al asesor para continuar.';
    document.querySelector('#formCard').innerHTML =
      '<div class="success-card"><div class="success-brand"><img src="assets/gorilla-mark-approved.png" alt=""><strong>GORILLA LABS</strong></div>' +
      '<p class="eyebrow">Ficha informativa</p><h1>¡Tu ficha está lista' + (data.name ? ', ' + escapeHTML(data.name.split(' ')[0]) : '') + '!</h1>' +
      (window.GorillaFinalScreenUtils && window.GorillaFinalScreenUtils.isPregnant(data)
        ? '<p class="pregnancy-alert" role="status">Indicaste que estás embarazada. Tu seguimiento debe ser personalizado con un profesional.</p>'
        : '<p>Descárgala y luego envíasela a tu asesor por WhatsApp. La ficha incluye la información que compartiste en el formulario.</p>') +
      (window.GorillaFinalScreenUtils && window.GorillaFinalScreenUtils.isPregnant(data)
        ? '<p>Descarga tu ficha y, si deseas continuar, coordina directamente una evaluación personalizada con Gorilla Labs.</p>'
        : '') +
      '<p class="cloud-receipt" role="status">' + escapeHTML(receiptMessage) + '</p>' +
      '<div class="final-actions">' +
      '<button type="button" class="primary" id="downloadSummary">DESCARGAR MI FICHA</button>' +
      '<button type="button" class="secondary-action download-link" id="downloadSummaryPng" disabled>Descargar también en PNG</button>' +
      '<p class="hint" id="downloadStatus" role="status" aria-live="polite">Estamos preparando tu ficha PDF completa.</p>' +
      '<button type="button" class="secondary-action" id="openWhatsapp" disabled>ENVIAR MI FICHA AL ASESOR</button>' +
      '<p class="hint" id="advisorHelp">Primero inicia la descarga. WhatsApp abrirá un mensaje preparado; adjunta manualmente la ficha PDF o PNG y pulsa enviar.</p>' +
      '<button type="button" class="secondary-action" id="joinCommunity" ' + (communityInviteUrl ? '' : 'disabled') + '>UNIRME A LA COMUNIDAD GORILLA LABS PERÚ</button>' +
      '<p class="hint" id="communityStatus" role="status" aria-live="polite">' + (communityInviteUrl ? 'La invitación oficial de WhatsApp está lista.' : 'La invitación oficial de la comunidad está pendiente de configuración.') + '</p>' +
      '<ul class="community-benefits" aria-label="Beneficios de la comunidad"><li><span class="community-check" aria-hidden="true">✓</span><span>Promociones y descuentos exclusivos.</span></li><li><span class="community-check" aria-hidden="true">✓</span><span>Tips según tu progreso y objetivo.</span></li><li><span class="community-check" aria-hidden="true">✓</span><span>Consejos para mejorar tus hábitos y cumplir tus metas.</span></li></ul>' +
      '</div>' +
      '<button type="button" class="back finish-action" id="finishProfile">Finalizar</button></div>';
    const waButton = document.querySelector('#openWhatsapp');
    const joinButton = document.querySelector('#joinCommunity');
    const downloadState = window.GorillaFinalScreenUtils.createDownloadState();
    waButton.addEventListener('click', function () {
      if (downloadState.canSendToAdvisor()) window.open(whatsappUrl(), '_blank', 'noopener,noreferrer');
    });
    joinButton.addEventListener('click', function () {
      if (communityInviteUrl) window.open(communityInviteUrl, '_blank', 'noopener,noreferrer');
    });
    const downloadButton = document.querySelector('#downloadSummary');
    const downloadPngButton = document.querySelector('#downloadSummaryPng');
    downloadButton.addEventListener('click', function () {
      if (!preparedSummaryBlob) {
        prepareSummaryDownload(downloadButton, downloadState);
        return;
      }
      try {
        startSummaryDownload(preparedSummaryBlob);
        downloadState.markDownloadStarted();
        waButton.disabled = false;
        document.querySelector('#downloadStatus').textContent = 'La descarga se inició. Revisa Descargas para confirmar que el archivo quedó disponible.';
        document.querySelector('#advisorHelp').textContent = 'En WhatsApp se abrirá un mensaje preparado. Adjunta manualmente la ficha PDF o PNG y pulsa enviar.';
      } catch (_) {
        document.querySelector('#downloadStatus').textContent = 'No se pudo iniciar la descarga. Vuelve a pulsar «Descargar mi ficha» para intentarlo otra vez.';
      }
    });
    downloadPngButton.addEventListener('click', function () {
      if (!preparedSummaryPngBlob) return;
      try {
        triggerBlobDownload(preparedSummaryPngBlob, summaryFilename('png'));
        document.querySelector('#downloadStatus').textContent = 'La descarga PNG se inició. Revisa Descargas para confirmar que el archivo quedó disponible.';
      } catch (_) {
        document.querySelector('#downloadStatus').textContent = 'No se pudo iniciar la descarga PNG. Inténtalo de nuevo.';
      }
    });
    prepareSummaryDownload(downloadButton, downloadState);
    document.querySelector('#finishProfile').addEventListener('click', function () {
      step = 0;
      Object.keys(data).forEach(function (key) { delete data[key]; });
      preparedSummaryBlob = null;
      preparedSummaryPngBlob = null;
      if (summaryDownloadUrl) { URL.revokeObjectURL(summaryDownloadUrl); summaryDownloadUrl = null; }
      lastRenderedStep = 0;
      document.querySelector('#app').classList.add('hidden');
      const welcome = document.querySelector('#welcome');
      welcome.classList.remove('hidden');
      requestAnimationFrame(function () { welcome.classList.add('visible'); });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    updateModel();
    scrollToStepStart();
  };

  function fallbackSubmissionId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 3 | 8)).toString(16);
    });
  }

  exportCSV = function () {
    const rows = remoteProfiles;
    if (!rows.length) return;
    const files = [
      { name: '[Content_Types].xml', content: contentTypesXML(rows.length) },
      { name: '_rels/.rels', content: rootRelationshipsXML() },
      { name: 'xl/workbook.xml', content: workbookXML(rows.length) },
      { name: 'xl/_rels/workbook.xml.rels', content: workbookRelationshipsXML(rows.length) },
      { name: 'xl/styles.xml', content: workbookStylesXML() }
    ];
    rows.forEach(function (row, index) {
      files.push({ name: 'xl/worksheets/sheet' + (index + 1) + '.xml', content: profileWorksheetXML(row) });
    });
    downloadWorkbook(files, 'Gorilla-Labs-fichas-informativas.xlsx');
  };

  function downloadWorkbook(files, filename) {
    const blob = new Blob([zipStored(files)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    triggerBlobDownload(blob, filename);
  }

  function triggerBlobDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.position = 'fixed';
    link.style.left = '-10000px';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
  }

  function safeFilename(value) {
    return String(value || 'cliente').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'cliente';
  }

  async function downloadProfilePNG(profile, button) {
    if (!profile || !button) return;
    button.disabled = true;
    button.textContent = 'Preparando…';
    try {
      const canvas = await drawSummaryCanvas(profile);
      const blob = await new Promise(function (resolve, reject) {
        if (typeof canvas.toBlob !== 'function') { reject(new Error('El navegador no admite exportación PNG.')); return; }
        canvas.toBlob(function (result) { result ? resolve(result) : reject(new Error('No se pudo generar el archivo PNG.')); }, 'image/png');
      });
      const date = profile.createdISO || new Date().toISOString().slice(0, 10);
      triggerBlobDownload(blob, 'gorilla-labs-ficha-' + safeFilename(profile.name) + '-' + date + '.png');
      button.textContent = 'Descargar PNG';
      button.disabled = false;
    } catch (error) {
      button.textContent = 'Reintentar PNG';
      button.disabled = false;
      toast(error && error.message ? error.message : 'No se pudo preparar la ficha PNG.');
    }
  }

  function downloadExcelTemplate() {
    const template = { createdISO: new Date().toISOString().slice(0, 10), reviewISO: '' };
    const files = [
      { name: '[Content_Types].xml', content: contentTypesXML(1) },
      { name: '_rels/.rels', content: rootRelationshipsXML() },
      { name: 'xl/workbook.xml', content: workbookXML(1) },
      { name: 'xl/_rels/workbook.xml.rels', content: workbookRelationshipsXML(1) },
      { name: 'xl/styles.xml', content: workbookStylesXML() },
      { name: 'xl/worksheets/sheet1.xml', content: profileWorksheetXML(template) }
    ];
    downloadWorkbook(files, 'Gorilla-Labs-plantilla-ficha.xlsx');
  }

  showAdmin = function () {
    const modal = document.querySelector('#admin');
    const box = document.querySelector('#adminBox');
    modal.classList.remove('hidden');
    modal.onclick = function (event) { if (event.target === modal) modal.classList.add('hidden'); };
    if (!window.GorillaCloud || !window.GorillaCloud.isConfigured()) {
      box.innerHTML = '<div class="admin-head"><div><p class="eyebrow">Zona privada</p><h2>Panel administrativo</h2></div><button class="close" id="close" aria-label="Cerrar">×</button></div><p class="hint">El registro central aún no está conectado. No hay inscripciones disponibles para exportar.</p><p class="note">Puedes descargar una plantilla Excel vacía. Al conectar el registro central, aquí estarán las fichas PNG individuales y el Excel de inscripciones. Revisa CONFIGURAR-SERVICIOS.md.</p><div class="share-actions"><button class="primary" id="downloadTemplate" type="button">Descargar plantilla Excel (.xlsx)</button></div>';
      box.querySelector('#close').onclick = function () { modal.classList.add('hidden'); };
      box.querySelector('#downloadTemplate').onclick = downloadExcelTemplate;
      return;
    }
    if (adminEmail) { loadAdminRecords(); return; }
    renderAdminLogin();
  };

  function renderAdminLogin(errorText) {
    const box = document.querySelector('#adminBox');
    box.innerHTML = '<div class="admin-head"><div><p class="eyebrow">Zona privada</p><h2>Acceso administrador</h2></div><button class="close" id="close" aria-label="Cerrar">×</button></div>' +
      '<p class="hint">Inicia sesión con la cuenta autorizada de Gorilla Labs para consultar y descargar el registro central.</p>' +
      '<form class="admin-login" id="adminLoginForm"><div class="field"><label for="adminEmail">Correo</label><input id="adminEmail" type="email" autocomplete="username" required></div><div class="field" style="margin-top:12px"><label for="adminPassword">Contraseña</label><input id="adminPassword" type="password" autocomplete="current-password" required></div>' +
      (errorText ? '<p class="note" role="alert">' + escapeHTML(errorText) + '</p>' : '') + '<button class="primary" id="adminLoginButton" style="margin-top:16px" type="submit">Iniciar sesión</button></form>';
    box.querySelector('#close').onclick = function () { document.querySelector('#admin').classList.add('hidden'); };
    box.querySelector('#adminLoginForm').addEventListener('submit', async function (event) {
      event.preventDefault();
      const button = box.querySelector('#adminLoginButton');
      button.disabled = true; button.textContent = 'Verificando…';
      try {
        const user = await window.GorillaCloud.adminSignIn(box.querySelector('#adminEmail').value.trim(), box.querySelector('#adminPassword').value);
        adminEmail = user && user.email ? user.email : 'Administrador';
        await loadAdminRecords();
      } catch (error) {
        renderAdminLogin(error && error.message ? error.message : 'No se pudo iniciar sesión.');
      }
    });
  }

  async function loadAdminRecords() {
    const box = document.querySelector('#adminBox');
    box.innerHTML = '<div class="admin-head"><div><p class="eyebrow">Zona privada</p><h2>Registro central</h2></div><button class="close" id="close" aria-label="Cerrar">×</button></div><p class="hint">Cargando perfiles…</p>';
    box.querySelector('#close').onclick = function () { document.querySelector('#admin').classList.add('hidden'); };
    try {
      const result = await window.GorillaCloud.adminListProfiles();
      remoteProfiles = (result.profiles || []).map(function (record) {
        return Object.assign({}, record.profile || {}, { createdAt: record.created_at || '', createdISO: (record.created_at || '').slice(0, 10), receiptId: record.id, notificationStatus: record.notification_status });
      });
      const rows = remoteProfiles;
      box.innerHTML = '<div class="admin-head"><div><p class="eyebrow">Zona privada</p><h2>Perfiles registrados</h2></div><button class="close" id="close" aria-label="Cerrar">×</button></div>' +
        '<p class="hint">Sesión: ' + escapeHTML(adminEmail) + ' · Registro central: ' + rows.length + ' perfil(es)</p>' +
        '<div class="share-actions"><button class="primary" id="export" ' + (rows.length ? '' : 'disabled') + '>Descargar fichas Excel (.xlsx)</button>' + (!rows.length ? '<button class="secondary-action" id="downloadTemplate" type="button">Descargar plantilla vacía</button>' : '') + '<button class="secondary-action" id="signOut">Cerrar sesión</button></div>' +
        (rows.length ? '<div style="overflow:auto"><table class="records"><thead><tr><th>Fecha</th><th>Nombre</th><th>Objetivo</th><th>Actividad</th><th>Teléfono</th><th>Aviso</th><th>Ficha PNG</th></tr></thead><tbody>' + rows.map(function (profile, index) {
          return '<tr><td>' + escapeHTML(profile.createdAt || '') + '</td><td>' + escapeHTML(profile.name || '') + '</td><td>' + escapeHTML(profile.goal || '') + '</td><td>' + escapeHTML(profile.activity || '') + '</td><td>' + escapeHTML(profile.phone || '') + '</td><td>' + escapeHTML(profile.notificationStatus || 'pendiente') + '</td><td><button type="button" class="secondary-action record-png" data-profile-png="' + index + '">Descargar PNG</button></td></tr>';
        }).join('') + '</tbody></table></div>' : '<p class="note">Aún no hay inscripciones en el registro central.</p>');
      box.querySelector('#close').onclick = function () { document.querySelector('#admin').classList.add('hidden'); };
      box.querySelector('#signOut').onclick = function () { adminEmail = ''; remoteProfiles = []; window.GorillaCloud.adminSignOut(); renderAdminLogin(); };
      box.querySelector('#export')?.addEventListener('click', exportCSV);
      box.querySelector('#downloadTemplate')?.addEventListener('click', downloadExcelTemplate);
      box.querySelectorAll('[data-profile-png]').forEach(function (button) {
        button.addEventListener('click', function () { downloadProfilePNG(rows[Number(button.dataset.profilePng)], button); });
      });
    } catch (error) {
      if (error && error.status === 401) { adminEmail = ''; renderAdminLogin('La sesión expiró. Inicia sesión otra vez.'); return; }
      box.innerHTML = '<div class="admin-head"><div><p class="eyebrow">Zona privada</p><h2>No se pudo cargar</h2></div><button class="close" id="close" aria-label="Cerrar">×</button></div><p class="note" role="alert">' + escapeHTML(error && error.message ? error.message : 'Revisa la conexión e inténtalo de nuevo.') + '</p><button class="secondary-action" id="retry">Reintentar</button>';
      box.querySelector('#close').onclick = function () { document.querySelector('#admin').classList.add('hidden'); };
      box.querySelector('#retry').onclick = loadAdminRecords;
    }
  }
  const adminButton = document.querySelector('#adminOpen');
  if (adminButton) adminButton.onclick = showAdmin;

  function profileWorksheetXML(profile) {
    const rows = [];
    const pregnancyPath = !!(window.GorillaFinalScreenUtils && window.GorillaFinalScreenUtils.isPregnant(profile));
    const merges = ['A1:E1','A4:E4','B5:E5','A9:E9','A10:E10','A11:E11','A13:E13','A17:E17','A23:E23','A28:E28','A29:E29','A30:E30','A31:E31','A32:E32','A33:E33','A34:E34','A35:E35','A36:E36','A37:E37','A38:E38','A39:E39','A40:E40','A41:E41','A42:E42'];
    function cell(ref, value, style, type) {
      const s = style == null ? 4 : style;
      if (type === 'formula') return '<c r="' + ref + '" s="' + s + '"><f>' + xmlEscape(value) + '</f><v></v></c>';
      if (type === 'number' && value !== '' && value != null) return '<c r="' + ref + '" s="' + s + '"><v>' + Number(value) + '</v></c>';
      return '<c r="' + ref + '" s="' + s + '" t="inlineStr"><is><t xml:space="preserve">' + xmlEscape(value == null ? '' : value) + '</t></is></c>';
    }
    function row(number, cells, height) {
      rows.push('<row r="' + number + '"' + (height ? ' ht="' + height + '" customHeight="1"' : '') + '>' + cells.join('') + '</row>');
    }
    function pairRow(number, leftLabel, leftValue, rightLabel, rightValue, options) {
      const opts = options || {};
      row(number, [cell('A'+number,leftLabel,3),cell('B'+number,leftValue,opts.leftStyle||4,opts.leftType),cell('D'+number,rightLabel,3),cell('E'+number,rightValue,opts.rightStyle||4,opts.rightType)],opts.height||27);
    }
    function section(number, title) { row(number,[cell('A'+number,title,2)],26); }
    function mergedNote(number, text, style) { const height = Math.max(38,Math.ceil(String(text).length/105)*18+10); row(number,[cell('A'+number,text,style||6)],height); }
    const dateNumber = excelDateSerial(profile.createdISO);
    const reviewNumber = excelDateSerial(profile.reviewISO);
    row(1,[cell('A1','GORILLA LABS · DATOS DE INFORMACIÓN',1)],35);
    row(2,[cell('A2','Fecha de ficha',3),cell('B2',dateNumber,7,'number'),cell('D2','Fecha de evaluación',3),cell('E2',profile.evaluationISO ? excelDateSerial(profile.evaluationISO) : '',7,profile.evaluationISO ? 'number' : 'text')],30);
    section(4,'FICHA INFORMATIVA DEL CLIENTE');
    row(5,[cell('A5','Nombre completo',3),cell('B5',profile.name,4)],30);
    pairRow(6,'Teléfono',profile.phone||'','Edad',profile.age ? profile.age + ' años' : '');
    row(7,[cell('A7','Sexo',3),cell('B7',profile.sex||'',4)],27);
    row(8,[cell('A8','Embarazo actual',3),cell('B8',profile.sex === 'Mujer' ? profile.pregnancyStatus || '' : 'No aplica',4)],27);
    section(9,'OBJETIVO PRINCIPAL');
    row(10,[cell('A10',displayGoal(profile.goal)||'Pendiente de selección',5)],34);
    mergedNote(11,goalLegend(profile),'6');
    section(13,'MEDIDAS Y REFERENCIA');
    pairRow(14,'Altura (cm)',profile.height||'','Peso (kg)',profile.weight||'');
    row(15,[cell('A15',pregnancyPath ? 'Seguimiento' : 'IMC orientativo',3),pregnancyPath ? cell('B15','',8) : cell('B15','IFERROR(E14/(B14/100)^2,"")',8,'formula'),cell('D15',pregnancyPath ? 'Evaluación' : 'Lectura',3),cell('E15',pregnancyPath ? 'Requiere atención personalizada.' : 'Solo referencia; no distingue grasa de músculo.',6)],34);
    section(17,'ACTIVIDAD Y HÁBITOS');
    pairRow(18,'Actividad',profile.activity||'','Nivel habitual',profile.activityLevel||'');
    pairRow(19,'Días por semana',profile.days==null?'':profile.days,'Duración',profile.duration||'');
    pairRow(20,'Agua',profile.water||'','Sueño',profile.sleep||'');
    pairRow(21,'Comidas al día',profile.meals||'','Proteína habitual',profile.protein||'');
    section(23,'ALIMENTACIÓN REPORTADA');
    pairRow(24,'Frutas',profile.fruitFrequency||'','Verduras',profile.vegetableFrequency||'');
    pairRow(25,'Pescado',profile.fishFrequency||'','Carne, pollo o huevos',profile.animalProteinFrequency||'',{height:34});
    pairRow(26,'Menestras',profile.legumeFrequency||'','Productos salados/procesados',profile.processedFoodsFrequency||'',{height:34});
    section(28,'INFORMACIÓN PARA EL PROFESIONAL');
    mergedNote(29,'Antecedentes: ' + listAnswer(profile.historyTags,profile.historyOther));
    mergedNote(30,'Alergias: ' + listAnswer(profile.allergyTags,profile.allergyOther));
    mergedNote(31,'Suplementos actuales: ' + (profile.supplementStatus==='No'?'No':listAnswer(profile.supplementTags,profile.supplementOther)));
    mergedNote(32,'Medicamentos: ' + (profile.medicationStatus==='No'?'No':(profile.medicationDetails||'—')));
    mergedNote(33,'Comentario: ' + (profile.commentStatus==='Sí'?(profile.commentDetails||'—'):'Omitido'));
    mergedNote(34,'Ruta interna para revisar con especialista: ' + (profile.internalRoute||'Pendiente'),6);
    section(35,'ORIENTACIÓN PRELIMINAR · PREFILTRO DIDÁCTICO');
    const notes = orientationForRecord(profile);
    mergedNote(36,'• ' + (notes[0]||'Llevar los datos a una consulta con el especialista.'),6);
    mergedNote(37,'• ' + (notes[1]||'No se confirma una deficiencia mediante este formulario.'),6);
    row(38,[cell('A38','REFERENCIA EDUCATIVA GENERAL · NO ES DOSIS PERSONAL',2)],28);
    mergedNote(39,'IMC: se calcula con peso (kg) ÷ estatura (m)². Es un indicador de cribado y no reemplaza una evaluación.',6);
    mergedNote(40,'Creatina: el cuerpo la produce y también se obtiene en alimentos. Esta ficha no calcula gramos por kg ni diagnostica una carencia. La ODS describe protocolos de estudio en adultos con mantenimiento de 3–5 g/día, independiente del sexo o tamaño corporal; es una referencia de estudios, no una dosis personal. Revisar su pertinencia con un profesional.',6);
    mergedNote(41,'Sodio: referencia general de la OMS para adultos: menos de 2,000 mg de sodio al día (menos de 5 g de sal). 1 g de sal equivale aproximadamente a 400 mg de sodio. No es un objetivo individual; condiciones médicas, medicamentos y actividad pueden cambiar la indicación.',6);
    mergedNote(42,'Proteína: esta ficha no calcula gramos personales por kg. La cantidad se estima según alimentación completa, objetivo, entrenamiento y situación clínica, con el profesional.',6);
    const mergesXML = '<mergeCells count="' + merges.length + '">' + merges.map(function (ref) { return '<mergeCell ref="' + ref + '"/>'; }).join('') + '</mergeCells>';
    const widths = '<cols><col min="1" max="1" width="23" customWidth="1"/><col min="2" max="2" width="31" customWidth="1"/><col min="3" max="3" width="3" customWidth="1"/><col min="4" max="4" width="24" customWidth="1"/><col min="5" max="5" width="35" customWidth="1"/></cols>';
    const validations = '<dataValidations count="1"><dataValidation type="date" operator="between" allowBlank="1" sqref="E2"><formula1>1</formula1><formula2>2958465</formula2></dataValidation></dataValidations>';
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><dimension ref="A1:E42"/><sheetViews><sheetView workbookViewId="0"><pane ySplit="3" topLeftCell="A4" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="21"/>' + widths + '<sheetData>' + rows.join('') + '</sheetData>' + mergesXML + validations + '<pageMargins left="0.3" right="0.3" top="0.5" bottom="0.5" header="0.2" footer="0.2"/></worksheet>';
  }

  function goalLegend(profile) {
    if (isMuscleGoal(profile.goal)) return 'Aumentar masa muscular: objetivo elegido por el cliente. Secuencia y estrategia sujetas a evaluación del especialista.';
    if (isDefinitionGoal(profile.goal)) return 'Reducir grasa corporal: objetivo elegido por el cliente. Enfoque referencial en cuidar la masa muscular.';
    if (isEnduranceGoal(profile.goal)) return 'Mejorar resistencia física: objetivo elegido por el cliente. La progresión de actividad se revisará con el especialista.';
    if (isPerformanceGoal(profile.goal)) return 'Mejorar el rendimiento deportivo: objetivo elegido por el cliente. La estrategia se revisará con el especialista.';
    return 'El cliente puede elegir su objetivo en el formulario.';
  }

  function orientationForRecord(profile) {
    if (window.GorillaFinalScreenUtils && window.GorillaFinalScreenUtils.isPregnant(profile)) {
      return ['Indicó embarazo actual: este prefiltro general no realiza recomendaciones de suplementos; coordinar orientación personalizada con un profesional.'];
    }
    const notes = [];
    const rare = function (key) { return profile[key] === 'Rara vez o nunca' || profile[key] === '1–2 veces por semana'; };
    if (rare('fishFrequency')) notes.push('Poco pescado reportado: conversar sobre fuentes alimentarias de omega‑3; no confirma una carencia.');
    if (rare('animalProteinFrequency') && rare('legumeFrequency')) notes.push('Revisar la ingesta total de proteína en consulta; la encuesta no calcula gramos necesarios.');
    if (isMuscleGoal(profile.goal)) notes.push('Valorar plan de fuerza y, si corresponde, pertinencia de creatina. No se calcula dosis por kg.');
    if (isEnduranceGoal(profile.goal)) notes.push('Conversar sobre una progresión de entrenamiento, hidratación y descanso acorde con el deporte y la evaluación profesional.');
    if (isPerformanceGoal(profile.goal)) notes.push('Conversar sobre entrenamiento, descanso y recuperación adecuados para el deporte, según evaluación profesional.');
    if ((profile.processedFoodsFrequency === 'Diario' || profile.processedFoodsFrequency === '3–5 veces por semana') && notes.length < 2) notes.push('Revisar frecuencia de procesados/salados y sodio en etiquetas.');
    if (!notes.length) notes.push('Revisar este perfil y el registro de alimentos en la consulta con el especialista.');
    notes.push('Esta ficha es educativa: no diagnostica deficiencias ni prescribe suplementos o sodio.');
    return notes.slice(0,2);
  }

  function excelDateSerial(isoDate) {
    if (!isoDate) return '';
    const millis = Date.parse(String(isoDate).slice(0,10) + 'T00:00:00Z');
    return Number.isFinite(millis) ? Math.floor(millis / 86400000) + 25569 : '';
  }

  function xmlEscape(value) {
    return String(value == null ? '' : value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
  }

  function contentTypesXML(count) {
    const sheets = Array.from({length:count},function(_,i){return '<Override PartName="/xl/worksheets/sheet'+(i+1)+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';}).join('');
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' + sheets + '</Types>';
  }

  function rootRelationshipsXML() {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
  }

  function workbookXML(count) {
    const sheets = Array.from({length:count},function(_,i){return '<sheet name="Ficha '+String(i+1).padStart(3,'0')+'" sheetId="'+(i+1)+'" r:id="rId'+(i+1)+'"/>';}).join('');
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView/></bookViews><sheets>' + sheets + '</sheets><calcPr calcMode="auto" fullCalcOnLoad="1"/></workbook>';
  }

  function workbookRelationshipsXML(count) {
    const rels = Array.from({length:count},function(_,i){return '<Relationship Id="rId'+(i+1)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'+(i+1)+'.xml"/>';}).join('');
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + rels + '<Relationship Id="rId'+(count+1)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
  }

  function workbookStylesXML() {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="165" formatCode="dd/mm/yyyy"/></numFmts>' +
      '<fonts count="7"><font><sz val="11"/><color rgb="FF27212C"/><name val="Calibri"/></font><font><b/><sz val="16"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FF572484"/><name val="Calibri"/></font><font><b/><sz val="10"/><color rgb="FF4F4656"/><name val="Calibri"/></font><font><sz val="10"/><color rgb="FF302A35"/><name val="Calibri"/></font><font><b/><sz val="16"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font><font><sz val="9"/><color rgb="FF655D6A"/><name val="Calibri"/></font></fonts>' +
      '<fills count="5"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF572484"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF2EAF8"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFFFFF"/><bgColor indexed="64"/></patternFill></fill></fills>' +
      '<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFD8C9E2"/></left><right style="thin"><color rgb="FFD8C9E2"/></right><top style="thin"><color rgb="FFD8C9E2"/></top><bottom style="thin"><color rgb="FFD8C9E2"/></bottom><diagonal/></border></borders>' +
      '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="9"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="3" fillId="4" borderId="1" xfId="0" applyAlignment="1"><alignment horizontal="left" vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="4" fillId="4" borderId="1" xfId="0" applyAlignment="1"><alignment horizontal="left" vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="5" fillId="2" borderId="1" xfId="0" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="6" fillId="3" borderId="1" xfId="0" applyAlignment="1"><alignment horizontal="left" vertical="center" wrapText="1"/></xf><xf numFmtId="165" fontId="4" fillId="4" borderId="1" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
  }

  function zipStored(files) {
    const encoder = new TextEncoder();
    const local = [], central = [];
    let offset = 0;
    files.forEach(function(file) {
      const name = encoder.encode(file.name), content = encoder.encode(file.content), crc = crc32(content);
      const localHeader = new Uint8Array(30 + name.length), lv = new DataView(localHeader.buffer);
      lv.setUint32(0,0x04034b50,true); lv.setUint16(4,20,true); lv.setUint16(6,0,true); lv.setUint16(8,0,true); lv.setUint16(10,0,true); lv.setUint16(12,0,true);
      lv.setUint32(14,crc,true); lv.setUint32(18,content.length,true); lv.setUint32(22,content.length,true); lv.setUint16(26,name.length,true); lv.setUint16(28,0,true); localHeader.set(name,30);
      local.push(localHeader,content);
      const centralHeader = new Uint8Array(46 + name.length), cv = new DataView(centralHeader.buffer);
      cv.setUint32(0,0x02014b50,true); cv.setUint16(4,20,true); cv.setUint16(6,20,true); cv.setUint16(8,0,true); cv.setUint16(10,0,true); cv.setUint16(12,0,true); cv.setUint16(14,0,true);
      cv.setUint32(16,crc,true); cv.setUint32(20,content.length,true); cv.setUint32(24,content.length,true); cv.setUint16(28,name.length,true); cv.setUint16(30,0,true); cv.setUint16(32,0,true); cv.setUint16(34,0,true); cv.setUint16(36,0,true); cv.setUint32(38,0,true); cv.setUint32(42,offset,true); centralHeader.set(name,46);
      central.push(centralHeader); offset += localHeader.length + content.length;
    });
    const centralSize = central.reduce(function(sum,part){return sum+part.length;},0);
    const end = new Uint8Array(22), ev = new DataView(end.buffer);
    ev.setUint32(0,0x06054b50,true); ev.setUint16(4,0,true); ev.setUint16(6,0,true); ev.setUint16(8,files.length,true); ev.setUint16(10,files.length,true); ev.setUint32(12,centralSize,true); ev.setUint32(16,offset,true); ev.setUint16(20,0,true);
    return concatBytes(local.concat(central,[end]));
  }

  function crc32(bytes) {
    let crc = -1;
    for (let i=0;i<bytes.length;i++) { crc ^= bytes[i]; for (let j=0;j<8;j++) crc = (crc >>> 1) ^ (-(crc & 1) & 0xEDB88320); }
    return (crc ^ -1) >>> 0;
  }

  function concatBytes(parts) {
    const length = parts.reduce(function(sum,part){return sum+part.length;},0), out = new Uint8Array(length);
    let offset = 0; parts.forEach(function(part){out.set(part,offset);offset+=part.length;}); return out;
  }

  function colLetter(number) {
    let result = '';
    while (number > 0) { const remainder = (number - 1) % 26; result = String.fromCharCode(65 + remainder) + result; number = Math.floor((number - 1) / 26); }
    return result;
  }

  function bindFirstStep() {
    const prefilterAccepted = document.querySelector('#prefilterAccepted');
    if (prefilterAccepted) {
      prefilterAccepted.addEventListener('change', function () { data.prefilterAccepted = prefilterAccepted.checked; });
    }
    const phone = document.querySelector('#phone');
    if (phone) {
      phone.value = formatPhone(phone.value);
      phone.addEventListener('input', function () {
        const before = phone.value.slice(0, phone.selectionStart).replace(/\D/g, '').length;
        phone.value = formatPhone(phone.value);
        let cursor = 0, seen = 0;
        while (cursor < phone.value.length && seen < before) { if (/\d/.test(phone.value[cursor])) seen++; cursor++; }
        phone.setSelectionRange(cursor, cursor);
        data.phone = phone.value;
      });
    }
    document.querySelectorAll('[data-sex-choice]').forEach(function (button) {
      button.addEventListener('click', function () {
        data.sex = button.dataset.sexChoice;
        if (data.sex !== 'Mujer') data.pregnancyStatus = '';
        document.querySelectorAll('[data-sex-choice]').forEach(function (other) {
          const selected = other.dataset.sexChoice === data.sex;
          other.classList.toggle('selected', selected);
          other.setAttribute('aria-pressed', String(selected));
        });
        updateModel();
      });
    });
    const height = document.querySelector('#height');
    if (height) height.addEventListener('change', function () {
      data.height = height.value;
      updateModel();
    });
    const scale = document.querySelector('#weightScale');
    if (scale) {
      const guide = document.querySelector('#weightGuide');
      const hideGuide = function () {
        if (guide) guide.classList.add('hidden');
        try { localStorage.setItem('gorillaWeightGuideSeen', '1'); } catch (_) {}
      };
      const setWeight = function (nextWeight, touched) {
        const weight = Math.max(40, Math.min(200, Math.round(Number(nextWeight))));
        data.weight = weight;
        if (touched) { data.weightTouched = true; hideGuide(); }
        const readout = document.querySelector('#weightReadout');
        const tape = document.querySelector('#weightTape');
        const scaleState = weightTicksHTML(weight);
        if (readout) readout.textContent = String(weight);
        if (tape) tape.innerHTML = scaleState.html;
        scale.style.setProperty('--weight-needle', scaleState.needle + '%');
        scale.setAttribute('aria-valuenow', String(weight));
        scale.setAttribute('aria-valuetext', weight + ' kilogramos');
        updateModel();
      };
      setWeight(data.weight || 60, false);
      let drag = null;
      scale.addEventListener('pointerdown', function (event) {
        if (event.button !== undefined && event.button !== 0) return;
        event.preventDefault();
        const rect = scale.getBoundingClientRect();
        const fraction = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const currentWindow = weightWindow(data.weight || 60);
        const picked = currentWindow.start + fraction * 20;
        drag = { pointerId: event.pointerId, startX: event.clientX, startWeight: picked, width: rect.width };
        scale.classList.add('is-dragging');
        try { scale.setPointerCapture(event.pointerId); } catch (_) {}
        setWeight(picked, true);
      });
      scale.addEventListener('pointermove', function (event) {
        if (!drag || drag.pointerId !== event.pointerId) return;
        const delta = (drag.startX - event.clientX) / drag.width * 20;
        if (Math.abs(event.clientX - drag.startX) > 2) setWeight(drag.startWeight + delta, true);
      });
      const endDrag = function (event) {
        if (!drag || (event.pointerId !== undefined && drag.pointerId !== event.pointerId)) return;
        drag = null;
        scale.classList.remove('is-dragging');
      };
      scale.addEventListener('pointerup', endDrag);
      scale.addEventListener('pointercancel', endDrag);
      scale.addEventListener('lostpointercapture', endDrag);
      scale.addEventListener('keydown', function (event) {
        let next = Number(data.weight || 60);
        if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next -= 1;
        else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next += 1;
        else if (event.key === 'PageDown') next -= 5;
        else if (event.key === 'PageUp') next += 5;
        else if (event.key === 'Home') next = 40;
        else if (event.key === 'End') next = 200;
        else return;
        event.preventDefault();
        setWeight(next, true);
      });
    }
  }

  function bindFoodStep() {
    document.querySelectorAll('[data-food-key]').forEach(function (group) {
      group.querySelectorAll('[data-food-value]').forEach(function (button) {
        button.addEventListener('click', function () {
          data[group.dataset.foodKey] = button.dataset.foodValue;
          group.querySelectorAll('[data-food-value]').forEach(function (other) {
            other.classList.toggle('selected', other.dataset.foodValue === button.dataset.foodValue);
            other.setAttribute('aria-pressed', String(other.dataset.foodValue === button.dataset.foodValue));
          });
        });
      });
    });
  }

  function bindSummaryStep() {
    document.querySelectorAll('[data-rating]').forEach(function (button) {
      button.addEventListener('click', function () {
        data.rating = Number(button.dataset.rating);
        document.querySelectorAll('[data-rating]').forEach(function (other) {
          const selected = Number(other.dataset.rating) <= data.rating;
          other.classList.toggle('selected', selected);
          other.setAttribute('aria-pressed', String(Number(other.dataset.rating) === data.rating));
        });
      });
    });
  }

  function foodQuestion(key, title, question) {
    const choices = ['Diario','3–5 veces por semana','1–2 veces por semana','Rara vez o nunca'];
    return '<div class="food-question"><h3>' + title + '</h3><p>' + question + '</p><div class="food-options" data-food-key="' + key + '">' + choices.map(function (choice) {
      return '<button type="button" class="food-choice ' + (data[key] === choice ? 'selected' : '') + '" data-food-value="' + choice + '" aria-pressed="' + (data[key] === choice) + '">' + choice + '</button>';
    }).join('') + '</div></div>';
  }

  function sexButton(value, letter) {
    const selected = data.sex === value;
    const sexClass = value === 'Mujer' ? 'is-female' : 'is-male';
    return '<button type="button" class="sex-choice ' + sexClass + ' ' + (selected ? 'selected' : '') + '" data-sex-choice="' + value + '" aria-pressed="' + selected + '"><strong>' + letter + '</strong><span>' + value + '</span></button>';
  }

  function goalChoice(value, title, description, kind, category) {
    const selected = kind === 'muscle' ? isMuscleGoal(data.goal) : kind === 'definition' ? isDefinitionGoal(data.goal) : kind === 'endurance' ? isEnduranceGoal(data.goal) : isPerformanceGoal(data.goal);
    const sex = data.sex === 'Mujer' ? 'Mujer' : 'Hombre';
    const sexClass = sex === 'Mujer' ? 'is-female' : 'is-male';
    return '<button class="choice ' + sexClass + ' ' + (selected ? 'selected' : '') + '" data-value="' + value + '" aria-pressed="' + selected + '"><span class="goal-copy"><strong>' + title + '</strong><span>' + description + '</span></span></button>';
  }

  function formatPhone(input) {
    let digits = String(input || '').replace(/\D/g, '');
    if (!digits) digits = '9';
    if (digits[0] !== '9') digits = '9' + digits.slice(0, 8);
    digits = digits.slice(0, 9);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return digits.slice(0,3) + ' ' + digits.slice(3);
    return digits.slice(0,3) + ' ' + digits.slice(3,6) + ' ' + digits.slice(6);
  }

  function calcBMI(profile) {
    const record = profile || data;
    if (isPregnantProfile(record)) return 0;
    const h = Number(record.height), w = Number(record.weight);
    return h && w ? w / ((h / 100) ** 2) : 0;
  }

  function referenceWeightRangeFor(profile) {
    if (window.GorillaFinalScreenUtils && window.GorillaFinalScreenUtils.isPregnant(profile)) return 'No se estima en este prefiltro';
    const height = Number(profile && profile.height) / 100;
    if (!height) return 'Pendiente';
    const min = 18.5 * height * height, max = 24.9 * height * height;
    return min.toFixed(1) + '–' + max.toFixed(1) + ' kg';
  }

  function listAnswer(list, other) {
    if (!Array.isArray(list) || !list.length) return '—';
    return list.map(function (item) { return (item === 'Otro' || item === 'Otra') && other ? item + ': ' + other : item; }).join(', ');
  }

  function orientationTopics(profile) {
    const record = profile || data;
    if (window.GorillaFinalScreenUtils && window.GorillaFinalScreenUtils.isPregnant(record)) {
      return ['Indicaste que estás embarazada. Este prefiltro general termina aquí; un profesional puede orientar el seguimiento de forma personalizada antes de considerar suplementos.'];
    }
    const bmi = calcBMI(record);
    const topics = [];
    const rare = function (key) { return record[key] === 'Rara vez o nunca' || record[key] === '1–2 veces por semana'; };
    if (rare('fruitFrequency') || rare('vegetableFrequency')) topics.push('Revisar variedad de frutas y verduras y fuentes de fibra en la alimentación habitual.');
    if (rare('fishFrequency')) topics.push('Has indicado poco pescado: conversa sobre fuentes alimentarias de omega‑3. Esto no demuestra que te falte omega‑3 ni indica automáticamente un suplemento.');
    if (rare('animalProteinFrequency') && rare('legumeFrequency')) topics.push('Revisar la cantidad total de proteína y su distribución diaria; estas respuestas por sí solas no permiten calcular cuántos gramos necesitas.');
    if (record.processedFoodsFrequency === 'Diario' || record.processedFoodsFrequency === '3–5 veces por semana') topics.push('Revisar la frecuencia de productos salados y procesados y comparar el sodio en sus etiquetas.');
    if (isMuscleGoal(record.goal)) topics.push('Para el objetivo muscular, conversa sobre un plan progresivo de fuerza y una alimentación suficiente. El profesional puede valorar si la creatina es adecuada; el formulario no detecta una carencia ni calcula una dosis.');
    if (isEnduranceGoal(record.goal)) topics.push('Para mejorar resistencia, conversa con el especialista sobre una progresión de entrenamiento, descanso e hidratación adecuada a tu actividad. Este prefiltro no estima necesidades de sales ni bebidas deportivas.');
    if (isPerformanceGoal(record.goal)) topics.push('Para mejorar tu rendimiento deportivo, conversa sobre entrenamiento, descanso y recuperación adecuados a tu disciplina con el especialista.');
    if (isDefinitionGoal(record.goal) && bmi > 0 && bmi < 19) topics.push('Tu IMC orientativo es bajo para el objetivo de definición: revisa este objetivo con el especialista antes de iniciar cambios para reducir peso.');
    if (!topics.length) topics.push('Lleva tu registro de alimentos y hábitos a la evaluación para revisar si tu alimentación acompaña tu objetivo.');
    topics.push('Esta ficha es un prefiltro didáctico: no calcula dosis personales de creatina, proteína o sodio ni confirma deficiencias.');
    return topics;
  }

  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function whatsappUrl() {
    return 'https://wa.me/' + contactDigits + '?text=' + encodeURIComponent(whatsappMessage());
  }

  function whatsappMessage() {
    return window.GorillaFinalScreenUtils
      ? window.GorillaFinalScreenUtils.buildAdvisorMessage(data.name)
      : 'Hola, soy ' + (data.name || 'cliente') + '. Ya completé mi ficha de Gorilla Labs y adjuntaré mi ficha manualmente en este chat.';
  }

  let preparedSummaryBlob = null;
  let preparedSummaryPngBlob = null;

  function prepareSummaryDownload(button, downloadState) {
    if (!button) return;
    const status = document.querySelector('#downloadStatus');
    button.disabled = true;
    button.textContent = 'Generando ficha…';
    if (status) status.textContent = 'Estamos preparando y verificando tu ficha PDF completa.';
    drawSummaryCanvas().then(function (canvas) {
      if (!window.GorillaFinalScreenUtils) throw new Error('Ficha validation unavailable');
      return canvasToPngBlob(canvas).then(function (pngBlob) {
        return Promise.all([
          window.GorillaFinalScreenUtils.verifyPngBlob(pngBlob, canvas.width, canvas.height),
          canvasToJpegBlob(canvas).then(function (jpegBlob) {
            return window.GorillaFinalScreenUtils.createPdfBlobFromJpegBlob(jpegBlob, canvas.width, canvas.height)
              .then(function (pdfBlob) { return window.GorillaFinalScreenUtils.verifyPdfBlob(pdfBlob, canvas.width, canvas.height); });
          })
        ]).then(function (files) { return { png: files[0], pdf: files[1] }; });
      });
    }).then(function (files) {
      preparedSummaryBlob = files.pdf;
      preparedSummaryPngBlob = files.png;
      if (downloadState) downloadState.markFileVerified();
      const pngButton = document.querySelector('#downloadSummaryPng');
      if (pngButton) pngButton.disabled = false;
      button.disabled = false;
      button.textContent = 'DESCARGAR MI FICHA';
      if (status) status.textContent = 'La ficha PDF completa está generada y verificada. Pulsa el botón para descargarla.';
    }).catch(function () {
      preparedSummaryBlob = null;
      preparedSummaryPngBlob = null;
      button.disabled = false;
      button.textContent = 'REINTENTAR GENERACIÓN';
      const pngButton = document.querySelector('#downloadSummaryPng');
      if (pngButton) pngButton.disabled = true;
      if (status) status.textContent = 'No pudimos generar la ficha PDF completa. Pulsa «Reintentar generación» para volver a intentarlo.';
    });
  }

  function canvasToPngBlob(canvas) {
    return new Promise(function (resolve, reject) {
      if (typeof canvas.toBlob === 'function') {
        canvas.toBlob(function (blob) { blob ? resolve(blob) : reject(new Error('PNG creation failed')); }, 'image/png');
        return;
      }
      try {
        const dataUrl = canvas.toDataURL('image/png');
        const base64 = dataUrl.split(',')[1];
        if (!base64 || typeof window.atob !== 'function') throw new Error('PNG conversion failed');
        const binary = window.atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
        resolve(new Blob([bytes], { type: 'image/png' }));
      } catch (error) {
        reject(error);
      }
    });
  }

  function canvasToJpegBlob(canvas) {
    return new Promise(function (resolve, reject) {
      if (typeof canvas.toBlob === 'function') {
        canvas.toBlob(function (blob) {
          blob && blob.type === 'image/jpeg' ? resolve(blob) : reject(new Error('No se pudo convertir la ficha a JPEG para crear el PDF.'));
        }, 'image/jpeg', 0.96);
        return;
      }
      try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.96);
        const base64 = dataUrl.split(',')[1];
        if (!base64 || typeof window.atob !== 'function') throw new Error('JPEG conversion failed');
        const binary = window.atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
        resolve(new Blob([bytes], { type: 'image/jpeg' }));
      } catch (error) {
        reject(error);
      }
    });
  }

  function summaryFilename(extension) {
    return 'gorilla-labs-ficha-' + safeFilename(data.name) + '-' + (data.createdISO || new Date().toISOString().slice(0, 10)) + '.' + extension;
  }

  function startSummaryDownload(blob) {
    summaryDownloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = summaryDownloadUrl;
    link.download = summaryFilename('pdf');
    link.style.position = 'fixed';
    link.style.left = '-10000px';
    document.body.appendChild(link);
    try {
      link.click();
    } catch (error) {
      link.remove();
      URL.revokeObjectURL(summaryDownloadUrl);
      summaryDownloadUrl = null;
      throw error;
    }
    link.remove();
    const url = summaryDownloadUrl;
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
      if (summaryDownloadUrl === url) summaryDownloadUrl = null;
    }, 60000);
  }

  async function drawSummaryCanvas(profile) {
    return renderSummaryCanvas(profile || readCurrentFormData());
  }

  function readCurrentFormData() { return data; }

  async function renderSummaryCanvas(data) {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    const ctx = canvas.getContext('2d');
    const margin = 48, bodyWidth = canvas.width - margin * 2, gap = 18;
    const pregnancyPath = isPregnantProfile(data);
    const bmi = pregnancyPath ? 0 : calcBMI(data);
    const selector = window.GorillaResultBodies;
    const currentBody = pregnancyPath
      ? { sex: data.sex, frame: 1, category: 'referencial', label: 'Referencia actual' }
      : selector ? selector.selectCurrent(data) : { sex: data.sex, frame: null, category: 'neutral', label: 'Referencia neutra' };
    const targetBody = pregnancyPath ? currentBody : selector ? selector.selectTarget(data, currentBody) : currentBody;
    const figureFor = async function (selection) {
      if (selection && selection.frame !== null && selection.sex) return bodySpriteFrame(selection.sex, selection.frame);
      const image = new Image();
      const sex = selection && selection.sex;
      image.src = sex === 'Mujer' ? 'assets/female-silhouette-reference.png' : sex === 'Hombre' ? 'assets/male-silhouette-reference.png' : 'assets/person-silhouette.svg';
      await new Promise(function (resolve) { image.onload = resolve; image.onerror = resolve; if (image.complete) resolve(); });
      return image.naturalWidth ? image : null;
    };
    const images = await Promise.all([figureFor(currentBody), figureFor(targetBody)]);
    const watermarkMark = new Image();
    watermarkMark.src = window.GORILLA_MARK_DATA || 'assets/gorilla-mark-approved.png';
    await new Promise(function (resolve) { watermarkMark.onload = resolve; watermarkMark.onerror = resolve; if (watermarkMark.complete) resolve(); });
    const officialLogo = new Image();
    officialLogo.src = 'assets/gorilla-labs-logo.png';
    await new Promise(function (resolve) { officialLogo.onload = resolve; officialLogo.onerror = resolve; if (officialLogo.complete) resolve(); });
    const dateText = data.createdISO ? new Intl.DateTimeFormat('es-PE').format(new Date(String(data.createdISO).slice(0, 10) + 'T12:00:00')) : new Date().toLocaleDateString('es-PE');
    const supplements = data.supplementStatus === 'No' ? 'No' : listAnswer(data.supplementTags, data.supplementOther);
    const medicines = data.medicationStatus === 'No' ? 'No' : (data.medicationDetails || 'No especificado');
    const comment = data.commentStatus === 'Sí' ? (data.commentDetails || 'Sin detalle') : 'Omitido';
    const row = function (label, value) { return { label: label, value: String(value == null || value === '' ? '—' : value) }; };
    const profileRows = [row('Nombre', data.name), row('Teléfono', data.phone), row('Edad / sexo', (data.age ? data.age + ' años' : '—') + ' · ' + (data.sex || '—'))];
    if (data.sex === 'Mujer') profileRows.push(row('Embarazo actual', data.pregnancyStatus || '—'));
    profileRows.push(row('Estatura', data.height ? data.height + ' cm' : '—'), row('Peso actual', data.weight ? data.weight + ' kg' : '—'));
    if (!pregnancyPath) profileRows.push(row('IMC orientativo', bmi ? bmi.toFixed(1) : '—'), row('Rango por estatura', referenceWeightRangeFor(data)));
    profileRows.push(row('Objetivo elegido', displayGoal(data.goal) || '—'));
    const professionalRows = pregnancyPath
      ? [row('Embarazo actual', 'Sí · requiere evaluación personalizada')]
      : [row('Antecedentes', listAnswer(data.historyTags, data.historyOther)), row('Alergias', listAnswer(data.allergyTags, data.allergyOther)), row('Suplementos actuales', supplements), row('Medicamentos', medicines), row('Comentario adicional', comment)];
    const sections = [
      { title: 'PERFIL Y OBJETIVO', rows: profileRows },
      { title: 'ACTIVIDAD Y HÁBITOS', rows: [row('Actividad física', data.activity), row('Nivel habitual', data.activityLevel), row('Entrenamiento semanal', data.days !== undefined ? data.days + ' día(s)' : '—'), row('Duración por sesión', data.duration), row('Deporte', data.sport || '—'), row('Consumo de agua', data.water), row('Horas de sueño', data.sleep), row('Comidas al día', data.meals), row('Proteína habitual', data.protein)] },
      { title: 'ALIMENTACIÓN REPORTADA', rows: [row('Frutas', data.fruitFrequency), row('Verduras', data.vegetableFrequency), row('Pescado', data.fishFrequency), row('Carne, pollo o huevos', data.animalProteinFrequency), row('Menestras', data.legumeFrequency), row('Productos salados/procesados', data.processedFoodsFrequency)] },
      { title: 'INFORMACIÓN PARA EL PROFESIONAL', rows: professionalRows },
      { title: 'ORIENTACIÓN PRELIMINAR', rows: orientationTopics(data).map(function (item) { return row('•', item); }) },
      { title: 'VALORACIÓN DE LA EXPERIENCIA', rows: [row('Calificación', data.rating ? data.rating + ' de 5 estrellas' : '—'), row('Comentario', data.ratingComment || 'Sin comentario')] }
    ];
    const colors = { purple: '#6922a3', deep: '#331640', pale: '#f3eafa', ink: '#1e1922', text: '#554e5a', muted: '#817987', line: '#e7e1ea', bg: '#f7f6f8', white: '#ffffff' };
    const lineHeight = 22;
    const wrap = function (text, maxWidth, font) {
      ctx.font = font;
      const words = String(text || '—').split(/\s+/), lines = [];
      let current = '';
      words.forEach(function (word) {
        const next = current ? current + ' ' + word : word;
        if (current && ctx.measureText(next).width > maxWidth) { lines.push(current); current = word; }
        else current = next;
      });
      if (current) lines.push(current);
      return lines;
    };
    const cardRows = function (section, width) {
      const labelWidth = Math.min(148, Math.max(118, width * .32));
      return section.rows.map(function (item) {
        const labels = wrap(item.label, labelWidth - 12, '700 14px system-ui,sans-serif');
        const values = wrap(item.value, width - labelWidth - 48, '15px system-ui,sans-serif');
        return { item: item, labels: labels, values: values, height: Math.max(labels.length, values.length) * lineHeight + 10 };
      });
    };
    const columnGap = 20, columnWidth = (bodyWidth - columnGap) / 2;
    sections.forEach(function (section, index) {
      section.layout = cardRows(section, columnWidth);
      section.height = 56 + section.layout.reduce(function (sum, item) { return sum + item.height; }, 0) + 18;
    });
    const visualY = 402, visualHeight = 530, habitHeight = 344;
    const sectionPairs = [[sections[0], sections[1]], [sections[2], sections[3]], [sections[4], sections[5]]];
    const pairHeights = sectionPairs.map(function (pair) { return Math.max(pair[0].height, pair[1].height); });
    canvas.height = visualY + visualHeight + 18 + habitHeight + 18 + pairHeights.reduce(function (sum, height) { return sum + height + 16; }, 0) + 105;
    ctx.fillStyle = colors.bg; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = colors.white; ctx.fillRect(0, 0, canvas.width, 382);
    ctx.fillStyle = colors.purple; ctx.fillRect(0, 0, canvas.width, 12);
    if (watermarkMark.naturalWidth) { ctx.save(); ctx.globalAlpha = .055; ctx.drawImage(watermarkMark, 830, 12, 210, 210); ctx.restore(); }
    if (officialLogo.naturalWidth) {
      const logoHeight = 190;
      const logoWidth = logoHeight * officialLogo.naturalWidth / officialLogo.naturalHeight;
      ctx.drawImage(officialLogo, (canvas.width - logoWidth) / 2, 8, logoWidth, logoHeight);
    }
    ctx.fillStyle = colors.ink; ctx.font = '900 57px system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.fillText('TU RESULTADO', canvas.width / 2, 255);
    const goalGradient = ctx.createLinearGradient(180, 0, 900, 0); goalGradient.addColorStop(0, '#5c1596'); goalGradient.addColorStop(.55, '#8b23cc'); goalGradient.addColorStop(1, '#5c1596');
    ctx.fillStyle = goalGradient; roundedRect(ctx, 180, 273, 720, 55, 18); ctx.fill();
    ctx.fillStyle = colors.white; ctx.font = '800 27px system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.fillText((displayGoal(data.goal) || 'OBJETIVO POR DEFINIR').toLocaleUpperCase('es-PE'), 540, 309, 690);
    ctx.fillStyle = colors.muted; ctx.font = '15px system-ui,sans-serif'; ctx.fillText('Ficha informativa · ' + dateText + ' · ' + (data.name || 'Cliente'), 540, 359);

    const drawCard = function (x, y, width, height, fill) {
      ctx.fillStyle = fill || colors.white; roundedRect(ctx, x, y, width, height, 22); ctx.fill();
      ctx.strokeStyle = colors.line; ctx.lineWidth = 1; roundedRect(ctx, x, y, width, height, 22); ctx.stroke();
    };
    drawCard(margin, visualY, bodyWidth, visualHeight);
    const photoWidth = 570, dataX = margin + photoWidth + 18, dataWidth = bodyWidth - photoWidth - 18;
    ctx.fillStyle = '#f4f2f5'; roundedRect(ctx, margin + 14, visualY + 14, photoWidth - 14, visualHeight - 28, 22); ctx.fill();
    ctx.fillStyle = colors.purple; ctx.font = '800 15px system-ui,sans-serif'; ctx.textAlign = 'center';
    const leftMid = margin + 14 + (photoWidth - 14) / 4, rightMid = margin + 14 + (photoWidth - 14) * .75;
    const pill = function (x, y, width, label, color) { ctx.fillStyle = color; roundedRect(ctx, x - width / 2, y - 16, width, 32, 18); ctx.fill(); ctx.fillStyle = colors.white; ctx.font = '800 14px system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.fillText(label, x, y + 5, width - 12); };
    pill(leftMid, visualY + 38, 220, 'PUNTO DE PARTIDA', '#514b55');
    pill(rightMid, visualY + 38, 200, pregnancyPath ? 'ATENCIÓN PERSONALIZADA' : targetBody.label === 'Objetivo a revisar con el profesional' ? 'A REVISAR' : 'META VISUAL', colors.purple);
    const tileY = visualY + 58, tileH = 390, tileW = 220;
    [leftMid, rightMid].forEach(function (center) { ctx.fillStyle = '#eeecef'; roundedRect(ctx, center - tileW / 2, tileY, tileW, tileH, 24); ctx.fill(); });
    const drawContained = function (image, x, y, width, height, scale) {
      if (!image || !image.naturalWidth && !image.width) return;
      const iw = image.naturalWidth || image.width, ih = image.naturalHeight || image.height;
      const fit = Math.min(width / iw, height / ih) * (scale || 1), w = iw * fit, h = ih * fit;
      ctx.drawImage(image, x + (width - w) / 2, y + (height - h) / 2, w, h);
    };
    const statureScale = Math.max(.9, Math.min(1.06, Number(data.height || 170) / 170));
    drawContained(images[0], leftMid - tileW / 2 + 4, tileY + 5, tileW - 8, tileH - 10, statureScale);
    if (!pregnancyPath) drawContained(images[1], rightMid - tileW / 2 + 4, tileY + 5, tileW - 8, tileH - 10, statureScale);
    const arrowX = (leftMid + rightMid) / 2;
    if (pregnancyPath) {
      ctx.fillStyle = colors.deep; ctx.font = '700 18px system-ui,sans-serif'; ctx.textAlign = 'center';
      wrap('Este prefiltro general termina aquí. Coordina una evaluación personalizada antes de considerar suplementos.', tileW - 38, '700 18px system-ui,sans-serif').forEach(function (line, index) { ctx.fillText(line, rightMid, tileY + 160 + index * 27); });
    } else {
      ctx.fillStyle = colors.pale; ctx.beginPath(); ctx.arc(arrowX, visualY + 272, 25, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = colors.purple; ctx.font = '800 30px system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.fillText('›', arrowX, visualY + 282);
    }
    ctx.textAlign = 'left'; ctx.fillStyle = colors.purple; ctx.font = '800 19px system-ui,sans-serif'; ctx.fillText('DATOS DEL CLIENTE', dataX + 20, visualY + 43);
    const facts = [['Edad', data.age ? data.age + ' años' : '—'], ['Estatura', data.height ? data.height + ' cm' : '—'], ['Peso actual', data.weight ? data.weight + ' kg' : '—']];
    if (!pregnancyPath) facts.push(['IMC orientativo', bmi ? bmi.toFixed(1) : '—']);
    facts.forEach(function (fact, index) {
      const rowY = visualY + 58 + index * 53;
      const isBMI = fact[0] === 'IMC orientativo';
      ctx.fillStyle = isBMI ? '#f7f0fb' : '#ffffff'; roundedRect(ctx, dataX + 15, rowY, dataWidth - 30, 47, 11); ctx.fill();
      ctx.strokeStyle = colors.line; roundedRect(ctx, dataX + 15, rowY, dataWidth - 30, 47, 11); ctx.stroke();
      ctx.fillStyle = colors.text; ctx.font = '650 15px system-ui,sans-serif'; ctx.textAlign = 'left'; ctx.fillText(fact[0], dataX + 28, rowY + 29);
      ctx.fillStyle = isBMI ? colors.purple : colors.ink; ctx.font = '800 19px system-ui,sans-serif'; ctx.textAlign = 'right'; ctx.fillText(fact[1], dataX + dataWidth - 27, rowY + 30);
    });
    const classY = visualY + 285;
    ctx.fillStyle = '#f1e4fa'; roundedRect(ctx, dataX + 15, classY, dataWidth - 30, 109, 16); ctx.fill();
    ctx.fillStyle = colors.purple; ctx.textAlign = 'left'; ctx.font = '800 13px system-ui,sans-serif'; ctx.fillText(pregnancyPath ? 'SEGUIMIENTO PERSONALIZADO' : 'CLASIFICACIÓN CORPORAL · REFERENCIAL', dataX + 31, classY + 28);
    const className = pregnancyPath ? 'NO SE ESTIMA EN ESTE PREFILTRO' : currentBody.category === 'ectomorfa' ? 'ECTOMORFA · DELGADA' : currentBody.category === 'mesomorfa' ? 'MESOMORFA · MUSCULATURA' : currentBody.category === 'endomorfa' ? 'ENDOMORFA · MAYOR VOLUMEN' : 'SIN CLASIFICACIÓN VISUAL';
    ctx.fillStyle = colors.deep; ctx.font = '850 18px system-ui,sans-serif';
    wrap(className, dataWidth - 60, '850 18px system-ui,sans-serif').slice(0, 2).forEach(function (line, index) { ctx.fillText(line, dataX + 31, classY + 58 + index * 22); });
    ctx.fillStyle = colors.text; ctx.font = '12px system-ui,sans-serif'; ctx.fillText(pregnancyPath ? 'No se proyecta una meta corporal.' : 'Referencia ilustrativa, no es una medición clínica.', dataX + 31, classY + 96, dataWidth - 56);
    ctx.fillStyle = colors.muted; ctx.font = '12px system-ui,sans-serif'; ctx.textAlign = 'left'; ctx.fillText('La imagen no predice cambios ni reemplaza una valoración profesional.', margin + 20, visualY + visualHeight - 12);

    let y = visualY + visualHeight + 18;
    const indicatorRows = window.GorillaNutritionBalance
      ? window.GorillaNutritionBalance.calculate(data)
      : [
        { label: 'Proteínas', percent: null, classification: 'INFORMACIÓN INSUFICIENTE', detail: 'No se registran cantidades ni porciones.' },
        { label: 'Carbohidratos', percent: null, classification: 'INFORMACIÓN INSUFICIENTE', detail: 'No se registran cantidades ni porciones.' },
        { label: 'Grasas', percent: null, classification: 'INFORMACIÓN INSUFICIENTE', detail: 'No se registran cantidades ni porciones.' },
        { label: 'Hidratación (agua)', percent: null, classification: 'INFORMACIÓN INSUFICIENTE', detail: 'Agua declarada: ' + (data.water || 'sin respuesta') + ' · la respuesta es un rango.' }
      ];
    drawCard(margin, y, bodyWidth, habitHeight);
    ctx.fillStyle = colors.purple; roundedRect(ctx, margin + 20, y + 18, 48, 40, 12); ctx.fill();
    ctx.strokeStyle = colors.white; ctx.fillStyle = colors.white; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(margin + 36, y + 25); ctx.lineTo(margin + 36, y + 34); ctx.moveTo(margin + 42, y + 25); ctx.lineTo(margin + 42, y + 34); ctx.moveTo(margin + 48, y + 25); ctx.lineTo(margin + 48, y + 34); ctx.moveTo(margin + 33, y + 34); ctx.lineTo(margin + 51, y + 34); ctx.moveTo(margin + 42, y + 34); ctx.lineTo(margin + 42, y + 50); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(margin + 58, y + 32, 4, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(margin + 58, y + 40); ctx.lineTo(margin + 58, y + 50); ctx.stroke();
    ctx.fillStyle = colors.ink; ctx.font = '850 23px system-ui,sans-serif'; ctx.textAlign = 'left'; ctx.fillText('BALANCE NUTRICIONAL · ESTIMACIÓN ORIENTATIVA', margin + 82, y + 47);
    const barX = margin + 300, barWidth = 338, percentX = margin + 704, badgeX = margin + 742, badgeWidth = 210;
    indicatorRows.forEach(function (item, index) {
      const rowY = y + 72 + index * 53;
      if (index) { ctx.strokeStyle = colors.line; ctx.beginPath(); ctx.moveTo(margin + 25, rowY - 5); ctx.lineTo(margin + bodyWidth - 25, rowY - 5); ctx.stroke(); }
      ctx.fillStyle = colors.text; ctx.font = '750 15px system-ui,sans-serif'; ctx.textAlign = 'left'; ctx.fillText(item.label, margin + 28, rowY + 7, 210);
      ctx.fillStyle = colors.muted; ctx.font = '11px system-ui,sans-serif';
      const detailText = item.percent !== null && item.reference ? item.detail + ' · ' + item.reference : (item.detail || 'Sin porciones o cantidades registradas.');
      wrap(detailText, 215, '11px system-ui,sans-serif').slice(0, 2).forEach(function (line, lineIndex) { ctx.fillText(line, margin + 28, rowY + 23 + lineIndex * 13, 215); });
      ctx.fillStyle = '#e8e5ea'; roundedRect(ctx, barX, rowY - 3, barWidth, 15, 8); ctx.fill();
      if (item.percent !== null && Number.isFinite(Number(item.percent))) { ctx.fillStyle = '#8c32c8'; roundedRect(ctx, barX, rowY - 3, barWidth * Math.max(0, Math.min(100, Number(item.percent))) / 100, 15, 8); ctx.fill(); }
      ctx.fillStyle = item.percent === null ? colors.muted : colors.deep; ctx.font = '800 15px system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.fillText(item.percent === null ? '—' : Math.round(item.percent) + '%', percentX, rowY + 8);
      const statusColors = item.classification === 'BAJO' ? ['#fff2b8', '#604d00'] : item.classification === 'ALTO' ? ['#ffded9', '#8b3127'] : item.classification === 'MODERADO' ? ['#ebe8ee', '#514b55'] : ['#f1e8f8', colors.purple];
      ctx.fillStyle = statusColors[0]; roundedRect(ctx, badgeX, rowY - 8, badgeWidth, 28, 12); ctx.fill();
      ctx.fillStyle = statusColors[1]; ctx.font = '800 11px system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.fillText(item.classification || 'INFORMACIÓN INSUFICIENTE', badgeX + badgeWidth / 2, rowY + 10, badgeWidth - 12);
    });
    ctx.fillStyle = colors.muted; ctx.textAlign = 'left'; ctx.font = '10px system-ui,sans-serif';
    const amdrReference = window.GorillaNutritionBalance
      ? window.GorillaNutritionBalance.referenceSummary(data.age)
      : 'Referencia AMDR (% de energía); requiere interpretar cantidades con un profesional.';
    const waterReference = window.GorillaNutritionBalance
      ? window.GorillaNutritionBalance.waterReference(data)
      : 'La referencia de agua total requiere interpretación profesional.';
    ctx.fillText(amdrReference, margin + 26, y + 284, bodyWidth - 52);
    ctx.fillText(waterReference, margin + 26, y + 299, bodyWidth - 52);
    ctx.fillText('Las respuestas actuales no aportan gramos, energía ni volumen total; por eso los porcentajes quedan como información insuficiente.', margin + 26, y + 314, bodyWidth - 52);
    ctx.fillText('AMDR = distribución aceptable de macronutrientes; AI = ingesta adecuada de agua total. No son dosis ni metas personales. Fuente: National Academies DRI.', margin + 26, y + 329, bodyWidth - 52);
    y += habitHeight + 18;

    const drawInfoCard = function (section, x, cardY, width, height) {
      drawCard(x, cardY, width, height);
      ctx.fillStyle = '#f2e9f8'; roundedRect(ctx, x + 1, cardY + 1, width - 2, 48, 20); ctx.fill();
      ctx.fillStyle = colors.purple; ctx.font = '850 16px system-ui,sans-serif'; ctx.textAlign = 'left'; ctx.fillText(section.title, x + 20, cardY + 31, width - 40);
      let rowY = cardY + 62;
      const labelWidth = Math.min(148, Math.max(118, width * .32));
      section.layout.forEach(function (item, index) {
        if (index) { ctx.strokeStyle = colors.line; ctx.beginPath(); ctx.moveTo(x + 20, rowY - 5); ctx.lineTo(x + width - 20, rowY - 5); ctx.stroke(); }
        ctx.fillStyle = colors.text; ctx.textAlign = 'left'; ctx.font = '700 14px system-ui,sans-serif';
        item.labels.forEach(function (line, lineIndex) { ctx.fillText(line, x + 20, rowY + 15 + lineIndex * lineHeight, labelWidth - 8); });
        ctx.fillStyle = colors.text; ctx.font = '15px system-ui,sans-serif';
        item.values.forEach(function (line, lineIndex) { ctx.fillText(line, x + 20 + labelWidth, rowY + 15 + lineIndex * lineHeight, width - labelWidth - 40); });
        rowY += item.height;
      });
    };
    sectionPairs.forEach(function (pair, index) {
      const pairHeight = pairHeights[index];
      drawInfoCard(pair[0], margin, y, columnWidth, pairHeight);
      drawInfoCard(pair[1], margin + columnWidth + columnGap, y, columnWidth, pairHeight);
      y += pairHeight + 16;
    });
    ctx.fillStyle = colors.pale; roundedRect(ctx, margin, y, bodyWidth, 74, 22); ctx.fill();
    ctx.fillStyle = colors.purple; ctx.font = '800 17px system-ui,sans-serif'; ctx.textAlign = 'left'; ctx.fillText('NOTA', margin + 24, y + 29);
    ctx.fillStyle = colors.text; ctx.font = '15px system-ui,sans-serif';
    ctx.fillText('Esta ficha es informativa. No diagnostica condiciones ni deficiencias, ni prescribe suplementos.', margin + 90, y + 29, bodyWidth - 120);
    ctx.fillText('Las referencias visuales son ilustrativas y deben revisarse con un profesional de Gorilla Labs.', margin + 90, y + 53, bodyWidth - 120);
    ctx.fillStyle = colors.muted; ctx.font = '13px system-ui,sans-serif'; ctx.fillText('WhatsApp 986-663-258 · Ficha generada el ' + dateText, margin, y + 97);
    return canvas;
  }

  function svgToImage(svgMarkup) {
    return new Promise(function (resolve, reject) {
      const image = new Image();
      image.onload = function () { resolve(image); };
      image.onerror = reject;
      image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgMarkup);
    });
  }

  function roundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r); ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r); ctx.closePath();
  }
})();

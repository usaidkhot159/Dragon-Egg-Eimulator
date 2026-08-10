// js/ui.js — DOM update helpers

const UI = {
  // ── Stat bars ──
  updateStats() {
    const keys = ['warmth','bond','energy','nourish'];
    for (const k of keys) {
      const pct = STATE.statPct(k);
      const fill = document.getElementById(`stat-${k}`);
      const val  = document.getElementById(`val-${k}`);
      if (fill) fill.style.width = pct + '%';
      if (val)  val.textContent  = pct;

      // Warn flash
      if (pct <= CONFIG.DANGER_THRESHOLD) {
        fill?.classList.add('stat-flash');
        setTimeout(() => fill?.classList.remove('stat-flash'), 420);
      }
    }
  },

  // ── XP bar ──
  updateXp() {
    const fill = document.getElementById('xp-fill');
    const text = document.getElementById('xp-text');
    const pct  = STATE.xpPct;
    if (fill) fill.style.width = pct + '%';
    if (text) {
      const cap = STATE.xpToNext;
      text.textContent = cap === Infinity
        ? `${STATE.xp} XP (MAX)`
        : `${STATE.xp} / ${cap}`;
    }
  },

  // ── HUD info ──
  updateHudInfo() {
    const name  = document.getElementById('hud-name');
    const stage = document.getElementById('hud-stage');
    if (name)  name.textContent  = STATE.name || '—';
    if (stage) stage.textContent = STATE.stage;
  },

  // ── Stage dots ──
  updateStageDots() {
    const container = document.getElementById('stage-progress');
    if (!container) return;
    container.innerHTML = '';
    CONFIG.STAGES.forEach((label, i) => {
      const dot = document.createElement('div');
      dot.className = 'stage-dot';
      if (i < STATE.stageIndex)  dot.classList.add('stage-dot--reached');
      if (i === STATE.stageIndex)dot.classList.add('stage-dot--current');
      dot.title = label;
      container.appendChild(dot);
    });
  },

  // ── Ability list ──
  updateAbilityList() {
    const list = document.getElementById('ability-list');
    if (!list) return;
    list.innerHTML = '';

    if (!STATE.abilities.length) {
      const li = document.createElement('li');
      li.className = 'ability-item ability-item--locked';
      li.textContent = '??? Locked';
      list.appendChild(li);
      return;
    }

    STATE.abilities.forEach((ab, idx) => {
      const li = document.createElement('li');
      li.className = 'ability-item' + (idx === STATE.abilities.length - 1 ? ' ability-item--new' : '');
      li.innerHTML = `
        <span class="ability-icon">${ab.icon}</span>
        <span class="ability-name">${ab.name}</span>
        <span class="ability-power">${ab.power}</span>
      `;
      li.title = ab.desc || '';
      list.appendChild(li);
    });

    // Locked slots
    const remaining = STATE.abilitySlots - STATE.abilities.length;
    for (let i = 0; i < Math.min(remaining, 2); i++) {
      const li = document.createElement('li');
      li.className = 'ability-item ability-item--locked';
      li.textContent = '??? Locked';
      list.appendChild(li);
    }
  },

  // ── Evolution path ──
  updateEvolutionPath() {
    const container = document.getElementById('evolution-path');
    if (!container || !STATE.type) return;
    const type = STATE.type;
    container.innerHTML = '';

    type.evolutionNames.forEach((name, i) => {
      if (i > 0) {
        const arrow = document.createElement('div');
        arrow.className = 'evo-step-arrow';
        container.appendChild(arrow);
      }
      const step = document.createElement('div');
      step.className = 'evo-step';
      if (i < STATE.stageIndex)  step.classList.add('evo-step--reached');
      if (i === STATE.stageIndex)step.classList.add('evo-step--current');
      step.innerHTML = `
        <span class="evo-step-icon">${type.evolutionIcons[i]}</span>
        <span class="evo-step-name">${name}</span>
      `;
      container.appendChild(step);
    });
  },

  // ── Chronicle ──
  addLog(text, type = 'action') {
    STATE.addChronicle(text, type);
    const log = document.getElementById('chronicle-log');
    if (!log) return;
    const el = document.createElement('p');
    el.className = `log-entry log-entry--${type}`;
    el.textContent = text;
    log.prepend(el);
    // Trim
    while (log.children.length > 25) log.lastChild?.remove();
  },

  // ── Lore card ──
  updateLore(title, text) {
    const t = document.getElementById('lore-title');
    const d = document.getElementById('lore-text');
    if (t) t.textContent = title;
    if (d) d.textContent = text;
  },

  // ── World info ──
  updateWorldInfo() {
    const day    = document.getElementById('game-day');
    const season = document.getElementById('game-season');
    if (day)    day.textContent    = STATE.day;
    if (season) season.textContent = CONFIG.SEASONS[STATE.seasonIndex];
  },

  // ── Dragon renderer ──
  renderDragon() {
    const container = document.getElementById('dragon-container');
    if (!container) return;
    Renderer.render(container);
  },

  // ── Full refresh ──
  refresh() {
    this.updateStats();
    this.updateXp();
    this.updateHudInfo();
    this.updateStageDots();
    this.updateAbilityList();
    this.updateEvolutionPath();
    this.updateWorldInfo();
    this.renderDragon();
  },

  // ── Toast ──
  toast(msg, type = '') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `toast${type ? ' toast--' + type : ''}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => {
      el.classList.add('toast--out');
      setTimeout(() => el.remove(), 350);
    }, 2800);
  },

  // ── Screen transitions ──
  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('screen--active');
    });
    const target = document.getElementById(id);
    if (target) {
      requestAnimationFrame(() => target.classList.add('screen--active'));
    }
  },

  // ── Modal ──
  openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('modal--open');
  },
  closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('modal--open');
  },

  // ── Action button cooldown visual ──
  flashAction(btnId) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.classList.add('action-pop');
    setTimeout(() => btn.classList.remove('action-pop'), 350);
  },

  // ── Egg type cards ──
  buildEggTypeGrid(selectedId, onSelect) {
    const grid = document.getElementById('egg-type-grid');
    if (!grid) return;
    grid.innerHTML = '';
    Object.values(DRAGON_TYPES).forEach(type => {
      const card = document.createElement('div');
      card.className = 'egg-type-card' + (selectedId === type.id ? ' egg-type-card--selected' : '');
      card.dataset.id = type.id;
      card.innerHTML = `
        <div class="egg-type-icon">${type.icon}</div>
        <div class="egg-type-name">${type.name}</div>
        <div class="egg-type-trait">${type.trait}</div>
      `;
      card.addEventListener('click', () => {
        document.querySelectorAll('.egg-type-card').forEach(c => c.classList.remove('egg-type-card--selected'));
        card.classList.add('egg-type-card--selected');
        onSelect(type);
      });
      grid.appendChild(card);
    });
  },
};

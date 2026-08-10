// js/tome.js — Dragon Tome modal tabs

const Tome = {
  currentTab: 'stats',

  init() {
    document.querySelectorAll('.tome-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tome-tab').forEach(t => t.classList.remove('tome-tab--active'));
        tab.classList.add('tome-tab--active');
        this.currentTab = tab.dataset.tab;
        this.render();
      });
    });
  },

  open() {
    this.currentTab = 'stats';
    document.querySelectorAll('.tome-tab').forEach(t => {
      t.classList.toggle('tome-tab--active', t.dataset.tab === 'stats');
    });
    this.render();
    UI.openModal('modal-tome');
  },

  render() {
    const content = document.getElementById('tome-content');
    if (!content) return;
    switch (this.currentTab) {
      case 'stats':     content.innerHTML = this.renderStats();     break;
      case 'abilities': content.innerHTML = this.renderAbilities(); break;
      case 'history':   content.innerHTML = this.renderHistory();   break;
      case 'lore':      content.innerHTML = this.renderLore();      break;
    }
  },

  renderStats() {
    const type = STATE.type;
    const app  = CONFIG.APPEARANCE_MAP[STATE.dominantStat];
    return `
      <div style="display:grid;gap:16px">
        <div style="display:flex;align-items:center;gap:16px;padding:16px;background:var(--c-abyss);border-radius:12px;border:1px solid var(--c-mist)">
          <span style="font-size:3rem">${type?.icon || '🥚'}</span>
          <div>
            <div style="font-family:var(--font-display);font-size:1.3rem;color:var(--c-star)">${STATE.name}</div>
            <div style="color:var(--c-ember);font-family:var(--font-title);font-size:.8rem;letter-spacing:.1em">${STATE.stage} · ${type?.evolutionNames?.[STATE.stageIndex] || ''}</div>
            <div style="color:var(--c-silver);font-size:.85rem;margin-top:4px">${app?.title || ''} Dragon</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          ${this._statRow('🔥 Warmth',  STATE.statPct('warmth'),  'var(--c-warmth)')}
          ${this._statRow('💖 Bond',    STATE.statPct('bond'),    'var(--c-bond)')}
          ${this._statRow('⚡ Energy',  STATE.statPct('energy'),  'var(--c-energy)')}
          ${this._statRow('🌿 Nourish', STATE.statPct('nourish'), 'var(--c-nourish)')}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:.85rem">
          <div style="background:var(--c-abyss);padding:12px;border-radius:8px;border:1px solid var(--c-mist)">
            <div style="color:var(--c-stone);font-size:.7rem;letter-spacing:.08em;margin-bottom:4px">TOTAL XP</div>
            <div style="color:var(--c-ember);font-family:var(--font-title);font-size:1.1rem">${STATE.totalXp}</div>
          </div>
          <div style="background:var(--c-abyss);padding:12px;border-radius:8px;border:1px solid var(--c-mist)">
            <div style="color:var(--c-stone);font-size:.7rem;letter-spacing:.08em;margin-bottom:4px">DAYS OLD</div>
            <div style="color:var(--c-ember);font-family:var(--font-title);font-size:1.1rem">${STATE.day}</div>
          </div>
          <div style="background:var(--c-abyss);padding:12px;border-radius:8px;border:1px solid var(--c-mist)">
            <div style="color:var(--c-stone);font-size:.7rem;letter-spacing:.08em;margin-bottom:4px">LINEAGE</div>
            <div style="color:var(--c-moon);font-family:var(--font-title);font-size:.9rem">${type?.name || '?'}</div>
          </div>
          <div style="background:var(--c-abyss);padding:12px;border-radius:8px;border:1px solid var(--c-mist)">
            <div style="color:var(--c-stone);font-size:.7rem;letter-spacing:.08em;margin-bottom:4px">SEASON</div>
            <div style="color:var(--c-moon);font-family:var(--font-title);font-size:.9rem">${CONFIG.SEASONS[STATE.seasonIndex]}</div>
          </div>
        </div>

        <div style="background:var(--c-abyss);padding:12px;border-radius:8px;border:1px solid var(--c-mist)">
          <div style="color:var(--c-stone);font-size:.7rem;letter-spacing:.08em;margin-bottom:8px">CARE HISTORY</div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;font-size:.8rem;text-align:center">
            ${Object.entries(STATE.careHistory).map(([k,v]) => `
              <div>
                <div style="color:var(--c-silver)">${{warmth:'🔥',bond:'💖',energy:'⚡',nourish:'🌿'}[k]}</div>
                <div style="color:var(--c-ember);font-family:var(--font-title)">${Math.round(v)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  _statRow(label, value, color) {
    return `
      <div style="background:var(--c-abyss);padding:12px;border-radius:8px;border:1px solid var(--c-mist)">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:.8rem;color:var(--c-silver)">${label}</span>
          <span style="font-family:var(--font-title);font-size:.85rem;color:${color}">${value}</span>
        </div>
        <div style="height:6px;background:var(--c-deep);border-radius:99px;overflow:hidden">
          <div style="width:${value}%;height:100%;background:${color};border-radius:99px;transition:width .5s"></div>
        </div>
      </div>
    `;
  },

  renderAbilities() {
    if (!STATE.abilities.length) {
      return `<p style="color:var(--c-stone);font-style:italic;text-align:center;padding:32px">No abilities unlocked yet.<br>Care for your dragon to reveal their power.</p>`;
    }
    return `
      <div style="display:flex;flex-direction:column;gap:10px">
        ${STATE.abilities.map(ab => `
          <div style="background:var(--c-abyss);border:1px solid var(--c-mist);border-radius:10px;padding:14px;display:flex;align-items:flex-start;gap:12px">
            <span style="font-size:1.8rem;line-height:1">${ab.icon}</span>
            <div style="flex:1">
              <div style="font-family:var(--font-title);color:var(--c-star);font-size:.95rem;margin-bottom:3px">${ab.name}</div>
              <div style="font-size:.8rem;color:var(--c-silver);font-style:italic">${ab.desc || ''}</div>
            </div>
            <span style="font-family:var(--font-title);font-size:.7rem;color:var(--c-ember);border:1px solid var(--c-ember-dim);border-radius:99px;padding:2px 10px;white-space:nowrap">${ab.power}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderHistory() {
    if (!STATE.chronicle.length) {
      return `<p style="color:var(--c-stone);font-style:italic;text-align:center;padding:32px">The chronicle is empty.</p>`;
    }
    const typeColors = { action:'var(--c-ember)', event:'var(--c-arcane)', system:'var(--c-frost)', warning:'var(--c-fire)' };
    return `
      <div style="display:flex;flex-direction:column;gap:6px;max-height:360px;overflow-y:auto">
        ${STATE.chronicle.slice(0, 40).map(e => `
          <div style="padding:8px 12px;background:var(--c-abyss);border-left:3px solid ${typeColors[e.type]||'var(--c-mist)'};border-radius:0 6px 6px 0;font-size:.82rem;color:var(--c-silver)">
            <span style="color:var(--c-stone);font-size:.7rem;margin-right:6px">Day ${e.day}</span>${e.text}
          </div>
        `).join('')}
      </div>
    `;
  },

  renderLore() {
    const type = STATE.type;
    const stage = STATE.stageIndex;
    return `
      <div style="display:flex;flex-direction:column;gap:16px">
        <div style="background:var(--c-abyss);border:1px solid var(--c-mist);border-radius:12px;padding:20px">
          <div style="font-family:var(--font-display);color:var(--c-star);font-size:1.1rem;margin-bottom:8px">${type?.name || '?'} Dragon</div>
          <p style="color:var(--c-silver);font-style:italic;line-height:1.7">${type?.lore || 'A dragon of unknown origin.'}</p>
        </div>
        <div style="background:var(--c-abyss);border:1px solid var(--c-mist);border-radius:12px;padding:20px">
          <div style="font-family:var(--font-title);color:var(--c-ember);font-size:.8rem;letter-spacing:.1em;margin-bottom:10px">EVOLUTION PATH</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${(type?.evolutionNames || CONFIG.STAGES).map((name, i) => `
              <div style="display:flex;align-items:center;gap:10px;opacity:${i <= stage ? 1 : .35}">
                <span style="font-size:1.4rem">${type?.evolutionIcons?.[i] || '•'}</span>
                <div>
                  <div style="font-family:var(--font-title);color:${i === stage ? 'var(--c-ember)' : 'var(--c-moon)'};font-size:.88rem">${name}</div>
                  <div style="font-size:.72rem;color:var(--c-stone)">${i < stage ? '✓ Reached' : i === stage ? '← Current' : 'Locked'}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div style="background:var(--c-abyss);border:1px solid var(--c-mist);border-radius:12px;padding:20px">
          <div style="font-family:var(--font-title);color:var(--c-ember);font-size:.8rem;letter-spacing:.1em;margin-bottom:10px">LINEAGE BONUSES</div>
          ${Object.entries(type?.bonuses || {}).map(([k,v]) => `<div style="font-size:.85rem;color:var(--c-nourish)">+${v} ${k}</div>`).join('')}
          ${Object.entries(type?.penalties || {}).map(([k,v]) => `<div style="font-size:.85rem;color:var(--c-fire)">${v} ${k}</div>`).join('')}
        </div>
      </div>
    `;
  },
};

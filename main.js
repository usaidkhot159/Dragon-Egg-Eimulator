// js/main.js — Bootstrap, screen flow, and game start

(function () {
  'use strict';

  let selectedType = null;

  // ── Boot ──
  document.addEventListener('DOMContentLoaded', () => {
    Particles.init();
    Ticker.init();
    Tome.init();
    Actions.init();
    bindModalClose();
    bindTomeButton();
    bindResetButton();

    // Try to resume saved game
    if (Save.load()) {
      resumeGame();
    } else {
      UI.showScreen('screen-title');
    }
  });

  // ── Title screen ──
  document.getElementById('btn-begin')?.addEventListener('click', () => {
    UI.showScreen('screen-name');
    buildNameScreen();
  });

  // ── Name screen ──
  function buildNameScreen() {
    UI.buildEggTypeGrid(null, (type) => {
      selectedType = type;
      validateNameScreen();
    });

    const input = document.getElementById('dragon-name-input');
    input?.addEventListener('input', validateNameScreen);
  }

  function validateNameScreen() {
    const input = document.getElementById('dragon-name-input');
    const btn   = document.getElementById('btn-confirm-name');
    if (!btn || !input) return;
    const valid = input.value.trim().length >= 2 && selectedType !== null;
    btn.disabled = !valid;
  }

  document.getElementById('btn-confirm-name')?.addEventListener('click', () => {
    const input = document.getElementById('dragon-name-input');
    if (!input || !selectedType) return;

    const name = input.value.trim();
    STATE.name = name;
    STATE.type = selectedType;
    STATE.currentTheme = selectedType.baseTheme;

    // Apply lineage bonuses
    Object.entries(selectedType.bonuses || {}).forEach(([k, v]) => STATE.addStat(k, v));
    Object.entries(selectedType.penalties || {}).forEach(([k, v]) => STATE.addStat(k, v));

    // Grant starting ability
    if (selectedType.startAbility) {
      AbilitySystem.unlock({ id: 'start_' + selectedType.id, ...selectedType.startAbility });
    }

    STATE.addChronicle(`${name} the ${selectedType.name} dragon — a legend begins.`, 'system');

    startGame();
  });

  // ── Start / Resume ──
  function startGame() {
    Progression.init();
    UI.showScreen('screen-game');
    UI.refresh();

    // Welcome lore
    const type = STATE.type;
    UI.updateLore(
      `${type?.evolutionNames?.[0] || 'The Egg'} Awakens`,
      type?.lore || 'Your journey begins here, Keeper.'
    );

    UI.addLog(`🐉 ${STATE.name} the ${type?.name} dragon is in your care.`, 'system');
    UI.toast(`Welcome, Keeper of ${STATE.name}!`, 'good');

    // Intro particle burst
    setTimeout(() => {
      const dc = document.getElementById('dragon-container');
      if (dc) {
        const r = dc.getBoundingClientRect();
        Particles.spawn(r.left + r.width/2, r.top + r.height/2, 20);
      }
    }, 600);
  }

  function resumeGame() {
    Progression.init();
    UI.showScreen('screen-game');
    UI.refresh();
    UI.addLog(`🐉 Welcome back, Keeper. ${STATE.name} missed you.`, 'system');
    UI.toast(`${STATE.name} is glad you returned!`, 'good');
  }

  // ── Reset ──
  function bindResetButton() {
    document.getElementById('btn-reset')?.addEventListener('click', () => {
      if (!confirm(`Release ${STATE.name} and start anew? This cannot be undone.`)) return;
      if (STATE._tickTimer) clearInterval(STATE._tickTimer);
      Save.clear();
      location.reload();
    });
  }

  // ── Tome button ──
  function bindTomeButton() {
    document.getElementById('btn-tome')?.addEventListener('click', () => {
      Tome.open();
    });
  }

  // ── Modal close ──
  function bindModalClose() {
    document.getElementById('btn-close-tome')?.addEventListener('click', () => {
      UI.closeModal('modal-tome');
    });
    document.querySelectorAll('.modal-backdrop').forEach(el => {
      el.addEventListener('click', () => {
        UI.closeModal('modal-tome');
      });
    });
  }

})();

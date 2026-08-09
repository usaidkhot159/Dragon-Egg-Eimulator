// js/actions.js — Action button handlers

const Actions = {
  init() {
    const ids = ['warmth','bond','feed','play','train','sleep'];
    ids.forEach(id => {
      const btn = document.getElementById(`act-${id}`);
      if (btn) btn.addEventListener('click', () => this.do(id));
    });

    // Dragon container tap
    const dc = document.getElementById('dragon-container');
    if (dc) dc.addEventListener('click', () => this.tap());
  },

  do(action) {
    if (STATE.gameOver) return;
    if (STATE.isOnCooldown(action)) {
      UI.toast('Not yet...', '');
      return;
    }

    const cfg = CONFIG.ACTIONS[action];
    if (!cfg) return;

    // Apply stat deltas
    if (cfg.warmth)  STATE.addStat('warmth',  cfg.warmth);
    if (cfg.bond)    STATE.addStat('bond',     cfg.bond);
    if (cfg.energy)  STATE.addStat('energy',   cfg.energy);
    if (cfg.nourish) STATE.addStat('nourish',  cfg.nourish);

    const leveled = STATE.addXp(cfg.xp);

    STATE.setCooldown(action);
    STATE.recalcAppearance();

    // Visual feedback
    UI.flashAction(`act-${action}`);
    UI.updateStats();
    UI.updateXp();

    // Particles at dragon center
    const dc = document.getElementById('dragon-container');
    if (dc) {
      const r = dc.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top  + r.height / 2;
      const colors = { warmth:'#FF7840', bond:'#E040C8', feed:'#40E870', play:'#FFD040', train:'#9B5CF6', sleep:'#40C8E8' };
      Particles.spawn(cx, cy, 10, colors[action]);
    }

    // Log
    const messages = {
      warmth: [`You cup the egg in warm hands.`, `Heat flows through your palms into the shell.`, `A gentle warmth soothes the dragon within.`],
      bond:   [`You whisper ancient words of bonding.`, `${STATE.name} stirs at the sound of your voice.`, `A invisible thread strengthens between you.`],
      feed:   [`You offer a tender morsel.`, `${STATE.name} eats eagerly, tail flicking with delight.`, `Nourishment accepted with a grateful rumble.`],
      play:   [`You tease ${STATE.name} with a shining bauble.`, `${STATE.name} chases the light with glee!`, `Laughter fills the air as you play together.`],
      train:  [`You guide ${STATE.name} through combat stances.`, `${STATE.name} focuses intently, absorbing every lesson.`, `Power grows with discipline and practice.`],
      sleep:  [`${STATE.name} curls up and slumbers deeply.`, `Rest restores the energy spent in play.`, `Soft snores echo through the chamber.`],
    };
    const pool = messages[action] || [cfg.label + '!'];
    const msg  = pool[Math.floor(Math.random() * pool.length)];
    UI.addLog(msg, 'action');

    // Check stat abilities
    const newAbs = AbilitySystem.checkStatUnlocks();
    if (newAbs.length) {
      newAbs.forEach(ab => {
        UI.addLog(`✨ New ability unlocked: ${ab.name}!`, 'event');
        UI.toast(`New Ability: ${ab.icon} ${ab.name}`, 'special');
      });
      UI.updateAbilityList();
    }

    // Update appearance if theme changed
    UI.renderDragon();

    if (leveled) Progression.handleLevelUp();
  },

  tap() {
    // Clicking the dragon gives small bond + XP
    if (STATE.isOnCooldown('tap')) return;
    STATE._cooldowns['tap'] = Date.now() + 800;
    STATE.addStat('bond', 2);
    STATE.addXp(3);
    UI.updateStats();
    UI.updateXp();

    const dc = document.getElementById('dragon-container');
    if (dc) {
      const r = dc.getBoundingClientRect();
      Particles.spawn(r.left + r.width/2, r.top + r.height/2, 5, '#E040C8');
      Particles.spawnSparkleRing(dc);
    }

    const taps = [
      `${STATE.name} nuzzles into your hand.`,
      `A warm rumble. ${STATE.name} enjoys the attention.`,
      `${STATE.name} blinks slowly — a dragon's trust.`,
      `The scales feel warm beneath your touch.`,
      `${STATE.name} tilts their head curiously.`,
    ];
    UI.addLog(taps[Math.floor(Math.random() * taps.length)], 'action');
  },
};

// js/abilities.js — Ability pool & unlock system

const ABILITY_POOL = {
  // ── Universal ──
  flameBreath:   { name: 'Flame Breath',   icon: '🔥', power: 'Medium', stage: 1, desc: 'Classic dragon fire.' },
  wingBlast:     { name: 'Wing Blast',     icon: '💨', power: 'Low',    stage: 1, desc: 'Batters foes with massive wings.' },
  ironScales:    { name: 'Iron Scales',    icon: '🛡️', power: 'Medium', stage: 2, desc: 'Scales harden for defense.' },
  tailSwipe:     { name: 'Tail Swipe',     icon: '⚔️', power: 'Medium', stage: 2, desc: 'A wide sweeping tail strike.' },
  dragonRoar:    { name: 'Dragon Roar',    icon: '📣', power: 'High',   stage: 3, desc: 'Shakes the earth itself.' },
  airSupremacy:  { name: 'Air Supremacy',  icon: '🌪️', power: 'High',   stage: 3, desc: 'Dominates the sky completely.' },
  // ── Fire line ──
  infernoBlast:  { name: 'Inferno Blast',  icon: '🌋', power: 'Very High', stage: 3, type: 'inferno', desc: 'A cone of volcanic fire.' },
  lavaBath:      { name: 'Lava Bath',      icon: '🔴', power: 'High',   stage: 4, type: 'inferno', desc: 'Coats self in molten rock.' },
  solarFlare:    { name: 'Solar Flare',    icon: '☀️', power: 'Max',    stage: 5, type: 'inferno', desc: 'Channels the sun itself.' },
  // ── Frost line ──
  blizzardCall:  { name: 'Blizzard Call',  icon: '🌨️', power: 'High',   stage: 3, type: 'glacial', desc: 'Summons a howling blizzard.' },
  deepFreeze:    { name: 'Deep Freeze',    icon: '🧊', power: 'Very High', stage: 4, type: 'glacial', desc: 'Encases targets in eternal ice.' },
  absoluteZero:  { name: 'Absolute Zero',  icon: '❄️', power: 'Max',    stage: 5, type: 'glacial', desc: 'Stops all motion. All of it.' },
  // ── Arcane line ──
  mindShatter:   { name: 'Mind Shatter',   icon: '🔮', power: 'High',   stage: 3, type: 'arcane', desc: 'Tears through mental defenses.' },
  runeBarrage:   { name: 'Rune Barrage',   icon: '✨', power: 'Very High', stage: 4, type: 'arcane', desc: 'A storm of arcane runes.' },
  realityTear:   { name: 'Reality Tear',   icon: '🌀', power: 'Max',    stage: 5, type: 'arcane', desc: 'Opens a rift in space itself.' },
  // ── Storm line ──
  chainLightning:{ name: 'Chain Lightning',icon: '⚡', power: 'High',   stage: 3, type: 'storm', desc: 'Arcs between multiple targets.' },
  thunderDome:   { name: 'Thunder Dome',   icon: '🌩️', power: 'Very High', stage: 4, type: 'storm', desc: 'An electromagnetic barrier.' },
  tempestGod:    { name: 'Tempest God',    icon: '🌪️', power: 'Max',    stage: 5, type: 'storm', desc: 'Becomes the storm.' },
  // ── Verdant line ──
  thicketSurge:  { name: 'Thicket Surge',  icon: '🌿', power: 'High',   stage: 3, type: 'verdant', desc: 'Roots erupt everywhere.' },
  lifeDrain:     { name: 'Life Drain',     icon: '🌱', power: 'Very High', stage: 4, type: 'verdant', desc: 'Siphons life from the earth.' },
  worldTree:     { name: 'World Tree',     icon: '🌳', power: 'Max',    stage: 5, type: 'verdant', desc: 'Becomes one with all nature.' },
  // ── Void line ──
  phaseBarrage:  { name: 'Phase Barrage',  icon: '🌑', power: 'High',   stage: 3, type: 'void', desc: 'Attacks from between dimensions.' },
  voidPull:      { name: 'Void Pull',      icon: '⚫', power: 'Very High', stage: 4, type: 'void', desc: 'Drags foes into the abyss.' },
  eventHorizon:  { name: 'Event Horizon',  icon: '♾️', power: 'Max',    stage: 5, type: 'void', desc: 'Creates a miniature singularity.' },
  // ── Bond-earned ──
  soulShield:    { name: 'Soul Shield',    icon: '💖', power: 'High',   stat: 'bond',   threshold: 200, desc: 'Bond protects against all harm.' },
  empathyAura:   { name: 'Empathy Aura',   icon: '💫', power: 'Medium', stat: 'bond',   threshold: 100, desc: 'The dragon feels your feelings.' },
  // ── Train-earned ──
  berserkerRage: { name: 'Berserker Rage', icon: '💢', power: 'Very High', stat: 'energy', threshold: 300, desc: 'Loses control but gains immense power.' },
  precisionStrike:{ name:'Precision Strike',icon: '🎯', power: 'High',  stat: 'energy', threshold: 150, desc: 'Every attack finds its mark.' },
};

const AbilitySystem = {
  getUnlocksForStage(stageIndex, dragonType) {
    const type = dragonType?.id;
    return Object.entries(ABILITY_POOL)
      .filter(([, a]) => {
        if (a.stage !== stageIndex) return false;
        if (a.type && a.type !== type) return false;
        if (a.stat) return false;
        return true;
      })
      .map(([id, a]) => ({ id, ...a }));
  },

  getStatUnlocks(careHistory) {
    return Object.entries(ABILITY_POOL)
      .filter(([, a]) => {
        if (!a.stat) return false;
        return (careHistory[a.stat] || 0) >= a.threshold;
      })
      .map(([id, a]) => ({ id, ...a }));
  },

  hasAbility(abilityId) {
    return STATE.abilities.some(a => a.id === abilityId);
  },

  unlock(ability) {
    if (this.hasAbility(ability.id)) return false;
    STATE.abilities.push(ability);
    return true;
  },

  checkStatUnlocks() {
    const unlocks = this.getStatUnlocks(STATE.careHistory);
    let gained = [];
    for (const ab of unlocks) {
      if (!this.hasAbility(ab.id)) {
        this.unlock(ab);
        gained.push(ab);
      }
    }
    return gained;
  },
};

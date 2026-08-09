// js/config.js — Game constants & tuning

const CONFIG = {
  // Stat decay per game tick (ms)
  TICK_MS: 4000,
  DECAY: { warmth: 2, bond: 1, energy: 1.5, nourish: 2 },

  // XP thresholds per stage
  STAGES: ['Egg','Hatchling','Juvenile','Young Adult','Adult','Ancient'],
  XP_PER_STAGE: [100, 250, 500, 900, 1500],

  // Action XP rewards
  ACTIONS: {
    warmth: { warmth: 12, xp: 6,  energy: -3,  label: 'Warmed' },
    bond:   { bond: 15,   xp: 10, energy: -4,  label: 'Bonded' },
    feed:   { nourish: 15,xp: 7,  energy: 5,   label: 'Fed' },
    play:   { bond: 8,    xp: 12, energy: -10, nourish: -4, label: 'Played' },
    train:  { energy: -12,xp: 18, bond: 5,     label: 'Trained' },
    sleep:  { energy: 30, xp: 3,  warmth: -5,  label: 'Rested' },
  },

  // Cooldowns in ms
  COOLDOWNS: {
    warmth: 1500, bond: 2000, feed: 3000,
    play: 2500,   train: 4000, sleep: 6000,
  },

  // Seasons
  SEASONS: ['🌸 Spring','☀️ Summer','🍂 Autumn','❄️ Winter'],
  DAYS_PER_SEASON: 7,

  // Stat danger threshold
  DANGER_THRESHOLD: 20,
  CRITICAL_THRESHOLD: 8,

  // Appearance modifiers based on dominant stat
  APPEARANCE_MAP: {
    warmth:  { theme: 'theme-fire',   title: 'Ember-born',  aura: '#FF7840' },
    bond:    { theme: 'theme-arcane', title: 'Soul-bonded',  aura: '#9B5CF6' },
    energy:  { theme: 'theme-ember',  title: 'Storm-touched',aura: '#FFD040' },
    nourish: { theme: 'theme-venom',  title: 'Forest-kin',   aura: '#58E840' },
  },

  // Low-care appearance penalty
  NEGLECT_THEME: 'theme-void',

  VERSION: '1.0.0',
};

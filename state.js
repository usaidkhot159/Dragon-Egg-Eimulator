// js/state.js — Central game state

const STATE = {
  // Dragon identity
  name: '',
  type: null,      // dragon type key
  stageIndex: 0,   // 0=Egg … 5=Ancient
  xp: 0,
  totalXp: 0,

  // Stats (0–100)
  stats: { warmth: 80, bond: 50, energy: 80, nourish: 70 },

  // Progression
  abilities: [],
  abilitySlots: 5,
  evolutionLog: [],

  // World
  day: 1,
  seasonIndex: 0,
  tickCount: 0,

  // Appearance
  currentTheme: 'theme-fire',
  neglected: false,
  dominantStat: 'warmth',

  // Care history (affects appearance)
  careHistory: { warmth: 0, bond: 0, energy: 0, nourish: 0 },

  // Tome / chronicle
  chronicle: [],
  toastQueue: [],

  // Flags
  hatched: false,
  gameOver: false,

  // Timers
  _tickTimer: null,
  _cooldowns: {},

  // ── Helpers ──

  get stage() { return CONFIG.STAGES[this.stageIndex]; },

  get xpToNext() {
    return CONFIG.XP_PER_STAGE[this.stageIndex] ?? Infinity;
  },

  get xpPct() {
    const cap = this.xpToNext;
    return cap === Infinity ? 100 : Math.min(100, (this.xp / cap) * 100);
  },

  statPct(key) {
    return Math.round(Math.min(100, Math.max(0, this.stats[key])));
  },

  addXp(amount) {
    this.xp += amount;
    this.totalXp += amount;
    if (this.xp >= this.xpToNext && this.stageIndex < CONFIG.STAGES.length - 1) {
      this.xp -= this.xpToNext;
      this.stageIndex++;
      return true; // leveled up
    }
    return false;
  },

  addStat(key, delta) {
    this.stats[key] = Math.min(100, Math.max(0, (this.stats[key] || 0) + delta));
    if (delta > 0) this.careHistory[key] = (this.careHistory[key] || 0) + delta;
  },

  recalcAppearance() {
    // Find dominant care stat
    const keys = Object.keys(this.careHistory);
    const dom = keys.reduce((a, b) => this.careHistory[a] > this.careHistory[b] ? a : b, keys[0]);
    this.dominantStat = dom;

    // Check neglect: average stat < 30
    const avg = Object.values(this.stats).reduce((a, b) => a + b, 0) / 4;
    this.neglected = avg < 30;

    if (this.neglected) {
      this.currentTheme = CONFIG.NEGLECT_THEME;
    } else {
      this.currentTheme = CONFIG.APPEARANCE_MAP[dom]?.theme || 'theme-fire';
    }
  },

  addChronicle(text, type = 'action') {
    const entry = { text, type, day: this.day };
    this.chronicle.unshift(entry);
    if (this.chronicle.length > 60) this.chronicle.pop();
    return entry;
  },

  isOnCooldown(action) {
    const cd = this._cooldowns[action];
    return cd && Date.now() < cd;
  },

  setCooldown(action) {
    this._cooldowns[action] = Date.now() + CONFIG.COOLDOWNS[action];
  },

  serialize() {
    return JSON.stringify({
      name: this.name, type: this.type, stageIndex: this.stageIndex,
      xp: this.xp, totalXp: this.totalXp, stats: { ...this.stats },
      abilities: [...this.abilities], day: this.day, seasonIndex: this.seasonIndex,
      careHistory: { ...this.careHistory }, chronicle: this.chronicle.slice(0, 20),
      evolutionLog: this.evolutionLog, currentTheme: this.currentTheme,
      dominantStat: this.dominantStat, hatched: this.hatched,
    });
  },

  hydrate(data) {
    Object.assign(this, data);
    this.stats = data.stats || { warmth: 80, bond: 50, energy: 80, nourish: 70 };
    this.abilities = data.abilities || [];
    this.careHistory = data.careHistory || { warmth: 0, bond: 0, energy: 0, nourish: 0 };
    this.chronicle = data.chronicle || [];
    this.evolutionLog = data.evolutionLog || [];
  },
};

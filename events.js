// js/events.js — Random world events & seasonal effects

const WORLD_EVENTS = [
  {
    id: 'meteor_shower',
    title: 'Meteor Shower',
    msg: 'Meteors streak across the sky! Your dragon is energized by the cosmic display.',
    effect: { energy: 20, xp: 15 },
    type: 'good',
    lore: 'The stars fell close tonight, leaving trails of arcane dust.',
  },
  {
    id: 'volcanic_wind',
    title: 'Volcanic Wind',
    msg: 'Hot winds blow from the Ember Peaks! Warmth surges.',
    effect: { warmth: 25 },
    type: 'good',
    lore: 'The mountain breathes, and your dragon drinks its warmth.',
  },
  {
    id: 'blood_moon',
    title: 'Blood Moon',
    msg: 'A crimson moon rises. Power swells, but unrest follows.',
    effect: { energy: 30, bond: -10 },
    type: 'mixed',
    lore: 'Ancient instincts stir. Even tame dragons feel the call of the wild.',
  },
  {
    id: 'forest_bounty',
    title: 'Forest Bounty',
    msg: 'Wild creatures offer tribute to your dragon. Nourishment overflows!',
    effect: { nourish: 30, xp: 10 },
    type: 'good',
    lore: 'The forest recognizes power and pays its respects.',
  },
  {
    id: 'arcane_storm',
    title: 'Arcane Storm',
    msg: 'A storm of wild magic passes through! Your dragon absorbs the energy.',
    effect: { bond: 20, xp: 20, energy: -10 },
    type: 'mixed',
    lore: 'Rogue spells crackle harmlessly through your dragon\'s scales.',
  },
  {
    id: 'wandering_sage',
    title: 'Wandering Sage',
    msg: 'An old sage visits and teaches your dragon forgotten lore. +30 XP!',
    effect: { xp: 30, bond: 10 },
    type: 'good',
    lore: '"I have waited long to meet one such as this," the sage whispers.',
  },
  {
    id: 'cursed_mist',
    title: 'Cursed Mist',
    msg: 'A dark mist rolls in. Your dragon feels drained...',
    effect: { energy: -20, warmth: -10 },
    type: 'bad',
    lore: 'Something ancient and hungry passed close tonight.',
  },
  {
    id: 'rival_dragon',
    title: 'Rival Dragon!',
    msg: 'A wild dragon challenges yours to a test of strength! The confrontation boosts your dragon.',
    effect: { energy: 15, bond: 15, xp: 25 },
    type: 'mixed',
    lore: 'Your dragon held its ground. The rival departed with a respectful bow.',
  },
  {
    id: 'treasure_discovery',
    title: 'Treasure Hoard!',
    msg: 'Your dragon discovers a hidden treasure room! Joy and excitement flood its senses.',
    effect: { bond: 25, nourish: 15, xp: 20 },
    type: 'good',
    lore: 'Gold and jewels scatter everywhere. Your dragon rolls in them gleefully.',
  },
  {
    id: 'cold_snap',
    title: 'Sudden Cold',
    msg: 'Temperature plummets overnight. Warmth depletes rapidly.',
    effect: { warmth: -25, nourish: -10 },
    type: 'bad',
    lore: 'Even dragons shiver. Tend carefully to the warmth tonight.',
  },
  {
    id: 'star_alignment',
    title: 'Star Alignment',
    msg: 'The stars align in your dragon\'s constellation. All stats boosted!',
    effect: { warmth: 10, bond: 10, energy: 10, nourish: 10, xp: 35 },
    type: 'legendary',
    lore: 'Once a season, the heavens remember your dragon\'s name.',
  },
  {
    id: 'ancient_song',
    title: 'Ancient Melody',
    msg: 'A haunting melody drifts from the mountains. Your dragon is soothed and bonded.',
    effect: { bond: 30, warmth: 10 },
    type: 'good',
    lore: 'The song is older than memory. Dragons once sang it to the first stars.',
  },
];

const SEASONAL_EFFECTS = {
  0: { name: '🌸 Spring', warmth: +1, nourish: +1, label: 'Life blooms everywhere.' },
  1: { name: '☀️ Summer', warmth: +3, energy: +1, label: 'Heat amplifies growth.' },
  2: { name: '🍂 Autumn', nourish: +2, bond: +1, label: 'Harvest time, quiet bonds.' },
  3: { name: '❄️ Winter', warmth: -2, nourish: -1, energy: -1, label: 'The cold tests resolve.' },
};

const EventSystem = {
  lastEvent: null,
  eventChance: 0.18, // 18% per tick

  roll() {
    if (Math.random() > this.eventChance) return null;
    // Filter out last event to avoid repeats
    const pool = WORLD_EVENTS.filter(e => e.id !== this.lastEvent);
    const event = pool[Math.floor(Math.random() * pool.length)];
    this.lastEvent = event.id;
    return event;
  },

  apply(event) {
    const { effect } = event;
    if (effect.warmth)  STATE.addStat('warmth',  effect.warmth);
    if (effect.bond)    STATE.addStat('bond',     effect.bond);
    if (effect.energy)  STATE.addStat('energy',   effect.energy);
    if (effect.nourish) STATE.addStat('nourish',  effect.nourish);
    if (effect.xp)      STATE.addXp(effect.xp);
  },

  applySeasonalDecay() {
    const s = SEASONAL_EFFECTS[STATE.seasonIndex];
    if (!s) return;
    for (const [k, v] of Object.entries(s)) {
      if (['warmth','bond','energy','nourish'].includes(k)) {
        STATE.addStat(k, v * 0.5);
      }
    }
  },

  advanceDay() {
    STATE.day++;
    STATE.tickCount++;

    // Advance season
    const newSeason = Math.floor((STATE.day - 1) / CONFIG.DAYS_PER_SEASON) % 4;
    if (newSeason !== STATE.seasonIndex) {
      STATE.seasonIndex = newSeason;
      return { seasonChanged: true, season: SEASONAL_EFFECTS[newSeason] };
    }
    return { seasonChanged: false };
  },
};

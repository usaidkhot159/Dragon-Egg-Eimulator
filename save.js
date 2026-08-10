// js/save.js — Persist & restore game state

const Save = {
  KEY: 'dragon_egg_sim_v1',

  save() {
    try {
      localStorage.setItem(this.KEY, STATE.serialize());
    } catch (e) {
      // storage full or blocked — silently ignore
    }
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data.name || !data.type) return false;
      STATE.hydrate(data);
      // Re-attach type object
      STATE.type = DRAGON_TYPES[data.type] || null;
      return true;
    } catch (e) {
      return false;
    }
  },

  clear() {
    localStorage.removeItem(this.KEY);
  },

  hasSave() {
    try {
      return !!localStorage.getItem(this.KEY);
    } catch {
      return false;
    }
  },
};

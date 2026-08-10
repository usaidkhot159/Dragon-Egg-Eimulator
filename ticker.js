// js/ticker.js — Bottom event ticker

const Ticker = {
  queue: [],
  current: null,
  timer: null,

  AMBIENT: [
    'The stars watch over your dragon tonight...',
    'Distant thunder rolls across the Ember Peaks.',
    'A raven lands nearby and watches curiously.',
    'Wind whispers through the ancient spires.',
    'The scent of adventure lingers in the air.',
    'Far away, another dragon roars into the night.',
    'Moonlight makes your dragon\'s scales shimmer.',
    'The old prophecies stir in forgotten tomes.',
    'Keeper and dragon — a bond forged in fire.',
    'Every day brings your dragon closer to legend.',
    'The world holds its breath when a dragon grows.',
    'Ancient songs echo from the mountain peaks.',
  ],

  init() {
    this.cycle();
  },

  set(msg) {
    this.queue.push(msg);
    if (!this.current) this._show();
  },

  cycle() {
    this._show();
    setInterval(() => {
      if (!this.queue.length) {
        const msg = this.AMBIENT[Math.floor(Math.random() * this.AMBIENT.length)];
        this.set(msg);
      }
    }, 8000);
  },

  _show() {
    const msg = this.queue.shift() || this.AMBIENT[Math.floor(Math.random() * this.AMBIENT.length)];
    const el  = document.getElementById('ticker-msg');
    if (!el) return;

    this.current = msg;
    el.style.animation = 'none';
    void el.offsetWidth; // reflow
    el.textContent = msg;
    el.style.animation = 'ticker-in .4s ease both';

    clearTimeout(this.timer);
    this.timer = setTimeout(() => { this.current = null; }, 7500);
  },
};

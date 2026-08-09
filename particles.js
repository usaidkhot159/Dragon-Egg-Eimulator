// js/particles.js — Canvas particle engine + DOM burst effects

const Particles = {
  canvas: null,
  ctx: null,
  particles: [],
  running: false,
  raf: null,

  init() {
    this.canvas = document.getElementById('particle-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.running = true;
    this.spawnAmbient();
    this.loop();
  },

  resize() {
    if (!this.canvas) return;
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  typeColor() {
    const map = {
      inferno: ['#FF7840','#E84040','#FFD040'],
      glacial: ['#40C8E8','#80E0FF','#C0F0FF'],
      arcane:  ['#9B5CF6','#C090FF','#E8A0FF'],
      storm:   ['#FFD040','#FFF080','#80C0FF'],
      verdant: ['#58E840','#A0FF80','#40E8A0'],
      void:    ['#9E97C4','#C0B8FF','#707090'],
    };
    const colors = map[STATE.type?.id] || ['#E8A030','#FFD080','#FF8040'];
    return colors[Math.floor(Math.random() * colors.length)];
  },

  spawnAmbient() {
    const spawn = () => {
      if (!this.running) return;
      this.particles.push(this.makeAmbient());
      const delay = 300 + Math.random() * 600;
      setTimeout(spawn, delay);
    };
    spawn();
  },

  makeAmbient() {
    const x = Math.random() * window.innerWidth;
    return {
      x, y: window.innerHeight + 10,
      vx: (Math.random() - .5) * .8,
      vy: -(1 + Math.random() * 2),
      size: 1.5 + Math.random() * 3,
      color: this.typeColor(),
      alpha: .7 + Math.random() * .3,
      life: 1, decay: .003 + Math.random() * .005,
      type: 'ambient',
    };
  },

  spawn(x, y, count = 12, colorOverride = null) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * .4;
      const speed = 1.5 + Math.random() * 4;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 2 + Math.random() * 4,
        color: colorOverride || this.typeColor(),
        alpha: 1,
        life: 1, decay: .025 + Math.random() * .02,
        type: 'burst',
        gravity: .08,
      });
    }
  },

  spawnHatch(x, y) {
    // Big dramatic burst
    this.spawn(x, y, 40);
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 8;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: 4 + Math.random() * 8,
        color: this.typeColor(),
        alpha: 1,
        life: 1, decay: .012 + Math.random() * .01,
        type: 'burst',
        gravity: .12,
      });
    }
  },

  spawnLevelUp(x, y) {
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 6;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 2 + Math.random() * 5,
        color: ['#9B5CF6','#E8A030','#F0ECFF'][Math.floor(Math.random()*3)],
        alpha: 1,
        life: 1, decay: .01 + Math.random() * .015,
        type: 'burst',
        gravity: .06,
      });
    }
  },

  loop() {
    if (!this.running || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles = this.particles.filter(p => p.life > 0);

    for (const p of this.particles) {
      p.x  += p.vx;
      p.y  += p.vy;
      if (p.gravity) p.vy += p.gravity;
      if (p.type === 'ambient') p.vx += (Math.random() - .5) * .1;
      p.life -= p.decay;
      p.alpha = Math.max(0, p.life);

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha * .85;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = p.size * 3;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();
      this.ctx.restore();
    }

    this.raf = requestAnimationFrame(() => this.loop());
  },

  stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
  },

  // DOM sparkle ring at element center
  spawnSparkleRing(el) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const ring = document.createElement('div');
    ring.className = 'sparkle-ring';
    ring.style.cssText = `left:${cx}px;top:${cy}px;width:80px;height:80px;`;
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 900);
  },
};

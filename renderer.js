// js/renderer.js — SVG dragon/egg renderer for all 6 stages

const Renderer = {
  // Color per dragon type
  typeColor(type) {
    const map = {
      inferno: '#E84040', glacial: '#40C8E8', arcane: '#9B5CF6',
      storm: '#FFD040',   verdant: '#58E840', void: '#9E97C4',
    };
    return map[type] || '#E8A030';
  },

  // Main render entry
  render(container) {
    const stage = STATE.stageIndex;
    const type  = STATE.type;
    const color = this.typeColor(type?.id);
    const theme = STATE.currentTheme;

    container.innerHTML = '';

    let svg;
    if (stage === 0)      svg = this.drawEgg(color, type);
    else if (stage === 1) svg = this.drawHatchling(color);
    else if (stage === 2) svg = this.drawJuvenile(color);
    else if (stage === 3) svg = this.drawYoungAdult(color);
    else if (stage === 4) svg = this.drawAdult(color);
    else                  svg = this.drawAncient(color);

    svg.classList.add('dragon-svg', theme);
    this._applyStageAnimation(svg, stage);
    container.appendChild(svg);

    // Update pedestal glow color
    const glow = document.getElementById('pedestal-glow');
    if (glow) glow.style.background = `radial-gradient(circle, ${color}33 0%, transparent 70%)`;

    // Crack overlays for egg near hatching
    if (stage === 0) this._addCracks(container, STATE.xpPct);
  },

  _applyStageAnimation(svg, stage) {
    const anims = ['egg-glow-pulse','hatchling-bounce','juvenile-breathe','adult-float','adult-float','ancient-aura'];
    svg.style.animation = `${anims[stage]} ${[3,1.2,2.5,3.5,3.5,4][stage]}s ease-in-out infinite`;
  },

  _addCracks(container, pct) {
    if (pct < 40) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 160 200');
    svg.classList.add('egg-crack');
    svg.style.position = 'absolute';
    svg.style.top = '0'; svg.style.left = '0';
    svg.style.width = '100%'; svg.style.height = '100%';
    svg.style.pointerEvents = 'none';

    const crackData = [
      'M80,60 L70,80 L78,90',
      'M90,80 L105,100 L98,115',
      'M65,110 L60,130',
    ];
    const numCracks = pct >= 80 ? 3 : pct >= 60 ? 2 : 1;

    for (let i = 0; i < numCracks; i++) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', crackData[i]);
      path.setAttribute('stroke', 'rgba(255,200,100,.7)');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-linecap', 'round');
      path.style.strokeDasharray = '100';
      path.style.strokeDashoffset = '100';
      path.style.animation = `crack-appear .8s ${i * .3}s ease forwards`;
      svg.appendChild(path);
    }
    container.appendChild(svg);
  },

  // ── Stage SVGs ──

  drawEgg(color, type) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 160 200');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const c2 = this._lighten(color, 40);
    const c3 = this._darken(color, 40);
    svg.innerHTML = `
      <defs>
        <radialGradient id="eggGrad" cx="38%" cy="30%" r="65%">
          <stop offset="0%"   stop-color="${c2}" stop-opacity=".9"/>
          <stop offset="55%"  stop-color="${color}"/>
          <stop offset="100%" stop-color="${c3}"/>
        </radialGradient>
        <radialGradient id="eggSheen" cx="30%" cy="20%" r="40%">
          <stop offset="0%"  stop-color="white" stop-opacity=".35"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
        <filter id="eggGlow">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <!-- Shadow -->
      <ellipse cx="80" cy="188" rx="40" ry="6" fill="rgba(0,0,0,.35)"/>
      <!-- Egg body -->
      <ellipse cx="80" cy="105" rx="52" ry="68" fill="url(#eggGrad)" filter="url(#eggGlow)"/>
      <!-- Scale pattern -->
      ${this._eggScales(color)}
      <!-- Sheen -->
      <ellipse cx="80" cy="105" rx="52" ry="68" fill="url(#eggSheen)"/>
      <!-- Rune glyph -->
      <text x="80" y="116" text-anchor="middle" font-size="28" fill="rgba(255,255,255,.25)" font-family="serif">${type?.evolutionIcons?.[0] || '🥚'}</text>
    `;
    return svg;
  },

  _eggScales(color) {
    const dim = this._darken(color, 25);
    let out = '';
    const rows = [[55,80],[45,95],[55,110],[45,125],[55,140],[48,155]];
    rows.forEach(([x, y]) => {
      for (let i = 0; i < 4; i++) {
        out += `<ellipse cx="${x + i*20}" cy="${y}" rx="8" ry="5" fill="${dim}" fill-opacity=".3" transform="rotate(-15,${x+i*20},${y})"/>`;
      }
    });
    return out;
  },

  drawHatchling(color) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 220');
    const c2 = this._lighten(color, 30);
    const c3 = this._darken(color, 30);
    svg.innerHTML = `
      <defs>
        <radialGradient id="hGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stop-color="${c2}"/>
          <stop offset="100%" stop-color="${c3}"/>
        </radialGradient>
      </defs>
      <!-- Shadow -->
      <ellipse cx="100" cy="208" rx="45" ry="7" fill="rgba(0,0,0,.4)"/>
      <!-- Body -->
      <ellipse cx="100" cy="140" rx="42" ry="50" fill="url(#hGrad)"/>
      <!-- Tail -->
      <path d="M58,165 Q20,185 30,200 Q40,190 65,175" fill="${color}"/>
      <!-- Wings (small, folded) -->
      <path d="M62,120 Q35,100 40,85 Q55,105 70,115" fill="${c3}" opacity=".8"/>
      <path d="M138,120 Q165,100 160,85 Q145,105 130,115" fill="${c3}" opacity=".8"/>
      <!-- Neck + head -->
      <ellipse cx="100" cy="100" rx="22" ry="28" fill="url(#hGrad)"/>
      <!-- Snout -->
      <ellipse cx="100" cy="82" rx="14" ry="10" fill="${c2}"/>
      <!-- Eyes -->
      <circle cx="91" cy="94" r="6" fill="white"/>
      <circle cx="109" cy="94" r="6" fill="white"/>
      <circle cx="92" cy="94" r="4" fill="#1a0a0a"/>
      <circle cx="110" cy="94" r="4" fill="#1a0a0a"/>
      <circle cx="93" cy="93" r="1.5" fill="white"/>
      <circle cx="111" cy="93" r="1.5" fill="white"/>
      <!-- Nostrils -->
      <circle cx="96" cy="82" r="2" fill="${c3}" opacity=".6"/>
      <circle cx="104" cy="82" r="2" fill="${c3}" opacity=".6"/>
      <!-- Horn nubs -->
      <path d="M88,72 L84,58 L92,70" fill="${c3}"/>
      <path d="M112,72 L116,58 L108,70" fill="${c3}"/>
      <!-- Belly -->
      <ellipse cx="100" cy="150" rx="26" ry="34" fill="${c2}" opacity=".4"/>
      <!-- Claws -->
      <path d="M75,185 L68,195 M79,187 L73,198 M83,188 L78,199" stroke="${c3}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M125,185 L132,195 M121,187 L127,198 M117,188 L122,199" stroke="${c3}" stroke-width="2.5" stroke-linecap="round"/>
    `;
    return svg;
  },

  drawJuvenile(color) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 240 260');
    const c2 = this._lighten(color, 25);
    const c3 = this._darken(color, 35);
    svg.innerHTML = `
      <defs>
        <linearGradient id="jGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${c2}"/>
          <stop offset="100%" stop-color="${c3}"/>
        </linearGradient>
      </defs>
      <!-- Shadow -->
      <ellipse cx="120" cy="248" rx="55" ry="8" fill="rgba(0,0,0,.45)"/>
      <!-- Tail -->
      <path d="M70,200 Q20,230 10,250 Q35,240 75,215" fill="${c3}"/>
      <!-- Body -->
      <ellipse cx="120" cy="175" rx="55" ry="62" fill="url(#jGrad)"/>
      <!-- Wings (spread) -->
      <path d="M68,148 Q15,100 25,65 Q50,100 80,135" fill="${c3}" opacity=".85"/>
      <path d="M172,148 Q225,100 215,65 Q190,100 160,135" fill="${c3}" opacity=".85"/>
      <!-- Wing membranes -->
      <path d="M68,148 Q30,110 25,65 Q20,100 68,148" fill="${color}" opacity=".3"/>
      <path d="M172,148 Q210,110 215,65 Q220,100 172,148" fill="${color}" opacity=".3"/>
      <!-- Neck -->
      <path d="M95,125 Q90,90 100,70 L120,68 Q130,88 125,125" fill="url(#jGrad)"/>
      <!-- Head -->
      <ellipse cx="112" cy="62" rx="32" ry="28" fill="url(#jGrad)"/>
      <!-- Snout -->
      <path d="M90,60 Q80,48 85,40 Q105,52 130,50 Q135,40 125,60" fill="${c2}"/>
      <!-- Eyes -->
      <ellipse cx="96" cy="56" rx="9" ry="10" fill="${color}" stroke="${c3}" stroke-width="1"/>
      <ellipse cx="128" cy="56" rx="9" ry="10" fill="${color}" stroke="${c3}" stroke-width="1"/>
      <ellipse cx="96" cy="57" rx="5" ry="7" fill="#0a0a1a"/>
      <ellipse cx="128" cy="57" rx="5" ry="7" fill="#0a0a1a"/>
      <circle cx="94" cy="54" r="2" fill="white"/>
      <circle cx="126" cy="54" r="2" fill="white"/>
      <!-- Horns -->
      <path d="M88,38 L78,15 L92,36" fill="${c3}"/>
      <path d="M136,38 L146,15 L132,36" fill="${c3}"/>
      <!-- Spines down back -->
      <path d="M112,68 L108,60 M112,80 L107,73 M113,93 L107,87 M114,106 L108,100" stroke="${c3}" stroke-width="3" stroke-linecap="round"/>
      <!-- Belly scales -->
      <ellipse cx="120" cy="180" rx="35" ry="45" fill="${c2}" opacity=".3"/>
      <!-- Legs -->
      <path d="M80,215 L72,245 L85,248 L90,220" fill="${c3}"/>
      <path d="M160,215 L168,245 L155,248 L150,220" fill="${c3}"/>
      <!-- Claws -->
      <path d="M72,245 L65,255 M78,247 L72,257 M85,248 L80,258" stroke="${c3}" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M168,245 L175,255 M162,247 L168,257 M155,248 L160,258" stroke="${c3}" stroke-width="2" stroke-linecap="round" fill="none"/>
    `;
    return svg;
  },

  drawYoungAdult(color) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 280 300');
    const c2 = this._lighten(color, 20);
    const c3 = this._darken(color, 40);
    svg.innerHTML = `
      <defs>
        <radialGradient id="yaGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="${c2}"/>
          <stop offset="100%" stop-color="${c3}"/>
        </radialGradient>
        <filter id="yaGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <!-- Shadow -->
      <ellipse cx="140" cy="290" rx="70" ry="9" fill="rgba(0,0,0,.5)"/>
      <!-- Tail (sweeping) -->
      <path d="M80,240 Q10,270 5,295 Q40,275 90,255" fill="${c3}"/>
      <!-- Body -->
      <ellipse cx="142" cy="200" rx="72" ry="75" fill="url(#yaGrad)" filter="url(#yaGlow)"/>
      <!-- Wings -->
      <path d="M72,170 Q5,100 15,40 Q60,110 90,155" fill="${c3}"/>
      <path d="M212,170 Q275,100 265,40 Q220,110 190,155" fill="${c3}"/>
      <path d="M72,170 Q15,105 15,40" stroke="${color}" stroke-width="2" fill="none" opacity=".5"/>
      <path d="M212,170 Q265,105 265,40" stroke="${color}" stroke-width="2" fill="none" opacity=".5"/>
      <!-- Wing detail -->
      <path d="M15,40 Q60,110 90,155" fill="${color}" opacity=".2"/>
      <path d="M265,40 Q220,110 190,155" fill="${color}" opacity=".2"/>
      <!-- Neck -->
      <path d="M108,138 Q100,95 112,72 L140,68 Q152,92 145,138" fill="url(#yaGrad)"/>
      <!-- Head -->
      <ellipse cx="128" cy="65" rx="40" ry="34" fill="url(#yaGrad)" filter="url(#yaGlow)"/>
      <!-- Snout / jaw -->
      <path d="M98,65 Q82,50 88,36 Q118,55 150,52 Q158,38 148,65" fill="${c2}" opacity=".9"/>
      <!-- Nostrils with smoke -->
      <circle cx="106" cy="50" r="3" fill="${c3}"/>
      <circle cx="118" cy="48" r="3" fill="${c3}"/>
      <!-- Eyes (slit pupils) -->
      <ellipse cx="106" cy="58" rx="11" ry="13" fill="${color}" stroke="${c3}" stroke-width="1.5"/>
      <ellipse cx="148" cy="58" rx="11" ry="13" fill="${color}" stroke="${c3}" stroke-width="1.5"/>
      <rect x="103" y="51" width="6" height="14" rx="3" fill="#05020a"/>
      <rect x="145" y="51" width="6" height="14" rx="3" fill="#05020a"/>
      <circle cx="104" cy="55" r="2" fill="white"/>
      <circle cx="146" cy="55" r="2" fill="white"/>
      <!-- Horns (prominent) -->
      <path d="M98,40 Q88,10 96,2 Q106,20 100,40" fill="${c3}"/>
      <path d="M158,40 Q168,10 160,2 Q150,20 156,40" fill="${c3}"/>
      <!-- Side horn nubs -->
      <path d="M88,52 L75,45 L90,50" fill="${c3}"/>
      <path d="M168,52 L181,45 L166,50" fill="${c3}"/>
      <!-- Spines -->
      <path d="M128,68 Q124,55 120,45 M132,82 Q128,70 124,62 M135,98 Q130,86 126,78 M137,115 Q132,102 128,94" stroke="${c3}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <!-- Belly -->
      <ellipse cx="142" cy="208" rx="48" ry="55" fill="${c2}" opacity=".25"/>
      <!-- Scale texture -->
      ${this._bodyScales(c3, 100, 180, 70, 60)}
      <!-- Front legs -->
      <path d="M95,240 L80,272 L100,278 L108,250" fill="${c3}"/>
      <path d="M190,240 L205,272 L185,278 L178,250" fill="${c3}"/>
      <!-- Rear legs -->
      <path d="M88,258 L75,285 L95,288 M104,260 L96,288 L108,290" stroke="${c3}" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M192,258 L205,285 L185,288 M176,260 L184,288 L172,290" stroke="${c3}" stroke-width="3" stroke-linecap="round" fill="none"/>
    `;
    return svg;
  },

  drawAdult(color) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 300 320');
    const c2 = this._lighten(color, 18);
    const c3 = this._darken(color, 45);
    svg.innerHTML = `
      <defs>
        <radialGradient id="aGrad" cx="35%" cy="28%" r="70%">
          <stop offset="0%" stop-color="${c2}"/>
          <stop offset="65%" stop-color="${color}"/>
          <stop offset="100%" stop-color="${c3}"/>
        </radialGradient>
        <filter id="aGlow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx="150" cy="310" rx="85" ry="10" fill="rgba(0,0,0,.55)"/>
      <!-- Tail -->
      <path d="M85,265 Q5,300 0,318 Q42,296 92,278" fill="${c3}"/>
      <path d="M85,265 Q20,290 15,310" stroke="${color}" stroke-width="2" opacity=".4" fill="none"/>
      <!-- Body -->
      <ellipse cx="152" cy="210" rx="88" ry="88" fill="url(#aGrad)" filter="url(#aGlow)"/>
      <!-- Wings (majestic) -->
      <path d="M68,188 Q-15,100 0,20 Q55,115 90,170" fill="${c3}"/>
      <path d="M234,188 Q315,100 300,20 Q245,115 210,170" fill="${c3}"/>
      <path d="M0,20 Q55,115 90,170" stroke="${color}" stroke-width="2.5" fill="none" opacity=".5"/>
      <path d="M300,20 Q245,115 210,170" stroke="${color}" stroke-width="2.5" fill="none" opacity=".5"/>
      <!-- Wing webs -->
      <path d="M68,188 Q20,130 0,20 Q50,80 90,170" fill="${color}" opacity=".18"/>
      <path d="M234,188 Q280,130 300,20 Q250,80 210,170" fill="${color}" opacity=".18"/>
      <!-- Neck -->
      <path d="M112,140 Q104,95 118,72 L152,68 Q165,93 158,140" fill="url(#aGrad)"/>
      <!-- Head -->
      <ellipse cx="136" cy="64" rx="48" ry="40" fill="url(#aGrad)" filter="url(#aGlow)"/>
      <!-- Jaw -->
      <path d="M100,68 Q80,54 88,36 Q128,58 168,55 Q175,36 160,68" fill="${c2}" opacity=".85"/>
      <!-- Brow ridge -->
      <path d="M100,50 Q120,42 136,44 Q152,42 170,50" stroke="${c3}" stroke-width="3" fill="none"/>
      <!-- Slit eyes -->
      <ellipse cx="112" cy="55" rx="13" ry="15" fill="${color}" stroke="${c3}" stroke-width="2"/>
      <ellipse cx="158" cy="55" rx="13" ry="15" fill="${color}" stroke="${c3}" stroke-width="2"/>
      <rect x="109" y="47" width="7" height="16" rx="3.5" fill="#030108"/>
      <rect x="155" y="47" width="7" height="16" rx="3.5" fill="#030108"/>
      <circle cx="110" cy="51" r="2.5" fill="white"/>
      <circle cx="156" cy="51" r="2.5" fill="white"/>
      <!-- Nostrils -->
      <ellipse cx="116" cy="44" rx="3.5" ry="2.5" fill="${c3}" opacity=".8"/>
      <ellipse cx="130" cy="42" rx="3.5" ry="2.5" fill="${c3}" opacity=".8"/>
      <!-- Teeth -->
      <path d="M100,68 L104,78 M110,66 L112,77 M158,66 L156,77 M168,68 L164,78" stroke="${c2}" stroke-width="2" stroke-linecap="round" fill="none" opacity=".7"/>
      <!-- Horns (curved) -->
      <path d="M100,38 Q84,8 90,0 Q105,22 104,38" fill="${c3}"/>
      <path d="M170,38 Q186,8 180,0 Q165,22 164,38" fill="${c3}"/>
      <!-- Secondary horns -->
      <path d="M92,50 L74,40 L94,48" fill="${c3}"/>
      <path d="M178,50 L196,40 L174,48" fill="${c3}"/>
      <!-- Spines -->
      <path d="M136,68 Q130,52 125,40 M140,85 Q134,70 130,58 M143,104 Q137,89 133,76 M145,123 Q139,108 135,95 M146,143 Q140,127 136,114" stroke="${c3}" stroke-width="4" stroke-linecap="round" fill="none"/>
      <!-- Belly -->
      <ellipse cx="152" cy="220" rx="58" ry="66" fill="${c2}" opacity=".2"/>
      ${this._bodyScales(c3, 108, 195, 88, 75)}
      <!-- Legs -->
      <path d="M90,268 L70,300 L95,306 L108,278" fill="${c3}"/>
      <path d="M212,268 L232,300 L207,306 L196,278" fill="${c3}"/>
      <path d="M70,300 L60,315 M82,304 L74,318 M95,306 L89,320" stroke="${c3}" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M232,300 L242,315 M220,304 L228,318 M207,306 L213,320" stroke="${c3}" stroke-width="3" stroke-linecap="round" fill="none"/>
    `;
    return svg;
  },

  drawAncient(color) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 320 340');
    const c2 = this._lighten(color, 25);
    const c3 = this._darken(color, 45);
    const gold = '#E8A030';
    svg.innerHTML = `
      <defs>
        <radialGradient id="ancGrad" cx="38%" cy="32%" r="72%">
          <stop offset="0%" stop-color="${c2}"/>
          <stop offset="50%" stop-color="${color}"/>
          <stop offset="100%" stop-color="${c3}"/>
        </radialGradient>
        <radialGradient id="eyeGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="${gold}"/>
          <stop offset="100%" stop-color="${this._darken(gold,30)}"/>
        </radialGradient>
        <filter id="ancGlow"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="goldGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <!-- Aura rings -->
      <ellipse cx="160" cy="175" rx="135" ry="130" fill="none" stroke="${color}" stroke-width="1" opacity=".15"/>
      <ellipse cx="160" cy="175" rx="145" ry="140" fill="none" stroke="${color}" stroke-width=".5" opacity=".08"/>
      <!-- Shadow -->
      <ellipse cx="160" cy="328" rx="100" ry="12" fill="rgba(0,0,0,.6)"/>
      <!-- Tail (ornate) -->
      <path d="M90,278 Q5,315 0,335 Q45,310 96,292" fill="${c3}"/>
      <path d="M88,278 Q25,305 10,328" stroke="${gold}" stroke-width="1.5" opacity=".5" fill="none"/>
      <!-- Tail spike -->
      <path d="M5,335 Q15,320 12,312 Q22,325 5,335" fill="${gold}" opacity=".7"/>
      <!-- Body -->
      <ellipse cx="162" cy="218" rx="100" ry="96" fill="url(#ancGrad)" filter="url(#ancGlow)"/>
      <!-- Golden belly plates -->
      <ellipse cx="162" cy="228" rx="65" ry="72" fill="${gold}" opacity=".12"/>
      <!-- Wings (vast) -->
      <path d="M65,195 Q-30,90 -5,0 Q58,120 92,178" fill="${c3}"/>
      <path d="M258,195 Q350,90 325,0 Q262,120 228,178" fill="${c3}"/>
      <path d="M-5,0 Q58,120 92,178" stroke="${gold}" stroke-width="2" fill="none" opacity=".6"/>
      <path d="M325,0 Q262,120 228,178" stroke="${gold}" stroke-width="2" fill="none" opacity=".6"/>
      <!-- Wing detail lines -->
      ${[0.25,0.5,0.75].map(t=>`<path d="M${-5+93*t},${t*178} Q${58+34*t},${120+58*t} ${92+136*t},178" stroke="${color}" stroke-width="1" fill="none" opacity=".3"/>`).join('')}
      <!-- Neck (thick) -->
      <path d="M118,148 Q108,98 124,72 L162,68 Q178,95 168,148" fill="url(#ancGrad)"/>
      <!-- Golden neck rings -->
      <ellipse cx="144" cy="128" rx="26" ry="8" fill="none" stroke="${gold}" stroke-width="1.5" opacity=".4"/>
      <ellipse cx="145" cy="112" rx="23" ry="7" fill="none" stroke="${gold}" stroke-width="1.5" opacity=".3"/>
      <!-- Head -->
      <ellipse cx="146" cy="62" rx="54" ry="46" fill="url(#ancGrad)" filter="url(#ancGlow)"/>
      <!-- Crown runes -->
      <text x="146" y="20" text-anchor="middle" font-size="14" fill="${gold}" opacity=".6" font-family="serif">⟡ ✦ ⟡</text>
      <!-- Jaw -->
      <path d="M104,70 Q82,56 90,36 Q138,62 192,58 Q200,36 186,70" fill="${c2}" opacity=".8"/>
      <!-- Teeth (prominent) -->
      <path d="M104,70 L108,84 M116,68 L118,83 M130,66 L130,82 M178,66 L178,82 M190,68 L186,83" stroke="${c2}" stroke-width="2.5" stroke-linecap="round" opacity=".8" fill="none"/>
      <!-- Eyes (golden) -->
      <ellipse cx="116" cy="56" rx="15" ry="17" fill="${color}" stroke="${gold}" stroke-width="2.5" filter="url(#goldGlow)"/>
      <ellipse cx="174" cy="56" rx="15" ry="17" fill="${color}" stroke="${gold}" stroke-width="2.5" filter="url(#goldGlow)"/>
      <ellipse cx="116" cy="57" rx="9" ry="14" fill="url(#eyeGrad)"/>
      <ellipse cx="174" cy="57" rx="9" ry="14" fill="url(#eyeGrad)"/>
      <rect x="113" y="48" width="6" height="18" rx="3" fill="#010005"/>
      <rect x="171" y="48" width="6" height="18" rx="3" fill="#010005"/>
      <circle cx="114" cy="52" r="2.5" fill="white" opacity=".9"/>
      <circle cx="172" cy="52" r="2.5" fill="white" opacity=".9"/>
      <!-- Brow ridge -->
      <path d="M104,44 Q120,36 136,38 Q152,36 168,44" stroke="${c3}" stroke-width="4" fill="none"/>
      <!-- Nostrils (with glow) -->
      <ellipse cx="124" cy="44" rx="4" ry="3" fill="${c3}"/>
      <ellipse cx="138" cy="42" rx="4" ry="3" fill="${c3}"/>
      <ellipse cx="124" cy="44" rx="4" ry="3" fill="${color}" opacity=".5" filter="url(#goldGlow)"/>
      <!-- Horns (regal) -->
      <path d="M106,38 Q88,5 96,0 Q112,24 110,38" fill="${c3}"/>
      <path d="M184,38 Q202,5 194,0 Q178,24 180,38" fill="${c3}"/>
      <path d="M96,0 L98,8 L104,4" fill="${gold}" opacity=".7"/>
      <path d="M194,0 L192,8 L186,4" fill="${gold}" opacity=".7"/>
      <!-- Secondary + tertiary horns -->
      <path d="M98,50 L76,38 L100,48" fill="${c3}"/>
      <path d="M192,50 L214,38 L190,48" fill="${c3}"/>
      <path d="M102,62 L80,56 L103,60" fill="${c3}" opacity=".6"/>
      <path d="M188,62 L210,56 L187,60" fill="${c3}" opacity=".6"/>
      <!-- Spine ridge (full length, ornate) -->
      <path d="M146,68 Q140,48 135,35 M150,88 Q144,68 140,54 M153,110 Q147,89 142,75 M155,132 Q149,110 145,96 M157,155 Q151,132 147,118 M158,178 Q152,155 148,140 M158,200 Q152,178 148,164" stroke="${c3}" stroke-width="5" stroke-linecap="round" fill="none"/>
      <!-- Gold spine tips -->
      <circle cx="135" cy="35" r="3.5" fill="${gold}" opacity=".7"/>
      <circle cx="140" cy="54" r="3" fill="${gold}" opacity=".6"/>
      <circle cx="142" cy="75" r="2.5" fill="${gold}" opacity=".5"/>
      <!-- Body scales (dense) -->
      ${this._bodyScales(c3, 115, 208, 98, 82)}
      <!-- Gold accent scales -->
      ${this._goldScales(gold, 140, 195)}
      <!-- Legs (powerful) -->
      <path d="M88,280 L65,314 L94,320 L108,290" fill="${c3}"/>
      <path d="M234,280 L257,314 L228,320 L214,290" fill="${c3}"/>
      <!-- Ankle guards (decorative) -->
      <ellipse cx="80" cy="311" rx="15" ry="5" fill="${gold}" opacity=".4"/>
      <ellipse cx="242" cy="311" rx="15" ry="5" fill="${gold}" opacity=".4"/>
      <!-- Claws (long) -->
      <path d="M65,314 L54,328 M76,318 L67,331 M88,320 L81,333 M94,320 L90,334" stroke="${c3}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <path d="M257,314 L268,328 M246,318 L255,331 M234,320 L241,333 M228,320 L232,334" stroke="${c3}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <!-- Ancient rune glyphs on body -->
      <text x="158" y="225" text-anchor="middle" font-size="18" fill="${gold}" opacity=".2" font-family="serif">⚜</text>
      <text x="135" y="250" text-anchor="middle" font-size="12" fill="${gold}" opacity=".15" font-family="serif">✦</text>
      <text x="182" y="250" text-anchor="middle" font-size="12" fill="${gold}" opacity=".15" font-family="serif">✦</text>
    `;
    return svg;
  },

  _bodyScales(color, cx, cy, rx, ry) {
    let out = '';
    const rows = 5, cols = 6;
    for (let r = 0; r < rows; r++) {
      for (let c2 = 0; c2 < cols; c2++) {
        const x = cx - rx + (rx * 2 / cols) * c2 + (r % 2 ? rx/cols : 0);
        const y = cy - ry + (ry * 2 / rows) * r;
        const d = Math.sqrt(Math.pow((x-cx)/rx,2)+Math.pow((y-cy)/ry,2));
        if (d > .85) continue;
        out += `<ellipse cx="${x}" cy="${y}" rx="10" ry="7" fill="${color}" fill-opacity=".22" transform="rotate(-20,${x},${y})"/>`;
      }
    }
    return out;
  },

  _goldScales(color, cx, cy) {
    let out = '';
    const positions = [[cx-15,cy-20],[cx+15,cy-20],[cx,cy-5],[cx-20,cy+10],[cx+20,cy+10]];
    for (const [x,y] of positions) {
      out += `<ellipse cx="${x}" cy="${y}" rx="8" ry="5" fill="${color}" fill-opacity=".25" transform="rotate(-15,${x},${y})"/>`;
    }
    return out;
  },

  _lighten(hex, amount) {
    const n = parseInt(hex.replace('#',''), 16);
    const r = Math.min(255, (n >> 16) + amount);
    const g = Math.min(255, ((n >> 8) & 0xff) + amount);
    const b = Math.min(255, (n & 0xff) + amount);
    return `rgb(${r},${g},${b})`;
  },

  _darken(hex, amount) {
    const n = parseInt(hex.replace('#',''), 16);
    const r = Math.max(0, (n >> 16) - amount);
    const g = Math.max(0, ((n >> 8) & 0xff) - amount);
    const b = Math.max(0, (n & 0xff) - amount);
    return `rgb(${r},${g},${b})`;
  },
};

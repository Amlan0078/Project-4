(function() {
  "use strict";

  // ---------- DOM ELEMENTS ----------
  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  const loveMsg = document.getElementById('loveMessage');
  const panel = document.getElementById('buttonPanel');

  // ---------- EXCLUSION ZONE: NEVER EVER COVER YES BUTTON ----------
  function getYesZone() {
    const yesRect = yesBtn.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    return {
      left: yesRect.left - panelRect.left,
      top: yesRect.top - panelRect.top,
      right: yesRect.right - panelRect.left,
      bottom: yesRect.bottom - panelRect.top,
      width: yesRect.width,
      height: yesRect.height
    };
  }

  function collidesWithYes(noLeft, noTop, noW, noH, yesZone) {
    const noRight = noLeft + noW;
    const noBottom = noTop + noH;
    return !(noRight <= yesZone.left || 
             noLeft >= yesZone.right || 
             noBottom <= yesZone.top || 
             noTop >= yesZone.bottom);
  }

  // ---------- SUPER HYPER MEGA JUMP — INSTANT, NO DELAY, NO THROTTLE ----------
  function hyperJumpNoButton() {
    if (!noBtn || !panel || !yesBtn) return;

    const noW = noBtn.offsetWidth;
    const noH = noBtn.offsetHeight;

    const panelW = panel.offsetWidth;
    const panelH = panel.offsetHeight;
    const maxLeft = Math.max(0, panelW - noW - 2);
    const maxTop = Math.max(0, panelH - noH - 2);

    if (maxLeft <= 0 || maxTop <= 0) {
      noBtn.style.left = '0px';
      noBtn.style.top = '0px';
      return;
    }

    const yesZone = getYesZone();

    let attempts = 0;
    const MAX_ATTEMPTS = 300; // More attempts = better avoidance
    let newLeft, newTop;
    let found = false;

    while (!found && attempts < MAX_ATTEMPTS) {
      newLeft = Math.random() * maxLeft;
      newTop = Math.random() * maxTop;

      newLeft = Math.min(Math.max(newLeft, 0), maxLeft);
      newTop = Math.min(Math.max(newTop, 0), maxTop);

      if (!collidesWithYes(newLeft, newTop, noW, noH, yesZone)) {
        found = true;
        break;
      }
      attempts++;
    }

    if (!found) {
      const yesCenterX = (yesZone.left + yesZone.right) / 2;
      const yesCenterY = (yesZone.top + yesZone.bottom) / 2;
      const corners = [
        [0, 0],
        [maxLeft, 0],
        [0, maxTop],
        [maxLeft, maxTop]
      ];
      let maxDist = -1;
      for (let [lx, ly] of corners) {
        const dist = Math.hypot(lx - yesCenterX, ly - yesCenterY);
        if (dist > maxDist) {
          maxDist = dist;
          newLeft = lx;
          newTop = ly;
        }
      }
      
      if (collidesWithYes(newLeft, newTop, noW, noH, yesZone)) {
        if (newLeft < panelW/2) newLeft = Math.min(maxLeft, newLeft + noW + 8);
        else newLeft = Math.max(0, newLeft - noW - 8);
        if (newTop < panelH/2) newTop = Math.min(maxTop, newTop + noH + 8);
        else newTop = Math.max(0, newTop - noH - 8);
        newLeft = Math.min(Math.max(newLeft, 0), maxLeft);
        newTop = Math.min(Math.max(newTop, 0), maxTop);
      }
    }

    // 🚀 INSTANT MOVE — NO TRANSITION, NO DELAY
    noBtn.style.left = newLeft + 'px';
    noBtn.style.top = newTop + 'px';
  }

  // ---------- REMOVE ALL THROTTLING — SUPER FAST TRIGGERS ----------
  
  // 1️⃣ MOUSEENTER — instant flee
  noBtn.addEventListener('mouseenter', (e) => {
    e.preventDefault();
    hyperJumpNoButton();
  });

  // 2️⃣ CLICK — instant flee + 3 extra jumps (impossible to catch)
  noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    hyperJumpNoButton();
    hyperJumpNoButton();
    hyperJumpNoButton();
    hyperJumpNoButton(); // 4 total jumps — ZERO delay
  });

  // 3️⃣ MOUSEMOVE on PANEL — if mouse comes within 250px, INSTANT FLEE
  panel.addEventListener('mousemove', (e) => {
    if (!noBtn) return;
    const noRect = noBtn.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const btnCenterX = noRect.left + noRect.width/2;
    const btnCenterY = noRect.top + noRect.height/2;
    const dist = Math.hypot(mouseX - btnCenterX, mouseY - btnCenterY);
    
    // 🚨 ANYTHING within 250px = GTFO
    if (dist < 250) {
      hyperJumpNoButton();
    }
  });

  // 4️⃣ GLOBAL MOUSEMOVE — NO THROTTLE, FLEE FROM CURSOR ANYWHERE
  document.addEventListener('mousemove', (e) => {
    if (!noBtn) return;
    
    const noRect = noBtn.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const centerX = noRect.left + noRect.width/2;
    const centerY = noRect.top + noRect.height/2;
    const dist = Math.hypot(mouseX - centerX, mouseY - centerY);
    
    // 🚨 SUPER SENSITIVE — 300px DANGER ZONE
    if (dist < 300) {
      hyperJumpNoButton();
    }
  });

  // 5️⃣ TOUCH DEVICES — instant response
  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    hyperJumpNoButton();
    hyperJumpNoButton();
  });
  
  noBtn.addEventListener('touchmove', (e) => {
    e.preventDefault();
    hyperJumpNoButton();
    hyperJumpNoButton();
  });

  // 6️⃣ TOUCH on PANEL — flee immediately
  panel.addEventListener('touchstart', (e) => {
    hyperJumpNoButton();
  });

  panel.addEventListener('touchmove', (e) => {
    hyperJumpNoButton();
  });

  // 7️⃣ WINDOW RESIZE — reposition safely
  window.addEventListener('resize', () => {
    hyperJumpNoButton();
  });

  // 8️⃣ ORIENTATION CHANGE (mobile) — immediate reposition
  window.addEventListener('orientationchange', () => {
    setTimeout(() => { hyperJumpNoButton(); }, 10);
  });

  // 9️⃣ SCROLL (just in case) — FLEE
  window.addEventListener('scroll', () => {
    hyperJumpNoButton();
  });

  // ---------- INITIAL POSITIONING ----------
  window.addEventListener('load', () => {
    noBtn.style.position = 'absolute';
    hyperJumpNoButton();
    hyperJumpNoButton();
    hyperJumpNoButton();
  });

  // ---------- PERPETUAL SAFETY MONITOR — NEVER COVERS YES ----------
  function safetyGuard() {
    if (noBtn && yesBtn && panel) {
      const left = parseFloat(noBtn.style.left) || 0;
      const top = parseFloat(noBtn.style.top) || 0;
      const noW = noBtn.offsetWidth;
      const noH = noBtn.offsetHeight;
      const yesZone = getYesZone();
      if (collidesWithYes(left, top, noW, noH, yesZone)) {
        hyperJumpNoButton();
      }
    }
    requestAnimationFrame(safetyGuard);
  }
  requestAnimationFrame(safetyGuard);

  // ---------- YES BUTTON — reveals the sweet message ----------
  yesBtn.addEventListener('click', () => {
    loveMsg.style.display = 'grid';  // MUST be 'grid'
    yesBtn.disabled = true;
    yesBtn.style.opacity = '0.8';
    yesBtn.style.cursor = 'default';
    
    if (panel && noBtn) {
      const panelW = panel.offsetWidth;
      const panelH = panel.offsetHeight;
      const noW = noBtn.offsetWidth;
      const noH = noBtn.offsetHeight;
      const maxL = Math.max(0, panelW - noW - 2);
      const maxT = Math.max(0, panelH - noH - 2);
      noBtn.style.left = maxL + 'px';
      noBtn.style.top = maxT + 'px';
      
      const yesZone = getYesZone();
      if (collidesWithYes(maxL, maxT, noW, noH, yesZone)) {
        hyperJumpNoButton();
      }
    }
    
    loveMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Initialize position
  noBtn.style.position = 'absolute';
  
  // Force border-radius symmetry
  const style = document.createElement('style');
  style.innerHTML = `
    .valentine-card, .secret-message, .btn-yes, .btn-no, .question, .time {
      border-radius: 32px !important;
    }
    .question, .btn-yes, .btn-no, .time {
      border-radius: 40px !important;
    }
    .secret-message {
      border-radius: 28px !important;
      border-style: dashed !important;
    }
  `;
  document.head.appendChild(style);
})();
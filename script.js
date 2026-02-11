(function() {
  "use strict";

  // ---------- DOM elements ----------
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

  // collision detection — precise, no mercy
  function collidesWithYes(noLeft, noTop, noW, noH, yesZone) {
    const noRight = noLeft + noW;
    const noBottom = noTop + noH;
    return !(noRight <= yesZone.left || 
             noLeft >= yesZone.right || 
             noBottom <= yesZone.top || 
             noTop >= yesZone.bottom);
  }

  // ---------- HYPER JUMP — instant, faster than ever, never near YES ----------
  function hyperJumpNoButton() {
    if (!noBtn || !panel || !yesBtn) return;

    const noW = noBtn.offsetWidth;
    const noH = noBtn.offsetHeight;

    // panel boundaries — keep button fully inside, with a whisper of margin
    const panelW = panel.offsetWidth;
    const panelH = panel.offsetHeight;
    const maxLeft = Math.max(0, panelW - noW - 2);
    const maxTop = Math.max(0, panelH - noH - 2);

    // if panel is too tiny, still avoid yes at all costs
    if (maxLeft <= 0 || maxTop <= 0) {
      // force far corner but still no overlap
      noBtn.style.left = '0px';
      noBtn.style.top = '0px';
      return;
    }

    const yesZone = getYesZone();

    let attempts = 0;
    const MAX_ATTEMPTS = 180;
    let newLeft, newTop;
    let found = false;

    while (!found && attempts < MAX_ATTEMPTS) {
      newLeft = Math.random() * maxLeft;
      newTop = Math.random() * maxTop;

      // gentle clamping
      newLeft = Math.min(Math.max(newLeft, 0), maxLeft);
      newTop = Math.min(Math.max(newTop, 0), maxTop);

      if (!collidesWithYes(newLeft, newTop, noW, noH, yesZone)) {
        found = true;
        break;
      }
      attempts++;
    }

    if (!found) {
      // ultimate escape: farthest corner from YES button center
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
      // final check — shift if still overlapping (rare)
      if (collidesWithYes(newLeft, newTop, noW, noH, yesZone)) {
        if (newLeft < panelW/2) newLeft = Math.min(maxLeft, newLeft + noW + 6);
        else newLeft = Math.max(0, newLeft - noW - 6);
        if (newTop < panelH/2) newTop = Math.min(maxTop, newTop + noH + 6);
        else newTop = Math.max(0, newTop - noH - 6);
        newLeft = Math.min(Math.max(newLeft, 0), maxLeft);
        newTop = Math.min(Math.max(newTop, 0), maxTop);
      }
    }

    // instant reposition — no transition, no delay
    noBtn.style.left = newLeft + 'px';
    noBtn.style.top = newTop + 'px';
  }

  // ---------- TRIGGERS — run, run, run away ----------
  noBtn.addEventListener('mouseenter', (e) => {
    e.preventDefault();
    hyperJumpNoButton();
  });

  noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    hyperJumpNoButton();
    hyperJumpNoButton();  // double escape
    hyperJumpNoButton();  // triple fast
  });

  // panel mousemove — if mouse approaches NO button, it flees
  panel.addEventListener('mousemove', (e) => {
    if (!noBtn) return;
    const noRect = noBtn.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const btnCenterX = noRect.left + noRect.width/2;
    const btnCenterY = noRect.top + noRect.height/2;
    const dist = Math.hypot(mouseX - btnCenterX, mouseY - btnCenterY);
    if (dist < 200) {
      hyperJumpNoButton();
    }
  });

  // touch devices
  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    hyperJumpNoButton();
  });
  noBtn.addEventListener('touchmove', (e) => {
    e.preventDefault();
    hyperJumpNoButton();
  });

  // global mousemove — keep NO away from cursor curiosity
  document.addEventListener('mousemove', (e) => {
    if (!noBtn) return;
    // throttle a bit to keep it smooth but still lightning
    if (window._lastJumpTime && Date.now() - window._lastJumpTime < 16) return;
    const noRect = noBtn.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const centerX = noRect.left + noRect.width/2;
    const centerY = noRect.top + noRect.height/2;
    if (Math.hypot(mouseX - centerX, mouseY - centerY) < 190) {
      window._lastJumpTime = Date.now();
      hyperJumpNoButton();
    }
  });

  // resize handler — keep inside panel and avoid YES
  window.addEventListener('resize', () => {
    hyperJumpNoButton();
  });

  // initial positioning: set absolute and find safe spot
  window.addEventListener('load', () => {
    noBtn.style.position = 'absolute';
    hyperJumpNoButton();
    setTimeout(() => { hyperJumpNoButton(); }, 20);
    setTimeout(() => { hyperJumpNoButton(); }, 60);
  });

  // perpetual safety monitor — never ever covers YES
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

  // ---------- YES BUTTON — reveals the sweet message, perfectly contained ----------
  yesBtn.addEventListener('click', () => {
    // Display message - it will stay inside card due to overflow hidden and max-width
    loveMsg.style.display = 'block';
    yesBtn.disabled = true;
    yesBtn.style.opacity = '0.8';
    yesBtn.style.cursor = 'default';
    
    // celebrate: push NO button to far corner, but still no overlap
    if (panel && noBtn) {
      const panelW = panel.offsetWidth;
      const panelH = panel.offsetHeight;
      const noW = noBtn.offsetWidth;
      const noH = noBtn.offsetHeight;
      const maxL = Math.max(0, panelW - noW - 2);
      const maxT = Math.max(0, panelH - noH - 2);
      noBtn.style.left = maxL + 'px';
      noBtn.style.top = maxT + 'px';
      // double-check collision
      const yesZone = getYesZone();
      if (collidesWithYes(maxL, maxT, noW, noH, yesZone)) {
        hyperJumpNoButton();
      }
    }
    
    // Ensure message is visible and within bounds
    loveMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // initial absolute
  noBtn.style.position = 'absolute';
  
  // Force all border-radius to be symmetrical with !important
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
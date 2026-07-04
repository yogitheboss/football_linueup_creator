// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// drag.js — Mouse and touch drag-and-drop for player tokens
//
// Tokens drag freely across the whole canvas: pitch (#field) and
// bench (#bench). As a token's centre crosses the boundary between
// the two, it is re-parented to the container it now sits over, so
// substitutes can be dragged straight onto the pitch (and back).
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Percentage clamp bounds per zone (keeps tokens inside their container).
const ZONE_CLAMP = {
  field: { xMin: 3, xMax: 97, yMin: 3,  yMax: 97 },
  bench: { xMin: 3, xMax: 97, yMin: 15, yMax: 85 },
};

const clampPct = (v, min, max) => Math.max(min, Math.min(max, v));

/**
 * Attach drag behaviour to a player token element.
 * @param {HTMLElement} token
 * @param {object}      player  — state player/extra object (x, y, zone mutated in place)
 */
function setupDrag(token, player) {
  const field = document.getElementById('field');
  const bench = document.getElementById('bench');

  function beginDrag(startClientX, startClientY) {
    let dragging = true;

    // Keep the point you grabbed under the cursor for the whole drag.
    const tRect       = token.getBoundingClientRect();
    const grabOffsetX = startClientX - (tRect.left + tRect.width  / 2);
    const grabOffsetY = startClientY - (tRect.top  + tRect.height / 2);

    token.classList.add('dragging');

    function moveTo(cx, cy) {
      if (!dragging) return;

      // Desired token centre in client coordinates.
      const centreX = cx - grabOffsetX;
      const centreY = cy - grabOffsetY;

      // Choose the container the centre currently sits over.
      // #field sits above #bench and they share the same width, so the
      // dividing line is simply the bottom edge of the field.
      const boundary  = field.getBoundingClientRect().bottom;
      const zone      = centreY < boundary ? 'field' : 'bench';
      const container = zone === 'field' ? field : bench;

      // Re-parent when the token moves into the other container.
      if (token.parentElement !== container) container.appendChild(token);

      const rect  = container.getBoundingClientRect();
      const c     = ZONE_CLAMP[zone];
      const xPct  = clampPct(((centreX - rect.left) / rect.width)  * 100, c.xMin, c.xMax);
      const yPct  = clampPct(((centreY - rect.top)  / rect.height) * 100, c.yMin, c.yMax);

      player.x    = xPct;
      player.y    = yPct;
      player.zone = zone;
      token.style.left = xPct + '%';
      token.style.top  = yPct + '%';
    }

    function endDrag() {
      dragging = false;
      token.classList.remove('dragging');
    }

    // ── Mouse ──────────────────────────────────────────
    function onMouseMove(e) { moveTo(e.clientX, e.clientY); }
    function onMouseUp()    {
      endDrag();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup',   onMouseUp);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup',   onMouseUp);

    // ── Touch ──────────────────────────────────────────
    function onTouchMove(e) { e.preventDefault(); moveTo(e.touches[0].clientX, e.touches[0].clientY); }
    function onTouchEnd()   {
      endDrag();
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend',  onTouchEnd);
    }
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend',  onTouchEnd);
  }

  token.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    if (e.target.classList.contains('token-name-editor')) return;
    e.preventDefault();
    beginDrag(e.clientX, e.clientY);
  });

  token.addEventListener('touchstart', (e) => {
    if (e.target.classList.contains('token-name-editor')) return;
    e.preventDefault();
    beginDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });
}

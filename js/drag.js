// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// drag.js — Mouse and touch drag-and-drop for player tokens
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Attach drag behaviour to a player token element.
 * @param {HTMLElement} token
 * @param {object}      player     — state player/extra object (x, y mutated in place)
 * @param {HTMLElement} container  — positioning parent (#field or #bench)
 * @param {{ xMin, xMax, yMin, yMax }} [clamp] — percentage bounds (default 3–97 / 3–97)
 */
function setupDrag(token, player, container, clamp) {
  const xMin = clamp?.xMin ?? 3;
  const xMax = clamp?.xMax ?? 97;
  const yMin = clamp?.yMin ?? 3;
  const yMax = clamp?.yMax ?? 97;

  function beginDrag(startClientX, startClientY) {
    const rect   = container.getBoundingClientRect();
    const origX  = player.x;
    const origY  = player.y;
    let dragging = true;

    token.classList.add('dragging');

    function moveTo(cx, cy) {
      if (!dragging) return;
      const dx = ((cx - startClientX) / rect.width)  * 100;
      const dy = ((cy - startClientY) / rect.height) * 100;
      player.x = Math.max(xMin, Math.min(xMax, origX + dx));
      player.y = Math.max(yMin, Math.min(yMax, origY + dy));
      token.style.left = player.x + '%';
      token.style.top  = player.y + '%';
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

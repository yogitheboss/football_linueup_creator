// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// main.js — Event wiring and application boot
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Team name
document.getElementById('teamNameInput').addEventListener('input', (e) => {
  state.teamName = e.target.value || 'My Team';
  renderLabels();
});

// Reset player positions to formation defaults (names are kept)
document.getElementById('resetBtn').addEventListener('click', () => {
  const positions = FORMATIONS[state.formation];
  state.players.forEach((p, i) => {
    p.x = positions[i].x;
    p.y = positions[i].y;
  });
  renderPlayerTokens();
});

// Save image
document.getElementById('saveBtn').addEventListener('click', saveImage);

// JSON import modal triggers
document.getElementById('importJsonBtn').addEventListener('click', openImportModal);
document.getElementById('modalCloseBtn').addEventListener('click', closeImportModal);
document.getElementById('applyJsonBtn').addEventListener('click', applyJSON);
document.getElementById('copyJsonBtn').addEventListener('click', copyCurrentJSON);

// ── Boot ─────────────────────────────────────────────────
initPlayers('4-4-2');
renderAll();

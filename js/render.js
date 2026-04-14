// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// render.js — DOM rendering functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── Formation buttons ────────────────────────────────────
function renderFormationButtons() {
  const grid = document.getElementById('formationGrid');
  grid.innerHTML = '';

  Object.keys(FORMATIONS).forEach(f => {
    const btn = document.createElement('button');
    btn.className = 'formation-btn' + (state.formation === f ? ' active' : '');
    btn.textContent = f;
    btn.addEventListener('click', () => {
      state.formation = f;
      initPlayers(f);
      renderAll();
    });
    grid.appendChild(btn);
  });
}

// ── Sidebar player list ──────────────────────────────────
function renderPlayerList() {
  const list = document.getElementById('playerList');
  list.innerHTML = '';

  // ── 11 formation players
  state.players.forEach(player => {
    list.appendChild(makePlayerItem(player, false));
  });

  // ── Divider
  const divider = document.createElement('div');
  divider.className = 'extras-divider';
  divider.innerHTML = '<span>Extras</span>';
  list.appendChild(divider);

  // ── Extra players
  state.extras.forEach(player => {
    list.appendChild(makePlayerItem(player, true));
  });

  // ── Add Player button
  const addBtn = document.createElement('button');
  addBtn.className = 'add-player-btn';
  addBtn.textContent = '+ Add Player';
  addBtn.addEventListener('click', () => {
    addExtra();
    // Append just the new token and new row — no full re-render needed
    const newPlayer = state.extras[state.extras.length - 1];
    appendExtraToken(newPlayer);
    // Re-render sidebar list to include new row (cheap)
    renderPlayerList();
  });
  list.appendChild(addBtn);
}

/** Build a single player row for the sidebar. */
function makePlayerItem(player, isExtra) {
  const item = document.createElement('div');
  item.className = 'player-item' + (isExtra ? ' extra-item' : '');
  item.dataset.id = player.id;

  const num = document.createElement('div');
  num.className = 'player-num' + (player.pos === 'GK' ? ' gk' : isExtra ? ' extra' : '');
  num.textContent = player.id;

  const inp = document.createElement('input');
  inp.className  = 'player-name-input';
  inp.type       = 'text';
  inp.value      = player.name;
  inp.placeholder = isExtra ? 'Extra player' : `Player ${player.id}`;
  inp.maxLength  = 20;
  inp.dataset.id = player.id;
  inp.addEventListener('input', () => {
    player.name = inp.value || (isExtra ? `Player ${player.id}` : `Player ${player.id}`);
    syncTokenName(player);
  });

  const badge = document.createElement('span');
  badge.className  = 'player-pos-tag';
  badge.textContent = player.pos;

  item.appendChild(num);
  item.appendChild(inp);
  item.appendChild(badge);

  if (isExtra) {
    // Editable position badge
    badge.title    = 'Click to edit position';
    badge.style.cursor = 'pointer';
    badge.addEventListener('click', () => {
      const newPos = prompt('Enter position (e.g. SUB, GK, ST):', player.pos);
      if (newPos !== null) {
        player.pos   = newPos.trim().toUpperCase().slice(0, 5) || 'SUB';
        badge.textContent = player.pos;
      }
    });

    const removeBtn = document.createElement('button');
    removeBtn.className   = 'remove-btn';
    removeBtn.textContent = '×';
    removeBtn.title       = 'Remove player';
    removeBtn.addEventListener('click', () => {
      // Remove token from pitch
      const token = document.querySelector(`.player-token[data-id="${player.id}"]`);
      if (token) token.remove();
      // Remove from state
      removeExtra(player.id);
      // Re-render sidebar list
      renderPlayerList();
    });
    item.appendChild(removeBtn);
  }

  return item;
}

// ── Pitch tokens ─────────────────────────────────────────
function renderPlayerTokens() {
  document.querySelectorAll('.player-token').forEach(t => t.remove());

  const field = document.getElementById('field');
  const bench = document.getElementById('bench');

  state.players.forEach(p => field.appendChild(makeToken(p, false)));
  state.extras.forEach(p  => bench.appendChild(makeToken(p, true)));
}

/** Append only a single new extra token to the bench (no full re-render). */
function appendExtraToken(player) {
  document.getElementById('bench').appendChild(makeToken(player, true));
}

/** Build and wire up a draggable player token element. */
function makeToken(player, isExtra) {
  const token = document.createElement('div');
  token.className   = 'player-token'
    + (player.pos === 'GK' && !isExtra ? ' gk' : '')
    + (isExtra ? ' extra' : '');
  token.dataset.id  = player.id;
  token.style.left  = player.x + '%';
  token.style.top   = player.y + '%';

  const circle = document.createElement('div');
  circle.className   = 'player-circle';
  circle.textContent = player.id;

  const nameEl = document.createElement('div');
  nameEl.className   = 'token-name';
  nameEl.textContent = player.name;

  token.appendChild(circle);
  token.appendChild(nameEl);

  token.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    openInlineEditor(token, player);
  });

  if (isExtra) {
    // Drag within the bench; tighter y clamp so tokens don't escape the strip
    setupDrag(token, player, document.getElementById('bench'),
      { xMin: 3, xMax: 97, yMin: 10, yMax: 90 });
  } else {
    setupDrag(token, player, document.getElementById('field'));
  }

  return token;
}

// ── Name sync helpers ─────────────────────────────────────

/**
 * Update the pitch token name label without a full re-render.
 * Works for both formation players and extras.
 */
function syncTokenName(player) {
  const token = document.querySelector(`.player-token[data-id="${player.id}"]`);
  if (token) token.querySelector('.token-name').textContent = player.name;
}

/**
 * Open a small floating input on the pitch token to rename inline.
 * Commits back to state and syncs the sidebar input.
 */
function openInlineEditor(token, player) {
  if (token.querySelector('.token-name-editor')) return;

  const editor      = document.createElement('input');
  editor.className  = 'token-name-editor';
  editor.type       = 'text';
  editor.value      = player.name;
  editor.maxLength  = 20;
  token.appendChild(editor);
  editor.focus();
  editor.select();

  function commit() {
    const newName   = editor.value.trim() || `Player ${player.id}`;
    player.name     = newName;
    editor.remove();
    syncTokenName(player);
    // Sync sidebar by data-id attribute
    const sidebarInp = document.querySelector(`#playerList .player-name-input[data-id="${player.id}"]`);
    if (sidebarInp) sidebarInp.value = newName;
  }

  editor.addEventListener('blur',    commit);
  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  { e.preventDefault(); commit(); }
    if (e.key === 'Escape') { editor.remove(); }
    e.stopPropagation();
  });
  editor.addEventListener('mousedown', e => e.stopPropagation());
}

// ── Field watermarks ─────────────────────────────────────
function renderLabels() {
  document.getElementById('fieldTeamLabel').textContent      = state.teamName.toUpperCase();
  document.getElementById('fieldFormationLabel').textContent = state.formation;
}

// ── Master render ────────────────────────────────────────
function renderAll() {
  renderFormationButtons();
  renderPlayerList();
  renderPlayerTokens();
  renderLabels();
}

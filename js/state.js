// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// state.js — Application state and player initialisation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const state = {
  teamName: 'My Team',
  formation: '4-4-2',
  players: [],   // exactly 11 formation players, ids 1–11
  extras:  [],   // any number of additional players, ids 12+
};

// Counter for extra player IDs — never reset so IDs stay stable.
let _nextExtraId = 12;

// ── Formation players ────────────────────────────────────

/**
 * (Re)initialise formation players.
 * Preserves names by index; extras are left untouched.
 * @param {string} formationKey
 */
function initPlayers(formationKey) {
  const positions = FORMATIONS[formationKey];
  const oldNames  = state.players.map(p => p.name);

  const oldNumbers = state.players.map(p => p.number);

  state.players = positions.map((p, i) => ({
    id:     i + 1,
    number: oldNumbers[i] !== undefined ? oldNumbers[i] : i + 1,
    name:   oldNames[i]   !== undefined ? oldNames[i]   : `Player ${i + 1}`,
    pos:    p.pos,
    x:      p.x,
    y:      p.y,
    zone:   'field',
  }));
}

// ── Extra players ────────────────────────────────────────

// Bench layout constants (percentages of bench width/height)
const BENCH_X_START  = 8;   // first extra at 8% from left
const BENCH_X_STEP   = 12;  // each subsequent extra 12% further right
const BENCH_X_COLS   = 8;   // wrap after 8 columns
const BENCH_Y_ROW1   = 45;  // y% for row 1
const BENCH_Y_ROW2   = 80;  // y% for row 2 (if >8 extras)

function benchX(idx) { return BENCH_X_START + (idx % BENCH_X_COLS) * BENCH_X_STEP; }
function benchY(idx) { return idx < BENCH_X_COLS ? BENCH_Y_ROW1 : BENCH_Y_ROW2; }

/**
 * Add a new extra player to the bench.
 * Spaces them evenly left-to-right, wrapping to a second row after 8.
 */
function addExtra() {
  const idx = state.extras.length;
  const id  = _nextExtraId++;
  state.extras.push({
    id,
    number: id,
    name:   `Player ${id}`,
    pos:    'SUB',
    x:      benchX(idx),
    y:      benchY(idx),
    zone:   'bench',
  });
}

/**
 * Remove an extra player by id.
 * @param {number} id
 */
function removeExtra(id) {
  state.extras = state.extras.filter(p => p.id !== id);
}

// ── JSON import / export ─────────────────────────────────

/**
 * Coerce a jersey number from JSON into a sane 1–99 integer.
 * Accepts numbers or numeric strings; falls back to `fallback`.
 */
function normaliseNumber(value, fallback) {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(1, Math.min(99, n));
}

/**
 * Load a full lineup from a parsed JSON object.
 * Returns null on success, or an error string on failure.
 * @param {object} data
 * @returns {string|null}
 */
function loadFromJSON(data) {
  if (typeof data !== 'object' || data === null) return 'JSON must be an object.';

  const formation = data.formation;
  if (!formation || !FORMATIONS[formation]) {
    return `Unknown formation "${formation}". Supported: ${Object.keys(FORMATIONS).join(', ')}.`;
  }

  const players = data.players;
  if (!Array.isArray(players)) return '"players" must be an array.';

  const expected = FORMATIONS[formation].length;
  if (players.length !== expected) {
    return `Formation ${formation} needs exactly ${expected} players, got ${players.length}.`;
  }

  // Apply formation players
  if (data.teamName) state.teamName = String(data.teamName).slice(0, 30);
  state.formation = formation;

  const defaults = FORMATIONS[formation];
  state.players = players.map((p, i) => ({
    id:     i + 1,
    number: normaliseNumber(p.number, i + 1),
    name:   String(p.name || `Player ${i + 1}`).slice(0, 20),
    pos:    String(p.pos  || defaults[i].pos),
    x:      typeof p.x === 'number' ? Math.max(3, Math.min(97, p.x)) : defaults[i].x,
    y:      typeof p.y === 'number' ? Math.max(3, Math.min(97, p.y)) : defaults[i].y,
    zone:   'field',
  }));

  // Apply extras (optional field)
  if (Array.isArray(data.extras)) {
    state.extras = data.extras.map((p, i) => {
      const id = _nextExtraId++;
      return {
        id,
        number: normaliseNumber(p.number, id),
        name:   String(p.name || `Player ${id}`).slice(0, 20),
        pos:    String(p.pos  || 'SUB'),
        x:      typeof p.x === 'number' ? Math.max(3, Math.min(97, p.x)) : benchX(i),
        y:      typeof p.y === 'number' ? Math.max(3, Math.min(97, p.y)) : benchY(i),
        zone:   'bench',
      };
    });
  } else {
    state.extras = [];
  }

  return null; // success
}

/**
 * Serialise current state to a formatted JSON string.
 * @returns {string}
 */
function exportToJSON() {
  const obj = {
    teamName:  state.teamName,
    formation: state.formation,
    players:   state.players.map(({ number, name, pos, x, y }) => ({ number, name, pos, x, y })),
  };
  if (state.extras.length > 0) {
    obj.extras = state.extras.map(({ number, name, pos, x, y }) => ({ number, name, pos, x, y }));
  }
  return JSON.stringify(obj, null, 2);
}

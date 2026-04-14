// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// json-import.js — JSON import / export modal
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function openImportModal() {
  document.getElementById('jsonTextarea').value = '';
  document.getElementById('jsonError').classList.remove('visible');
  document.getElementById('jsonTextarea').classList.remove('error');
  document.getElementById('importModal').classList.add('open');
  document.getElementById('jsonTextarea').focus();
}

function closeImportModal() {
  document.getElementById('importModal').classList.remove('open');
}

function applyJSON() {
  const raw      = document.getElementById('jsonTextarea').value.trim();
  const errorEl  = document.getElementById('jsonError');
  const textarea = document.getElementById('jsonTextarea');

  errorEl.classList.remove('visible');
  textarea.classList.remove('error');

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    showModalError('Invalid JSON: ' + e.message);
    return;
  }

  const err = loadFromJSON(parsed);
  if (err) {
    showModalError(err);
    return;
  }

  // Success — update UI
  document.getElementById('teamNameInput').value = state.teamName;
  renderAll();
  closeImportModal();
}

function showModalError(msg) {
  const errorEl  = document.getElementById('jsonError');
  const textarea = document.getElementById('jsonTextarea');
  errorEl.textContent = msg;
  errorEl.classList.add('visible');
  textarea.classList.add('error');
}

function copyCurrentJSON() {
  const json = exportToJSON();
  navigator.clipboard.writeText(json).then(() => {
    const btn = document.getElementById('copyJsonBtn');
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy Current as JSON'; }, 1800);
  }).catch(() => {
    // Fallback: populate textarea with current state
    document.getElementById('jsonTextarea').value = json;
  });
}

// Close modal when clicking the backdrop
document.addEventListener('click', (e) => {
  if (e.target.id === 'importModal') closeImportModal();
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeImportModal();
});

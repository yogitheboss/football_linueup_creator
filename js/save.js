// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// save.js — Export the pitch as a PNG image
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function saveImage() {
  const btn   = document.getElementById('saveBtn');
  const field = document.getElementById('canvas');

  btn.textContent = 'Saving…';
  btn.disabled    = true;

  // Close any open inline editors before capture
  document.querySelectorAll('.token-name-editor').forEach(e => e.blur());

  html2canvas(field, {
    backgroundColor: '#0f172a',
    scale:           2,
    useCORS:         true,
    logging:         false,
  }).then(canvas => {
    const a        = document.createElement('a');
    const filename = (state.teamName || 'lineup')
      .trim()
      .replace(/\s+/g, '_')
      .toLowerCase();
    a.download = filename + '_lineup.png';
    a.href     = canvas.toDataURL('image/png');
    a.click();
  }).catch(err => {
    console.error('Save failed:', err);
  }).finally(() => {
    btn.textContent = 'Save as Image';
    btn.disabled    = false;
  });
}

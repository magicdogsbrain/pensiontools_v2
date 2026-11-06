/**
 * A toast with an Undo button (6.23.0): "Your spending is now £2,264 a month. [Undo]" — shown for a while, and gone
 * for good once it expires or Undo is pressed. It has its own class, so the page's showToast (which removes any
 * .toast-notification before showing its own) never takes it down early.
 *
 * @param {string} message
 * @param {() => (void|Promise<void>)} onUndo
 * @param {{ ms?: number, doc?: Document, label?: string }} [o]
 * @returns {{ el: HTMLElement, close: () => void }}
 */
export const UNDO_TOAST_MS = 15000;

export function showUndoToast(message, onUndo, { ms = UNDO_TOAST_MS, doc = document, label = 'Undo' } = {}) {
  ensureStyles(doc);
  const old = doc.querySelector('.undo-toast'); if (old) old.remove();
  const el = doc.createElement('div');
  el.className = 'undo-toast';
  el.setAttribute('role', 'status');
  const msg = doc.createElement('span'); msg.className = 'undo-toast-message'; msg.textContent = String(message ?? '');
  const btn = doc.createElement('button'); btn.type = 'button'; btn.className = 'undo-toast-btn'; btn.textContent = label;
  el.append(msg, btn);
  doc.body.appendChild(el);
  let timer = null;
  const close = () => { if (timer) clearTimeout(timer); timer = null; el.classList.remove('show'); setTimeout(() => el.remove(), 300); };
  btn.addEventListener('click', async () => { btn.disabled = true; close(); try { await onUndo(); } catch (e) { console.error('undo', e); } });
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => el.classList.add('show')); else el.classList.add('show');
  timer = setTimeout(close, ms);
  return { el, close };
}

function ensureStyles(doc) {
  if (doc.getElementById('undoToastStyles')) return;
  const st = doc.createElement('style');
  st.id = 'undoToastStyles';
  st.textContent = `
    .undo-toast { position: fixed; left: 50%; bottom: 28px; transform: translateX(-50%) translateY(20px); opacity: 0; z-index: 1400;
      display: flex; align-items: center; gap: 14px; max-width: min(92vw, 560px); padding: 12px 16px; border-radius: 10px;
      background: var(--card, #1f2937); color: var(--text, #f3f4f6); border: 1px solid var(--border, #374151); box-shadow: 0 8px 24px rgba(0,0,0,.35);
      font-size: 14px; line-height: 1.4; transition: opacity .25s, transform .25s; }
    .undo-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
    .undo-toast-btn { flex: 0 0 auto; padding: 6px 14px; border-radius: 8px; border: 1px solid var(--primary, #6366f1); background: transparent;
      color: var(--primary, #6366f1); font-weight: 600; cursor: pointer; }
    .undo-toast-btn:hover { background: var(--primary, #6366f1); color: var(--bg, #fff); }
  `;
  doc.head.appendChild(st);
}

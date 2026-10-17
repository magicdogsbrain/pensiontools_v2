/**
 * A toast with an Undo button (research/v7/editing-in-v7.md 2): "Saved. Your plan now runs 32 years, to age 93. [Undo]" —
 * the Preact counterpart of the planner's src/ui/undoToast.js. Draws only: whether it shows, and for how long, is the
 * state's (ui.toast; effects/planWrite.js closes it after TOAST_MS). role="status", so a screen reader hears it.
 *
 *   <UndoToast toast text onUndo onClose words />
 *     toast   ui.toast: { kind: 'saved' | 'undoing' | 'undone' | 'unchanged', … }
 */
import { Button } from './Button.jsx';

export function UndoToast({ toast, text, onUndo, onClose, words }) {
  if (!toast) return null;
  const canUndo = toast.kind === 'saved';
  return (
    <div class={`undo-toast is-${toast.kind}`} role="status" data-testid="plan.about.toast" data-kind={toast.kind}>
      <span class="undo-toast-message">{text}</span>
      {canUndo && <Button testid="plan.about.undo" kind="quiet" class="undo-toast-btn" onClick={onUndo}>{words.undo}</Button>}
      {toast.kind === 'undoing' && <span class="note">…</span>}
      <Button testid="plan.about.toastClose" kind="quiet" class="undo-toast-close" aria-label={words.close} onClick={onClose}>×</Button>
    </div>
  );
}

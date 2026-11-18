/**
 * The full view's thousand-separator overlay on number boxes (lifted out of index.html's initFormattedDisplays): each box
 * not yet formatted is wrapped in a tight span with an overlay that shows its figure with separators while it is not being
 * edited. The page calls it once after load and again whenever boxes are added (its MutationObserver).
 *
 *   formatNumberBoxes(doc, fmt)   fmt(value) → the figure with separators (index.html's formatWithSpaces)
 */
export function formatNumberBoxes(doc, fmt) {
  doc.querySelectorAll('input[type="number"]').forEach((input) => {
    // Skip inputs that already have formatting
    if (input.dataset.formatted) return;
    // Budget tab + wizard use dynamic flex rows; the overlay wrapper would disrupt their layout.
    if (input.closest('#budget-content') || input.closest('#budWizardOverlay') || input.closest('#adminPanelOverlay')) return;
    // Hidden templates get cloned later; a cloned overlay has no listeners and freezes. Format the clone, not the source.
    if (input.closest('#giltExplainerSource')) return;
    // A box with the focus is never moved: moving it takes the focus away, and what is typed next goes nowhere (a figure
    // typed into the tax-year set-up just as it opened was lost). It is wrapped on a later pass, once it has lost the focus.
    if (doc.activeElement === input) return;
    input.dataset.formatted = 'true';

    // AUDIT/ROBUSTNESS: the overlay must sit in a TIGHT container around just the input, so it
    // always centres on the input box. If the input isn't already in a tight `.input-with-unit`,
    // wrap it in a relative span. (Previously the wrapper fell back to input.parentElement — often
    // a .form-group that also contains the <label>, so top:50% landed at the TOP of the input.)
    let wrapper = input.closest('.input-with-unit');
    const hasUnit = !!wrapper;
    if (!wrapper) {
      wrapper = doc.createElement('span');
      wrapper.className = 'num-format-wrap';
      wrapper.style.cssText = 'position:relative; display:block;';
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);
    }

    // Create overlay span for formatted display
    const overlay = doc.createElement('span');
    overlay.className = 'number-format-overlay';

    // Left offset aligns with the input's text: with a £ unit ~34px, otherwise the input padding.
    const leftOffset = hasUnit ? '34px' : '14px';

    overlay.style.cssText = `
      position: absolute;
      left: ${leftOffset};
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      color: var(--text);   /* NOT inherit: inside a muted .hint label the overlay went grey */
      font-size: inherit;
      font-family: inherit;
      background: transparent;
      z-index: 1;
    `;

    const view = doc.defaultView;
    if (view && view.getComputedStyle(wrapper).position === 'static') {
      wrapper.style.position = 'relative';
    }

    // Function to update overlay
    function updateOverlay() {
      const val = parseFloat(input.value);
      if (!isNaN(val) && val >= 1000 && doc.activeElement !== input) {
        overlay.textContent = fmt(val);
        // top:50% is correct now that the wrapper is always tight around the input.
        overlay.style.display = 'block';
        input.style.color = 'transparent';
      } else {
        overlay.style.display = 'none';
        input.style.color = '';
      }
    }

    // Store updateOverlay function on the input for external access
    input._updateOverlay = updateOverlay;

    // Hide overlay on focus, show on blur
    input.addEventListener('focus', () => {
      overlay.style.display = 'none';
      input.style.color = '';
    });

    input.addEventListener('blur', updateOverlay);
    input.addEventListener('input', () => {
      // Keep overlay hidden while typing
      if (doc.activeElement === input) {
        overlay.style.display = 'none';
        input.style.color = '';
      }
    });
    // Scroll-wheel / spinner / arrow-key changes can land while the input is NOT the active
    // element (e.g. wheel over an unfocused box, or after blur) — refresh the overlay on every
    // value change so the number shown always matches the value in the box.
    input.addEventListener('change', updateOverlay);
    input.addEventListener('wheel', () => setTimeout(updateOverlay, 0), { passive: true });

    // Insert overlay
    wrapper.appendChild(overlay);

    // Initial format
    updateOverlay();
  });
}

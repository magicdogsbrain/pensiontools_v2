/**
 * The full view's thousand-separator overlay on number boxes (src/ui/numberOverlays.js). It wraps each new box in a span,
 * which moves the box in the page. A box moved while it has the focus loses it, and what is typed next goes nowhere: a
 * figure typed into the tax-year set-up just as it opened was lost and the year was set up with £0 of income so far.
 * A box with the focus is left where it is; it is wrapped on a later pass, once it has lost the focus.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { formatNumberBoxes } from '../src/ui/numberOverlays.js';

const fmt = (v) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

describe('formatNumberBoxes', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div class="wizard-input"><span>£</span><input type="number" id="typed" value="0"><span>before tax</span></div>'
      + '<div class="wizard-input"><span>£</span><input type="number" id="other" value="25000"></div>';
  });

  it('never moves a box that has the focus, so what is being typed stays in it', () => {
    const box = document.getElementById('typed');
    const parent = box.parentNode;
    box.focus();
    formatNumberBoxes(document, fmt);
    expect(box.parentNode).toBe(parent);
    expect(document.activeElement).toBe(box);
    expect(box.dataset.formatted).toBeUndefined();
  });

  it('wraps the other boxes and shows their figure with separators', () => {
    document.getElementById('typed').focus();
    formatNumberBoxes(document, fmt);
    const other = document.getElementById('other');
    expect(other.parentNode.className).toBe('num-format-wrap');
    expect(other.dataset.formatted).toBe('true');
    expect(other.parentNode.querySelector('.number-format-overlay').textContent).toBe('25 000');
  });

  it('wraps the box on a later pass, once it has lost the focus, keeping what was typed', () => {
    const box = document.getElementById('typed');
    box.focus();
    formatNumberBoxes(document, fmt);
    box.value = '21000';
    box.blur();
    formatNumberBoxes(document, fmt);
    expect(box.dataset.formatted).toBe('true');
    expect(box.parentNode.className).toBe('num-format-wrap');
    expect(box.value).toBe('21000');
  });

  it('leaves the Budget, its wizard, the admin panel and hidden templates alone', () => {
    document.body.innerHTML = '<div id="budget-content"><input type="number" id="a"></div><div id="budWizardOverlay"><input type="number" id="b"></div>'
      + '<div id="adminPanelOverlay"><input type="number" id="c"></div><div id="giltExplainerSource"><input type="number" id="d"></div>';
    formatNumberBoxes(document, fmt);
    for (const id of ['a', 'b', 'c', 'd']) expect(document.getElementById(id).dataset.formatted).toBeUndefined();
  });
});

// @vitest-environment jsdom
/**
 * The full view's "Plan to age" box (lead4.md D5, R3; step F1): it asks the same quantity as the simple view's box — the age
 * the plan runs to — and keeps the stored length (duration) in step, so both views' boxes for field about.endAge hold one value.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { paintEndAge, endAgeTyped, endAgeError } from '../src/ui/endAgeBox.js';
import { planToAgeOf } from '../src/services/AgeConvention.js';

function form(startAge, duration) {
  document.body.innerHTML = '<input id="shapeAgeNow" value="' + startAge + '"><input type="hidden" id="ssDuration" value="' + duration + '">'
    + '<input type="number" id="ssEndAge"><span id="ssDurationAgeHint"></span>';
}
const $ = (id) => document.getElementById(id);

describe('the full view asks the age the plan runs to', () => {
  beforeEach(() => form(61, 36));

  it('shows the end age the simple view shows (the start age + the stored length)', () => {
    paintEndAge(document, { shapeAgeNow: 61 });
    expect($('ssEndAge').value).toBe(String(planToAgeOf(61, 36)));
    expect($('ssEndAge').value).toBe('97');
    expect($('ssDurationAgeHint').textContent).toContain('36 years');
  });

  it('an end age typed keeps the stored length in step', () => {
    paintEndAge(document, { shapeAgeNow: 61 });
    $('ssEndAge').value = '95';
    endAgeTyped(document, { shapeAgeNow: 61 });
    expect($('ssDuration').value).toBe('34');
    expect(endAgeError(document, { shapeAgeNow: 61 })).toBeNull();
  });

  it('an end age too close to the start is said with the simple view\'s words, and the length is not changed', () => {
    $('ssEndAge').value = '63';
    endAgeTyped(document, { shapeAgeNow: 61 });
    expect($('ssDuration').value).toBe('36');
    expect(endAgeError(document, { shapeAgeNow: 61 })).toBe('Plan to age: the plan has to run at least 5 years: an age of 66 or more.');
  });

  it('the box is left alone while a person is typing in it', () => {
    $('ssEndAge').value = '9';
    $('ssEndAge').focus();
    paintEndAge(document, { shapeAgeNow: 61 });
    expect($('ssEndAge').value).toBe('9');
  });

  it('with no start age known the box is empty, never a guess', () => {
    form('', 36);
    paintEndAge(document, null);
    expect($('ssEndAge').value).toBe('');
  });
});

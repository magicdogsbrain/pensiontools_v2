/**
 * The final-salary pension's start is asked by AGE, with the plan year derived and said beside the box (v6 usability
 * audit, problem 3, 17 Oct 2026). A start past the plan's end — the "65 typed as a plan year" that was saved and never
 * paid — is said plainly and refused on Save. The saved key the engines read (dbStartYear) stays; the age is written
 * beside it (dbStartAge), and an old plan's age is read from its year.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { dbStartAgeOf, dbStartYearOfAge, dbStartWords, setDbStartFields, paintDbStart, dbStartFromAgeInput, dbStartError, dbStartAgeForSave } from '../src/ui/dbStartSetting.js';
import { lumpyByYear } from '../src/strategies/stressTest.js';

const form = () => new JSDOM('<input type="hidden" id="shapeAgeNow" value="63"><input type="number" id="ssDuration" value="30"><input type="number" id="ssDbAmount" value="5200">'
  + '<input type="number" id="ssDbStartAge"><input type="hidden" id="ssDbStartYear" value="0"><p id="ssDbStartHint"></p>').window.document;
const timing = { shapeAgeNow: 63, firstTaxYear: 2029 };

describe('the pure rules', () => {
  it('age ↔ plan year', () => {
    expect(dbStartYearOfAge(76, 63)).toBe(13);
    expect(dbStartYearOfAge(61, 63)).toBe(-2);
    expect(dbStartYearOfAge('', 63)).toBeNull();
    expect(dbStartYearOfAge(76, 0)).toBeNull();
    expect(dbStartAgeOf({ dbStartYear: 13 }, 63)).toBe(76);          // an old plan: the age from its year
    expect(dbStartAgeOf({ dbStartYear: 13, dbStartAge: 74 }, 63)).toBe(74);   // the saved age wins
    expect(dbStartAgeOf({ dbStartYear: 13 }, null)).toBeNull();
  });
  it('says what the start means: age and tax year', () => {
    expect(dbStartWords({ year: 13, startAge: 63, firstTaxYear: 2029, duration: 30, amount: 5200 })).toEqual({ level: null, text: 'That is age 76, plan year 13 (tax year 2042/43).' });
    expect(dbStartWords({ year: 0, startAge: 63, firstTaxYear: 2029, duration: 30, amount: 5200 })).toEqual({ level: null, text: 'That is the plan\'s first year, age 63 (tax year 2029/30) — the pension is paid from the start.' });
    expect(dbStartWords({ year: 13, startAge: 63, duration: 30, amount: 0 })).toEqual({ level: null, text: '' });   // no pension entered: nothing to say
  });
  it('past the plan\'s end is an error that names the last age; before the start is a warning', () => {
    const w = dbStartWords({ year: 65, startAge: 63, firstTaxYear: 2029, duration: 30, amount: 5200 });   // "65" typed as a plan year
    expect(w.level).toBe('error');
    expect(w.text).toContain('after the plan ends at age 92');
    expect(w.text).toContain('would never pay');
    expect(w.text).toContain('Enter an age up to 92');
    expect(dbStartWords({ year: 30, startAge: 63, duration: 30, amount: 1 }).level).toBe('error');   // the first year past the end
    expect(dbStartWords({ year: 29, startAge: 63, duration: 30, amount: 1 }).level).toBeNull();
    const b = dbStartWords({ year: -2, startAge: 63, firstTaxYear: 2029, duration: 30, amount: 5200 });
    expect(b.level).toBe('warn');
    expect(b.text).toContain('before the plan starts at age 63');
    expect(b.text).toContain('counted as already being paid from the plan\'s first year (tax year 2029/30)');
  });
  it('the engine agrees: a year past the plan\'s length never pays', () => {
    const { otherIncomeByYear } = lumpyByYear({}, { dbAmount: 5200, dbStartYear: 65, dbIndexation: 'cpi' }, 30);
    expect(otherIncomeByYear.every((v) => v === 0)).toBe(true);
    const ok = lumpyByYear({}, { dbAmount: 5200, dbStartYear: 13, dbIndexation: 'cpi' }, 30).otherIncomeByYear;
    expect(ok[12]).toBe(0); expect(ok[13]).toBe(5200);
  });
});

describe('the form', () => {
  it('an old plan (year only): the age box is filled from the year once the start age is known, and the words follow', () => {
    const doc = form();
    setDbStartFields(doc, { dbStartYear: 13 }, timing);
    expect(doc.getElementById('ssDbStartYear').value).toBe('13');
    expect(doc.getElementById('ssDbStartAge').value).toBe('76');
    expect(doc.getElementById('ssDbStartHint').textContent).toBe('That is age 76, plan year 13 (tax year 2042/43).');
    expect(dbStartAgeForSave(doc)).toBe(76);
  });
  it('a saved age wins over the year, and the year is re-derived from it', () => {
    const doc = form();
    setDbStartFields(doc, { dbStartYear: 13, dbStartAge: 74 }, timing);
    expect(doc.getElementById('ssDbStartAge').value).toBe('74');
    expect(doc.getElementById('ssDbStartYear').value).toBe('11');
  });
  it('without the start age yet (timing not derived), the year is kept and the age box waits; paintDbStart fills it later', () => {
    const doc = form();
    doc.getElementById('shapeAgeNow').value = '';
    setDbStartFields(doc, { dbStartYear: 13 }, null);
    expect(doc.getElementById('ssDbStartYear').value).toBe('13');
    expect(doc.getElementById('ssDbStartAge').value).toBe('');
    paintDbStart(doc, timing);
    expect(doc.getElementById('ssDbStartAge').value).toBe('76');
  });
  it('typing an age writes the year the engines read; a start past the end is red and refused on Save', () => {
    const doc = form();
    setDbStartFields(doc, { dbStartYear: 0 }, timing);
    doc.getElementById('ssDbStartAge').value = '71';
    const w = dbStartFromAgeInput(doc, timing);
    expect(doc.getElementById('ssDbStartYear').value).toBe('8');
    expect(w.level).toBeNull();
    expect(dbStartError(doc, timing)).toBeNull();
    doc.getElementById('ssDbStartAge').value = '101';
    dbStartFromAgeInput(doc, timing);
    expect(doc.getElementById('ssDbStartYear').value).toBe('38');
    expect(doc.getElementById('ssDbStartHint').textContent).toContain('after the plan ends at age 92');
    const err = dbStartError(doc, timing);
    expect(err).toContain('Final-salary pension start:');
    expect(err).toContain('would never pay');
    doc.getElementById('ssDbAmount').value = '0';   // no pension: nothing to refuse
    expect(dbStartError(doc, timing)).toBeNull();
  });
});

describe('index.html asks by age', () => {
  const html = readFileSync('index.html', 'utf8');
  it('the box is an age; the year is hidden and still saved; the age is saved beside it; Save refuses a start past the end', () => {
    expect(html).toContain('<label>Final-salary pension starts at age</label>');
    expect(html).toContain('id="ssDbStartAge"');
    expect(html).toContain('<input type="hidden" id="ssDbStartYear" value="0">');
    expect(html).not.toContain('DB Starts (plan year, 0 = now)');
    expect(html).toContain("dbStartYear: +document.getElementById('ssDbStartYear').value || 0, dbStartAge: dbStartAgeForSave(document)");
    expect(html).toContain('const dbErr = dbStartError(document, window._ssTiming); if (dbErr) { showToast(dbErr');
  });
});

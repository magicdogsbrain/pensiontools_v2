/**
 * The full view's Decision → Settings has no Save (7.12.0, the two-views brief step 12). An unlocked plan's Decision settings
 * are read from its own figures (DraftDecision.js) and changed on Stress tester → Settings; a locked plan's are frozen by
 * the lock. The button could only ever be greyed out or explain the lock, so it and the code that served only it are gone.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');

describe('Decision → Settings has no Save', () => {
  it('no button, no handler, no style for it', () => {
    expect(html).not.toContain('id="dsSaveBtn"');
    expect(html).not.toContain('saveDecisionSettingsUI');
    expect(html).not.toContain('#dsSaveBtn');
  });
  it('the lock banner still draws: refreshDecisionLock needs only the banner', () => {
    const i = html.indexOf('async function refreshDecisionLock()');
    expect(i).toBeGreaterThan(0);
    const body = html.slice(i, html.indexOf('\n    }\n', i));
    expect(body).toContain("getElementById('dsLockBanner')");
    expect(body).not.toContain('saveBtn');
  });
});

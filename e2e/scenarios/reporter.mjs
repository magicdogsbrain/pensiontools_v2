/**
 * The scenario run's report: the catalogue (questions.js) with each question's status from this run, printed and written
 * to test-results/scenarios/answers.md. One line per question: answered, or the first sentence of its failure. It also
 * prints each scenario's time, and fails the run when the whole run passes 13 minutes (the budget, brief 2.5).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { QUESTIONS, SCENARIOS } from './questions.js';

const BUDGET_MS = 13 * 60_000;
const scenarioOf = (file) => (/(s\d\d)-[^/]*\.spec\.js$/.exec(file) || [])[1] || null;

export default class ScenarioReporter {
  constructor(options = {}) {
    this.out = options.outputFile || join('test-results', 'scenarios', 'answers.md');
    this.results = new Map();            // scenario → [{ project, status, expected, ms, failure }]
    this.started = Date.now();
  }

  onTestEnd(test, result) {
    const s = scenarioOf(test.location.file);
    if (!s) return;
    const failure = (test.annotations.find((a) => a.type === 'failure') || result.annotations?.find?.((a) => a.type === 'failure') || {}).description
      || (result.status !== 'passed' && result.error ? String(result.error.message || '').split('\n')[0] : null);
    const list = this.results.get(s) || [];
    list.push({ project: test.parent.project()?.name || '', title: test.title, status: result.status, expected: test.expectedStatus, ms: result.duration, failure });
    this.results.set(s, list);
  }

  /** How a scenario stands: 'answered', 'failed: …', 'expected to fail (known)', or 'passed unexpectedly'. */
  standing(s) {
    const runs = this.results.get(s);
    if (!runs) return null;
    const bad = runs.find((r) => (r.expected === 'failed' ? r.status === 'passed' : r.status !== 'passed' && r.status !== 'skipped'));
    if (bad) return bad.expected === 'failed' ? `passed although listed as unanswered (${bad.project}): take it off known-unanswered.json` : `${bad.failure || bad.status} (${bad.project})`;
    if (runs.some((r) => r.expected === 'failed')) return 'not answered yet, as listed in known-unanswered.json';
    return 'answered';
  }

  report() {
    const lines = ['# What people ask, and whether this build answers it', '', `Run of ${new Date().toISOString().slice(0, 16).replace('T', ' ')}. One line per question.`, ''];
    let stage = null;
    for (const q of QUESTIONS.filter((x) => !x.harness)) {
      if (q.stage !== stage) { stage = q.stage; lines.push('', `## ${stage[0].toUpperCase()}${stage.slice(1)}`, ''); }
      let status;
      if (!q.sc.length) status = q.every ? 'checked on every page (the never-list)' : `not gated: ${q.why}`;
      else {
        const parts = q.sc.map((s) => {
          if (!SCENARIOS[s] || !SCENARIOS[s].built) return `${s}: not built yet`;
          return `${s}: ${this.standing(s) || 'not run'}`;
        });
        status = parts.join('; ');
      }
      lines.push(`- **${q.id}** ${q.text} — ${status} (${q.owner})`);
    }
    lines.push('', '## Times', '');
    for (const [s, runs] of [...this.results.entries()].sort()) for (const r of runs) lines.push(`- ${s} ${r.project}: ${(r.ms / 1000).toFixed(0)} s, ${r.status}`);
    return lines.join('\n') + '\n';
  }

  onEnd(result) {
    const text = this.report();
    mkdirSync(dirname(this.out), { recursive: true });
    writeFileSync(this.out, text);
    console.log('\n' + text);
    const total = Date.now() - this.started;
    console.log(`Scenario run: ${(total / 60_000).toFixed(1)} minutes (budget 13).`);
    if (total > BUDGET_MS) {
      console.log('The scenario run passed its 13-minute budget: the run fails.');
      return { status: 'failed' };
    }
    return undefined;
  }

  printsToStdio() { return false; }
}

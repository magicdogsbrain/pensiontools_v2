/**
 * The V7 worker (V7 build brief 4.10): `init` then `answer` through the real worker module's message handler, and
 * the client that pairs each reply with its request. The answer behind it is whatever src/answers/index.js holds
 * (package 1's stub until the real function lands), so nothing here asserts a figure.
 */
import { describe, it, expect, vi } from 'vitest';
import { createHandler } from '../../../src/v7/effects/answerWorker.js';
import { createWorkerClient, NO_WORKER } from '../../../src/v7/effects/workerClient.js';
import { ANSWERS } from '../../../src/answers/index.js';
import { VERSION } from '../../../src/constants.js';

const INPUTS = { household: 'single', you: { pot: 250000, age: 58 } };
const ENV = { today: '2026-09-30', futures: 100, seed: 0, trace: false };

/** Send one message to a handler and collect what it posts. */
function send(handle, msg) {
  const out = [];
  handle(msg, (m) => out.push(m));
  return out;
}

describe('the message handler', () => {
  it('init → ready, with the engine version', () => {
    const out = send(createHandler(), { id: 1, type: 'init', today: '2026-09-30' });
    expect(out.length).toBe(1);
    expect(out[0]).toMatchObject({ id: 1, ready: true, engineVersion: VERSION });
    expect('historyEnd' in out[0]).toBe(true);
  });
  it('init then answer → progress, then the result', () => {
    const handle = createHandler();
    send(handle, { id: 1, type: 'init', today: '2026-09-30' });
    const out = send(handle, { id: 2, type: 'answer', q: 'c', inputs: INPUTS, env: ENV });
    const last = out[out.length - 1];
    expect(out.every((m) => m.id === 2)).toBe(true);
    expect(out.slice(0, -1).every((m) => m.progress && typeof m.progress.done === 'number' && typeof m.progress.total === 'number')).toBe(true);
    expect(last.result).toBeTruthy();
    expect(last.result.status).not.toBe('invalid');
    expect(last.result.basis.today).toBe('2026-09-30');
    expect(last.result.basis.futures).toBe(100);
    expect(last.result.inputs.you).toMatchObject({ pot: 250000, age: 58 });
  });
  it('the result is the answer function\'s own, and is plain data', () => {
    const out = send(createHandler(), { id: 2, type: 'answer', q: 'c', inputs: INPUTS, env: ENV });
    const result = out[out.length - 1].result;
    expect(result).toEqual(JSON.parse(JSON.stringify(ANSWERS.c.answer(INPUTS, ENV))));
    expect(() => structuredClone(result)).not.toThrow();
  });
  it('the date given at init is used when a message carries none, and the message\'s own date wins', () => {
    const handle = createHandler();
    send(handle, { id: 1, type: 'init', today: '2027-01-15' });
    const a = send(handle, { id: 2, type: 'answer', q: 'c', inputs: INPUTS, env: { futures: 100 } });
    expect(a[a.length - 1].result.basis.today).toBe('2027-01-15');
    const b = send(handle, { id: 3, type: 'answer', q: 'c', inputs: INPUTS, env: ENV });
    expect(b[b.length - 1].result.basis.today).toBe('2026-09-30');
  });
  it('bad inputs come back as a result with status "invalid", not as an error', () => {
    const out = send(createHandler(), { id: 4, type: 'answer', q: 'c', inputs: { you: { pot: -5 } }, env: ENV });
    expect(out[out.length - 1].result.status).toBe('invalid');
  });
  it('an unknown question, an unknown message and a function that throws → { id, error }', () => {
    const handle = createHandler({ c: { answer: () => { throw new Error('boom'); } } });
    expect(send(handle, { id: 5, type: 'answer', q: 'z', inputs: {}, env: ENV })).toEqual([{ id: 5, error: expect.any(String) }]);
    expect(send(handle, { id: 6, type: 'dance' })).toEqual([{ id: 6, error: expect.any(String) }]);
    expect(send(handle, { id: 7, type: 'answer', q: 'c', inputs: {}, env: ENV })).toEqual([{ id: 7, error: 'boom' }]);
    expect(() => send(handle, null)).not.toThrow();
  });
  it('progress is thinned: a thousand futures do not mean a thousand messages', () => {
    const handle = createHandler({ c: { answer: (inputs, env) => { for (let i = 1; i <= env.futures; i++) env.onProgress(i, env.futures); return { status: 'ok' }; } } });
    const out = send(handle, { id: 8, type: 'answer', q: 'c', inputs: {}, env: { ...ENV, futures: 1000 } });
    const progress = out.filter((m) => m.progress);
    expect(progress.length).toBeLessThanOrEqual(25);
    expect(progress[progress.length - 1].progress).toEqual({ done: 1000, total: 1000 });
    expect(out[out.length - 1]).toEqual({ id: 8, result: { status: 'ok' } });
  });
  it('functions never cross: the env the answer sees has the handler\'s own onProgress only', () => {
    let seen = null;
    const handle = createHandler({ c: { answer: (inputs, env) => { seen = env; return { status: 'ok', f: () => 1 }; } } });
    const out = send(handle, { id: 9, type: 'answer', q: 'c', inputs: {}, env: ENV });
    expect(typeof seen.onProgress).toBe('function');
    expect(out[out.length - 1].result).toEqual({ status: 'ok' });      // cloneSafe dropped the function
  });
});

/** A Worker stand-in that runs the REAL handler, delivering messages a moment later as a worker does. */
function makeFakeWorker(handle = createHandler()) {
  const made = [];
  const makeWorker = () => {
    const w = {
      terminated: false,
      received: [],
      onmessage: null,
      onerror: null,
      postMessage(msg) {
        const copy = structuredClone(msg);                 // throws on a function, as a real worker would
        w.received.push(copy);
        queueMicrotask(() => {
          if (w.terminated) return;
          handle(copy, (m) => { if (!w.terminated && w.onmessage) w.onmessage({ data: structuredClone(m) }); });
        });
      },
      terminate() { w.terminated = true; }
    };
    made.push(w);
    return w;
  };
  return { makeWorker, made };
}

describe('the worker client', () => {
  it('init resolves with what the worker said', async () => {
    const { makeWorker, made } = makeFakeWorker();
    const client = createWorkerClient({ makeWorker });
    const ready = await client.init('2026-09-30');
    expect(ready).toMatchObject({ engineVersion: VERSION });
    expect(made.length).toBe(1);
    expect(made[0].received[0]).toMatchObject({ type: 'init', today: '2026-09-30' });
  });
  it('init then answer, end to end: the message is exactly the contract', async () => {
    const { makeWorker, made } = makeFakeWorker();
    const client = createWorkerClient({ makeWorker });
    await client.init('2026-09-30');
    const progress = vi.fn();
    const result = await client.answer('c', INPUTS, { ...ENV, onProgress: () => {} }, progress);
    expect(result.status).toBe('ok');
    expect(result.inputs.you.pot).toBe(250000);
    const msg = made[0].received[1];
    expect(Object.keys(msg).sort()).toEqual(['env', 'id', 'inputs', 'q', 'type']);
    expect(msg).toMatchObject({ type: 'answer', q: 'c', inputs: INPUTS, env: ENV });
    expect(Object.keys(msg.env).sort()).toEqual(['futures', 'seed', 'today', 'trace']);
    expect(progress).toHaveBeenCalled();
    // Progress counts rise to the total, and the last message says it is done.
    const calls = progress.mock.calls;
    for (let i = 1; i < calls.length; i++) expect(calls[i][0]).toBeGreaterThanOrEqual(calls[i - 1][0]);
    for (const [done, total] of calls) expect(done).toBeLessThanOrEqual(total);
    expect(calls.at(-1)[0]).toBe(calls.at(-1)[1]);
  });
  it('an answer asked for before init still gets its date from the message', async () => {
    const { makeWorker } = makeFakeWorker();
    const client = createWorkerClient({ makeWorker });
    const result = await client.answer('c', INPUTS, ENV);
    expect(result.basis.today).toBe('2026-09-30');
  });
  it('two answers under way come back to the right callers', async () => {
    const handle = createHandler({ c: { answer: (inputs) => ({ status: 'ok', echo: inputs.n }) } });
    const { makeWorker } = makeFakeWorker(handle);
    const client = createWorkerClient({ makeWorker });
    const [a, b] = await Promise.all([client.answer('c', { n: 1 }, ENV), client.answer('c', { n: 2 }, ENV)]);
    expect([a.echo, b.echo]).toEqual([1, 2]);
  });
  it('an error from the worker rejects', async () => {
    const { makeWorker } = makeFakeWorker(createHandler({ c: { answer: () => { throw new Error('boom'); } } }));
    const client = createWorkerClient({ makeWorker });
    await expect(client.answer('c', INPUTS, ENV)).rejects.toThrow('boom');
  });
  it('stop() ends the worker; the run under way is rejected and its result never arrives', async () => {
    const { makeWorker, made } = makeFakeWorker();
    const client = createWorkerClient({ makeWorker });
    await client.init('2026-09-30');
    const p = client.answer('c', INPUTS, ENV);
    const outcome = p.then(() => 'resolved', (e) => e.code);
    client.stop();
    expect(made[0].terminated).toBe(true);
    expect(await outcome).toBe('stopped');
  });
  it('after stop() the next answer starts a fresh worker, which is told the date again', async () => {
    const { makeWorker, made } = makeFakeWorker();
    const client = createWorkerClient({ makeWorker });
    await client.init('2026-09-30');
    client.answer('c', INPUTS, ENV).catch(() => {});
    client.stop();
    const result = await client.answer('c', INPUTS, { ...ENV, futures: 1000 });
    expect(made.length).toBe(2);
    expect(made[1].received.map((m) => m.type)).toEqual(['init', 'answer']);
    expect(made[1].received[0].today).toBe('2026-09-30');
    expect(result.basis.futures).toBe(1000);
  });
  it('stop() with nothing under way leaves the worker alone (it stays ready)', async () => {
    const { makeWorker, made } = makeFakeWorker();
    const client = createWorkerClient({ makeWorker });
    await client.init('2026-09-30');
    client.stop();
    expect(made[0].terminated).toBe(false);
    await client.answer('c', INPUTS, ENV);
    expect(made.length).toBe(1);
  });
  it('init with a new date re-sends it (the test hook pins the date this way)', async () => {
    const { makeWorker, made } = makeFakeWorker();
    const client = createWorkerClient({ makeWorker });
    await client.init('2026-09-30');
    await client.init('2028-04-06');
    expect(made[0].received.map((m) => m.today)).toEqual(['2026-09-30', '2028-04-06']);
  });

  describe('when no worker can start', () => {
    const code = (p) => p.then(() => 'resolved', (e) => e.code);
    it('the constructor throws', async () => {
      const client = createWorkerClient({ makeWorker: () => { throw new Error('blocked'); } });
      expect(await code(client.init('2026-09-30'))).toBe(NO_WORKER);
      expect(await code(client.answer('c', INPUTS, ENV))).toBe(NO_WORKER);
      expect(client.available()).toBe(false);
    });
    it('there is no Worker at all', async () => {
      const client = createWorkerClient({ makeWorker: () => null });
      expect(await code(client.answer('c', INPUTS, ENV))).toBe(NO_WORKER);
    });
    it('the worker fails to load (an error before it was ever ready)', async () => {
      const made = [];
      const client = createWorkerClient({ makeWorker: () => { const w = { postMessage() {}, terminate() { w.terminated = true; } }; made.push(w); return w; } });
      const p = code(client.answer('c', INPUTS, ENV));
      made[0].onerror({ preventDefault() {} });
      expect(await p).toBe(NO_WORKER);
      expect(client.available()).toBe(false);
      expect(await code(client.answer('c', INPUTS, ENV))).toBe(NO_WORKER);
      expect(made.length).toBe(1);                         // not tried again
    });
    it('an error AFTER it was ready is a failed run, not "no worker"', async () => {
      const { makeWorker, made } = makeFakeWorker(createHandler({ c: { answer: () => ({ status: 'ok' }) } }));
      const client = createWorkerClient({ makeWorker });
      await client.init('2026-09-30');
      const p = code(client.answer('c', INPUTS, ENV));
      made[0].onerror({ preventDefault() {} });
      expect(await p).not.toBe(NO_WORKER);
      expect(client.available()).toBe(true);
      await client.answer('c', INPUTS, ENV);               // a fresh worker
      expect(made.length).toBe(2);
    });
  });
});

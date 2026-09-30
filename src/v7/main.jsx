/**
 * STUB (V7 package 1) — package 3 replaces this with the store and the effects.
 * Makes the state, draws App into #app, follows the address, and sets the ready mark.
 */
import { render } from 'preact';
import { App } from './App.jsx';
import { initialState } from './state/initial.js';
import { parse } from './router/routes.js';

const root = document.getElementById('app');
const d = new Date();
const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const state = initialState({ today, build: import.meta.env.MODE === 'test' ? 'test' : 'prod' });

function draw() {
  state.route = parse(window.location.hash);
  render(<App state={state} dispatch={() => {}} />, root);
  root.setAttribute('data-answer', 'none');
  root.setAttribute('data-ready', '1');
  root.dispatchEvent(new CustomEvent('pt:done', { bubbles: true }));
}

window.addEventListener('hashchange', draw);
draw();

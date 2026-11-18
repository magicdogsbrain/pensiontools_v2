/** Runs once before the parity sweep: the local emulators emptied, so every fixture's account is new. */
import { clearEmulators } from '../signed-in/emulator.js';

export default async function globalSetup() {
  await clearEmulators();
}

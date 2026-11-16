/**
 * Runs once before the scenarios: every account and document in the local emulators gone, so a run starts clean. The
 * scenarios themselves never clear the emulators; each makes its own account (account.js).
 */
import { clearEmulators } from '../signed-in/emulator.js';

export default async function globalSetup() {
  await clearEmulators();
}

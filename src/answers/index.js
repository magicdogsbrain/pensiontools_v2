/**
 * The answers V7 can work out, by question id. The shell's effects (runner, worker, test hooks) import this file
 * and nothing else from src/answers/ except schemas, validate.js and format.js.
 */
import { SCHEMA_C } from './c/schema.js';
import { answerC } from './c/answer.js';

export const ANSWERS = { c: { schema: SCHEMA_C, answer: answerC } };

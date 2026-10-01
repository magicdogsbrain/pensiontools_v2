/**
 * Every screen, by the name the address gives it (routes.js screenName, brief 4.9; step 4 brief 4.12). A screen is a
 * function (state, dispatch) → { question, rail, full, view?, content }: what App puts inside the Shell. Screens
 * compute nothing.
 */
import { FrontDoor } from './FrontDoor.jsx';
import { Soon } from './Soon.jsx';
import { NotBuilt } from './NotBuilt.jsx';
import { NumbersScreen } from './c/NumbersScreen.jsx';
import { AnswerScreen } from './c/AnswerScreen.jsx';
import { NumbersScreen as NumbersA } from './a/NumbersScreen.jsx';
import { AnswerScreen as AnswerA } from './a/AnswerScreen.jsx';
import { AgesScreen } from './a/AgesScreen.jsx';
import { NumbersScreen as NumbersB } from './b/NumbersScreen.jsx';
import { AnswerScreen as AnswerB } from './b/AnswerScreen.jsx';
import { ChoicesScreen } from './b/ChoicesScreen.jsx';

export const SCREENS = {
  front: FrontDoor,
  'c.numbers': NumbersScreen,
  'c.answer': AnswerScreen,
  'a.numbers': NumbersA,
  'a.answer': AnswerA,
  'a.ages': AgesScreen,
  'b.numbers': NumbersB,
  'b.answer': AnswerB,
  'b.choices': ChoicesScreen,
  soon: Soon,
  notBuilt: NotBuilt
};

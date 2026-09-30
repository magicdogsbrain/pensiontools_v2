/**
 * Every screen, by the name the address gives it (routes.js screenName, brief 4.9). A screen is a function
 * (state, dispatch) → { question, rail, full, content }: what App puts inside the Shell. Screens compute nothing.
 */
import { FrontDoor } from './FrontDoor.jsx';
import { Soon } from './Soon.jsx';
import { NotBuilt } from './NotBuilt.jsx';
import { NumbersScreen } from './c/NumbersScreen.jsx';
import { AnswerScreen } from './c/AnswerScreen.jsx';

export const SCREENS = {
  front: FrontDoor,
  'c.numbers': NumbersScreen,
  'c.answer': AnswerScreen,
  soon: Soon,
  notBuilt: NotBuilt
};

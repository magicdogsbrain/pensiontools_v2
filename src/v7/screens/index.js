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
import { SpendScreen as SpendA } from './a/SpendScreen.jsx';
import { SpendScreen as SpendB } from './b/SpendScreen.jsx';
import { keepScreen } from './KeepScreen.jsx';
import { PlansScreen } from './plan/PlansScreen.jsx';
import { PlanScreen } from './plan/PlanScreen.jsx';
import { AboutScreen } from './plan/AboutScreen.jsx';
import { IncomeScreen } from './plan/IncomeScreen.jsx';
import { SpendScreen as SpendPlan } from './plan/SpendScreen.jsx';
import { PotsScreen } from './plan/PotsScreen.jsx';
import { LastsScreen } from './plan/LastsScreen.jsx';

export const SCREENS = {
  front: FrontDoor,
  'c.numbers': NumbersScreen,
  'c.answer': AnswerScreen,
  'c.keep': keepScreen('c'),
  'a.numbers': NumbersA,
  'a.spend': SpendA,
  'a.answer': AnswerA,
  'a.ages': AgesScreen,
  'a.keep': keepScreen('a'),
  'b.numbers': NumbersB,
  'b.spend': SpendB,
  'b.answer': AnswerB,
  'b.choices': ChoicesScreen,
  'b.keep': keepScreen('b'),
  soon: Soon,
  notBuilt: NotBuilt,
  // the saved plans, read-only (research/v7/your-plan.md)
  plans: PlansScreen,
  plan: PlanScreen,
  // the editing steps of a saved plan (research/v7/editing-in-v7.md 2, 7, 8, 9, 10)
  'plan.about': AboutScreen,
  'plan.income': IncomeScreen,
  'plan.spend': SpendPlan,
  'plan.pots': PotsScreen,
  'plan.lasts': LastsScreen
};

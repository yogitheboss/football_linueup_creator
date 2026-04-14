// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// formations.js — Formation definitions
//
// x, y are percentages of the pitch (0–100).
// x=0 is left edge, x=100 is right edge.
// y=0 is the top (opponent goal), y=100 is the bottom (own goal / GK end).
// Players are ordered: GK first, then defenders L→R, midfielders L→R, forwards L→R.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const FORMATIONS = {
  '4-4-2': [
    { pos: 'GK',  x: 50, y: 88 },
    { pos: 'LB',  x: 13, y: 73 }, { pos: 'CB', x: 36, y: 73 }, { pos: 'CB', x: 64, y: 73 }, { pos: 'RB', x: 87, y: 73 },
    { pos: 'LM',  x: 13, y: 50 }, { pos: 'CM', x: 36, y: 50 }, { pos: 'CM', x: 64, y: 50 }, { pos: 'RM', x: 87, y: 50 },
    { pos: 'ST',  x: 35, y: 22 }, { pos: 'ST', x: 65, y: 22 },
  ],
  '4-3-3': [
    { pos: 'GK',  x: 50, y: 88 },
    { pos: 'LB',  x: 13, y: 73 }, { pos: 'CB', x: 36, y: 73 }, { pos: 'CB', x: 64, y: 73 }, { pos: 'RB', x: 87, y: 73 },
    { pos: 'CM',  x: 28, y: 51 }, { pos: 'CM', x: 50, y: 51 }, { pos: 'CM', x: 72, y: 51 },
    { pos: 'LW',  x: 16, y: 22 }, { pos: 'ST', x: 50, y: 18 }, { pos: 'RW', x: 84, y: 22 },
  ],
  '3-5-2': [
    { pos: 'GK',  x: 50, y: 88 },
    { pos: 'CB',  x: 24, y: 73 }, { pos: 'CB', x: 50, y: 73 }, { pos: 'CB', x: 76, y: 73 },
    { pos: 'LWB', x: 10, y: 53 }, { pos: 'CM', x: 30, y: 50 }, { pos: 'CM', x: 50, y: 50 }, { pos: 'CM', x: 70, y: 50 }, { pos: 'RWB', x: 90, y: 53 },
    { pos: 'ST',  x: 35, y: 22 }, { pos: 'ST', x: 65, y: 22 },
  ],
  '4-2-3-1': [
    { pos: 'GK',  x: 50, y: 88 },
    { pos: 'LB',  x: 13, y: 74 }, { pos: 'CB', x: 36, y: 74 }, { pos: 'CB', x: 64, y: 74 }, { pos: 'RB', x: 87, y: 74 },
    { pos: 'DM',  x: 36, y: 59 }, { pos: 'DM', x: 64, y: 59 },
    { pos: 'LM',  x: 17, y: 41 }, { pos: 'AM', x: 50, y: 41 }, { pos: 'RM', x: 83, y: 41 },
    { pos: 'ST',  x: 50, y: 20 },
  ],
  '5-3-2': [
    { pos: 'GK',  x: 50, y: 88 },
    { pos: 'LWB', x: 10, y: 74 }, { pos: 'CB', x: 28, y: 74 }, { pos: 'CB', x: 50, y: 74 }, { pos: 'CB', x: 72, y: 74 }, { pos: 'RWB', x: 90, y: 74 },
    { pos: 'CM',  x: 28, y: 50 }, { pos: 'CM', x: 50, y: 50 }, { pos: 'CM', x: 72, y: 50 },
    { pos: 'ST',  x: 35, y: 22 }, { pos: 'ST', x: 65, y: 22 },
  ],
  '4-1-4-1': [
    { pos: 'GK',  x: 50, y: 88 },
    { pos: 'LB',  x: 13, y: 75 }, { pos: 'CB', x: 36, y: 75 }, { pos: 'CB', x: 64, y: 75 }, { pos: 'RB', x: 87, y: 75 },
    { pos: 'DM',  x: 50, y: 62 },
    { pos: 'LM',  x: 11, y: 45 }, { pos: 'CM', x: 33, y: 45 }, { pos: 'CM', x: 67, y: 45 }, { pos: 'RM', x: 89, y: 45 },
    { pos: 'ST',  x: 50, y: 20 },
  ],
};

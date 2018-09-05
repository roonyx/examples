const TOP = 'top';
const MID = 'mid';
const BOT = 'bot';

const intervalY = {
  [TOP]: { min: -500, max: -187 },
  [MID]: { min: -188, max: 157 },
  [BOT]: { min: 168, max: 390 },
};

const steps = {
  minX: 450,
  maxX: 600,
  minY: -400,
  maxY: 400,
  diff: 300,
};

const random = (min, max, prev) => {
  // eslint-disable-next-line
  const result = Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
  if (prev === undefined) return result;

  const diff = result - prev;
  if (Math.abs(diff) > steps.diff) return result;
  return random(min, max, prev);
};

const getPosition = i => {
  const value = i + 3;

  if (value % 3 === 0) return MID;

  return (value % 3 === 1) ? TOP : BOT;
};

const members = [
  {
    name: 'Vladimir Drogan',
    description: 'CEO and Founder',
    photo: '/static/images/member-photos/drogan.jpg',
    bgImage: '/static/images/bcg-img-team.jpg',
    isFirstElement: true,
    isShadowElement: true,
  },
  {
    name: 'Dmitry',
    description: 'CTO',
    photo: '/static/images/member-photos/anikin.jpg',
  },
  {
    name: 'Konstantin',
    description: 'COO',
    photo: '/static/images/member-photos/yuriev.jpg',
  },
  {
    name: 'Andrew',
    description: 'Developer',
    photo: '/static/images/member-photos/novoselov.jpg',
  },
  {
    name: 'Alexander',
    description: 'Developer',
    photo: '/static/images/member-photos/svetly.jpg',
  },
  {
    name: 'Andrew',
    description: 'Developer',
    photo: '/static/images/member-photos/kuleshov.jpg',
  },
  {
    name: 'Denis',
    description: 'Developer',
    photo: '/static/images/member-photos/oster.jpg',
  },
  {
    name: 'Alex',
    description: 'Developer',
    photo: '/static/images/member-photos/djikvas.jpg',
  },
  {
    name: 'Olga',
    description: 'Sales',
    photo: '/static/images/member-photos/romanenko.png',
  },
  {
    name: 'Prokhor',
    description: 'Developer',
    photo: '/static/images/member-photos/voloshchenko.jpg',
  },
  {
    name: 'Edward',
    description: 'Developer',
    photo: '/static/images/member-photos/endovickiy.jpg',
  },
  {
    name: 'Alexandra',
    description: 'Lead Generation',
    photo: '/static/images/member-photos/pavlova.jpg',
  },
  {
    name: 'Kirill',
    description: 'HR',
    photo: '/static/images/member-photos/lasombra.jpg',
  },
  {
    name: 'Marina',
    description: 'Developer',
    photo: '/static/images/member-photos/zakharova.jpg',
  },
  {
    name: 'Nina',
    description: 'HR',
    photo: '/static/images/member-photos/marmenkova.jpg',
  },
  {
    name: 'Eugene',
    description: 'Developer',
    photo: '/static/images/member-photos/yak.jpg',
  },
  {
    name: 'Anna',
    description: 'Lead Generation',
    photo: '/static/images/member-photos/lyashova.jpg',
  },
  {
    name: 'Mark',
    description: 'Developer',
    photo: '/static/images/member-photos/gladkov.jpg',
  },
];

let prevY = 0;
let prevX = 0;
export const MEMBERS = members.map((member, i) => {
  const newMember = { ...member };
  const positon = getPosition(i);

  if (newMember.isFirstElement) {
    newMember.x = 0;
    newMember.y = 0;
    return newMember;
  }

  newMember.x = random(steps.minX, steps.maxX) + prevX;
  prevX = newMember.x;

  newMember.y = random(intervalY[positon].min, intervalY[positon].max, prevY);
  prevY = newMember.y;

  return newMember;
});

export const NAME_FONT_SIZE = 45;
export const DESCRIPTION_FONT_SIZE = 22;

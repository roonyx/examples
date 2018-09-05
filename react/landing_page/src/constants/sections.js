// the section order is important

export const SECTION_MAIN_TYPE = 'main';
export const SECTION_MISSION_TYPE = 'mission';
export const SECTION_PORTFOLIO_TYPE = 'portfolio';
export const SECTION_TEAM_TYPE = 'team';
export const SECTION_VALUES_TYPE = 'values';
export const SECTION_CONTACTS_TYPE = 'contacts';
export const MAIN_WRAPPER_TYPE = 'main-wrapper';

export const SECTION_ORDERS = {
  [SECTION_MAIN_TYPE]: 0,
  [SECTION_MISSION_TYPE]: 1,
  [SECTION_PORTFOLIO_TYPE]: 2,
  [SECTION_VALUES_TYPE]: 3,
  [SECTION_TEAM_TYPE]: 4,
  [SECTION_CONTACTS_TYPE]: 5,
};

export const SECTIONS = {
  [SECTION_MAIN_TYPE]: {
    title: 'sidebar-main',
    id: SECTION_MAIN_TYPE,
    isHeadWithoutTitle: true,
    isDark: false,
  },
  [SECTION_MISSION_TYPE]: {
    id: SECTION_MISSION_TYPE,
    title: 'sidebar-mission',
    isDark: true,
  },
  [SECTION_PORTFOLIO_TYPE]: {
    id: SECTION_PORTFOLIO_TYPE,
    title: 'sidebar-portfolio',
    isDark: false,
  },
  [SECTION_VALUES_TYPE]: {
    id: SECTION_VALUES_TYPE,
    title: 'sidebar-values',
    isDark: false,
  },
  [SECTION_TEAM_TYPE]: {
    id: SECTION_TEAM_TYPE,
    title: 'sidebar-team',
    isDark: true,
  },
  [SECTION_CONTACTS_TYPE]: {
    id: SECTION_CONTACTS_TYPE,
    title: 'sidebar-contacts',
    isDark: false,
  },
};

export const BACK_SECTION_IMAGE = {
  src: '/static/images/arrow.png',
  alt: 'arrow-left',
};

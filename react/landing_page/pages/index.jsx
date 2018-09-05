import { Component } from 'react';
import { scroller } from 'react-scroll';
import { isMobile } from 'react-device-detect';
import { YMInitializer } from 'react-yandex-metrika';

import Swipeable from 'react-swipeable';
import Head from '../src/components/Head/Head';
import Main from '../src/components/Main/Main';
import Sidebar from '../src/components/Sidebar/Sidebar';
import Values from '../src/components/Values/Values';
import Contact from '../src/components/Contact/Contact';
import Team from '../src/components/Team/Team';
import PortfolioAndProjects from '../src/components/PortfolioAndProjects/PortfolioAndProjects';
import { withI18N } from '../src/hoc/withI18N';
import {
  SECTIONS,
  SECTION_MAIN_TYPE,
  SECTION_MISSION_TYPE,
  SECTION_PORTFOLIO_TYPE,
  SECTION_TEAM_TYPE,
  SECTION_VALUES_TYPE,
  SECTION_CONTACTS_TYPE,
  MAIN_WRAPPER_TYPE,
  SECTION_ORDERS,
} from '../src/constants/sections';
import { scrollSpeed } from '../src/constants/scrollSpeed';
import styles from '../static/styles/index-page.scss';
import MissionWrapper from '../src/components/MissionWrapper/MissionWrapper';
import CustomObserved from '../src/components/CustomObserved/CustomObserved';

const SCROLL_DOWN_DIRECTION = 'SCROLL_DOWN_DIRECTION';
const SCROLL_UP_DIRECTION = 'SCROLL_UP_DIRECTION';
let block = false;
let timeout = null;

class Homepage extends Component {
  state = {
    isSidebarOpen: false,
    lang: 'en',
    portfolio: {
      onPortfolio: true,
      position: '0vw',
      positionMain: '0vw',
    },
    scroll: {
      position: '0vh',
      section: SECTION_MAIN_TYPE,
      title: '',
    },
    startRiver: false,
    allowProjectTitleAnimation: false,
    contentReady: false,
  }
  currentSection = SECTION_MAIN_TYPE;

  lastEntry = {
    intersectionRatio: 0,
    type: null,
  };

  componentDidMount() {
    if (window) window.onload = () => this.setState({ contentReady: true });
  }

  scrollToSection = (type) => {
    scroller.scrollTo(type, {
      duration: 500,
      delay: 0,
      smooth: 'easeInOutQuart',
      containerId: MAIN_WRAPPER_TYPE,
    });
  }

  debounce = (e, fn, t) => {
    if (block) return;
    block = true;
    timeout = setTimeout(() => block = false, t);
    fn(e);
  };

  onWheel = e => {
    const scrollDirection = e.nativeEvent.wheelDelta > 0
      ? SCROLL_UP_DIRECTION
      : SCROLL_DOWN_DIRECTION;

    this.onScroll(scrollDirection);
  }

  onScroll = direction => {
    const currentSectionNumber = SECTION_ORDERS[this.currentSection];
    let nextSectionNumber = -1;

    if (direction === SCROLL_DOWN_DIRECTION) {
      nextSectionNumber = Object.keys(SECTION_ORDERS).length > currentSectionNumber + 1
        ? currentSectionNumber + 1
        : currentSectionNumber;
    } else if (direction === SCROLL_UP_DIRECTION) {
      nextSectionNumber = currentSectionNumber > 0
        ? currentSectionNumber - 1
        : currentSectionNumber;
    }

    const nextSectionType = Object.keys(SECTION_ORDERS)[nextSectionNumber];
    this.scrollToSection(nextSectionType);
    this.currentSection = nextSectionType;
  }

  sidebarScroll = (type) => {
    this.scrollToSection(type);
    this.setState({
      isSidebarOpen: !this.state.isSidebarOpen,
    });
  }

  onSidebarToggle = () => {
    this.setState(prevState => ({
      isSidebarOpen: !prevState.isSidebarOpen,
      allowProjectTitleAnimation: false,
    }));
  }

  onSwipe = (id = 0) => {
    const portfolio = { ...this.state.portfolio };
    portfolio.onPortfolio = false;
    portfolio.position = id < 0 ? '-100vw' : `-${id * 100}vw`;
    portfolio.currentSlideId = id + 1;
    this.setState({ portfolio, allowProjectTitleAnimation: true });
  }

  onSwipeMain = (onProject = false) => {
    const newState = { ...this.state };
    this.scrollToSection(SECTION_PORTFOLIO_TYPE);
    newState.portfolio.onPortfolio = !onProject;
    newState.portfolio.positionMain = !onProject ? '0vw' : '-100vw';
    newState.allowProjectTitleAnimation = onProject;
    this.setState(newState);
  }

  changeLanguage = () => {
    let nextLang = null;
    const currentLang = this.state.lang;

    if (currentLang === 'en') {
      nextLang = 'ru';
    } else if (currentLang === 'ru') {
      nextLang = 'en';
    }

    this.props.i18n.changeLanguage(nextLang, () => (
      this.setState({ lang: nextLang })
    ));
  }

  handleOnIntersect = (entry, type, intersectionObject) => {
    // calc HEAD component title and color
    if (
      ((entry.intersectionRatio >= 0.9 && entry.intersectionRatio <= 1) ||
      (entry.intersectionRatio >= 0.1 && entry.intersectionRatio <= 0.5)) &&
      entry.boundingClientRect.top < 200 && this.state.currentSection !== type) {
      const newState = { ...this.state };
      newState.currentSection = type;
      newState.allowProjectTitleAnimation = false;
      this.setState(newState);
    }

    if (type === SECTION_TEAM_TYPE &&
        entry.intersectionRatio >= 0.1 &&
        !this.state.startRiver) {
      this.setState({ startRiver: true });
    }
  }

  render() {
    const mainWrapperStyle = {
      transform: `translateY(-${this.state.scroll.position})`,
      transition: `transform ${scrollSpeed.baseSpeed} cubic-bezier(0.25, 0.46, 0, 0.98)`,
    };
    const isActiveHeadBackButton = !this.state.portfolio.onPortfolio;

    return (
      <Swipeable
        onSwipedUp={ () => this.onScroll(SCROLL_DOWN_DIRECTION) }
        onSwipedDown={ () => this.onScroll(SCROLL_UP_DIRECTION) }
      >
        <div className={ styles.window }>
          <Head
            section={ this.currentSection }
            lang={ this.state.lang }
            onSwipeMain={ this.onSwipeMain }
            isActiveHeadBackButton={ isActiveHeadBackButton }
          />
          <Sidebar
            isOpen={ this.state.isSidebarOpen }
            sidebarToggle={ this.onSidebarToggle }
            changeLanguage={ this.changeLanguage }
            lang={ this.state.lang }
            sections={ SECTIONS }
            scrollToSection={ this.sidebarScroll }
          />
          <div
            id={MAIN_WRAPPER_TYPE}
            className={ styles.mainWrapper }
            style={ mainWrapperStyle }
            ref={(ref) => { this.view = ref; }}
            onWheel={ e => this.debounce(e, this.onWheel, 1000) }
          >
            <CustomObserved handleOnIntersect={this.handleOnIntersect} type={SECTION_MAIN_TYPE}>
              <div className={ `${styles.section} ${styles.ptn}` } id={SECTION_MAIN_TYPE}>
                <Main
                  toContacts={ () => this.scrollToSection(SECTION_CONTACTS_TYPE) }
                  lang={ this.state.lang }
                />
              </div>
            </CustomObserved>
            <CustomObserved handleOnIntersect={this.handleOnIntersect} type={SECTION_MISSION_TYPE}>
              <div className={ [styles.section, styles.light].join(' ') } id={SECTION_MISSION_TYPE}>
                <MissionWrapper lang={ this.state.lang } />
              </div>
            </CustomObserved>
            <CustomObserved handleOnIntersect={this.handleOnIntersect} type={SECTION_PORTFOLIO_TYPE}>
              <div id={SECTION_PORTFOLIO_TYPE}>
                <PortfolioAndProjects
                  onSwipe={ this.onSwipe }
                  onSwipeMain={ this.onSwipeMain }
                  position={ this.state.portfolio.position }
                  positionMain={ this.state.portfolio.positionMain }
                  allowProjectTitleAnimation={ this.state.allowProjectTitleAnimation }
                  isActiveHeadBackButton={ isActiveHeadBackButton }
                  lang={ this.state.lang }
                  isMobile={isMobile}
                  currentSlideId={this.state.portfolio.currentSlideId}
                  toContacts={ () => this.scrollToSection(SECTION_CONTACTS_TYPE) }
                />
              </div>
            </CustomObserved>
            <CustomObserved handleOnIntersect={this.handleOnIntersect} type={SECTION_VALUES_TYPE}>
              <div
                className={ [styles['section-fullsize-background'], styles.strongBg].join(' ') }
                id={SECTION_VALUES_TYPE}
              >
                <Values lang={ this.state.lang } />
              </div>
            </CustomObserved>
            <CustomObserved handleOnIntersect={this.handleOnIntersect} type={SECTION_TEAM_TYPE}>
              <div className={ [styles.section, styles.light].join(' ') } id={SECTION_TEAM_TYPE}>
                { this.state.contentReady ? <Team startRiver={this.state.startRiver} /> : null }
              </div>
            </CustomObserved>
            <CustomObserved handleOnIntersect={this.handleOnIntersect} type={SECTION_CONTACTS_TYPE}>
              <div className={ `${styles.section} ${styles.sectionContact}` } id={SECTION_CONTACTS_TYPE}>
                <Contact lang={ this.state.lang } />
              </div>
            </CustomObserved>
          </div>
          <YMInitializer accounts={[49830397]} version="2" />
        </div>
      </Swipeable>
    );
  }
}

export default withI18N(['main', 'common', 'projects'])(Homepage);

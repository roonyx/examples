import { Component, Fragment } from 'react';
import translate from 'react-i18next/dist/commonjs/translate';

import { SectionTitle } from '../SectionTitle/SectionTitle';
import { mockProject } from '../../constants/projects';
import Pagination from '../UI/Pagination/Pagination';
import ProjectTile from './ProjectTile';
import getId from '../../lib/idGenerator';
import styles from './Portfolio.scss';

const PAGE_PROJECT_COUNT = 4;
const getLastProjectId = projects => projects[projects.length - 1].id;

class Portfolio extends Component {
  state = {
    tileClasses: [styles.projectTile],
    currentPage: 1,
    nextPage: null,
  }

  activeTile = null
  shouldBeAnimated = false
  rotateAnimationCounter = 0
  totalPages = Math.ceil(this.props.projects.length / PAGE_PROJECT_COUNT)
  pageProjects = (() => {
    const projects = {};

    [...Array(this.totalPages)].forEach((_, i) => {
      const inc = i + 1;
      projects[inc] = this.props.projects.slice(
        i * PAGE_PROJECT_COUNT,
        PAGE_PROJECT_COUNT * (inc),
      );

      if (inc === this.totalPages && projects[inc].length !== PAGE_PROJECT_COUNT) {
        let lastId = getLastProjectId(projects[inc]);
        while (projects[inc].length !== PAGE_PROJECT_COUNT) {
          const nextId = lastId + 1;
          const position = `${`0${nextId}`.substr(-2)}.`;
          const mockProj = { ...mockProject };
          mockProj.id = nextId;
          mockProj.position = position;
          lastId += 1;
          projects[inc].push(mockProj);
        }
      }
    });

    return projects;
  })()

  onProjectClick = e => {
    const target = e.currentTarget || e.target;
    const tileId = Number(target.attributes['data-id'].value);
    const tileClasses = [...this.state.tileClasses, styles.animateSlide];

    this.activeTile = tileId;
    this.setState({ tileClasses }, () => this.props.onSwipe(tileId - 1));
  }

  animateHandler = e => {
    if (this.shouldBeAnimated) {
      this.rotateAnimationCounter += 1;

      if (this.rotateAnimationCounter !== PAGE_PROJECT_COUNT) return;

      this.onRotateEnd();
      return;
    }

    const target = e.currentTarget || e.target;
    const tileId = Number(target.attributes['data-id'].value);
    const lastId = getLastProjectId(this.pageProjects[this.state.currentPage]);

    if (tileId === lastId) {
      const tileClasses = [styles.projectTile, styles.hide];

      this.props.onSwipeMain(true);
      this.setState(
        { tileClasses },
        () => setTimeout(() => {
          this.activeTile = null;
          this.setState({ tileClasses: [styles.projectTile] });
        }, 1000),
      );
    }
  }

  onRotateEnd = () => {
    this.rotateAnimationCounter = 0;
    this.shouldBeAnimated = false;
    this.setState(state => ({
      currentPage: state.nextPage,
      nextPage: null,
    }));
  }

  renderProjects = () => (
    this.pageProjects[this.state.currentPage]
      .map((project, i) => {
        if (!project.isMock) {
          return (
            <ProjectTile
              dataKey={ project.id }
              key={ getId() }
              position={ project.position }
              title={ project.title }
              description={ project.description }
              tileClasses={ this.state.tileClasses.join(' ') }
              onTileClick={ this.onProjectClick }
              onAnimationEnd={ this.animateHandler }
              activeTile={ this.activeTile === project.id }
              shouldBeAnimated={ this.shouldBeAnimated }
              backSideProject={ this.state.nextPage ? this.pageProjects[this.state.nextPage][i] : null }
            />
          );
        }

        return (
          <ProjectTile
            dataKey={ project.id }
            key={ getId() }
            position={ project.position }
            title={ project.title }
            tileClasses={ this.state.tileClasses.join(' ') }
            onAnimationEnd={ this.animateHandler }
            shouldBeAnimated={ this.shouldBeAnimated }
            onTileClick={ this.props.toContacts }
            isMock
            backSideProject={ this.state.nextPage ? this.pageProjects[this.state.nextPage][i] : null }
          />
        );
      })
  );

  onPaginationClick = page => {
    this.shouldBeAnimated = true;
    this.setState({ nextPage: page });
  }

  render() {
    return (
      <Fragment>
        <SectionTitle
          title={ this.props.t('portfolio-section') }
        />
        <div className={ styles.portfolioBlock }>
          <div className={ styles.projectWrapper }>
            { this.renderProjects() }
          </div>
          <div className={ styles.pagination }>
            <Pagination
              total={ this.totalPages }
              current={ this.state.nextPage || this.state.currentPage }
              onClick={ this.onPaginationClick }
              block={ this.shouldBeAnimated }
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default translate(['main'])(Portfolio);

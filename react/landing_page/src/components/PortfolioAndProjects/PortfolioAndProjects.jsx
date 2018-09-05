import { Component } from 'react';

import Portfolio from '../Portfolio/Portfolio';
import ProjectWrapper from '../Project/Project';
import getId from '../../lib/idGenerator';
import styles from './PortfolioAndProjects.scss';
import { section, light } from '../../../static/styles/index-page.scss';
import { projects } from '../../constants/projects';

class PortfolioAndProjects extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.position !== nextProps.position ||
      this.props.positionMain !== nextProps.positionMain ||
      this.props.allowProjectTitleAnimation !== nextProps.allowProjectTitleAnimation ||
      this.props.isActiveHeadBackButton !== nextProps.isActiveHeadBackButton ||
      this.props.lang !== nextProps.lang
    );
  }

  count = projects.length;
  isFirst = project => project.id === projects[0].id;
  isLast = project => project.id === projects[projects.length - 1].id;

  renderProjects = () => {
    const style = { width: `${100 / this.count}%` };

    return projects.map(project => (
      <div className={ [section, light].join(' ') } style={ style } key={ getId() }>
        <ProjectWrapper
          project={ project }
          onSwipe={ this.props.onSwipe }
          onSwipeMain={ this.props.onSwipeMain }
          isFirst={ this.isFirst(project) }
          isLast={ this.isLast(project) }
          allowProjectTitleAnimation={ this.props.allowProjectTitleAnimation }
          isActiveHeadBackButton={ this.props.isActiveHeadBackButton }
          isMobile={ this.props.isMobile }
          currentSlideId={ this.props.currentSlideId }
        />
      </div>
    ));
  };

  render() {
    const style = {
      width: `${100 * this.count}%`,
      transform: `translateX(${this.props.position})`,
    };

    return (
      <div className={ styles.wrapper }>
        <div className={ styles.container } style={{ transform: `translateX(${this.props.positionMain})` }}>
          <div className={ section } style={{ width: '50%' }}>
            <Portfolio
              projects={ projects }
              onSwipe={ this.props.onSwipe }
              onSwipeMain={ this.props.onSwipeMain }
              lang={ this.props.lang }
              toContacts={ this.props.toContacts }
            />
          </div>
          <div className={ styles.wrapper } style={{ width: '50%' }}>
            <div className={ styles.container } style={ style }>
              { this.renderProjects() }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PortfolioAndProjects;

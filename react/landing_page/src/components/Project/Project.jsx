import { Fragment } from 'react';
import translate from 'react-i18next/dist/commonjs/translate';

import { Button } from '../UI/Button/Button';
import { Arrow } from '../UI/Arrow/Arrow';
import { SectionTitle } from '../SectionTitle/SectionTitle';
import getId from '../../lib/idGenerator';
import styles from './Project.scss';

const Project = props => {
  const left = !props.isFirst ? (
    <Arrow
      onClick={ () => props.isFirst ? props.onSwipeMain() : props.onSwipe(props.id - 2) }
      direction="left"
      style={ [styles.arrowButtons] }
    />
  ) : null;
  const right = !props.isLast ? (
    <Arrow
      onClick={ () => props.onSwipe(props.id) }
      direction="right"
      style={ [styles.arrowButtons, props.isLast ? styles.hiddenArrow : null] }
    />
  ) : null;
  const projectSection = props.isMobile ? (
    <Fragment>
      <div className={ styles.mediaTitle }>
        <h1 className={ styles.title }>
          { props.title }
        </h1>
      </div>
      <div className={ styles.wrapper }>
        <div className={ styles.left }>
          <div className={ styles.top }>
            <ul className={ styles.list }>
              {
                props.techologies.map(tech => <li key={ getId() }>{ `#${tech}` }</li>)
              }
            </ul>
          </div>
          <div className={ `${styles.mid}  ${props.allowProjectTitleAnimation && props.currentSlide ? styles.textTransition : ''}`}>
            <h1 className={ styles.title }>
              { props.title }
            </h1>
          </div>
          <div className={ styles.bot }>
            <img src={ props.logo } alt="icon" />
            <span className={ styles.arrowWrapper }>
              { left }
              { right }
            </span>
          </div>
        </div>
        <div className={ styles.right }>
          <div className={ styles.top }>
            <p className={ styles.description }>
              { props.description }
            </p>
          </div>
          <div className={ styles.bot }>
            <Button
              type="dark"
              classes={ styles.mediaButton }
              link={ props.link }
            >
              { props.btnTitle }
            </Button>
            <div className={ styles.mediaArrows }>
              { left }
              { right }
            </div>
          </div>
        </div>
      </div>
    </Fragment>) : (
      <Fragment>
        <div className={ styles.mediaTitle }>
          <h1 className={ styles.title }>
            { props.title }
          </h1>
        </div>
        <div className={ styles.wrapper }>
          <div className={ styles.left }>
            <div className={ styles.top }>
              <ul className={ styles.list }>
                {
                  props.techologies.map(tech => <li key={ getId() }>{ `#${tech}` }</li>)
                }
              </ul>
            </div>
            <div
              className={ `${styles.mid}  ${props.allowProjectTitleAnimation && props.currentSlide ? styles.textTransition : ''}`}
            >
              {props.hideTitle ?
                null : (
                  <h1 className={ styles.title }>
                    { props.subTitle || props.title }
                  </h1>)
              }
            </div>
            <h1
              className={ `${styles.subTitle} ${props.hideSubtitle ? styles.fakeSubTitle : ''}  ${props.allowProjectTitleAnimation && props.currentSlide ? styles.textTransition : ''}` }
            >
              { props.subTitle1 }
            </h1>
          </div>
          <div className={ styles.right }>
            <div className={ [styles.top, styles.classToRename].join(' ')}>
              <p className={ styles.description }>
                { props.description }
              </p>
            </div>
            <h1 className={ styles.fakeSubTitle }>
              TO
            </h1>
          </div>
        </div>
        <div className={ styles.bottomRow }>
          <div className={styles.bottomWrapper}>
            <img
              height={ props.logoHeight }
              width={ props.logoWidth }
              className={ `${styles.logo} ${props.allowProjectTitleAnimation && props.currentSlide ? styles.textTransition : ''}` }
              src={ props.logo }
              alt="icon"
            />
            <span className={ styles.arrowWrapper }>
              { left }
              { right }
            </span>
            <div className={ styles.mediaButtonWrapper }>
              <Button
                type="dark"
                classes={ styles.mediaButton }
                link={ props.link }
              >
                { props.btnTitle }
              </Button>
            </div>
          </div>
        </div>
      </Fragment>);
  return projectSection;
};

const ProjectWrapper = ({
  t, project, onSwipe, onSwipeMain, isFirst, isLast, allowProjectTitleAnimation, isActiveHeadBackButton, isMobile, currentSlideId,
}) => (
  <Fragment>
    <SectionTitle
      title={ t('common:sidebar-portfolio') }
      isActiveHeadBackButton={ isActiveHeadBackButton }
      onClickHandler={ onSwipeMain }
      color="black"
    />
    <div className={ styles.projectBlock }>
      <Project
        {...project}
        id={ project.id }
        currentSlide={ project.id === currentSlideId }
        description={ t(project.fullDescription) }
        btnTitle={ t('main:project-button') }
        onSwipe={ onSwipe }
        onSwipeMain={ onSwipeMain }
        isFirst={ isFirst }
        isLast={ isLast }
        allowProjectTitleAnimation={ allowProjectTitleAnimation }
        isMobile={ isMobile }
      />
    </div>
  </Fragment>
);

export default translate(['projects', 'common', 'main'])(ProjectWrapper);

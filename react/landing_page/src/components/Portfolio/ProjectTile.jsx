import { isMobile } from 'react-device-detect';
import translate from 'react-i18next/dist/commonjs/translate';

import getId from '../../lib/idGenerator';
import styles from './Portfolio.scss';

const FRONT = 'front';
const BACK = 'back';

const ProjectTile = props => {
  const onTouchEnd = e => {
    if (!this.touchmoved) {
      if (props.onTileClick) props.onTileClick(e);
    }
  };

  const onTouchStart = () => {
    this.touchmoved = false;
  };

  const onTouchMove = () => {
    this.touchmoved = true;
  };

  const renderTile = (side, { position, activeTile, title, description, isMock }) => (
    <div className={ styles[side] }>
      <div className={ styles.position }>
        <p>{ position }</p>
      </div>
      <div className={ [
          styles.tileBlock,
          activeTile ? styles.active : null,
          isMock ? styles.mockProject : null,
        ].join(' ') }
      >
        <div className={ styles.half }>
          <div className={ styles.titleWrap }>
            <p className={ styles.title }>{ title }</p>
          </div>
        </div>
        <div className={ styles.half }>
          <div className={ styles.descriptionWrap }>
            <div className={ styles.description }>
              { description ? description.map(d => <p key={ getId() }>{ props.t(d) }</p>) : null }
            </div>
            { isMock ? null : <p className={ styles.arrow }>&gt;</p> }
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      role="button"
      tabIndex="0"
      className={ props.tileClasses }
      data-id={ props.dataKey }
      onClick={ isMobile ? null : props.onTileClick }
      onKeyPress={ props.onTileClick }
      onTouchEnd={ onTouchEnd }
      onTouchMove={ onTouchMove }
      onTouchStart={ onTouchStart }
      onAnimationEnd={ props.onAnimationEnd }
    >
      <div className={ [styles.paginationWrapper, props.shouldBeAnimated ? styles.rotate : null].join(' ') }>
        { renderTile(FRONT, { ...props }) }
        { props.shouldBeAnimated ? renderTile(BACK, { ...props.backSideProject }) : null }
      </div>
    </div>
  );
};

export default translate(['projects'])(ProjectTile);

import { Component, Fragment } from 'react';
import translate from 'react-i18next/dist/commonjs/translate';

import { Button } from '../UI/Button/Button';
import getId from '../../lib/idGenerator';
import styles from './Main.scss';

const TILES_COUNT = 11;

const Tile = ({ onHover, onAnimationEnd, animated, animationDelay }) => {
  const onTileEnter = () => {
    if (!animated) onHover();
  };

  return (
    <div
      style={{ animationDelay }}
      className={ styles.tile }
      onMouseEnter={ onTileEnter }
      onTouchEnd={ onTileEnter }
      onAnimationEnd={ onAnimationEnd }
    >
      <div className={ [styles.face, styles.front].join(' ') } style={{ animationDelay }} />
      <div className={ [styles.face, styles.back].join(' ') } style={{ animationDelay }} />
      <div className={ [styles.face, styles.left, styles.side].join(' ') } style={{ animationDelay }} />
      <div className={ [styles.face, styles.right, styles.side].join(' ') } />
      <div className={ [styles.face, styles.top, styles.side].join(' ') } style={{ animationDelay }} />
      <div className={ [styles.face, styles.bot, styles.side].join(' ') } />
      <div className={ styles.frontShadow } style={{ animationDelay }} />
      <div className={ styles.backShadow } style={{ animationDelay }} />
      <div className={ [styles.face, styles.frontBG].join(' ') } style={{ animationDelay }} />
      <div className={ [styles.face, styles.backBG].join(' ') } style={{ animationDelay }} />
    </div>
  );
};

class Main extends Component {
  state = {
    startedTileId: null,
  }

  tilesCount = TILES_COUNT
  tileIdsEnd = []
  animated = false
  reversed = false

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.startedTileId !== nextState.startedTileId ||
      this.props.lang !== nextProps.lang
    );
  }

  onTileHover = tileId => {
    if (this.animated) return;
    this.animated = true;

    this.setState({ startedTileId: tileId });
  }

  onAnimationEnd = tileId => {
    const first = 1;

    if (tileId === first) {
      this.tileIdsEnd.push(first);
    } else if (tileId === this.tilesCount) {
      this.tileIdsEnd.push(this.tilesCount);
    }

    if (this.tileIdsEnd.includes(first) && this.tileIdsEnd.includes(this.tilesCount)) {
      this.tileIdsEnd = [];
      this.animated = false;
      this.reversed = !this.reversed;

      this.setState({ startedTileId: null });
    }
  }

  renderTiles = tileId => (
    [...Array(this.tilesCount)].map((_, i) => {
      const animationDelay = !tileId ? null : `${Math.abs(tileId - i - 1)}00ms`;

      return (
        <Tile
          animationDelay={ animationDelay }
          tileId={ tileId === i + 1 ? tileId : null }
          key={ getId() }
          animated={ this.animated }
          onHover={ () => this.onTileHover(i + 1) }
          onAnimationEnd={ () => this.onAnimationEnd(i + 1) }
        />
      );
    })
  )

  render() {
    const tileClasses = [
      styles.tiles,
      this.animated ? styles.animated : null,
      this.reversed ? styles.reversed : null,
      this.state.startedTileId ? styles[`t${this.state.startedTileId}`] : null,
    ].join(' ');

    return (
      <Fragment>
        <div className={ styles.mainBlock }>
          <div className={ tileClasses }>
            { this.renderTiles(this.state.startedTileId) }
          </div>
          <div className={ styles.content }>
            <h1 className={ styles.title }>
              { this.props.t('main-title-1') }
              <br />
              { this.props.t('main-title-2') }
              <br />
              { this.props.t('main-title-3') }
            </h1>
            <Button
              classes={ styles.btn }
              onClick={ this.props.toContacts }
            >
              { this.props.t('main-button') }
            </Button>
          </div>
        </div>
        <div className={ styles.lineWrapper }>
          <span className={ styles.line } />
        </div>
      </Fragment>
    );
  }
}

export default translate(['main'])(Main);

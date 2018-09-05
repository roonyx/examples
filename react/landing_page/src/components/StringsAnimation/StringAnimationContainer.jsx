import React, { Component } from 'react';
import translate from 'react-i18next/dist/commonjs/translate';
import SVG from 'svg.js';
import styles from './StringAnimationContainer.scss';
import {
  actionCircleWhenEventStrings,
  circlesOption,
  gradientCircle,
} from '../../constants/stringAnimationConstants';

const LENGTH_LINE = 600;
const FIRST_ANIMATION_TIME_STRING = 160;
const LAST_ANIMATION_TIME_STRING = 1900;
const FIRST_ANIMATION_TIME_CIRCLE = 200;
const LAST_ANIMATION_TIME_CIRCLE = 2200;
const DELTA_INDEX = 2;

class StringAnimationContainer extends Component {
  componentDidMount() {
    const strings = document.querySelectorAll(`.${styles.string}`);
    const circlesSvg = SVG('circlesSvg');
    const innerHeight = window.innerHeight / 2;

    this.gradient = circlesSvg.gradient('radial', (stop) => {
      gradientCircle.forEach((option) => {
        stop.at(option);
      });
    });

    this.arrayOfPath = [];
    this.circles = [];

    strings.forEach((stringSvg, index) => {
      const svg = SVG(stringSvg);
      const path = svg.path(`M0,0q300,0,${LENGTH_LINE},1`);
      this.arrayOfPath.push(path);
      svg.on('mouseover', (e) => {
        this.eventListenerOnString(e, path, index);
      });
    });

    circlesOption.forEach((option, index) => {
      this.circles[index] = circlesSvg
        .circle(option.r)
        .attr({
          cx: `${option.cx}vw`,
          cy: -innerHeight + option.cy,
          fill: option.fill || this.gradient,
        });
    });
  }

  elastic = (pos) => {
    if (pos === !!pos) return pos;
    return ((2 ** (-10 * pos)) * Math.sin(((pos - 0.075) * (2 * Math.PI)) / 0.3)) + 1;
  }

  easein = (pos) => pos ** 2;

  eventListenerOnString = (e, path, index) => {
    const elasticPlace = this.getElasticPlace(e.offsetX);
    const dY = this.getDeltaYElastic(e.movementY);

    if (dY !== 0) {
      this.animateString(path, elasticPlace, dY * DELTA_INDEX);

      if (dY > 0) {
        this.animateBesideString(index + 1, elasticPlace, dY);
        this.animateBesideCircle(index, dY);
      } else if (dY < 0) {
        this.animateBesideString(index - 1, elasticPlace, dY);
        this.animateBesideCircle(index, dY);
      }
    }
  }

  animateString = (path, elasticPlace, dY) => {
    path.stop();
    path.animate(FIRST_ANIMATION_TIME_STRING)
      .attr({ d: `M0,0q${elasticPlace},${dY},${LENGTH_LINE},1` })
      .after(() => {
        path.animate(LAST_ANIMATION_TIME_STRING, this.elastic)
          .attr({ d: `M0,0q${elasticPlace},0,${LENGTH_LINE},1` });
      });
  }

  animateBesideString = (indexBottom, elasticPlace, dY) => {
    if (this.arrayOfPath[indexBottom]) {
      const path = this.arrayOfPath[indexBottom];
      path.stop();
      this.animateString(path, elasticPlace, dY / 2);
    }
  }

  animateBesideCircle = (indexOfCircle, dY) => {
    const innerHeight = window.innerHeight / 2;
    const deltaY = dY / 1.5;

    actionCircleWhenEventStrings[indexOfCircle].forEach((el, index) => {
      if (el > 1) {
        const circle = this.circles[index];
        circle.stop();
        circle.animate(FIRST_ANIMATION_TIME_CIRCLE)
          .attr({
            cx: `${circlesOption[index].cx + (el)}vw`,
            cy: (-innerHeight + circlesOption[index].cy) + (el * deltaY),
          })
          .after(() => {
            circle.animate(LAST_ANIMATION_TIME_CIRCLE, this.elastic)
              .attr({
                cx: `${circlesOption[index].cx}vw`,
                cy: -innerHeight + circlesOption[index].cy,
              });
          });
      }
    });
  }

  getElasticPlace = (posHover) => {
    const screenWidth = window.innerWidth;
    return parseInt((LENGTH_LINE * posHover) / (screenWidth - 125), 10);
  }

  getDeltaYElastic = (mouseMove) => {
    switch (true) {
      case (mouseMove >= -40 && mouseMove <= -20) || (mouseMove <= 40 && mouseMove >= 20):
        return mouseMove;
      case (mouseMove > 40):
        return 40;
      case (mouseMove < -40):
        return -40;
      case (mouseMove > 0 && mouseMove < 20):
        return 20;
      case (mouseMove > -20 && mouseMove < 0):
        return -20;
      default:
        return 0;
    }
  }

  render() {
    const languageStyle = [
      styles.containerMission, this.props.lang === 'ru' ? styles.ru : null,
    ].join(' ');
    return (
      <div className={ languageStyle }>
        <svg viewBox="0 0 600 13" className={ styles.string } preserveAspectRatio="none" />
        <div className={ styles.containerText }></div>

        <svg viewBox="0 0 600 13" className={ styles.string } preserveAspectRatio="none" />
        <div className={ styles.containerText }>
          <span className={ styles.text }>
            {this.props.t('mission-desktop.first-row')}
          </span>
        </div>

        <svg viewBox="0 0 600 13" className={ styles.string } preserveAspectRatio="none" />
        <div className={ styles.containerText }>
          <span className={ styles.text }>
            {this.props.t('mission-desktop.second-row')}
          </span>
        </div>

        <svg viewBox="0 0 600 13" className={ styles.string } preserveAspectRatio="none" />
        <div className={ styles.containerText }></div>

        <svg viewBox="0 0 600 13" className={ styles.string } preserveAspectRatio="none" />
        <div className={ styles.containerText }>
          <span className={ styles.text }>
            {this.props.t('mission-desktop.third-row')}
          </span>
        </div>

        <svg viewBox="0 0 600 13" className={ styles.string } preserveAspectRatio="none" />
        <div className={ styles.containerText }>
          <span className={ styles.text }>
            {this.props.t('mission-desktop.fourth-row')}
          </span>
        </div>

        <svg className={ styles.svgCircle } width="1px" height="1px" id="circlesSvg" />

      </div>
    );
  }
}

export default translate(['main'])(StringAnimationContainer);

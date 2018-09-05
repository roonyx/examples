import { Component, Fragment } from 'react';
import translate from 'react-i18next/dist/commonjs/translate';
import { SectionTitle } from '../SectionTitle/SectionTitle';

import style from './Values.scss';

class Values extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.lang !== nextProps.lang;
  }

  render() {
    return (
      <Fragment>
        <SectionTitle title={ this.props.t('values-values') } />
        <div className={ style.container }>
          <div className={ style['block-relative'] }>
            <div className={ style.title }>
              { this.props.t('values-title') }
            </div>
          </div>
          <div className={ style['block-relative-max'] }>
            <div className={ style['block-flex'] }>
              <div className={ style['math-sign'] }>
                =
              </div>
              <div>
                { this.props.t('values-technologies') } <br />
                Ruby on Rails, <br />
                Angular, React
              </div>
              <div className={ style['math-sign'] }>
                +
              </div>
              <div>
                { this.props.t('values-methodologies-1') } <br />
                { this.props.t('values-methodologies-2') } <br />
                Agile
              </div>
              <div className={ style['math-sign'] }>
                +
              </div>
              <div>
                { this.props.t('values-process-control') } <br />
                { this.props.t('values-process-control-1') } <br />
                { this.props.t('values-process-control-2') } <br />
                Jira, Scratch, Git, <br />
                Time tracker <br />
              </div>
              <div className={ style['math-sign'] }>
                +
              </div>
              <div>
                { this.props.t('values-exp') } <br />
                { this.props.t('values-exp-1') } <br />
                { this.props.t('values-exp-2') } <br />
                Real estate, <br />
                Crowdfunding, <br />
                CRM, Sport
              </div>
              <div className={ style['math-sign'] }>
                +
              </div>
              <div>
                { this.props.t('values-gt') }
              </div>
              <div id="icons">
                <a href="https://www.upwork.com/o/companies/~01ba2b52c21080b4bf">
                  <img className={ style.icon } src="/static/images/icons/Upwork.png" alt="upwork" />
                </a>
                <a href="javascript:void(0)" style={{ display: 'none' }}>
                  <img className={ style.icon } src="/static/images/icons/Clutch.png" alt="clutch" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default translate(['main'])(Values);

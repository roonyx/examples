import translate from 'react-i18next/dist/commonjs/translate';
import style from './TeamMember.scss';

const TeamMember = ({ member }) => (
  <div
    className={ style['member-container'] }
    style={{ top: `${member.y}%`, left: `${member.x}%` }}
  >
    <img
      src={ member.photo }
      className={ style.photo }
      alt={`img_${member.name.split(' ').join('_')}`}
    />
    <div className={ style['member-name'] }>
      { member.name }
      <div className={ style['member-description'] }>
        { member.description }
      </div>
    </div>
  </div>
);

export default translate(['main'])(TeamMember);

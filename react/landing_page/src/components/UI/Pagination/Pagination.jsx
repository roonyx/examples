import styles from './Pagination.scss';
import getId from '../../../lib/idGenerator';

const Dot = ({ onClick, isActive = false }) => (
  <button
    className={ [styles.dotWrapper, isActive ? styles.active : null].join(' ') }
    onClick={ onClick }
  >
    <div className={ styles.dot } />
  </button>
);

const Pagination = ({ total, current, block, onClick }) => (
  <div className={ [styles.wrapper, block ? styles.block : null].join(' ') }>
    {
      [...Array(total)].map((_, i) => (
        <Dot
          key={ getId() }
          onClick={ () => onClick(i + 1) }
          isActive={ current === i + 1 }
        />
      ))
    }
  </div>
);

export default Pagination;

import Observed from 'react-observed';

const entryObject = {};

const CustomObserved = props => {
  const { children, type, handleOnIntersect } = props;

  const handleIntersect = (entry) => {
    entryObject[type] = entry.intersectionRatio;
    handleOnIntersect(entry, type, entryObject);
  };

  return (
    <Observed
      intersectionRatio={0.5}
      onIntersect={handleIntersect}
      options={{
          root: null,
          rootMargin: '0px',
          threshold: [0.1, 0.13, 0.16, 0.2, 0.87, 0.9],
      }}
    >
      {({ mapRef }) => (
        <div ref={mapRef}>
          {children}
        </div>
      )}
    </Observed>
  );
};

export default CustomObserved;

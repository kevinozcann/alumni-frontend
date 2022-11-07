import React from 'react';

const useIsMountedRef = (): React.MutableRefObject<boolean> => {
  const isMounted = React.useRef(true);

  React.useEffect(
    () => (): void => {
      isMounted.current = false;
    },
    []
  );

  return isMounted;
};

export default useIsMountedRef;

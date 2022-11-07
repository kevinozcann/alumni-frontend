import React from 'react';

function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = React.useState<boolean>(false);

  // If pressed key is our target key then set to true
  function downHandler({ key }): void {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  // If released key is our target key then set to false
  const upHandler = ({ key }): void => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  // Add event listeners
  React.useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
    // eslint-disable-next-line
  }, []);

  return keyPressed;
}

export default useKeyPress;

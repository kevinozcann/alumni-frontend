import React from 'react';

interface RTLProps {
  children: React.ReactNode;
  direction: 'ltr' | 'rtl';
}

const RTL = (props: RTLProps) => {
  const { children, direction } = props;

  React.useEffect(() => {
    document.dir = direction;
  }, [direction]);

  return <React.Fragment>{children}</React.Fragment>;
};

export default RTL;

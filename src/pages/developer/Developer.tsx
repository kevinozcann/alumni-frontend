import React from 'react';
import { useNavigate } from 'react-router-dom';

const Developer = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate(`/developer/howto`);
  }, []);

  return null;
};

export default Developer;

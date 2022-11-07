import React from 'react';
import { Box } from '@mui/material';

type TResizeProps = {
  width?: number;
  height?: number;
};

const Resize: React.FC<TResizeProps> = (props) => {
  const { width, height } = props;

  return (
    <Box
      sx={{
        content: '" "',
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        animation: '1ms resizeanim',
        visibility: 'hidden',
        opacity: 0
      }}
    >
      <Box
        sx={{
          background: '#eee',
          content: '" "',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          overflow: 'auto'
        }}
      >
        <Box sx={{ width: width, height: height, transition: 'none' }} />
      </Box>
      <Box
        sx={{
          background: '#eee',
          content: '" "',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          overflow: 'auto',
          '&:before': {
            content: '" "',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '200%',
            width: '200%',
            overflow: 'hidden'
          }
        }}
      />
    </Box>
  );
};

export default Resize;

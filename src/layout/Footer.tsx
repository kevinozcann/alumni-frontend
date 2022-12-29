import { Box } from '@mui/material';
import Legal from './Legal';

export const Footer = () => {
  return (
    <Box
      sx={{
        padding: 1,
        textAlign: 'center',
        backgroundColor: 'background.paper'
      }}
    >
      <Legal
        color='contrast'
        sx={{ display: 'flex', justifyContent: 'center', '& h6': { fontSize: '0.75rem' } }}
      />
    </Box>
  );
};

export default Footer;

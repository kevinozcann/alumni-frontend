import { Box, Link, Theme, Typography, useTheme } from '@mui/material';
import { SxProps } from '@mui/system';
import { useIntl } from 'react-intl';
import { privacyUrl, githubUrl, termsOfUseUrl } from '../config';

type TLegalPros = {
  color?: 'regular' | 'contrast';
  sx?: SxProps<Theme>;
};

const Legal = ({ color, sx }: TLegalPros) => {
  const theme = useTheme();
  const intl = useIntl();
  const typographyColor =
    (color === 'regular' && theme.palette.mode === 'light' && theme.palette.background.paper) ||
    theme.palette.text.primary;

  return (
    <Box
      sx={
        (sx && sx) || {
          mt: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }
      }
    >
      <Link href={privacyUrl} target='_blank' rel='noopener noreferrer'>
        <Typography color={typographyColor} variant='subtitle1'>
          {intl.formatMessage({ id: 'legal.privacy' })}
        </Typography>
      </Link>
      <Box sx={{ width: 0, mx: 1 }} />
      <Link href={termsOfUseUrl} target='_blank' rel='noopener noreferrer'>
        <Typography color={typographyColor} variant='subtitle1'>
          {intl.formatMessage({ id: 'legal.terms_of_use' })}
        </Typography>
      </Link>
      <Box sx={{ width: 0, mx: 1 }} />
      <Link href={githubUrl} target='_blank' rel='noopener noreferrer'>
        <Typography color={typographyColor} variant='subtitle1'>
          {intl.formatMessage({ id: 'legal.contact' })}
        </Typography>
      </Link>
    </Box>
  );
};

export default Legal;

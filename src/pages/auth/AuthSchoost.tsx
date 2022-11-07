import React from 'react';
import { useIntl } from 'react-intl';
import { Box, Link, Typography, useTheme } from '@mui/material';

import Legal from 'layout/Legal';
import { getRandomInt } from 'utils/Helpers';
import { toAbsoluteUrl } from 'utils/AssetsHelpers';
import { ISchool } from 'pages/organization/organization-types';

type TSchoostThemeProps = {
  logo: string;
  bgImage: string;
};
const schoostThemes: TSchoostThemeProps[] = [
  { logo: 'logo-light.png', bgImage: 'bg-1.jpg' },
  { logo: 'logo-light.png', bgImage: 'bg-2.jpg' },
  { logo: 'logo-light.png', bgImage: 'bg-3.jpg' },
  { logo: 'logo-light.png', bgImage: 'bg-4.jpg' },
  { logo: 'logo-light.png', bgImage: 'bg-5.jpg' },
  { logo: 'logo-light.png', bgImage: 'bg-6.jpg' },
  { logo: 'logo-light.png', bgImage: 'bg-7.jpg' }
];

type TAuthSchoostProps = {
  activeSchool?: Partial<ISchool>;
};

const AuthSchoost = (props: TAuthSchoostProps) => {
  const { activeSchool } = props;
  const theme = useTheme();
  const intl = useIntl();
  const schoostTheme = schoostThemes[getRandomInt(7)];
  const today = new Date().getFullYear();
  const typographyColor =
    theme.palette.mode === 'light' ? theme.palette.background.paper : theme.palette.text.primary;

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 400,
        display: 'flex',
        flexDirection: 'row',
        flex: '0 0 auto',
        p: 3,
        backgroundImage: `url(${toAbsoluteUrl(`/media/bg/${schoostTheme.bgImage}`)})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 auto',
          justifyContent: 'space-between'
        }}
      >
        <Link
          sx={{
            display: 'flex',
            flex: 'none',
            mt: 4
          }}
          href='/'
        >
          <img
            style={{ maxHeight: 120, margin: '0 auto' }}
            alt='Logo'
            src={activeSchool?.config?.logo || toAbsoluteUrl(`/media/logos/${schoostTheme.logo}`)}
          />
        </Link>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: '1 0 auto',
            opacity: 0.7
          }}
        >
          <Typography color={typographyColor} sx={{ mb: 3 }} variant='h5'>
            {activeSchool?.config?.sitename || intl.formatMessage({ id: 'schoost.welcome' })}
          </Typography>
          <Typography color={typographyColor} variant='body1'>
            {activeSchool?.config?.slogan ||
              intl.formatMessage(
                { id: 'schoost.intro' },
                { sup: (str) => <sup key={str[0]}>{str}</sup> }
              )}
          </Typography>
        </Box>

        <Box
          sx={{
            mt: 1,
            opacity: 0.7
          }}
        >
          <Typography color={typographyColor} variant='subtitle1'>
            {today.toString()} &copy; Schoost by SmartClass
          </Typography>
        </Box>

        <Legal
          color='regular'
          sx={{
            mt: 1,
            display: 'flex',
            width: '100%'
          }}
        />
      </Box>
    </Box>
  );
};

export default AuthSchoost;

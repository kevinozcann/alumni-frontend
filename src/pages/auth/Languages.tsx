import React from 'react';
import { Box, ListItemIcon, ListItemText, MenuItem, Typography } from '@mui/material';

import { ILanguage, TLang } from 'utils/shared-types';
import { toAbsoluteUrl } from 'utils/AssetsHelpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/pro-duotone-svg-icons';

type TLanguagesProps = {
  lang: TLang;
  languages: ILanguage[];
  desktopDevice: boolean;
  handleChangeLanguage: (shortCode: string) => void;
};

export const Languages = (props: TLanguagesProps) => {
  const { lang, languages, desktopDevice, handleChangeLanguage } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        mt: 2
      }}
      component='ul'
    >
      {languages?.map((language: ILanguage) => (
        <MenuItem onClick={() => handleChangeLanguage(language.shortCode)} key={language.id}>
          <ListItemIcon sx={{ minWidth: 'auto', mx: desktopDevice ? 1 : 0 }}>
            <Box
              sx={{
                display: 'flex',
                height: 20,
                width: 20,
                '& img': {
                  borderRadius: '4px',
                  width: '100%'
                }
              }}
            >
              <img alt={language.title} src={toAbsoluteUrl(`/media/flags/${language.svgIcon}`)} />
            </Box>
          </ListItemIcon>

          {desktopDevice && (
            <ListItemText
              primary={
                <Typography color='textPrimary' variant='subtitle2'>
                  {language.localTitle}
                </Typography>
              }
            />
          )}

          <Box sx={{ width: 5 }} />

          {lang === language.shortCode && <FontAwesomeIcon icon={faCheckCircle} color='green' />}
        </MenuItem>
      ))}
    </Box>
  );
};

export default Languages;

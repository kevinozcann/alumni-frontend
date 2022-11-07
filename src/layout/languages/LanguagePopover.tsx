import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography
} from '@mui/material';
import { AppDispatch, RootState } from '../../store/store';
import {
  defaultLanguages,
  i18nActions,
  i18nLangSelector,
  i18nLanguagesSelector
} from '../../store/i18n';
import { toAbsoluteUrl } from '../../utils/AssetsHelpers';
import { ILanguage, TLang } from '../../utils/shared-types';

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  languages: i18nLanguagesSelector(state),
  defaultLanguages: defaultLanguages
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  setLanguage: (lang: TLang) => dispatch(i18nActions.setLanguage(lang))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type LanguagePopoverParam = PropsFromRedux;

const LanguagePopover = (props: LanguagePopoverParam) => {
  const { lang, languages, defaultLanguages, setLanguage } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  const anchorRef = React.useRef<HTMLButtonElement | null>(null);

  const currentLanguage = defaultLanguages.find((l) => l.shortCode === lang);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleChangeLanguage = (language: TLang): void => {
    setLanguage(language);
    setOpen(false);

    setTimeout(() => {
      window?.location.reload();
    }, 300);
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleOpen} ref={anchorRef} size='large'>
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
          <img
            width='20'
            height='20'
            alt={currentLanguage.title}
            src={toAbsoluteUrl(`/media/flags/${currentLanguage.svgIcon}`)}
          />
        </Box>
      </IconButton>
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom'
        }}
        // getContentAnchorEl={null}
        keepMounted
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: { width: 200 }
        }}
      >
        {languages.map((language: ILanguage) => (
          <MenuItem onClick={() => handleChangeLanguage(language.shortCode)} key={language.id}>
            <ListItemIcon sx={{ minWidth: 'auto', marginRight: 2 }}>
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
                <img
                  width='20'
                  height='20'
                  alt={language.title}
                  src={toAbsoluteUrl(`/media/flags/${language.svgIcon}`)}
                />
              </Box>
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography color='textPrimary' variant='subtitle2'>
                  {language.localTitle}
                </Typography>
              }
            />
          </MenuItem>
        ))}
      </Popover>
    </React.Fragment>
  );
};

export default connector(LanguagePopover);

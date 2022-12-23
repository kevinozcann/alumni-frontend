import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Box, FormControlLabel, ListItem, ListItemText, Radio, RadioGroup } from '@mui/material';

import { AppDispatch, RootState } from 'store/store';
import { i18nLangSelector } from 'store/i18n';
import { authUserSelector } from 'store/auth';
import { configActions, configPhaseSelector } from 'store/config';
import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import { FormButtons, SaveButton } from 'utils/ActionLinks';
import { TLang } from 'utils/shared-types';
import { ISchool, ISeason } from 'pages/organization/organization-types';
import { IUser } from 'pages/auth/data/account-types';

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  user: authUserSelector(state),
  configPhase: configPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  setDefault: (lang: TLang, user: IUser, seasons: ISeason[]) =>
    dispatch(configActions.setDefaultSeason(lang, user, seasons)),
  resetPhase: () => dispatch(configActions.setPhase(null))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TDefaultSeasonProps = PropsFromRedux & {
  activeSchool: ISchool;
  handleClose?: () => void;
};

const DefaultSeason = (props: TDefaultSeasonProps) => {
  const { lang, user, activeSchool, configPhase, setDefault, resetPhase, handleClose } = props;
  const { seasons } = activeSchool;
  const [isSubmitted, setSubmitted] = React.useState<boolean>(false);
  const [checkedSeason, setCheckedSeason] = React.useState<ISeason>(null);
  const intl = useTranslation();
  const { showSnackbar } = useSnackbar();

  const updateDefaultSeason = () => {
    setSubmitted(true);

    const seasons2Update = [...seasons];
    seasons2Update.forEach((season) => {
      if (season.id === checkedSeason?.id) {
        season.isDefault = 'on';
      } else {
        season.isDefault = 'off';
      }
    });

    setDefault(lang, user.attributes, seasons2Update);
  };

  React.useEffect(() => {
    if (isSubmitted && configPhase === 'success') {
      showSnackbar({
        message: intl.translate({ id: 'app.saved' }),
        open: true
      });

      if (handleClose) {
        setTimeout(() => {
          handleClose();
        }, 500);
      }
    }
  }, [configPhase]);

  React.useEffect(() => {
    resetPhase();
    if (seasons?.length > 0) {
      setCheckedSeason(seasons.find((season) => season.isDefault === 'on'));
    }
  }, []);

  return (
    <Box>
      <RadioGroup aria-label='default-season' name='radio-buttons-default-season'>
        {seasons?.map((season: ISeason) => {
          return (
            <ListItem dense key={season.id} disableGutters>
              <ListItemText
                primary={
                  <FormControlLabel
                    sx={{
                      color: season.isActive ? 'textPrimary' : 'gray'
                    }}
                    control={
                      <Radio
                        color='primary'
                        value={season.id}
                        checked={season.id === checkedSeason?.id || false}
                        onChange={() => setCheckedSeason(season)}
                      />
                    }
                    label={season.title}
                  />
                }
              />
            </ListItem>
          );
        })}
      </RadioGroup>

      <FormButtons
        saveButton={
          <SaveButton
            buttonType='button'
            disabled={configPhase === 'updating'}
            mode={configPhase === 'updating' && 'saving'}
            onClick={() => updateDefaultSeason()}
          />
        }
      />
    </Box>
  );
};

export default connector(DefaultSeason);

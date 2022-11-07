import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  FormControlLabel,
  Divider,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Alert,
  Checkbox,
  Button
} from '@mui/material';

import { AppDispatch, RootState } from 'store/store';
import { userActiveSchoolSelector } from 'store/user';
import useTranslation from 'hooks/useTranslation';
import { TLang, TActionType } from 'utils/shared-types';
import { ISchool } from 'pages/organization/organization-types';

import { menuActionPhases, menuActions, menusPhaseSelector } from './_store/menus';
import { TMenuType } from './menu-types';

const mapStateToProps = (state: RootState) => ({
  activeSchool: userActiveSchoolSelector(state),
  menusPhase: menusPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  copyMenus: (
    lang: TLang,
    actionType: TActionType,
    activeSchool: ISchool,
    menuType: TMenuType,
    copyToIds: number[]
  ) => dispatch(menuActions.copyMenu(lang, actionType, activeSchool, menuType, copyToIds))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TMenuFormProps = PropsFromRedux & {
  actionType: TActionType;
  lang: TLang;
  handleClose: any;
  schools?: ISchool[];
  menuType?: TMenuType;
};

const MenuCopy = (props: TMenuFormProps) => {
  const { lang, schools, menuType, actionType, activeSchool, menusPhase, handleClose, copyMenus } =
    props;
  const [checkedSchools, setCheckedSchools] = React.useState<number[]>([]);
  const [submitted, setSubmitted] = React.useState<boolean>(false);
  const intl = useTranslation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    const currentIndex = checkedSchools.indexOf(value);
    const newChecked = [...checkedSchools];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedSchools(newChecked);
  };

  const handleCopy = () => {
    setSubmitted(true);

    if (checkedSchools.length === 0) {
      handleClose();
    }

    copyMenus(lang, actionType, activeSchool, menuType, checkedSchools);
  };

  React.useEffect(() => {
    if (submitted && menusPhase === menuActionPhases.MENU_COPYING_SUCCESSFUL) {
      setTimeout(handleClose, 1000);
    }
  }, [submitted, menusPhase, handleClose]);

  return (
    <Box>
      <Alert icon={false} severity='info'>
        <Typography color='textPrimary' variant='subtitle2'>
          {intl.formatMessage({ id: 'menu.copy.select_schools' })}
        </Typography>
      </Alert>

      <List>
        {schools.map((school) => {
          return (
            <ListItem dense key={school.id} disableGutters>
              <ListItemText
                primary={
                  <FormControlLabel
                    sx={{
                      color: school.isActive ? 'textPrimary' : 'gray'
                    }}
                    control={
                      <Checkbox
                        color='primary'
                        value={school.id}
                        checked={checkedSchools.includes(school.id)}
                        onChange={handleChange}
                      />
                    }
                    label={school.title}
                  />
                }
              />
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mx: -2 }} />

      <Box sx={{ p: 0, pt: 2 }}>
        <Button
          variant='contained'
          onClick={handleCopy}
          disabled={checkedSchools.length === 0 || submitted}
        >
          {submitted
            ? menusPhase === menuActionPhases.MENU_COPYING_SUCCESSFUL
              ? intl.formatMessage({ id: 'menu.copied' })
              : menusPhase === menuActionPhases.MENU_COPYING_ERROR
              ? intl.formatMessage({ id: 'app.error' })
              : intl.formatMessage({ id: 'app.processing' })
            : intl.formatMessage({ id: 'app.copy' })}
        </Button>
      </Box>
    </Box>
  );
};

export default connector(MenuCopy);

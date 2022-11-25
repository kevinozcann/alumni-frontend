/* eslint-disable react/no-array-index-key */
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Drawer,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/pro-duotone-svg-icons';

import { AppDispatch, RootState } from 'store/store';
import { i18nLangSelector } from 'store/i18n';
import { authActions, authUserSelector } from 'store/auth';
import { userMenusSelector } from 'store/user';
import {
  searchActions,
  searchKeySelector,
  searchMenusSelector,
  searchPhaseSelector,
  searchUsersSelector
} from 'store/search';
import useKeyPress from 'hooks/useKeypress';
import getFlatMenus from 'utils/getFlatMenus';
import { TLang } from 'utils/shared-types';
import UserAvatar from 'components/UserAvatar';
import SearchForm from 'components/SearchForm';
import { IUser } from 'pages/account/account-types';
import { IFlatMenu, IFrequentMenu } from 'pages/admin/menus/menu-types';
import Scrollbar from 'layout/Scrollbar';

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  user: authUserSelector(state),
  menus: userMenusSelector(state),
  searchKeyCache: searchKeySelector(state),
  userResults: searchUsersSelector(state),
  menuResults: searchMenusSelector(state),
  searchPhase: searchPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  searchMenus: (flatMenus: IFlatMenu[], searchKey: string) =>
    dispatch(searchActions.searchMenus(flatMenus, searchKey)),
  searchUsers: (lang: TLang, userId: string, searchKey: string) =>
    dispatch(searchActions.searchUsers(lang, userId, searchKey))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

type TContentSearchProps = PropsFromRedux & {
  frequentMenus: IFrequentMenu[];
};

const ContentSearch: React.FC<TContentSearchProps> = (props) => {
  const {
    lang,
    user,
    menus,
    searchKeyCache,
    frequentMenus,
    userResults,
    menuResults,
    searchPhase,
    searchMenus
    // searchUsers,
  } = props;
  const [searchKey, setSearchKey] = React.useState<string>(searchKeyCache);
  const [open, setOpen] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();
  const enter = useKeyPress('Enter');

  const search = () => {
    if (searchKey.length === 0) {
      return;
    }

    // Search for menus
    const flatMenus = getFlatMenus(intl, menus);
    searchMenus(flatMenus, searchKey);

    // Search for users
    // searchUsers(lang, user.uuid, searchKey);
  };

  const handleSearchClick = (): void => {
    search();
  };

  const handleFrequentMenuClick = React.useCallback(
    (menu: IFrequentMenu) => {
      if (menu?.menu?.url) {
        navigate(menu.menu.url);
      }
    },
    [lang, user, navigate]
  );

  React.useEffect(() => {
    if (searchKey && (searchKey.length > 3 || enter)) {
      search();
    }
  }, [searchKey, enter]);

  React.useEffect(() => {
    setIsLoading(searchPhase?.endsWith('ing'));
  }, [searchPhase, setIsLoading]);

  // close the search bar once the location changed
  React.useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <React.Fragment>
      <Tooltip title='Search'>
        <IconButton color='inherit' onClick={() => setOpen(true)} size='large'>
          <FontAwesomeIcon icon={faSearch} />
        </IconButton>
      </Tooltip>
      <Drawer
        anchor='top'
        ModalProps={{ BackdropProps: { invisible: true } }}
        onClose={() => setOpen(false)}
        open={open}
        PaperProps={{
          sx: { width: '100%' }
        }}
        variant='temporary'
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <IconButton onClick={() => setOpen(false)} size='large'>
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 1, md: 3 } }}>
          <Container maxWidth='md'>
            <SearchForm
              searchKey={searchKey}
              setSearchKey={setSearchKey}
              handleSearchClick={handleSearchClick}
            />

            {frequentMenus?.length > 0 && (
              <Box
                sx={{
                  width: {
                    xs: '100%',
                    md: 'calc(100% - 132px)'
                  }
                }}
              >
                <Scrollbar options={{ suppressScrollY: true }}>
                  <Box
                    sx={{
                      my: 2,
                      display: 'flex',
                      '&>button:not(:first-of-type)': { mx: 1 }
                    }}
                  >
                    {frequentMenus?.map((menu: IFrequentMenu) => {
                      if (!menu || !menu.menu) {
                        return;
                      }

                      return (
                        <Button
                          key={menu.id}
                          sx={{
                            textTransform: 'none',
                            width: 'auto',
                            minWidth: 'auto',
                            whiteSpace: 'nowrap'
                          }}
                          aria-label={intl.formatMessage({ id: menu.menu?.title || 'menu.menu' })}
                          size='small'
                          color='inherit'
                          startIcon={<FontAwesomeIcon icon={['fad', menu.menu?.icon || 'star']} />}
                          onClick={() => handleFrequentMenuClick(menu)}
                        >
                          <Typography variant='caption'>
                            {intl.formatMessage({ id: menu.menu?.title || 'menu.menu' })}
                          </Typography>
                        </Button>
                      );
                    })}
                  </Box>
                </Scrollbar>
              </Box>
            )}

            <Box sx={{ mt: 2, height: '100%' }}>
              <Box sx={{ mb: 2 }}>
                <Stack direction='row'>
                  {searchKey !== '' && (
                    <Typography variant='h5'>
                      {intl.formatMessage({ id: 'search.results' })}
                    </Typography>
                  )}
                  {isLoading && <CircularProgress sx={{ mx: 2 }} size={24} />}
                </Stack>
              </Box>

              {!menuResults && !userResults && (
                <Typography variant='caption'>
                  {intl.formatMessage({ id: 'app.no_data_available' })}
                </Typography>
              )}

              {menuResults?.map((menu: IFlatMenu) => (
                <Box key={menu.id} sx={{ mb: 1 }}>
                  <Chip
                    sx={{ mr: 1, mb: 0.5, height: '18px' }}
                    label={intl.formatMessage({ id: 'menu.menu' })}
                    size='small'
                    color='primary'
                    clickable={false}
                    variant='outlined'
                  />
                  <FontAwesomeIcon
                    icon={[menu?.iconPrefix || 'fad', menu?.icon || 'list']}
                    style={{ width: '20px', marginRight: '5px' }}
                  />
                  <Link
                    color='textSecondary'
                    component={RouterLink}
                    to={menu.url}
                    variant='subtitle2'
                  >
                    {menu.title}
                  </Link>
                </Box>
              ))}

              {userResults?.map((user: IUser) => (
                <Box key={user.uuid} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <Chip
                    sx={{ mr: 1, height: '18px' }}
                    label={intl.formatMessage({ id: 'account.user' })}
                    color='secondary'
                    clickable={false}
                    variant='outlined'
                  />
                  <Link
                    color='textPrimary'
                    component={RouterLink}
                    to={`/users/${user.uuid}`}
                    variant='h5'
                  >
                    <UserAvatar
                      user={user}
                      showTitle
                      showSubTitle
                      cardHeaderSx={{ p: 0.4 }}
                      cardSx={{
                        borderRadius: '0px',
                        boxShadow: 'none',
                        backgroundColor: 'transparent'
                      }}
                      avatarSx={{ width: '30px', height: '30px' }}
                    />
                  </Link>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      </Drawer>
    </React.Fragment>
  );
};

export default connector(ContentSearch);

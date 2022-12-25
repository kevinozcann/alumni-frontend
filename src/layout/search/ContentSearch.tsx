/* eslint-disable react/no-array-index-key */
import { faSearch, faTimes } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
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
import React from 'react';
import { useIntl } from 'react-intl';
import { connect, ConnectedProps } from 'react-redux';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

import SearchForm from 'components/SearchForm';
import UserAvatar from 'components/UserAvatar';
import useKeyPress from 'hooks/useKeypress';
import { IUser } from 'pages/auth/data/account-types';
import { authUserSelector } from 'pages/auth/services/store/auth';
import { i18nLangSelector } from 'store/i18n';
import {
  searchActions,
  searchKeySelector,
  searchPhaseSelector,
  searchUsersSelector
} from 'store/search';
import { AppDispatch, RootState } from 'store/store';
import { TLang } from 'utils/shared-types';

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  user: authUserSelector(state),
  searchKeyCache: searchKeySelector(state),
  userResults: searchUsersSelector(state),
  searchPhase: searchPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  searchUsers: (lang: TLang, userId: string, searchKey: string) =>
    dispatch(searchActions.searchUsers(lang, userId, searchKey))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

type TContentSearchProps = PropsFromRedux;

const ContentSearch: React.FC<TContentSearchProps> = (props) => {
  const { lang, user, searchKeyCache, userResults, searchPhase } = props;
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

    // Search for users
    // searchUsers(lang, user.uuid, searchKey);
  };

  const handleSearchClick = (): void => {
    search();
  };

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

              {userResults?.map((user: IUser) => (
                <Box key={user.id} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
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
                    to={`/users/${user.id}`}
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

import React from 'react';
import { useIntl } from 'react-intl';
import { Box, Button, InputAdornment, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/pro-duotone-svg-icons';

type TSearchFormProps = {
  searchKey?: string;
  setSearchKey?: (searchKey: string) => void;
  handleSearchClick?: () => void;
};

const SearchForm: React.FC<TSearchFormProps> = (props) => {
  const { searchKey, setSearchKey, handleSearchClick } = props;
  const intl = useIntl();

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex'
      }}
    >
      <TextField
        fullWidth
        autoFocus
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <FontAwesomeIcon icon={faSearch} />
            </InputAdornment>
          )
        }}
        onChange={(event): void => setSearchKey(event.target.value)}
        placeholder={intl.formatMessage({ id: 'app.search' })}
        value={searchKey}
      />
      <Button
        color='primary'
        onClick={handleSearchClick}
        size='large'
        sx={{ display: { xs: 'none', sm: 'block' }, ml: 2, py: 1.6, whiteSpace: 'nowrap' }}
        variant='contained'
      >
        {intl.formatMessage({ id: 'app.search' })}
      </Button>
    </Box>
  );
};

export default SearchForm;

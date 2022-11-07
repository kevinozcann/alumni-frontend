import React from 'react';
import { TextField } from '@mui/material';

import useTranslation from 'hooks/useTranslation';

const BasicSearch = ({ onChange }) => {
  const intl = useTranslation();

  return (
    <form className='basic-search-form'>
      <TextField
        autoFocus
        fullWidth
        type='text'
        size='small'
        placeholder={`${intl.translate({ id: 'app.search' })}...`}
        onChange={(e) => onChange(e.target.value)}
      />
    </form>
  );
};

export default BasicSearch;

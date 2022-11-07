import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { GridValueGetterParams } from '@mui/x-data-grid-pro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDoubleRight, faPencilAlt, faTrashAlt } from '@fortawesome/pro-duotone-svg-icons';

import useTranslation from 'hooks/useTranslation';

type TRowActionProps = {
  params?: GridValueGetterParams;
  onEditClick?: React.MouseEventHandler<HTMLButtonElement>;
  onDeleteClick?: React.MouseEventHandler<HTMLButtonElement>;
  onShowClick?: React.MouseEventHandler<HTMLButtonElement>;
};
const RowActions: React.FC<TRowActionProps> = (props) => {
  const { onEditClick, onDeleteClick, onShowClick } = props;
  const intl = useTranslation();

  return (
    <Box sx={{ display: 'flex' }}>
      {onEditClick && (
        <React.Fragment>
          <Tooltip title={intl.translate({ id: 'app.edit' })}>
            <IconButton sx={{ p: 1 }} size='small' color='primary' onClick={onEditClick}>
              <FontAwesomeIcon color='primary' icon={faPencilAlt} />
            </IconButton>
          </Tooltip>
          <Box sx={{ width: 3 }} />
        </React.Fragment>
      )}

      {onDeleteClick && (
        <React.Fragment>
          <Tooltip title={intl.translate({ id: 'app.delete' })}>
            <IconButton sx={{ p: 1 }} size='small' color='secondary' onClick={onDeleteClick}>
              <FontAwesomeIcon icon={faTrashAlt} />
            </IconButton>
          </Tooltip>
          <Box sx={{ width: 3 }} />
        </React.Fragment>
      )}

      {onShowClick && (
        <React.Fragment>
          <Tooltip title={intl.translate({ id: 'app.show' })}>
            <IconButton sx={{ p: 1 }} size='small' color='inherit' onClick={onShowClick}>
              <FontAwesomeIcon icon={faChevronDoubleRight} />
            </IconButton>
          </Tooltip>
          <Box sx={{ width: 3 }} />
        </React.Fragment>
      )}
    </Box>
  );
};

export default RowActions;

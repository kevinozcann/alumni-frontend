import React from 'react';
import history from 'history/browser';
import { FormattedMessage, useIntl } from 'react-intl';
import { Box, Button, Fab, Link, Theme, Tooltip, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import { Delete as MuiDelete } from '@mui/icons-material';
import {
  faChevronLeft,
  faEdit,
  faFilePlus,
  faPencil,
  faPlus,
  faSave,
  faSpinner,
  faTrash,
  faUndo
} from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { pxToRem } from 'utils/Helpers';
import useTranslation from 'hooks/useTranslation';

export interface ButtonProps {
  id?: string;
  title?: string;
  className?: string;
  disabled?: boolean;
  url?: string;
  mode?: string;
  sx?: SxProps<Theme>;
  variant?: 'text' | 'outlined' | 'contained';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  handleClick?: React.MouseEventHandler<HTMLAnchorElement>;
}
export interface IconProps {
  title?: string;
  url?: string;
  size?: 'small' | 'medium' | 'large';
  sx?: any;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const GoBack = () => {
  return (
    <Button onClick={() => history.back()} startIcon={<FontAwesomeIcon icon={faChevronLeft} />}>
      <FormattedMessage id='BACK' />
    </Button>
  );
};
export const BackButton = GoBack;

export const AddLink = () => {
  return (
    <li className='navi-item'>
      <Link className='navi-link'>
        <Typography className='navi-icon'>
          <FontAwesomeIcon icon={faFilePlus} />
        </Typography>
        <Typography className='navi-text'>
          <FormattedMessage id='ADD' />
        </Typography>
      </Link>
    </li>
  );
};

export const DeleteLink = () => {
  return (
    <li className='navi-item'>
      <Link className='navi-link'>
        <Typography className='navi-icon'>
          <FontAwesomeIcon icon={faTrash} color='#F64E60' />
        </Typography>
        <Typography className='navi-text text-hover-danger'>
          <FormattedMessage id='DELETE' />
        </Typography>
      </Link>
    </li>
  );
};

export const Divider = () => <li className='navi-separator my-2 opacity-70'></li>;

export const EditLink = ({ handleClick }: ButtonProps) => {
  return (
    <li className='navi-item'>
      <Link className='navi-link' onClick={handleClick}>
        <Typography className='navi-icon'>
          <FontAwesomeIcon icon={faEdit} />
        </Typography>
        <Typography className='navi-text text-hover-warning'>
          <FormattedMessage id='EDIT' />
        </Typography>
      </Link>
    </li>
  );
};

export const AddIcon = ({ title = 'Add', url, size }: IconProps) => {
  return (
    <Tooltip title={title}>
      <Fab size='medium' color='primary' href={url} aria-label={title}>
        <FontAwesomeIcon icon={faPlus} style={{ width: size, height: size }} />
      </Fab>
    </Tooltip>
  );
};

export const EditIcon = ({ title = 'Edit', url, size }: IconProps) => {
  return (
    <Tooltip title={title}>
      <Fab size='medium' href={url} aria-label={title}>
        <FontAwesomeIcon icon={faPencil} style={{ width: size, height: size }} />
      </Fab>
    </Tooltip>
  );
};

export const DeleteIcon = (props: IconProps) => {
  const { title, onClick, url, size, sx } = props;
  const intl = useIntl();

  return (
    <Tooltip title={intl.formatMessage({ id: title || 'app.delete' })}>
      <Fab
        sx={Object.assign({}, { maxWidth: 36, maxHeight: 36 }, sx)}
        size={size || 'small'}
        color='secondary'
        onClick={onClick}
        href={url}
        aria-label={title}
      >
        <MuiDelete fontSize='small' />
      </Fab>
    </Tooltip>
  );
};

export const SaveButton = (props: {
  id?: string;
  text?: string;
  buttonType?: 'button' | 'submit' | 'reset';
  onClick?: any;
  className?: string;
  disabled?: boolean;
  mode?: string;
  modeText?: string;
  startIcon?: React.ReactNode;
  sx?: any;
}) => {
  const {
    id,
    text,
    buttonType,
    onClick,
    className,
    disabled,
    mode,
    modeText,
    startIcon,
    sx,
    ...rest
  } = props;
  const intl = useIntl();

  return (
    <Button
      sx={sx}
      id={id || 'saveButton'}
      className={`${className} ${(mode === 'saving' && 'disabled') || ''}`}
      color='primary'
      disabled={disabled || mode === 'saving'}
      size='medium'
      startIcon={
        (mode === 'saving' && <FontAwesomeIcon icon={faSpinner} spin={true} />) ||
        startIcon || <FontAwesomeIcon icon={faSave} />
      }
      type={buttonType || 'submit'}
      variant='contained'
      onClick={onClick}
      {...rest}
    >
      {intl.formatMessage({
        id: (mode === 'saving' && (modeText || 'app.saving')) || text || 'app.save'
      })}
    </Button>
  );
};

export const EditButton = ({ title, variant = 'contained', url, onClick }: ButtonProps) => {
  return (
    <Button
      href={url}
      color='primary'
      size='medium'
      startIcon={
        <FontAwesomeIcon icon={faPencil} style={{ width: pxToRem(16), height: pxToRem(16) }} />
      }
      variant={variant}
      onClick={onClick}
    >
      {title ? title : <FormattedMessage id='UPDATE' />}
    </Button>
  );
};

export const DeleteButton = ({ url }: ButtonProps) => {
  return (
    <Button
      color='secondary'
      href={url}
      size='large'
      startIcon={<FontAwesomeIcon icon={faTrash} color='#F64E60' />}
      variant='contained'
    >
      <FormattedMessage id='DELETE' />
    </Button>
  );
};

export const AddFabButton = ({ title, onClick }: ButtonProps) => {
  return (
    <Tooltip title={<FormattedMessage id={title} />}>
      <Fab
        sx={{ position: 'fixed', bottom: 86, right: 24 }}
        color='primary'
        onClick={onClick}
        aria-label='add menu'
      >
        <FontAwesomeIcon size='2x' icon={faPlus} />
      </Fab>
    </Tooltip>
  );
};

export const CancelButton = (props: { id?: string; onClick?: any; sx?: any }) => {
  const { id, onClick, sx, ...rest } = props;
  const intl = useTranslation();

  return (
    <Button
      sx={sx}
      id={id || 'cancelButton'}
      color='secondary'
      size='medium'
      startIcon={<FontAwesomeIcon icon={faUndo} />}
      type='button'
      variant='contained'
      onClick={onClick}
      {...rest}
    >
      {intl.translate({ id: 'app.cancel' })}
    </Button>
  );
};

export const FormButtons = (props: {
  saveButton: React.ReactElement;
  cancelButton?: React.ReactElement;
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 0, pt: 2 }}>
      {props.saveButton}
      {props?.cancelButton || null}
    </Box>
  );
};

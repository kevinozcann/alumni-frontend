import React from 'react';
import { useIntl } from 'react-intl';
import {
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';
import DialogBase, { IDialogBaseProps } from '../layout/DialogBase';

interface IConfirmDialogProps extends IDialogBaseProps {
  confirmBtnText?: string | React.ReactElement;
  handleConfirm?: any;
  intro?: string | React.ReactElement;
  phase?: string;
}

const ConfirmDialog = (props: IConfirmDialogProps) => {
  const { confirmBtnText, handleClose, handleConfirm, intro, isOpen, phase, title, maxHeight } =
    props;
  const intl = useIntl();
  const confirmTitle = title || intl.formatMessage({ id: 'app.delete' });

  return (
    <DialogBase
      handleClose={handleClose}
      isOpen={isOpen}
      title={confirmTitle + '?'}
      width={400}
      maxHeight={maxHeight || 260}
    >
      <DialogContent sx={{ padding: 1 }} dividers={true}>
        <DialogContentText sx={{ padding: 2 }}>
          {intro ||
            intl.formatMessage({
              id: 'app.confirm_delete'
            })}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color='secondary'>
          {intl.formatMessage({ id: 'app.cancel' })}
        </Button>
        <Button
          autoFocus
          onClick={handleConfirm}
          color='primary'
          startIcon={(phase?.endsWith('ing') && <CircularProgress size={16} />) || null}
        >
          {confirmBtnText ||
            intl.formatMessage({
              id: 'app.delete'
            })}
        </Button>
      </DialogActions>
    </DialogBase>
  );
};

export default ConfirmDialog;

import React from 'react';
import { useIntl } from 'react-intl';
import {
  Button,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress
} from '@mui/material';
import DialogBase, { IDialogBaseProps } from '../layout/DialogBase';
import { TActionType } from '../utils/shared-types';

interface ISchoostDialogProps extends IDialogBaseProps {
  actionType?: TActionType;
  dividers?: boolean;
  handleOk?: any;
  intro?: string;
  okBtnText?: string | React.ReactElement;
  phase?: string;
}

const SchoostDialog = (props: ISchoostDialogProps) => {
  const {
    children,
    dividers,
    handleOk,
    handleClose,
    intro,
    isOpen,
    okBtnText,
    phase,
    title,
    width
  } = props;
  const intl = useIntl();

  return (
    <DialogBase handleClose={handleClose} isOpen={isOpen} title={title} width={width}>
      <DialogContent sx={{ padding: 2 }} dividers={dividers}>
        {intro && <DialogContentText sx={{ padding: 1 }}>{intro}</DialogContentText>}
        {children}
      </DialogContent>

      {handleClose && handleOk && (
        <DialogActions>
          <Button onClick={handleClose} color='secondary'>
            {intl.formatMessage({ id: 'app.cancel' })}
          </Button>
          {handleOk && (
            <Button
              autoFocus
              onClick={() => handleOk()}
              color='primary'
              startIcon={phase === 'loading' ? <CircularProgress size={16} /> : null}
            >
              {okBtnText ? okBtnText : intl.formatMessage({ id: 'app.ok' })}
            </Button>
          )}
        </DialogActions>
      )}
    </DialogBase>
  );
};

export default SchoostDialog;

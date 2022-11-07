import React from 'react';
import {
  Dialog,
  DialogTitle,
  IconButton,
  Slide,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-duotone-svg-icons';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='down' ref={ref} {...props} />;
});

export interface IDialogBaseProps {
  children?: React.ReactNode;
  handleClose?: () => void;
  isOpen: boolean;
  title?: string | React.ReactElement;
  width?: number | '100%';
  maxHeight?: number;
}

const DialogBase = (props: IDialogBaseProps) => {
  const { children, handleClose, isOpen, title, width, maxHeight } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const dialogWidth = width || (fullScreen ? '100%' : 800);

  return (
    <Dialog
      sx={{ padding: 1 }}
      fullScreen={fullScreen}
      scroll='paper'
      onClose={handleClose}
      open={isOpen}
      PaperProps={{
        sx: {
          boxShadow: theme.shadows[15],
          maxWidth: dialogWidth,
          maxHeight: maxHeight || undefined,
          width: dialogWidth
        }
      }}
      TransitionComponent={Transition}
    >
      <DialogTitle sx={{ margin: 0, padding: 2 }}>
        <Typography variant='body1'>{title}</Typography>
        {handleClose && (
          <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              top: 6
            }}
            aria-label='close'
            onClick={handleClose}
            size='large'
          >
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        )}
      </DialogTitle>
      {children}
    </Dialog>
  );
};

export default DialogBase;

import React from 'react';
import { DialogContent, DialogContentText } from '@mui/material';
import DialogBase, { IDialogBaseProps } from '../layout/DialogBase';

interface IFileManagerDialogProps extends IDialogBaseProps {
  intro?: string;
}

const FileManagerDialog = (props: IFileManagerDialogProps) => {
  const { children, handleClose, intro, isOpen, title } = props;

  return (
    <DialogBase handleClose={handleClose} isOpen={isOpen} title={title} width={900}>
      <DialogContent sx={{ paddingX: 1, paddingY: 0 }}>
        {intro && <DialogContentText sx={{ padding: 1 }}>{intro}</DialogContentText>}
        {children}
      </DialogContent>
    </DialogBase>
  );
};

export default FileManagerDialog;

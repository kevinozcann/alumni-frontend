import React from 'react';
import { DialogContent } from '@mui/material';
import DialogBase, { IDialogBaseProps } from '../layout/DialogBase';

interface IFileViewerDialogProps extends IDialogBaseProps {
  fileUrl: string;
}

const FileViewerDialog: React.FC<IFileViewerDialogProps> = (props) => {
  const { fileUrl, handleClose, isOpen, title } = props;

  return (
    <DialogBase handleClose={handleClose} isOpen={isOpen} title={title} width={900}>
      <DialogContent sx={{ padding: 1 }}>
        <iframe
          title='SmartClass File Manager'
          id='schoostFrame'
          width='100%'
          height='700px'
          frameBorder='0'
          src={`http://docs.google.com/viewer?url=${fileUrl}&embedded=true`}
        />
      </DialogContent>
    </DialogBase>
  );
};

export default FileViewerDialog;

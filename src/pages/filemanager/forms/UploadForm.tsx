import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export type TFile = {
  id?: string;
  lastModified?: number;
  lastModifiedDate?: string;
  name: string;
  size?: number;
  type?: string;
};

type TUploadFormProps = {
  uploadFunction?: any;
};

const UploadForm = (props: TUploadFormProps) => {
  const { uploadFunction } = props;
  const uploadInputRef = React.useRef(null);
  const [selectedFile, setSelectedFile] = React.useState<TFile>(null);

  const handleCapture = () => {
    setSelectedFile(uploadInputRef.current.files[0]);
  };

  const handleSubmit = () => {
    if (uploadFunction) {
      uploadFunction(selectedFile);
    }
  };

  React.useEffect(() => {
    if (selectedFile) {
      handleSubmit();
    }
  }, [selectedFile]);

  return (
    <Box sx={{ textAlign: 'center' }}>
      <input
        ref={uploadInputRef}
        style={{ display: 'none' }}
        accept='*/*'
        id='files2Upload'
        type='file'
        onChange={handleCapture}
      />
      {selectedFile && <Typography>{selectedFile.name}</Typography>}
      <Button
        onClick={() => uploadInputRef.current && uploadInputRef.current.click()}
        variant='outlined'
        startIcon={selectedFile ? <CircularProgress size={14} /> : null}
      >
        {selectedFile ? 'Uploading...' : 'Browse'}
      </Button>
    </Box>
  );
};

export default UploadForm;

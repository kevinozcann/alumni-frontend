import React from 'react';
import { Card, CardContent, CardHeader, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-duotone-svg-icons';

type TSideFormProps = {
  children: React.ReactNode;
  handleClickClose?: () => void;
};
const SideForm: React.FC<TSideFormProps> = (props) => {
  const { children, handleClickClose } = props;

  return (
    <Card sx={{ width: 320 }}>
      <CardHeader
        action={
          <IconButton size='small' aria-label='close' onClick={handleClickClose}>
            <FontAwesomeIcon size='lg' icon={faTimes} />
          </IconButton>
        }
      />
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default SideForm;

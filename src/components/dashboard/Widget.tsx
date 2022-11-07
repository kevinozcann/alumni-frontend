import React from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';

type TWidgetProps = {
  title?: string;
  subheader?: number | string | React.ReactNode;
  action?: React.ReactNode;
  height?: string | number;
  children?: JSX.Element;
};

const Widget = (props: TWidgetProps) => {
  const { title, subheader, action, height, children } = props;

  return (
    <Card>
      <CardHeader title={title} subheader={subheader} action={action} />
      <CardContent sx={{ height: height || 300, px: 2 }}>{children}</CardContent>
    </Card>
  );
};

export default Widget;

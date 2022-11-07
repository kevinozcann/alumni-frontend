import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Typography
} from '@mui/material';
import Scrollbar from 'layout/Scrollbar';
import { format } from 'date-fns';
import { Iinstallment } from 'pages/installment/_store/installment';

type TStudentInstallmentsProps = {
  installments: Iinstallment[];
  installmentsPhase: string;
};
const StudentInstallments: React.FC<TStudentInstallmentsProps> = (props) => {
  const { installments, installmentsPhase } = props;

  return (
    <Box>
      <Box>
        <Card>
          <CardHeader title={<FormattedMessage id='installment_info' />} />
          <Divider />
          <Scrollbar>
            <CardContent sx={{ display: 'flex', height: 350, width: '100%' }}>
              <List sx={{ width: '100%', justifyContent: 'space-between' }}>
                <ListItem disableGutters divider>
                  <ListItemText
                    sx={{ textAlign: 'left', width: 30 }}
                    disableTypography
                    primary={
                      <Typography variant='body2' color='textPrimary'>
                        <FormattedMessage id='app.amount' />
                      </Typography>
                    }
                  />
                  <ListItemText
                    sx={{ textAlign: 'left' }}
                    disableTypography
                    primary={
                      <Typography variant='body2' color='textPrimary'>
                        <FormattedMessage id='app.date' />
                      </Typography>
                    }
                  />
                  <ListItemText
                    sx={{ textAlign: 'right' }}
                    disableTypography
                    primary={
                      <Typography variant='body2' color='textPrimary'>
                        <FormattedMessage id='app.status' />
                      </Typography>
                    }
                  />
                </ListItem>
                {(installmentsPhase !== 'loading' &&
                  installments?.map((installment: Iinstallment) => (
                    <ListItem key={installment.id} disableGutters divider>
                      <ListItemText
                        sx={{ textAlign: 'left', width: '50px' }}
                        disableTypography
                        primary={
                          <Typography variant='body2' color='textPrimary'>
                            {installment.amount.toLocaleString(undefined, {
                              maximumFractionDigits: 2
                            })}
                          </Typography>
                        }
                      />
                      <ListItemText
                        sx={{ textAlign: 'left' }}
                        disableTypography
                        primary={
                          <Typography variant='body2' color='textPrimary'>
                            {format(new Date(installment.installmentDate), 'P')}
                          </Typography>
                        }
                      />
                      <ListItemText
                        sx={{ textAlign: 'right' }}
                        disableTypography
                        primary={
                          installment.isDonePayment === 0 ? (
                            <Chip
                              sx={{ height: '18px', width: '100px' }}
                              label={<FormattedMessage id='installment.unpaid' />}
                              color='error'
                              clickable={false}
                              variant='outlined'
                            />
                          ) : installment.isDonePayment === 1 ? (
                            <Chip
                              sx={{ height: '18px', width: '100px' }}
                              label={<FormattedMessage id='installment.paid' />}
                              color='success'
                              clickable={false}
                              variant='outlined'
                            />
                          ) : (
                            <Chip
                              sx={{ height: '18px', width: '100px' }}
                              label={<FormattedMessage id='installment.partially_paid' />}
                              color='warning'
                              clickable={false}
                              variant='outlined'
                            />
                          )
                        }
                      />
                    </ListItem>
                  ))) || (
                  <ListItem disableGutters divider>
                    <ListItemText
                      disableTypography
                      primary={<Skeleton animation='wave' variant='text' width='70%' />}
                    />
                    <ListItemText
                      disableTypography
                      primary={<Skeleton animation='wave' variant='text' width='70%' />}
                    />
                    <ListItemText
                      disableTypography
                      primary={<Skeleton animation='wave' variant='text' width='70%' />}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Scrollbar>
        </Card>
      </Box>
    </Box>
  );
};

export default StudentInstallments;

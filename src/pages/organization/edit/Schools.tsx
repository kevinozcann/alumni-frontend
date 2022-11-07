import React from 'react';
import {
  Card,
  CardHeader,
  Divider,
  CardContent,
  IconButton,
  Grid,
  Typography,
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheckCircle, faPlus, faSchool } from '@fortawesome/pro-duotone-svg-icons';

import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import ConfirmDialog from 'components/ConfirmDialog';
import ResponsiveActions from 'components/ResponsiveActions';
import { TLang } from 'utils/shared-types';
import { countryToFlag } from 'utils/Helpers';
import { IUser } from 'pages/account/account-types';
import { ISchool, TConfiguration } from 'pages/organization/organization-types';

type TGeneralProps = {
  user: IUser;
  lang: TLang;
  phase: string;
  schoolInfo: ISchool;
  updateConfig?: (configInfo: TConfiguration, idToDelete?: number) => void;
  deleteSchool?: (user: IUser, lang: TLang, activeSchoolId: number, schoolId: number) => void;
};

const Schools = (props: TGeneralProps) => {
  const { user, lang, phase, schoolInfo, deleteSchool } = props;
  const [selectedSchool, setSelectedSchool] = React.useState<ISchool>(null);
  const [showConfirmDialog, setConfirmDialog] = React.useState<boolean>(false);
  const intl = useTranslation();
  const { showSnackbar } = useSnackbar();
  const { superAdmin } = user;

  const handleDeleteClick = (campus: ISchool) => {
    setSelectedSchool(campus);
    setConfirmDialog(true);
  };

  const handleDeleteConfirm = () => {
    deleteSchool(user, lang, schoolInfo.id, selectedSchool.id);
  };

  React.useEffect(() => {
    if (phase === 'school-deleting-success') {
      showSnackbar({
        message: intl.formatMessage({ id: 'app.deleted' }),
        open: true
      });
      setConfirmDialog(false);
    }
  }, [phase]);

  return (
    <>
      <Card sx={{ mt: 2 }}>
        <CardHeader
          title={intl.formatMessage({ id: 'schools' })}
          action={
            <ResponsiveActions
              actions={[
                {
                  key: 'reload',
                  title: intl.translate({ id: 'school.add' }),
                  startIcon: <FontAwesomeIcon icon={faPlus} />,
                  navigate: `/organization/${schoolInfo.id}/schools/new`
                }
              ]}
            />
          }
        />

        <Divider />

        <CardContent>
          <Grid container spacing={3}>
            {schoolInfo?.children?.length > 0 &&
              schoolInfo?.children.map((school) => {
                const { id: schoolId, children, configuration } = school;
                const institutionType = configuration?.find(
                  (c) => c.configKey === 'institutionType'
                );

                return (
                  <Grid key={schoolId} item xs={12} md={6}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <CardHeader
                        avatar={countryToFlag(school.countryCode)}
                        title={school.menuTitle}
                        subheader={
                          <Typography
                            sx={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}
                            variant='body2'
                            component='div'
                          >
                            <FontAwesomeIcon
                              icon={(school.isActive && faCheckCircle) || faBan}
                              color={(school.isActive && 'green') || 'red'}
                            />
                            {intl.formatMessage({
                              id: (school.isActive && 'app.active') || 'app.inactive'
                            })}
                          </Typography>
                        }
                        action={
                          superAdmin && (
                            <IconButton
                              aria-label='delete'
                              title={intl.formatMessage({ id: 'app.delete' })}
                              size='large'
                              onClick={() => handleDeleteClick(school)}
                            >
                              <DeleteIcon color='secondary' />
                            </IconButton>
                          )
                        }
                      />

                      <Divider />

                      <CardContent>
                        <Chip
                          size='small'
                          label={institutionType?.configValue.toUpperCase() || 'K12'}
                          color='primary'
                        />
                        {children?.length > 0 && (
                          <List
                            sx={{ width: '100%', bgcolor: 'background.paper' }}
                            component='nav'
                            aria-labelledby='schools'
                            subheader={
                              <ListSubheader>{intl.formatMessage({ id: 'schools' })}</ListSubheader>
                            }
                          >
                            {children.map((school) => (
                              <ListItemButton key={school.id}>
                                <ListItemIcon>
                                  <FontAwesomeIcon icon={faSchool} />
                                </ListItemIcon>
                                <ListItemText primary={school.menuTitle} />
                              </ListItemButton>
                            ))}
                          </List>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        </CardContent>
      </Card>

      <ConfirmDialog
        handleClose={() => setConfirmDialog(false)}
        handleConfirm={handleDeleteConfirm}
        isOpen={showConfirmDialog}
        title={intl.formatMessage({ id: 'app.delete' })}
        intro={intl.formatMessage(
          { id: 'school.delete.confirm' },
          { name: selectedSchool?.menuTitle }
        )}
        confirmBtnText={intl.formatMessage({ id: 'school.delete' })}
        phase={phase}
        maxHeight={300}
      />
    </>
  );
};

export default Schools;

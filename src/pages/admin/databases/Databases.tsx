import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import loadable from '@loadable/component';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faPlus } from '@fortawesome/pro-duotone-svg-icons';

import Page from 'layout/Page';
import { AppDispatch, RootState } from 'store/store';
import { useSubheader } from 'contexts/SubheaderContext';
import useTranslation from 'hooks/useTranslation';
import ResponsiveActions from 'components/ResponsiveActions';
import SchoostDialog from 'components/SchoostDialog';

import { databasesActions, databaseDataSelector } from './_store/database';

const AddDatabase = loadable(() => import('./AddDatabase'));

const mapStateToProps = (state: RootState) => ({
  databaseData: databaseDataSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullDatabases: () => dispatch(databasesActions.pullDatabases()),
  resetPhase: () => dispatch(databasesActions.setPhase(null))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TDatabaseParams = PropsFromRedux;

const Databases = (props: TDatabaseParams) => {
  const { databaseData, pullDatabases, resetPhase } = props;
  const { databases } = databaseData;
  const { action } = useParams();
  const navigate = useNavigate();
  const subheader = useSubheader();
  const intl = useTranslation();

  const transDatabase = intl.translate({ id: 'database' });

  const handleDialogClose = () => {
    navigate('/admin/databases');
  };

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'databases', url: '/admin/databases' });

    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  React.useEffect(() => {
    pullDatabases();
    resetPhase();
  }, []);

  return (
    <Page title={intl.formatMessage({ id: 'databases' })}>
      <Card>
        <CardHeader
          title={intl.formatMessage({ id: 'databases' })}
          action={
            <ResponsiveActions
              actions={[
                {
                  key: 'add',
                  title: intl.translate({ id: 'app.add.something' }, { something: transDatabase }),
                  startIcon: <FontAwesomeIcon icon={faPlus} />,
                  navigate: '/admin/databases/new'
                }
              ]}
            />
          }
        />
        <Divider />

        <CardContent>
          <List>
            {databases?.map((db) => (
              <ListItem key={db.id} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faDatabase} />
                  </ListItemIcon>
                  <ListItemText
                    primary={db.name}
                    secondary={!db.isCreated && intl.translate({ id: 'app.create.inprogress' })}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <SchoostDialog
        width={300}
        title={intl.translate({ id: 'app.add.something' }, { something: transDatabase })}
        isOpen={action === 'new'}
        dividers={true}
        handleClose={handleDialogClose}
      >
        <AddDatabase handleClose={handleDialogClose} />
      </SchoostDialog>
    </Page>
  );
};

export default connector(Databases);

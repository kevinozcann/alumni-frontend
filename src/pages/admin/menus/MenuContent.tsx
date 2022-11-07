import React from 'react';
import loadable from '@loadable/component';
import { connect, ConnectedProps, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { FormattedMessage, useIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  IconButton,
  Box,
  Grid,
  Card,
  CardHeader,
  Divider,
  CardContent,
  Skeleton,
  Typography
} from '@mui/material';
import { TreeView, TreeItem } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { AppDispatch, RootState } from 'store/store';
import { i18nLangSelector } from 'store/i18n';
import { authActions, authUserSelector } from 'store/auth';
import { userSchoolsSelector, userActiveSchoolSelector } from 'store/user';
import getFlatSchools from 'utils/getFlatSchools';
import { TLang, TActionType, IPageTab } from 'utils/shared-types';
import { ISchool } from 'pages/organization/organization-types';
import { IUser } from 'pages/account/account-types';

import { menuActionPhases, menuActions, menusPhaseSelector, menusSelector } from './_store/menus';
import { IMenu, TMenuType } from './menu-types';
import ResponsiveActions from 'components/ResponsiveActions';
import { faCopy, faPlus, faSync } from '@fortawesome/pro-duotone-svg-icons';

const SchoostDialog = loadable(() => import('components/SchoostDialog'));
const ConfirmDialog = loadable(() => import('components/ConfirmDialog'));
const MenuForm = loadable(() => import('./MenuForm'));
const MenuCopy = loadable(() => import('./MenuCopy'));

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  user: authUserSelector(state),
  schools: userSchoolsSelector(state),
  menus: menusSelector(state),
  menusPhase: menusPhaseSelector(state),
  activeSchool: userActiveSchoolSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullMenus: (schoolId: number, section: TMenuType) =>
    dispatch(menuActions.pullMenus(schoolId, section)),
  syncMenus: (lang: TLang, activeSchoolId: number, menuType: TMenuType) =>
    dispatch(menuActions.syncMenus(lang, activeSchoolId, menuType)),
  saveMenu: (
    lang: TLang,
    user: IUser,
    actionType: TActionType,
    menuId: number,
    section: TMenuType,
    menuInfo: IMenu,
    activeSchool: ISchool
  ) =>
    dispatch(menuActions.saveMenu(lang, user, actionType, menuId, section, menuInfo, activeSchool))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TMenuContentProps = PropsFromRedux & {
  title: string;
  menuType: TMenuType;
  pageTabs: IPageTab[];
};

const MenuContent: React.FC<TMenuContentProps> = (props) => {
  const {
    title,
    menuType,
    lang,
    user,
    schools,
    menus,
    menusPhase,
    activeSchool,
    pullMenus,
    syncMenus,
    saveMenu
  } = props;
  const { action } = useParams();
  const [treeData, setTreeData] = React.useState<IMenu[]>();
  const [activeNode, setActiveNode] = React.useState<IMenu | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const intl = useIntl();

  let similarSchools: ISchool[] = [];
  try {
    const flatSchools = getFlatSchools(schools);
    similarSchools = flatSchools.filter(
      (s: ISchool) => s.id !== activeSchool.id && s.type === activeSchool.type
    );
    // const activePageTab = pageTabs.find((p) => p.value === menuType);
  } catch {
    dispatch(authActions.hardLogout());
  }

  const handleCloseDialog = () => {
    navigate(`/admin/menus/${menuType}`);
  };

  const handleFabAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    navigate(`/admin/menus/${menuType}/new`);
  };

  const handleEditClick = React.useCallback(
    (event: React.MouseEvent, node: IMenu) => {
      event.stopPropagation();
      event.preventDefault();

      setActiveNode(node);
      navigate(`/admin/menus/${menuType}/${node.id}/edit`);
    },
    [navigate, menuType]
  );

  const handleDeleteClick = React.useCallback(
    (event: React.MouseEvent, node: IMenu) => {
      event.stopPropagation();
      event.preventDefault();

      setActiveNode(node);
      navigate(`/admin/menus/${menuType}/${node?.id}/delete`);
    },
    [navigate, menuType]
  );

  const handleDeleteConfirm = React.useCallback(() => {
    if (activeNode) {
      saveMenu(lang, user, 'delete', activeNode.id, menuType, null, activeSchool);
    }

    navigate(`/admin/menus/${menuType}`);
  }, [navigate, lang, user, activeNode, menuType, saveMenu]);

  React.useEffect(() => {
    pullMenus(activeSchool.id, menuType);
  }, [menuType, activeSchool, pullMenus]);

  React.useEffect(() => {
    setTreeData(menus[menuType]);
  }, [menus]);

  const renderTree = (nodes: IMenu[], isPassive = false, showChildrenCount = true) => {
    return nodes?.map((node: IMenu) => (
      <TreeItem
        key={node.id}
        nodeId={`${node.id}`}
        label={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minWidth: '300px'
            }}
          >
            <Box sx={{ fontSize: 'inherit', color: isPassive || !node.isActive ? 'gray' : null }}>
              <FontAwesomeIcon
                icon={[node.iconPrefix, node.icon]}
                style={{ width: 16, marginRight: 8 }}
              />
              <FormattedMessage id={node.title} />{' '}
              {showChildrenCount && `[${node.children.length}]`}
            </Box>
            <Box>
              <IconButton
                aria-label='edit button'
                color='primary'
                size='medium'
                onClick={(event) => handleEditClick(event, node)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                sx={{ opacity: 0 }}
                aria-label='delete button'
                color='secondary'
                size='medium'
                onClick={(event) => handleDeleteClick(event, node)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        }
      >
        {node.children &&
          node.children.length > 0 &&
          renderTree(node.children, !node.isActive, false)}
      </TreeItem>
    ));
  };

  return (
    <React.Fragment>
      <Card>
        <CardHeader
          title={intl.formatMessage({ id: title })}
          action={
            <ResponsiveActions
              actions={[
                {
                  key: 'sync',
                  title: intl.formatMessage({ id: 'app.sync' }),
                  startIcon: (
                    <FontAwesomeIcon
                      icon={faSync}
                      spin={menusPhase === menuActionPhases.MENUS_SYNCING}
                    />
                  ),
                  onClick: () => syncMenus(lang, activeSchool.id, menuType)
                },
                {
                  key: 'copy',
                  title: intl.formatMessage({ id: 'app.copy' }),
                  startIcon: <FontAwesomeIcon icon={faCopy} />,
                  navigate: `/admin/menus/${menuType}/copy`
                },
                {
                  key: 'add',
                  title: intl.formatMessage({ id: 'menu.add' }),
                  startIcon: <FontAwesomeIcon icon={faPlus} />,
                  onClick: handleFabAddClick
                }
              ]}
            />
          }
        />
        <Divider />

        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}
              >
                {(menusPhase === menuActionPhases.MENUS_LOADING && (
                  <React.Fragment>
                    <Skeleton sx={{ mb: 1 }} variant='text' width='51%' height={35} />
                    <Skeleton sx={{ mb: 1 }} variant='text' width='51%' height={35} />
                    <Skeleton sx={{ mb: 1 }} variant='text' width='51%' height={35} />
                    <Skeleton sx={{ mb: 1 }} variant='text' width='51%' height={35} />
                    <Skeleton sx={{ mb: 1 }} variant='text' width='51%' height={35} />
                    <Skeleton sx={{ mb: 1 }} variant='text' width='51%' height={35} />
                  </React.Fragment>
                )) ||
                  (treeData && (
                    <TreeView
                      aria-label='menu tree'
                      defaultCollapseIcon={<ExpandMoreIcon />}
                      defaultExpandIcon={<ChevronRightIcon />}
                    >
                      {renderTree(treeData, false)}
                    </TreeView>
                  )) || (
                    <Typography variant='body2'>
                      {intl.formatMessage({ id: 'app.no_data_available' })}
                    </Typography>
                  )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {(action === 'new' || action === 'edit') && (
        <SchoostDialog
          title={<FormattedMessage id={action === 'new' ? 'ADD' : 'EDIT'} />}
          isOpen={true}
          dividers={true}
          handleClose={handleCloseDialog}
        >
          <MenuForm
            actionType={action}
            handleClose={handleCloseDialog}
            handleSave={saveMenu}
            lang={lang}
            menuInfo={activeNode}
            menuType={menuType}
            treeData={treeData}
            user={user}
          />
        </SchoostDialog>
      )}

      {action === 'copy' && (
        <SchoostDialog
          title={intl.formatMessage({ id: 'app.copy' })}
          isOpen={true}
          dividers={true}
          width={350}
          handleClose={handleCloseDialog}
        >
          <MenuCopy
            actionType={action}
            handleClose={handleCloseDialog}
            lang={lang}
            schools={similarSchools}
            menuType={menuType}
          />
        </SchoostDialog>
      )}

      {action === 'delete' && activeNode && (
        <ConfirmDialog
          isOpen={true}
          handleConfirm={handleDeleteConfirm}
          handleClose={handleCloseDialog}
          phase={menusPhase}
        />
      )}
    </React.Fragment>
  );
};

export default connector(MenuContent);

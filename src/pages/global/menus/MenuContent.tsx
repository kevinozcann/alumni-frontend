import React from 'react';
import loadable from '@loadable/component';
import { connect, ConnectedProps } from 'react-redux';
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
import { faChevronCircleDown, faChevronCircleUp } from '@fortawesome/pro-duotone-svg-icons';

import { AppDispatch, RootState } from 'store/store';
import { userSchoolsSelector } from 'store/user';
import { TActionType, IPageTab } from 'utils/shared-types';
import { AddFabButton } from 'utils/ActionLinks';
import { IMenu, TMenuType } from 'pages/admin/menus/menu-types';

import { menuActionPhases, menuActions, menusPhaseSelector, menusSelector } from './_store/menus';

const SchoostDialog = loadable(() => import('components/SchoostDialog'));
const ConfirmDialog = loadable(() => import('components/ConfirmDialog'));
const MenuForm = loadable(() => import('./MenuForm'));

const mapStateToProps = (state: RootState) => ({
  schools: userSchoolsSelector(state),
  menus: menusSelector(state),
  menusPhase: menusPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullMenus: (section: TMenuType) => dispatch(menuActions.pullMenus(section)),
  saveMenu: (actionType: TActionType, menuId: number, section: TMenuType, menuInfo: IMenu) =>
    dispatch(menuActions.saveMenu(actionType, menuId, section, menuInfo)),
  moveMenu: (direction: 'up' | 'down', menu: IMenu, menus: IMenu[]) =>
    dispatch(menuActions.moveMenu(direction, menu, menus))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TMenuContentProps = PropsFromRedux & {
  title: string;
  menuType: TMenuType;
  pageTabs: IPageTab[];
};

const MenuContent: React.FC<TMenuContentProps> = (props) => {
  const { title, menuType, menus, menusPhase, pullMenus, saveMenu, moveMenu } = props;
  const { action } = useParams();
  const [treeData, setTreeData] = React.useState<IMenu[]>();
  const [activeNode, setActiveNode] = React.useState<IMenu | null>(null);
  const navigate = useNavigate();
  const intl = useIntl();

  const handleCloseDialog = () => {
    navigate(`/global/menus/${menuType}`);
  };

  const handleFabAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    navigate(`/global/menus/${menuType}/new`);
  };

  const handleEditClick = React.useCallback(
    (event: React.MouseEvent, node: IMenu) => {
      event.stopPropagation();
      event.preventDefault();

      setActiveNode(node);
      navigate(`/global/menus/${menuType}/${node.id}/edit`);
    },
    [navigate, menuType]
  );

  const handleMoveClick = React.useCallback(
    (event: React.MouseEvent, node: IMenu, nodes: IMenu[], direction: 'up' | 'down') => {
      event.stopPropagation();
      event.preventDefault();

      moveMenu(direction, node, nodes);
    },
    [menuType]
  );

  const handleDeleteClick = React.useCallback(
    (event: React.MouseEvent, node: IMenu) => {
      event.stopPropagation();
      event.preventDefault();

      setActiveNode(node);
      navigate(`/global/menus/${menuType}/${node?.id}/delete`);
    },
    [navigate, menuType]
  );

  const handleDeleteConfirm = React.useCallback(() => {
    if (activeNode) {
      saveMenu('delete', activeNode.id, menuType, null);
    }

    navigate(`/global/menus/${menuType}`);
  }, [navigate, activeNode, menuType, saveMenu]);

  React.useEffect(() => {
    pullMenus(menuType);
  }, [menuType, pullMenus]);

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
              {`[${node.position}] `}
              <FontAwesomeIcon
                icon={[node.iconPrefix, node.icon]}
                style={{ width: 16, marginRight: 8 }}
              />
              <FormattedMessage id={node.title} />{' '}
              {showChildrenCount && `[${node.children.length}]`}
            </Box>
            <Box>
              <IconButton
                aria-label='move up button'
                disabled={node.position <= 0}
                color='inherit'
                size='medium'
                onClick={(event) => handleMoveClick(event, node, nodes, 'up')}
              >
                <FontAwesomeIcon icon={faChevronCircleUp} />
              </IconButton>
              <IconButton
                aria-label='move down button'
                disabled={node.position >= nodes.length - 1}
                color='inherit'
                size='medium'
                onClick={(event) => handleMoveClick(event, node, nodes, 'down')}
              >
                <FontAwesomeIcon icon={faChevronCircleDown} />
              </IconButton>
              <IconButton
                aria-label='edit button'
                color='primary'
                size='medium'
                onClick={(event) => handleEditClick(event, node)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
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
        <CardHeader title={intl.formatMessage({ id: title })} />
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

      <AddFabButton title='menu.add' onClick={handleFabAddClick} />

      {(action === 'new' || action === 'edit') && (
        <SchoostDialog
          title={<FormattedMessage id={action === 'new' ? 'menu.add' : 'menu.edit'} />}
          isOpen={true}
          dividers={true}
          handleClose={handleCloseDialog}
        >
          <MenuForm
            actionType={action}
            handleClose={handleCloseDialog}
            handleSave={saveMenu}
            menuInfo={activeNode}
            menuType={menuType}
            treeData={treeData}
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

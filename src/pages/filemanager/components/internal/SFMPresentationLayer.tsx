import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { reduxActions } from '../../redux/reducers';
import {
  selectClearSelectionOnOutsideClick,
  selectFileActionIds,
  selectIsDnDDisabled
} from '../../redux/selectors';
import { useDndContextAvailable } from '../../util/dnd-fallback';
import { elementIsInsideButton } from '../../util/helpers';
import { makeGlobalSFMStyles } from '../../util/styles';
import { useContextMenuTrigger } from '../external/FileContextMenu-hooks';
import { DnDFileListDragLayer } from '../file-list/DnDFileListDragLayer';
import { HotkeyListener } from './HotkeyListener';

export interface SFMPresentationLayerProps {
  children?: React.ReactNode;
}

export const SFMPresentationLayer = ({ children }: SFMPresentationLayerProps) => {
  const dispatch = useDispatch();
  const fileActionIds = useSelector(selectFileActionIds);
  const dndDisabled = useSelector(selectIsDnDDisabled);
  const clearSelectionOnOutsideClick = useSelector(selectClearSelectionOnOutsideClick);

  // Deal with clicks outside of SFM
  const handleClickAway = useCallback(
    (event: React.MouseEvent<Document>) => {
      if (!clearSelectionOnOutsideClick || elementIsInsideButton(event.target)) {
        // We only clear out the selection on outside click if the click target
        // was not a button. We don't want to clear out the selection when a
        // button is clicked because SFM users might want to trigger some
        // selection-related action on that button click.
        return;
      }
      dispatch(reduxActions.clearSelection());
    },
    [dispatch, clearSelectionOnOutsideClick]
  );

  // Generate necessary components
  const hotkeyListenerComponents = useMemo(
    () =>
      fileActionIds.map((actionId) => (
        <HotkeyListener key={`file-action-listener-${actionId}`} fileActionId={actionId} />
      )),
    [fileActionIds]
  );

  const dndContextAvailable = useDndContextAvailable();
  const showContextMenu = useContextMenuTrigger();

  const classes = useStyles();
  return (
    //@ts-ignore
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box className={classes.sFMRoot} onContextMenu={showContextMenu}>
        {!dndDisabled && dndContextAvailable && <DnDFileListDragLayer />}
        {hotkeyListenerComponents}
        {children ? children : null}
      </Box>
    </ClickAwayListener>
  );
};

const useStyles = makeGlobalSFMStyles((theme) => ({
  sFMRoot: {
    backgroundColor: theme.palette.background.paper,
    border: `solid 1px ${theme.palette.divider}`,
    padding: theme.margins.rootLayoutMargin,
    fontSize: theme.fontSizes.rootPrimary,
    color: theme.palette.text.primary,
    touchAction: 'manipulation', // Disabling zoom on double tap
    fontFamily: 'sans-serif',
    flexDirection: 'column',
    boxSizing: 'border-box',
    textAlign: 'left',
    borderRadius: 4,
    display: 'flex',
    height: '100%',

    // Disabling select
    webkitTouchCallout: 'none',
    webkitUserSelect: 'none',
    mozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none'
  }
}));

import React, { useCallback, useContext } from 'react';
import { Nullable } from 'tsdef';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';

import { selectFileActionData } from '../../redux/selectors';
import { useParamSelector } from '../../redux/store';
import { SFMIconName } from '../../types/icons.types';
import { CustomVisibilityState } from '../../types/action.types';
import { useFileActionProps, useFileActionTrigger } from '../../util/file-actions';
import { useLocalizedFileActionStrings } from '../../util/i18n';
import { SFMIconContext } from '../../util/icon-helper';
import { c, important, makeGlobalSFMStyles } from '../../util/styles';

export interface ToolbarDropdownButtonProps {
  text: string;
  active?: boolean;
  icon?: Nullable<SFMIconName | string>;
  onClick?: () => void;
  disabled?: boolean;
}

export const ToolbarDropdownButton = React.forwardRef(
  (props: ToolbarDropdownButtonProps, ref: React.Ref<HTMLLIElement>) => {
    const { text, active, icon, onClick, disabled } = props;
    const classes = useStyles();
    const SFMIcon = useContext(SFMIconContext);

    const className = c({
      [classes.baseButton]: true,
      [classes.activeButton]: active
    });
    return (
      <MenuItem ref={ref} className={className} onClick={onClick} disabled={disabled}>
        {icon && (
          <ListItemIcon className={classes.icon}>
            <SFMIcon icon={icon} fixedWidth={true} />
          </ListItemIcon>
        )}
        <ListItemText primaryTypographyProps={{ className: classes.text }}>{text}</ListItemText>
      </MenuItem>
    );
  }
);

const useStyles = makeGlobalSFMStyles((theme) => ({
  baseButton: {
    lineHeight: important(theme.toolbar.lineHeight),
    height: important(theme.toolbar.size),
    minHeight: important('auto'),
    minWidth: important('auto'),
    padding: important(20)
  },
  icon: {
    fontSize: important(theme.toolbar.fontSize),
    minWidth: important('auto'),
    color: important('inherit'),
    marginRight: 8
  },
  text: {
    fontSize: important(theme.toolbar.fontSize)
  },
  activeButton: {
    color: important(theme.colors.textActive)
  }
}));

export interface SmartToolbarDropdownButtonProps {
  fileActionId: string;
  onClickFollowUp?: () => void;
}

export const SmartToolbarDropdownButton = React.forwardRef(
  (props: SmartToolbarDropdownButtonProps, ref: React.Ref<HTMLLIElement>) => {
    const { fileActionId, onClickFollowUp } = props;

    const action = useParamSelector(selectFileActionData, fileActionId);
    const triggerAction = useFileActionTrigger(fileActionId);
    const { icon, active, disabled } = useFileActionProps(fileActionId);
    const { buttonName } = useLocalizedFileActionStrings(action);

    // Combine external click handler with internal one
    const handleClick = useCallback(() => {
      triggerAction();
      if (onClickFollowUp) onClickFollowUp();
    }, [onClickFollowUp, triggerAction]);

    if (!action) return null;
    const { button } = action;
    if (!button) return null;
    if (
      action.customVisibility !== undefined &&
      action.customVisibility() === CustomVisibilityState.Hidden
    )
      return null;

    return (
      <ToolbarDropdownButton
        ref={ref}
        text={buttonName}
        icon={icon}
        onClick={handleClick}
        active={active}
        disabled={disabled}
      />
    );
  }
);

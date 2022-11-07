import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import Typography from '@mui/material/Typography';

import { selectHiddenFileCount, selectors, selectSelectionSize } from '../../redux/selectors';
import { getI18nId, I18nNamespace } from '../../util/i18n';
import { important, makeGlobalSFMStyles } from '../../util/styles';

export interface ToolbarInfoProps {}

export const ToolbarInfo: React.FC<ToolbarInfoProps> = React.memo(() => {
  const classes = useStyles();

  const displayFileIds = useSelector(selectors.getDisplayFileIds);
  const selectionSize = useSelector(selectSelectionSize);
  const hiddenCount = useSelector(selectHiddenFileCount);

  const intl = useIntl();
  const fileCountString = intl.formatMessage(
    {
      id: getI18nId(I18nNamespace.Toolbar, 'visibleFileCount')
    },
    { fileCount: displayFileIds.length }
  );
  const selectedString = intl.formatMessage(
    {
      id: getI18nId(I18nNamespace.Toolbar, 'selectedFileCount')
    },
    { fileCount: selectionSize }
  );
  const hiddenString = intl.formatMessage(
    {
      id: getI18nId(I18nNamespace.Toolbar, 'hiddenFileCount')
    },
    { fileCount: hiddenCount }
  );

  return (
    <div className={classes.infoContainer}>
      <Typography className={classes.infoText} variant='body1'>
        {fileCountString}
        {(selectionSize > 0 || hiddenCount > 0) && (
          <span className={classes.extraInfoSpan}>
            (<span className={classes.selectionSizeText}>{selectedString}</span>
            {selectionSize && hiddenCount > 0 && ', '}
            <span className={classes.hiddenCountText}>{hiddenString}</span>)
          </span>
        )}
      </Typography>
    </div>
  );
});

const useStyles = makeGlobalSFMStyles((theme) => ({
  infoContainer: {
    height: theme.toolbar.size,
    display: 'flex'
  },
  infoText: {
    lineHeight: important(theme.toolbar.lineHeight),
    fontSize: important(theme.toolbar.fontSize),
    marginLeft: important(12),
    height: theme.toolbar.size
  },
  extraInfoSpan: {
    marginRight: important(8),
    marginLeft: important(8),
    opacity: 0.8
  },
  selectionSizeText: {
    color: theme.colors.textActive
  },
  hiddenCountText: {}
}));

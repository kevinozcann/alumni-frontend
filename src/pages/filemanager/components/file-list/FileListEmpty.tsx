import React, { CSSProperties, useContext } from 'react';
import { useIntl } from 'react-intl';

import { SFMIconName } from '../../types/icons.types';
import { getI18nId, I18nNamespace } from '../../util/i18n';
import { SFMIconContext } from '../../util/icon-helper';
import { makeGlobalSFMStyles } from '../../util/styles';

export interface FileListEmptyProps {
  width: number;
  height: number;
}

export const FileListEmpty: React.FC<FileListEmptyProps> = (props) => {
  const { width, height } = props;
  const classes = useStyles();
  const SFMIcon = useContext(SFMIconContext);
  const style: CSSProperties = {
    width,
    height
  };

  const intl = useIntl();
  const emptyString = intl.formatMessage({
    id: getI18nId(I18nNamespace.FileList, 'nothingToShow'),
    defaultMessage: 'Nothing to show'
  });

  return (
    <div className={classes.fileListEmpty} style={style}>
      <div className={classes.fileListEmptyContent}>
        <SFMIcon icon={SFMIconName.folderOpen} />
        &nbsp; {emptyString}
      </div>
    </div>
  );
};

const useStyles = makeGlobalSFMStyles((theme) => ({
  fileListEmpty: {
    color: theme.palette.text.disabled,
    position: 'relative',
    textAlign: 'center',
    fontSize: '1.2em'
  },
  fileListEmptyContent: {
    transform: 'translateX(-50%) translateY(-50%)',
    position: 'absolute',
    left: '50%',
    top: '50%'
  }
}));

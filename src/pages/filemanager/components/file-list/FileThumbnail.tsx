import React from 'react';
import c from 'classnames';
import { Nullable } from 'tsdef';

import { makeGlobalSFMStyles } from '../../util/styles';

export interface FileThumbnailProps {
  className: string;
  thumbnailUrl: Nullable<string>;
}

export const FileThumbnail: React.FC<FileThumbnailProps> = React.memo((props) => {
  const { className, thumbnailUrl } = props;

  const thumbnailStyle: React.CSSProperties = thumbnailUrl
    ? { backgroundImage: `url('${thumbnailUrl}')` }
    : {};

  const classes = useStyles();
  return <div className={c([className, classes.fileThumbnail])} style={thumbnailStyle} />;
});
FileThumbnail.displayName = 'FileThumbnail';

const useStyles = makeGlobalSFMStyles(() => ({
  fileThumbnail: {
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain'
  }
}));

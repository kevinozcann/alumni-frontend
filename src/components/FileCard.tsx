import React from 'react';
import { useIntl } from 'react-intl';
import TruncateString from 'react-truncate-string';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  Box
} from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import MoreIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/pro-duotone-svg-icons';

import bytesToSize from 'utils/bytesToSize';
import { IFile } from 'utils/shared-types';
import { filenameFromPath, filetypeFromFilename } from 'utils/Helpers';

type FileCardProps = {
  file: IFile;
  layout?: 'vertical' | 'horizontal';
  menu?: any;
  mainAction?: 'download' | 'show' | 'remove';
  onDownload?: any;
  onRemove?: any;
  onShow?: () => void;
  showFilename?: boolean;
};

const FileCard: React.FC<FileCardProps> = ({
  file,
  layout,
  menu,
  mainAction,
  onDownload,
  onRemove,
  onShow,
  showFilename
}) => {
  const moreRef = React.useRef(null);
  const intl = useIntl();
  const [openMenu, setOpenMenu] = React.useState(false);

  const handleMenuOpen = () => {
    setOpenMenu(true);
  };

  const handleMenuClose = () => {
    setOpenMenu(false);
  };

  const fileType =
    file.mimeType && file.mimeType.includes('image/') ? 'image' : filetypeFromFilename(file.url);
  const isImageFile = fileType === 'image';
  const fileId = file.id ? file.id : file.url;
  const fileUrl = file.url;
  const fileName = file.name ? file.name : filenameFromPath(file.url);
  const fileSize = file.size ? file.size : null;

  return layout === 'horizontal' ? (
    <Card
      sx={{
        display: 'flex',
        height: 40,
        '&:hover': {
          backgroundColor: 'background.default'
        }
      }}
      variant='outlined'
    >
      {isImageFile ? (
        <CardMedia sx={{ height: 40, width: 40 }} image={fileUrl} />
      ) : (
        <Box sx={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FontAwesomeIcon
            size='3x'
            icon={['fad', fileType ? (`file-${fileType}` as IconName) : 'file']}
          />
        </Box>
      )}

      <Box sx={{ flexGrow: 1, padding: 1 }}>
        <Typography variant='subtitle1' color='textPrimary'>
          {fileName}
        </Typography>
      </Box>

      <Divider orientation='vertical' flexItem />

      <CardActions>
        {mainAction === 'remove' && (
          <Button fullWidth onClick={() => onRemove(fileId)}>
            <DeleteIcon sx={{ marginRight: 1 }} />
            {intl.formatMessage({ id: 'file.remove' })}
          </Button>
        )}
        {mainAction === 'download' && (
          <Button fullWidth onClick={() => onDownload(fileId)}>
            <GetAppIcon sx={{ marginRight: 1 }} />
            {intl.formatMessage({ id: 'file.download' })}
          </Button>
        )}
        {mainAction === 'show' && (
          <Button fullWidth onClick={onShow}>
            <GetAppIcon sx={{ marginRight: 1 }} />
            {intl.formatMessage({ id: 'file.show' })}
          </Button>
        )}

        {menu && (
          <div>
            <Tooltip title='More options'>
              <IconButton edge='end' onClick={handleMenuOpen} ref={moreRef} size='small'>
                <MoreIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={moreRef.current}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              onClose={handleMenuClose}
              elevation={1}
              open={openMenu}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
            >
              <MenuItem>
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText primary='Delete' />
              </MenuItem>
            </Menu>
          </div>
        )}
      </CardActions>
    </Card>
  ) : (
    <Card
      variant='outlined'
      sx={{
        display: 'block',
        '&:hover': {
          backgroundColor: 'background.default'
        }
      }}
    >
      {isImageFile ? (
        <CardMedia sx={{ height: 140 }} image={fileUrl} />
      ) : (
        <Box sx={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FontAwesomeIcon icon={['fad', fileType ? (`file-${fileType}` as IconName) : 'file']} />
        </Box>
      )}
      {(showFilename || fileSize || menu) && (
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            {showFilename && <TruncateString text={fileName} />}
            {fileSize && (
              <Typography variant='subtitle2' color='textPrimary'>
                {bytesToSize(file.size)}
              </Typography>
            )}
          </div>

          {menu && (
            <div>
              <Tooltip title='More options'>
                <IconButton edge='end' onClick={handleMenuOpen} ref={moreRef} size='small'>
                  <MoreIcon />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={moreRef.current}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
                onClose={handleMenuClose}
                elevation={1}
                open={openMenu}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
              >
                <MenuItem>
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                  <ListItemText primary='Delete' />
                </MenuItem>
              </Menu>
            </div>
          )}
        </CardContent>
      )}

      {mainAction && <Divider />}

      <CardActions>
        {mainAction === 'remove' && (
          <Button fullWidth onClick={() => onRemove(fileId)}>
            <DeleteIcon sx={{ marginRight: 1 }} />
            {intl.formatMessage({ id: 'file.remove' })}
          </Button>
        )}
        {mainAction === 'download' && (
          <Button fullWidth onClick={() => onDownload(fileId)}>
            <GetAppIcon sx={{ marginRight: 1 }} />
            {intl.formatMessage({ id: 'file.download' })}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default FileCard;

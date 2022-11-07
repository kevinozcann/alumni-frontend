import React from 'react';
import loadable from '@loadable/component';
import { useIntl } from 'react-intl';
import { Lightbox } from 'react-modal-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
  Divider,
  Typography,
  IconButton,
  MenuItem,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Skeleton
} from '@mui/material';
import { useInView } from 'react-intersection-observer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { faTrash } from '@fortawesome/pro-duotone-svg-icons';

import { IFile, TActionType, TLang } from 'utils/shared-types';
import getInitials from 'utils/getInitials';
import { createMarkup } from 'utils/Helpers';
import { IUser } from 'pages/account/account-types';

import { IExtendedFeed } from './_store/feeds';
import { IFeed } from './feed-types';

const Moment = loadable.lib(() => import('moment'));

const StyledMenu = loadable(() => import('utils/StyledMenu'));
const FileCard = loadable(() => import('components/FileCard'));
const ConfirmDialog = loadable(() => import('components/ConfirmDialog'));
const FileViewerDialog = loadable(() => import('components/FileViewerDialog'));

const Reactions = loadable(() => import('./Reactions'));
const Comment = loadable(() => import('./Comment'));
const CommentAdd = loadable(() => import('./CommentAdd'));

type FeedProps = {
  lang: TLang;
  user: IUser;
  feed: IFeed;
  phase: string;
  handleSaveFeed: (user: IUser, feed: Partial<IExtendedFeed>, actionType: TActionType) => void;
};
const Feed = (props: FeedProps) => {
  const { lang, user, feed, phase, handleSaveFeed } = props;
  const [selectedFile, setSelectedFile] = React.useState<IFile>(null);
  const [selectedImage, setSelectedImage] = React.useState<string>(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const intl = useIntl();
  const { ref, inView } = useInView({
    threshold: 0
  });

  const isMe = feed.poster.isMe;
  const images = feed.files.filter((file) => file.mimeType.includes('image/'));
  const files = feed.files.filter((file) => !file.mimeType.includes('image/'));

  const handleActionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionsClose = () => {
    setAnchorEl(null);
  };

  const handleFeedDelete = () => {
    setAnchorEl(null);

    setShowConfirmDialog(true);
  };

  const handleDeleteConfirm = () => {
    handleSaveFeed(user, feed, 'delete');
  };

  const handleCloseConfirm = () => {
    setShowConfirmDialog(false);
  };

  return (
    <React.Fragment>
      <Card>
        <CardHeader
          avatar={
            <Avatar alt='user avatar' src={feed.poster.picture}>
              {getInitials(feed.poster.fullName)}
            </Avatar>
          }
          disableTypography
          subheader={
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'textSecondary' }}>
              <AccessTimeIcon fontSize='inherit' color='primary' />
              <Typography sx={{ ml: 1 }} variant='caption' color='textSecondary'>
                <Moment>
                  {({ default: moment }) => {
                    moment.locale(lang);
                    return moment(feed.postedAt).fromNow();
                  }}
                </Moment>
              </Typography>
            </Box>
          }
          title={<Typography color='textPrimary'>{feed.poster.fullName}</Typography>}
          action={
            (isMe && (
              <React.Fragment>
                <IconButton
                  aria-label='actions'
                  aria-haspopup='true'
                  onClick={handleActionsClick}
                  size='large'
                >
                  <MoreVertIcon />
                </IconButton>
                <StyledMenu
                  id='actions-menu'
                  keepMounted
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleActionsClose}
                >
                  <MenuItem onClick={handleFeedDelete}>
                    <FontAwesomeIcon icon={faTrash} />
                    {intl.formatMessage({ id: 'app.delete' })}
                  </MenuItem>
                </StyledMenu>
              </React.Fragment>
            )) ||
            null
          }
        />

        <Box sx={{ paddingX: 3, paddingBottom: 2 }}>
          {feed.title && (
            <Typography variant='subtitle1' color='textPrimary'>
              {feed.title}
            </Typography>
          )}

          {feed.shortText && (
            <Typography variant='body1' color='textSecondary'>
              {feed.shortText}
            </Typography>
          )}

          {feed.coverPicture && (
            <Box sx={{ marginY: 1 }}>
              <CardActionArea ref={ref} onClick={() => setSelectedImage(feed.coverPicture)}>
                {(inView && (
                  <CardMedia
                    sx={{ height: 250, maxHeight: 250, backgroundPosition: 'top' }}
                    width='100%'
                    height='100%'
                    component='img'
                    image={feed.coverPicture}
                    title={feed.coverPicture}
                    alt={feed.coverPicture}
                  />
                )) || <Skeleton sx={{ height: 250, maxHeight: 250 }} />}
              </CardActionArea>
            </Box>
          )}

          {feed.content && (
            <Typography variant='body2' color='textPrimary' component='div'>
              <div dangerouslySetInnerHTML={createMarkup(feed.content)} />
            </Typography>
          )}

          {images.length > 0 && (
            <Box sx={{ marginTop: 2 }}>
              <ImageList sx={{ flexWrap: 'nowrap' }} cols={images.length > 2 ? 3 : images.length}>
                {images?.map((img: IFile) => (
                  <ImageListItem
                    key={img.id}
                    sx={{ cursor: 'pointer', maxHeight: '200px', overflow: 'hidden' }}
                    onClick={() => setSelectedImage(img.url)}
                  >
                    <img
                      width='100%'
                      height='100%'
                      srcSet={img.url}
                      alt={img.name}
                      loading='lazy'
                    />
                    <ImageListItemBar
                      sx={{
                        '& .MuiImageListItemBar-root': {
                          background:
                            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
                        },
                        '& .MuiImageListItemBar-title': {
                          fontSize: 'inherit'
                        }
                      }}
                      title={img.name}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          )}

          {files.length > 0 && (
            <Box sx={{ marginTop: 2 }}>
              <ImageList sx={{ flexWrap: 'nowrap' }} cols={2}>
                {files?.map((file) => (
                  <ImageListItem
                    sx={{ height: 'auto', border: '1px solid rgba(0, 0, 0, 0.12)' }}
                    key={file.id}
                  >
                    <FileCard
                      file={file}
                      layout='horizontal'
                      mainAction='show'
                      onShow={() => setSelectedFile(file)}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          )}

          <Box sx={{ marginTop: 2 }}>
            <Reactions user={user} feed={feed} handleSaveFeed={handleSaveFeed} />
          </Box>

          {feed.comments.length > 0 && (
            <Box sx={{ marginY: 2 }}>
              <Divider />
            </Box>
          )}

          {feed.comments.map((comment) => (
            <Comment
              key={comment.id}
              user={user}
              feed={feed}
              phase={phase}
              comment={comment}
              handleSaveFeed={handleSaveFeed}
            />
          ))}

          <Divider sx={{ marginBottom: 1 }} />

          <CommentAdd user={user} feed={feed} handleSaveFeed={handleSaveFeed} />
        </Box>
      </Card>

      {selectedImage && <Lightbox large={selectedImage} onClose={() => setSelectedImage(null)} />}
      {selectedFile && (
        <FileViewerDialog
          fileUrl={selectedFile.url}
          isOpen={true}
          handleClose={() => setSelectedFile(null)}
          title={selectedFile.name}
        />
      )}

      <ConfirmDialog
        handleClose={handleCloseConfirm}
        handleConfirm={handleDeleteConfirm}
        isOpen={showConfirmDialog}
        phase={phase}
      />
    </React.Fragment>
  );
};

export default Feed;

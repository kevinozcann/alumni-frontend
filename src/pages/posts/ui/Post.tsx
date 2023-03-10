import { faTrash } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import loadable from '@loadable/component';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { useIntl } from 'react-intl';
import { Lightbox } from 'react-modal-image';

import getInitials from 'utils/getInitials';
import { createMarkup } from 'utils/Helpers';
import { IFile, TActionType } from 'utils/shared-types';

import { IAuthUser } from 'pages/auth/data/account-types';
import { userProfileSelector } from 'pages/profile/services/store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { i18nLangSelector } from 'store/i18n';
import { IPost } from '../data/post-types';
import { postsPhaseSelector } from '../services/store/selectors';
import { IUser } from 'pages/profile/data/user-types';
import { postActions } from '../services/actions';
import PostComments from './PostComments';

const Moment = loadable.lib(() => import('moment'));

const StyledMenu = loadable(() => import('utils/StyledMenu'));
const FileCard = loadable(() => import('components/FileCard'));
const ConfirmDialog = loadable(() => import('components/ConfirmDialog'));
const FileViewerDialog = loadable(() => import('components/FileViewerDialog'));

const Reactions = loadable(() => import('./Reactions'));
const Comment = loadable(() => import('./Comment'));
const NewComment = loadable(() => import('./NewComment'));

type FeedProps = {
  post: IPost;
};

const Post = (props: FeedProps) => {
  const { post } = props;
  const intl = useIntl();
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = React.useState<IFile>(null);
  const [selectedImage, setSelectedImage] = React.useState<string>(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const { ref, inView } = useInView({
    threshold: 0
  });

  const lang = useSelector(i18nLangSelector);
  const userProfile = useSelector(userProfileSelector);
  const postsPhase = useSelector(postsPhaseSelector);

  const isMe = post?.user?.id === userProfile.id;
  const images = post.files?.filter((file) => file.mimeType.includes('image/'));
  const files = post.files?.filter((file) => !file.mimeType.includes('image/'));

  const handleSaveFeed = React.useCallback((user: IUser, post: IPost) => {
    // dispatch(postActions.addPost(user, post));
  }, []);

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
    // handleSaveFeed(user, post, 'delete');
  };

  const handleCloseConfirm = () => {
    setShowConfirmDialog(false);
  };

  React.useEffect(() => {
    // if (post.user.)
  }, []);

  return (
    <React.Fragment>
      <Card>
        <CardHeader
          avatar={
            <Avatar alt='user avatar' src={post?.user?.avatarUrl}>
              {getInitials(`${post?.user?.name} ${post?.user?.family_name}`)}
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
                    return moment(post.createdAt).fromNow();
                  }}
                </Moment>
              </Typography>
            </Box>
          }
          title={
            <Typography color='textPrimary'>
              {`${post?.user?.name} ${post?.user?.family_name}`}
            </Typography>
          }
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
          {post?.coverPicture && (
            <Box sx={{ marginY: 1 }}>
              <CardActionArea ref={ref} onClick={() => setSelectedImage(post?.coverPicture)}>
                {(inView && (
                  <CardMedia
                    sx={{ height: 250, maxHeight: 250, backgroundPosition: 'top' }}
                    width='100%'
                    height='100%'
                    component='img'
                    image={post?.coverPicture}
                    title={post?.coverPicture}
                    alt={post?.coverPicture}
                  />
                )) || <Skeleton sx={{ height: 250, maxHeight: 250 }} />}
              </CardActionArea>
            </Box>
          )}

          {post?.content && (
            <Typography variant='body2' color='textPrimary' component='div'>
              <div dangerouslySetInnerHTML={createMarkup(post?.content)} />
            </Typography>
          )}

          {images?.length > 0 && (
            <Box sx={{ marginTop: 2 }}>
              <ImageList sx={{ flexWrap: 'nowrap' }} cols={images?.length > 2 ? 3 : images?.length}>
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

          {files?.length > 0 && (
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
            <Reactions user={userProfile} post={post} handleSaveFeed={handleSaveFeed} />
          </Box>

          <PostComments post={post} />
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
        phase={postsPhase}
      />
    </React.Fragment>
  );
};

export default Post;

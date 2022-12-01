import React from 'react';
import { connect, ConnectedProps, useSelector } from 'react-redux';
import useSWR from 'swr';
import { useFormik } from 'formik';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  TextField,
  CardHeader,
  Avatar,
  Chip,
  CardMedia,
  CardActions,
  Button,
  FilledInput,
  CardActionArea,
  Grid
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { ExpandMore, MoreVert, AddPhotoAlternate, Photo } from '@mui/icons-material';
import PublicIcon from '@mui/icons-material/Public';

import { FILEMANAGER_USER_URL, updateApiUrl } from 'store/ApiUrls';
import { AppDispatch, RootState } from 'store/store';
import { i18nLangSelector } from 'store/i18n';
import { authUserSelector } from 'store/auth';
import useTranslation from 'hooks/useTranslation';
import useFileManager from 'hooks/useFileManager';
import FileCard from 'components/FileCard';
import { SaveButton } from 'utils/ActionLinks';
import { IFile, TActionType } from 'utils/shared-types';
import { fileExtension, filenameFromPath, filetypeFromFilename } from 'utils/Helpers';
import fetcher from 'utils/fetcher';

import { IUser } from 'pages/account/account-types';

import { IFeed } from './feed-types';
import { feedsAddSelector, feedActions, feedsPhaseSelector } from './_store/feeds';

const mapStateToProps = (state: RootState) => ({
  addFeed: feedsAddSelector(state),
  phase: feedsPhaseSelector(state),
  lang: i18nLangSelector(state),
  user: authUserSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  saveFeed: (user: IUser, feed: Partial<IFeed>, actionType: TActionType) =>
    dispatch(feedActions.saveFeed(user, feed, actionType)),
  updateAddFeed: (feed: Partial<IFeed>) => dispatch(feedActions.updateAddFeed(feed))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type NewFeedFormProps = PropsFromRedux & {
  actionType: TActionType;
  handleClose?: () => void;
};

const NewFeedForm: React.FC<NewFeedFormProps> = (props) => {
  const { actionType, addFeed, phase, lang, handleClose, saveFeed, updateAddFeed } = props;
  const intl = useTranslation();
  const { showFileManager } = useFileManager();

  const user = useSelector(authUserSelector);
  const userAttributes = user.attributes;

  const transPhoto = intl.translate({ id: 'feed.photo' });
  const transDoc = intl.translate({ id: 'feed.doc' });

  const { data: coverPictureFMLink } = useSWR(
    updateApiUrl(FILEMANAGER_USER_URL, { lang: lang, userId: user.uuid }) + '/coverPicture',
    fetcher,
    {
      refreshInterval: 0
    }
  );
  const { data: photoFMLink } = useSWR(
    updateApiUrl(FILEMANAGER_USER_URL, { lang: lang, userId: user.uuid }) + '/photo',
    fetcher,
    {
      refreshInterval: 0
    }
  );

  const { data: docFMLink } = useSWR(
    updateApiUrl(FILEMANAGER_USER_URL, { lang: lang, userId: user.uuid }) + '/doc/2',
    fetcher,
    {
      refreshInterval: 0
    }
  );

  const formValues: IFeed = {
    commentsOn: true,
    content: addFeed ? addFeed.content : '',
    coverPicture: addFeed ? addFeed.coverPicture : '',
    feedType: 'post',
    files: addFeed ? addFeed.files : [],
    related: addFeed ? addFeed.related : [],
    shortText: addFeed ? addFeed.shortText : '',
    tags: addFeed ? addFeed.tags : [],
    title: addFeed ? addFeed.title : '',
    url: addFeed ? addFeed.url : ''
  };
  const {
    handleSubmit,
    handleChange,
    setFieldValue,
    values,
    initialValues,
    errors,
    setSubmitting,
    status,
    setStatus
  } = useFormik({
    initialValues: formValues,
    validate: (values) => validateForm(values),
    onSubmit: (values) => submitForm(values)
  });

  const validateForm = (values: Partial<IFeed>) => {
    const errors = {};
    const nonEmptyFields = ['content'];

    nonEmptyFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = intl.translate({ id: 'app.cannot_be_empty' });
      }
    });

    return errors;
  };

  const images = values.files.filter((file) => file.mimeType.includes('image/'));
  const files = values.files.filter((file) => !file.mimeType.includes('image/'));

  const handleSelectCallback = (fieldId: string, fieldValue: any) => {
    setFieldValue(fieldId, fieldValue);
    setStatus('notSubmitted');
  };

  const handleFileCallback = (fieldId: string, fieldValue: any) => {
    const files = [...values.files].concat({
      name: filenameFromPath(fieldValue),
      url: fieldValue,
      mimeType: `${filetypeFromFilename(fieldValue)}/${fileExtension(fieldValue)}`,
      createdBy: user['@id']
    });
    setFieldValue('files', files);
  };

  const handleFileRemove = (fileId: number | string) => {
    const files = [...values.files].filter((file) =>
      file.id ? file.id !== fileId : file.url !== fileId
    );
    setFieldValue('files', files);
  };

  const submitForm = (values: Partial<IFeed>) => {
    if (values !== initialValues || addFeed) {
      setStatus('submitted');
      saveFeed(user, values, actionType);
    }
  };

  React.useEffect(() => {
    setStatus('notSubmitted');
  }, [setStatus]);

  React.useEffect(() => {
    setSubmitting(false);

    if (status === 'submitted' && phase === 'success') {
      handleClose();
    }
  }, [status, phase]);

  // Auto save as draft
  React.useEffect(() => {
    if (values !== initialValues) {
      updateAddFeed(values);
    }
  }, [initialValues, values]);

  return (
    <form className='form' noValidate={true} autoComplete='off' onSubmit={handleSubmit}>
      <Card elevation={0}>
        <CardHeader
          sx={{ padding: 1 }}
          avatar={<Avatar alt='username' src={userAttributes.pictureUrl} />}
          title={`${userAttributes.name} ${userAttributes.family_name}`}
          subheader={
            <Chip
              label={intl.translate({ id: 'feed.public' })}
              variant='outlined'
              size='small'
              deleteIcon={<ExpandMore />}
              onDelete={() => console.log('click')}
              avatar={<PublicIcon fontSize='small' />}
            />
          }
          action={
            <IconButton aria-label='settings'>
              <MoreVert />
            </IconButton>
          }
        />
        <CardContent sx={{ padding: 1 }}>
          {values.coverPicture ? (
            <Card elevation={0} variant='outlined'>
              <CardActionArea>
                <CardMedia
                  component='img'
                  height='140'
                  image={values.coverPicture}
                  alt='cover photo'
                />
              </CardActionArea>
              <CardActions>
                <Button
                  size='small'
                  color='primary'
                  aria-label='remove cover photo'
                  onClick={() => setFieldValue('coverPicture', '')}
                >
                  {intl.translate({ id: 'app.remove' })}
                </Button>
              </CardActions>
            </Card>
          ) : (
            <Tooltip title={intl.translate({ id: 'app.add.something' }, { something: transPhoto })}>
              <Button
                sx={{ width: '100%', padding: 0 }}
                value='images'
                variant='outlined'
                aria-label='add cover photo'
                disableRipple
                onClick={() =>
                  showFileManager({
                    iframeSrc: coverPictureFMLink,
                    isOpen: true,
                    selectCallback: handleSelectCallback
                  })
                }
              >
                <Photo style={{ fontSize: 60, color: grey[300] }} />
              </Button>
            </Tooltip>
          )}

          <TextField
            autoFocus={true}
            fullWidth={true}
            id='content'
            label={intl.translate(
              { id: 'feed.whats_in_your_mind.name' },
              { name: userAttributes.name }
            )}
            margin='normal'
            size='small'
            value={values.content}
            variant='outlined'
            onChange={handleChange}
            multiline
            rows={3}
            error={!!errors.content}
            helperText={errors.content ? errors.content : ''}
          />

          <FilledInput
            id='coverPicture'
            readOnly
            value={values.coverPicture}
            onChange={handleChange}
            style={{ display: 'none' }}
          />

          {images.length > 0 && (
            <Box mt={2} mb={1}>
              <Grid container spacing={3}>
                {images.map((file: IFile, index: number) => (
                  <Grid item key={index} lg={4} md={4} sm={6} xs={12}>
                    <FileCard file={file} mainAction='remove' onRemove={handleFileRemove} />
                  </Grid>
                ))}

                <Grid item lg={4} md={4} sm={6} xs={12}>
                  <Tooltip
                    title={intl.translate({ id: 'app.add.something' }, { something: transPhoto })}
                  >
                    <Button
                      style={{ width: '100%', height: '100%' }}
                      variant='outlined'
                      aria-label='add photo'
                      color='primary'
                      onClick={() =>
                        showFileManager({
                          iframeSrc: photoFMLink,
                          isOpen: true,
                          selectCallback: handleFileCallback
                        })
                      }
                    >
                      <AddPhotoAlternate fontSize='large' />
                    </Button>
                  </Tooltip>
                </Grid>
              </Grid>
            </Box>
          )}

          {files.length > 0 && (
            <Box mt={2} mb={1}>
              <Grid container spacing={1}>
                {files.map((file: IFile, index: number) => (
                  <Grid item key={index} xs={12}>
                    <FileCard
                      file={file}
                      layout='horizontal'
                      showFilename
                      mainAction='remove'
                      onRemove={handleFileRemove}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ padding: 1 }}>
          {images.length === 0 && (
            <Button
              aria-label='add photo'
              color='primary'
              onClick={() =>
                showFileManager({
                  iframeSrc: photoFMLink,
                  isOpen: true,
                  selectCallback: handleFileCallback
                })
              }
            >
              {intl.translate({ id: 'app.add.something' }, { something: transPhoto })}
            </Button>
          )}

          <Button
            aria-label='add document'
            onClick={() =>
              showFileManager({
                iframeSrc: docFMLink,
                isOpen: true,
                selectCallback: handleFileCallback
              })
            }
          >
            {intl.translate({ id: 'app.add.something' }, { something: transDoc })}
          </Button>

          <Box sx={{ flexGrow: 1 }} />
          <SaveButton sx={{ marginLeft: 'auto' }} aria-label='save' />
        </CardActions>
      </Card>
    </form>
  );
};

export default connector(NewFeedForm);

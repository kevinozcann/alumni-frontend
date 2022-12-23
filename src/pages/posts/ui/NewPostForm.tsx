import AddPhotoAlternate from '@mui/icons-material/AddPhotoAlternate';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MoreVert from '@mui/icons-material/MoreVert';
import Photo from '@mui/icons-material/Photo';
import PublicIcon from '@mui/icons-material/Public';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import { grey } from '@mui/material/colors';
import FilledInput from '@mui/material/FilledInput';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { useFormik } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FileCard from 'components/FileCard';
import useTranslation from 'hooks/useTranslation';
import { authUserSelector } from 'store/auth';
import { SaveButton } from 'utils/ActionLinks';
import { fileExtension, filenameFromPath, filetypeFromFilename } from 'utils/Helpers';
import { IFile, TActionType } from 'utils/shared-types';

import { IPost } from '../data/post-types';
import { postsAddSelector, postsPhaseSelector } from '../services/posts';
import { postActions } from '../services/actions';

type NewFeedFormProps = {
  actionType: TActionType;
  handleClose?: () => void;
};

const NewFeedForm = (props: NewFeedFormProps) => {
  const { actionType, handleClose } = props;
  const intl = useTranslation();
  const dispatch = useDispatch();

  const user = useSelector(authUserSelector);
  const postsPhase = useSelector(postsPhaseSelector);
  const addFeed = useSelector(postsAddSelector);

  const userAttributes = user.attributes;

  const transPhoto = intl.translate({ id: 'post.photo' });
  const transDoc = intl.translate({ id: 'post.doc' });

  const formValues: IPost = {
    commentsOn: true,
    content: addFeed ? addFeed.content : '',
    coverPicture: addFeed ? addFeed.coverPicture : '',
    files: addFeed ? addFeed.files : [],
    related: addFeed ? addFeed.related : [],
    tags: addFeed ? addFeed.tags : [],
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

  const validateForm = (values: Partial<IPost>) => {
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

  const submitForm = (values: Partial<IPost>) => {
    if (values !== initialValues || addFeed) {
      setStatus('submitted');
      dispatch(postActions.addPost(user.attributes, values));
    }
  };

  React.useEffect(() => {
    setStatus('notSubmitted');
  }, [setStatus]);

  React.useEffect(() => {
    setSubmitting(false);

    if (status === 'submitted' && postsPhase === 'success') {
      handleClose();
    }
  }, [status, postsPhase]);

  // Auto save as draft
  React.useEffect(() => {
    if (values !== initialValues) {
      dispatch(postActions.upsertDraft(values));
    }
  }, [initialValues, values]);

  return (
    <form className='form' noValidate={true} autoComplete='off' onSubmit={handleSubmit}>
      <Card elevation={0}>
        <CardHeader
          sx={{ padding: 1 }}
          avatar={<Avatar alt='username' src={userAttributes.avatarUrl} />}
          title={`${userAttributes.name} ${userAttributes.family_name}`}
          subheader={
            <Chip
              label={intl.translate({ id: 'post.public' })}
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
                // onClick={() =>
                //   showFileManager({
                //     iframeSrc: coverPictureFMLink,
                //     isOpen: true,
                //     selectCallback: handleSelectCallback
                //   })
                // }
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
              { id: 'post.whats_in_your_mind.name' },
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
                      // onClick={() =>
                      //   showFileManager({
                      //     iframeSrc: photoFMLink,
                      //     isOpen: true,
                      //     selectCallback: handleFileCallback
                      //   })
                      // }
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
              // onClick={() =>
              //   showFileManager({
              //     iframeSrc: photoFMLink,
              //     isOpen: true,
              //     selectCallback: handleFileCallback
              //   })
              // }
            >
              {intl.translate({ id: 'app.add.something' }, { something: transPhoto })}
            </Button>
          )}

          <Button
            aria-label='add document'
            // onClick={() =>
            //   showFileManager({
            //     iframeSrc: docFMLink,
            //     isOpen: true,
            //     selectCallback: handleFileCallback
            //   })
            // }
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

export default NewFeedForm;

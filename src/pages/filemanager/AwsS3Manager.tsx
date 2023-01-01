import React from 'react';
import loadable from '@loadable/component';
import {
  S3Client,
  ListObjectsCommand,
  ListObjectsCommandOutput,
  PutObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FileViewer from 'react-file-viewer';
import path from 'path';

import { FullFileBrowser } from './components/external/FullFileBrowser';
import { FileArray, FileData } from './types/file.types';
import { SFMActions } from './action-definitions';
import { useTheme } from '@mui/styles';
import { SFMIconName } from './types/icons.types';
import useFileActionHandler from './hooks/useFileActionHandler';
import useTranslation from 'hooks/useTranslation';
import UploadForm, { TFile } from './forms/UploadForm';
import DownloadIcon from '@mui/icons-material/Download';

const SchoostDialog = loadable(() => import('components/AppDialog'));
const ConfirmDialog = loadable(() => import('components/ConfirmDialog'));

const BUCKET_NAME = 'schoost-files';
const BUCKET_REGION = 'eu-central-1';
const COGNITO_IDENTITY_POOL_ID = 'eu-central-1:d48d9f93-54af-457e-a9ad-784bb8468b51';

const s3Client = new S3Client({
  region: BUCKET_REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: BUCKET_REGION }),
    identityPoolId: COGNITO_IDENTITY_POOL_ID
  })
});

const listFiles = (schoostFiles: FileArray, response: ListObjectsCommandOutput) => {
  const s3Objects = response.Contents;
  const s3Prefixes = response.CommonPrefixes;

  if (s3Objects) {
    s3Objects.forEach((object) => {
      if (object.Key.split('/').pop() !== '') {
        schoostFiles.push({
          id: object.Key,
          name: path.basename(object.Key),
          modDate: object.LastModified,
          size: object.Size,
          ext: object.Key.split('.').pop(),
          fullUrl: `https://s3.${BUCKET_REGION}.amazonaws.com/${BUCKET_NAME}/${encodeURIComponent(
            object.Key
          )}`
        });
      }
    });
  }

  if (s3Prefixes) {
    schoostFiles.push(
      ...s3Prefixes.map(
        (prefix): FileData => ({
          id: prefix.Prefix,
          name: path.basename(prefix.Prefix),
          isDir: true
        })
      )
    );
  }
};

const s3ListObjects = async (bucket: string, prefix: string): Promise<FileArray> => {
  const schoostFiles: FileArray = [];
  const command = new ListObjectsCommand({
    Bucket: bucket,
    Delimiter: '/',
    Prefix: prefix !== '/' ? prefix : ''
  });

  try {
    const response = await s3Client.send(command);
    listFiles(schoostFiles, response);
  } catch (error) {
    console.log(error);
  }

  return schoostFiles;
};

const s3PutObject = async (bucket: string, key: string, body): Promise<FileArray> => {
  const schoostFiles: FileArray = [];
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.log(error);
  }

  return schoostFiles;
};

const s3DeleteObject = async (bucket: string, key: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.log(error);
  }
};

// const s3FileUrl = (bucket: string, key: string): string => {
//   return `https://s3.${BUCKET_REGION}.amazonaws.com/${bucket}/${encodeURIComponent(key)}`;
// };

const AwsS3Manager = () => {
  const theme = useTheme();
  const [error, setError] = React.useState<string | null>(null);
  const [files, setFiles] = React.useState<FileArray>([]);
  const [selectedFile, setSelectedFile] = React.useState<FileData>(null);
  const [file2Open, setFile2Open] = React.useState<FileData>(null);
  const [currentFolder, setCurrentFolder] = React.useState<FileData>();
  const [fileAction, setFileAction] = React.useState<string>(null);
  const [refreshFiles, setRefreshFiles] = React.useState<number>(1);
  const [deletePhase, setDeletePhase] = React.useState<string>(null);
  const intl = useTranslation();

  console.log('selected files', selectedFile);
  // Function to open a file
  const openFile = React.useCallback((file: FileData) => {
    setFile2Open(file);
  }, []);
  // Function to delete files
  const deleteFiles = React.useCallback(() => {
    setDeletePhase(null);
    setFileAction('delete');
  }, []);
  // Function to delete a file
  const deleteFile = React.useCallback((file: FileData) => {
    const key = file?.id || null;
    if (!key) return;

    setDeletePhase('deleting');
    s3DeleteObject(BUCKET_NAME, key)
      .then(() => {
        setRefreshFiles(refreshFiles + 1);
        setFileAction(null);
        //setSelectedFile(null);
      })
      .catch((error) => setError(error.message));
  }, []);
  // Function to create a new folder
  const createFolder = React.useCallback((folderName: string) => {
    const key = `${currentFolder ? currentFolder.id : ''}${folderName}/`;
    s3PutObject(BUCKET_NAME, key, '')
      .then(() => setCurrentFolder({ id: key, name: folderName }))
      .catch((error) => setError(error.message));
  }, []);
  // Function to start uploading a file. this will trigger a modal appear
  const uploadFiles = React.useCallback(() => {
    setFileAction('upload');
  }, []);
  // Function to upload a file
  const uploadFile = React.useCallback((file: TFile) => {
    const key = `${currentFolder ? currentFolder.id : ''}${file.name
      .replace(/\/*$/, '')
      .replace(/\s/g, '_')}`;

    s3PutObject(BUCKET_NAME, key, file)
      .then(() => {
        setRefreshFiles(refreshFiles + 1);
        setFileAction(null);
      })
      .catch((error) => setError(error.message));
  }, []);

  const handleFileAction = useFileActionHandler(
    setSelectedFile,
    setCurrentFolder,
    openFile,
    deleteFiles,
    createFolder,
    uploadFiles
  );

  const fileActions = React.useMemo(
    () => [
      SFMActions.OpenFiles,
      SFMActions.CreateFolder,
      SFMActions.DeleteFiles,
      SFMActions.UploadFiles,
      SFMActions.EnableListView,
      SFMActions.EnableGridView,
      SFMActions.SortFilesByDate,
      SFMActions.SortFilesByName,
      SFMActions.SortFilesBySize,
      SFMActions.ToggleShowFoldersFirst,
      SFMActions.MouseClickFile
    ],
    []
  );

  const folderChain = React.useMemo(() => {
    let folderChain: FileArray = [];

    if (currentFolder && currentFolder.id === '/') {
      folderChain = [];
    } else {
      let currentPrefix = '';
      const currentKey = currentFolder?.id || null;

      if (currentKey) {
        folderChain = currentKey
          .replace(/\/*$/, '')
          .split('/')
          .map((prefixPart) => {
            currentPrefix = currentPrefix ? path.join(currentPrefix, prefixPart) : prefixPart;

            return {
              id: currentPrefix,
              name: prefixPart,
              isDir: true
            };
          });
      }
    }

    folderChain.unshift({
      id: '/',
      name: BUCKET_NAME,
      isDir: true,
      folderChainIcon: SFMIconName.trash
    });

    return folderChain;
  }, [currentFolder]);

  React.useEffect(() => {
    s3ListObjects(BUCKET_NAME, currentFolder?.id || '/')
      .then(setFiles)
      .catch((error) => setError(error.message));
  }, [currentFolder, refreshFiles]);

  // const handleFileAction = React.useCallback(async (data: SFMFileActionData) => {
  //   // Open File
  //   if (data.id === SFMActions.OpenFiles.id) {
  //     let openFile = false;
  //     if (data.payload.files && data.payload.files.length !== 1) {
  //       openFile = true;
  //     }
  //     if (!data.payload.targetFile || !data.payload.targetFile.isDir) {
  //       openFile = true;
  //     }

  //     if (openFile) {
  //       const fileUrl = s3FileUrl(BUCKET_NAME, data.payload.targetFile.id);
  //       setSelectedFile(fileUrl);
  //     } else {
  //       if (!data.payload.targetFile || !data.payload.targetFile.isDir) return;

  //       const newPrefix = `${data.payload.targetFile.id.replace(/\/*$/, '')}/`;
  //       setKeyPrefix(newPrefix);
  //     }
  //   }
  // }, []);

  return (
    <Box sx={{ height: 600 }}>
      {error && <Alert>{error}</Alert>}
      <FullFileBrowser
        darkMode={theme.palette.mode === 'dark'}
        files={files}
        folderChain={folderChain}
        fileActions={fileActions}
        onFileAction={handleFileAction}
      />

      {file2Open && (
        <SchoostDialog
          title={file2Open.name}
          isOpen={!!file2Open}
          dividers={true}
          handleClose={() => setFile2Open(null)}
        >
          <Box sx={{ height: 600 }}>
            <FileViewer fileType={file2Open.ext} filePath={file2Open.fullUrl} />
          </Box>
          <Divider sx={{ mb: 1 }} />
          <Box sx={{ textAlign: 'right' }}>
            <form method='get' action={file2Open.fullUrl}>
              <Button type='submit' variant='contained' startIcon={<DownloadIcon />}>
                {intl.translate({ id: 'filemanager.actions.download_files.button.name' })}
              </Button>
            </form>
          </Box>
        </SchoostDialog>
      )}

      {fileAction === 'upload' && (
        <SchoostDialog
          width={250}
          title={intl.translate({ id: 'filemanager.actions.upload_files.button.name' })}
          isOpen={true}
          dividers={true}
          handleClose={() => setFileAction(null)}
        >
          <UploadForm uploadFunction={uploadFile} />
        </SchoostDialog>
      )}

      {fileAction === 'delete' && (
        <ConfirmDialog
          intro={intl.formatMessage({ id: 'app.confirm_delete_name' }, { name: selectedFile.name })}
          isOpen={true}
          handleConfirm={() => deleteFile(selectedFile)}
          handleClose={() => setFileAction(null)}
          phase={deletePhase}
        />
      )}
    </Box>
  );
};

export default AwsS3Manager;

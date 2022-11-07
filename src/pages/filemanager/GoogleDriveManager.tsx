import React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { gapi } from 'gapi-script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons';

import { FullFileBrowser } from './components/external/FullFileBrowser';
import { SFMIconName } from './types/icons.types';
import { FileArray } from './types/file.types';

// Client ID and API key from the Developer Console
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_DRIVE_API_KEY;

// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

const GoogleDriveManager = () => {
  // const [listDocumentsVisible, setListDocumentsVisibility] = React.useState<boolean>(false);
  const [documents, setDocuments] = React.useState([]);
  // const [isLoadingGoogleDriveApi, setIsLoadingGoogleDriveApi] = React.useState<boolean>(false);
  // const [isFetchingGoogleDriveFiles, setIsFetchingGoogleDriveFiles] =
  React.useState<boolean>(false);
  const [signedInUser, setSignedInUser] = React.useState<Record<string, any>>();
  const [error, setError] = React.useState<string>(null);

  const listFiles = (searchTerm = null) => {
    // setIsFetchingGoogleDriveFiles(true);
    gapi.client.drive.files
      .list({
        pageSize: 10,
        fields: 'nextPageToken, files(*)',
        q: searchTerm
      })
      .then(
        function (response) {
          // setIsFetchingGoogleDriveFiles(false);
          // setListDocumentsVisibility(true);
          const res = JSON.parse(response.body);
          setDocuments(res.files);
        },
        function (error) {
          setError(error.message);
        }
      );
  };

  const handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const updateSigninStatus = (isSignedIn: boolean) => {
    if (isSignedIn) {
      // Set the signed in user
      // setSignedInUser(gapi.auth2.getAuthInstance().currentUser.le.wt);
      setSignedInUser(gapi.auth2.getAuthInstance().currentUser.le.wt);
      // setIsLoadingGoogleDriveApi(false);
      // list files if user is authenticated
      listFiles();
    } else {
      // prompt user to sign in
      handleAuthClick();
    }
  };

  const handleSignOutClick = () => {
    // setListDocumentsVisibility(false);
    gapi.auth2.getAuthInstance().signOut();
  };

  const initClient = () => {
    // setIsLoadingGoogleDriveApi(true);
    gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      })
      .then(
        function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        },
        function (error) {
          appendPre(JSON.stringify(error, null, 2));
        }
      );
  };

  function appendPre(message: string) {
    setError(message);
  }

  const handleClientLoad = () => {
    gapi.load('client:auth2', initClient);
  };

  const folderChain: FileArray = [
    {
      id: 'zxc',
      name: 'Bucket',
      isDir: true,
      folderChainIcon: SFMIconName.trash
    }
  ];

  return (
    <Box sx={{ height: 600 }}>
      {error && <Alert>{error}</Alert>}

      <Grid container>
        <Grid item>
          <div onClick={() => handleClientLoad()} className='source-container'>
            <div className='icon-container'>
              <div className='icon icon-success'>
                <FontAwesomeIcon icon={faGoogleDrive} />
              </div>
            </div>
            <div className='content-container'>
              <p className='title'>Google Drive</p>
              <span className='content'>Import documents straight from your google drive</span>
            </div>
          </div>
        </Grid>

        <Grid container>
          <Grid item>
            {signedInUser && (
              <div style={{ marginBottom: 20 }}>
                {/* @ts-ignore */}
                <p>Signed In as: {`${signedInUser?.Ad}`}</p>
                <Button onClick={handleSignOutClick}>Sign Out</Button>
              </div>
            )}

            <FullFileBrowser files={documents} folderChain={folderChain} />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GoogleDriveManager;

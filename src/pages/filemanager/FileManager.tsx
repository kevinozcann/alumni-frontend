import React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import ComingSoon from 'components/ComingSoon';

import AwsS3Manager from './AwsS3Manager';
import GoogleDriveManager from './GoogleDriveManager';

type TFileManagerProps = {
  iframeSrc?: string;
};

const FileManager = (props: TFileManagerProps) => {
  const { iframeSrc } = props;
  const [activeTab, setActiveTab] = React.useState<string>('legacy');

  const domain = new URLSearchParams((window && window.location.hostname) || '');
  const showAwsS3 =
    domain.has('test.schoost.com') || domain.has('demo.schoost.com') || domain.has('localhost');
  const showGoogleDrive =
    domain.has('test.schoost.com') || domain.has('demo.schoost.com') || domain.has('localhost');

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor='primary'
        textColor='primary'
        scrollButtons='auto'
        variant='scrollable'
        aria-label='page tabs'
      >
        <Tab value='legacy' label='FILE MANAGER' aria-controls='legacy' />
        <Tab value='awsS3' label='AWS S3' aria-controls='awsS3' />
        <Tab value='googleDrive' label='GOOGLE DRIVE' aria-controls='googleDrive' />
      </Tabs>

      <Divider sx={{ mb: 1 }} />

      <Box sx={{ height: 610 }}>
        {activeTab === 'legacy' && (
          <iframe
            title='SmartClass File Manager'
            id='schoostFrame'
            width='100%'
            height='600px'
            frameBorder='0'
            src={iframeSrc}
          />
        )}

        {activeTab === 'awsS3' && ((showAwsS3 && <AwsS3Manager />) || <ComingSoon />)}

        {activeTab === 'googleDrive' &&
          ((showGoogleDrive && <GoogleDriveManager />) || <ComingSoon />)}
      </Box>
    </Box>
  );
};

export default FileManager;

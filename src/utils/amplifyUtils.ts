import { Amplify, Storage } from 'aws-amplify';

import awsconfig from 'aws-exports';

Amplify.configure(awsconfig);

export const getS3File = async (filename: string) => {
  return await Storage.get(filename, {
    level: 'private'
  });
};

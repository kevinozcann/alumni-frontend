import { Amplify, Storage } from 'aws-amplify';

import awsconfig from 'aws-exports';

Amplify.configure(awsconfig);

export function* getS3File(filename: string) {
  return yield Storage.get(filename, {
    level: 'private',
    expires: 24 * 60 * 60
  });
}

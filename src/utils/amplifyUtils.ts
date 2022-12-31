import { Storage } from 'aws-amplify';

export function* getS3File(filename: string, level: any) {
  return yield Storage.get(filename, {
    level: level || 'public',
    expires: 24 * 60 * 60 // a day
  });
}

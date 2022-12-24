import axios from 'axios';

export function* getSchool(url: string) {
  const { data: school } = yield axios.get(url);

  return school;
}

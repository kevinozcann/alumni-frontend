import axios from 'axios';

const fetcher = async (url: string, hydra = false) => {
  const response = await axios.get(url);

  return hydra ? response.data['hydra:member'] : response.data;
};

export default fetcher;

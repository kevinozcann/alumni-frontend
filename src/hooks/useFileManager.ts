import { useContext } from 'react';
import FileManagerContext from '../contexts/FMModalContext';

const useFileManager = () => useContext(FileManagerContext);

export default useFileManager;

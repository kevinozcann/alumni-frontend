import React from 'react';
import { SFMActions } from '../action-definitions';
import { CustomFileData } from '../extensions/file-map';
import { MapFileActionsToData } from '../types/action-handler.types';
import { SFMActionUnion } from '../types/file-browser.types';
import { FileData } from '../types/file.types';
import { FileHelper } from '../util/file-helper';

type SFMFileActionData = MapFileActionsToData<SFMActionUnion>;

export const useFileActionHandler = (
  setSelectedFile: (file: FileData) => void,
  setCurrentFolder: (folder: FileData) => void,
  openFile: (file: FileData) => void,
  deleteFiles: (files: CustomFileData[]) => void,
  createFolder: (folderName: string) => void,
  uploadFiles: () => void,
  moveFiles?: (files: FileData[], source: FileData, destination: FileData) => void
) => {
  return React.useCallback(
    (data: SFMFileActionData) => {
      if (data.id === SFMActions.MouseClickFile.id) {
        const { file } = data.payload;
        setSelectedFile(file);
      } else if (data.id === SFMActions.OpenFiles.id) {
        const { targetFile, files } = data.payload;
        const fileToOpen = targetFile ?? files[0];
        if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
          setCurrentFolder(fileToOpen);
        } else {
          openFile(fileToOpen);
        }
      } else if (data.id === SFMActions.DeleteFiles.id) {
        deleteFiles(data.state.selectedFilesForAction);
      } else if (data.id === SFMActions.MoveFiles.id) {
        moveFiles(data.payload.files, data.payload.source, data.payload.destination);
      } else if (data.id === SFMActions.CreateFolder.id) {
        const folderName = prompt('Provide the name for your new folder:');
        if (folderName) createFolder(folderName);
      } else if (data.id === SFMActions.UploadFiles.id) {
        uploadFiles();
      }

      // showActionNotification(data);
    },
    [setSelectedFile, setCurrentFolder, createFolder, deleteFiles, moveFiles, openFile, uploadFiles]
  );
};

export default useFileActionHandler;

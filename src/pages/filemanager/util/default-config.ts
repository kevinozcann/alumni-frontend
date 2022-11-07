import { SFMActions } from '../action-definitions/index';
import { FileBrowserProps } from '../types/file-browser.types';
import { FileManagerIcons } from './filemanagerIcons';

export type SFMConfig = Pick<
  FileBrowserProps,
  | 'fileActions'
  | 'onFileAction'
  | 'thumbnailGenerator'
  | 'doubleClickDelay'
  | 'disableSelection'
  | 'disableMultipleSelection'
  | 'disableDefaultFileActions'
  | 'disableDragAndDrop'
  | 'disableDragAndDropProvider'
  | 'defaultSortActionId'
  | 'defaultFileViewActionId'
  | 'clearSelectionOnOutsideClick'
  | 'iconComponent'
  | 'darkMode'
  | 'i18n'
>;

export const defaultConfig: SFMConfig = {
  fileActions: null,
  onFileAction: null,
  thumbnailGenerator: null,
  doubleClickDelay: 300,
  disableSelection: false,
  disableMultipleSelection: true,
  disableDefaultFileActions: true,
  disableDragAndDrop: false,
  disableDragAndDropProvider: false,
  defaultSortActionId: SFMActions.SortFilesByName.id,
  defaultFileViewActionId: SFMActions.EnableGridView.id,
  clearSelectionOnOutsideClick: true,
  iconComponent: FileManagerIcons,
  darkMode: false,
  i18n: {}
};

export const setSFMDefaults = (config: Partial<SFMConfig>) => {
  for (const key of Object.keys(defaultConfig)) {
    if (key in config) {
      //@ts-ignore
      defaultConfig[key as keyof SFMConfig] = config[key as keyof SFMConfig] as any;
    }
    debugger;
  }
};

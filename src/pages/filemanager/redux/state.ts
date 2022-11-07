import shortid from 'shortid';
import { FileViewMode } from '../types/file-view.types';
import { IFileManagerState } from '../types/redux.types';
import { SortOrder } from '../types/sort.types';

const instanceId = shortid.generate();

export const initialFileManagerState: IFileManagerState = {
  instanceId: instanceId,

  externalFileActionHandler: null,

  rawFileActions: [],
  fileActionsErrorMessages: [],
  fileActionMap: {},
  fileActionIds: [],
  toolbarItems: [],
  contextMenuItems: [],

  rawFolderChain: null,
  folderChainErrorMessages: [],
  folderChain: [],

  rawFiles: [],
  filesErrorMessages: [],
  fileMap: {},
  fileIds: [],
  cleanFileIds: [],

  sortedFileIds: [],
  hiddenFileIdMap: {},

  focusSearchInput: null,
  searchString: '',
  searchMode: 'currentFolder',

  selectionMap: {},
  disableSelection: false,

  fileViewConfig: {
    mode: FileViewMode.Grid,
    entryWidth: 165,
    entryHeight: 130
  },

  sortActionId: null,
  sortOrder: SortOrder.ASC,

  optionMap: {},

  thumbnailGenerator: null,
  doubleClickDelay: 300,
  disableDragAndDrop: false,
  clearSelectionOnOutsideClick: true,

  lastClick: null,

  contextMenuMounted: false,
  contextMenuConfig: null
};

import { sort } from 'fast-sort';
import FuzzySearch from 'fuzzy-search';
import { Nilable, Nullable } from 'tsdef';

import { createSelector } from '@reduxjs/toolkit';

import { OptionIds } from '../action-definitions/option-ids';
import { FileArray, FileData, FileFilter } from '../types/file.types';
import { FileSortKeySelector, SortOrder } from '../types/sort.types';
import { FileHelper } from '../util/file-helper';
import { RootState } from 'store/store';

// Raw selectors
export const selectInstanceId = (state: RootState) =>
  state?.filemanager?.instanceId || state.instanceId;
export const selectExternalFileActionHandler = (state: RootState) =>
  state?.filemanager?.externalFileActionHandler || state.externalFileActionHandler;

export const selectFileActionMap = (state: RootState) =>
  state?.filemanager?.fileActionMap || state.fileActionMap;
export const selectFileActionIds = (state: RootState) =>
  state?.filemanager?.fileActionIds || state.fileActionIds;
export const selectFileActionData = (fileActionId: string) => (state: RootState) =>
  selectFileActionMap(state)[fileActionId];
export const selectToolbarItems = (state: RootState) =>
  state?.filemanager?.toolbarItems || state.toolbarItems;
export const selectContextMenuItems = (state: RootState) =>
  state?.filemanager?.contextMenuItems || state.contextMenuItems;

export const selectFolderChain = (state: RootState) =>
  state?.filemanager?.folderChain || state.folderChain;
export const selectCurrentFolder = (state: RootState) => {
  const folderChain = selectFolderChain(state);
  const currentFolder = folderChain.length > 0 ? folderChain[folderChain.length - 1] : null;
  return currentFolder;
};
export const selectParentFolder = (state: RootState) => {
  const folderChain = selectFolderChain(state);
  const parentFolder = folderChain.length > 1 ? folderChain[folderChain.length - 2] : null;
  return parentFolder;
};

export const selectRawFiles = (state: RootState) => state?.filemanager?.rawFiles || state.rawFiles;
export const selectFileMap = (state: RootState) => state?.filemanager?.fileMap || state.fileMap;
export const selectCleanFileIds = (state: RootState) =>
  state?.filemanager?.cleanFileIds || state.cleanFileIds;
export const selectFileData = (fileId: Nullable<string>) => (state: RootState) =>
  fileId ? selectFileMap(state)[fileId] : null;

export const selectHiddenFileIdMap = (state: RootState) =>
  state?.filemanager?.hiddenFileIdMap || state.hiddenFileIdMap;
export const selectHiddenFileCount = (state: RootState) =>
  Object.keys(selectHiddenFileIdMap(state))?.length || 0;

export const selectFocusSearchInput = (state: RootState) =>
  state?.filemanager?.focusSearchInput || state.focusSearchInput;
export const selectSearchString = (state: RootState) =>
  state?.filemanager?.searchString || state.searchString;

export const selectSelectionMap = (state: RootState) =>
  state?.filemanager?.selectionMap || state.selectionMap;
export const selectSelectedFileIds = (state: RootState) => Object.keys(selectSelectionMap(state));
export const selectSelectionSize = (state: RootState) => selectSelectedFileIds(state).length;
export const selectIsFileSelected = (fileId: Nullable<string>) => (state: RootState) =>
  !!fileId && !!selectSelectionMap(state)[fileId];
export const selectSelectedFiles = (state: RootState) => {
  const fileMap = selectFileMap(state);
  return Object.keys(selectSelectionMap(state)).map((id) => fileMap[id]);
};
export const selectSelectedFilesForAction = (fileActionId: string) => (state: RootState) => {
  const fileActionMap = state?.filemanager?.fileActionMap || state.fileActionMap;
  const action = fileActionMap[fileActionId];
  if (!action || !action.requiresSelection) return undefined;

  return getSelectedFiles(state, action.fileFilter);
};
export const selectSelectedFilesForActionCount = (fileActionId: string) => (state: RootState) =>
  getSelectedFilesForAction(state, fileActionId)?.length;

export const selectDisableSelection = (state: RootState) =>
  state?.filemanager?.disableSelection || state.disableSelection;

export const selectDisableMultipleSelection = (state: RootState) =>
  state?.filemanager?.disableMultipleSelection || state.disableMultipleSelection;

export const selectFileViewConfig = (state: RootState) =>
  state?.filemanager?.fileViewConfig || state.fileViewConfig;

export const selectSortActionId = (state: RootState) =>
  state?.filemanager?.sortActionId || state.sortActionId;
export const selectSortOrder = (state: RootState) =>
  state?.filemanager?.sortOrder || state.sortOrder;

export const selectOptionMap = (state: RootState) =>
  state?.filemanager?.optionMap || state.optionMap;
export const selectOptionValue = (optionId: string) => (state: RootState) =>
  selectOptionMap(state)[optionId];

export const selectThumbnailGenerator = (state: RootState) =>
  state?.filemanager?.thumbnailGenerator || state.thumbnailGenerator;
export const selectDoubleClickDelay = (state: RootState) =>
  state?.filemanager?.doubleClickDelay || state.doubleClickDelay;
export const selectIsDnDDisabled = (state: RootState) =>
  state?.filemanager?.disableDragAndDrop || state.disableDragAndDrop;
export const selectClearSelectionOnOutsideClick = (state: RootState) =>
  state?.filemanager?.clearSelectionOnOutsideClick || state.clearSelectionOnOutsideClick;

export const selectContextMenuMounted = (state: RootState) =>
  state?.filemanager?.contextMenuMounted || state.contextMenuMounted;
export const selectContextMenuConfig = (state: RootState) =>
  state?.filemanager?.contextMenuConfig || state.contextMenuConfig;
export const selectContextMenuTriggerFile = (state: RootState) => {
  const config = selectContextMenuConfig(state);
  if (!config || !config.triggerFileId) return null;
  const fileMap = selectFileMap(state);
  return fileMap[config.triggerFileId] ?? null;
};

// Raw selectors
const getFileActionMap = (state: RootState) =>
  state?.filemanager?.fileActionMap || state.fileActionMap;
const getOptionMap = (state: RootState) => state?.filemanager?.optionMap || state.optionMap;
const getFileMap = (state: RootState) => state?.filemanager?.fileMap || state.fileMap;
const getFileIds = (state: RootState) => state?.filemanager?.fileIds || state.fileIds;
const getCleanFileIds = (state: RootState) =>
  state?.filemanager?.cleanFileIds || state.cleanFileIds;
const getSortActionId = (state: RootState) =>
  state?.filemanager?.sortActionId || state.sortActionId;
const getSortOrder = (state: RootState) => state?.filemanager?.sortOrder || state.sortOrder;
const getSearchString = (state: RootState) =>
  state?.filemanager?.searchString || state.searchString;
const _getLastClick = (state: RootState) => state?.filemanager?.lastClick || state.lastClick;

// Memoized selectors
const makeGetAction = (fileActionSelector: (state: RootState) => Nullable<string>) =>
  createSelector([getFileActionMap, fileActionSelector], (fileActionMap, fileActionId) =>
    fileActionId && fileActionMap[fileActionId] ? fileActionMap[fileActionId] : null
  );
const makeGetOptionValue = (optionId: string, defaultValue: any = undefined) =>
  createSelector([getOptionMap], (optionMap) => {
    const value = optionMap[optionId];
    if (value === undefined) {
      return defaultValue;
    }
    return value;
  });
const makeGetFiles = (fileIdsSelector: (state: RootState) => Nullable<string>[]) =>
  createSelector(
    [getFileMap, fileIdsSelector],
    (fileMap, fileIds): FileArray =>
      fileIds.map((fileId) => (fileId && fileMap[fileId] ? fileMap[fileId] : null))
  );
const getSortedFileIds = createSelector(
  [
    getFileIds,
    getSortOrder,
    makeGetFiles(getFileIds),
    makeGetAction(getSortActionId),
    makeGetOptionValue(OptionIds.ShowFoldersFirst, false)
  ],
  (fileIds, sortOrder, files, sortAction, showFolderFirst) => {
    if (!sortAction) {
      // We allow users to set the sort action ID to `null` if they want to use their
      // own sorting mechanisms instead of relying on SFM built-in sort.
      return fileIds;
    }

    const prepareSortKeySelector = (selector: FileSortKeySelector) => (file: Nullable<FileData>) =>
      selector(file);

    const sortFunctions: {
      asc?: (file: FileData) => any;
      desc?: (file: FileData) => any;
    }[] = [];

    if (showFolderFirst) {
      // If option is undefined (relevant actions is not enabled), we don't show
      // folders first.
      sortFunctions.push({
        desc: prepareSortKeySelector(FileHelper.isDirectory)
      });
    }
    if (sortAction.sortKeySelector) {
      const configKeyName = sortOrder === SortOrder.ASC ? 'asc' : 'desc';
      sortFunctions.push({
        [configKeyName]: prepareSortKeySelector(sortAction.sortKeySelector)
      });
    }
    if (sortFunctions.length === 0) return fileIds;

    // We copy the array because `fast-sort` mutates it
    const sortedFileIds = sort([...files])
      .by(sortFunctions as any)
      .map((file) => (file ? file.id : null));
    return sortedFileIds;
  }
);
const getSearcher = createSelector(
  [makeGetFiles(getCleanFileIds)],
  (cleanFiles) => new FuzzySearch(cleanFiles as FileData[], ['name'], { caseSensitive: false })
);
const getSearchFilteredFileIds = createSelector(
  [getCleanFileIds, getSearchString, getSearcher],
  (cleanFileIds, searchString, searcher) =>
    searchString ? searcher.search(searchString).map((f) => f.id) : cleanFileIds
);
const getHiddenFileIdMap = createSelector(
  [
    getSearchFilteredFileIds,
    makeGetFiles(getCleanFileIds),
    makeGetOptionValue(OptionIds.ShowHiddenFiles)
  ],
  (searchFilteredFileIds, cleanFiles, showHiddenFiles) => {
    const searchFilteredFileIdsSet = new Set(searchFilteredFileIds);
    const hiddenFileIdMap: any = {};
    cleanFiles.forEach((file) => {
      if (!file) return;
      else if (!searchFilteredFileIdsSet.has(file.id)) {
        // Hidden by seach
        hiddenFileIdMap[file.id] = true;
      } else if (!showHiddenFiles && FileHelper.isHidden(file)) {
        // Hidden by options
        hiddenFileIdMap[file.id] = true;
      }
    });
    return hiddenFileIdMap;
  }
);
const getDisplayFileIds = createSelector(
  [getSortedFileIds, getHiddenFileIdMap],
  /** Returns files that will actually be shown to the user. */
  (sortedFileIds, hiddenFileIdMap) => sortedFileIds.filter((id) => !id || !hiddenFileIdMap[id])
);
const getLastClickIndex = createSelector(
  [_getLastClick, getSortedFileIds],
  /** Returns the last click index after ensuring it is actually still valid. */
  (lastClick, displayFileIds) => {
    if (
      !lastClick ||
      lastClick.index > displayFileIds.length - 1 ||
      lastClick.fileId != displayFileIds[lastClick.index]
    ) {
      return null;
    }
    return lastClick.index;
  }
);

export const selectors = {
  // Raw selectors
  getFileActionMap,
  getOptionMap,
  getFileMap,
  getFileIds,
  getCleanFileIds,
  getSortActionId,
  getSortOrder,
  getSearchString,
  _getLastClick,

  // Memoized selectors
  getSortedFileIds,
  getSearcher,
  getSearchFilteredFileIds,
  getHiddenFileIdMap,
  getDisplayFileIds,
  getLastClickIndex,

  // Parametrized selectors
  makeGetAction,
  makeGetOptionValue,
  makeGetFiles
};

// Selectors meant to be used outside of Redux code
export const getFileData = (state: RootState, fileId: Nullable<string>) =>
  fileId ? selectFileMap(state)[fileId] : null;
export const getIsFileSelected = (state: RootState, file: FileData) => {
  // !!! We deliberately don't use `FileHelper.isSelectable` here as we want to
  //     reflect the state of Redux store accurately.
  return !!selectSelectionMap(state)[file.id];
};
export const getSelectedFiles = (state: RootState, ...filters: Nilable<FileFilter>[]) => {
  const fileMap = state?.filemanager?.fileMap || state.fileMap;
  const selectionMap = state?.filemanager?.selectionMap || state.selectionMap;

  const selectedFiles = Object.keys(selectionMap).map((id) => fileMap[id]);
  const filteredSelectedFiles = filters.reduce(
    (prevFiles, filter) => (filter ? prevFiles.filter(filter) : prevFiles),
    selectedFiles
  );
  return filteredSelectedFiles;
};
export const getSelectedFilesForAction = (state: RootState, fileActionId: string) =>
  selectSelectedFilesForAction(fileActionId)(state);

import { Nilable, Nullable } from 'tsdef';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GenericFileActionHandler } from '../types/action-handler.types';
import { FileActionMenuItem } from '../types/action-menus.types';
import { FileAction, FileActionMap } from '../types/action.types';
import { ContextMenuConfig } from '../types/context-menu.types';
import { FileViewConfig } from '../types/file-view.types';
import { FileArray, FileIdTrueMap, FileMap } from '../types/file.types';
import { OptionMap } from '../types/options.types';
import { IFileManagerState } from '../types/redux.types';
import { SortOrder } from '../types/sort.types';
import { ThumbnailGenerator } from '../types/thumbnails.types';
import { FileHelper } from '../util/file-helper';
import { sanitizeInputArray } from './files-transforms';
import { initialFileManagerState } from './state';

const reducers = {
  setExternalFileActionHandler(
    state: IFileManagerState,
    action: PayloadAction<Nilable<GenericFileActionHandler<FileAction>>>
  ) {
    state.externalFileActionHandler = action.payload ?? null;
  },
  setRawFileActions(state: IFileManagerState, action: PayloadAction<FileAction[] | any>) {
    state.rawFileActions = action.payload;
  },
  setFileActionsErrorMessages(state: IFileManagerState, action: PayloadAction<string[]>) {
    state.fileActionsErrorMessages = action.payload;
  },
  setFileActions(state: IFileManagerState, action: PayloadAction<FileAction[]>) {
    const fileActionMap: FileActionMap = {};
    action.payload.map((a) => (fileActionMap[a.id] = a));
    const fileIds = action.payload.map((a) => a.id);

    state.fileActionMap = fileActionMap as FileMap;
    state.fileActionIds = fileIds;
  },
  updateFileActionMenuItems(
    state: IFileManagerState,
    action: PayloadAction<[FileActionMenuItem[], FileActionMenuItem[]]>
  ) {
    [state.toolbarItems, state.contextMenuItems] = action.payload;
  },
  setRawFolderChain(state: IFileManagerState, action: PayloadAction<FileArray | any>) {
    const rawFolderChain = action.payload;
    const { sanitizedArray: folderChain, errorMessages } = sanitizeInputArray(
      'folderChain',
      rawFolderChain
    );
    state.rawFolderChain = rawFolderChain;
    state.folderChain = folderChain;
    state.folderChainErrorMessages = errorMessages;
  },
  setRawFiles(state: IFileManagerState, action: PayloadAction<FileArray | any>) {
    const rawFiles = action.payload;
    const { sanitizedArray: files, errorMessages } = sanitizeInputArray('files', rawFiles);
    state.rawFiles = rawFiles;
    state.filesErrorMessages = errorMessages;

    const fileMap: FileMap = {};
    files.forEach((f) => {
      if (f) fileMap[f.id] = f;
    });
    const fileIds = files.map((f) => (f ? f.id : null));
    const cleanFileIds = fileIds.filter((f) => !!f) as string[];

    state.fileMap = fileMap;
    state.fileIds = fileIds;
    state.cleanFileIds = cleanFileIds;

    // Cleanup selection
    for (const selectedFileId of Object.keys(state.selectionMap)) {
      if (!fileMap[selectedFileId]) {
        delete state.selectionMap[selectedFileId];
      }
    }
  },
  setSortedFileIds(state: IFileManagerState, action: PayloadAction<Nullable<string>[]>) {
    state.sortedFileIds = action.payload;
  },
  setHiddenFileIds(state: IFileManagerState, action: PayloadAction<FileIdTrueMap>) {
    state.hiddenFileIdMap = action.payload;

    // Cleanup selection
    for (const selectedFileId of Object.keys(state.selectionMap)) {
      if (state.hiddenFileIdMap[selectedFileId]) {
        delete state.selectionMap[selectedFileId];
      }
    }
  },
  setFocusSearchInput(state: IFileManagerState, action: PayloadAction<Nullable<() => void>>) {
    state.focusSearchInput = action.payload;
  },
  setSearchString(state: IFileManagerState, action: PayloadAction<string>) {
    state.searchString = action.payload;
  },
  selectAllFiles(state: IFileManagerState) {
    state.fileIds
      .filter((id) => id && FileHelper.isSelectable(state.fileMap[id]))
      .map((id) => (id ? (state.selectionMap[id] = true) : null));
  },
  selectFiles(
    state: IFileManagerState,
    action: PayloadAction<{ fileIds: string[]; reset: boolean }>
  ) {
    if (state.disableSelection) return;
    if (action.payload.reset) state.selectionMap = {};
    action.payload.fileIds
      .filter((id) => id && FileHelper.isSelectable(state.fileMap[id]))
      .map((id) => (state.selectionMap[id] = true));
  },
  toggleSelection(
    state: IFileManagerState,
    action: PayloadAction<{ fileId: string; exclusive: boolean }>
  ) {
    if (state.disableSelection) return;
    const oldValue = !!state.selectionMap[action.payload.fileId];
    if (action.payload.exclusive) state.selectionMap = {};
    if (oldValue) delete state.selectionMap[action.payload.fileId];
    else if (FileHelper.isSelectable(state.fileMap[action.payload.fileId])) {
      state.selectionMap[action.payload.fileId] = true;
    }
  },
  clearSelection(state: IFileManagerState) {
    if (state.disableSelection) return;
    if (Object.keys(state.selectionMap).length !== 0) state.selectionMap = {};
  },
  setSelectionDisabled(state: IFileManagerState, action: PayloadAction<boolean>) {
    state.disableSelection = action.payload;
    if (Object.keys(state.selectionMap).length !== 0) state.selectionMap = {};
  },
  setFileViewConfig(state: IFileManagerState, action: PayloadAction<FileViewConfig>) {
    state.fileViewConfig = action.payload;
  },
  setSort(state: IFileManagerState, action: PayloadAction<{ actionId: string; order: SortOrder }>) {
    state.sortActionId = action.payload.actionId;
    state.sortOrder = action.payload.order;
  },
  setOptionDefaults(state: IFileManagerState, action: PayloadAction<OptionMap>) {
    for (const optionId of Object.keys(action.payload)) {
      if (optionId in state.optionMap) continue;
      state.optionMap[optionId] = action.payload[optionId];
    }
  },
  toggleOption(state: IFileManagerState, action: PayloadAction<string>) {
    state.optionMap[action.payload] = !state.optionMap[action.payload];
  },
  setThumbnailGenerator(
    state: IFileManagerState,
    action: PayloadAction<Nullable<ThumbnailGenerator>>
  ) {
    state.thumbnailGenerator = action.payload;
  },
  setDoubleClickDelay(state: IFileManagerState, action: PayloadAction<number>) {
    state.doubleClickDelay = action.payload;
  },
  setDisableDragAndDrop(state: IFileManagerState, action: PayloadAction<boolean>) {
    state.disableDragAndDrop = action.payload;
  },
  setClearSelectionOnOutsideClick(state: IFileManagerState, action: PayloadAction<boolean>) {
    state.clearSelectionOnOutsideClick = action.payload;
  },
  setLastClickIndex(
    state: IFileManagerState,
    action: PayloadAction<Nullable<{ index: number; fileId: string }>>
  ) {
    state.lastClick = action.payload;
  },
  setContextMenuMounted(state: IFileManagerState, action: PayloadAction<boolean>) {
    state.contextMenuMounted = action.payload;
  },
  showContextMenu(state: IFileManagerState, action: PayloadAction<ContextMenuConfig>) {
    state.contextMenuConfig = action.payload;
  },
  hideContextMenu(state: IFileManagerState) {
    if (!state.contextMenuConfig) return;
    state.contextMenuConfig = null;
  }
};

export const { actions: reduxActions, reducer: filemanagerReducer } = createSlice({
  name: 'filemanager',
  initialState: initialFileManagerState,
  reducers
});

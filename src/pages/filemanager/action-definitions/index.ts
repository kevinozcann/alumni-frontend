import { DefaultActions } from './default';
import { EssentialActions } from './essential';
import { ExtraActions } from './extra';

export { OptionIds } from './option-ids';

export const SFMActions = {
  ...EssentialActions,
  ...DefaultActions,
  ...ExtraActions
};

export const EssentialFileActions = [
  SFMActions.MouseClickFile,
  SFMActions.KeyboardClickFile,
  SFMActions.StartDragNDrop,
  SFMActions.EndDragNDrop,
  SFMActions.MoveFiles,
  SFMActions.ChangeSelection,
  SFMActions.OpenFiles,
  SFMActions.OpenParentFolder,
  SFMActions.OpenFileContextMenu
];

export const DefaultFileActions = [
  SFMActions.OpenSelection,
  SFMActions.SelectAllFiles,
  SFMActions.ClearSelection,
  SFMActions.EnableListView,
  SFMActions.EnableGridView,
  SFMActions.SortFilesByName,
  SFMActions.SortFilesBySize,
  SFMActions.SortFilesByDate,
  SFMActions.ToggleHiddenFiles,
  SFMActions.ToggleShowFoldersFirst,
  SFMActions.FocusSearchInput
];

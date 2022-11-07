import { SFMThunk } from '../../types/redux.types';
import { FileHelper } from '../../util/file-helper';
import { reduxActions } from '../reducers';
import { selectors } from '../selectors';

export const reduxThunks = {
  selectRange:
    (params: { rangeStart: number; rangeEnd: number; reset?: boolean }): SFMThunk =>
    (dispatch, getState) => {
      //@ts-ignore
      const { filemanager } = getState();
      if (filemanager.disableSelection) return;

      const displayFileIds = selectors.getDisplayFileIds(filemanager);
      const fileIdsToSelect = displayFileIds
        .slice(params.rangeStart, params.rangeEnd + 1)
        .filter((id) => id && FileHelper.isSelectable(filemanager.fileMap[id])) as string[];
      dispatch(
        reduxActions.selectFiles({
          fileIds: fileIdsToSelect,
          reset: !!params.reset
        })
      );
    }
};

// import { DragObjectWithType } from 'react-dnd';
import { Nilable } from 'tsdef';

import { StartDragNDropPayload } from './action-payloads.types';
import { FileData } from './file.types';

export interface SFMDndDropResult {
  dropTarget: Nilable<FileData> | any;
  dropEffect: 'move' | 'copy';
}

export type SFMDndFileEntryItem = {
  type: string;
  payload: StartDragNDropPayload;
};
export const SFMDndFileEntryType = 'dnd-sFM-file-entry';

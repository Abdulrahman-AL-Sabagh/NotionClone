import { ContentElement } from './content-element';
import { TextElement } from './text-element';
import { ImageElement } from './image-element';

export interface EditorModel {
  optionsVisible: boolean;
  content: Array<ImageElement | TextElement>;
  slashAppeardAt: string;
  dropdownIsFocused: boolean;
  enterClickedAt: string;
  selection: Selection | null;
  focusedElementId: string;
  floatingToolbar: {
    isFocused: boolean;
    isVisible: boolean;
    top: number;
    left: number;
    boldIsActive: boolean;
    italicIsActive: boolean;
    lineThroughIsActive: boolean;
  };
}

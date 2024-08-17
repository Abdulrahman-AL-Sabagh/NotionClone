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
  floatingToolbar: {
    isVisible: boolean;
    top: number;
    left: number;
  };
}

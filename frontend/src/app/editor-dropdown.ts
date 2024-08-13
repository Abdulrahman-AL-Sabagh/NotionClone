import { BehaviorSubject } from 'rxjs';
import { EditorModel } from './editor-model';

export interface EditorDropdown {
  imageSrc?: string;
  handler: () => void;
  name: string;
  descirption?: string;
}

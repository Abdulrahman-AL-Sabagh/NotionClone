import {
  Component,
  effect,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { EditPageComponent } from './edit-page/edit-page.component';
import { FormControl } from '@angular/forms';
import { DropdownComponent } from './editor/dropdown/dropdown.component';
import { ImageElement } from '../image-element';
import { HeadingElement } from '../heading-element';
import { TitleComponent } from './editor/title/title.component';
import { RichTextEditorService } from '../rich-text-editor.service';
import { EditorDropdown } from '../editor-dropdown';

import { EditorModel } from '../editor-model';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [EditPageComponent, DropdownComponent, TitleComponent, AsyncPipe],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent implements OnInit {
  title = new FormControl();
  isFocused = signal(false);
  optionsVisible = false;
  content: EditorModel['content'] = [];
  dropdownItems: EditorDropdown[] = [
    {
      name: 'Heading 1',
      imageSrc: '',
      handler: () => this.store.addElement('Heading')(1),
    },
  ];
  /**
   *
   */

  constructor(public store: RichTextEditorService) {
    effect(
      () => {
        this.content = this.store.model().content;
      },
      { allowSignalWrites: true }
    );
  }
  ngOnInit(): void {}
  isHeading(element: HeadingElement | ImageElement): element is HeadingElement {
    return element.type === 'Heading';
  }
}

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
import { TextElement } from '../text-element';
import { TextComponent } from './editor/text/text.component';
import { RichTextEditorService } from '../rich-text-editor.service';
import { EditorDropdown } from '../editor-dropdown';

import { EditorModel } from '../editor-model';
import { AsyncPipe } from '@angular/common';
import { FloatingToolbarComponent } from "./editor/floating-toolbar/floating-toolbar.component";

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [EditPageComponent, DropdownComponent, TextComponent, AsyncPipe, FloatingToolbarComponent],
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
      handler: () => this.store.addElement('Text')(1),
    },
    {
      name: 'Heading 2',
      imageSrc: '',
      handler: () => this.store.addElement('Text')(2),
    },
    {
      name: 'Heading 3',
      imageSrc: '',
      handler: () => this.store.addElement('Text')(3),
    },
  ];
  /**
   *
   */

  constructor(public store: RichTextEditorService) {
    effect(() => {
      this.content = this.store.model().content;
      this.optionsVisible = this.store.model().optionsVisible;
    });
  }
  ngOnInit(): void {}
  isHeading(element: TextElement | ImageElement): element is TextElement {
    return element.type === 'Text';
  }
}

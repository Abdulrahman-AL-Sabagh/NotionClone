import { Component, signal, WritableSignal } from '@angular/core';
import { EditPageComponent } from './edit-page/edit-page.component';
import { FormControl } from '@angular/forms';
import { DropdownComponent } from './editor/dropdown/dropdown.component';
import { ContentElement } from '../content-element';
import { ImageElement } from '../image-element';
import { HeadingElement } from '../heading-element';
import { TitleComponent } from './editor/title/title.component';
import { RichTextEditorService } from '../rich-text-editor.service';
import { EditorDropdown } from '../editor-dropdown';
import { BehaviorSubject, map, take, tap, withLatestFrom } from 'rxjs';
import { EditorModel } from '../editor-model';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [EditPageComponent, DropdownComponent, TitleComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent {
  title = new FormControl();

  newContent = signal('');
  isFocused = signal(false);
  content: ContentElement[] = [];
  optionsVisible = false;
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

  constructor(private store: RichTextEditorService) {
    store.store.subscribe((model) => {
      this.content = model.content;
      this.optionsVisible = model.optionsVisible;
    });
  }
  handleChange(item: ContentElement) {}

  handleFocus() {
    this.isFocused.set(true);
  }
  handleBlur() {
    // const paragraph = document.createElement('p');
    // paragraph.innerHTML = this.editor.nativeElement.innerHTML;
    // this.editor.nativeElement.innerHTML = '';
    // this.editor.nativeElement.appendChild(paragraph);
  }

  isImage(element: ContentElement | ImageElement): element is ImageElement {
    return (element as ImageElement).src !== undefined;
  }
  isHeading(
    element: ContentElement | HeadingElement
  ): element is HeadingElement {
    return (element as HeadingElement).type === 'Heading';
  }
  getImage(element: ContentElement) {
    return this.isImage(element).valueOf() ? (element as ImageElement) : null;
  }
}

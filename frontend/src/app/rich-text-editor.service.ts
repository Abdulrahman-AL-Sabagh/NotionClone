import { Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Head, map, take } from 'rxjs';
import { HeadingElement } from './heading-element';
import { ImageElement } from './image-element';
import { EditorModel } from './editor-model';
import { v4 as uuidv4 } from 'uuid';
import { ContentElement } from './content-element';

@Injectable({
  providedIn: 'root',
})
export class RichTextEditorService {
  pipe(arg0: any, arg1: any, arg2: any) {
    throw new Error('Method not implemented.');
  }
  readonly model: WritableSignal<EditorModel>;
  constructor() {
    this.model = signal({
      enterClickedAt: '',
      dropdownIsFocused: false,
      slashAppeardAt: '',
      optionsVisible: false,
      content: [
        {
          elementId: 'heading-1',
          type: 'Heading',
          level: 1,

          text: '',
        },
        {
          elementId: 'heading-2',
          type: 'Heading',
          level: 2,
          text: '',
        },
        {
          elementId: 'heading-3',
          type: 'Heading',
          level: 3,
          text: '',
        },
      ],
    });
  }

  checkIfSlashAppears(value: string, elementId: string) {
    console.log(value, elementId);
    this.model.update((modelValue) => ({
      ...modelValue,
      optionsVisible: value.trimEnd().trimStart().endsWith('/'),
      slashAppeardAt: elementId,
    }));
    console.log(this.model().optionsVisible);
  }
  addElement(
    type: 'Heading',
    enterClicked?: boolean
  ): (level: 1 | 2 | 3) => void;
  addElement(
    type: 'Image',
    enterClicked?: boolean
  ): (src?: string, alt?: string) => void;
  addElement(type: ContentElement['type'], enterClicked: boolean = false) {
    if (type === 'Heading') {
      return (level: 1 | 2 | 3) =>
        this.addElementToStore({
          type: 'Heading',
          elementId: uuidv4(),
          level: level,
          text: '',
        });
    } else {
      return (src = '', alt = '') =>
        this.addElementToStore({
          type,
          elementId: uuidv4(),
          src,
          alt,
        });
    }
  }
  private addElementToStore(
    element: HeadingElement | ImageElement,
    enterClicked: boolean = false
  ) {
    console.log(element);
    if (!enterClicked) {
      this.removeSlashFromElement();
    }
    const index = this.getTheArrayIndexOfTheElementId(
      enterClicked ? this.model().enterClickedAt : this.model().slashAppeardAt
    );

    const arr1 = this.model().content.slice(0, index);
    if (index === 0) {
      arr1.push(this.model().content[0]);
    }
    arr1.push(element);
    this.model.update((value) => ({
      ...value,
      content: arr1.concat(value.content.slice(index)),
    }));
  }

  private removeSlashFromElement() {
    const indexOfElement = this.getTheArrayIndexOfTheElementId(
      this.model().slashAppeardAt
    );
    const element = this.model().content[indexOfElement];
    if (!('text' in element)) return;

    this.model.update((value) => ({
      ...value,
      content: this.updateElementInArray(value.content, {
        ...element,
        text: element.text.replace('/', ''),
      }),
    }));
  }

  private getTheArrayIndexOfTheElementId(id: string): number {
    return this.model().content.findIndex(
      (element) => element.elementId === id
    );
  }

  updateElementText(id: string, text: string) {
    if (text.endsWith(' ')) {
      text = text.trimEnd();
    }

    const index = this.getTheArrayIndexOfTheElementId(id);
    const element = this.model().content[index];
    console.log(element);
    if (!('text' in element)) return;
    element;
    this.model.update((value) => ({
      ...value,
      content: this.updateElementInArray(value.content, {
        ...element,
        text,
      }),
    }));
  }

  private updateElementInArray(
    array: EditorModel['content'],
    updatedElement: ImageElement | HeadingElement
  ) {
    return array.map((item) =>
      item.elementId === updatedElement.elementId ? updatedElement : item
    );
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
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
  readonly store: BehaviorSubject<EditorModel>;
  constructor() {
    this.store = new BehaviorSubject<EditorModel>({
      dropdownIsFocused: false,
      slashAppeardAt: '',
      optionsVisible: false,
      content: [
        {
          elementId: 'heading-1',
          type: 'Heading',
          level: 1,

          text: 'Some Awsome Heading 1',
        } as HeadingElement,
        {
          elementId: 'heading-2',
          type: 'Heading',
          level: 2,
          text: 'Some Awsome Heading 2',
        } as HeadingElement,
        {
          elementId: 'heading-3',
          type: 'Heading',
          level: 3,
          text: 'Some Awsome Heading 3',
        } as HeadingElement,
        {
          elementId: 'blank',
          type: 'Blank',
        },
        {
          elementId: 'image-1',
          type: 'Image',
          src: '',
          alt: '',
        } as ImageElement,
      ],
    });
  }

  checkIfSlashAppears(value: string, elementId: string) {
    console.log(this.store);
    this.store.next({
      ...this.store.value,
      optionsVisible: value.endsWith('/'),
      slashAppeardAt: elementId,
    });
  }
  addElement(type: 'Heading'): (level: 1 | 2 | 3) => void;
  addElement(type: 'Image'): (src?: string, alt?: string) => void;
  addElement(type: ContentElement['type']) {
    console.log(this.store.value.content);
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
  private addElementToStore(element: HeadingElement | ImageElement) {
    this.store
      .pipe(
        take(1),
        map((storeValue) => {
          const idOfElement = storeValue.slashAppeardAt;
          const indexOfElement = storeValue.content.findIndex(
            (element) => element.elementId === idOfElement
          );
          const content = [
            ...storeValue.content.slice(0, indexOfElement),
            element,
            ...storeValue.content.slice(indexOfElement),
          ];

          return { ...storeValue, content };
        })
      )
      .subscribe((newState) => this.store.next(newState));
  }
}

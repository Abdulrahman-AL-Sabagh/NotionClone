import { Injectable } from '@angular/core';
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

          text: '',
        } as HeadingElement,
        {
          elementId: 'heading-2',
          type: 'Heading',
          level: 2,
          text: '',
        } as HeadingElement,
        {
          elementId: 'heading-3',
          type: 'Heading',
          level: 3,
          text: '',
        } as HeadingElement,
      ],
    });
  }

  checkIfSlashAppears(value: string, elementId: string) {
    this.store.next({
      ...this.store.value,
      optionsVisible: value.endsWith('/'),
      slashAppeardAt: elementId,
    });
  }
  addElement(type: 'Heading'): (level: 1 | 2 | 3) => void;
  addElement(type: 'Image'): (src?: string, alt?: string) => void;
  addElement(type: ContentElement['type']) {
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
    this.removeSlashFromElement();
    this.store
      .pipe(
        take(1),
        map((storeValue) => {
          const indexOfElement = this.getTheArrayIndexOfTheElementId(
            storeValue.slashAppeardAt
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

  private removeSlashFromElement() {
    const indexOfElement = this.getTheArrayIndexOfTheElementId(
      this.store.getValue().slashAppeardAt
    );

    this.store
      .pipe(
        take(1),
        map((storeValue) => {
          const element = storeValue.content[indexOfElement] as HeadingElement;
          return {
            ...storeValue,
            content: this.updateElementInArray(storeValue.content, {
              element,
              text: element.text.replace('/', ''),
            } as unknown as ContentElement),
          };
        })
      )
      .subscribe((newState) => this.store.next(newState));
  }

  private getTheArrayIndexOfTheElementId(id: string): number {
    return this.store
      .getValue()
      .content.findIndex((element) => element.elementId === id);
  }

  updateElementText(id: string, text: string) {
    if (text.endsWith(' ')) {
      text = text.trimEnd();
    }
    const index = this.getTheArrayIndexOfTheElementId(id);
    const element = this.store.getValue().content[index] as HeadingElement;
    this.store
      .pipe(
        take(1),
        map((storeValue) => ({
          ...storeValue,
          content: this.updateElementInArray(storeValue.content, {
            ...element,
            text,
          } as HeadingElement),
        }))
      )
      .subscribe((newState) => this.store.next(newState));
  }

  private updateElementInArray(
    array: ContentElement[],
    updatedElement: ContentElement
  ) {
    return array.map((item) =>
      item.elementId === updatedElement.elementId ? updatedElement : item
    );
  }
}

import { Injectable, signal, WritableSignal } from '@angular/core';
import { TextElement } from './text-element';
import { ImageElement } from './image-element';
import { EditorModel } from './editor-model';
import { v4 as uuidv4 } from 'uuid';
import { ContentElement } from './content-element';
import { TextElementChild } from './text-element-child';

@Injectable({
  providedIn: 'root',
})
export class RichTextEditorService {
  readonly model: WritableSignal<EditorModel>;
  constructor() {
    this.model = signal({
      selection: window.getSelection(),
      enterClickedAt: '',
      dropdownIsFocused: false,
      slashAppeardAt: '',
      optionsVisible: false,
      focusedElementId: '',
      floatingToolbar: {
        isFocused: false,
        isVisible: false,
        boldIsActive: false,
        italicIsActive: false,
        lineThroughIsActive: false,
        left: 0,
        top: 0,
      },
      content: [
        {
          elementId: 'heading-1',
          type: 'Text',
          level: 1,
          text: 'Hello World',
          hasPlaceHolder: false,
          children: [
            {
              startsAt: 0,
              endsAt: 5,
              style: new Set(['bold']),
            },
          ],
        },
        {
          elementId: 'heading-2',
          type: 'Text',
          level: 2,
          text: '',
          hasPlaceHolder: true,
          children: [],
        },
        {
          elementId: 'heading-3',
          type: 'Text',
          level: 3,
          text: '',
          hasPlaceHolder: true,
          children: [],
        },
      ],
    });
  }

  addElement(
    type: 'Text',
    enterClicked?: boolean
  ): (level: TextElement['level']) => void;
  addElement(
    type: 'Image',
    enterClicked?: boolean
  ): (src?: string, alt?: string) => void;
  addElement(type: ContentElement['type'], enterClicked: boolean = false) {
    if (type === 'Text' || enterClicked) {
      return (level: TextElement['level']) =>
        this.addTextElementToStore({
          type: 'Text',
          elementId: uuidv4(),
          level: level,
          text: '',
          hasPlaceHolder: true,
          children: [],
        });
    } else {
      return (src = '', alt = '') =>
        this.addImageElementTostore({
          type,
          elementId: uuidv4(),
          src,
          alt,
        });
    }
  }

  updateElementText(id: string, text: string) {
    if (text.endsWith(' ')) {
      text = text.trimEnd();
    }

    const index = this.getTheArrayIndexOfTheElementId(id);
    const element = this.model().content[index];
    this.model.update((value) => ({
      ...value,
      optionsVisible: text.endsWith('/'),
      content: this.updateElementInArray(value.content, {
        ...element,
        text,
      } as TextElement),
    }));
  }
  deleteElement(elementId: string) {
    this.model.update((value) => ({
      ...value,
      content: value.content.filter((item) => item.elementId !== elementId),
    }));
    this.model().content.length;
  }

  private addImageElementTostore(
    element: ImageElement,
    enterClicked: boolean = false
  ) {}
  private addTextElementToStore(
    element: TextElement,
    enterClicked: boolean = false
  ) {
    if (!enterClicked) {
      this.removeSlashFromElement();
    }
    const id = this.model().enterClickedAt || this.model().slashAppeardAt;
    const index = this.getTheArrayIndexOfTheElementId(id);
    let result: (ImageElement | TextElement)[] = [];
    this.model().content;

    const arr1 = this.model().content.slice(0, index);
    if (index === 0) {
      arr1.push(this.model().content[0]);
    }
    if (index === this.model().content.length - 1) {
      result = [...this.model().content, element];
    } else {
      result = arr1.concat(this.model().content.slice(index));
    }
    result;
    this.model.update((value) => ({
      ...value,
      content: result,
      enterClickedAt: '',
      slashAppeardAt: '',
    }));
  }
  private removeSlashFromElement() {
    const indexOfElement = this.getTheArrayIndexOfTheElementId(
      this.model().slashAppeardAt
    );
    if (indexOfElement === -1) return;
    const element = this.model().content[indexOfElement];
    if (this.isHeading(element).valueOf()) {
      element;
      this.model.update((value) => ({
        ...value,
        content: this.updateElementInArray(value.content, {
          ...element,
          type: 'Text',
          text: (element as TextElement).text.replace('/', ''),
        }),
      }));
    }
  }

  private getTheArrayIndexOfTheElementId(id: string): number {
    return this.model().content.findIndex((element) => {
      const x = element.elementId === id;
      return x;
    });
  }

  private updateElementInArray(
    array: EditorModel['content'],
    updatedElement: ImageElement | TextElement
  ) {
    return array.map((item) =>
      item.elementId === updatedElement.elementId ? updatedElement : item
    );
  }

  private isHeading(
    element: TextElement | ImageElement
  ): element is TextElement {
    return (
      element.type === 'Text' && (element as TextElement).text !== undefined
    );
  }
  private isImage(element: TextElement | ImageElement) {
    return (
      element.type === 'Image' && (element as ImageElement).src !== undefined
    );
  }

  updateFloatingToolbar(conf: {
    isVisible: boolean;
    isFocused?: boolean;
    boldIsActive?: boolean;
    italicIsActive?: boolean;
    lineThroughIsActive?: boolean;
    x?: number;
    y?: number;
  }) {
    this.model.update((value) => ({
      ...value,
      floatingToolbar: {
        isVisible: conf.isVisible,
        left: conf.x || 0,
        top: conf.y || 0,
        isFocused: conf.isFocused || false,
        lineThroughIsActive: conf.lineThroughIsActive || false,
        boldIsActive: conf.boldIsActive || false,
        italicIsActive: conf.italicIsActive || false,
      },
    }));
  }
  appendChildToElement(style: 'bold' | 'italic' | 'line-through') {
    console.log(' adding child');
    const modelCopy = { ...this.model() };
    const index = this.getTheArrayIndexOfTheElementId(
      this.model().focusedElementId
    );
    const selection = modelCopy.selection;
    if (!selection) return;
    const startsAt = selection.anchorOffset;
    const endsAt = selection.focusOffset;
    const textElement = modelCopy.content[index] as TextElement;
    const child = this.getChildIfExistsOrCreateANewOne(
      {
        startsAt,
        endsAt,
      },
      textElement.children,
      style
    );

    let updatedTextElement = { ...textElement };
    if (!child) {
      const newChild: TextElementChild = {
        startsAt,
        endsAt,
        style: new Set([style]),
      };
      updatedTextElement = {
        ...textElement,
        children: [...textElement.children, newChild],
      };
    }
    if (child) {
      if (child.style.has(style)) {
        child.style.delete(style);
        if ([...child.style].length === 0) {
          updatedTextElement = {
            ...textElement,
            children: textElement.children.filter((item) => item !== child),
          };
        }
      } else {
        // @ts-ignore
        const indexOfChild = textElement.children.indexOf(child);
        updatedTextElement = {
          ...textElement,
          children: [
            ...textElement.children.slice(0, indexOfChild),
            { ...child, style: new Set([...child.style, style]) },
            ...textElement.children.slice(indexOfChild),
          ],
        };
      }
    }

    // Update the content array with the updated text element
    const newContent = this.model().content.map((item, idx) =>
      idx === index ? updatedTextElement : item
    );

    this.model.update((value) => ({ ...value, content: newContent }));
    console.log((this.model().content[index] as TextElement).children);
  }

  private getChildIfExistsOrCreateANewOne(
    coordinates: { startsAt: number; endsAt: number },
    array: TextElementChild[],
    style: 'bold' | 'italic' | 'line-through'
  ): TextElementChild | undefined {
    return (
      array.filter(
        (item) =>
          item.startsAt === coordinates.startsAt &&
          item.endsAt === coordinates.endsAt
      )[0] || undefined
    );
  }
}

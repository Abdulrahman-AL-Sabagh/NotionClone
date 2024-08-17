import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  signal,
  SimpleChanges,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { RichTextEditorService } from '../../../rich-text-editor.service';
import { TextElement } from '../../../text-element';
import { FloatingToolbarComponent } from '../floating-toolbar/floating-toolbar.component';
import { DefaultTitleStrategy } from '@angular/router';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [FloatingToolbarComponent],
  templateUrl: './text.component.html',
  styleUrl: './text.component.css',
})
export class TextComponent implements AfterViewInit {
  @ViewChild('ref') title!: ElementRef<HTMLHeadingElement>;
  @Input() elementId: string = '';
  @Input() text: string = '';
  @Input() level: TextElement['level'] = 1;
  @Input() hasPlaceHolder: boolean = false;
  className: WritableSignal<'' | 'placeholder'> = signal('');
  selectionChanged: WritableSignal<boolean> = signal(false);
  x: number = 0;
  y: number = 0;
  currentOffset = 0;
  caretVisible: WritableSignal<'caret-invisible' | ''> = signal('');
  controlPressed: boolean = false;
  shiftPressed: boolean = false;
  wholeFieldIsSelected: boolean = false;

  constructor(private store: RichTextEditorService, private ref: ElementRef) {}
  ngAfterViewInit(): void {}

  ngOnInit() {
    this.updateTextState(
      this.text || `Heading ${this.level}`,
      this.text ? '' : 'placeholder'
    );
    // document.addEventListener('selectionchange', this.handleSelect.bind(this));
  }

  handleFocus(e: FocusEvent) {
    if (this.className() === 'placeholder') {
      this.updateTextState('', '');
    }
  }

  handleBlur() {
    this.caretVisible.set('');
    this.selectionChanged.set(false);
    if (this.text.trim().length === 0) {
      this.updateTextState(`Heading ${this.level}`, 'placeholder');
    }
    if (!this.store.model().dropdownIsFocused) {
      this.store.model.set({
        ...this.store.model(),
        optionsVisible: false,
      });
    }
    this.store.updateFloatingToolbar({ isVisible: false });
  }

  handleKeyUp(event: KeyboardEvent) {
    this.updateTextState(this.title.nativeElement.textContent || '');
    setTimeout(() => this.moveCaret(), 0);
  }

  handleKeyDown(event: KeyboardEvent) {
    this.controlPressed = event.ctrlKey;
    this.shiftPressed = event.shiftKey;
    this.caretVisible.set('caret-invisible');
    this.keyPressHandler(event.key);
    if (event.key === 'Backspace') {
      if (this.text.length === 0) {
        this.store.deleteElement(this.elementId);
        return;
      }
    }

    if (event.key === 'Enter') {
      this.store.model.update((value) => ({
        ...value,
        enterClickedAt: this.elementId,
      }));
      this.store.addElement('Text', true)('Paragraph');
      return;
    }
  }
  updateTextState(text: string, className: 'placeholder' | '' = '') {
    this.className.set(className);
    this.store.updateElementText(this.elementId, text);
    if (!this.hasPlaceHolder) {
    }
  }
  handleClick(event: MouseEvent) {
    this.store.updateFloatingToolbar({ isVisible: false });
    this.x = event.clientX;
    this.y = event.clientY;
    const range = document.caretRangeFromPoint(this.x, this.y);
    if (range) {
      this.currentOffset = range.startOffset;
      this.moveCaret();
    }
  }

  private moveCaret() {
    if (this.currentOffset > this.text.length) {
      this.currentOffset = this.text.length;
      return;
    }
    const selection = window.getSelection();

    const range = document.caretRangeFromPoint(this.x, this.y);

    range?.setStart(range.endContainer, this.currentOffset);
    range?.setEnd(range.endContainer, this.text.length);
    if (!range) return;
    range.collapse(true);
    if (selection?.anchorOffset == selection?.focusOffset) {
      this.store.updateFloatingToolbar({ isVisible: false });
      selection?.removeAllRanges();
    } else {
      this.store.updateFloatingToolbar({
        isVisible: true,
        x: this.x,
        y: this.y,
      });
    }
    selection?.addRange(range);
  }
  keyPressHandler(key: string) {
    if (this.wholeFieldIsSelected) {
      this.wholeFieldIsSelected = false;
      return;
    }
    if (!this.controlPressed && !this.shiftPressed) {
      switch (key) {
        case 'ArrowLeft':
          this.currentOffset -= 1;
          this.store.updateFloatingToolbar({ isVisible: false });
          break;
        case 'ArrowRight':
          this.currentOffset += 1;
          this.store.updateFloatingToolbar({ isVisible: false });
          break;
        case 'ArrowUp':
          //TODO: Move caret to the upper element
          alert('Action for Arrow up will come soon');
          break;
        case 'ArrowDown':
          //TODO: Move caret to the  element below
          alert('Action for Arrow down will come soon');
          break;
        case 'Control':
          this.controlPressed = true;
          this.store.updateFloatingToolbar({ isVisible: true });

          break;
        case 'Shift':
          this.shiftPressed = true;
          this.store.updateFloatingToolbar({ isVisible: true });

          break;
        case 'Backspace':
          this.currentOffset -= 1;

          break;
        case 'Enter':
          this.store.addElement('Text', true)('Paragraph');
          this.title.nativeElement.blur();
          break;
        default:
          this.currentOffset++;
          this.store.updateFloatingToolbar({ isVisible: false });
      }
      return;
    }
    if (this.controlPressed) {
      this.handleKeypressedWhenControlIsPressed(key);
    }
    if (this.shiftPressed) {
      this.shiftPressed = false;
      return;
    }
  }
  private getNextCaretPosition(moveForward: boolean = true): number {
    const whitespaces = Array.from(this.text)
      .map((value, index) => (value === ' ' ? index : undefined))
      .filter(Boolean)
      .filter((value) =>
        moveForward ? value! > this.currentOffset : value! < this.currentOffset
      );
    if (whitespaces.length === 0) {
      return moveForward ? this.text.length : 0;
    }
    let caretPosition = this.currentOffset;
    if (moveForward) {
      caretPosition = whitespaces[0]!;
    } else {
      caretPosition = whitespaces[whitespaces.length - 1]!;
      // if (caretPosition > 0) {
      //   caretPosition += 1;
      // }
    }

    return caretPosition!;
  }
  handleKeypressedWhenControlIsPressed(key: string) {
    this.controlPressed = key === 'Shift' || key === 'Control';
    switch (key) {
      case 'Shift':
        this.shiftPressed = true;
        break;
      case 'A':
        this.wholeFieldIsSelected = true;
        this.store.updateFloatingToolbar({
          isVisible: true,
          x: this.x,
          y: this.y,
        });
        this.currentOffset = this.text.length;
        break;
      case 'B':
        alert('Making text bold will come soon');
        break;
      case 'ArrowLeft':
        this.currentOffset = this.getNextCaretPosition(false);
        break;
      case 'ArrowRight':
        this.currentOffset = this.getNextCaretPosition(true);
    }
  }
}

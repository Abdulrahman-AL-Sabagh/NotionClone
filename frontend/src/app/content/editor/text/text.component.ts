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

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [FloatingToolbarComponent],
  templateUrl: './text.component.html',
  styleUrl: './text.component.css',
})
export class TextComponent implements AfterViewInit {
  @Input() elementId: string = '';
  @Input() text: string = '';
  @Input() level: TextElement['level'] = 1;
  @ViewChild('ref') title!: ElementRef<HTMLHeadingElement>;
  className: WritableSignal<'' | 'placeholder'> = signal('');
  selectionChanged: WritableSignal<boolean> = signal(false);
  x: number = 0;
  y: number = 0;
  currentOffset = 0;
  constructor(private store: RichTextEditorService, private ref: ElementRef) {}
  ngAfterViewInit(): void {}

  ngOnInit() {
    this.updateTextState(
      this.text || `Heading ${this.level}`,
      this.text ? '' : 'placeholder'
    );
    // document.addEventListener('selectionchange', this.handleSelect.bind(this));
  }

  handleChange(event: Event) {
    const element = event.currentTarget as HTMLHeadingElement;
    if (!element.textContent) return;

    const fieldTextIsEmpty = element.textContent.trim().length === 0;
    this.updateTextState(
      fieldTextIsEmpty ? `Heading ${this.level}` : element.textContent,
      fieldTextIsEmpty ? 'placeholder' : ''
    );
    setTimeout(() => this.handleJump(), 0);
  }
  handleFocus() {
    if (this.className() === 'placeholder') {
      this.updateTextState('', '');
    }
  }

  handleBlur() {
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
  }

  handleKeyUp() {
    this.title.nativeElement.focus({ preventScroll: true });
  }

  handlePress(event: KeyboardEvent) {
    if (event.key === 'Backspace' && this.text.length === 0) {
      this.store.deleteElement(this.elementId);
      return;
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
  }
  handleSelect(event: MouseEvent) {
    const selection = window.getSelection();
    selection?.removeAllRanges();
    this.x = event.clientX;
    this.y = event.clientY;
    const range = document.caretRangeFromPoint(this.x, this.y);
    if (range) {
      range.collapse(true);
      console.log(range);
      selection?.addRange(range);
      this.currentOffset = range.startOffset + 1;
    }
    this.title.nativeElement.focus();
  }
  handleJump() {
    this.title.nativeElement.focus();
    const selection = window.getSelection();

    let focusNode = selection?.focusNode;
    if (!focusNode) return;
    const range = document.caretRangeFromPoint(this.x, this.y);
    if (this.currentOffset + 1 < this.text.length) {
      this.currentOffset += 1;
    }
    range?.setStart(
      range.endContainer,
      range.endOffset === this.text.length
        ? range.startOffset
        : this.currentOffset
    );
    if (!range) return;
    range.collapse(true);
    this.title.nativeElement.ownerDocument;
    selection?.removeAllRanges();
    selection?.addRange(range);
    this.title.nativeElement.focus();
    console.log(
      range.startOffset,
      ' RANGE START OFFSET ',
      range.endOffset,
      'RANGE END OFFSET'
    );
  }
}

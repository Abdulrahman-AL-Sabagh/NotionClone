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
    this.store.model.update((value) => ({
      ...value,
      floatingToolbar: { ...value.floatingToolbar, isVisible: false },
    }));
  }
  handleDoubleClick(e: MouseEvent) {
    e.preventDefault();
  }

  handleKeyUp(event: KeyboardEvent) {
    this.updateTextState(this.title.nativeElement.textContent || '');
    setTimeout(() => this.moveCaret(), 0);
  }

  handleKeyDown(event: KeyboardEvent) {
    const element = event.target as HTMLElement;
    this.caretVisible.set('caret-invisible');
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
    this.currentOffset++;
  }
  updateTextState(text: string, className: 'placeholder' | '' = '') {
    this.className.set(className);
    this.store.updateElementText(this.elementId, text);
    if (!this.hasPlaceHolder) {
    }
  }
  handleClick(event: MouseEvent) {
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
      selection?.removeAllRanges();
      this.store.updateFloatingToolbar({ isVisible: false });
    } else {
      this.store.updateFloatingToolbar({
        isVisible: true,
        x: this.x,
        y: this.y,
      });
    }
    selection?.addRange(range);
  }
}

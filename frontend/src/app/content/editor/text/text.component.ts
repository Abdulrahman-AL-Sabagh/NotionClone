import {
  Component,
  effect,
  ElementRef,
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
export class TextComponent implements OnChanges {
  @ViewChild('ref')
  title!: ElementRef<HTMLHeadingElement>;
  @Input() elementId: string = '';
  @Input() text: string = '';
  @Input() level: TextElement['level'] = 1;
  className: WritableSignal<'' | 'placeholder'> = signal('');

  constructor(private store: RichTextEditorService) {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes['text'].currentValue, 'text changes');
    console.log(this.store.model().optionsVisible);
    console.log(
      (
        this.store
          .model()
          .content.find(
            (element) => element.elementId === this.elementId
          ) as TextElement
      ).text,
      'Text in Element'
    );
  }
  ngOnInit() {
    this.updateTextState(
      this.text || `Heading ${this.level}`,
      this.text ? '' : 'placeholder'
    );
  }

  handleChange(event: Event) {
    const element = event.currentTarget as HTMLHeadingElement;
    if (!element.textContent) return;
    if (element.textContent.trim().length === 0) {
      this.updateTextState(`Heading ${this.level}`, 'placeholder');
      return;
    }
    this.updateTextState(element.textContent, '');
    window
      .getSelection()
      ?.getRangeAt(0)
      .setEnd(
        this.title.nativeElement,
        this.title.nativeElement.textContent!.length - 1
      );
  }
  handleFocus() {
    if (this.className() === 'placeholder') {
      this.updateTextState('', '');
    }
  }

  handleBlur() {
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
  handleSelect(event: Event) {
    console.log(window.getSelection());
    console.log(event);
  }
}

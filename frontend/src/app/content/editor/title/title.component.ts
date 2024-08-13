import {
  Component,
  ElementRef,
  Input,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { RichTextEditorService } from '../../../rich-text-editor.service';
import { HeadingElement } from '../../../heading-element';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [],
  templateUrl: './title.component.html',
  styleUrl: './title.component.css',
})
export class TitleComponent {
  @ViewChild('ref', { static: false }) title!: ElementRef<HTMLHeadingElement>;
  @Input() elementId: string = '';
  @Input() text: string = '';
  @Input() level: 1 | 2 | 3 = 1;
  elementTitle = signal('');
  className: WritableSignal<'' | 'placeholder'> = signal('');

  /**
   *
   */
  constructor(private store: RichTextEditorService) {}
  ngOnInit() {
    this.elementTitle.set(this.text || `Heading ${this.level}`);
    this.className.set(this.text.length > 0 ? '' : 'placeholder');
  }

  handleChange(event: Event) {
    const element = event.currentTarget as HTMLHeadingElement;
    this.store.checkIfSlashAppears(element.textContent || '', this.elementId);
    this.elementTitle.set(element.textContent || '');
    element.textContent = this.elementTitle();
    this.store.updateElementText(this.elementId, this.elementTitle());
  }
  handleFocus() {
    if (this.className() === 'placeholder') {
      this.elementTitle.set('');
      this.className.set('');
    }
  }

  handleBlur() {
    if (this.elementTitle().length === 0) {
      this.elementTitle.set(`Heading ${this.level}`);
      this.className.set('placeholder');
    }
    if (!this.store.store.value.dropdownIsFocused) {
      this.store.store.next({
        ...this.store.store.value,
        optionsVisible: false,
      });
    }
  }

  handlePress(event: KeyboardEvent) {
    this.title.nativeElement.focus();
    console.log(event.key);
  }
}

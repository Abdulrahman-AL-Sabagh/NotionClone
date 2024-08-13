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
import { EditorModel } from '../../../editor-model';

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
  @Input() level: HeadingElement['level'] = 1;
  className: WritableSignal<'' | 'placeholder'> = signal('');

  /**
   *
   */
  constructor(private store: RichTextEditorService) {}
  ngOnInit() {
    this.text = this.text.length === 0 ? `Heading ${this.level}` : this.text;
    this.className.set(
      this.text === `Heading ${this.level}` ? 'placeholder' : ''
    );
  }

  handleChange(event: Event) {
    const element = event.currentTarget as HTMLHeadingElement;
    this.store.checkIfSlashAppears(element.textContent || '', this.elementId);
    this.store.updateElementText(this.elementId, element.textContent || '');
  }
  handleFocus() {
    if (this.className() === 'placeholder') {
      this.store.updateElementText(this.elementId, '');
      this.className.set('');
    }
  }

  handleBlur() {
    console.log(this.text);
    if (this.text.trim().length === 0) {
      this.store.updateElementText(this.elementId, `Heading ${this.level}`);
      this.className.set('placeholder');
    }
    if (!this.store.model().dropdownIsFocused) {
      this.store.model.set({
        ...this.store.model(),
        optionsVisible: false,
      });
    }
  }

  handlePress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.store.addElement('Heading', true)(3);
    }
    this.store.model.update((value) => ({
      ...value,
      enterClickedAt: this.elementId,
    }));
  }
}

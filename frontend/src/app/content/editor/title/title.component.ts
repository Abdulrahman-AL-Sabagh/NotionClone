import { Component, ElementRef, Input, signal, ViewChild } from '@angular/core';
import { RichTextEditorService } from '../../../rich-text-editor.service';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [],
  templateUrl: './title.component.html',
  styleUrl: './title.component.css',
})
export class TitleComponent {
  @ViewChild('ref') title!: ElementRef<HTMLHeadingElement>;
  @Input() elementId: string = '';
  @Input() text: string = '';
  @Input() level: 1 | 2 | 3 = 1;
  elementTitle = signal('');

  /**
   *
   */
  constructor(private store: RichTextEditorService) {}
  ngOnInit() {
    this.elementTitle.set(this.text);
  }

  handleChange(event: Event) {
    const element = event.target as HTMLHeadingElement;
    this.store.checkIfSlashAppears(element.textContent || '', this.elementId);
    // console.log(
    //   this.title.nativeElement.innerText,
    //   'title of id',
    //   this.elementId
    // );
  }

  handleBlur() {
    if (!this.store.store.value.dropdownIsFocused) {
      this.store.store.next({
        ...this.store.store.value,
        optionsVisible: false,
      });
    }
  }
}

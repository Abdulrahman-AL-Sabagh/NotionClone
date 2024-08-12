import {
  Component,
  ElementRef,
  signal,
  viewChild,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { EditPageComponent } from './edit-page/edit-page.component';
import { FormControl } from '@angular/forms';
import { DropdownComponent } from './editor/dropdown/dropdown.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [EditPageComponent, DropdownComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent {
  title = new FormControl();
  content: WritableSignal<string[]> = signal([]);
  newContent = signal('');
  isFocused = signal(false);
  optionsVisible = true;

  @ViewChild('editor') editor!: ElementRef<HTMLDivElement>;
  /**
   *
   */

  constructor() {}
  handleChange(event: Event) {
    const element = event.target as HTMLDivElement;
    console.log(element.innerText);
  }

  handleFocus() {
    this.isFocused.set(true);
  }
  handleBlur() {
    const paragraph = document.createElement('p');
    paragraph.innerHTML = this.editor.nativeElement.innerHTML;
    this.editor.nativeElement.innerHTML = '';
    this.editor.nativeElement.appendChild(paragraph);
  }

  private resetAndCreateNewInput() {
    this.content.set([...this.content(), this.newContent()]);
    this.newContent.set('');
  }
}

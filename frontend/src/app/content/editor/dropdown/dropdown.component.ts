import { Component, Input } from '@angular/core';
import { EditorDropdown } from '../../../editor-dropdown';
import { RichTextEditorService } from '../../../rich-text-editor.service';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
})
export class DropdownComponent {
  @Input() items: EditorDropdown[] = [];

  /**
   *
   */
  constructor(private store: RichTextEditorService) {
    console.log(store);
  }
  handleClick(index: number) {
    console.log('button has been clicked');
    console.log(this.items[index]);
    this.items[index].handler();
    this.store.store.next({
      ...this.store.store.getValue(),
      optionsVisible: false,
      dropdownIsFocused: false,
    });
  }

  handleFocus() {
    this.store.store.next({
      ...this.store.store.getValue(),
      optionsVisible: true,
      dropdownIsFocused: true,
    });
  }
}

import { Component } from '@angular/core';
import { EditPageComponent } from './edit-page/edit-page.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [EditPageComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent {
  title = new FormControl();
  content = '';
  /**
   *
   */
  constructor() {}
  handleChange(event: Event) {}
}

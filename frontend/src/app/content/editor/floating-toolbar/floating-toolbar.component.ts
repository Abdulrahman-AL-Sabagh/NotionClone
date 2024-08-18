import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { RichTextEditorService } from '../../../rich-text-editor.service';

@Component({
  selector: 'app-floating-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './floating-toolbar.component.html',
  styleUrl: './floating-toolbar.component.css',
})
export class FloatingToolbarComponent implements AfterViewInit, OnChanges {
  @ViewChild('ref') ref!: ElementRef<HTMLDivElement>;
  @Input() x: number = 0;
  @Input() y: number = 0;

  constructor(
    private store: RichTextEditorService,
    private renderer: Renderer2
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes, '    floating tool bar changed');
  }
  ngAfterViewInit(): void {
    this.renderer.setStyle(this.ref.nativeElement, 'left', `${this.x}px`);
    this.renderer.setStyle(this.ref.nativeElement, 'top', `${this.y}px`);
  }
  handleMouseOver(event: MouseEvent) {
    this.store.updateFloatingToolbar({ isVisible: true, isFocused: true });
  }

  convertToLineThrough() {
    this.store.appendChildToElement('line-through');
  }
  convertToItalic() {
    this.store.appendChildToElement('italic');
  }
  convertToBold() {
    this.store.appendChildToElement('bold');
  }
}

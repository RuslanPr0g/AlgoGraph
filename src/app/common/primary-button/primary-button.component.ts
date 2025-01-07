import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-primary-button',
  standalone: true,
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.scss'],
  imports: [CommonModule],
})
export class PrimaryButtonComponent {
  @Input({ required: true }) text!: string;
  @Output() clicked = new EventEmitter();

  click(): void {
    this.clicked.emit();
  }
}

import { Component } from '@angular/core';
import { GraphComponent } from './shared/graph.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    GraphComponent
  ]
})
export class AppComponent {
  title = 'codespot';
}

import { NodeComponent } from './features/node/node.component';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WindowComponent } from './features/window/window.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NodeComponent, CommonModule, WindowComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'purgatory-ui';
}

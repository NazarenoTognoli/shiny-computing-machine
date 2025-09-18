import { Component, input } from '@angular/core';

@Component({
  selector: 'app-debugger-line',
  standalone: true,
  imports: [],
  templateUrl: './debugger-line.html',
  styleUrl: './debugger-line.scss',
  host: {
    '[style.color]': 'color()'
  }
})
export class DebuggerLine {
  color = input<string>('inherit');
}
import { Component } from '@angular/core';
import { WindowComponent } from '@features/window-system/window/window.component';

@Component({
  selector: 'app-nav',
  imports: [WindowComponent],
  standalone: true,
  templateUrl: './nav.html',
  styleUrl: './nav.scss'
})
export class Nav {}

import { Component } from '@angular/core';
import { WindowComponent } from '@features/window-system/window/window.component';

@Component({
  selector: 'app-card',
  imports: [WindowComponent],
  standalone: true,
  templateUrl: './card.html',
  styleUrl: './card.scss'
})
export class Card {

}

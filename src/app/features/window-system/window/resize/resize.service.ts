import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {
  isResizing:boolean = false;
  constructor() { }
}

import { Component, signal, OnInit } from '@angular/core';
import { WindowComponent } from '@features/window-system/window/window.component';
import { DebuggerLine } from './debugger-line/debugger-line';

@Component({
  selector: 'app-debugger',
  imports: [WindowComponent, DebuggerLine],
  standalone: true,
  templateUrl: './debugger.html',
  styleUrl: './debugger.scss'
})
export class Debugger {
  test = signal<string[]>(["gooto"]);
  doesSomething = signal<string>('');
  testFn(id: string):string {
    if (!this.test().includes(id)) {
      const newIds:string[] = this.test();
      newIds.push(id);
      this.test.set(newIds);
      return "met the condition";
    }
    else {
      return "didn't meet the condition";
    }
  }
  ngOnInit() {
    this.doesSomething.set(this.testFn("gooto"));
  }
}

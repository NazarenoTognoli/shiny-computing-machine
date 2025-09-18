import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebuggerLine } from './debugger-line';

describe('DebuggerLine', () => {
  let component: DebuggerLine;
  let fixture: ComponentFixture<DebuggerLine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebuggerLine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebuggerLine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

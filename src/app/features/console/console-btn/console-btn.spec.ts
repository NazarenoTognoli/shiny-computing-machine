import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleBtn } from './console-btn';

describe('ConsoleBtn', () => {
  let component: ConsoleBtn;
  let fixture: ComponentFixture<ConsoleBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsoleBtn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsoleBtn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

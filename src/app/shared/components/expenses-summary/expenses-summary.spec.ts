import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesSummary } from './expenses-summary';

describe('ExpensesSummary', () => {
  let component: ExpensesSummary;
  let fixture: ComponentFixture<ExpensesSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

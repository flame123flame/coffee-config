import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatMultipleSelectChipComponent } from './mat-multiple-select-chip.component';

describe('MatMultipleSelectChipComponent', () => {
  let component: MatMultipleSelectChipComponent;
  let fixture: ComponentFixture<MatMultipleSelectChipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatMultipleSelectChipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatMultipleSelectChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

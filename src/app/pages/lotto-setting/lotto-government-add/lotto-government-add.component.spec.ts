import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoGovernmentAddComponent } from './lotto-government-add.component';

describe('LottoGovernmentAddComponent', () => {
  let component: LottoGovernmentAddComponent;
  let fixture: ComponentFixture<LottoGovernmentAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoGovernmentAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoGovernmentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

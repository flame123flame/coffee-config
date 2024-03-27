import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoGovernmentComponent } from './lotto-government.component';

describe('LottoListComponent', () => {
  let component: LottoGovernmentComponent;
  let fixture: ComponentFixture<LottoGovernmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoGovernmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoGovernmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

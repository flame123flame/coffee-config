import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoConfigAddMaxMinComponent } from './lotto-config-add-max-min.component';

describe('LottoConfigAddMaxMinComponent', () => {
  let component: LottoConfigAddMaxMinComponent;
  let fixture: ComponentFixture<LottoConfigAddMaxMinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoConfigAddMaxMinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoConfigAddMaxMinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

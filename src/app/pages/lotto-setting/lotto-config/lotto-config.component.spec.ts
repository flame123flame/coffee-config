import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoConfigComponent } from './lotto-config.component';

describe('LottoConfigComponent', () => {
  let component: LottoConfigComponent;
  let fixture: ComponentFixture<LottoConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

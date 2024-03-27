import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoRulesAddComponent } from './lotto-rules-add.component';

describe('LottoRulesAddComponent', () => {
  let component: LottoRulesAddComponent;
  let fixture: ComponentFixture<LottoRulesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoRulesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoRulesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoConfigAddGroupComponent } from './lotto-config-add-group.component';

describe('LottoConfigAddGroupComponent', () => {
  let component: LottoConfigAddGroupComponent;
  let fixture: ComponentFixture<LottoConfigAddGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoConfigAddGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoConfigAddGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

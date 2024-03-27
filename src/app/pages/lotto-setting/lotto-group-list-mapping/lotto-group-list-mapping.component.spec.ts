import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoGroupListMappingComponent } from './lotto-group-list-mapping.component';

describe('LottoGroupListMappingComponent', () => {
  let component: LottoGroupListMappingComponent;
  let fixture: ComponentFixture<LottoGroupListMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoGroupListMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoGroupListMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoYikiComponent } from './lotto-yiki.component';

describe('LottoYikiComponent', () => {
  let component: LottoYikiComponent;
  let fixture: ComponentFixture<LottoYikiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoYikiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoYikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

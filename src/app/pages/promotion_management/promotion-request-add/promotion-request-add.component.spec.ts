import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionRequestAddComponent } from './promotion-request-add.component';

describe('PromotionRequestAddComponent', () => {
  let component: PromotionRequestAddComponent;
  let fixture: ComponentFixture<PromotionRequestAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionRequestAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionRequestAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

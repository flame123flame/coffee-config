import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionRequestSystemDeclinedComponent } from './promotion-request-system-declined.component';

describe('PromotionRequestSystemDeclinedComponent', () => {
  let component: PromotionRequestSystemDeclinedComponent;
  let fixture: ComponentFixture<PromotionRequestSystemDeclinedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionRequestSystemDeclinedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionRequestSystemDeclinedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

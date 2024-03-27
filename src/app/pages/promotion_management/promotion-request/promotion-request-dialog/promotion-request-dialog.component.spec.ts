import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionRequestDialogComponent } from './promotion-request-dialog.component';

describe('PromotionRequestDialogComponent', () => {
  let component: PromotionRequestDialogComponent;
  let fixture: ComponentFixture<PromotionRequestDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionRequestDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrsReviewPageComponent } from './prs-review-page.component';

describe('PrsReviewPageComponent', () => {
  let component: PrsReviewPageComponent;
  let fixture: ComponentFixture<PrsReviewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrsReviewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrsReviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateGroupComponent } from './affiliate-group.component';

describe('AffiliateGroupComponent', () => {
  let component: AffiliateGroupComponent;
  let fixture: ComponentFixture<AffiliateGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffiliateGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliateGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

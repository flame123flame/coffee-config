import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateGroupAddComponent } from './affiliate-group-add.component';

describe('AffiliateGroupAddComponent', () => {
  let component: AffiliateGroupAddComponent;
  let fixture: ComponentFixture<AffiliateGroupAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffiliateGroupAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliateGroupAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

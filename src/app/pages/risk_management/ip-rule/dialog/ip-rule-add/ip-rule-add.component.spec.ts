import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpRuleAddComponent } from './ip-rule-add.component';

describe('IpRuleAddComponent', () => {
  let component: IpRuleAddComponent;
  let fixture: ComponentFixture<IpRuleAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpRuleAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpRuleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

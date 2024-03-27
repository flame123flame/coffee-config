import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SportsValidBetsComponent } from './sports-valid-bets.component';

describe('SportsValidBetsComponent', () => {
  let component: SportsValidBetsComponent;
  let fixture: ComponentFixture<SportsValidBetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SportsValidBetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SportsValidBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

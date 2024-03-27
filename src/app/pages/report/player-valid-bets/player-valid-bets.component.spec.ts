import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerValidBetsComponent } from './player-valid-bets.component';

describe('PlayerValidBetsComponent', () => {
  let component: PlayerValidBetsComponent;
  let fixture: ComponentFixture<PlayerValidBetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerValidBetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerValidBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

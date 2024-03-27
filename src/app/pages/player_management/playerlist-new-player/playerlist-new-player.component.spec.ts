import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerlistNewPlayerComponent } from './playerlist-new-player.component';

describe('PlayerlistNewPlayerComponent', () => {
  let component: PlayerlistNewPlayerComponent;
  let fixture: ComponentFixture<PlayerlistNewPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerlistNewPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerlistNewPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

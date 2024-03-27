import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameTagSettingComponent } from './game-tag-setting.component';

describe('GameTagSettingComponent', () => {
  let component: GameTagSettingComponent;
  let fixture: ComponentFixture<GameTagSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameTagSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameTagSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

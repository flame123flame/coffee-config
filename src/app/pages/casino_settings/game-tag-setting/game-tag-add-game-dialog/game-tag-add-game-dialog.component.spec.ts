import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameTagAddGameDialogComponent } from './game-tag-add-game-dialog.component';

describe('GameTagAddGameDialogComponent', () => {
  let component: GameTagAddGameDialogComponent;
  let fixture: ComponentFixture<GameTagAddGameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameTagAddGameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameTagAddGameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

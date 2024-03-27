import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameTagEditDialogComponent } from './game-tag-edit-dialog.component';

describe('GameTagEditDialogComponent', () => {
  let component: GameTagEditDialogComponent;
  let fixture: ComponentFixture<GameTagEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameTagEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameTagEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

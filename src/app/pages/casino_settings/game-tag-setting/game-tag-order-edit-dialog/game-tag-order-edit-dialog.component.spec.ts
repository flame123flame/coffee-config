import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameTagOrderEditDialogComponent } from './game-tag-order-edit-dialog.component';

describe('GameTagOrderEditDialogComponent', () => {
  let component: GameTagOrderEditDialogComponent;
  let fixture: ComponentFixture<GameTagOrderEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameTagOrderEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameTagOrderEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

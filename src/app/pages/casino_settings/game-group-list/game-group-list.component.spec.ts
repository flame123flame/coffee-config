import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameGroupListComponent } from './game-group-list.component';

describe('GameGroupListComponent', () => {
  let component: GameGroupListComponent;
  let fixture: ComponentFixture<GameGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

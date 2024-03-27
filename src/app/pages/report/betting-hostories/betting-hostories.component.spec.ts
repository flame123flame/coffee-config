import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BettingHostoriesComponent } from './betting-hostories.component';

describe('BettingHostoriesComponent', () => {
  let component: BettingHostoriesComponent;
  let fixture: ComponentFixture<BettingHostoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BettingHostoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BettingHostoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

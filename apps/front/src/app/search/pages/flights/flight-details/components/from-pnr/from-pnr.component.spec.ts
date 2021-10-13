import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FromPnrComponent } from './from-pnr.component';

describe('FromPnrComponent', () => {
  let component: FromPnrComponent;
  let fixture: ComponentFixture<FromPnrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FromPnrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FromPnrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
